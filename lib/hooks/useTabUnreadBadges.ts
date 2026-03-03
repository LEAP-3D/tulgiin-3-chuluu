import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

type Params = {
  apiBaseUrl: string;
  isLoaded: boolean;
  isSignedIn: boolean;
  email: string;
  userId?: string;
  sessionToken?: string;
  profileId: string | null;
  profileRole: "user" | "worker" | null;
  pathname: string;
};

type Result = {
  hasUnreadOrder: boolean;
  hasUnreadZurwas: boolean;
};

export function useTabUnreadBadges({
  apiBaseUrl,
  isLoaded,
  isSignedIn,
  email,
  userId,
  sessionToken,
  profileId,
  profileRole,
  pathname,
}: Params): Result {
  const [hasUnreadOrder, setHasUnreadOrder] = useState(false);
  const [hasUnreadZurwas, setHasUnreadZurwas] = useState(false);
  const knownOrderIdsRef = useRef<Set<string> | null>(null);
  const knownOrderStatusRef = useRef<Record<string, string | null>>({});
  const orderScopeRef = useRef<string | null>(null);

  useEffect(() => {
    if (pathname.startsWith("/order")) {
      setHasUnreadOrder(false);
    }
  }, [pathname]);

  useEffect(() => {
    knownOrderIdsRef.current = null;
    knownOrderStatusRef.current = {};
    orderScopeRef.current = null;
    setHasUnreadOrder(false);
    setHasUnreadZurwas(false);
  }, [userId]);

  useEffect(() => {
    knownOrderIdsRef.current = null;
    knownOrderStatusRef.current = {};
    orderScopeRef.current = null;
    setHasUnreadOrder(false);
  }, [email, profileRole]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !email) return;

    let cancelled = false;

    const refreshBadges = async () => {
      try {
        const authHeader = sessionToken
          ? { Authorization: `Bearer ${sessionToken}` }
          : {};

        if (profileRole) {
          let orderUrl = `${apiBaseUrl}/orders?email=${encodeURIComponent(email)}`;
          if (profileRole === "worker") {
            orderUrl = `${apiBaseUrl}/orders?worker_email=${encodeURIComponent(email)}`;
          }

          const ordersResponse = await fetch(orderUrl, { headers: authHeader });
          const ordersPayload = await ordersResponse.json().catch(() => null);
          const orderRows = Array.isArray(ordersPayload?.data) ? ordersPayload.data : [];
          const nextIds = new Set(
            orderRows
              .map((item: { id?: unknown }) =>
                typeof item?.id === "string" ? item.id : null,
              )
              .filter((id: string | null): id is string => !!id),
          );
          const nextStatusById: Record<string, string | null> = {};
          orderRows.forEach((item: { id?: unknown; status?: unknown }) => {
            if (typeof item?.id !== "string") return;
            nextStatusById[item.id] =
              typeof item.status === "string" ? item.status : null;
          });

          const currentScope = `${profileRole}:${email}`;
          const isNewScope = orderScopeRef.current !== currentScope;
          orderScopeRef.current = currentScope;

          const knownIds = knownOrderIdsRef.current;
          if (!isNewScope && knownIds) {
            const hasStatusChange = Object.entries(nextStatusById).some(
              ([id, status]) =>
                id in knownOrderStatusRef.current &&
                knownOrderStatusRef.current[id] !== status,
            );
            if (hasStatusChange && !pathname.startsWith("/order")) {
              setHasUnreadOrder(true);
            }
          }
          knownOrderIdsRef.current = nextIds;
          knownOrderStatusRef.current = nextStatusById;
        }

        if (!profileId) return;

        const { data: conversations, error: convError } = await supabase
          .from("conversations")
          .select("id")
          .or(`user_profile_id.eq.${profileId},worker_profile_id.eq.${profileId}`)
          .limit(200);

        if (convError) throw convError;

        const conversationIds = (conversations ?? [])
          .map((item: { id?: unknown }) =>
            typeof item?.id === "string" ? item.id : null,
          )
          .filter((id: string | null): id is string => !!id);

        if (conversationIds.length === 0) {
          if (!cancelled) setHasUnreadZurwas(false);
          return;
        }

        const { data: unreadRows, error: unreadError } = await supabase
          .from("messages")
          .select("id")
          .in("conversation_id", conversationIds)
          .neq("sender_profile_id", profileId)
          .is("read_at", null)
          .limit(1);

        if (unreadError) throw unreadError;
        if (!cancelled) {
          setHasUnreadZurwas((unreadRows?.length ?? 0) > 0);
        }
      } catch {
        // keep silent to avoid UI interruption
      }
    };

    void refreshBadges();
    const realtimeChannels: Array<ReturnType<typeof supabase.channel>> = [];

    if (profileId && profileRole) {
      const filterField =
        profileRole === "worker" ? "worker_profile_id" : "user_profile_id";
      const orderChannel = supabase
        .channel(`tab-badge-orders-${profileRole}-${profileId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "orders",
            filter: `${filterField}=eq.${profileId}`,
          },
          (payload) => {
            const eventType = payload.eventType;
            if (!pathname.startsWith("/order")) {
              if (eventType === "INSERT") {
                setHasUnreadOrder(true);
              }
              if (eventType === "UPDATE") {
                const nextStatus =
                  typeof (payload.new as { status?: unknown })?.status === "string"
                    ? ((payload.new as { status?: string }).status ?? null)
                    : null;
                const prevStatus =
                  typeof (payload.old as { status?: unknown })?.status === "string"
                    ? ((payload.old as { status?: string }).status ?? null)
                    : null;
                if (nextStatus !== prevStatus) {
                  setHasUnreadOrder(true);
                }
              }
            }
            void refreshBadges();
          },
        )
        .subscribe();
      realtimeChannels.push(orderChannel);

      const convoUserChannel = supabase
        .channel(`tab-badge-conversations-user-${profileId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "conversations",
            filter: `user_profile_id=eq.${profileId}`,
          },
          () => {
            void refreshBadges();
          },
        )
        .subscribe();
      realtimeChannels.push(convoUserChannel);

      const convoWorkerChannel = supabase
        .channel(`tab-badge-conversations-worker-${profileId}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "conversations",
            filter: `worker_profile_id=eq.${profileId}`,
          },
          () => {
            void refreshBadges();
          },
        )
        .subscribe();
      realtimeChannels.push(convoWorkerChannel);

      const messageChannel = supabase
        .channel(`tab-badge-messages-${profileId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
          },
          (payload) => {
            const senderProfileId = (payload.new as { sender_profile_id?: unknown })
              ?.sender_profile_id;
            if (
              typeof senderProfileId === "string" &&
              senderProfileId !== profileId &&
              !pathname.startsWith("/zurwas")
            ) {
              setHasUnreadZurwas(true);
            }
            void refreshBadges();
          },
        )
        .subscribe();
      realtimeChannels.push(messageChannel);
    }

    const intervalId = setInterval(() => {
      void refreshBadges();
    }, 5000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
      realtimeChannels.forEach((channel) => {
        supabase.removeChannel(channel);
      });
    };
  }, [
    apiBaseUrl,
    email,
    isLoaded,
    isSignedIn,
    pathname,
    profileId,
    profileRole,
    sessionToken,
  ]);

  return { hasUnreadOrder, hasUnreadZurwas };
}

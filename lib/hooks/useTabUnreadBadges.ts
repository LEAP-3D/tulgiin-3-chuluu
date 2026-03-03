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

  useEffect(() => {
    if (pathname.startsWith("/order")) {
      setHasUnreadOrder(false);
    }
  }, [pathname]);

  useEffect(() => {
    knownOrderIdsRef.current = null;
    setHasUnreadOrder(false);
    setHasUnreadZurwas(false);
  }, [userId]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !email) return;

    let cancelled = false;

    const refreshBadges = async () => {
      try {
        const authHeader = sessionToken
          ? { Authorization: `Bearer ${sessionToken}` }
          : {};

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

        const knownIds = knownOrderIdsRef.current;
        if (knownIds) {
          const hasNewOrder = Array.from(nextIds).some((id) => !knownIds.has(id));
          if (hasNewOrder && !pathname.startsWith("/order")) {
            setHasUnreadOrder(true);
          }
        }
        knownOrderIdsRef.current = nextIds;

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
    const intervalId = setInterval(() => {
      void refreshBadges();
    }, 12000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
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

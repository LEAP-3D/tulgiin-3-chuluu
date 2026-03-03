import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { ConversationItem, MessageItem, ProfileInfo } from "./types";

type Params = {
  isLoaded: boolean;
  profileId: string | null;
  orderId?: string | null;
};

type ConversationListState = {
  conversations: ConversationItem[];
  lastMessages: Record<string, MessageItem | undefined>;
  profileMap: Record<string, ProfileInfo | undefined>;
  isLoading: boolean;
  errorMessage: string | null;
};

export function useConversationList({
  isLoaded,
  profileId,
  orderId,
}: Params): ConversationListState {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [lastMessages, setLastMessages] = useState<
    Record<string, MessageItem | undefined>
  >({});
  const [profileMap, setProfileMap] = useState<
    Record<string, ProfileInfo | undefined>
  >({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isMountedRef = useRef(true);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadConversations = useCallback(
    async (options?: { silent?: boolean }) => {
      if (!isLoaded || !profileId || orderId) return;
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      if (!options?.silent && isMountedRef.current) {
        setIsLoading(true);
        setErrorMessage(null);
      }

      try {
        const { data, error } = await supabase
          .from("conversations")
          .select(
            "id, order_id, user_profile_id, worker_profile_id, last_message_at, created_at",
          )
          .or(`user_profile_id.eq.${profileId},worker_profile_id.eq.${profileId}`)
          .order("last_message_at", { ascending: false, nullsFirst: false })
          .order("created_at", { ascending: false })
          .limit(50);

        if (error) throw error;

        const list = Array.isArray(data) ? data : [];
        if (isMountedRef.current) {
          setConversations(list as ConversationItem[]);
        }

        const otherProfileIds = Array.from(
          new Set(
            list
              .map((item) =>
                item.user_profile_id === profileId
                  ? item.worker_profile_id
                  : item.user_profile_id,
              )
              .filter(Boolean),
          ),
        );

        if (otherProfileIds.length > 0) {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .in("id", otherProfileIds);

          if (profileError) throw profileError;

          const map: Record<string, ProfileInfo> = {};
          (profileData ?? []).forEach((profile) => {
            const firstName = profile.first_name ?? "";
            const lastName = profile.last_name ?? "";
            const name = `${firstName} ${lastName}`.trim() || "Нэргүй";
            map[String(profile.id)] = {
              id: String(profile.id),
              name,
              role: profile.role === "worker" ? "worker" : "user",
              workTypes: Array.isArray(profile.work_types)
                ? profile.work_types.filter(Boolean).map(String)
                : [],
              avatarUrl:
                typeof profile.profile_url === "string"
                  ? profile.profile_url
                  : typeof profile.avatar_url === "string"
                    ? profile.avatar_url
                    : null,
            };
          });
          if (isMountedRef.current) {
            setProfileMap(map);
          }
        } else if (isMountedRef.current) {
          setProfileMap({});
        }

        const conversationIds = list.map((item) => item.id).filter(Boolean);
        if (conversationIds.length === 0) {
          if (isMountedRef.current) setLastMessages({});
          return;
        }

        const { data: messageData, error: messageError } = await supabase
          .from("messages")
          .select(
            "id, conversation_id, body, sender_profile_id, created_at, read_at",
          )
          .in("conversation_id", conversationIds)
          .order("created_at", { ascending: false });

        if (messageError) throw messageError;

        const latestByConversation: Record<string, MessageItem> = {};
        (messageData ?? []).forEach((message) => {
          const conversationKey = message.conversation_id ?? "";
          if (!conversationKey) return;
          if (!latestByConversation[conversationKey]) {
            latestByConversation[conversationKey] = message as MessageItem;
          }
        });

        if (isMountedRef.current) {
          setLastMessages(latestByConversation);
        }
      } catch (err) {
        if (isMountedRef.current && !options?.silent) {
          setErrorMessage(
            err instanceof Error
              ? err.message
              : "Зурвас татах үед алдаа гарлаа.",
          );
        }
      } finally {
        if (isMountedRef.current && !options?.silent) {
          setIsLoading(false);
        }
        isFetchingRef.current = false;
      }
    },
    [isLoaded, orderId, profileId],
  );

  useEffect(() => {
    if (!isLoaded || !profileId || orderId) return;
    void loadConversations();
  }, [isLoaded, orderId, profileId, loadConversations]);

  useEffect(() => {
    if (!isLoaded || !profileId || orderId) return;
    let refreshTimer: ReturnType<typeof setTimeout> | null = null;
    const scheduleRefresh = () => {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }
      refreshTimer = setTimeout(() => {
        void loadConversations({ silent: true });
      }, 220);
    };

    const convoUserChannel = supabase
      .channel(`zurwas-list-conversations-user-${profileId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
          filter: `user_profile_id=eq.${profileId}`,
        },
        scheduleRefresh,
      )
      .subscribe();

    const convoWorkerChannel = supabase
      .channel(`zurwas-list-conversations-worker-${profileId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
          filter: `worker_profile_id=eq.${profileId}`,
        },
        scheduleRefresh,
      )
      .subscribe();

    const messageChannel = supabase
      .channel(`zurwas-list-messages-${profileId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        scheduleRefresh,
      )
      .subscribe();

    const intervalId = setInterval(() => {
      void loadConversations({ silent: true });
    }, 5000);

    return () => {
      if (refreshTimer) {
        clearTimeout(refreshTimer);
      }
      clearInterval(intervalId);
      supabase.removeChannel(convoUserChannel);
      supabase.removeChannel(convoWorkerChannel);
      supabase.removeChannel(messageChannel);
    };
  }, [isLoaded, orderId, profileId, loadConversations]);

  return {
    conversations,
    lastMessages,
    profileMap,
    isLoading,
    errorMessage,
  };
}

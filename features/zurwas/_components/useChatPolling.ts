import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { MESSAGE_POLL_INTERVAL_MS } from "./constants";
import type { MessageItem } from "./types";

type Params = {
  conversationId: string | null;
  profileId: string | null;
  messages: MessageItem[];
  setMessages: React.Dispatch<React.SetStateAction<MessageItem[]>>;
  markConversationRead: (targetConversationId: string) => Promise<void>;
};

export function useChatPolling({
  conversationId,
  profileId,
  messages,
  setMessages,
  markConversationRead,
}: Params) {
  const messagesRef = useRef<MessageItem[]>([]);
  const pollingRef = useRef(false);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (!conversationId || !profileId) return;
    let cancelled = false;

    const pollForMessages = async () => {
      if (cancelled || pollingRef.current) return;
      pollingRef.current = true;
      try {
        const currentMessages = messagesRef.current;
        const lastMessage = currentMessages[currentMessages.length - 1];
        let query = supabase
          .from("messages")
          .select("id, body, sender_profile_id, created_at, read_at")
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true });

        if (lastMessage?.created_at) {
          query = query.gte("created_at", lastMessage.created_at);
        }

        const { data, error } = await query;
        if (error) return;

        const incoming = Array.isArray(data) ? (data as MessageItem[]) : [];
        if (incoming.length === 0) return;

        setMessages((prev) => {
          const knownIds = new Set(prev.map((item) => item.id));
          const next = [...prev];
          incoming.forEach((message) => {
            if (!knownIds.has(message.id)) {
              next.push(message);
            }
          });
          return next;
        });

        if (incoming.some((item) => item.sender_profile_id !== profileId)) {
          void markConversationRead(conversationId);
        }
      } finally {
        pollingRef.current = false;
      }
    };

    const timer = setInterval(pollForMessages, MESSAGE_POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [conversationId, profileId, markConversationRead, setMessages]);
}

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { TYPING_HIDE_DELAY_MS } from "./constants";
import type { MessageItem, TypingPayload } from "./types";

type Params = {
  conversationId: string | null;
  profileId: string | null;
  setMessages: React.Dispatch<React.SetStateAction<MessageItem[]>>;
  markConversationRead: (targetConversationId: string) => Promise<void>;
};

type ChatRealtimeState = {
  isOtherTyping: boolean;
  sendTypingEvent: (isTyping: boolean) => void;
  channelRef: React.MutableRefObject<ReturnType<typeof supabase.channel> | null>;
};

export function useChatRealtime({
  conversationId,
  profileId,
  setMessages,
  markConversationRead,
}: Params): ChatRealtimeState {
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sendTypingEvent = (isTyping: boolean) => {
    const channel = channelRef.current;
    if (!channel || !profileId || !conversationId) return;
    void channel.send({
      type: "broadcast",
      event: "typing",
      payload: {
        sender_profile_id: profileId,
        is_typing: isTyping,
        conversation_id: conversationId,
      },
    });
  };

  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`conversation-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const row = payload.new as MessageItem;
          setMessages((prev) => {
            if (prev.some((item) => item.id === row.id)) return prev;
            return [...prev, row];
          });
          if (row.sender_profile_id !== profileId) {
            setIsOtherTyping(false);
            if (typingTimeoutRef.current) {
              clearTimeout(typingTimeoutRef.current);
              typingTimeoutRef.current = null;
            }
            void markConversationRead(conversationId);
          }
        },
      )
      .on("broadcast", { event: "typing" }, (payload) => {
        const data =
          (payload as { payload?: TypingPayload }).payload ??
          (payload as TypingPayload);
        if (!data || data.sender_profile_id === profileId) return;

        if (data.is_typing) {
          setIsOtherTyping(true);
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }
          typingTimeoutRef.current = setTimeout(() => {
            setIsOtherTyping(false);
          }, TYPING_HIDE_DELAY_MS);
        } else {
          setIsOtherTyping(false);
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
          }
        }
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      channelRef.current = null;
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      if (profileId) {
        void channel.send({
          type: "broadcast",
          event: "typing",
          payload: {
            sender_profile_id: profileId,
            is_typing: false,
            conversation_id: conversationId,
          },
        });
      }
      supabase.removeChannel(channel);
    };
  }, [conversationId, profileId, setMessages, markConversationRead]);

  return { isOtherTyping, sendTypingEvent, channelRef };
}

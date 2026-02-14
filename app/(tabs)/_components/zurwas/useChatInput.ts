import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { TYPING_IDLE_MS, TYPING_THROTTLE_MS } from "./constants";
import type { MessageItem } from "./types";

type Params = {
  conversationId: string | null;
  profileId: string | null;
  sendTypingEvent: (isTyping: boolean) => void;
  setMessages: React.Dispatch<React.SetStateAction<MessageItem[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
};

type ChatInputState = {
  messageInput: string;
  isSending: boolean;
  handleInputChange: (text: string) => void;
  handleSend: () => Promise<void>;
};

export function useChatInput({
  conversationId,
  profileId,
  sendTypingEvent,
  setMessages,
  setErrorMessage,
}: Params): ChatInputState {
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const typingStopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTypingSentRef = useRef(0);

  useEffect(() => {
    return () => {
      if (typingStopTimeoutRef.current) {
        clearTimeout(typingStopTimeoutRef.current);
        typingStopTimeoutRef.current = null;
      }
    };
  }, []);

  const handleInputChange = (text: string) => {
    setMessageInput(text);
    if (!conversationId || !profileId) return;

    const trimmed = text.trim();
    if (trimmed.length === 0) {
      if (typingStopTimeoutRef.current) {
        clearTimeout(typingStopTimeoutRef.current);
        typingStopTimeoutRef.current = null;
      }
      sendTypingEvent(false);
      return;
    }

    const now = Date.now();
    if (now - lastTypingSentRef.current > TYPING_THROTTLE_MS) {
      sendTypingEvent(true);
      lastTypingSentRef.current = now;
    }

    if (typingStopTimeoutRef.current) {
      clearTimeout(typingStopTimeoutRef.current);
    }
    typingStopTimeoutRef.current = setTimeout(() => {
      sendTypingEvent(false);
    }, TYPING_IDLE_MS);
  };

  const handleSend = async () => {
    const text = messageInput.trim();
    if (!text || !conversationId || !profileId) return;
    setIsSending(true);
    setErrorMessage(null);
    try {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          sender_profile_id: profileId,
          body: text,
        })
        .select("id, body, sender_profile_id, created_at, read_at")
        .single();

      if (error) throw error;

      if (data) {
        setMessages((prev) =>
          prev.some((item) => item.id === data.id) ? prev : [...prev, data],
        );
      }

      setMessageInput("");
      sendTypingEvent(false);
      if (typingStopTimeoutRef.current) {
        clearTimeout(typingStopTimeoutRef.current);
        typingStopTimeoutRef.current = null;
      }
      await supabase
        .from("conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", conversationId);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Илгээх үед алдаа гарлаа.",
      );
    } finally {
      setIsSending(false);
    }
  };

  return {
    messageInput,
    isSending,
    handleInputChange,
    handleSend,
  };
}

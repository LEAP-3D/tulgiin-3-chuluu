import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { MessageItem } from "./types";

type Params = {
  isLoaded: boolean;
  orderId: string | null;
  profileId: string | null;
  userProfileIdParam?: string | null;
  workerProfileIdParam?: string | null;
};

type ConversationThreadState = {
  conversationId: string | null;
  messages: MessageItem[];
  setMessages: React.Dispatch<React.SetStateAction<MessageItem[]>>;
  isLoading: boolean;
  errorMessage: string | null;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
  markConversationRead: (targetConversationId: string) => Promise<void>;
};

export function useConversationThread({
  isLoaded,
  orderId,
  profileId,
  userProfileIdParam,
  workerProfileIdParam,
}: Params): ConversationThreadState {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const markConversationRead = useCallback(
    async (targetConversationId: string) => {
      if (!profileId) return;
      await supabase
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .eq("conversation_id", targetConversationId)
        .is("read_at", null)
        .neq("sender_profile_id", profileId);
    },
    [profileId],
  );

  useEffect(() => {
    if (!isLoaded || !orderId || !profileId) return;

    let cancelled = false;
    const loadConversation = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        let userProfileId = userProfileIdParam ?? "";
        let workerProfileId = workerProfileIdParam ?? "";

        if (!userProfileId || !workerProfileId) {
          const { data: orderData, error: orderError } = await supabase
            .from("orders")
            .select("user_profile_id, worker_profile_id")
            .eq("id", orderId)
            .single();

          if (orderError) {
            throw new Error(orderError.message);
          }
          userProfileId = orderData?.user_profile_id ?? "";
          workerProfileId = orderData?.worker_profile_id ?? "";
        }

        if (!userProfileId || !workerProfileId) {
          throw new Error("Захиалгын талууд олдсонгүй.");
        }

        const { data: existing, error: existingError } = await supabase
          .from("conversations")
          .select("id")
          .eq("order_id", orderId)
          .maybeSingle();

        if (existingError) {
          throw new Error(existingError.message);
        }

        let resolvedConversationId = existing?.id ?? null;
        if (!resolvedConversationId) {
          const { data: created, error: createError } = await supabase
            .from("conversations")
            .insert({
              order_id: orderId,
              user_profile_id: userProfileId,
              worker_profile_id: workerProfileId,
            })
            .select("id")
            .single();

          if (createError) {
            throw new Error(createError.message);
          }
          resolvedConversationId = created?.id ?? null;
        }

        if (!resolvedConversationId) {
          throw new Error("Зурвас үүсгэж чадсангүй.");
        }

        const { data: messageData, error: messageError } = await supabase
          .from("messages")
          .select("id, body, sender_profile_id, created_at, read_at")
          .eq("conversation_id", resolvedConversationId)
          .order("created_at", { ascending: true });

        if (messageError) {
          throw new Error(messageError.message);
        }

        if (!cancelled) {
          setConversationId(resolvedConversationId);
          setMessages(Array.isArray(messageData) ? messageData : []);
        }

        await markConversationRead(resolvedConversationId);
      } catch (err) {
        if (!cancelled) {
          setErrorMessage(
            err instanceof Error
              ? err.message
              : "Зурвас татах үед алдаа гарлаа.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadConversation();
    return () => {
      cancelled = true;
    };
  }, [
    isLoaded,
    orderId,
    profileId,
    userProfileIdParam,
    workerProfileIdParam,
    markConversationRead,
  ]);

  return {
    conversationId,
    messages,
    setMessages,
    isLoading,
    errorMessage,
    setErrorMessage,
    markConversationRead,
  };
}

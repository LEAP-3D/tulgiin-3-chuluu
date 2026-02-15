import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { MessageItem, ProfileInfo } from "./types";

type Params = {
  isLoaded: boolean;
  orderId: string | null;
  profileId: string | null;
  userProfileIdParam?: string | null;
  workerProfileIdParam?: string | null;
};

type ConversationThreadState = {
  conversationId: string | null;
  otherProfileId: string | null;
  otherProfile: ProfileInfo | null;
  messages: MessageItem[];
  setMessages: React.Dispatch<React.SetStateAction<MessageItem[]>>;
  isLoading: boolean;
  errorMessage: string | null;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
  markConversationRead: (targetConversationId: string) => Promise<void>;
};

const toProfileInfo = (profile: {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  role?: string | null;
  work_types?: unknown;
  avatar_url?: string | null;
}): ProfileInfo => {
  const firstName = profile.first_name ?? "";
  const lastName = profile.last_name ?? "";
  const name = `${firstName} ${lastName}`.trim() || "Нэргүй";
  return {
    id: String(profile.id),
    name,
    role: profile.role === "worker" ? "worker" : "user",
    workTypes: Array.isArray(profile.work_types)
      ? profile.work_types.filter(Boolean).map(String)
      : [],
    avatarUrl: typeof profile.avatar_url === "string" ? profile.avatar_url : null,
  };
};

const fetchProfileInfo = async (profileId: string) => {
  const withAvatar = "id, first_name, last_name, role, work_types, avatar_url";
  const withoutAvatar = "id, first_name, last_name, role, work_types";

  const { data, error } = await supabase
    .from("profiles")
    .select(withAvatar)
    .eq("id", profileId)
    .maybeSingle();

  if (error?.message?.includes("avatar_url")) {
    const { data: fallback, error: fallbackError } = await supabase
      .from("profiles")
      .select(withoutAvatar)
      .eq("id", profileId)
      .maybeSingle();

    if (fallbackError) {
      throw new Error(fallbackError.message);
    }
    return fallback ? toProfileInfo(fallback) : null;
  }

  if (error) {
    throw new Error(error.message);
  }

  return data ? toProfileInfo(data) : null;
};

export function useConversationThread({
  isLoaded,
  orderId,
  profileId,
  userProfileIdParam,
  workerProfileIdParam,
}: Params): ConversationThreadState {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [otherProfileId, setOtherProfileId] = useState<string | null>(null);
  const [otherProfile, setOtherProfile] = useState<ProfileInfo | null>(null);
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

        const resolvedOtherProfileId =
          profileId === userProfileId ? workerProfileId : userProfileId;
        if (resolvedOtherProfileId) {
          const profileInfo = await fetchProfileInfo(resolvedOtherProfileId);
          if (!cancelled) {
            setOtherProfileId(resolvedOtherProfileId);
            setOtherProfile(profileInfo);
          }
        } else if (!cancelled) {
          setOtherProfileId(null);
          setOtherProfile(null);
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
    otherProfileId,
    otherProfile,
    messages,
    setMessages,
    isLoading,
    errorMessage,
    setErrorMessage,
    markConversationRead,
  };
}

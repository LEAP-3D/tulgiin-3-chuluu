import { Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSupabaseAuth } from "@/lib/supabase-auth";
import { ChatView } from "@/features/zurwas/_components/ChatView";
import { ConversationListView } from "@/features/zurwas/_components/ConversationListView";
import { styles } from "@/features/zurwas/_components/styles";
import { getParam, getProfessionLabel } from "@/features/zurwas/_components/utils";
import { useConversationList } from "@/features/zurwas/_components/useConversationList";
import { useConversationThread } from "@/features/zurwas/_components/useConversationThread";
import { useChatRealtime } from "@/features/zurwas/_components/useChatRealtime";
import { useChatPolling } from "@/features/zurwas/_components/useChatPolling";
import { useChatInput } from "@/features/zurwas/_components/useChatInput";

export default function ZurwasScreen() {
  const router = useRouter();
  const { isLoaded, user } = useSupabaseAuth();
  const params = useLocalSearchParams();
  const orderId = getParam(params.orderId as string | string[] | undefined);
  const userProfileIdParam = getParam(
    params.userProfileId as string | string[] | undefined,
  );
  const workerProfileIdParam = getParam(
    params.workerProfileId as string | string[] | undefined,
  );
  const profileId = user?.id ?? null;
  const isChatReady = !!orderId && !!profileId;

  const listState = useConversationList({ isLoaded, profileId, orderId });

  const threadState = useConversationThread({
    isLoaded,
    orderId: orderId ?? null,
    profileId,
    userProfileIdParam: userProfileIdParam ?? null,
    workerProfileIdParam: workerProfileIdParam ?? null,
  });

  const { isOtherTyping, sendTypingEvent } = useChatRealtime({
    conversationId: threadState.conversationId,
    profileId,
    setMessages: threadState.setMessages,
    markConversationRead: threadState.markConversationRead,
  });

  useChatPolling({
    conversationId: threadState.conversationId,
    profileId,
    messages: threadState.messages,
    setMessages: threadState.setMessages,
    markConversationRead: threadState.markConversationRead,
  });

  const { messageInput, isSending, handleInputChange, handleSend } = useChatInput({
    conversationId: threadState.conversationId,
    profileId,
    sendTypingEvent,
    setMessages: threadState.setMessages,
    setErrorMessage: threadState.setErrorMessage,
  });

  if (!orderId) {
    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Зурвас</Text>
        </View>
        <ConversationListView
          conversations={listState.conversations}
          lastMessages={listState.lastMessages}
          profileMap={listState.profileMap}
          profileId={profileId}
          isLoading={listState.isLoading}
          errorMessage={listState.errorMessage}
          onSelectConversation={(conversation) =>
            router.push({
              pathname: "/(tabs)/zurwas",
              params: {
                orderId: conversation.order_id,
                userProfileId: conversation.user_profile_id,
                workerProfileId: conversation.worker_profile_id,
              },
            })
          }
        />
      </View>
    );
  }

  const otherProfileId = threadState.otherProfileId;
  const otherProfile = threadState.otherProfile;
  const headerTitle =
    otherProfile?.name ?? `Чат • ${otherProfileId?.slice(0, 6) ?? "—"}`;
  const headerSubtitle = otherProfile
    ? getProfessionLabel(otherProfile)
    : undefined;
  const headerMeta = orderId ? `Захиалга: ${orderId}` : undefined;
  const headerAvatarUrl = otherProfile?.avatarUrl ?? null;

  return (
    <ChatView
      headerTitle={headerTitle}
      headerSubtitle={headerSubtitle}
      headerMeta={headerMeta}
      headerAvatarUrl={headerAvatarUrl}
      orderIdToCopy={orderId ?? undefined}
      messages={threadState.messages}
      profileId={profileId}
      isLoading={threadState.isLoading}
      errorMessage={threadState.errorMessage}
      isOtherTyping={isOtherTyping}
      messageInput={messageInput}
      isSending={isSending}
      isChatReady={isChatReady}
      onBack={() => router.replace("/(tabs)/zurwas")}
      onInputChange={handleInputChange}
      onInputBlur={() => sendTypingEvent(false)}
      onSend={handleSend}
    />
  );
}

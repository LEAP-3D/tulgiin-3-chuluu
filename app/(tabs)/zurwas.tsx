import { Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSupabaseAuth } from "@/lib/supabase-auth";
import { ChatView } from "./_components/zurwas/ChatView";
import { ConversationListView } from "./_components/zurwas/ConversationListView";
import { styles } from "./_components/zurwas/styles";
import { getParam } from "./_components/zurwas/utils";
import { useConversationList } from "./_components/zurwas/useConversationList";
import { useConversationThread } from "./_components/zurwas/useConversationThread";
import { useChatRealtime } from "./_components/zurwas/useChatRealtime";
import { useChatPolling } from "./_components/zurwas/useChatPolling";
import { useChatInput } from "./_components/zurwas/useChatInput";

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

  return (
    <ChatView
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

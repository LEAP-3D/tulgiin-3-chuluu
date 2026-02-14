import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import LeftArrowIcon from "@/components/icons/_serviceIcons/leftarrowIcon";
import type { MessageItem } from "./types";
import { formatTime } from "./utils";
import { styles } from "./styles";

type Props = {
  messages: MessageItem[];
  profileId: string | null;
  isLoading: boolean;
  errorMessage: string | null;
  isOtherTyping: boolean;
  messageInput: string;
  isSending: boolean;
  isChatReady: boolean;
  onBack: () => void;
  onInputChange: (text: string) => void;
  onInputBlur: () => void;
  onSend: () => void;
};

export function ChatView({
  messages,
  profileId,
  isLoading,
  errorMessage,
  isOtherTyping,
  messageInput,
  isSending,
  isChatReady,
  onBack,
  onInputChange,
  onInputBlur,
  onSend,
}: Props) {
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.headerRow}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <LeftArrowIcon width={22} height={22} color="#1F1F1F" />
        </Pressable>
        <Text style={styles.title}>Зурвас</Text>
      </View>

      <View style={styles.chatContainer}>
        {isLoading ? (
          <Text style={styles.statusText}>Ачаалж байна...</Text>
        ) : errorMessage ? (
          <Text style={styles.statusText}>{errorMessage}</Text>
        ) : (
          <>
            <ScrollView
              contentContainerStyle={styles.messageList}
              keyboardShouldPersistTaps="handled"
            >
              {messages.length === 0 ? (
                <Text style={styles.emptyText}>Одоогоор зурвас алга.</Text>
              ) : (
                messages.map((message) => {
                  const isMine = message.sender_profile_id === profileId;
                  return (
                    <View
                      key={message.id}
                      style={[
                        styles.messageBubble,
                        isMine ? styles.myBubble : styles.otherBubble,
                      ]}
                    >
                      <Text
                        style={[
                          styles.messageText,
                          isMine ? styles.myText : styles.otherText,
                        ]}
                      >
                        {message.body}
                      </Text>
                      <Text style={styles.timeText}>
                        {formatTime(message.created_at)}
                      </Text>
                    </View>
                  );
                })
              )}
            </ScrollView>
            {isOtherTyping && <Text style={styles.typingText}>Typing...</Text>}
          </>
        )}
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Мессеж бичих..."
          placeholderTextColor="#9A9A9A"
          value={messageInput}
          onChangeText={onInputChange}
          editable={!isLoading && !!isChatReady}
          multiline
          onBlur={onInputBlur}
        />
        <Pressable
          style={({ pressed }) => [
            styles.sendButton,
            pressed && styles.sendButtonPressed,
            (!messageInput.trim() || isSending) && styles.sendButtonDisabled,
          ]}
          onPress={onSend}
          disabled={!messageInput.trim() || isSending || !isChatReady}
        >
          <Text style={styles.sendText}>Илгээх</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

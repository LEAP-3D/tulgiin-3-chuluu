import * as React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { styles } from "./styles";

type Props = {
  messageInput: string;
  isSending: boolean;
  isChatReady: boolean;
  isLoading: boolean;
  onInputChange: (text: string) => void;
  onInputFocus?: () => void;
  onInputBlur: () => void;
  onSend: () => void;
  bottomInset?: number;
};

export function ChatInputBar({
  messageInput,
  isSending,
  isChatReady,
  isLoading,
  onInputChange,
  onInputFocus,
  onInputBlur,
  onSend,
  bottomInset = 0,
}: Props) {
  return (
    <View style={[styles.inputRow, { paddingBottom: Math.max(bottomInset, 12) }]}>
      <TextInput
        style={styles.input}
        placeholder="Зурвас бичих..."
        placeholderTextColor="#9A9A9A"
        value={messageInput}
        onChangeText={onInputChange}
        editable={!isLoading && !!isChatReady}
        multiline
        onFocus={onInputFocus}
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
  );
}

import * as React from "react";
import {
  Animated,
  Keyboard,
  Platform,
  Text,
  View,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { MessageItem } from "./types";
import { ChatHeader } from "./ChatHeader";
import type { MessageListHandle } from "./MessageList";
import { MessageList } from "./MessageList";
import { ChatInputBar } from "./ChatInputBar";
import { styles } from "./styles";

type Props = {
  headerTitle: string;
  headerSubtitle?: string;
  headerMeta?: string;
  headerAvatarUrl?: string | null;
  orderIdToCopy?: string;
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
  headerTitle,
  headerSubtitle,
  headerMeta,
  headerAvatarUrl,
  orderIdToCopy,
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
  const insets = useSafeAreaInsets();
  const messageListRef = React.useRef<MessageListHandle>(null);
  const toastOpacity = React.useRef(new Animated.Value(0)).current;
  const toastTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = React.useState(false);
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);

  const showToast = React.useCallback(
    (message: string) => {
      setToastMessage(message);
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
        toastTimerRef.current = null;
      }
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }).start();
      toastTimerRef.current = setTimeout(() => {
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }).start(() => {
          setToastMessage(null);
        });
      }, 1400);
    },
    [toastOpacity],
  );

  const handleCopyOrderId = React.useCallback(async () => {
    if (!orderIdToCopy) return;
    try {
      await Clipboard.setStringAsync(orderIdToCopy);
      showToast("Захиалгын дугаарыг хууллаа.");
    } catch {
      showToast("Хуулахад алдаа гарлаа.");
    }
  }, [orderIdToCopy, showToast]);

  React.useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const showSub = Keyboard.addListener(showEvent, (event) => {
      setIsKeyboardVisible(true);
      setKeyboardHeight(event?.endCoordinates?.height ?? 0);
      requestAnimationFrame(() => messageListRef.current?.scrollToEnd(true));
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setIsKeyboardVisible(false);
      setKeyboardHeight(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const bottomInset = isKeyboardVisible ? 0 : insets.bottom;
  const keyboardOffset = isKeyboardVisible ? keyboardHeight : 0;

  return (
    <View style={styles.container}>
      <ChatHeader
        title={headerTitle}
        subtitle={headerSubtitle}
        meta={headerMeta}
        avatarUrl={headerAvatarUrl}
        onBack={onBack}
        onCopyOrderId={orderIdToCopy ? handleCopyOrderId : undefined}
        topInset={insets.top}
      />

      {toastMessage && (
        <Animated.View
          style={[
            styles.toastContainer,
            { opacity: toastOpacity, top: insets.top + 70 },
          ]}
          pointerEvents="none"
        >
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      )}

      <View style={styles.chatContainer}>
        <MessageList
          ref={messageListRef}
          messages={messages}
          profileId={profileId}
          isLoading={isLoading}
          errorMessage={errorMessage}
        />
        {isOtherTyping && (
          <View style={styles.typingOverlay} pointerEvents="none">
            <View style={styles.typingBubble}>
              <Text style={styles.typingText}>Бичиж байна...</Text>
            </View>
          </View>
        )}
      </View>

      <View style={{ marginBottom: keyboardOffset }}>
        <ChatInputBar
          messageInput={messageInput}
          isSending={isSending}
          isChatReady={isChatReady}
          isLoading={isLoading}
          onInputChange={onInputChange}
          onInputFocus={() => messageListRef.current?.scrollToEnd(true)}
          onInputBlur={onInputBlur}
          onSend={onSend}
          bottomInset={bottomInset}
        />
      </View>
    </View>
  );
}

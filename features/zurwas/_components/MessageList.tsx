import * as React from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  View,
} from "react-native";
import { MessageListSkeleton } from "@/components/ScreenSkeletons";
import type { MessageItem } from "./types";
import { formatTime } from "./utils";
import { styles } from "./styles";

export type MessageListHandle = {
  scrollToEnd: (animated?: boolean) => void;
};

type Props = {
  messages: MessageItem[];
  profileId: string | null;
  isLoading: boolean;
  errorMessage: string | null;
  isOtherTyping: boolean;
};

export const MessageList = React.forwardRef<MessageListHandle, Props>(
  ({ messages, profileId, isLoading, errorMessage, isOtherTyping }, ref) => {
    const listRef = React.useRef<FlatList<MessageItem>>(null);
    const isAtBottomRef = React.useRef(true);
    const didInitialScrollRef = React.useRef(false);

    const scrollToEnd = React.useCallback((animated = false) => {
      listRef.current?.scrollToEnd({ animated });
    }, []);

    React.useImperativeHandle(ref, () => ({ scrollToEnd }), [scrollToEnd]);

    const handleScroll = React.useCallback(
      (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { layoutMeasurement, contentOffset, contentSize } =
          event.nativeEvent;
        const paddingToBottom = 24;
        isAtBottomRef.current =
          layoutMeasurement.height + contentOffset.y >=
          contentSize.height - paddingToBottom;
      },
      [],
    );

    const handleContentSizeChange = React.useCallback(() => {
      if (!didInitialScrollRef.current && messages.length > 0) {
        requestAnimationFrame(() => {
          scrollToEnd(false);
          didInitialScrollRef.current = true;
        });
        return;
      }
      if (isAtBottomRef.current) {
        scrollToEnd(false);
      }
    }, [messages.length, scrollToEnd]);

    const handleLayout = React.useCallback(() => {
      if (!didInitialScrollRef.current && messages.length > 0) {
        requestAnimationFrame(() => {
          scrollToEnd(false);
          didInitialScrollRef.current = true;
        });
      }
    }, [messages.length, scrollToEnd]);

    const renderItem = React.useCallback(
      ({ item, index }: { item: MessageItem; index: number }) => {
        const isMine = item.sender_profile_id === profileId;
        const isLastMessage = index === messages.length - 1;
        const showRead = isMine && !!item.read_at && isLastMessage;
        return (
          <View
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
              {item.body}
            </Text>
            <View style={styles.messageMetaRow}>
              <Text style={styles.timeText}>{formatTime(item.created_at)}</Text>
              {showRead && <Text style={styles.readText}>Үзсэн</Text>}
            </View>
          </View>
        );
      },
      [messages.length, profileId],
    );

    if (isLoading) {
      return <MessageListSkeleton />;
    }

    if (errorMessage) {
      return <Text style={styles.statusText}>{errorMessage}</Text>;
    }

    return (
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.messageList}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Одоогоор зурвас алга.</Text>
        }
        ListFooterComponent={
          isOtherTyping ? (
            <View style={styles.typingFooter}>
              <View style={styles.typingBubble}>
                <Text style={styles.typingText}>Бичиж байна...</Text>
              </View>
            </View>
          ) : null
        }
        onContentSizeChange={handleContentSizeChange}
        onLayout={handleLayout}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      />
    );
  },
);

MessageList.displayName = "MessageList";

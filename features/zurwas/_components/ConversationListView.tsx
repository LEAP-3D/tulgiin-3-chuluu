import { FlatList, Pressable, Text, View } from "react-native";
import { MessageListSkeleton } from "@/components/ScreenSkeletons";
import type { ConversationItem, MessageItem, ProfileInfo } from "./types";
import { formatTime, getInitials, getProfessionLabel } from "./utils";
import { styles } from "./styles";

type Props = {
  conversations: ConversationItem[];
  lastMessages: Record<string, MessageItem | undefined>;
  profileMap: Record<string, ProfileInfo | undefined>;
  profileId: string | null;
  isLoading: boolean;
  errorMessage: string | null;
  onSelectConversation: (conversation: ConversationItem) => void;
};

export function ConversationListView({
  conversations,
  lastMessages,
  profileMap,
  profileId,
  isLoading,
  errorMessage,
  onSelectConversation,
}: Props) {
  if (isLoading) {
    return <MessageListSkeleton />;
  }

  if (errorMessage) {
    return <Text style={styles.statusText}>{errorMessage}</Text>;
  }

  if (conversations.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Одоогоор чат алга.</Text>
        <Text style={styles.emptyText}>
          Захиалгын дэлгэрэнгүй дээрх "Зурвас" товчоор чат эхлүүлнэ.
        </Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: ConversationItem }) => {
    const lastMessage = lastMessages[item.id];
    const otherParty =
      item.user_profile_id === profileId
        ? item.worker_profile_id
        : item.user_profile_id;
    const otherProfile = otherParty ? profileMap[otherParty] : undefined;
    const displayName =
      otherProfile?.name ?? `Чат • ${otherParty?.slice(0, 6) ?? "—"}`;
    const isUnread =
      !!lastMessage &&
      lastMessage.sender_profile_id !== profileId &&
      !lastMessage.read_at;
    return (
      <Pressable
        style={({ pressed }) => [
          styles.listItem,
          pressed && styles.listItemPressed,
        ]}
        onPress={() => onSelectConversation(item)}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(displayName)}</Text>
        </View>
        <View style={styles.listContent}>
          <View style={styles.listRow}>
            <View style={styles.listTitleRow}>
              <Text
                style={styles.listTitle}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {displayName}
              </Text>
              {isUnread && <View style={styles.unreadDot} />}
            </View>
            <Text style={styles.listTime}>
              {formatTime(lastMessage?.created_at ?? item.last_message_at)}
            </Text>
          </View>
          <Text style={styles.listRole}>
            {getProfessionLabel(otherProfile)}
          </Text>
          <Text
            style={[styles.listSubtitle, isUnread && styles.listSubtitleUnread]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {lastMessage?.body ?? "Шинэ чат"}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <FlatList
      data={conversations}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
    />
  );
}

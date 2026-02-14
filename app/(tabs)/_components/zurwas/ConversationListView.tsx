import { Pressable, ScrollView, Text, View } from "react-native";
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
    return <Text style={styles.statusText}>Ачаалж байна...</Text>;
  }

  if (errorMessage) {
    return <Text style={styles.statusText}>{errorMessage}</Text>;
  }

  if (conversations.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Одоогоор чат алга.</Text>
        <Text style={styles.emptyText}>
          Захиалгын дэлгэрэнгүй дээрх “Зурвас” товчоор чат эхлүүлнэ.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.listContainer}>
      {conversations.map((conversation) => {
        const lastMessage = lastMessages[conversation.id];
        const otherParty =
          conversation.user_profile_id === profileId
            ? conversation.worker_profile_id
            : conversation.user_profile_id;
        const otherProfile = otherParty ? profileMap[otherParty] : undefined;
        const displayName =
          otherProfile?.name ?? `Чат • ${otherParty?.slice(0, 6) ?? "—"}`;
        const isUnread =
          !!lastMessage &&
          lastMessage.sender_profile_id !== profileId &&
          !lastMessage.read_at;
        return (
          <Pressable
            key={conversation.id}
            style={({ pressed }) => [
              styles.listItem,
              pressed && styles.listItemPressed,
            ]}
            onPress={() => onSelectConversation(conversation)}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(displayName)}</Text>
            </View>
            <View style={styles.listContent}>
              <View style={styles.listRow}>
                <Text style={styles.listTitle}>{displayName}</Text>
                <Text style={styles.listTime}>
                  {formatTime(
                    lastMessage?.created_at ?? conversation.last_message_at,
                  )}
                </Text>
              </View>
              <Text style={styles.listRole}>{getProfessionLabel(otherProfile)}</Text>
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
      })}
    </ScrollView>
  );
}

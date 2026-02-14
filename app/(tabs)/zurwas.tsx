import { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSupabaseAuth } from "@/lib/supabase-auth";
import { supabase } from "@/lib/supabase";
import LeftArrowIcon from "@/components/icons/_serviceIcons/leftarrowIcon";

type ConversationItem = {
  id: string;
  order_id: string;
  user_profile_id: string;
  worker_profile_id: string;
  last_message_at?: string | null;
};

type ProfileInfo = {
  id: string;
  name: string;
  role: "user" | "worker";
  workTypes: string[];
};

type MessageItem = {
  id: string;
  body: string;
  sender_profile_id: string;
  created_at: string;
  conversation_id?: string;
  read_at?: string | null;
};

const getParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const formatTime = (value?: string | null) => {
  if (!value) return "--:--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--:--";
  return date.toLocaleTimeString("mn-MN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const serviceLabels: Record<string, string> = {
  electric: "Цахилгаан",
  plumbing: "Сантехник",
  lock: "Цоож, хаалга засвар",
  paint: "Будаг",
  carpenter: "Мужаан",
  clean: "Ариутгал",
  heat: "Халаалт",
  internet: "Интернет",
  ac: "Агааржуулалт",
  security: "Аюулгүй байдал",
  glass: "Шил, толь",
  furniture: "Тавилга",
  floor: "Шал",
  roof: "Дээвэр",
  moving: "Нүүлгэлт",
  garden: "Гадна талбай",
};

const getProfessionLabel = (profile?: ProfileInfo) => {
  if (!profile) return "Мэргэжилтэн";
  if (profile.role !== "worker") return "Хэрэглэгч";
  const firstSkill = profile.workTypes[0];
  if (!firstSkill) return "Мэргэжилтэн";
  return `${serviceLabels[firstSkill] ?? firstSkill} мэргэжилтэн`;
};

const getInitials = (name?: string) => {
  if (!name) return "👤";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "👤";
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return `${first}${last}`.toUpperCase();
};

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

  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [lastMessages, setLastMessages] = useState<
    Record<string, MessageItem | undefined>
  >({});
  const [profileMap, setProfileMap] = useState<
    Record<string, ProfileInfo | undefined>
  >({});
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isChatReady = useMemo(
    () => !!orderId && !!profileId,
    [orderId, profileId],
  );

  useEffect(() => {
    if (!isLoaded || !profileId || orderId) return;

    let cancelled = false;
    const loadConversations = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const { data, error } = await supabase
          .from("conversations")
          .select(
            "id, order_id, user_profile_id, worker_profile_id, last_message_at, created_at",
          )
          .or(`user_profile_id.eq.${profileId},worker_profile_id.eq.${profileId}`)
          .order("last_message_at", { ascending: false, nullsFirst: false })
          .order("created_at", { ascending: false })
          .limit(50);

        if (error) throw error;

        const list = Array.isArray(data) ? data : [];
        if (!cancelled) {
          setConversations(list as ConversationItem[]);
        }

        const otherProfileIds = Array.from(
          new Set(
            list
              .map((item) =>
                item.user_profile_id === profileId
                  ? item.worker_profile_id
                  : item.user_profile_id,
              )
              .filter(Boolean),
          ),
        );

        if (otherProfileIds.length > 0) {
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("id, first_name, last_name, role, work_types")
            .in("id", otherProfileIds);

          if (profileError) throw profileError;

          const map: Record<string, ProfileInfo> = {};
          (profileData ?? []).forEach((profile) => {
            const firstName = profile.first_name ?? "";
            const lastName = profile.last_name ?? "";
            const name = `${firstName} ${lastName}`.trim() || "Нэргүй";
            map[String(profile.id)] = {
              id: String(profile.id),
              name,
              role: profile.role === "worker" ? "worker" : "user",
              workTypes: Array.isArray(profile.work_types)
                ? profile.work_types.filter(Boolean).map(String)
                : [],
            };
          });
          if (!cancelled) {
            setProfileMap(map);
          }
        } else if (!cancelled) {
          setProfileMap({});
        }

        const conversationIds = list.map((item) => item.id).filter(Boolean);
        if (conversationIds.length === 0) {
          if (!cancelled) setLastMessages({});
          return;
        }

        const { data: messageData, error: messageError } = await supabase
          .from("messages")
          .select(
            "id, conversation_id, body, sender_profile_id, created_at, read_at",
          )
          .in("conversation_id", conversationIds)
          .order("created_at", { ascending: false });

        if (messageError) throw messageError;

        const latestByConversation: Record<string, MessageItem> = {};
        (messageData ?? []).forEach((message) => {
          const conversationKey = message.conversation_id ?? "";
          if (!conversationKey) return;
          if (!latestByConversation[conversationKey]) {
            latestByConversation[conversationKey] = message as MessageItem;
          }
        });

        if (!cancelled) {
          setLastMessages(latestByConversation);
        }
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

    loadConversations();
    return () => {
      cancelled = true;
    };
  }, [isLoaded, orderId, profileId]);

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

        await supabase
          .from("messages")
          .update({ read_at: new Date().toISOString() })
          .eq("conversation_id", resolvedConversationId)
          .is("read_at", null)
          .neq("sender_profile_id", profileId);
      } catch (err) {
        if (!cancelled) {
          setErrorMessage(
            err instanceof Error ? err.message : "Зурвас татах үед алдаа гарлаа.",
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
  }, [isLoaded, orderId, profileId, userProfileIdParam, workerProfileIdParam]);

  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const row = payload.new as MessageItem;
          setMessages((prev) => {
            if (prev.some((item) => item.id === row.id)) return prev;
            return [...prev, row];
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId]);

  const handleSend = async () => {
    const text = messageInput.trim();
    if (!text || !conversationId || !profileId) return;
    setIsSending(true);
    setErrorMessage(null);
    try {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          sender_profile_id: profileId,
          body: text,
        })
        .select("id, body, sender_profile_id, created_at, read_at")
        .single();

      if (error) throw error;

      if (data) {
        setMessages((prev) =>
          prev.some((item) => item.id === data.id) ? prev : [...prev, data],
        );
      }

      setMessageInput("");
      await supabase
        .from("conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", conversationId);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Илгээх үед алдаа гарлаа.",
      );
    } finally {
      setIsSending(false);
    }
  };

  if (!orderId) {
    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Зурвас</Text>
        </View>

        {isLoading ? (
          <Text style={styles.statusText}>Ачаалж байна...</Text>
        ) : errorMessage ? (
          <Text style={styles.statusText}>{errorMessage}</Text>
        ) : conversations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Одоогоор чат алга.</Text>
            <Text style={styles.emptyText}>
              Захиалгын дэлгэрэнгүй дээрх “Зурвас” товчоор чат эхлүүлнэ.
            </Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.listContainer}>
            {conversations.map((conversation) => {
              const lastMessage = lastMessages[conversation.id];
              const otherParty =
                conversation.user_profile_id === profileId
                  ? conversation.worker_profile_id
                  : conversation.user_profile_id;
              const otherProfile = otherParty
                ? profileMap[otherParty]
                : undefined;
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
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/zurwas",
                      params: {
                        orderId: conversation.order_id,
                        userProfileId: conversation.user_profile_id,
                        workerProfileId: conversation.worker_profile_id,
                      },
                    })
                  }
                >
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {getInitials(displayName)}
                    </Text>
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
                  <Text style={styles.listRole}>
                    {getProfessionLabel(otherProfile)}
                  </Text>
                  <Text
                    style={[
                      styles.listSubtitle,
                      isUnread && styles.listSubtitleUnread,
                    ]}
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
        )}
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.headerRow}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.replace("/(tabs)/zurwas")}
        >
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
        )}
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Мессеж бичих..."
          placeholderTextColor="#9A9A9A"
          value={messageInput}
          onChangeText={setMessageInput}
          editable={!isLoading && !!isChatReady}
          multiline
        />
        <Pressable
          style={({ pressed }) => [
            styles.sendButton,
            pressed && styles.sendButtonPressed,
            (!messageInput.trim() || isSending) && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!messageInput.trim() || isSending || !isChatReady}
        >
          <Text style={styles.sendText}>Илгээх</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
  },
  listItemPressed: {
    backgroundColor: "#FAFAFA",
  },
  listRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listContent: {
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FF8A1E",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  listTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F1F1F",
  },
  listRole: {
    marginTop: 2,
    fontSize: 12,
    color: "#9A9A9A",
  },
  listSubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "#7A7A7A",
  },
  listSubtitleUnread: {
    fontWeight: "700",
    color: "#1F1F1F",
  },
  listTime: {
    fontSize: 12,
    color: "#A3A3A3",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  backButton: {
    padding: 6,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F1F1F",
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  messageList: {
    paddingBottom: 12,
    gap: 10,
  },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  myBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#FF8A1E",
  },
  otherBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#F3F3F3",
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  myText: {
    color: "#FFFFFF",
  },
  otherText: {
    color: "#1F1F1F",
  },
  timeText: {
    marginTop: 4,
    fontSize: 11,
    color: "#B3B3B3",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#EFEFEF",
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    fontSize: 15,
    color: "#1F1F1F",
  },
  sendButton: {
    backgroundColor: "#1F1F1F",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  sendButtonPressed: {
    opacity: 0.85,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  statusText: {
    color: "#7A7A7A",
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
  },
  emptyText: {
    color: "#7A7A7A",
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
  },
});

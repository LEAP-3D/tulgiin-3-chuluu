import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { styles } from "./modal.styles";

type ChatMessage = {
  id: string;
  role: "user" | "bot";
  text: string;
};

const BOT_WELCOME =
  "Сайн байна уу. Би UB ZYRO AI туслах. Үйлчилгээ, захиалга, чаттай холбоотой асуултаа бичнэ үү.";

function getBotReply(input: string): string {
  const q = input.toLowerCase();
  if (q.includes("захиалга")) {
    return "Захиалга үүсгэхдээ үйлчилгээ сонгоод засварчин сонгосны дараа илгээх товч дээр дарна.";
  }
  if (q.includes("чат") || q.includes("зурвас")) {
    return "Зурвас хэсгээс тухайн захиалгаа нээгээд шууд чатлаж болно.";
  }
  if (q.includes("төлбөр") || q.includes("үнэ")) {
    return "Үнэ нь үйлчилгээ, яаралтай эсэх, байршлаас хамаарна. Захиалга дээр тодорхой мэдээлэл гарна.";
  }
  return "Ойлголоо. Энэ асуултад дэлгэрэнгүй тусламж хэрэгтэй бол захиалгын дугаар болон асуудлаа бичээрэй.";
}

export default function ModalScreen() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "bot", text: BOT_WELCOME },
  ]);

  const canSend = input.trim().length > 0;

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    const userMsg: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      text,
    };
    const botMsg: ChatMessage = {
      id: `${Date.now()}-bot`,
      role: "bot",
      text: getBotReply(text),
    };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={20} color="#1F1F1F" />
          </Pressable>
          <Text style={styles.title}>AI Chatbot</Text>
        </View>

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const isUser = item.role === "user";
            return (
              <View
                style={[
                  styles.bubble,
                  isUser ? styles.userBubble : styles.botBubble,
                ]}
              >
                <Text style={isUser ? styles.userText : styles.botText}>{item.text}</Text>
              </View>
            );
          }}
        />

        <View style={styles.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Асуултаа бичнэ үү..."
            placeholderTextColor="#9A9A9A"
            style={styles.input}
            multiline
          />
          <Pressable
            onPress={handleSend}
            disabled={!canSend}
            style={({ pressed }) => [
              styles.sendBtn,
              (!canSend || pressed) && styles.sendBtnMuted,
            ]}
          >
            <Text style={styles.sendText}>Илгээх</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

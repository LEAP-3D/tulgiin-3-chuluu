import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSupabaseAuth } from "@/lib/supabase-auth";
import { styles } from "./payment.styles";

type PaymentMethod = "cash" | "bank_app";

export default function PaymentScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  const { session } = useSupabaseAuth();
  const apiBaseUrl =
    process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("bank_app");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = amount.trim().length > 0 && !isSubmitting;

  const handleSubmit = async () => {
    if (!orderId) {
      Alert.alert("Алдаа", "Захиалгын дугаар олдсонгүй.");
      return;
    }

    const parsed = Number(amount.replace(/[^\d.]/g, ""));
    if (!Number.isFinite(parsed) || parsed <= 0) {
      Alert.alert("Алдаа", "Төлбөрийн дүн буруу байна.");
      return;
    }

    setIsSubmitting(true);
    const authHeader = session?.access_token
      ? { Authorization: `Bearer ${session.access_token}` }
      : {};
    try {
      const response = await fetch(`${apiBaseUrl}/orders/${orderId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({
          payment_amount: parsed,
          payment_method: method,
        }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        const message =
          payload?.error ?? payload?.message ?? `HTTP ${response.status}`;
        throw new Error(message);
      }
      Alert.alert(
        "Амжилттай",
        method === "cash"
          ? "Төлбөр бэлнээр хүлээгдэж байна."
          : "Төлбөрийн нэхэмжлэл үүслээ.",
      );
      router.back();
    } catch (err) {
      Alert.alert(
        "Алдаа",
        err instanceof Error ? err.message : "Төлбөр тохируулах үед алдаа гарлаа.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Төлбөрийн мэдээлэл</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Төлбөрийн дүн (₮)</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="Жишээ: 150000"
            keyboardType="numeric"
            style={styles.input}
          />

          <Text style={styles.label}>Төлбөрийн хэлбэр</Text>
          <View style={styles.methodRow}>
            <Pressable
              onPress={() => setMethod("bank_app")}
              style={[
                styles.methodButton,
                method === "bank_app" && styles.methodButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.methodText,
                  method === "bank_app" && styles.methodTextActive,
                ]}
              >
                Банкны апп
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setMethod("cash")}
              style={[
                styles.methodButton,
                method === "cash" && styles.methodButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.methodText,
                  method === "cash" && styles.methodTextActive,
                ]}
              >
                Бэлэн
              </Text>
            </Pressable>
          </View>

          <Text style={styles.helper}>
            Банкны апп сонговол хэрэглэгчид төлбөрийн холбоос үүснэ.
          </Text>
        </View>

        <Pressable
          onPress={handleSubmit}
          disabled={!canSubmit}
          style={[styles.submitButton, !canSubmit && styles.submitDisabled]}
        >
          <Text style={styles.submitText}>
            {isSubmitting ? "Ачаалж байна..." : "Төлбөр үүсгэх"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

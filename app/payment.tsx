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

    // Keep UX tolerant (users may type spaces/₮/commas), but validate a real positive amount.
    const digitsOnly = amount.replace(/[^\d]/g, "");
    if (digitsOnly.length === 0) {
      Alert.alert("Алдаа", "Төлбөрийн дүн оруулна уу.");
      return;
    }

    const parsed = Number(digitsOnly);

    // Business-safe: must be a finite, positive integer amount (₮ is not fractional in common UX).
    if (!Number.isFinite(parsed) || parsed <= 0) {
      Alert.alert("Алдаа", "Төлбөрийн дүн буруу байна.");
      return;
    }
    if (!Number.isSafeInteger(parsed)) {
      Alert.alert("Алдаа", "Төлбөрийн дүн бүхэл тоо байх ёстой.");
      return;
    }
    // Prevent accidental huge values (e.g., pasted extra zeros) that could cause wrong charging.
    if (parsed > 1_000_000_000) {
      Alert.alert("Алдаа", "Төлбөрийн дүн хэт их байна.");
      return;
    }

    setIsSubmitting(true);

    // Build headers as a single concrete object to satisfy fetch() HeadersInit typing.
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (session?.access_token) {
      headers.Authorization = `Bearer ${session.access_token}`;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/orders/${orderId}/complete`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          payment_amount: parsed,
          payment_method: method,
        }),
      });

      // Safer payload parsing (handles empty body / non-JSON error bodies)
      const raw = await response.text();
      const payload = raw ? (JSON.parse(raw) as any) : null;

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
        err instanceof Error
          ? err.message
          : "Төлбөр тохируулах үед алдаа гарлаа.",
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

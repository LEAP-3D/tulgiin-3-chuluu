import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HelpScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#111" />
        </Pressable>
        <Text style={styles.headerTitle}>Тусламж</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Түгээмэл асуултууд</Text>
          <Text style={styles.cardText}>
            Захиалга үүсгэх, засварчин сонгох болон төлбөрийн талаархи түгээмэл
            асуултууд эндээс тун удахгүй байрлана.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Холбоо барих</Text>
          <Text style={styles.cardText}>Утас: 7700-0000</Text>
          <Text style={styles.cardText}>Имэйл: support@ubzyro.mn</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Чат дэмжлэг</Text>
          <Text style={styles.cardText}>
            09:00 - 18:00 (Даваа - Баасан) цагийн хооронд чат дэмжлэг
            ажиллана.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F1F1F",
  },
  content: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F1F1F",
    marginBottom: 8,
  },
  cardText: {
    fontSize: 13,
    color: "#6B6B6B",
    lineHeight: 18,
  },
});

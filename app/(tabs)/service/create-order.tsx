import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const services = [
  { key: "electric", label: "Цахилгаан", icon: "power-plug" },
  { key: "plumbing", label: "Сантехник", icon: "water" },
  { key: "lock", label: "Цоож", icon: "lock" },
  { key: "paint", label: "Будаг", icon: "format-paint" },
  { key: "carpenter", label: "Мужаан", icon: "hammer" },
  { key: "clean", label: "Ариутгал", icon: "broom" },
  { key: "heat", label: "Халаалт", icon: "fire" },
  { key: "internet", label: "Интернет", icon: "wifi" },
  { key: "ac", label: "Агааржуулалт", icon: "fan" },
  { key: "security", label: "Аюулгүй байдал", icon: "shield-check" },
  { key: "glass", label: "Шил, толь", icon: "mirror" },
  { key: "furniture", label: "Тавилга", icon: "sofa" },
  { key: "floor", label: "Шал", icon: "floor-plan" },
  { key: "roof", label: "Дээвэр", icon: "home-roof" },
  { key: "moving", label: "Нүүлгэлт", icon: "truck-fast" },
  { key: "garden", label: "Гадна талбай", icon: "pine-tree" },
];

export default function CreateOrderScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string }>();
  const [date, setDate] = useState("");
  const [district, setDistrict] = useState("");
  const [khoroo, setKhoroo] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState<"normal" | "urgent" | null>(null);

  const selectedService = useMemo(() => {
    const label = typeof params.type === "string" ? params.type : "";
    return services.find((item) => item.label === label) ?? services[0];
  }, [params.type]);

  return (
    <View style={styles.container}>
      <View style={styles.divider} />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 40 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            style={styles.backButton}
          >
            <MaterialCommunityIcons name="arrow-left" size={22} color="#111111" />
          </Pressable>
          <Text style={styles.headerTitle}>Захиалга үүсгэх</Text>
        </View>

        <Text style={styles.label}>Төрөл</Text>
        <View style={styles.typePill}>
          <View style={styles.typeIconWrap}>
            <MaterialCommunityIcons
              name={selectedService.icon as any}
              size={18}
              color="#F59E0B"
            />
          </View>
          <Text style={styles.typeText}>{selectedService.label}</Text>
        </View>

        <Text style={styles.label}>Он/сар/өдөр</Text>
        <TextInput
          placeholder="Он/сар/өдөр"
          placeholderTextColor="#A3A3A3"
          style={styles.input}
          value={date}
          onChangeText={setDate}
        />

        <Text style={styles.label}>Байршил</Text>
        <TextInput
          placeholder="Дүүрэг сонгох"
          placeholderTextColor="#A3A3A3"
          style={styles.input}
          value={district}
          onChangeText={setDistrict}
        />
        <TextInput
          placeholder="Хороо сонгох"
          placeholderTextColor="#A3A3A3"
          style={styles.input}
          value={khoroo}
          onChangeText={setKhoroo}
        />
        <TextInput
          placeholder="Дэлгэрэнгүй хаяг (орц, давхар, код)"
          placeholderTextColor="#A3A3A3"
          style={styles.input}
          value={address}
          onChangeText={setAddress}
        />

        <Text style={styles.label}>Тайлбар</Text>
        <TextInput
          placeholder="Тайлбар бичнэ үү"
          placeholderTextColor="#A3A3A3"
          style={[styles.input, styles.textArea]}
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Зураг хавсаргах</Text>
        <Pressable style={styles.attachBox} onPress={() => console.log("add")}>
          <MaterialCommunityIcons name="plus" size={26} color="#9B9B9B" />
        </Pressable>

        <Text style={styles.label}>Яаралтай эсэх</Text>
        <View style={styles.urgencyRow}>
          <Pressable
            style={[
              styles.urgencyButton,
              urgency === "normal" && styles.urgencySelected,
            ]}
            onPress={() => setUrgency("normal")}
          >
            <Text
              style={[
                styles.urgencyText,
                urgency === "normal" && styles.urgencyTextSelected,
              ]}
            >
              Энгийн
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.urgencyButton,
              urgency === "urgent" && styles.urgencySelected,
            ]}
            onPress={() => setUrgency("urgent")}
          >
            <Text
              style={[
                styles.urgencyText,
                urgency === "urgent" && styles.urgencyTextSelected,
              ]}
            >
              Яаралтай
            </Text>
          </Pressable>
        </View>

        <Pressable
          style={styles.submitButton}
          onPress={() =>
            router.push({
              pathname: "/service/select-repairman",
              params: { type: selectedService.label },
            })
          }
        >
          <Text style={styles.submitText}>Засварчин сонгох</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  divider: {
    height: 1,
    backgroundColor: "#EAEAEA",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F1F1F",
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F1F1F",
    marginBottom: 8,
    marginTop: 18,
  },
  typePill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  typeIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFF6EC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  typeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F1F1F",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#1F1F1F",
    marginBottom: 12,
  },
  textArea: {
    height: 96,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  attachBox: {
    width: 64,
    height: 64,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 12,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  urgencyRow: {
    flexDirection: "row",
    gap: 12,
  },
  urgencyButton: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  urgencySelected: {
    borderColor: "#F59E0B",
    backgroundColor: "#FFF6EC",
  },
  urgencyText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F1F1F",
  },
  urgencyTextSelected: {
    color: "#1F1F1F",
  },
  submitButton: {
    marginTop: 24,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#1E1E1E",
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

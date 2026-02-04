import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

export default function ServiceAllScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const handleServicePress = (label: string) => {
    router.push({ pathname: "/service/create-order", params: { type: label } });
  };
  const filteredServices = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return services;
    return services.filter((item) =>
      item.label.toLowerCase().includes(needle)
    );
  }, [query]);

  return (
    <View style={styles.container}>
      <View style={styles.divider} />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 120 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchRow}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={10}
            style={styles.backButton}
          >
            <MaterialCommunityIcons name="arrow-left" size={22} color="#111111" />
          </Pressable>
          <View style={styles.searchInputWrap}>
            <MaterialCommunityIcons name="magnify" size={20} color="#9B9B9B" />
            <TextInput
              placeholder="Хайх"
              placeholderTextColor="#9B9B9B"
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
            />
          </View>
        </View>

        <View style={styles.grid}>
          {filteredServices.map((item) => (
            <Pressable
              key={item.key}
              style={styles.gridItem}
              onPress={() => handleServicePress(item.label)}
            >
              <View style={styles.iconWrap}>
                <MaterialCommunityIcons
                  name={item.icon as any}
                  size={26}
                  color="#F59E0B"
                />
              </View>
              <Text style={styles.iconLabel}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
        {filteredServices.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Олдсон үйлчилгээ байхгүй байна
            </Text>
          </View>
        ) : null}
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
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  searchInputWrap: {
    flex: 1,
    height: 44,
    marginLeft: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 22,
    paddingHorizontal: 14,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#1F1F1F",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "25%",
    alignItems: "center",
    marginBottom: 24,
  },
  iconWrap: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#F7F7F7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  iconLabel: {
    fontSize: 13,
    color: "#202020",
    fontWeight: "600",
    textAlign: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "#7A7A7A",
    fontWeight: "600",
  },
});

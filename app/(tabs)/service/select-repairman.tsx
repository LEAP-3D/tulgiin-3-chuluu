import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const technicians = [
  {
    id: "b1",
    name: "Баатар Болд",
    rating: 4.8,
    orders: 127,
    years: 5,
    area: "БЗД, СХД, ЧД",
  },
  {
    id: "b2",
    name: "Баатар Болд",
    rating: 4.8,
    orders: 127,
    years: 5,
    area: "БЗД, СХД, ЧД",
  },
  {
    id: "b3",
    name: "Баатар Болд",
    rating: 4.8,
    orders: 127,
    years: 5,
    area: "БЗД, СХД, ЧД",
  },
];

export default function SelectRepairmanScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string }>();
  const typeLabel = typeof params.type === "string" ? params.type : "Сантехник";
  const handleOpenProfile = (id: string) => {
    router.push({ pathname: "/service/repairman-profile", params: { id } });
  };

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
          <Text style={styles.headerTitle}>Засварчин сонгох</Text>
        </View>

        {technicians.map((tech) => (
          <Pressable
            key={tech.id}
            style={styles.card}
            onPress={() => handleOpenProfile(tech.id)}
          >
            <View style={styles.cardTopRow}>
              <View style={styles.avatar}>
                <MaterialCommunityIcons
                  name="account"
                  size={28}
                  color="#9B9B9B"
                />
              </View>
              <View style={styles.cardTitleBlock}>
                <Text style={styles.name}>{tech.name}</Text>
                <Text style={styles.subtitle}>{typeLabel} мэргэжилтэн</Text>
              </View>
              <View style={styles.rating}>
                <MaterialCommunityIcons name="star" size={18} color="#F59E0B" />
                <Text style={styles.ratingText}>{tech.rating.toFixed(1)}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Захиалга</Text>
              <Text style={styles.infoValue}>{tech.orders}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ажилласан жил</Text>
              <Text style={styles.infoValue}>{tech.years} жил</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Үйлчлэх бүс</Text>
              <Text style={styles.infoValue}>{tech.area}</Text>
            </View>

            <Pressable
              style={styles.selectButton}
              onPress={() => handleOpenProfile(tech.id)}
            >
              <Text style={styles.selectText}>Сонгох</Text>
            </Pressable>
          </Pressable>
        ))}
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
  card: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F2F2F2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardTitleBlock: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F1F1F",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#7A7A7A",
    fontWeight: "600",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F1F1F",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: "#7A7A7A",
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 13,
    color: "#1F1F1F",
    fontWeight: "600",
  },
  selectButton: {
    marginTop: 8,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#1E1E1E",
    alignItems: "center",
    justifyContent: "center",
  },
  selectText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

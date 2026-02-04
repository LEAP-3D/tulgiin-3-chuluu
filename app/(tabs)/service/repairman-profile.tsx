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
    skills: ["Цахилгаан", "Сантехник", "Жижиг засвар"],
  },
];

const reviews = [
  {
    id: "r1",
    author: "Хэрэглэгч",
    rating: 4.8,
    text: "Маш сайн ажилласан. Цаг баримталсан.",
    date: "2025.01.18",
  },
  {
    id: "r2",
    author: "Хэрэглэгч",
    rating: 4.8,
    text: "Хурдан шийдвэрлэсэн. Зөвлөгөө өгсөн.",
    date: "2025.01.18",
  },
];

export default function RepairmanProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const tech =
    technicians.find((item) => item.id === params.id) ?? technicians[0];

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
          <Text style={styles.headerTitle}>Засварчны профайл</Text>
        </View>

        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account" size={30} color="#9B9B9B" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{tech.name}</Text>
            <Text style={styles.subtitle}>Сантехникийн мэргэжилтэн</Text>
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

        <Text style={styles.sectionTitle}>Мэргэжил</Text>
        <View style={styles.chipRow}>
          {tech.skills.map((skill) => (
            <View key={skill} style={styles.chip}>
              <View style={styles.chipIconWrap}>
                <MaterialCommunityIcons
                  name="power-plug"
                  size={14}
                  color="#F59E0B"
                />
              </View>
              <Text style={styles.chipText}>{skill}</Text>
            </View>
          ))}
        </View>

        <View style={styles.reviewHeader}>
          <Text style={styles.sectionTitle}>Сэтгэгдэл</Text>
          <Text style={styles.reviewAll}>Бүгд</Text>
        </View>

        {reviews.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewTopRow}>
              <View style={styles.reviewAvatar}>
                <Text style={styles.reviewAvatarText}>X</Text>
              </View>
              <View style={styles.reviewTitleBlock}>
                <Text style={styles.reviewAuthor}>{review.author}</Text>
              </View>
              <View style={styles.rating}>
                <MaterialCommunityIcons
                  name="star"
                  size={16}
                  color="#F59E0B"
                />
                <Text style={styles.ratingText}>{review.rating.toFixed(1)}</Text>
              </View>
            </View>
            <Text style={styles.reviewText}>{review.text}</Text>
            <Text style={styles.reviewDate}>{review.date}</Text>
          </View>
        ))}

        <Pressable style={styles.selectButton} onPress={() => console.log("pick")}
        >
          <Text style={styles.selectText}>Сонгох</Text>
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
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#F2F2F2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 17,
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
  },
  ratingText: {
    marginLeft: 6,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F1F1F",
    marginTop: 18,
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
  },
  chipIconWrap: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FFF6EC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1F1F1F",
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  reviewAll: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F1F1F",
  },
  reviewCard: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  reviewTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#EDEDED",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  reviewAvatarText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F1F1F",
  },
  reviewTitleBlock: {
    flex: 1,
  },
  reviewAuthor: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F1F1F",
  },
  reviewText: {
    fontSize: 13,
    color: "#1F1F1F",
    fontWeight: "500",
    lineHeight: 18,
  },
  reviewDate: {
    marginTop: 6,
    fontSize: 12,
    color: "#7A7A7A",
    fontWeight: "600",
  },
  selectButton: {
    marginTop: 12,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  selectText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

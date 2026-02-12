import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./repairman-profile.styles";

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

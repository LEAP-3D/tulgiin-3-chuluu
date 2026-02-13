import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, Text, View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./select-repairman.styles";

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

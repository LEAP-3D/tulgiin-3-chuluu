import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View, Pressable, Image, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./repairman-profile.styles";

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

const serviceLabels: Record<string, string> = {
  electric: "Цахилгаан",
  plumbing: "Сантехник",
  lock: "Цоож, хаалга засвар",
  paint: "Будаг",
  carpenter: "Мужаан",
  clean: "Ариутгал",
  heat: "Халаалт",
  internet: "Интернет",
  ac: "Агааржуулалт",
  security: "Аюулгүй байдал",
  glass: "Шил, толь",
  furniture: "Тавилга",
  floor: "Шал",
  roof: "Дээвэр",
  moving: "Нүүлгэлт",
  garden: "Гадна талбай",
};

const serviceIcons: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  electric: "power-plug",
  plumbing: "water",
  lock: "lock",
  paint: "format-paint",
  carpenter: "hammer",
  clean: "broom",
  heat: "fire",
  internet: "wifi",
  ac: "fan",
  security: "shield-check",
  glass: "mirror",
  furniture: "sofa",
  floor: "floor-plan",
  roof: "home-roof",
  moving: "truck-fast",
  garden: "pine-tree",
};

const districtShortMap: Record<string, string> = {
  "Баянзүрх": "БЗД",
  "Баянзүрх дүүрэг": "БЗД",
  "Сонгинохайрхан": "СХД",
  "Сонгинохайрхан дүүрэг": "СХД",
  "Чингэлтэй": "ЧД",
  "Чингэлтэй дүүрэг": "ЧД",
  "Сүхбаатар": "СБД",
  "Сүхбаатар дүүрэг": "СБД",
  "Хан-Уул": "ХУД",
  "Хан-Уул дүүрэг": "ХУД",
  "Баянгол": "БГД",
  "Баянгол дүүрэг": "БГД",
  "Налайх": "НД",
  "Налайх дүүрэг": "НД",
  "Багануур": "БНД",
  "Багануур дүүрэг": "БНД",
  "Багахангай": "БХД",
  "Багахангай дүүрэг": "БХД",
};

type Technician = {
  id: string;
  name: string;
  rating?: number | null;
  orders?: number | null;
  years?: number | null;
  areas: string[];
  skills: string[];
};

export default function RepairmanProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const apiBaseUrl =
    process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
  const params = useLocalSearchParams<{
    id?: string;
    typeLabel?: string;
    typeKey?: string;
    district?: string;
    date?: string;
    khoroo?: string;
    address?: string;
    description?: string;
    urgency?: string;
  }>();
  const workerId = typeof params.id === "string" ? params.id : "";
  const fallbackTypeLabel =
    typeof params.typeLabel === "string" ? params.typeLabel : "";
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const normalizeList = (value: unknown): string[] => {
    if (Array.isArray(value)) return value.filter(Boolean).map(String);
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (!trimmed) return [];
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.filter(Boolean).map(String);
        }
      } catch {
        // fall through to split
      }
      return trimmed
        .split(/[;,]/)
        .map((item) => item.trim())
        .filter(Boolean);
    }
    return [];
  };

  const formatAreas = (areas: string[]) => {
    if (areas.length === 0) return "—";
    const mapped = areas.map((area) => districtShortMap[area] ?? area);
    return mapped.join(", ");
  };

  const subtitle = useMemo(() => {
    if (fallbackTypeLabel) return `${fallbackTypeLabel} мэргэжилтэн`;
    const firstSkill = technician?.skills?.[0];
    if (firstSkill && serviceLabels[firstSkill]) {
      return `${serviceLabels[firstSkill]} мэргэжилтэн`;
    }
    return "Мэргэжилтэн";
  }, [fallbackTypeLabel, technician?.skills]);

  const carryParams = {
    typeKey: typeof params.typeKey === "string" ? params.typeKey : "",
    typeLabel: fallbackTypeLabel,
    district: typeof params.district === "string" ? params.district : "",
    date: typeof params.date === "string" ? params.date : "",
    khoroo: typeof params.khoroo === "string" ? params.khoroo : "",
    address: typeof params.address === "string" ? params.address : "",
    description:
      typeof params.description === "string" ? params.description : "",
    urgency: typeof params.urgency === "string" ? params.urgency : "",
  };

  useEffect(() => {
    if (!workerId) return;
    let cancelled = false;
    const loadWorker = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const response = await fetch(`${apiBaseUrl}/workers/${workerId}`);
        const payload = await response.json().catch(() => null);
        if (!response.ok) {
          const message =
            payload?.error ?? payload?.message ?? `HTTP ${response.status}`;
          throw new Error(message);
        }

        const data = payload?.data ?? null;
        if (!data) throw new Error("Засварчин олдсонгүй.");

        const mapped: Technician = {
          id: String(data.id ?? ""),
          name:
            `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() ||
            "Засварчин",
          rating: typeof data.rating === "number" ? data.rating : null,
          orders: typeof data.orders === "number" ? data.orders : null,
          years: typeof data.years === "number" ? data.years : null,
          areas: normalizeList(data.service_area),
          skills: normalizeList(data.work_types),
        };
        if (!cancelled) setTechnician(mapped);
      } catch (err) {
        if (!cancelled) {
          setErrorMessage(
            err instanceof Error ? err.message : "Өгөгдөл татах үед алдаа гарлаа.",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadWorker();
    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl, workerId]);

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

        {isLoading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="small" color="#1F1F1F" />
          </View>
        ) : errorMessage || !technician ? (
          <View style={styles.loadingCard}>
            <Text style={styles.errorTitle}>Алдаа гарлаа.</Text>
            <Text style={styles.errorText}>{errorMessage ?? "Мэдээлэл олдсонгүй."}</Text>
          </View>
        ) : (
          <>
            <View style={styles.profileRow}>
              <View style={styles.avatar}>
                <Image
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
                  }}
                  style={styles.avatarImage}
                />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.name}>{technician.name}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
              </View>
              <View style={styles.rating}>
                <MaterialCommunityIcons name="star" size={18} color="#F59E0B" />
                <Text style={styles.ratingText}>
                  {typeof technician.rating === "number"
                    ? technician.rating.toFixed(1)
                    : "—"}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Захиалга</Text>
              <Text style={styles.infoValue}>
                {typeof technician.orders === "number"
                  ? technician.orders
                  : "—"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ажилласан жил</Text>
              <Text style={styles.infoValue}>
                {typeof technician.years === "number"
                  ? `${technician.years} жил`
                  : "—"}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Үйлчлэх бүс</Text>
              <Text style={styles.infoValue}>{formatAreas(technician.areas)}</Text>
            </View>

            <Text style={styles.sectionTitle}>Мэргэжил</Text>
            <View style={styles.chipRow}>
              {technician.skills.length === 0 ? (
                <Text style={styles.emptySkill}>—</Text>
              ) : (
                technician.skills.map((skill) => (
                  <View key={skill} style={styles.chip}>
                    <View style={styles.chipIconWrap}>
                      <MaterialCommunityIcons
                        name={serviceIcons[skill] ?? "briefcase-outline"}
                        size={14}
                        color="#F59E0B"
                      />
                    </View>
                    <Text style={styles.chipText}>
                      {serviceLabels[skill] ?? skill}
                    </Text>
                  </View>
                ))
              )}
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

            <Pressable
              style={styles.selectButton}
              onPress={() => {
                if (!technician) return;
                router.push({
                  pathname: "/service/create-order",
                  params: {
                    ...carryParams,
                    selectedWorkerId: technician.id,
                    selectedWorkerName: technician.name,
                    selectedWorkerRating:
                      typeof technician.rating === "number"
                        ? String(technician.rating)
                        : "",
                    selectedWorkerOrders:
                      typeof technician.orders === "number"
                        ? String(technician.orders)
                        : "",
                    selectedWorkerYears:
                      typeof technician.years === "number"
                        ? String(technician.years)
                        : "",
                    selectedWorkerAreas: JSON.stringify(technician.areas),
                  },
                });
              }}
            >
              <Text style={styles.selectText}>Сонгох</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
}

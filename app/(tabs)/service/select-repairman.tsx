import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Pressable,
  ActivityIndicator,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./select-repairman.styles";

const serviceLabels: Record<string, string> = {
  electric: "Цахилгаан",
  plumbing: "Сантехник",
  lock: "Цоож",
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

type Technician = {
  id: string;
  name: string;
  areas: string[];
  services: string[];
  rating?: number | null;
  orders?: number | null;
  years?: number | null;
  avatarUrl?: string | null;
};

export default function SelectRepairmanScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const apiBaseUrl =
    process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
  const params = useLocalSearchParams<{
    typeKey?: string;
    typeLabel?: string;
    district?: string;
    date?: string;
    khoroo?: string;
    address?: string;
    description?: string;
    urgency?: string;
  }>();
  const typeKey = typeof params.typeKey === "string" ? params.typeKey : "";
  const typeLabel =
    typeof params.typeLabel === "string"
      ? params.typeLabel
      : serviceLabels[typeKey] ?? "Сантехник";
  const district = typeof params.district === "string" ? params.district : "";
  const date = typeof params.date === "string" ? params.date : "";
  const khoroo = typeof params.khoroo === "string" ? params.khoroo : "";
  const address = typeof params.address === "string" ? params.address : "";
  const description =
    typeof params.description === "string" ? params.description : "";
  const urgency = typeof params.urgency === "string" ? params.urgency : "";
  const districtQuery = useMemo(() => {
    if (!district) return "";
    return district.endsWith("дүүрэг") ? district : `${district} дүүрэг`;
  }, [district]);
  const carryParams = {
    typeKey,
    typeLabel,
    district,
    date,
    khoroo,
    address,
    description,
    urgency,
  };

  const handleOpenProfile = (id: string) => {
    router.push({
      pathname: "/service/repairman-profile",
      params: { id, ...carryParams },
    });
  };

  const handleSelectWorker = (tech: Technician) => {
    router.push({
      pathname: "/service/create-order",
      params: {
        ...carryParams,
        selectedWorkerId: tech.id,
        selectedWorkerName: tech.name,
        selectedWorkerRating:
          typeof tech.rating === "number" ? String(tech.rating) : "",
        selectedWorkerOrders:
          typeof tech.orders === "number" ? String(tech.orders) : "",
        selectedWorkerYears:
          typeof tech.years === "number" ? String(tech.years) : "",
        selectedWorkerAreas: JSON.stringify(tech.areas),
        selectedWorkerAvatar: tech.avatarUrl ?? "",
      },
    });
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

  const formatAreas = (areas: string[]) => {
    if (areas.length === 0) return "—";
    const mapped = areas.map((area) => districtShortMap[area] ?? area);
    const maxVisible = 4;
    if (mapped.length <= maxVisible) return mapped.join(", ");
    const visible = mapped.slice(0, maxVisible).join(", ");
    const remaining = mapped.length - maxVisible;
    return `${visible} +${remaining}`;
  };

  const [technicians, setTechnicians] = useState<Technician[]>([]);
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

  useEffect(() => {
    let cancelled = false;
    const loadWorkers = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const url = new URL(`${apiBaseUrl}/workers`);
        if (typeKey) url.searchParams.set("typeKey", typeKey);
        if (districtQuery) url.searchParams.set("district", districtQuery);
        const response = await fetch(url.toString());
        const payload = await response.json().catch(() => null);
        if (!response.ok) {
          const message =
            payload?.error ??
            payload?.message ??
            `HTTP ${response.status}`;
          throw new Error(message);
        }
        const data = Array.isArray(payload?.data) ? payload.data : [];
        const mapped: Technician[] = data.map((item: any) => ({
          id: String(item.id ?? ""),
          name: `${item.first_name ?? ""} ${item.last_name ?? ""}`.trim() || "Засварчин",
          areas: normalizeList(item.service_area),
          services: normalizeList(item.work_types),
          rating: typeof item.rating === "number" ? item.rating : null,
          orders: typeof item.orders === "number" ? item.orders : null,
          years: typeof item.years === "number" ? item.years : null,
          avatarUrl: typeof item.avatar_url === "string" ? item.avatar_url : null,
        }));
        if (!cancelled) setTechnicians(mapped);
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

    loadWorkers();
    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl, districtQuery, typeKey]);

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

        {isLoading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="small" color="#1F1F1F" />
          </View>
        ) : errorMessage ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Алдаа гарлаа.</Text>
            <Text style={styles.emptyText}>{errorMessage}</Text>
          </View>
        ) : technicians.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Одоогоор тохирох засварчин алга.</Text>
            <Text style={styles.emptyText}>
              {district ? `${district} дүүрэг` : "Сонгосон бүс"} ба{" "}
              {typeLabel} төрлөөр хайлт хийсэн үр дүн хоосон байна.
            </Text>
          </View>
        ) : (
          technicians.map((tech) => (
            <Pressable
              key={tech.id}
              style={styles.card}
              onPress={() => handleOpenProfile(tech.id)}
            >
              <View style={styles.cardTopRow}>
                <View style={styles.avatar}>
                  {tech.avatarUrl ? (
                    <Image
                      source={{ uri: tech.avatarUrl }}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <Image
                      source={{
                        uri: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
                      }}
                      style={styles.avatarImage}
                    />
                  )}
                </View>
                <View style={styles.cardTitleBlock}>
                  <Text style={styles.name}>{tech.name}</Text>
                  <Text style={styles.subtitle}>{typeLabel} мэргэжилтэн</Text>
                </View>
                <View style={styles.rating}>
                  <MaterialCommunityIcons name="star" size={18} color="#F59E0B" />
                  <Text style={styles.ratingText}>
                    {typeof tech.rating === "number"
                      ? tech.rating.toFixed(1)
                      : "—"}
                  </Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Захиалга</Text>
                <Text style={styles.infoValue}>
                  {typeof tech.orders === "number" ? tech.orders : "—"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Ажилласан жил</Text>
                <Text style={styles.infoValue}>
                  {typeof tech.years === "number" ? `${tech.years} жил` : "—"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Үйлчлэх бүс</Text>
                <Text
                  style={[styles.infoValue, styles.infoValueArea]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {formatAreas(tech.areas)}
                </Text>
              </View>

              <Pressable
                style={styles.selectButton}
                onPress={() => handleSelectWorker(tech)}
              >
                <Text style={styles.selectText}>Сонгох</Text>
              </Pressable>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

import { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  View,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSupabaseAuth } from "@/lib/supabase-auth";
import LeftArrowIcon from "@/components/icons/_serviceIcons/leftarrowIcon";
import CallIcon from "@/components/icons/call";
import { styles } from "./order.styles";

type OrderItem = {
  id: string;
  service_key?: string | null;
  service_label?: string | null;
  status?: string | null;
  created_at?: string | null;
  accepted_at?: string | null;
  rejected_at?: string | null;
  cancelled_at?: string | null;
  en_route_at?: string | null;
  in_progress_at?: string | null;
  completed_at?: string | null;
  worker_profile_id?: string | null;
  user_profile_id?: string | null;
  district?: string | null;
  khoroo?: string | null;
  address?: string | null;
  description?: string | null;
  scheduled_date?: string | null;
  urgency?: string | null;
  attachment_urls?: unknown;
};

type WorkerProfile = {
  id: string;
  name: string;
  rating?: number | null;
  orders?: number | null;
  years?: number | null;
  areas: string[];
};

type CustomerProfile = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
};

const statusLabels: Record<string, string> = {
  pending: "Хүлээгдэж буй",
  accepted: "Засварчин хүлээн авсан",
  en_route: "Засварчин явж байна",
  in_progress: "Ажил эхэлсэн",
  completed: "Ажил дууссан",
  cancelled: "Цуцлагдсан",
  rejected: "Татгалзсан",
};

const serviceEmojis: Record<string, string> = {
  electric: "⚡",
  plumbing: "🚰",
  lock: "🔒",
  paint: "🎨",
  carpenter: "🔨",
  clean: "🧼",
  heat: "🔥",
  internet: "📶",
  ac: "❄️",
  security: "🛡️",
  glass: "🪟",
  furniture: "🛋️",
  floor: "🧱",
  roof: "🏠",
  moving: "🚚",
  garden: "🌲",
};

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

const formatTime = (value?: string | null) => {
  if (!value) return "--:--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--:--";
  return date.toLocaleTimeString("mn-MN", {
    hour: "2-digit",
    minute: "2-digit",
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

export default function OrderScreen() {
  const { user, isLoaded: isUserLoaded } = useSupabaseAuth();
  const apiBaseUrl =
    process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
  const [showDetail, setShowDetail] = useState(false);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [isWorkerLoading, setIsWorkerLoading] = useState(false);
  const [workerError, setWorkerError] = useState<string | null>(null);
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [isCustomerLoading, setIsCustomerLoading] = useState(false);
  const [customerError, setCustomerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [profileRole, setProfileRole] = useState<"user" | "worker" | null>(
    null,
  );
  const router = useRouter();
  const isWorkerView = profileRole === "worker";

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
    const maxVisible = 4;
    if (mapped.length <= maxVisible) return mapped.join(", ");
    const visible = mapped.slice(0, maxVisible).join(", ");
    const remaining = mapped.length - maxVisible;
    return `${visible} +${remaining}`;
  };

  const timeline = useMemo(() => {
    const status = selectedOrder?.status ?? "pending";
    const statusOrder = [
      "pending",
      "accepted",
      "en_route",
      "in_progress",
      "completed",
    ];
    const currentIndex = statusOrder.indexOf(status);
    const activeIndex = currentIndex === -1 ? 0 : currentIndex;
    return [
      {
        title: "Захиалга илгээгдсэн",
        time: formatTime(selectedOrder?.created_at),
        active: activeIndex >= 0,
      },
      {
        title: "Засварчин хүлээн авсан",
        time: formatTime(selectedOrder?.accepted_at),
        active: activeIndex >= 1,
      },
      {
        title: "Засварчин явж байна",
        time: formatTime(selectedOrder?.en_route_at),
        active: activeIndex >= 2,
      },
      {
        title: "Ажил эхэлсэн",
        time: formatTime(selectedOrder?.in_progress_at),
        active: activeIndex >= 3,
      },
      {
        title: "Ажил дууссан",
        time: formatTime(selectedOrder?.completed_at),
        active: activeIndex >= 4,
      },
    ];
  }, [
    selectedOrder?.status,
    selectedOrder?.created_at,
    selectedOrder?.accepted_at,
    selectedOrder?.en_route_at,
    selectedOrder?.in_progress_at,
    selectedOrder?.completed_at,
  ]);

  const attachments = useMemo(() => {
    if (!selectedOrder) return [];
    return normalizeList(selectedOrder.attachment_urls);
  }, [selectedOrder?.attachment_urls]);

  useEffect(() => {
    if (!isUserLoaded) return;
    const email = user?.email?.trim();
    if (!email) return;

    let cancelled = false;
    const loadProfile = async () => {
      try {
        const response = await fetch(
          `${apiBaseUrl}/profiles?email=${encodeURIComponent(email)}`,
        );
        const payload = await response.json().catch(() => null);
        if (!response.ok) {
          const message =
            payload?.error ?? payload?.message ?? `HTTP ${response.status}`;
          throw new Error(message);
        }
        const data = payload?.data ?? null;
        if (!data) return;
        if (!cancelled) {
          setProfileId(String(data.id ?? ""));
          setProfileRole(data.role === "worker" ? "worker" : "user");
        }
      } catch (err) {
        if (!cancelled) {
          setProfileId(null);
          setProfileRole(null);
        }
      }
    };

    const loadOrders = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        let url = `${apiBaseUrl}/orders?email=${encodeURIComponent(email)}`;
        if (profileRole === "worker") {
          url = `${apiBaseUrl}/orders?worker_email=${encodeURIComponent(email)}`;
        }
        const response = await fetch(url);
        const payload = await response.json().catch(() => null);
        if (!response.ok) {
          const message =
            payload?.error ?? payload?.message ?? `HTTP ${response.status}`;
          throw new Error(message);
        }
        const data = Array.isArray(payload?.data) ? payload.data : [];
        const mapped = data.map((item: any) => ({
          id: String(item.id ?? ""),
          service_key: item.service_key ?? null,
          service_label: item.service_label ?? null,
          status: item.status ?? null,
          created_at: item.created_at ?? null,
          worker_profile_id: item.worker_profile_id ?? null,
          user_profile_id: item.user_profile_id ?? null,
          district: item.district ?? null,
          khoroo: item.khoroo ?? null,
          address: item.address ?? null,
          description: item.description ?? null,
          scheduled_date: item.scheduled_date ?? null,
          urgency: item.urgency ?? null,
          attachment_urls: item.attachment_urls ?? null,
        }));
        if (!cancelled) setOrders(mapped);
      } catch (err) {
        if (!cancelled) {
          setErrorMessage(
            err instanceof Error ? err.message : "Захиалга татах үед алдаа гарлаа.",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadProfile().then(loadOrders);
    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl, isUserLoaded, profileRole, user?.email]);

  useEffect(() => {
    const workerId = selectedOrder?.worker_profile_id;
    if (!showDetail) return;
    if (!workerId) {
      setWorker(null);
      setWorkerError("Засварчин томилогдоогүй байна.");
      return;
    }

    let cancelled = false;
    const loadWorker = async () => {
      setIsWorkerLoading(true);
      setWorkerError(null);
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
        const mapped: WorkerProfile = {
          id: String(data.id ?? ""),
          name:
            `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() ||
            "Засварчин",
          rating: typeof data.rating === "number" ? data.rating : null,
          orders: typeof data.orders === "number" ? data.orders : null,
          years: typeof data.years === "number" ? data.years : null,
          areas: normalizeList(data.service_area),
        };
        if (!cancelled) setWorker(mapped);
      } catch (err) {
        if (!cancelled) {
          setWorker(null);
          setWorkerError(
            err instanceof Error ? err.message : "Засварчин татах үед алдаа гарлаа.",
          );
        }
      } finally {
        if (!cancelled) setIsWorkerLoading(false);
      }
    };

    loadWorker();
    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl, selectedOrder?.worker_profile_id, showDetail]);

  useEffect(() => {
    if (!showDetail) return;
    if (profileRole !== "worker") return;
    const userId = selectedOrder?.user_profile_id;
    if (!userId) {
      setCustomer(null);
      setCustomerError("Хэрэглэгчийн мэдээлэл олдсонгүй.");
      return;
    }

    let cancelled = false;
    const loadCustomer = async () => {
      setIsCustomerLoading(true);
      setCustomerError(null);
      try {
        const response = await fetch(`${apiBaseUrl}/profiles/${userId}`);
        const payload = await response.json().catch(() => null);
        if (!response.ok) {
          const message =
            payload?.error ?? payload?.message ?? `HTTP ${response.status}`;
          throw new Error(message);
        }
        const data = payload?.data ?? null;
        if (!data) throw new Error("Хэрэглэгчийн мэдээлэл олдсонгүй.");
        const mapped: CustomerProfile = {
          id: String(data.id ?? ""),
          name:
            `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() ||
            "Хэрэглэгч",
          email: data.email ?? null,
          phone: data.phone_number ?? null,
        };
        if (!cancelled) setCustomer(mapped);
      } catch (err) {
        if (!cancelled) {
          setCustomer(null);
          setCustomerError(
            err instanceof Error ? err.message : "Хэрэглэгч татах үед алдаа гарлаа.",
          );
        }
      } finally {
        if (!cancelled) setIsCustomerLoading(false);
      }
    };

    loadCustomer();
    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl, profileRole, selectedOrder?.user_profile_id, showDetail]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {!showDetail ? (
          <View style={styles.listScreen}>
            <Text style={styles.pageTitle}>Таны захиалга</Text>

            {isLoading ? (
              <View style={styles.orderCard}>
                <Text style={styles.orderStatus}>Ачаалж байна...</Text>
              </View>
            ) : errorMessage ? (
              <View style={styles.orderCard}>
                <Text style={styles.orderStatus}>Алдаа</Text>
                <Text style={styles.orderTitle}>{errorMessage}</Text>
              </View>
            ) : orders.length === 0 ? (
              <View style={styles.orderCard}>
                <Text style={styles.orderStatus}>Одоогоор захиалга алга.</Text>
              </View>
            ) : (
              orders.map((order) => {
                const label =
                  order.service_label ?? order.service_key ?? "Үйлчилгээ";
                const statusText =
                  (order.status && statusLabels[order.status]) ??
                  statusLabels.pending;
                const icon = order.service_key
                  ? serviceEmojis[order.service_key] ?? "⚡"
                  : "⚡";
                const showActions =
                  profileRole === "worker" &&
                  order.status === "pending" &&
                  order.worker_profile_id === profileId;
                return (
                  <View key={order.id} style={styles.orderCard}>
                    <Pressable
                      style={({ pressed }) => [
                        styles.orderMain,
                        pressed && styles.cardPressed,
                      ]}
                    onPress={() => {
                      setSelectedOrder(order);
                      setWorker(null);
                      setWorkerError(null);
                      setCustomer(null);
                      setCustomerError(null);
                      setShowDetail(true);
                    }}
                    >
                      <View style={styles.orderMeta}>
                        <Text style={styles.orderStatus}>{statusText}</Text>
                        <View style={styles.orderRow}>
                          <View style={styles.orderIcon}>
                            <Text style={styles.orderIconText}>{icon}</Text>
                          </View>
                          <Text style={styles.orderTitle}>{label}</Text>
                        </View>
                      </View>
                      <Text style={styles.chevron}>›</Text>
                    </Pressable>
                    {showActions ? (
                      <View style={styles.orderActions}>
                        <Pressable
                          style={[styles.actionButton, styles.acceptButton]}
                          onPress={async () => {
                            try {
                              const response = await fetch(
                                `${apiBaseUrl}/orders/${order.id}`,
                                {
                                  method: "PATCH",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ status: "accepted" }),
                                },
                              );
                              const payload = await response.json().catch(() => null);
                              if (!response.ok) {
                                const message =
                                  payload?.error ??
                                  payload?.message ??
                                  `HTTP ${response.status}`;
                                throw new Error(message);
                              }
                              setOrders((prev) =>
                                prev.map((item) =>
                                  item.id === order.id
                                    ? { ...item, status: "accepted" }
                                    : item,
                                ),
                              );
                            } catch {
                              // ignore for now
                            }
                          }}
                        >
                          <Text style={styles.actionText}>Хүлээн авах</Text>
                        </Pressable>
                        <Pressable
                          style={[styles.actionButton, styles.rejectButton]}
                          onPress={async () => {
                            try {
                              const response = await fetch(
                                `${apiBaseUrl}/orders/${order.id}`,
                                {
                                  method: "PATCH",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ status: "rejected" }),
                                },
                              );
                              const payload = await response.json().catch(() => null);
                              if (!response.ok) {
                                const message =
                                  payload?.error ??
                                  payload?.message ??
                                  `HTTP ${response.status}`;
                                throw new Error(message);
                              }
                              setOrders((prev) =>
                                prev.map((item) =>
                                  item.id === order.id
                                    ? { ...item, status: "rejected" }
                                    : item,
                                ),
                              );
                            } catch {
                              // ignore for now
                            }
                          }}
                        >
                          <Text style={styles.actionTextDark}>Татгалзах</Text>
                        </Pressable>
                      </View>
                    ) : null}
                  </View>
                );
              })
            )}
          </View>
        ) : (
          <View style={styles.detailScreen}>
            <View style={styles.detailHeader}>
              <Pressable
                onPress={() => setShowDetail(false)}
                hitSlop={10}
                style={styles.backButton}
              >
                <LeftArrowIcon width={20} height={20} />
              </Pressable>
              <Text style={styles.detailTitle}>
                Захиалгын дэлгэрэнгүй мэдээлэл
              </Text>
            </View>

            <View style={styles.profileCard}>
              <View style={styles.profileTop}>
                <View style={styles.avatar}>
                  <Image
                    source={{
                      uri: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
                    }}
                    style={styles.avatarImage}
                  />
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>
                    {isWorkerView
                      ? customer?.name ?? "Хэрэглэгч"
                      : worker?.name ?? "Засварчин"}
                  </Text>
                  <Text style={styles.profileRole}>
                    {isWorkerView
                      ? "Захиалагч"
                      : selectedOrder?.service_label
                        ? `${selectedOrder.service_label} мэргэжилтэн`
                        : selectedOrder?.service_key
                          ? `${serviceLabels[selectedOrder.service_key] ?? selectedOrder.service_key} мэргэжилтэн`
                          : "Мэргэжилтэн"}
                  </Text>
                </View>
                {!isWorkerView ? (
                  <View style={styles.ratingWrap}>
                    <Text style={styles.star}>★</Text>
                    <Text style={styles.ratingText}>
                      {typeof worker?.rating === "number"
                        ? worker.rating.toFixed(1)
                        : "—"}
                    </Text>
                  </View>
                ) : null}
              </View>

              {!isWorkerView ? (
                <View style={styles.profileStats}>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Захиалга</Text>
                    <Text style={styles.statValue}>
                      {typeof worker?.orders === "number" ? worker.orders : "—"}
                    </Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Ажилласан жил</Text>
                    <Text style={styles.statValue}>
                      {typeof worker?.years === "number"
                        ? `${worker.years} жил`
                        : "—"}
                    </Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={styles.statLabel}>Үйлчлэх бүс</Text>
                    <Text
                      style={[styles.statValue, styles.statValueArea]}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {worker ? formatAreas(worker.areas) : "—"}
                    </Text>
                  </View>
                </View>
              ) : null}

              {isWorkerLoading ? (
                <Text style={styles.workerStatusText}>Ачаалж байна...</Text>
              ) : workerError ? (
                <Text style={styles.workerStatusText}>{workerError}</Text>
              ) : null}

              <View style={styles.profileActions}>
                <Pressable
                  style={({ pressed }) => [
                    styles.messageButton,
                    pressed && styles.cardPressed,
                  ]}
                  onPress={() => {
                    if (!selectedOrder?.id) return;
                    router.push({
                      pathname: "/(tabs)/zurwas",
                      params: {
                        orderId: selectedOrder.id,
                        userProfileId: selectedOrder.user_profile_id ?? "",
                        workerProfileId: selectedOrder.worker_profile_id ?? "",
                      },
                    });
                  }}
                >
                  <Text style={styles.messageText}>Зурвас</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.callButton,
                    pressed && styles.callPressed,
                  ]}
                >
                  <CallIcon width={22} height={22} color="#FFFFFF" />
                </Pressable>
              </View>
            </View>

            {profileRole === "worker" ? (
              <View style={styles.profileCard}>
                <Text style={styles.sectionTitleSmall}>Хэрэглэгчийн мэдээлэл</Text>
                {isCustomerLoading ? (
                  <Text style={styles.workerStatusText}>Ачаалж байна...</Text>
                ) : customerError ? (
                  <Text style={styles.workerStatusText}>{customerError}</Text>
                ) : (
                  <>
                    <View style={styles.statRow}>
                      <Text style={styles.statLabel}>Нэр</Text>
                      <Text style={styles.statValue}>
                        {customer?.name ?? "—"}
                      </Text>
                    </View>
                    <View style={styles.statRow}>
                      <Text style={styles.statLabel}>Утас</Text>
                      <Text style={styles.statValue}>
                        {customer?.phone ?? "—"}
                      </Text>
                    </View>
                    <View style={styles.statRow}>
                      <Text style={styles.statLabel}>И-мэйл</Text>
                      <Text style={styles.statValue}>
                        {customer?.email ?? "—"}
                      </Text>
                    </View>
                  </>
                )}
              </View>
            ) : null}

            {profileRole === "worker" ? (
              <View style={styles.profileCard}>
                <Text style={styles.sectionTitleSmall}>Хаяг</Text>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Дүүрэг</Text>
                  <Text style={styles.statValue}>
                    {selectedOrder?.district ?? "—"}
                  </Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Хороо</Text>
                  <Text style={styles.statValue}>
                    {selectedOrder?.khoroo ?? "—"}
                  </Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>Хаяг</Text>
                  <Text style={styles.statValue}>
                    {selectedOrder?.address ?? "—"}
                  </Text>
                </View>
              </View>
            ) : null}

            {profileRole === "worker" ? (
              <View style={styles.profileCard}>
                <Text style={styles.sectionTitleSmall}>Тайлбар</Text>
                <Text style={styles.descriptionText}>
                  {selectedOrder?.description?.trim() || "Тайлбаргүй."}
                </Text>
              </View>
            ) : null}

            {profileRole === "worker" ? (
              <View style={styles.profileCard}>
                <Text style={styles.sectionTitleSmall}>Зураг</Text>
                {attachments.length === 0 ? (
                  <Text style={styles.descriptionMuted}>Зураг хавсаргаагүй.</Text>
                ) : (
                  <View style={styles.attachmentRow}>
                    {attachments.map((uri, index) => (
                      <Image
                        key={`${uri}-${index}`}
                        source={{ uri }}
                        style={styles.attachmentImage}
                      />
                    ))}
                  </View>
                )}
              </View>
            ) : null}

            <View style={styles.statusCard}>
              <Text style={styles.statusTitle}>Статус</Text>
              {timeline.map((item, index) => {
                const isLast = index === timeline.length - 1;
                return (
                  <View key={item.title} style={styles.statusRow}>
                    <View style={styles.statusLeft}>
                      <View
                        style={[
                          styles.statusDot,
                          item.active && styles.statusDotActive,
                        ]}
                      />
                      {!isLast && <View style={styles.statusLine} />}
                    </View>
                    <View style={styles.statusRight}>
                      <Text
                        style={[
                          styles.statusText,
                          item.active && styles.statusTextActive,
                        ]}
                      >
                        {item.title}
                      </Text>
                      <Text style={styles.statusTime}>{item.time}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

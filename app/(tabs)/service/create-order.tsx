import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState, useEffect } from "react";
import {
  Pressable,
  Platform,
  ScrollView,
  Text,
  TextInput,
  Modal,
  View,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSupabaseAuth } from "@/lib/supabase-auth";
import { styles } from "./create-order.styles";

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

const makeKhoroos = (count: number) =>
  Array.from({ length: count }, (_, index) => `${index + 1}-р хороо`);

const districts = [
  { name: "Багануур", khoroos: makeKhoroos(5) },
  { name: "Багахангай", khoroos: makeKhoroos(2) },
  { name: "Баянгол", khoroos: makeKhoroos(10) },
  { name: "Баянзүрх", khoroos: makeKhoroos(10) },
  { name: "Налайх", khoroos: makeKhoroos(8) },
  { name: "Сонгинохайрхан", khoroos: makeKhoroos(10) },
  { name: "Сүхбаатар", khoroos: makeKhoroos(10) },
  { name: "Хан-Уул", khoroos: makeKhoroos(10) },
  { name: "Чингэлтэй", khoroos: makeKhoroos(10) },
];

export default function CreateOrderScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, isLoaded: isUserLoaded } = useSupabaseAuth();
  const apiBaseUrl =
    process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
  const params = useLocalSearchParams<{
    type?: string;
    typeKey?: string;
    typeLabel?: string;
    date?: string;
    district?: string;
    khoroo?: string;
    address?: string;
    description?: string;
    urgency?: string;
    selectedWorkerId?: string;
    selectedWorkerName?: string;
    selectedWorkerRating?: string;
    selectedWorkerOrders?: string;
    selectedWorkerYears?: string;
    selectedWorkerAreas?: string;
    selectedWorkerAvatar?: string;
  }>();
  const [date, setDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());
  const [district, setDistrict] = useState("");
  const [khoroo, setKhoroo] = useState("");
  const [showDistrictPicker, setShowDistrictPicker] = useState(false);
  const [showKhorooPicker, setShowKhorooPicker] = useState(false);
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState<"normal" | "urgent" | null>(null);
  const [errors, setErrors] = useState<{
    service?: string;
    date?: string;
    district?: string;
    khoroo?: string;
    address?: string;
    description?: string;
    urgency?: string;
  }>({});
  const [selectedWorker, setSelectedWorker] = useState<{
    id: string;
    name: string;
    rating?: number | null;
    orders?: number | null;
    years?: number | null;
    areas: string[];
    avatarUrl?: string | null;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const minimumDate = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }, []);

  const serviceParamLabel =
    typeof params.typeLabel === "string"
      ? params.typeLabel
      : typeof params.type === "string"
        ? params.type
        : "";
  const serviceParamKey =
    typeof params.typeKey === "string" ? params.typeKey : "";
  const selectedService = useMemo(() => {
    if (serviceParamKey) {
      return services.find((item) => item.key === serviceParamKey) ?? services[0];
    }
    return services.find((item) => item.label === serviceParamLabel) ?? services[0];
  }, [serviceParamKey, serviceParamLabel]);
  const isServiceParamValid = !serviceParamLabel
    ? true
    : services.some((item) => item.label === serviceParamLabel);

  const khorooOptions = useMemo(() => {
    return districts.find((item) => item.name === district)?.khoroos ?? [];
  }, [district]);

  const formattedDate = useMemo(() => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}/${month}/${day}`;
  }, [date]);

  const apiDate = useMemo(() => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, [date]);

  const normalizeToMinimum = (value: Date) =>
    value < minimumDate ? minimumDate : value;

  const openDatePicker = () => {
    const baseDate = date ?? minimumDate;
    setTempDate(normalizeToMinimum(baseDate));
    setShowDatePicker(true);
  };

  const closeDatePicker = () => setShowDatePicker(false);

  const confirmDatePicker = () => {
    setDate(tempDate);
    setShowDatePicker(false);
    setErrors((prev) => ({ ...prev, date: undefined }));
  };

  const handleDateChange = (_event: unknown, selectedDate?: Date) => {
    if (!selectedDate) return;
    const nextDate = normalizeToMinimum(selectedDate);
    if (Platform.OS === "ios") {
      setTempDate(nextDate);
      return;
    }
    setDate(nextDate);
    setShowDatePicker(false);
    setErrors((prev) => ({ ...prev, date: undefined }));
  };

  const handleSelectDistrict = (value: string) => {
    setDistrict(value);
    setKhoroo("");
    setShowDistrictPicker(false);
    setErrors((prev) => ({ ...prev, district: undefined, khoroo: undefined }));
  };

  const handleSelectKhoroo = (value: string) => {
    setKhoroo(value);
    setShowKhorooPicker(false);
    setErrors((prev) => ({ ...prev, khoroo: undefined }));
  };

  const validateForm = () => {
    const nextErrors: {
      service?: string;
      date?: string;
      district?: string;
      khoroo?: string;
      address?: string;
      description?: string;
      urgency?: string;
    } = {};

    if (!isServiceParamValid || !selectedService?.key) {
      nextErrors.service = "Үйлчилгээний төрөл буруу байна.";
    }

    if (!date) {
      nextErrors.date = "Огноо сонгоно уу.";
    } else if (date < minimumDate) {
      nextErrors.date = "Өнөөдрөөс өмнөх огноо сонгох боломжгүй.";
    }

    if (!district) {
      nextErrors.district = "Дүүрэг сонгоно уу.";
    }

    if (!khoroo) {
      nextErrors.khoroo = "Хороо сонгоно уу.";
    }

    if (!address.trim()) {
      nextErrors.address = "Дэлгэрэнгүй хаяг бичнэ үү.";
    }

    if (!description.trim()) {
      nextErrors.description = "Тайлбар бичнэ үү.";
    }

    if (!urgency) {
      nextErrors.urgency = "Яаралтай эсэхийг сонгоно уу.";
    }

    return nextErrors;
  };

  const fetchUserProfileId = async () => {
    const email = user?.email?.trim();
    if (!email) {
      throw new Error("Хэрэглэгчийн имэйл олдсонгүй.");
    }

    const response = await fetch(
      `${apiBaseUrl}/profiles?email=${encodeURIComponent(email)}`,
    );
    if (!response.ok) {
      throw new Error(`Профайл татах үед алдаа гарлаа. HTTP ${response.status}`);
    }
    const payload = await response.json().catch(() => null);
    const data = payload?.data;
    if (!data?.id) {
      throw new Error("Хэрэглэгчийн профайл олдсонгүй.");
    }
    return data.id as string;
  };

  const handlePrimaryAction = async () => {
    const nextErrors = validateForm();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (selectedWorker?.id) {
      if (!isUserLoaded) return;
      setIsSubmitting(true);
      setSubmitError(null);
      try {
        const userProfileId = await fetchUserProfileId();
        const payload = {
          service_key: selectedService.key,
          service_label: selectedService.label,
          scheduled_date: apiDate,
          district,
          khoroo,
          address: address.trim(),
          description: description.trim(),
          urgency: urgency ?? "normal",
          user_profile_id: userProfileId,
          worker_profile_id: selectedWorker.id,
        };

        const response = await fetch(`${apiBaseUrl}/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const result = await response.json().catch(() => null);
        if (!response.ok) {
          const message =
            result?.error ?? result?.message ?? `HTTP ${response.status}`;
          throw new Error(message);
        }

        router.push("/(tabs)/order");
      } catch (err) {
        setSubmitError(
          err instanceof Error ? err.message : "Хадгалах үед алдаа гарлаа.",
        );
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    router.push({
      pathname: "/service/select-repairman",
      params: {
        typeKey: selectedService.key,
        typeLabel: selectedService.label,
        district,
        date: apiDate,
        khoroo,
        address,
        description,
        urgency: urgency ?? "",
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
    const paramDate = typeof params.date === "string" ? params.date : "";
    if (!date && paramDate) {
      const parsed = new Date(`${paramDate}T00:00:00`);
      if (!Number.isNaN(parsed.getTime())) setDate(parsed);
    }
    if (!district && typeof params.district === "string") {
      setDistrict(params.district);
    }
    if (!khoroo && typeof params.khoroo === "string") {
      setKhoroo(params.khoroo);
    }
    if (!address && typeof params.address === "string") {
      setAddress(params.address);
    }
    if (!description && typeof params.description === "string") {
      setDescription(params.description);
    }
    if (!urgency && typeof params.urgency === "string") {
      const nextUrgency =
        params.urgency === "urgent" || params.urgency === "normal"
          ? params.urgency
          : null;
      if (nextUrgency) setUrgency(nextUrgency);
    }

    if (typeof params.selectedWorkerId === "string") {
      const areas = normalizeList(params.selectedWorkerAreas);
      const rating =
        typeof params.selectedWorkerRating === "string" &&
        params.selectedWorkerRating.trim()
          ? Number(params.selectedWorkerRating)
          : null;
      const orders =
        typeof params.selectedWorkerOrders === "string" &&
        params.selectedWorkerOrders.trim()
          ? Number(params.selectedWorkerOrders)
          : null;
      const years =
        typeof params.selectedWorkerYears === "string" &&
        params.selectedWorkerYears.trim()
          ? Number(params.selectedWorkerYears)
          : null;
      setSelectedWorker({
        id: params.selectedWorkerId,
        name: typeof params.selectedWorkerName === "string"
          ? params.selectedWorkerName
          : "Засварчин",
        rating: Number.isFinite(rating) ? rating : null,
        orders: Number.isFinite(orders) ? orders : null,
        years: Number.isFinite(years) ? years : null,
        areas,
        avatarUrl:
          typeof params.selectedWorkerAvatar === "string"
            ? params.selectedWorkerAvatar
            : null,
      });
    }
  }, [
    params.address,
    params.date,
    params.description,
    params.district,
    params.khoroo,
    params.selectedWorkerAreas,
    params.selectedWorkerAvatar,
    params.selectedWorkerId,
    params.selectedWorkerName,
    params.selectedWorkerOrders,
    params.selectedWorkerRating,
    params.selectedWorkerYears,
    params.urgency,
    address,
    date,
    description,
    district,
    khoroo,
    urgency,
  ]);

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
        {errors.service && <Text style={styles.errorText}>{errors.service}</Text>}

        <Text style={styles.label}>Он/сар/өдөр</Text>
        <Pressable
          style={[
            styles.input,
            styles.dateInput,
            errors.date && styles.inputError,
          ]}
          onPress={openDatePicker}
        >
          <Text
            style={[
              styles.dateText,
              !formattedDate && styles.placeholderText,
            ]}
          >
            {formattedDate || "Он/сар/өдөр сонгох"}
          </Text>
          <MaterialCommunityIcons name="calendar-month" size={20} color="#9B9B9B" />
        </Pressable>
        {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
        {showDatePicker && Platform.OS !== "ios" && (
          <DateTimePicker
            value={date ?? new Date()}
            mode="date"
            display="default"
            minimumDate={minimumDate}
            onChange={handleDateChange}
          />
        )}
        {Platform.OS === "ios" && (
          <Modal
            visible={showDatePicker}
            transparent
            animationType="fade"
            onRequestClose={closeDatePicker}
          >
            <View style={styles.dateModalOverlay}>
              <View style={styles.dateModalCard}>
                <View style={styles.dateModalHeader}>
                  <Pressable onPress={closeDatePicker} hitSlop={10}>
                    <Text style={styles.dateModalCancel}>Болих</Text>
                  </Pressable>
                  <Text style={styles.dateModalTitle}>Огноо сонгох</Text>
                  <Pressable onPress={confirmDatePicker} hitSlop={10}>
                    <Text style={styles.dateModalDone}>Болсон</Text>
                  </Pressable>
                </View>
                <DateTimePicker
                  value={tempDate}
                  mode="date"
                  display="spinner"
                  minimumDate={minimumDate}
                  onChange={handleDateChange}
                />
              </View>
            </View>
          </Modal>
        )}

        <Text style={styles.label}>Байршил</Text>
        <Pressable
          style={[
            styles.input,
            styles.selectInput,
            errors.district && styles.inputError,
          ]}
          onPress={() => setShowDistrictPicker(true)}
        >
          <Text
            style={[
              styles.selectText,
              !district && styles.placeholderText,
            ]}
          >
            {district || "Дүүрэг сонгох"}
          </Text>
          <MaterialCommunityIcons name="chevron-down" size={20} color="#9B9B9B" />
        </Pressable>
        {errors.district && <Text style={styles.errorText}>{errors.district}</Text>}
        <Pressable
          style={[
            styles.input,
            styles.selectInput,
            !district && styles.selectDisabled,
            errors.khoroo && styles.inputError,
          ]}
          onPress={() => district && setShowKhorooPicker(true)}
          disabled={!district}
        >
          <Text
            style={[
              styles.selectText,
              !khoroo && styles.placeholderText,
            ]}
          >
            {khoroo || "Хороо сонгох"}
          </Text>
          <MaterialCommunityIcons name="chevron-down" size={20} color="#9B9B9B" />
        </Pressable>
        {errors.khoroo && <Text style={styles.errorText}>{errors.khoroo}</Text>}
        <Modal
          visible={showDistrictPicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDistrictPicker(false)}
        >
          <View style={styles.selectOverlay}>
            <View style={styles.selectCard}>
              <View style={styles.selectHeader}>
                <Text style={styles.selectTitle}>Дүүрэг сонгох</Text>
                <Pressable onPress={() => setShowDistrictPicker(false)} hitSlop={10}>
                  <Text style={styles.selectClose}>Хаах</Text>
                </Pressable>
              </View>
              <ScrollView>
                {districts.map((item) => (
                  <Pressable
                    key={item.name}
                    style={[
                      styles.optionRow,
                      district === item.name && styles.optionRowSelected,
                    ]}
                    onPress={() => handleSelectDistrict(item.name)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        district === item.name && styles.optionTextSelected,
                      ]}
                    >
                      {item.name}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
        <Modal
          visible={showKhorooPicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowKhorooPicker(false)}
        >
          <View style={styles.selectOverlay}>
            <View style={styles.selectCard}>
              <View style={styles.selectHeader}>
                <Text style={styles.selectTitle}>Хороо сонгох</Text>
                <Pressable onPress={() => setShowKhorooPicker(false)} hitSlop={10}>
                  <Text style={styles.selectClose}>Хаах</Text>
                </Pressable>
              </View>
              <ScrollView>
                {khorooOptions.map((item) => (
                  <Pressable
                    key={item}
                    style={[
                      styles.optionRow,
                      khoroo === item && styles.optionRowSelected,
                    ]}
                    onPress={() => handleSelectKhoroo(item)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        khoroo === item && styles.optionTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
        <TextInput
          placeholder="Дэлгэрэнгүй хаяг (орц, давхар, код)"
          placeholderTextColor="#A3A3A3"
          style={[styles.input, errors.address && styles.inputError]}
          value={address}
          onChangeText={(value) => {
            setAddress(value);
            if (errors.address) {
              setErrors((prev) => ({ ...prev, address: undefined }));
            }
          }}
        />
        {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

        <Text style={styles.label}>Тайлбар</Text>
        <TextInput
          placeholder="Тайлбар бичнэ үү"
          placeholderTextColor="#A3A3A3"
          style={[
            styles.input,
            styles.textArea,
            errors.description && styles.inputError,
          ]}
          multiline
          value={description}
          onChangeText={(value) => {
            setDescription(value);
            if (errors.description) {
              setErrors((prev) => ({ ...prev, description: undefined }));
            }
          }}
        />
        {errors.description && (
          <Text style={styles.errorText}>{errors.description}</Text>
        )}

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
              errors.urgency && styles.inputError,
            ]}
            onPress={() => {
              setUrgency("normal");
              if (errors.urgency) {
                setErrors((prev) => ({ ...prev, urgency: undefined }));
              }
            }}
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
              errors.urgency && styles.inputError,
            ]}
            onPress={() => {
              setUrgency("urgent");
              if (errors.urgency) {
                setErrors((prev) => ({ ...prev, urgency: undefined }));
              }
            }}
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
        {errors.urgency && (
          <Text style={styles.errorTextBelow}>{errors.urgency}</Text>
        )}

        {selectedWorker ? (
          <>
            <Text style={styles.label}>Засварчин</Text>
            <View style={styles.workerCard}>
              <View style={styles.workerTopRow}>
                <View style={styles.workerAvatar}>
                  <Image
                    source={{
                      uri:
                        selectedWorker.avatarUrl ??
                        "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
                    }}
                    style={styles.workerAvatarImage}
                  />
                </View>
                <View style={styles.workerTitleBlock}>
                  <Text style={styles.workerName}>{selectedWorker.name}</Text>
                  <Text style={styles.workerSubtitle}>
                    {selectedService.label} мэргэжилтэн
                  </Text>
                </View>
                <View style={styles.workerRating}>
                  <MaterialCommunityIcons name="star" size={16} color="#F59E0B" />
                  <Text style={styles.workerRatingText}>
                    {typeof selectedWorker.rating === "number"
                      ? selectedWorker.rating.toFixed(1)
                      : "—"}
                  </Text>
                </View>
              </View>

              <View style={styles.workerInfoRow}>
                <Text style={styles.workerInfoLabel}>Захиалга</Text>
                <Text style={styles.workerInfoValue}>
                  {typeof selectedWorker.orders === "number"
                    ? selectedWorker.orders
                    : "—"}
                </Text>
              </View>
              <View style={styles.workerInfoRow}>
                <Text style={styles.workerInfoLabel}>Ажилласан жил</Text>
                <Text style={styles.workerInfoValue}>
                  {typeof selectedWorker.years === "number"
                    ? `${selectedWorker.years} жил`
                    : "—"}
                </Text>
              </View>
              <View style={styles.workerInfoRow}>
                <Text style={styles.workerInfoLabel}>Үйлчлэх бүс</Text>
                <Text style={styles.workerInfoValue}>
                  {formatAreas(selectedWorker.areas)}
                </Text>
              </View>
            </View>
          </>
        ) : null}

        {submitError ? (
          <Text style={styles.errorText}>{submitError}</Text>
        ) : null}

        <Pressable
          style={[
            styles.submitButton,
            selectedWorker && styles.submitButtonSelected,
            isSubmitting && { opacity: 0.7 },
          ]}
          onPress={handlePrimaryAction}
          disabled={isSubmitting}
        >
          <Text style={styles.submitText}>
            {isSubmitting
              ? "Илгээж байна..."
              : selectedWorker
                ? "Захиалгын хүсэлт илгээх"
                : "Засварчин сонгох"}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

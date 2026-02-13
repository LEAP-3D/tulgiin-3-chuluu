import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Pressable,
  Platform,
  ScrollView,
  Text,
  TextInput,
  Modal,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
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
  const params = useLocalSearchParams<{ type?: string }>();
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

  const minimumDate = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }, []);

  const selectedService = useMemo(() => {
    const label = typeof params.type === "string" ? params.type : "";
    return services.find((item) => item.label === label) ?? services[0];
  }, [params.type]);

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
  };

  const handleSelectDistrict = (value: string) => {
    setDistrict(value);
    setKhoroo("");
    setShowDistrictPicker(false);
  };

  const handleSelectKhoroo = (value: string) => {
    setKhoroo(value);
    setShowKhorooPicker(false);
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
        <Pressable
          style={[styles.input, styles.dateInput]}
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
          style={[styles.input, styles.selectInput]}
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
        <Pressable
          style={[
            styles.input,
            styles.selectInput,
            !district && styles.selectDisabled,
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

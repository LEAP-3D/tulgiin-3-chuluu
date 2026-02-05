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
import TsahilgaanIcon from "@/components/icons/_serviceIcons/tsahilgaanIcon";
import SantehnikIcon from "@/components/icons/_serviceIcons/santehnikIcon";
import TsoojIcon from "@/components/icons/_serviceIcons/tsoojIcon";
import BudagIcon from "@/components/icons/_serviceIcons/budagIcon";
import MujaanIcon from "@/components/icons/_serviceIcons/mujaanIcon";
import ShawijustgalIcon from "@/components/icons/_serviceIcons/shawijustgalIcon";
import HalaaltIcon from "@/components/icons/_serviceIcons/halaaltIcon";
import InternetIcon from "@/components/icons/_serviceIcons/internetIcon";
import AgaarjuulaltIcon from "@/components/icons/_serviceIcons/agaarjuulaltIcon";
import AyulgviBaidalIcon from "@/components/icons/_serviceIcons/ayulgvibaidalIcon";
import ShiltoliIcon from "@/components/icons/_serviceIcons/shiltoliIcon";
import TawilgaIcon from "@/components/icons/_serviceIcons/tawilgaIcon";
import ShalIcon from "@/components/icons/_serviceIcons/shalIcon";
import DeewerIcon from "@/components/icons/_serviceIcons/deewerIcon";
import NvvlgeltIcon from "@/components/icons/_serviceIcons/nvvlgeltIcon";
import GadnatalbaiIcon from "@/components/icons/_serviceIcons/gadnatalbaiIcon";
import LeftArrowIcon from "@/components/icons/_serviceIcons/leftarrowIcon";
import SearchIcon from "@/components/icons/_serviceIcons/searchIcon";

const services = [
  { key: "electric", label: "Цахилгаан", Icon: TsahilgaanIcon },
  { key: "plumbing", label: "Сантехник", Icon: SantehnikIcon },
  { key: "lock", label: "Цоож", Icon: TsoojIcon },
  { key: "paint", label: "Будаг", Icon: BudagIcon },
  { key: "carpenter", label: "Мужаан", Icon: MujaanIcon },
  { key: "clean", label: "Ариутгал", Icon: ShawijustgalIcon },
  { key: "heat", label: "Халаалт", Icon: HalaaltIcon },
  { key: "internet", label: "Интернет", Icon: InternetIcon },
  { key: "ac", label: "Агааржуулалт", Icon: AgaarjuulaltIcon },
  { key: "security", label: "Аюулгүй байдал", Icon: AyulgviBaidalIcon },
  { key: "glass", label: "Шил, толь", Icon: ShiltoliIcon },
  { key: "furniture", label: "Тавилга", Icon: TawilgaIcon },
  { key: "floor", label: "Шал", Icon: ShalIcon },
  { key: "roof", label: "Дээвэр", Icon: DeewerIcon },
  { key: "moving", label: "Нүүлгэлт", Icon: NvvlgeltIcon },
  { key: "garden", label: "Гадна талбай", Icon: GadnatalbaiIcon },
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
            <LeftArrowIcon width={22} height={22} />
          </Pressable>
          <View style={styles.searchInputWrap}>
            <SearchIcon width={20} height={20} />
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
                <item.Icon width={26} height={26} />
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

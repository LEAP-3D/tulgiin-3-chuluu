import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import TsahilgaanIcon from "@/components/icons/_serviceIcons/tsahilgaanIcon";
import SantehnikIcon from "@/components/icons/_serviceIcons/santehnikIcon";
import TsoojIcon from "@/components/icons/_serviceIcons/tsoojIcon";
import BudagIcon from "@/components/icons/_serviceIcons/budagIcon";
import MujaanIcon from "@/components/icons/_serviceIcons/mujaanIcon";
import ShawijustgalIcon from "@/components/icons/_serviceIcons/shawijustgalIcon";
import HalaaltIcon from "@/components/icons/_serviceIcons/halaaltIcon";
import InternetIcon from "@/components/icons/_serviceIcons/internetIcon";
import SparklesIcon from "@/components/icons/_serviceIcons/sparklesIcon";

const services = [
  { key: "electric", label: "Цахилгаан", Icon: TsahilgaanIcon },
  { key: "plumbing", label: "Сантехник", Icon: SantehnikIcon },
  { key: "lock", label: "Цоож", Icon: TsoojIcon },
  { key: "paint", label: "Будаг", Icon: BudagIcon },
  { key: "carpenter", label: "Мужаан", Icon: MujaanIcon },
  { key: "clean", label: "Ариутгал", Icon: ShawijustgalIcon },
  { key: "heat", label: "Халаалт", Icon: HalaaltIcon },
  { key: "internet", label: "Интернет", Icon: InternetIcon },
];

const promoSlides = [
  {
    key: "app",
    title: "Монголын анхны",
    accent: "засвар үйлчилгээний",
    tail: "аппликейшн",
    background: "#FFF6EC",
  },
  {
    key: "fast",
    title: "Хурдан бөгөөд",
    accent: "найдвартай",
    tail: "үйлчилгээ",
    background: "#FFF3E4",
  },
  {
    key: "trusted",
    title: "Итгэмжлэгдсэн",
    accent: "мэргэжлийн",
    tail: "засварчид",
    background: "#FFF1E0",
  },
];

export default function ServiceScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const handleServicePress = (label: string) => {
    router.push({ pathname: "/service/create-order", params: { type: label } });
  };
  const { width } = useWindowDimensions();
  const cardWidth = width - 40;
  const promoRef = useRef<ScrollView>(null);
  const promoIndexRef = useRef(0);
  const [promoIndex, setPromoIndex] = useState(0);

  const updatePromoIndex = (nextIndex: number) => {
    promoIndexRef.current = nextIndex;
    setPromoIndex(nextIndex);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (promoIndexRef.current + 1) % promoSlides.length;
      promoRef.current?.scrollTo({ x: nextIndex * cardWidth, animated: true });
      updatePromoIndex(nextIndex);
    }, 3500);

    return () => clearInterval(interval);
  }, [cardWidth]);

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
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Үйлчилгээ</Text>
          <Pressable
            onPress={() => router.push("/service/all")}
            hitSlop={10}
          >
            <Text style={styles.sectionAll}>Бүгд</Text>
          </Pressable>
        </View>

        <View style={styles.grid}>
          {services.map((item) => (
            <Pressable
              key={item.key}
              style={styles.gridItem}
              onPress={() => handleServicePress(item.label)}
            >
              <View style={styles.iconWrap}>
                <item.Icon width={28} height={28} />
              </View>
              <Text style={styles.iconLabel}>{item.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.promoCarousel}>
          <ScrollView
            ref={promoRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            onMomentumScrollEnd={(event) => {
              const nextIndex = Math.round(
                event.nativeEvent.contentOffset.x / cardWidth
              );
              updatePromoIndex(nextIndex);
            }}
          >
            {promoSlides.map((item) => (
              <View
                key={item.key}
                style={[
                  styles.promoCard,
                  { width: cardWidth, backgroundColor: item.background },
                ]}
              >
                <View style={styles.promoText}>
                  <Text style={styles.promoTitle}>
                    {item.title}
                    {"\n"}
                    <Text style={styles.promoAccent}>{item.accent}</Text>
                    {"\n"}
                    {item.tail}
                  </Text>
                </View>
                <View style={styles.phoneWrap}>
                  <View style={styles.phone}>
                    <View style={styles.phoneNotch} />
                    <View style={styles.phoneScreen}>
                      <View style={styles.phoneHeader} />
                      <View style={styles.phoneRow} />
                      <View style={styles.phoneRowSmall} />
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.dots}>
          {promoSlides.map((item, index) => (
            <View
              key={item.key}
              style={[styles.dot, index === promoIndex && styles.dotActive]}
            />
          ))}
        </View>
      </ScrollView>

      <Pressable
        style={[styles.fab, { bottom: 24 + insets.bottom }]}
        onPress={() => console.log("fab")}
      >
        <SparklesIcon width={26} height={26} />
      </Pressable>
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F1F1F",
  },
  sectionAll: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F59E0B",
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
  promoCard: {
    backgroundColor: "#FFF6EC",
    borderRadius: 18,
    padding: 18,
    minHeight: 150,
    overflow: "hidden",
  },
  promoCarousel: {
    marginTop: 8,
  },
  promoText: {
    paddingRight: 120,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E1E1E",
    lineHeight: 24,
  },
  promoAccent: {
    color: "#F59E0B",
  },
  phoneWrap: {
    position: "absolute",
    right: 14,
    bottom: -8,
  },
  phone: {
    width: 120,
    height: 210,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#E6E6E6",
    backgroundColor: "#FFFFFF",
    padding: 8,
  },
  phoneNotch: {
    position: "absolute",
    top: 8,
    alignSelf: "center",
    width: 46,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1A1A1A",
  },
  phoneScreen: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: "#F2F2F2",
    paddingTop: 22,
    paddingHorizontal: 6,
  },
  phoneHeader: {
    height: 10,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
    marginBottom: 10,
  },
  phoneRow: {
    height: 56,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
  },
  phoneRowSmall: {
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
  },
  dots: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 14,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E0E0E0",
    marginRight: 6,
  },
  dotActive: {
    width: 18,
    backgroundColor: "#F8A13A",
  },
  fab: {
    position: "absolute",
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
});

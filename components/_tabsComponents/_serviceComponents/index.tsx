import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Pressable,
  ScrollView,
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
import ScreenShotIcon from "@/components/icons/screenshot";
import { styles } from "./index.styles";

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
                <View style={styles.screenshotWrap}>
                  <ScreenShotIcon width={140} height={180} />
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
        onPress={() => router.push("/modal")}
      >
        <SparklesIcon width={26} height={26} />
      </Pressable>
    </View>
  );
}

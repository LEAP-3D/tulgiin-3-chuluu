import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { HOME_CARE_TIPS } from "@/constants/home-care-tips";
import { styles } from "./index.styles";

export function HomeCareTipsSection() {
  const router = useRouter();
  const homeCareTips = HOME_CARE_TIPS.slice(0, 2);

  return (
    <View style={styles.tipsSection}>
      <View style={styles.tipsHeader}>
        <Text style={styles.tipsTitle}>Гэрийн арчилгааны зөвлөгөө</Text>
        <Pressable onPress={() => router.push("/service/tips")} hitSlop={8}>
          <Text style={styles.tipsHeaderArrow}>›</Text>
        </Pressable>
      </View>

      <View style={styles.tipsBoard}>
        <View style={styles.tipsRow}>
          {homeCareTips.map((item, index) => (
            <Pressable
              key={item.id}
              style={[styles.tipCard, index === 0 && styles.tipCardGap]}
              onPress={() =>
                router.push({ pathname: "/service/tips/[id]", params: { id: item.id } })
              }
            >
              <View style={styles.tipImageWrap}>
                <item.Icon width={44} height={44} />
              </View>

              <Text style={styles.tipTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.tipSubtitle} numberOfLines={2}>
                {item.subtitle}
              </Text>

              <Pressable
                style={styles.tipFooter}
                onPress={() =>
                  router.push({ pathname: "/service/tips/[id]", params: { id: item.id } })
                }
                hitSlop={6}
              >
                <Text style={styles.tipRead}>Унших</Text>
                <Text style={styles.tipFooterArrow}>›</Text>
              </Pressable>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

import { useRouter } from "expo-router";
import { ScrollView, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LeftArrowIcon from "@/components/icons/_serviceIcons/leftarrowIcon";
import { HOME_CARE_TIPS } from "@/constants/home-care-tips";
import { styles } from "./tips.styles";

export default function TipsListScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={styles.divider} />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 24 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={8}>
            <LeftArrowIcon width={20} height={20} />
          </Pressable>
          <Text style={styles.title}>Гэрийн арчилгааны зөвлөгөө</Text>
        </View>

        {HOME_CARE_TIPS.map((tip) => (
          <Pressable
            key={tip.id}
            style={styles.card}
            onPress={() => router.push({ pathname: "/service/tips/[id]", params: { id: tip.id } })}
          >
            <View style={styles.iconWrap}>
              <tip.Icon width={46} height={46} />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{tip.title}</Text>
              <Text style={styles.cardSummary}>{tip.summary}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.read}>Унших</Text>
                <Text style={styles.arrow}>›</Text>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

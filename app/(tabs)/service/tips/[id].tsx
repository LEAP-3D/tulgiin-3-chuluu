import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LeftArrowIcon from "@/components/icons/_serviceIcons/leftarrowIcon";
import { HOME_CARE_TIPS_BY_ID } from "@/constants/home-care-tips";
import { styles } from "./tips.styles";

export default function TipDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id?: string }>();
  const tip = params.id ? HOME_CARE_TIPS_BY_ID[params.id] : undefined;

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
          <Text style={styles.title}>{tip?.title ?? "Зөвлөгөө"}</Text>
        </View>

        {tip ? (
          <View style={styles.detailCard}>
            <View style={styles.detailIconWrap}>
              <tip.Icon width={56} height={56} />
            </View>
            <Text style={styles.detailSubtitle}>{tip.subtitle}</Text>
            <Text style={styles.detailSectionTitle}>Алхамууд</Text>
            {tip.steps.map((step, index) => (
              <View key={step} style={styles.stepRow}>
                <Text style={styles.stepIndex}>{index + 1}.</Text>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Ийм зөвлөгөө олдсонгүй.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

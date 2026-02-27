import { Pressable, ScrollView, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ProfileSkeleton } from "@/components/ScreenSkeletons";
import type { RepairmanProfileController } from "./useRepairmanProfileController";
import { styles } from "../../repairman-profile.styles";
import { ProfileSummary } from "./ProfileSummary";
import { SkillsSection } from "./SkillsSection";
import { ReviewsSection } from "./ReviewsSection";

type Props = {
  controller: RepairmanProfileController;
};

export function RepairmanProfileView({ controller }: Props) {
  const {
    insetsBottom,
    technician,
    subtitle,
    isLoading,
    errorMessage,
    onBack,
    onSelectWorker,
  } = controller;

  return (
    <View style={styles.container}>
      <View style={styles.divider} />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 40 + insetsBottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Pressable onPress={onBack} hitSlop={10} style={styles.backButton}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={22}
              color="#111111"
            />
          </Pressable>
          <Text style={styles.headerTitle}>Засварчны профайл</Text>
        </View>

        {isLoading ? (
          <ProfileSkeleton />
        ) : errorMessage || !technician ? (
          <View style={styles.loadingCard}>
            <Text style={styles.errorTitle}>Алдаа гарлаа.</Text>
            <Text style={styles.errorText}>
              {errorMessage ?? "Мэдээлэл олдсонгүй."}
            </Text>
          </View>
        ) : (
          <>
            <ProfileSummary technician={technician} subtitle={subtitle} />
            <SkillsSection skills={technician.skills} />
            <ReviewsSection />
            <Pressable style={styles.selectButton} onPress={onSelectWorker}>
              <Text style={styles.selectText}>Сонгох</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
}

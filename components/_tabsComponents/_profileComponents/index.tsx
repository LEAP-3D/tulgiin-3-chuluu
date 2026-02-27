import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { styles } from "./index.styles";
import { ProfileEditView } from "./ProfileEditView";
import { ProfileSummaryView } from "./ProfileSummaryView";
import { ProfileSkeleton } from "@/components/ScreenSkeletons";
import type { ProfileScreenProps } from "./types";

export type { ProfileData, ProfileErrors, ProfileField } from "./types";

export default function ProfileScreen({
  profile,
  isEditing,
  onChangeField,
  onAvatarPress,
  onEditPress,
  onSavePress,
  onLogoutPress,
  onRoleSwitchPress,
  onNotificationsPress,
  onCardLinkPress,
  onHelpPress,
  onComplaintPress,
  isSaving,
  errors,
  showErrors,
  isLoadingProfile,
}: ProfileScreenProps) {
  if (isLoadingProfile) {
    return (
      <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
        <ScrollView contentContainerStyle={styles.container}>
          <ProfileSkeleton />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
      {isEditing ? (
        <ProfileEditView
          profile={profile}
          onChangeField={onChangeField}
          onAvatarPress={onAvatarPress}
          onEditPress={onEditPress}
          onSavePress={onSavePress}
          isSaving={isSaving}
          errors={errors}
          showErrors={showErrors}
        />
      ) : (
        <ProfileSummaryView
          profile={profile}
          onEditPress={onEditPress}
          onLogoutPress={onLogoutPress}
          onRoleSwitchPress={onRoleSwitchPress}
          onNotificationsPress={onNotificationsPress}
          onCardLinkPress={onCardLinkPress}
          onHelpPress={onHelpPress}
          onComplaintPress={onComplaintPress}
        />
      )}
    </SafeAreaView>
  );
}

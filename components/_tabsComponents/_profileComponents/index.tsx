import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./index.styles";
import { ProfileEditView } from "./ProfileEditView";
import { ProfileSummaryView } from "./ProfileSummaryView";
import type { ProfileScreenProps } from "./types";

export type { ProfileData, ProfileErrors, ProfileField } from "./types";

export default function ProfileScreen({
  profile,
  isEditing,
  onChangeField,
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
}: ProfileScreenProps) {
  return (
    <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
      {isEditing ? (
        <ProfileEditView
          profile={profile}
          onChangeField={onChangeField}
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

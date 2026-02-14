import { useMemo, useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { useSignOut } from "@/components/sign-out-button";
import type {
  ProfileData,
  ProfileErrors,
  ProfileField,
} from "@/components/_tabsComponents/_profileComponents";
import { buildProfilePayload, getProfileErrors, mergeProfileFromApi } from "./profile-helpers";
import { useProfileData } from "./useProfileData";

export type ProfileController = {
  profile: ProfileData;
  isEditing: boolean;
  isSaving: boolean;
  onChangeField: (field: ProfileField, value: string) => void;
  onEditPress: () => void;
  onSavePress: () => void;
  onLogoutPress: () => void;
  onNotificationsPress: () => void;
  onCardLinkPress: () => void;
  onHelpPress: () => void;
  onComplaintPress: () => void;
  errors: ProfileErrors;
  showErrors: boolean;
};

export function useProfileController(): ProfileController {
  const router = useRouter();
  const apiBaseUrl =
    process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
  const { profile, setProfile, isLoadingProfile } = useProfileData(apiBaseUrl);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasTriedSave, setHasTriedSave] = useState(false);

  const onChangeField = (field: ProfileField, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const validationErrors = useMemo(() => getProfileErrors(profile), [profile]);

  const onEditPress = () => {
    setIsEditing((prev) => {
      const next = !prev;
      if (next) setHasTriedSave(false);
      return next;
    });
  };

  const onSavePress = async () => {
    const hasErrors = Object.keys(validationErrors).length > 0;
    if (hasErrors) {
      setHasTriedSave(true);
      Alert.alert("Алдаа", "Талбаруудыг зөв бөглөнө үү.");
      return;
    }
    setIsSaving(true);
    try {
      const payload = buildProfilePayload(profile);
      const response = await fetch(`${apiBaseUrl}/profiles`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        const message =
          errorPayload?.error ??
          errorPayload?.message ??
          `HTTP ${response.status}`;
        throw new Error(message);
      }

      const result = await response.json().catch(() => null);
      const data = result?.data;
      if (data) {
        setProfile((prev) => mergeProfileFromApi(prev, data));
      }

      setIsEditing(false);
      Alert.alert("Амжилттай", "Профайл хадгалагдлаа.");
    } catch (err) {
      Alert.alert(
        "Алдаа",
        err instanceof Error ? err.message : "Хадгалах үед алдаа гарлаа.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const onLogoutPress = useSignOut();

  return {
    profile,
    isEditing,
    isSaving: isSaving || isLoadingProfile,
    onChangeField,
    onEditPress,
    onSavePress,
    onLogoutPress,
    onNotificationsPress: () => Alert.alert("Мэдэгдэл", "Тун удахгүй."),
    onCardLinkPress: () => Alert.alert("Карт холбох", "Тун удахгүй."),
    onHelpPress: () => router.push("/profile/help"),
    onComplaintPress: () => router.push("/profile/complaint"),
    errors: validationErrors,
    showErrors: isEditing && hasTriedSave,
  };
}

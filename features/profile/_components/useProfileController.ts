import { useMemo, useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useSignOut } from "@/components/sign-out-button";
import type {
  ProfileData,
  ProfileErrors,
  ProfileField,
} from "@/components/_tabsComponents/_profileComponents";
import {
  buildProfilePayload,
  getProfileErrors,
  mergeProfileFromApi,
} from "./profile-helpers";
import { useProfileData } from "./useProfileData";

export type ProfileController = {
  profile: ProfileData;
  isEditing: boolean;
  isSaving: boolean;
  isLoadingProfile: boolean;
  onChangeField: (field: ProfileField, value: string) => void;
  onAvatarPress: () => void;
  onEditPress: () => void;
  onSavePress: () => void;
  onLogoutPress: () => void;
  onRoleSwitchPress: () => void;
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
  const [isSwitchingRole, setIsSwitchingRole] = useState(false);

  const onChangeField = (field: ProfileField, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const onAvatarPress = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Зөвшөөрөл хэрэгтэй",
        "Зураг сонгохын тулд gallery эрх зөвшөөрнө үү.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;
    const uri = result.assets?.[0]?.uri;
    if (!uri) return;
    setProfile((prev) => ({ ...prev, avatarUrl: uri }));
  };

  const validationErrors = useMemo(() => getProfileErrors(profile), [profile]);
  const resolvedRole =
    profile.role ??
    ((profile.workTypes?.length ?? 0) > 0 ||
    (profile.serviceAreas?.length ?? 0) > 0
      ? "worker"
      : "user");

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
      const updateProfile = async (body: Record<string, unknown>) => {
        const response = await fetch(`${apiBaseUrl}/profiles`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const parsed = await response.json().catch(() => null);
        if (!response.ok) {
          const message =
            parsed?.error ?? parsed?.message ?? `HTTP ${response.status}`;
          throw new Error(message);
        }
        return parsed;
      };

      let result: any;
      try {
        result = await updateProfile(payload as Record<string, unknown>);
      } catch (err) {
        const message = (err instanceof Error ? err.message : "").toLowerCase();
        const shouldRetryWithoutAvatar =
          message.includes("avatar_url") ||
          message.includes("validation failed");
        if (!shouldRetryWithoutAvatar) throw err;
        const { avatar_url: _avatarUrl, ...fallbackPayload } =
          payload as Record<string, unknown>;
        result = await updateProfile(fallbackPayload);
      }

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
  const onRoleSwitchPress = async () => {
    const nextRole = resolvedRole === "worker" ? "user" : "worker";
    if (!profile.email.trim()) {
      Alert.alert("Алдаа", "Профайлын имэйл олдсонгүй.");
      return;
    }
    if (nextRole === "worker") {
      const workTypes = profile.workTypes ?? [];
      const serviceAreas = profile.serviceAreas ?? [];
      if (workTypes.length === 0 || serviceAreas.length === 0) {
        Alert.alert(
          "Засварчинаар нэвтрэх",
          "Засварчнаар нэвтрэхийн тулд мэргэжил болон үйлчлэх бүсээ сонгоно уу.",
        );
        return;
      }
    }

    setIsSwitchingRole(true);
    try {
      const response = await fetch(`${apiBaseUrl}/profiles`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: nextRole,
          email: profile.email.trim(),
          phone_number: profile.phone.trim(),
          first_name: profile.firstName.trim(),
          last_name: profile.lastName.trim(),
          ...(nextRole === "worker"
            ? {
                work_types: profile.workTypes ?? [],
                service_area: profile.serviceAreas ?? [],
              }
            : {}),
        }),
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
      } else {
        setProfile((prev) => ({ ...prev, role: nextRole }));
      }
    } catch (err) {
      Alert.alert(
        "Алдаа",
        err instanceof Error ? err.message : "Профайл солих үед алдаа гарлаа.",
      );
    } finally {
      setIsSwitchingRole(false);
    }
  };

  return {
    profile,
    isEditing,
    isSaving: isSaving || isLoadingProfile || isSwitchingRole,
    isLoadingProfile,
    onChangeField,
    onAvatarPress,
    onEditPress,
    onSavePress,
    onLogoutPress,
    onRoleSwitchPress,
    onNotificationsPress: () => Alert.alert("Мэдэгдэл", "Тун удахгүй."),
    onCardLinkPress: () => Alert.alert("Карт холбох", "Тун удахгүй."),
    onHelpPress: () => router.push("/profile/help"),
    onComplaintPress: () => router.push("/profile/complaint"),
    errors: validationErrors,
    showErrors: isEditing && hasTriedSave,
  };
}

import { useMemo, useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useSignOut } from "@/components/sign-out-button";
import { uploadImageToCloudinary } from "@/lib/utils/cloudinary";
import type { ProfileData, ProfileErrors, ProfileField } from "@/components/_tabsComponents/_profileComponents";
import { buildProfilePayload, getProfileErrors, mergeProfileFromApi } from "./profile-helpers";
import { switchProfileRoleRequest, updateProfileRequest } from "./profile-api";
import { setCachedProfileAvatar } from "./profile-avatar-cache";
import { useProfileData } from "./useProfileData";

const PROFILE_AVATAR_FOLDER = process.env.EXPO_PUBLIC_CLOUDINARY_PROFILES_FOLDER?.trim() || process.env.EXPO_PUBLIC_CLOUDINARY_FOLDER?.trim() || "";

export type ProfileController = {
  profile: ProfileData;
  isEditing: boolean;
  isSaving: boolean;
  isUploadingAvatar: boolean;
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
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const onChangeField = (field: ProfileField, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };
  const onAvatarPress = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Зөвшөөрөл хэрэгтэй", "Зураг сонгохын тулд gallery эрх зөвшөөрнө үү.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled) return;
    const asset = result.assets?.[0];
    if (!asset?.uri) return;
    setIsUploadingAvatar(true);
    try {
      const avatarUrl = await uploadImageToCloudinary({
        uri: asset.uri,
        mimeType: asset.mimeType,
        fileName: asset.fileName,
        folder: PROFILE_AVATAR_FOLDER || undefined,
      });
      const email = profile.email?.trim();
      if (email) {
        await setCachedProfileAvatar(email, avatarUrl);
      }
      setProfile((prev) => ({ ...prev, avatarUrl }));
    } catch (err) {
      Alert.alert("Алдаа", err instanceof Error ? err.message : "Зураг upload хийх үед алдаа гарлаа.");
    } finally {
      setIsUploadingAvatar(false);
    }
  };
  const validationErrors = useMemo(() => getProfileErrors(profile), [profile]);
  const resolvedRole = profile.role ?? ((profile.workTypes?.length ?? 0) > 0 || (profile.serviceAreas?.length ?? 0) > 0 ? "worker" : "user");
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
      const result = await updateProfileRequest(
        apiBaseUrl,
        payload as Record<string, unknown>,
      );
      const data = result?.data;
      const requestedAvatar =
        typeof payload.avatar_url === "string" ? payload.avatar_url.trim() : "";
      const savedAvatar =
        typeof data?.avatar_url === "string" ? data.avatar_url.trim() : "";
      if (requestedAvatar && requestedAvatar !== savedAvatar) {
        throw new Error(
          "avatar_url database дээр хадгалагдсангүй. Back-end schema/migration-аа шинэчилнэ үү.",
        );
      }
      if (data) {
        setProfile((prev) => mergeProfileFromApi(prev, data));
        if (typeof data.avatar_url === "string" && data.avatar_url.trim()) {
          const email = profile.email?.trim();
          if (email) {
            await setCachedProfileAvatar(email, data.avatar_url);
          }
        }
      }
      setIsEditing(false);
      Alert.alert("Амжилттай", "Профайл хадгалагдлаа.");
    } catch (err) {
      Alert.alert("Алдаа", err instanceof Error ? err.message : "Хадгалах үед алдаа гарлаа.");
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
        Alert.alert("Засварчинаар нэвтрэх", "Засварчнаар нэвтрэхийн тулд мэргэжил болон үйлчлэх бүсээ сонгоно уу.");
        return;
      }
    }
    setIsSwitchingRole(true);
    try {
      const result = await switchProfileRoleRequest(apiBaseUrl, {
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
      });
      const data = result?.data;
      if (data) {
        setProfile((prev) => mergeProfileFromApi(prev, data));
      } else {
        setProfile((prev) => ({ ...prev, role: nextRole }));
      }
    } catch (err) {
      Alert.alert("Алдаа", err instanceof Error ? err.message : "Профайл солих үед алдаа гарлаа.");
    } finally {
      setIsSwitchingRole(false);
    }
  };
  return {
    profile,
    isEditing,
    isSaving: isSaving || isLoadingProfile || isSwitchingRole,
    isUploadingAvatar,
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

import ProfileScreen, {
  ProfileData,
  ProfileErrors,
  ProfileField,
} from "@/components/_tabsComponents/_profileComponents";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { useSignOut } from "@/components/sign-out-button";
import { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";

const normalizeList = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.filter(Boolean).map(String);
      }
    } catch {
      // fall through to comma/semicolon split
    }
    return trimmed
      .split(/[;,]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

export default function TabTwoScreen() {
  const router = useRouter();
  const { user, isLoaded: isUserLoaded } = useUser();
  const apiBaseUrl =
    process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [hasTriedSave, setHasTriedSave] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
    workTypes: [],
    serviceAreas: [],
    avatarUrl: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
    displayName: "",
  });

  useEffect(() => {
    if (!isUserLoaded) return;
    const email = user?.primaryEmailAddress?.emailAddress?.trim();
    if (!email) return;

    setProfile((prev) => ({
      ...prev,
      lastName: "",
      firstName: "",
      email,
      phone: "",
    }));

    let cancelled = false;
    const loadProfile = async () => {
      setIsLoadingProfile(true);
      try {
        const response = await fetch(
          `${apiBaseUrl}/profiles?email=${encodeURIComponent(email)}`,
        );
        if (!response.ok) {
          const message = `HTTP ${response.status}`;
          throw new Error(message);
        }
        const payload = await response.json().catch(() => null);
        const rawData = payload?.data;
        const list = Array.isArray(rawData) ? rawData : rawData ? [rawData] : [];
        const data =
          list.find(
            (item) =>
              String(item?.email ?? "").trim().toLowerCase() ===
              email.toLowerCase(),
          ) ?? null;
        if (!data || cancelled) return;

        setProfile((prev) => ({
          ...prev,
          lastName: data.last_name ?? prev.lastName,
          firstName: data.first_name ?? prev.firstName,
          email: data.email ?? prev.email,
          phone: data.phone_number ?? prev.phone,
          workTypes: normalizeList(data.work_types),
          serviceAreas: normalizeList(data.service_area),
        }));
      } catch (err) {
        console.error("Load profile failed:", err);
      } finally {
        if (!cancelled) setIsLoadingProfile(false);
      }
    };

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl, isUserLoaded, user?.primaryEmailAddress?.emailAddress]);

  const handleChangeField = (field: ProfileField, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const validationErrors = useMemo<ProfileErrors>(() => {
    const errors: ProfileErrors = {};
    const lastName = profile.lastName?.trim() ?? "";
    const firstName = profile.firstName?.trim() ?? "";
    if (!lastName) {
      errors.lastName = "Овог оруулна уу.";
    }
    if (!firstName) {
      errors.firstName = "Нэр оруулна уу.";
    }

    const email = profile.email?.trim() ?? "";
    if (!email) {
      errors.email = "Имэйл хаяг оруулна уу.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Имэйл хаяг буруу байна.";
    }

    const phone = profile.phone?.trim() ?? "";
    if (!phone) {
      errors.phone = "Утасны дугаар оруулна уу.";
    } else {
      const digits = phone.replace(/[^\d]/g, "");
      const valid =
        digits.length === 8 || (digits.length === 11 && digits.startsWith("976"));
      if (!valid) {
        errors.phone = "Утасны дугаар 8 оронтой байх ёстой.";
      }
    }

    return errors;
  }, [profile.email, profile.firstName, profile.lastName, profile.phone]);

  const handleEditPress = () => {
    setIsEditing((prev) => {
      const next = !prev;
      if (next) setHasTriedSave(false);
      return next;
    });
  };

  const handleSavePress = async () => {
    const hasErrors = Object.keys(validationErrors).length > 0;
    if (hasErrors) {
      setHasTriedSave(true);
      Alert.alert("Алдаа", "Талбаруудыг зөв бөглөнө үү.");
      return;
    }
    setIsSaving(true);
    try {
      const workTypes = normalizeList(profile.workTypes);
      const serviceAreas = normalizeList(profile.serviceAreas);
      const isWorker = workTypes.length > 0 || serviceAreas.length > 0;

      const payload = {
        role: isWorker ? "worker" : "user",
        email: profile.email.trim(),
        phone_number: profile.phone.trim(),
        first_name: profile.firstName.trim(),
        last_name: profile.lastName.trim(),
        ...(isWorker ? { work_types: workTypes, service_area: serviceAreas } : {}),
      };

      const response = await fetch(`${apiBaseUrl}/profiles`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        const message =
          errorPayload?.error ?? errorPayload?.message ?? `HTTP ${response.status}`;
        throw new Error(message);
      }

      const result = await response.json().catch(() => null);
      const data = result?.data;
      if (data) {
        setProfile((prev) => ({
          ...prev,
          lastName: data.last_name ?? prev.lastName,
          firstName: data.first_name ?? prev.firstName,
          email: data.email ?? prev.email,
          phone: data.phone_number ?? prev.phone,
          workTypes: normalizeList(data.work_types ?? prev.workTypes),
          serviceAreas: normalizeList(data.service_area ?? prev.serviceAreas),
        }));
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

  const handleLogoutPress = useSignOut();
  const handleNotificationsPress = () => {
    Alert.alert("Мэдэгдэл", "Тун удахгүй.");
  };
  const handleCardLinkPress = () => {
    Alert.alert("Карт холбох", "Тун удахгүй.");
  };
  const handleHelpPress = () => {
    router.push("/profile/help");
  };
  const handleComplaintPress = () => {
    router.push("/profile/complaint");
  };

  return (
    <ProfileScreen
      profile={profile}
      isEditing={isEditing}
      isSaving={isSaving || isLoadingProfile}
      onChangeField={handleChangeField}
      onEditPress={handleEditPress}
      onSavePress={handleSavePress}
      onLogoutPress={handleLogoutPress}
      onNotificationsPress={handleNotificationsPress}
      onCardLinkPress={handleCardLinkPress}
      onHelpPress={handleHelpPress}
      onComplaintPress={handleComplaintPress}
      errors={validationErrors}
      showErrors={isEditing && hasTriedSave}
    />
  );
}

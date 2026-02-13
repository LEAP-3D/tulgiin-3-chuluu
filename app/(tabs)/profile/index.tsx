import ProfileScreen, {
  ProfileData,
  ProfileField,
} from "@/components/_tabsComponents/_profileComponents";
import { useUser } from "@clerk/clerk-expo";
import { useSignOut } from "@/components/sign-out-button";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export default function TabTwoScreen() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const apiBaseUrl =
    process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
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

  const handleEditPress = () => {
    setIsEditing((prev) => !prev);
  };

  const handleSavePress = async () => {
    setIsSaving(true);
    try {
      // TODO: Backend руу хадгалалт хийх API холбоно.
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsEditing(false);
      Alert.alert("Амжилттай", "Профайл хадгалагдлаа.");
    } catch {
      Alert.alert("Алдаа", "Хадгалах үед алдаа гарлаа.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoutPress = useSignOut();

  return (
    <ProfileScreen
      profile={profile}
      isEditing={isEditing}
      isSaving={isSaving || isLoadingProfile}
      onChangeField={handleChangeField}
      onEditPress={handleEditPress}
      onSavePress={handleSavePress}
      onLogoutPress={handleLogoutPress}
    />
  );
}

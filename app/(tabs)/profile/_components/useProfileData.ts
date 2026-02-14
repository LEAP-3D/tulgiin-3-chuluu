import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useSupabaseAuth } from "@/lib/supabase-auth";
import type { ProfileData } from "@/components/_tabsComponents/_profileComponents";
import { mergeProfileFromApi } from "./profile-helpers";

export type ProfileDataState = {
  profile: ProfileData;
  setProfile: Dispatch<SetStateAction<ProfileData>>;
  isLoadingProfile: boolean;
};

export function useProfileData(apiBaseUrl: string): ProfileDataState {
  const { user, isLoaded: isUserLoaded } = useSupabaseAuth();
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
    const email = user?.email?.trim();
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

        setProfile((prev) => mergeProfileFromApi(prev, data));
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
  }, [apiBaseUrl, isUserLoaded, user?.email]);

  return { profile, setProfile, isLoadingProfile };
}

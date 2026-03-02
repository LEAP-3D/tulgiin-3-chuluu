import { supabase } from "@/lib/supabase";
import type { ProfileInfo } from "./types";

const toProfileInfo = (profile: {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  role?: string | null;
  work_types?: unknown;
  profile_url?: string | null;
  avatar_url?: string | null;
}): ProfileInfo => {
  const firstName = profile.first_name ?? "";
  const lastName = profile.last_name ?? "";
  const name = `${firstName} ${lastName}`.trim() || "Нэргүй";
  return {
    id: String(profile.id),
    name,
    role: profile.role === "worker" ? "worker" : "user",
    workTypes: Array.isArray(profile.work_types)
      ? profile.work_types.filter(Boolean).map(String)
      : [],
    avatarUrl:
      typeof profile.profile_url === "string"
        ? profile.profile_url
        : typeof profile.avatar_url === "string"
          ? profile.avatar_url
          : null,
  };
};

export const fetchProfileInfo = async (profileId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", profileId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? toProfileInfo(data) : null;
};

import { supabase } from "@/lib/supabase";
import type { ProfileInfo } from "./types";

const toProfileInfo = (profile: {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  role?: string | null;
  work_types?: unknown;
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
    avatarUrl: typeof profile.avatar_url === "string" ? profile.avatar_url : null,
  };
};

export const fetchProfileInfo = async (profileId: string) => {
  const withAvatar = "id, first_name, last_name, role, work_types, avatar_url";
  const withoutAvatar = "id, first_name, last_name, role, work_types";

  const { data, error } = await supabase
    .from("profiles")
    .select(withAvatar)
    .eq("id", profileId)
    .maybeSingle();

  if (error?.message?.includes("avatar_url")) {
    const { data: fallback, error: fallbackError } = await supabase
      .from("profiles")
      .select(withoutAvatar)
      .eq("id", profileId)
      .maybeSingle();

    if (fallbackError) {
      throw new Error(fallbackError.message);
    }
    return fallback ? toProfileInfo(fallback) : null;
  }

  if (error) {
    throw new Error(error.message);
  }

  return data ? toProfileInfo(data) : null;
};

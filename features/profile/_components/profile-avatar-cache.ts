import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY_PREFIX = "ubzyro:profile-avatar:";

const keyForEmail = (email: string) => `${KEY_PREFIX}${email.trim().toLowerCase()}`;

export const getCachedProfileAvatar = async (email: string) => {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return null;
  try {
    const value = await AsyncStorage.getItem(keyForEmail(normalized));
    return value?.trim() ? value : null;
  } catch {
    return null;
  }
};

export const setCachedProfileAvatar = async (email: string, avatarUrl: string) => {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUrl = avatarUrl.trim();
  if (!normalizedEmail || !normalizedUrl) return;

  try {
    await AsyncStorage.setItem(keyForEmail(normalizedEmail), normalizedUrl);
  } catch {
    // Ignore cache write failures.
  }
};

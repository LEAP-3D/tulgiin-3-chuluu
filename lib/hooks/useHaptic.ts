import { useCallback } from "react";
import * as Haptics from "expo-haptics";

type HapticFeedbackType =
  | "light"
  | "medium"
  | "heavy"
  | "success"
  | "warning"
  | "error";

const hapticMap: Record<HapticFeedbackType, () => Promise<void>> = {
  light: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  medium: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
  success: () =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  warning: () =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  error: () =>
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
};

export function useHaptic() {
  const trigger = useCallback(async (type: HapticFeedbackType = "medium") => {
    try {
      await hapticMap[type]();
    } catch (e) {
      // Haptics not available on web or older devices
      console.debug("Haptics unavailable:", e);
    }
  }, []);

  return { trigger };
}

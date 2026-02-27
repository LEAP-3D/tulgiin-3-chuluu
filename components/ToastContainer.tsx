import React, { useEffect } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useToast, type Toast, type ToastType } from "@/lib/toast-context";

const COLORS: Record<ToastType, { bg: string; border: string; text: string }> =
  {
    success: {
      bg: "#ECFDF5",
      border: "#10B981",
      text: "#065F46",
    },
    error: {
      bg: "#FEF2F2",
      border: "#EF4444",
      text: "#7F1D1D",
    },
    warning: {
      bg: "#FFFBEB",
      border: "#F59E0B",
      text: "#78350F",
    },
    info: {
      bg: "#EFF6FF",
      border: "#3B82F6",
      text: "#1E3A8A",
    },
  };

const ICONS: Record<ToastType, string> = {
  success: "✓",
  error: "✕",
  warning: "!",
  info: "ⓘ",
};

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: () => void;
}) {
  const animValue = React.useRef(new Animated.Value(0)).current;
  const colors = COLORS[toast.type];

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [animValue]);

  const handleClose = () => {
    Animated.timing(animValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onRemove());
  };

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          opacity: animValue,
          transform: [
            {
              translateY: animValue.interpolate({
                inputRange: [0, 1],
                outputRange: [-20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <Pressable
        style={[
          styles.toastContent,
          {
            backgroundColor: colors.bg,
            borderLeftColor: colors.border,
          },
        ]}
        onPress={handleClose}
      >
        <Text
          style={[
            styles.toastIcon,
            {
              color: colors.border,
            },
          ]}
        >
          {ICONS[toast.type]}
        </Text>
        <Text
          style={[
            styles.toastMessage,
            {
              color: colors.text,
            },
          ]}
          numberOfLines={2}
        >
          {toast.message}
        </Text>
        <Pressable
          onPress={handleClose}
          hitSlop={8}
          accessibilityLabel="Close notification"
          accessibilityRole="button"
        >
          <Text
            style={[
              styles.toastClose,
              {
                color: colors.text,
              },
            ]}
          >
            ×
          </Text>
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          top: insets.top + 8,
        },
      ]}
      pointerEvents="box-none"
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 999,
    gap: 8,
  },
  toast: {
    marginBottom: 8,
  },
  toastContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    borderLeftWidth: 4,
    gap: 10,
  },
  toastIcon: {
    fontSize: 18,
    fontWeight: "600",
    minWidth: 24,
    textAlign: "center",
  },
  toastMessage: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
    lineHeight: 20,
  },
  toastClose: {
    fontSize: 24,
    fontWeight: "300",
    marginRight: -4,
  },
});

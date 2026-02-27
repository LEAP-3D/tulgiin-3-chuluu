// Status color system for consistent styling across the app
export const STATUS_COLORS = {
  pending: {
    bg: "#FEF3C7",
    border: "#F59E0B",
    text: "#92400E",
    icon: "⏳",
  },
  accepted: {
    bg: "#ECFDF5",
    border: "#10B981",
    text: "#065F46",
    icon: "✓",
  },
  rejected: {
    bg: "#FEF2F2",
    border: "#EF4444",
    text: "#7F1D1D",
    icon: "✕",
  },
  cancelled: {
    bg: "#F3F4F6",
    border: "#6B7280",
    text: "#1F2937",
    icon: "⊗",
  },
  en_route: {
    bg: "#DBEAFE",
    border: "#3B82F6",
    text: "#1E40AF",
    icon: "🚗",
  },
  in_progress: {
    bg: "#F0FDFB",
    border: "#14B8A6",
    text: "#134E4A",
    icon: "⚙️",
  },
  completed: {
    bg: "#ECFDF5",
    border: "#10B981",
    text: "#065F46",
    icon: "✓",
  },
  paid: {
    bg: "#ECFDF5",
    border: "#10B981",
    text: "#065F46",
    icon: "💳",
  },
  pending_payment: {
    bg: "#FEF3C7",
    border: "#F59E0B",
    text: "#92400E",
    icon: "⏳",
  },
} as const;

export type StatusKey = keyof typeof STATUS_COLORS;

export function getStatusColor(
  status: string | undefined,
): (typeof STATUS_COLORS)[StatusKey] {
  if (!status || !(status in STATUS_COLORS)) {
    return STATUS_COLORS.pending;
  }
  return STATUS_COLORS[status as StatusKey];
}

// Accessibility improvements - color contrast ratios
export const ACCESSIBLE_COLORS = {
  text: {
    primary: "#1F1F1F", // High contrast
    secondary: "#5F5F5F", // Good contrast
    muted: "#8E8E8E", // Good contrast
    light: "#FFFFFF",
  },
  bg: {
    primary: "#FFFFFF",
    secondary: "#F8F8F8",
    tertiary: "#F0F0F0",
  },
  buttons: {
    primary: "#F59E0B",
    primaryHover: "#D97706",
    primaryDisabled: "rgba(245, 158, 11, 0.5)",
  },
} as const;

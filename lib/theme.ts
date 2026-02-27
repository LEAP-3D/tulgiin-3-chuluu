// Light theme colors
export const lightTheme = {
  colors: {
    primary: "#F59E0B",
    primaryDark: "#D97706",
    background: "#FFFFFF",
    surface: "#F8F8F8",
    surfaceLight: "#FAFAFA",
    text: {
      primary: "#1F1F1F",
      secondary: "#5F5F5F",
      muted: "#8E8E8E",
      light: "#FFFFFF",
    },
    border: "#E5E5E5",
    divider: "#EEEEEE",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#3B82F6",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    full: 9999,
  },
  typography: {
    h1: { fontSize: 20, fontWeight: "700" as const },
    h2: { fontSize: 18, fontWeight: "700" as const },
    h3: { fontSize: 16, fontWeight: "600" as const },
    body: { fontSize: 14, fontWeight: "400" as const },
    bodyMd: { fontSize: 14, fontWeight: "500" as const },
    bodySm: { fontSize: 12, fontWeight: "400" as const },
    bodySmMd: { fontSize: 12, fontWeight: "500" as const },
    caption: { fontSize: 11, fontWeight: "400" as const },
  },
  shadows: {
    sm: { elevation: 2 },
    md: { elevation: 4 },
    lg: { elevation: 8 },
  },
};

// Dark theme colors
export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: "#FBBF24",
    primaryDark: "#F59E0B",
    background: "#0F172A",
    surface: "#1E293B",
    surfaceLight: "#334155",
    text: {
      primary: "#F1F5F9",
      secondary: "#CBD5E1",
      muted: "#94A3B8",
      light: "#1F1F1F",
    },
    border: "#334155",
    divider: "#1E293B",
  },
};

export type Theme = typeof lightTheme;

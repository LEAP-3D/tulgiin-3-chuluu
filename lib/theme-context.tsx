import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { lightTheme, darkTheme, type Theme } from "./theme";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>("system");

  const isDark =
    mode === "dark" || (mode === "system" && systemColorScheme === "dark");
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        mode,
        setMode,
        isDark,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

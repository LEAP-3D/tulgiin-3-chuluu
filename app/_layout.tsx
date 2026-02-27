import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { SupabaseAuthProvider } from "@/lib/supabase-auth";
import { ToastProvider } from "@/lib/toast-context";
import { ToastContainer } from "@/components/ToastContainer";
import { ThemeProvider as CustomThemeProvider } from "@/lib/theme-context";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SupabaseAuthProvider>
      <ToastProvider>
        <CustomThemeProvider>
          <SafeAreaProvider>
            <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen
                  name="modal"
                  options={{ presentation: "modal", title: "Modal" }}
                />
                <Stack.Screen
                  name="payment"
                  options={{ presentation: "modal", title: "Төлбөр" }}
                />
              </Stack>
              <ToastContainer />
              <StatusBar style="auto" />
            </ThemeProvider>
          </SafeAreaProvider>
        </CustomThemeProvider>
      </ToastProvider>
    </SupabaseAuthProvider>
  );
}

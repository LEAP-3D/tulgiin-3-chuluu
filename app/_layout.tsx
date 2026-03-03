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
import { usePushNotifications } from "@/lib/push-notifications";

function AppNavigation() {
  const colorScheme = useColorScheme();
  usePushNotifications();

  return (
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
  );
}

export default function RootLayout() {
  return (
    <SupabaseAuthProvider>
      <AppNavigation />
    </SupabaseAuthProvider>
  );
}

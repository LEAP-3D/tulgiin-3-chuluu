import { Redirect, Stack } from "expo-router";
import { useSupabaseAuth } from "@/lib/supabase-auth";

export default function AuthLayout() {
  const { isLoaded, isSignedIn } = useSupabaseAuth();

  if (!isLoaded) return null;
  if (isSignedIn) return <Redirect href="/(tabs)/service" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}

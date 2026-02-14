import { Redirect } from "expo-router";
import { useSupabaseAuth } from "@/lib/supabase-auth";

export default function Index() {
  const { isLoaded, isSignedIn } = useSupabaseAuth();

  if (!isLoaded) return null;

  return (
    <Redirect href={isSignedIn ? "/(tabs)/service" : "/(auth)/sign-in"} />
  );
}

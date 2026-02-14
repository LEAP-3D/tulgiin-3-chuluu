import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Text, TouchableOpacity } from "react-native";
import { supabase } from "@/lib/supabase";

export const useSignOut = () => {
  const router = useRouter();

  const handleSignOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      // Redirect to your desired page
      router.replace("/");
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, [router]);

  return handleSignOut;
};

export const SignOutButton = () => {
  const handleSignOut = useSignOut();

  return (
    <TouchableOpacity onPress={handleSignOut}>
      <Text>Sign out</Text>
    </TouchableOpacity>
  );
};

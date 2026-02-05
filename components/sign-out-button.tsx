import { useClerk } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { Text, TouchableOpacity } from "react-native";

export const useSignOut = () => {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      // Redirect to your desired page
      router.replace("/");
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  }, [router, signOut]);

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

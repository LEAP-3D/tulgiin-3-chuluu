import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Link } from "expo-router";
import { StyleSheet } from "react-native";
import { SignOutButton } from "@/components/sign-out-button";
import { useSupabaseAuth } from "@/lib/supabase-auth";

export default function Page() {
  const { user, isSignedIn } = useSupabaseAuth();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Welcome!</ThemedText>
      {!isSignedIn ? (
        <>
          <Link href="/(auth)/sign-in">
            <ThemedText>Sign in</ThemedText>
          </Link>
          <Link href="/(auth)/sign-up">
            <ThemedText>Sign up</ThemedText>
          </Link>
        </>
      ) : (
        <>
          <ThemedText>Hello {user?.email}</ThemedText>
          <SignOutButton />
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
});

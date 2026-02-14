import { Redirect } from "expo-router";
import { Text, View, TouchableOpacity } from "react-native";
import { useSupabaseAuth } from "@/lib/supabase-auth";

export default function UseAuthExample() {
  const { isLoaded, isSignedIn, user, session } = useSupabaseAuth();

  const fetchExternalData = async () => {
    const token = session?.access_token;
    if (!token) return null;

    // Use `token` to fetch data from an external API
    const response = await fetch("https://api.example.com/data", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.json();
  };

  // Use `isLoaded` to check if Clerk is loaded
  if (!isLoaded) {
    return <Text>Loading...</Text>;
  }

  // Use `isSignedIn` to check if the user is signed in
  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <View>
      <Text>
        Hello, {user?.id ?? "user"}! Your current session is active.
      </Text>
      <TouchableOpacity onPress={fetchExternalData}>
        <Text>Fetch Data</Text>
      </TouchableOpacity>
    </View>
  );
}

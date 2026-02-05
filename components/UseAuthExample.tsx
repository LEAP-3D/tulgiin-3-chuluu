import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";
import { Text, View, TouchableOpacity } from "react-native";

export default function UseAuthExample() {
  const { isLoaded, isSignedIn, userId, sessionId, getToken } = useAuth();

  const fetchExternalData = async () => {
    // Use `getToken()` to get the current user's session token
    const token = await getToken();

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
        Hello, {userId}! Your current active session is {sessionId}.
      </Text>
      <TouchableOpacity onPress={fetchExternalData}>
        <Text>Fetch Data</Text>
      </TouchableOpacity>
    </View>
  );
}

import { Redirect, Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/_tabsComponents/_header/Header";
import { HapticTab } from "@/components/haptic-tab";
import { useSupabaseAuth } from "@/lib/supabase-auth";

export default function TabLayout() {
  const { isLoaded, isSignedIn } = useSupabaseAuth();
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (!isLoaded) {
      setAuthReady(false);
      return;
    }
    const timer = setTimeout(() => setAuthReady(true), 250);
    return () => clearTimeout(timer);
  }, [isLoaded]);

  if (!isLoaded || !authReady) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <View style={{ flex: 1 }}>
      {/* ✅ Чиний header — 1 удаа, бүх tab дээр */}
      <Header />

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarActiveTintColor: "#FF8A1E",
          tabBarInactiveTintColor: "#767676",
          tabBarHideOnKeyboard: true,
          tabBarStyle: styles.tabBar,
          tabBarItemStyle: styles.tabItem,
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        <Tabs.Screen
          name="service"
          options={{
            title: "Үйлчилгээ",
            tabBarIcon: ({ color }) => (
              <View style={styles.iconWrap}>
                <Ionicons name="construct-outline" size={24} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="order/index"
          options={{
            title: "Захиалга",
            tabBarIcon: ({ color }) => (
              <View style={styles.iconWrap}>
                <Ionicons name="copy-outline" size={24} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="zurwas/index"
          options={{
            title: "Зурвас",
            tabBarIcon: ({ color }) => (
              <View style={styles.iconWrap}>
                <Ionicons name="chatbubble-outline" size={24} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Профайл",
            tabBarIcon: ({ color }) => (
              <View style={styles.iconWrap}>
                <Ionicons name="person-outline" size={24} color={color} />
              </View>
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E6E6E6",
    height: Platform.OS === "ios" ? 84 : 70,
    paddingTop: 7,
    paddingBottom: Platform.OS === "ios" ? 10 : 6,
  },
  tabItem: {
    paddingVertical: 1,
  },
  tabLabel: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: "500",
    marginTop: 1,
    marginBottom: 0,
  },
  iconWrap: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
});

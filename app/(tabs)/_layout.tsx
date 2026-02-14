import { Redirect, Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import Header from "@/components/_tabsComponents/_header/Header";
import { HapticTab } from "@/components/haptic-tab";
import { UilcilgeeIcon } from "@/components/icons/uilcilgee";
import { ZahialgaIcon } from "@/components/icons/zahialga";
import { ProfileIcon } from "@/components/icons/profile";
import MessageIcon from "@/components/icons/zurwas";
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
          headerShown: false, // Expo Router default header унтраана
          tabBarButton: HapticTab,
          tabBarActiveTintColor: "#FF8A1E",
          tabBarInactiveTintColor: "#8A8A8A",
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopWidth: 1,
            borderTopColor: "#E5E5E5",
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "500",
          },
        }}
      >
        {/* Tabs.Screen-үүд */}
        <Tabs.Screen
          name="service"
          options={{
            title: "Үйлчилгээ",
            tabBarIcon: ({ color }) => (
              <View style={{ width: 24, height: 24, alignItems: "center", justifyContent: "center" }}>
                <UilcilgeeIcon size={22} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="order/index"
          options={{
            title: "Захиалга",
            tabBarIcon: ({ color }) => (
              <View style={{ width: 24, height: 24, alignItems: "center", justifyContent: "center" }}>
                <ZahialgaIcon size={22} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="zurwas/index"
          options={{
            title: "Зурвас",
            tabBarIcon: ({ color }) => (
              <View style={{ width: 24, height: 24, alignItems: "center", justifyContent: "center" }}>
                <MessageIcon width={22} height={22} color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Профайл",
            tabBarIcon: ({ color }) => (
              <View style={{ width: 24, height: 24, alignItems: "center", justifyContent: "center" }}>
                <ProfileIcon size={22} color={color} />
              </View>
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

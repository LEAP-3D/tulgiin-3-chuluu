import { Redirect, Tabs, usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/_tabsComponents/_header/Header";
import { HapticTab } from "@/components/haptic-tab";
import { useSupabaseAuth } from "@/lib/supabase-auth";

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoaded, isSignedIn, user } = useSupabaseAuth();
  const [authReady, setAuthReady] = useState(false);
  const [profileRole, setProfileRole] = useState<"user" | "worker" | null>(null);
  const [isRoleLoaded, setIsRoleLoaded] = useState(false);
  const apiBaseUrl =
    process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

  useEffect(() => {
    if (!isLoaded) {
      setAuthReady(false);
      return;
    }
    const timer = setTimeout(() => setAuthReady(true), 250);
    return () => clearTimeout(timer);
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    setIsRoleLoaded(false);
    const email = (user?.email ?? "").trim();
    if (!email) {
      setProfileRole("user");
      setIsRoleLoaded(true);
      return;
    }

    let cancelled = false;
    const loadRole = async () => {
      try {
        const response = await fetch(
          `${apiBaseUrl}/profiles?email=${encodeURIComponent(email)}`,
        );
        const payload = await response.json().catch(() => null);
        const data = payload?.data ?? null;
        const role = data?.role === "worker" ? "worker" : "user";
        if (!cancelled) setProfileRole(role);
      } catch {
        if (!cancelled) setProfileRole("user");
      } finally {
        if (!cancelled) setIsRoleLoaded(true);
      }
    };

    loadRole();
    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl, isLoaded, user?.email]);

  const isWorker = profileRole === "worker";

  useEffect(() => {
    if (!isWorker) return;
    if (pathname.startsWith("/service")) {
      router.replace("/(tabs)/order");
    }
  }, [isWorker, pathname, router]);

  if (!isLoaded || !authReady || !isRoleLoaded) {
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
            href: isWorker ? null : undefined,
            tabBarButton: isWorker ? undefined : HapticTab,
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
            tabBarButton: HapticTab,
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
            tabBarButton: HapticTab,
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
            tabBarButton: HapticTab,
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

import { Redirect, Tabs, useGlobalSearchParams, usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/_tabsComponents/_header/Header";
import { HapticTab } from "@/components/haptic-tab";
import { useSupabaseAuth } from "@/lib/supabase-auth";
import { useTabUnreadBadges } from "@/lib/hooks/useTabUnreadBadges";
import { styles } from "./tabs-layout.styles";

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useGlobalSearchParams<{ orderId?: string | string[] }>();
  const { isLoaded, isSignedIn, user, session } = useSupabaseAuth();
  const [authReady, setAuthReady] = useState(false);
  const [profileRole, setProfileRole] = useState<"user" | "worker" | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
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
      setProfileId(null);
      setIsRoleLoaded(true);
      return;
    }

    let cancelled = false;
    const loadRole = async () => {
      try {
        const response = await fetch(
          `${apiBaseUrl}/profiles?email=${encodeURIComponent(email)}`,
          session?.access_token
            ? {
                headers: {
                  Authorization: `Bearer ${session.access_token}`,
                },
              }
            : undefined,
        );
        const payload = await response.json().catch(() => null);
        const data = payload?.data ?? null;
        const role = data?.role === "worker" ? "worker" : "user";
        if (!cancelled) {
          setProfileRole(role);
          setProfileId(typeof data?.id === "string" ? data.id : null);
        }
      } catch {
        if (!cancelled) {
          setProfileRole("user");
          setProfileId(null);
        }
      } finally {
        if (!cancelled) setIsRoleLoaded(true);
      }
    };

    loadRole();
    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl, isLoaded, session?.access_token, user?.email]);

  const isWorker = profileRole === "worker";
  const zurwasOrderId = Array.isArray(params.orderId)
    ? params.orderId[0]
    : params.orderId;
  const isZurwasThread =
    pathname.startsWith("/zurwas") && typeof zurwasOrderId === "string" && zurwasOrderId.length > 0;
  const shouldShowGlobalHeader = !pathname.startsWith("/zurwas") || !isZurwasThread;
  const { hasUnreadOrder, hasUnreadZurwas } = useTabUnreadBadges({
    apiBaseUrl,
    isLoaded,
    isSignedIn,
    email: (user?.email ?? "").trim(),
    userId: user?.id,
    sessionToken: session?.access_token,
    profileId,
    profileRole,
    pathname,
  });

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
      {shouldShowGlobalHeader ? <Header /> : null}

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
                {hasUnreadOrder ? <View style={styles.tabRedDot} /> : null}
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
                {hasUnreadZurwas ? <View style={styles.tabRedDot} /> : null}
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

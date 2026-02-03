import { Tabs } from "expo-router";
import { View } from "react-native";
import Header from "@/components/_tabsComponents/_header/Header";
import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { UilcilgeeIcon } from "@/components/icons/uilcilgee";
import { ZahialgaIcon } from "@/components/icons/zahialga";
import { ProfileIcon } from "@/components/icons/profile";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style={{ flex: 1 }}>
      {/* ✅ Чиний header — 1 удаа, бүх tab дээр */}
      <Header />

      <Tabs
        screenOptions={{
          headerShown: false, // Expo Router default header унтраана
          tabBarButton: HapticTab,
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        }}
      >
        {/* Tabs.Screen-үүд */}
        <Tabs.Screen
          name="service"
          options={{
            title: "Үйлчилгээ",
            tabBarIcon: ({ color }) => <UilcilgeeIcon color={color} />,
          }}
        />
        <Tabs.Screen
          name="order"
          options={{
            title: "Захиалга",
            tabBarIcon: ({ color }) => <ZahialgaIcon size={28} color={color} />,
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Профайл",
            tabBarIcon: ({ color }) => <ProfileIcon size={28} color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}

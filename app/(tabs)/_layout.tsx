import { Tabs } from "expo-router";
import { View } from "react-native";

import { HapticTab } from "@/components/haptic-tab";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { UilcilgeeIcon } from "@/components/icons/uilcilgee";
import { ProfileIcon } from "@/components/icons/profile";
import { ZahialgaIcon } from "@/components/icons/zahialga";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarButton: HapticTab,
        }}
      >
        <Tabs.Screen
          name="index"
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

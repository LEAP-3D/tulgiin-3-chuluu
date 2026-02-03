import { Tabs } from "expo-router";
import { View } from "react-native";

import { HapticTab } from "@/components/haptic-tab";

import { UilcilgeeIcon } from "@/components/icons/uilcilgee";
import { ProfileIcon } from "@/components/icons/profile";
import { ZahialgaIcon } from "@/components/icons/zahialga";

export default function TabLayout() {

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarButton: HapticTab,

          tabBarActiveTintColor: "#F6A623",

          tabBarInactiveTintColor: "#9E9E9E",

          tabBarStyle: {
            height: 80,
            paddingTop: 8,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
          },
        }}
      >
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

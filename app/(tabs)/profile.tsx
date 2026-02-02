import { Image } from "expo-image";
import { Platform, StyleSheet } from "react-native";

import { Collapsible } from "@/components/ui/collapsible";
import { ExternalLink } from "@/components/external-link";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";
// import {
//   ScrollView,
//   View,
// } from "react-native-reanimated/lib/typescript/Animated";
// import { SafeAreaView } from "react-native-safe-area-context";
import { SafeAreaView, ScrollView, View, Text } from "react-native";

export default function TabTwoScreen() {
  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Text>Hello</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});

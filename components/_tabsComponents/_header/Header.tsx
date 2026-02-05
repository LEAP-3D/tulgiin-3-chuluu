import Logo from "@/components/icons/logo";
import { NotificationIcon } from "@/components/icons/notification";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Header() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Logo />
      <Pressable onPress={() => console.log("hello")} hitSlop={10}>
        <NotificationIcon />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    paddingBottom: 4,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
  },
});

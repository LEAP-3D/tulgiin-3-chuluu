import Logo from "@/components/icons/logo";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Header() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Logo />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    paddingBottom: 0,
    paddingHorizontal: 20,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
  },
});

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function Header() {
  return (
    <SafeAreaView edges={["top"]} style={styles.safe}>
      <View style={styles.container}>
        {/* Logo */}
        <Text style={styles.logo}>
          <Text style={styles.logoBlue}>UB</Text>
          <Text style={styles.logoOrange}>ZYRO</Text>
        </Text>

        {/* Auto spacer */}
        <View style={{ flex: 1 }} />

        {/* Bell icon */}
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: "#fff",
  },
  container: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: "700",
  },
  logoBlue: {
    color: "#3DB6E9",
  },
  logoOrange: {
    color: "#F6A623",
  },
});

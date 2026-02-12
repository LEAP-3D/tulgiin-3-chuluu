import { StyleSheet, Text, View } from "react-native";

export default function ZurwasScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Зурвас</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F1F1F",
  },
});

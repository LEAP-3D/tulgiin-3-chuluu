import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
  tabRedDot: {
    position: "absolute",
    top: -2,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E53935",
  },
});

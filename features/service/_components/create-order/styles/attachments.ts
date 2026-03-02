import { StyleSheet } from "react-native";

export const attachmentStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
  },
  thumbWrap: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    position: "relative",
    backgroundColor: "#F7F7F7",
  },
  thumbImage: {
    width: "100%",
    height: "100%",
  },
  removeButton: {
    position: "absolute",
    right: 4,
    top: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.65)",
    alignItems: "center",
    justifyContent: "center",
  },
  attachBoxDisabled: {
    opacity: 0.6,
  },
  counterText: {
    marginTop: -4,
    marginBottom: 4,
    fontSize: 12,
    color: "#6B7280",
  },
});

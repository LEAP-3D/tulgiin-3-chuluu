import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F1F1F",
  },
  card: {
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  label: {
    fontSize: 12,
    color: "#7A7A7A",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: "#1F1F1F",
  },
  methodRow: {
    flexDirection: "row",
    gap: 10,
  },
  methodButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#1F1F1F",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  methodButtonActive: {
    backgroundColor: "#1F1F1F",
  },
  methodText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1F1F1F",
  },
  methodTextActive: {
    color: "#FFFFFF",
  },
  submitButton: {
    height: 44,
    borderRadius: 14,
    backgroundColor: "#1F1F1F",
    alignItems: "center",
    justifyContent: "center",
  },
  submitDisabled: {
    opacity: 0.6,
  },
  submitText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  helper: {
    fontSize: 12,
    color: "#6B6B6B",
  },
});

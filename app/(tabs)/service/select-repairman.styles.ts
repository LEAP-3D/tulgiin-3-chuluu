import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  divider: {
    height: 1,
    backgroundColor: "#EAEAEA",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F1F1F",
  },
  card: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F2F2F2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardTitleBlock: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F1F1F",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#7A7A7A",
    fontWeight: "600",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F1F1F",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: "#7A7A7A",
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 13,
    color: "#1F1F1F",
    fontWeight: "600",
  },
  selectButton: {
    marginTop: 8,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#1E1E1E",
    alignItems: "center",
    justifyContent: "center",
  },
  selectText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

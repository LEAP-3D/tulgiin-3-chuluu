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
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    color: "#1F1F1F",
  },
  card: {
    flexDirection: "row",
    borderRadius: 16,
    backgroundColor: "#F7F4F2",
    padding: 12,
    marginBottom: 12,
  },
  iconWrap: {
    width: 78,
    height: 78,
    borderRadius: 14,
    backgroundColor: "#F4E5D9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: "700",
    color: "#1D1D1F",
    marginBottom: 6,
  },
  cardSummary: {
    fontSize: 14,
    lineHeight: 20,
    color: "#48484D",
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  read: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "700",
    color: "#F59E0B",
  },
  arrow: {
    fontSize: 22,
    lineHeight: 22,
    color: "#1D1D1F",
  },
  detailCard: {
    borderRadius: 16,
    backgroundColor: "#F7F4F2",
    padding: 14,
  },
  detailIconWrap: {
    width: 92,
    height: 92,
    borderRadius: 16,
    backgroundColor: "#F4E5D9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  detailSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#414147",
    marginBottom: 12,
  },
  detailSectionTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "700",
    color: "#1D1D1F",
    marginBottom: 8,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  stepIndex: {
    width: 20,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "700",
    color: "#1D1D1F",
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: "#3E3E44",
  },
  emptyState: {
    paddingTop: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#7A7A7A",
    fontWeight: "600",
  },
});

import { StyleSheet } from "react-native";
import { orderDetailStyles } from "./order.detail.styles";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  listScreen: {
    gap: 16,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F1F1F",
  },
  orderCard: {
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  orderMain: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardPressed: {
    opacity: 0.7,
  },
  orderMeta: {
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  orderNumber: {
    fontSize: 12,
    color: "#5F5F5F",
    fontWeight: "600",
  },
  paymentAmount: {
    fontSize: 13,
    color: "#1F1F1F",
    fontWeight: "700",
    marginTop: 4,
  },
  paymentStatus: {
    fontSize: 12,
    color: "#27AE60",
    fontWeight: "600",
    marginTop: 4,
  },
  orderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  orderIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF0D6",
  },
  orderIconText: {
    fontSize: 16,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F1F1F",
  },
  chevron: {
    fontSize: 22,
    color: "#8E8E8E",
  },
  orderActions: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  acceptButton: {
    backgroundColor: "#1F1F1F",
    borderColor: "#1F1F1F",
  },
  rejectButton: {
    backgroundColor: "#FFFFFF",
    borderColor: "#1F1F1F",
  },
  actionText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  actionTextDark: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1F1F1F",
  },
  ...orderDetailStyles,
});

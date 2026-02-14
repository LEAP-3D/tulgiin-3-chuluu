import { StyleSheet } from "react-native";

export const modalStyles = StyleSheet.create({
  selectOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  selectCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingBottom: 12,
    maxHeight: "70%",
  },
  selectHeader: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  selectTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F1F1F",
  },
  selectClose: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B6B6B",
  },
  optionRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },
  optionRowSelected: {
    backgroundColor: "#FFF6EC",
  },
  optionText: {
    fontSize: 14,
    color: "#1F1F1F",
  },
  optionTextSelected: {
    fontWeight: "700",
    color: "#1F1F1F",
  },
  dateModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  dateModalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingBottom: 12,
  },
  dateModalHeader: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  dateModalTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F1F1F",
  },
  dateModalCancel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B6B6B",
  },
  dateModalDone: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F59E0B",
  },
});

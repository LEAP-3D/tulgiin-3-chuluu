import { StyleSheet } from "react-native";

export const workerStyles = StyleSheet.create({
  workerCard: {
    borderWidth: 1,
    borderColor: "#EAEAEA",
    borderRadius: 18,
    padding: 16,
    marginBottom: 8,
    backgroundColor: "#FFFFFF",
  },
  workerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  workerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F1F1F1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  workerAvatarImage: {
    width: "100%",
    height: "100%",
  },
  workerTitleBlock: {
    flex: 1,
  },
  workerName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F1F1F",
  },
  workerSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#7A7A7A",
    fontWeight: "600",
  },
  workerRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  workerRatingText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F1F1F",
  },
  workerInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    gap: 12,
  },
  workerInfoLabel: {
    fontSize: 13,
    color: "#7A7A7A",
    fontWeight: "600",
    flex: 1,
  },
  workerInfoValue: {
    fontSize: 13,
    color: "#1F1F1F",
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
  },
});

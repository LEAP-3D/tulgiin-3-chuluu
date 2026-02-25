export const orderDetailStatus = {
  statusCard: {
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 18,
    padding: 16,
    gap: 14,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F1F1F",
  },
  statusRow: {
    flexDirection: "row",
    gap: 12,
  },
  statusLeft: {
    width: 18,
    alignItems: "center",
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#CFCFCF",
  },
  statusDotActive: {
    backgroundColor: "#2AA928",
  },
  statusDotDanger: {
    backgroundColor: "#D64545",
  },
  statusLine: {
    flex: 1,
    width: 2,
    backgroundColor: "#D6D6D6",
    marginTop: 4,
  },
  statusRight: {
    flex: 1,
    gap: 4,
  },
  statusText: {
    fontSize: 13,
    color: "#1F1F1F",
  },
  statusTextActive: {
    fontWeight: "600",
  },
  statusTextDanger: {
    color: "#D64545",
    fontWeight: "600",
  },
  statusTime: {
    fontSize: 12,
    color: "#9B9B9B",
  },
} as const;

export const orderDetailStyles = {
  detailScreen: {
    gap: 16,
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F1F1F",
  },
  sectionTitleSmall: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F1F1F",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 13,
    color: "#1F1F1F",
    fontWeight: "500",
    lineHeight: 18,
  },
  descriptionMuted: {
    fontSize: 13,
    color: "#7A7A7A",
    fontWeight: "600",
  },
  attachmentRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  attachmentImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: "#F2F2F2",
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E8E8E8",
    gap: 14,
  },
  profileTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EDEDED",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F1F1F",
  },
  profileRole: {
    fontSize: 12,
    color: "#7A7A7A",
  },
  ratingWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  star: {
    color: "#F7B500",
    fontSize: 14,
  },
  ratingText: {
    fontWeight: "600",
    color: "#1F1F1F",
  },
  profileStats: {
    gap: 10,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  statLabel: {
    fontSize: 12,
    color: "#7A7A7A",
    flex: 1,
  },
  statValue: {
    fontSize: 12,
    color: "#1F1F1F",
    fontWeight: "600",
  },
  statValueArea: {
    flex: 1,
    textAlign: "right",
  },
  workerStatusText: {
    fontSize: 12,
    color: "#7A7A7A",
    fontWeight: "600",
  },
  profileActions: {
    flexDirection: "row",
    gap: 12,
  },
  messageButton: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1F1F1F",
    paddingVertical: 12,
    alignItems: "center",
  },
  messageText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F1F1F",
  },
  callButton: {
    width: 64,
    borderRadius: 16,
    backgroundColor: "#1F1F1F",
    alignItems: "center",
    justifyContent: "center",
  },
  callPressed: {
    opacity: 0.75,
  },
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
  statusTime: {
    fontSize: 12,
    color: "#9B9B9B",
  },
} as const;

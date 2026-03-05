export const orderDetailBase = {
  detailScreen: {
    gap: 16,
  },
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  detailHeaderTextWrap: {
    flex: 1,
    gap: 2,
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
  detailOrderCode: {
    fontSize: 12,
    color: "#6B6B6B",
    fontWeight: "600",
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
  callDisabled: {
    backgroundColor: "#BDBDBD",
  },
  callPressed: {
    opacity: 0.75,
  },
  reviewStarsRow: {
    flexDirection: "row",
    gap: 8,
  },
  reviewStarsHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: -4,
  },
  reviewLiveRating: {
    fontSize: 12,
    color: "#6A6A6A",
    fontWeight: "700",
  },
  reviewStarButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "#D4D4D4",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  reviewStarButtonActive: {
    borderColor: "#F7B500",
    backgroundColor: "#FFF8E1",
  },
  reviewStarText: {
    fontSize: 22,
    lineHeight: 24,
    color: "#C8C8C8",
  },
  reviewStarTextActive: {
    color: "#F7B500",
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: "#D8D8D8",
    borderRadius: 12,
    minHeight: 96,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1F1F1F",
    backgroundColor: "#FFFFFF",
  },
  reviewHelperText: {
    fontSize: 13,
    color: "#5F5F5F",
    fontWeight: "600",
    lineHeight: 20,
  },
  reviewRatingLabel: {
    fontSize: 15,
    color: "#1F1F1F",
    fontWeight: "700",
  },
  reviewRatingStarsActive: {
    color: "#F7B500",
  },
  reviewRatingStarsInactive: {
    color: "#C8C8C8",
  },
  reviewBody: {
    fontSize: 13,
    color: "#1F1F1F",
    fontWeight: "500",
    lineHeight: 20,
  },
  reviewDate: {
    fontSize: 12,
    color: "#7A7A7A",
    fontWeight: "500",
  },
  reviewSubmitButton: {
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#1F1F1F",
    backgroundColor: "#1F1F1F",
  },
  reviewSubmitButtonDisabled: {
    borderColor: "#CFCFCF",
    backgroundColor: "#E6E6E6",
  },
  reviewSubmitButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  reviewSubmitButtonTextDisabled: {
    color: "#8E8E8E",
  },
} as const;

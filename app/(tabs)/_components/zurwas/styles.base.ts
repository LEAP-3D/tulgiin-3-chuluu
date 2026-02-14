export const zurwasBaseStyles = {
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
  },
  listItemPressed: {
    backgroundColor: "#FAFAFA",
  },
  listRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listContent: {
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FF8A1E",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  listTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F1F1F",
  },
  listRole: {
    marginTop: 2,
    fontSize: 12,
    color: "#9A9A9A",
  },
  listSubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "#7A7A7A",
  },
  listSubtitleUnread: {
    fontWeight: "700",
    color: "#1F1F1F",
  },
  listTime: {
    fontSize: 12,
    color: "#A3A3A3",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  backButton: {
    padding: 6,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F1F1F",
  },
  statusText: {
    color: "#7A7A7A",
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
  },
  emptyText: {
    color: "#7A7A7A",
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
  },
} as const;

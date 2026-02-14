export const zurwasChatStyles = {
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  messageList: {
    paddingBottom: 12,
    gap: 10,
  },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  myBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#FF8A1E",
  },
  otherBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#F3F3F3",
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  myText: {
    color: "#FFFFFF",
  },
  otherText: {
    color: "#1F1F1F",
  },
  timeText: {
    marginTop: 4,
    fontSize: 11,
    color: "#B3B3B3",
  },
  typingText: {
    marginTop: 6,
    marginBottom: 4,
    fontSize: 12,
    color: "#9A9A9A",
    fontStyle: "italic",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#EFEFEF",
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    fontSize: 15,
    color: "#1F1F1F",
  },
  sendButton: {
    backgroundColor: "#1F1F1F",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  sendButtonPressed: {
    opacity: 0.85,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
} as const;

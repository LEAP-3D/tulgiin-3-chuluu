import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1F1F1F",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  bubble: {
    maxWidth: "85%",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#FF8A1E",
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#F3F3F3",
  },
  userText: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 19,
  },
  botText: {
    color: "#1F1F1F",
    fontSize: 14,
    lineHeight: 19,
  },
  inputRow: {
    borderTopWidth: 1,
    borderTopColor: "#EFEFEF",
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 42,
    maxHeight: 110,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1F1F1F",
  },
  sendBtn: {
    height: 42,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#1F1F1F",
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnMuted: {
    opacity: 0.55,
  },
  sendText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
});

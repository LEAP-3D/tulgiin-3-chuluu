import { StyleSheet } from "react-native";

export const baseStyles = StyleSheet.create({
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
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F1F1F",
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F1F1F",
    marginBottom: 8,
    marginTop: 18,
  },
  typePill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  typeIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFF6EC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  typeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F1F1F",
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#1F1F1F",
    marginBottom: 12,
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateText: {
    fontSize: 14,
    color: "#1F1F1F",
  },
  placeholderText: {
    color: "#A3A3A3",
  },
  inputError: {
    borderColor: "#D44A4A",
  },
  errorText: {
    marginTop: -6,
    marginBottom: 8,
    fontSize: 12,
    color: "#D44A4A",
  },
  errorTextBelow: {
    marginTop: 8,
    marginBottom: 0,
    fontSize: 12,
    color: "#D44A4A",
  },
  selectInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: {
    fontSize: 14,
    color: "#1F1F1F",
  },
  selectDisabled: {
    opacity: 0.5,
  },
  textArea: {
    height: 96,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  attachBox: {
    width: 64,
    height: 64,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 12,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  urgencyRow: {
    flexDirection: "row",
    gap: 12,
  },
  urgencyButton: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  urgencySelected: {
    borderColor: "#F59E0B",
    backgroundColor: "#FFF6EC",
  },
  urgencyText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F1F1F",
  },
  urgencyTextSelected: {
    color: "#1F1F1F",
  },
  submitButton: {
    marginTop: 24,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#1E1E1E",
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonSelected: {
    backgroundColor: "#F59E0B",
  },
  submitText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

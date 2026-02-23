export const signUpBaseStyles = {
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F1F1F",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F1F1F",
    marginBottom: 6,
  },
  helper: {
    fontSize: 12,
    color: "#8E8E8E",
    lineHeight: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F1F1F",
    marginTop: 12,
    marginBottom: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1F1F1F",
    marginBottom: 6,
  },
  roleGroup: {
    marginBottom: 12,
  },
  roleButton: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  roleButtonActive: {
    borderColor: "#F59E0B",
    backgroundColor: "rgba(245, 158, 11, 0.08)",
  },
  roleButtonText: {
    fontSize: 14,
    color: "#1F1F1F",
    fontWeight: "600",
  },
  roleButtonTextActive: {
    color: "#F59E0B",
  },
  chipGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 10,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
  },
  chipActive: {
    borderColor: "#F18A2B",
    backgroundColor: "#FFF7EF",
  },
  chipText: {
    fontSize: 13,
    color: "#1F1F1F",
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#1F1F1F",
    fontWeight: "700",
  },
  inputWrap: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 44,
    justifyContent: "center",
    marginBottom: 12,
  },
  input: {
    fontSize: 16,
    color: "#1F1F1F",
  },
  button: {
    backgroundColor: "#F59E0B",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  linkContainer: {
    flexDirection: "row",
    gap: 4,
    marginTop: 12,
    alignItems: "center",
  },
  linkMuted: {
    color: "#8E8E8E",
  },
  linkAccent: {
    color: "#F59E0B",
    fontWeight: "600",
  },
  errorText: {
    color: "#D32F2F",
    fontSize: 13,
  },
  debugText: {
    color: "#555",
    fontSize: 11,
  },
} as const;

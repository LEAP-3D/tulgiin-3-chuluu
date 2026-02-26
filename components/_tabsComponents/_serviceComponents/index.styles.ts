import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F1F1F",
  },
  sectionAll: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F59E0B",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "25%",
    alignItems: "center",
    marginBottom: 24,
  },
  iconWrap: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#F7F7F7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  iconLabel: {
    fontSize: 13,
    color: "#202020",
    fontWeight: "600",
    textAlign: "center",
  },
  promoCard: {
    backgroundColor: "#FFF6EC",
    borderRadius: 18,
    padding: 18,
    minHeight: 150,
    overflow: "hidden",
  },
  promoCarousel: {
    marginTop: 8,
  },
  promoText: {
    paddingRight: 150,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E1E1E",
    lineHeight: 24,
  },
  promoAccent: {
    color: "#F59E0B",
  },
  screenshotWrap: {
    position: "absolute",
    right: 8,
    bottom: -34,
  },
  dots: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 14,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E0E0E0",
    marginRight: 6,
  },
  dotActive: {
    width: 18,
    backgroundColor: "#F8A13A",
  },
  fab: {
    position: "absolute",
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
});

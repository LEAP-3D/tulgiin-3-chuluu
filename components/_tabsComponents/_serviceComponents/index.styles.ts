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
    flex: 1,
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
    lineHeight: 18,
    color: "#202020",
    fontWeight: "600",
    textAlign: "center",
    width: "100%",
    minHeight: 18,
  },
  tipsSection: {
    marginTop: 10,
    marginBottom: 4,
  },
  tipsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  tipsTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F1F1F",
  },
  tipsHeaderArrow: {
    fontSize: 22,
    color: "#B3B3B3",
    marginTop: -2,
  },
  tipsBoard: {
    borderWidth: 1,
    borderColor: "#E6E7EC",
    borderRadius: 14,
    paddingVertical: 4,
    paddingHorizontal: 4,
    backgroundColor: "#FFFFFF",
  },
  tipsRow: {
    flexDirection: "row",
  },
  tipCard: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: "#F7F4F2",
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  tipCardGap: {
    marginRight: 8,
  },
  tipImageWrap: {
    height: 52,
    borderRadius: 10,
    backgroundColor: "#F4E5D9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  tipTitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
    color: "#1D1D1F",
    marginBottom: 3,
    minHeight: 40,
  },
  tipSubtitle: {
    fontSize: 11,
    lineHeight: 15,
    color: "#3D3D40",
    marginBottom: 3,
    minHeight: 26,
  },
  tipFooter: {
    height: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tipRead: {
    fontSize: 13,
    lineHeight: 16,
    color: "#F59E0B",
    fontWeight: "700",
  },
  tipFooterArrow: {
    fontSize: 20,
    lineHeight: 20,
    color: "#1D1D1F",
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
    marginTop: 8,
    marginBottom: 4,
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
});

import { StyleSheet } from "react-native";
import { repairmanProfileBase } from "./repairman-profile.styles.base";
import { repairmanProfileReviews } from "./repairman-profile.styles.reviews";

export const styles = StyleSheet.create({
  ...repairmanProfileBase,
  ...repairmanProfileReviews,
});

import { StyleSheet } from "react-native";
import { orderDetailBase } from "./order.detail.styles.base";
import { orderDetailStatus } from "./order.detail.styles.status";

export const orderDetailStyles = StyleSheet.create({
  ...orderDetailBase,
  ...orderDetailStatus,
});

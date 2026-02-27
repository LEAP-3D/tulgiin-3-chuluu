import { View, Text, StyleSheet } from "react-native";
import type { OrderItem } from "./types";
import { orderDetailStyles } from "../order.detail.styles";

interface OrderMapSectionProps {
  order: (OrderItem & { latitude?: number; longitude?: number }) | null;
}

export function OrderMapSection({ order }: OrderMapSectionProps) {
  if (!order?.latitude || !order?.longitude) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={orderDetailStyles.sectionTitleSmall}>Байршил</Text>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapIcon}>📍</Text>
        <Text style={styles.mapText}>
          {order.address || "Байршил үл мэдэгдэх"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  mapPlaceholder: {
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 120,
  },
  mapIcon: {
    fontSize: 32,
  },
  mapText: {
    fontSize: 14,
    color: "#5F5F5F",
    textAlign: "center",
  },
});

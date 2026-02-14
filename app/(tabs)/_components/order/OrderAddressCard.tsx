import { Text, View } from "react-native";
import { orderDetailStyles } from "../../order.detail.styles";
import type { OrderItem } from "./types";

type Props = {
  order: OrderItem | null;
};

export function OrderAddressCard({ order }: Props) {
  return (
    <View style={orderDetailStyles.profileCard}>
      <Text style={orderDetailStyles.sectionTitleSmall}>Хаяг</Text>
      <View style={orderDetailStyles.statRow}>
        <Text style={orderDetailStyles.statLabel}>Дүүрэг</Text>
        <Text style={orderDetailStyles.statValue}>{order?.district ?? "—"}</Text>
      </View>
      <View style={orderDetailStyles.statRow}>
        <Text style={orderDetailStyles.statLabel}>Хороо</Text>
        <Text style={orderDetailStyles.statValue}>{order?.khoroo ?? "—"}</Text>
      </View>
      <View style={orderDetailStyles.statRow}>
        <Text style={orderDetailStyles.statLabel}>Хаяг</Text>
        <Text style={orderDetailStyles.statValue}>{order?.address ?? "—"}</Text>
      </View>
    </View>
  );
}

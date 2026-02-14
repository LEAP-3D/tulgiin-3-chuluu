import { Text, View } from "react-native";
import { orderDetailStyles } from "../../order.detail.styles";
import type { OrderItem } from "./types";

type Props = {
  order: OrderItem | null;
};

export function OrderDescriptionCard({ order }: Props) {
  return (
    <View style={orderDetailStyles.profileCard}>
      <Text style={orderDetailStyles.sectionTitleSmall}>Тайлбар</Text>
      <Text style={orderDetailStyles.descriptionText}>
        {order?.description?.trim() || "Тайлбаргүй."}
      </Text>
    </View>
  );
}

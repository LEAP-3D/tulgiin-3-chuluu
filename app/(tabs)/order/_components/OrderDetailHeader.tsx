import { Pressable, Text, View } from "react-native";
import LeftArrowIcon from "@/components/icons/_serviceIcons/leftarrowIcon";
import { orderDetailStyles } from "../order.detail.styles";

type Props = {
  onBack: () => void;
};

export function OrderDetailHeader({ onBack }: Props) {
  return (
    <View style={orderDetailStyles.detailHeader}>
      <Pressable onPress={onBack} hitSlop={10} style={orderDetailStyles.backButton}>
        <LeftArrowIcon width={20} height={20} />
      </Pressable>
      <Text style={orderDetailStyles.detailTitle}>
        Захиалгын дэлгэрэнгүй мэдээлэл
      </Text>
    </View>
  );
}

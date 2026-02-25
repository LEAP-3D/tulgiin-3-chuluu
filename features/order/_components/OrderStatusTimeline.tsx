import { Text, View } from "react-native";
import { orderDetailStyles } from "../order.detail.styles";
import type { TimelineItem } from "./types";

type Props = {
  timeline: TimelineItem[];
};

export function OrderStatusTimeline({ timeline }: Props) {
  return (
    <View style={orderDetailStyles.statusCard}>
      <Text style={orderDetailStyles.statusTitle}>Статус</Text>
      {timeline.map((item, index) => {
        const isLast = index === timeline.length - 1;
        const dotStyles = [
          orderDetailStyles.statusDot,
          item.active && orderDetailStyles.statusDotActive,
          item.tone === "danger" && orderDetailStyles.statusDotDanger,
        ];
        const textStyles = [
          orderDetailStyles.statusText,
          item.active && orderDetailStyles.statusTextActive,
          item.tone === "danger" && orderDetailStyles.statusTextDanger,
        ];
        return (
          <View key={item.title} style={orderDetailStyles.statusRow}>
            <View style={orderDetailStyles.statusLeft}>
              <View style={dotStyles} />
              {!isLast && <View style={orderDetailStyles.statusLine} />}
            </View>
            <View style={orderDetailStyles.statusRight}>
              <Text style={textStyles}>{item.title}</Text>
              <Text style={orderDetailStyles.statusTime}>{item.time}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

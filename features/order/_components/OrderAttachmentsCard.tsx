import { Image, Text, View } from "react-native";
import { orderDetailStyles } from "../order.detail.styles";

type Props = {
  attachments: string[];
};

export function OrderAttachmentsCard({ attachments }: Props) {
  return (
    <View style={orderDetailStyles.profileCard}>
      <Text style={orderDetailStyles.sectionTitleSmall}>Зураг</Text>
      {attachments.length === 0 ? (
        <Text style={orderDetailStyles.descriptionMuted}>Зураг хавсаргаагүй.</Text>
      ) : (
        <View style={orderDetailStyles.attachmentRow}>
          {attachments.map((uri, index) => (
            <Image
              key={`${uri}-${index}`}
              source={{ uri }}
              style={orderDetailStyles.attachmentImage}
            />
          ))}
        </View>
      )}
    </View>
  );
}

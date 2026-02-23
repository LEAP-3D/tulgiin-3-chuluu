import { Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { baseStyles } from "./styles/base";

type Props = {
  onBack: () => void;
  title: string;
};

export function Header({ onBack, title }: Props) {
  return (
    <View style={baseStyles.headerRow}>
      <Pressable onPress={onBack} hitSlop={10} style={baseStyles.backButton}>
        <MaterialCommunityIcons name="arrow-left" size={22} color="#111111" />
      </Pressable>
      <Text style={baseStyles.headerTitle}>{title}</Text>
    </View>
  );
}

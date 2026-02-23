import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { baseStyles } from "./styles/base";

type Props = {
  label: string;
  icon: string;
  error?: string;
};

export function ServiceTypeSection({ label, icon, error }: Props) {
  return (
    <>
      <Text style={baseStyles.label}>Төрөл</Text>
      <View style={baseStyles.typePill}>
        <View style={baseStyles.typeIconWrap}>
          <MaterialCommunityIcons
            name={icon as any}
            size={18}
            color="#F59E0B"
          />
        </View>
        <Text style={baseStyles.typeText}>{label}</Text>
      </View>
      {!!error && <Text style={baseStyles.errorText}>{error}</Text>}
    </>
  );
}

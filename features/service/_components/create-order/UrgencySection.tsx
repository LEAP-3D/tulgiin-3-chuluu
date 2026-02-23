import { Pressable, Text, View } from "react-native";
import { baseStyles } from "./styles/base";

type Props = {
  urgency: "normal" | "urgent" | null;
  onChange: (value: "normal" | "urgent") => void;
  error?: string;
};

export function UrgencySection({ urgency, onChange, error }: Props) {
  return (
    <>
      <Text style={baseStyles.label}>Яаралтай эсэх</Text>
      <View style={baseStyles.urgencyRow}>
        <Pressable
          style={[
            baseStyles.urgencyButton,
            urgency === "normal" && baseStyles.urgencySelected,
            error && baseStyles.inputError,
          ]}
          onPress={() => onChange("normal")}
        >
          <Text
            style={[
              baseStyles.urgencyText,
              urgency === "normal" && baseStyles.urgencyTextSelected,
            ]}
          >
            Энгийн
          </Text>
        </Pressable>
        <Pressable
          style={[
            baseStyles.urgencyButton,
            urgency === "urgent" && baseStyles.urgencySelected,
            error && baseStyles.inputError,
          ]}
          onPress={() => onChange("urgent")}
        >
          <Text
            style={[
              baseStyles.urgencyText,
              urgency === "urgent" && baseStyles.urgencyTextSelected,
            ]}
          >
            Яаралтай
          </Text>
        </Pressable>
      </View>
      {!!error && <Text style={baseStyles.errorTextBelow}>{error}</Text>}
    </>
  );
}

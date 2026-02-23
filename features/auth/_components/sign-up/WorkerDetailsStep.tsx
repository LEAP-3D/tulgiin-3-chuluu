import { Pressable, Text, View } from "react-native";
import { styles } from "../../sign-up.styles";
import { PROFESSION_OPTIONS } from "./constants";

type Props = {
  workTypes: string[];
  onToggleWorkType: (value: string) => void;
  onNext: () => void;
  canContinue: boolean;
};

export function WorkerDetailsStep({
  workTypes,
  onToggleWorkType,
  onNext,
  canContinue,
}: Props) {
  return (
    <>
      <Text style={styles.sectionTitle}>Мэргэжил</Text>
      <Text style={styles.helper}>Та өөрийн мэргэжлүүдээ сонгоно уу</Text>
      <View style={styles.chipGroup}>
        {PROFESSION_OPTIONS.map((item) => {
          const selected = workTypes.includes(item.key);
          return (
            <Pressable
              key={item.key}
              style={[styles.chip, selected && styles.chipActive]}
              onPress={() => onToggleWorkType(item.key)}
            >
              <item.Icon width={18} height={18} />
              <Text style={[styles.chipText, selected && styles.chipTextActive]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          !canContinue && styles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
        onPress={onNext}
        disabled={!canContinue}
      >
        <Text style={styles.buttonText}>Үргэлжлүүлэх</Text>
      </Pressable>
    </>
  );
}

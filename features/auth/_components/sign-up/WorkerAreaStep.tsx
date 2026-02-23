import { Pressable, Text, View } from "react-native";
import { styles } from "../../sign-up.styles";
import { SERVICE_AREA_OPTIONS } from "./constants";

type Props = {
  serviceAreas: string[];
  onToggleServiceArea: (value: string) => void;
  onNext: () => void;
  canContinue: boolean;
};

export function WorkerAreaStep({
  serviceAreas,
  onToggleServiceArea,
  onNext,
  canContinue,
}: Props) {
  return (
    <>
      <Text style={styles.sectionTitle}>Үйлчлэх бүс</Text>
      <Text style={styles.helper}>
        Та өөрийн ажиллах боломжтой бүсийг сонгоно уу
      </Text>
      <View style={styles.chipGroup}>
        {SERVICE_AREA_OPTIONS.map((area) => {
          const selected = serviceAreas.includes(area);
          return (
            <Pressable
              key={area}
              style={[styles.chip, selected && styles.chipActive]}
              onPress={() => onToggleServiceArea(area)}
            >
              <Text style={[styles.chipText, selected && styles.chipTextActive]}>
                {area}
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

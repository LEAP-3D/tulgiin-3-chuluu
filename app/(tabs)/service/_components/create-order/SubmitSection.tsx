import { Pressable, Text } from "react-native";
import { baseStyles } from "./styles/base";

type Props = {
  isSubmitting: boolean;
  hasWorker: boolean;
  submitError: string | null;
  onPress: () => void;
};

export function SubmitSection({
  isSubmitting,
  hasWorker,
  submitError,
  onPress,
}: Props) {
  return (
    <>
      {!!submitError && <Text style={baseStyles.errorText}>{submitError}</Text>}
      <Pressable
        style={[
          baseStyles.submitButton,
          hasWorker && baseStyles.submitButtonSelected,
          isSubmitting && { opacity: 0.7 },
        ]}
        onPress={onPress}
        disabled={isSubmitting}
      >
        <Text style={baseStyles.submitText}>
          {isSubmitting
            ? "Илгээж байна..."
            : hasWorker
              ? "Захиалгын хүсэлт илгээх"
              : "Засварчин сонгох"}
        </Text>
      </Pressable>
    </>
  );
}

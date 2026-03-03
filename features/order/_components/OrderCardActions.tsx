import { Pressable, Text, View } from "react-native";
import { styles } from "../order.styles";

type Props = {
  showActions: boolean;
  isUpdating: boolean;
  primaryLabel: string;
  secondaryLabel: string;
  onPrimaryPress: () => void;
  onSecondaryPress: () => void;
  showUserPayButton: boolean;
  onPay: () => void;
  showWorkerCashConfirm: boolean;
  confirmCashLabel: string;
  onConfirmCash: () => void;
};

export function OrderCardActions({
  showActions,
  isUpdating,
  primaryLabel,
  secondaryLabel,
  onPrimaryPress,
  onSecondaryPress,
  showUserPayButton,
  onPay,
  showWorkerCashConfirm,
  confirmCashLabel,
  onConfirmCash,
}: Props) {
  return (
    <>
      {showActions ? (
        <View style={styles.orderActions}>
          <Pressable
            disabled={isUpdating}
            style={[
              styles.actionButton,
              styles.acceptButton,
              isUpdating && styles.actionButtonDisabled,
            ]}
            onPress={onPrimaryPress}
            accessibilityLabel={primaryLabel}
            accessibilityRole="button"
            accessibilityState={{ disabled: isUpdating }}
          >
            <Text style={styles.actionText}>{primaryLabel}</Text>
          </Pressable>
          <Pressable
            disabled={isUpdating}
            style={[
              styles.actionButton,
              styles.rejectButton,
              isUpdating && styles.actionButtonDisabled,
            ]}
            onPress={onSecondaryPress}
            accessibilityLabel={secondaryLabel}
            accessibilityRole="button"
            accessibilityState={{ disabled: isUpdating }}
          >
            <Text style={styles.actionTextDark}>{secondaryLabel}</Text>
          </Pressable>
        </View>
      ) : null}

      {showUserPayButton ? (
        <Pressable
          style={[styles.actionButton, styles.acceptButton]}
          onPress={onPay}
          accessibilityLabel="Төлбөр төлөх"
          accessibilityRole="button"
        >
          <Text style={styles.actionText}>Төлбөр төлөх</Text>
        </Pressable>
      ) : null}

      {showWorkerCashConfirm ? (
        <Pressable
          disabled={isUpdating}
          style={[
            styles.actionButton,
            styles.acceptButton,
            isUpdating && styles.actionButtonDisabled,
          ]}
          onPress={onConfirmCash}
          accessibilityLabel={confirmCashLabel}
          accessibilityRole="button"
          accessibilityState={{ disabled: isUpdating }}
        >
          <Text style={styles.actionText}>{confirmCashLabel}</Text>
        </Pressable>
      ) : null}
    </>
  );
}

import { Pressable, Text, View, Alert } from "react-native";
import { orderDetailStyles } from "../order.detail.styles";
import { styles } from "../order.styles";

interface OrderActionSectionProps {
  primaryLabel: string;
  secondaryLabel: string;
  isUpdating: boolean;
  primary?: {
    label: string;
    status: string;
    confirm?: { title: string; message: string };
  };
  secondary?: {
    label: string;
    status: string;
    confirm?: { title: string; message: string };
  };
  onPrimaryPress: () => void;
  onSecondaryPress: () => void;
}

export function OrderActionSection({
  primaryLabel,
  secondaryLabel,
  isUpdating,
  primary,
  secondary,
  onPrimaryPress,
  onSecondaryPress,
}: OrderActionSectionProps) {
  if (!primary || !secondary) return null;

  const handleAction = (
    action: {
      label: string;
      status: string;
      confirm?: { title: string; message: string };
    },
    onPress: () => void,
  ) => {
    if (action.confirm) {
      Alert.alert(action.confirm.title, action.confirm.message, [
        { text: "Болих", style: "cancel" },
        {
          text: action.label,
          style: "destructive",
          onPress,
        },
      ]);
      return;
    }
    onPress();
  };

  return (
    <View style={orderDetailStyles.profileCard}>
      <Text style={orderDetailStyles.sectionTitleSmall}>Статус шинэчлэх</Text>
      <View style={styles.orderActions}>
        <Pressable
          disabled={isUpdating}
          style={[
            styles.actionButton,
            styles.acceptButton,
            isUpdating && styles.actionButtonDisabled,
          ]}
          onPress={() => handleAction(primary, onPrimaryPress)}
          accessible={true}
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
          onPress={() => handleAction(secondary, onSecondaryPress)}
          accessible={true}
          accessibilityLabel={secondaryLabel}
          accessibilityRole="button"
          accessibilityState={{ disabled: isUpdating }}
        >
          <Text style={styles.actionTextDark}>{secondaryLabel}</Text>
        </Pressable>
      </View>
    </View>
  );
}

import { Alert, Pressable, Text, View } from "react-native";
import { styles } from "../order.styles";
import { STATUS_LABELS } from "./constants";
import { SERVICE_EMOJIS } from "@/constants/services";
import type { OrderItem } from "./types";
import { getWorkerActions } from "./helpers";
import { getStatusColor } from "@/lib/status-colors";

type Props = {
  order: OrderItem;
  profileRole: "user" | "worker" | null;
  profileId: string | null;
  isWorkerView: boolean;
  updatingOrderId: string | null;
  updatingStatus: string | null;
  onSelectOrder: (order: OrderItem) => void;
  onAccept: (orderId: string) => void;
  onReject: (orderId: string) => void;
  onEnRoute: (orderId: string) => void;
  onInProgress: (orderId: string) => void;
  onComplete: (orderId: string) => void;
  onCancel: (orderId: string) => void;
  onPay: (orderId: string) => void;
};

export function OrderCard({
  order,
  profileRole,
  profileId,
  isWorkerView,
  updatingOrderId,
  updatingStatus,
  onSelectOrder,
  onAccept,
  onReject,
  onEnRoute,
  onInProgress,
  onComplete,
  onCancel,
  onPay,
}: Props) {
  const label = order.service_label ?? order.service_key ?? "Үйлчилгээ";
  const statusText =
    (order.status && STATUS_LABELS[order.status]) ?? STATUS_LABELS.pending;
  const icon = order.service_key
    ? (SERVICE_EMOJIS[order.service_key] ?? "⚡")
    : "⚡";
  const statusColor = getStatusColor(order.status);
  const actions = getWorkerActions(order, profileRole, profileId);
  const primary = actions?.primary;
  const secondary = actions?.secondary;
  const isUpdating = updatingOrderId === order.id;
  const showActions = !!primary && !!secondary;

  const handleStatusChange = (status: string) => {
    switch (status) {
      case "accepted":
        onAccept(order.id);
        break;
      case "rejected":
        onReject(order.id);
        break;
      case "cancelled":
        onCancel(order.id);
        break;
      case "en_route":
        onEnRoute(order.id);
        break;
      case "in_progress":
        onInProgress(order.id);
        break;
      case "completed":
        onComplete(order.id);
        break;
      default:
        break;
    }
  };

  const handleAction = (action?: typeof primary) => {
    if (!action) return;
    if (action.confirm) {
      Alert.alert(action.confirm.title, action.confirm.message, [
        { text: "Болих", style: "cancel" },
        {
          text: action.label,
          style: "destructive",
          onPress: () => handleStatusChange(action.status),
        },
      ]);
      return;
    }
    handleStatusChange(action.status);
  };

  const primaryLabel =
    isUpdating && updatingStatus === primary?.status
      ? "Ачаалж байна..."
      : (primary?.label ?? "");
  const secondaryLabel =
    isUpdating && updatingStatus === secondary?.status
      ? "Ачаалж байна..."
      : (secondary?.label ?? "");
  const orderCode = order.id.slice(0, 8).toUpperCase();

  return (
    <View key={order.id} style={styles.orderCard}>
      <Pressable
        style={({ pressed }) => [
          styles.orderMain,
          pressed && styles.cardPressed,
        ]}
        onPress={() => onSelectOrder(order)}
        accessible={true}
        accessibilityLabel={`Захиалга ${orderCode} - ${label} (${statusText})`}
        accessibilityRole="button"
        accessibilityHint="Дарсан нь дэлгэрэнгүй мэдээлэл харах"
      >
        <View style={styles.orderMeta}>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: statusColor.bg,
                borderColor: statusColor.border,
              },
            ]}
          >
            <Text
              style={{
                color: statusColor.text,
                fontSize: 12,
                fontWeight: "600",
              }}
            >
              {statusColor.icon} {statusText}
            </Text>
          </View>
          <View style={styles.orderRow}>
            <View style={styles.orderIcon}>
              <Text style={styles.orderIconText}>{icon}</Text>
            </View>
            <Text style={styles.orderTitle}>{label}</Text>
          </View>
          <Text style={styles.orderNumber}>Захиалга № {orderCode}</Text>
          {order.payment_amount ? (
            <Text style={styles.paymentAmount}>
              {order.payment_amount.toLocaleString("en-US")} ₮
            </Text>
          ) : null}
          {order.payment_status && order.payment_status !== "pending" ? (
            <Text style={styles.paymentStatus}>✓ Төлбөр төлөгдсөн</Text>
          ) : null}
        </View>
        <Text style={styles.chevron}>›</Text>
      </Pressable>
      {showActions ? (
        <View style={styles.orderActions}>
          <Pressable
            disabled={isUpdating}
            style={[
              styles.actionButton,
              styles.acceptButton,
              isUpdating && styles.actionButtonDisabled,
            ]}
            onPress={() => handleAction(primary)}
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
            onPress={() => handleAction(secondary)}
            accessibilityLabel={secondaryLabel}
            accessibilityRole="button"
            accessibilityState={{ disabled: isUpdating }}
          >
            <Text style={styles.actionTextDark}>{secondaryLabel}</Text>
          </Pressable>
        </View>
      ) : null}
      {!isWorkerView &&
      order.payment_method === "bank_app" &&
      order.payment_status === "pending" &&
      order.payment_followup_link ? (
        <Pressable
          style={[styles.actionButton, styles.acceptButton]}
          onPress={() => onPay(order.id)}
          accessibilityLabel="Төлбөр төлөх"
          accessibilityRole="button"
        >
          <Text style={styles.actionText}>Төлбөр төлөх</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

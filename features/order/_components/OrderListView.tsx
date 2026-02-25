import { Alert, Pressable, Text, View } from "react-native";
import { styles } from "../order.styles";
import { STATUS_LABELS } from "./constants";
import { SERVICE_EMOJIS } from "@/constants/services";
import type { OrderItem } from "./types";
import { getWorkerActions } from "./helpers";

type Props = {
  orders: OrderItem[];
  isLoading: boolean;
  errorMessage: string | null;
  profileRole: "user" | "worker" | null;
  profileId: string | null;
  updatingOrderId: string | null;
  updatingStatus: string | null;
  onSelectOrder: (order: OrderItem) => void;
  onAccept: (orderId: string) => void;
  onReject: (orderId: string) => void;
  onEnRoute: (orderId: string) => void;
  onInProgress: (orderId: string) => void;
  onComplete: (orderId: string) => void;
  onCancel: (orderId: string) => void;
};

export function OrderListView({
  orders,
  isLoading,
  errorMessage,
  profileRole,
  profileId,
  updatingOrderId,
  updatingStatus,
  onSelectOrder,
  onAccept,
  onReject,
  onEnRoute,
  onInProgress,
  onComplete,
  onCancel,
}: Props) {
  return (
    <View style={styles.listScreen}>
      <Text style={styles.pageTitle}>Таны захиалга</Text>

      {isLoading ? (
        <View style={styles.orderCard}>
          <Text style={styles.orderStatus}>Ачаалж байна...</Text>
        </View>
      ) : errorMessage ? (
        <View style={styles.orderCard}>
          <Text style={styles.orderStatus}>Алдаа</Text>
          <Text style={styles.orderTitle}>{errorMessage}</Text>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.orderCard}>
          <Text style={styles.orderStatus}>Одоогоор захиалга алга.</Text>
        </View>
      ) : (
        orders.map((order) => {
          const label = order.service_label ?? order.service_key ?? "Үйлчилгээ";
          const statusText =
            (order.status && STATUS_LABELS[order.status]) ??
            STATUS_LABELS.pending;
          const icon = order.service_key
            ? SERVICE_EMOJIS[order.service_key] ?? "⚡"
            : "⚡";
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
              : primary?.label ?? "";
          const secondaryLabel =
            isUpdating && updatingStatus === secondary?.status
              ? "Ачаалж байна..."
              : secondary?.label ?? "";
          return (
            <View key={order.id} style={styles.orderCard}>
              <Pressable
                style={({ pressed }) => [
                  styles.orderMain,
                  pressed && styles.cardPressed,
                ]}
                onPress={() => onSelectOrder(order)}
              >
                <View style={styles.orderMeta}>
                  <Text style={styles.orderStatus}>{statusText}</Text>
                  <View style={styles.orderRow}>
                    <View style={styles.orderIcon}>
                      <Text style={styles.orderIconText}>{icon}</Text>
                    </View>
                    <Text style={styles.orderTitle}>{label}</Text>
                  </View>
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
                  >
                    <Text style={styles.actionTextDark}>{secondaryLabel}</Text>
                  </Pressable>
                </View>
              ) : null}
            </View>
          );
        })
      )}
    </View>
  );
}

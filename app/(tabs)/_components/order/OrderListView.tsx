import { Pressable, Text, View } from "react-native";
import { styles } from "../../order.styles";
import { STATUS_LABELS } from "./constants";
import { SERVICE_EMOJIS } from "@/constants/services";
import type { OrderItem } from "./types";

type Props = {
  orders: OrderItem[];
  isLoading: boolean;
  errorMessage: string | null;
  profileRole: "user" | "worker" | null;
  profileId: string | null;
  onSelectOrder: (order: OrderItem) => void;
  onAccept: (orderId: string) => void;
  onReject: (orderId: string) => void;
};

export function OrderListView({
  orders,
  isLoading,
  errorMessage,
  profileRole,
  profileId,
  onSelectOrder,
  onAccept,
  onReject,
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
          const showActions =
            profileRole === "worker" &&
            order.status === "pending" &&
            order.worker_profile_id === profileId;
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
                    style={[styles.actionButton, styles.acceptButton]}
                    onPress={() => onAccept(order.id)}
                  >
                    <Text style={styles.actionText}>Хүлээн авах</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => onReject(order.id)}
                  >
                    <Text style={styles.actionTextDark}>Татгалзах</Text>
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

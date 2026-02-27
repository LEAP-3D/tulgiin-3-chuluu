import { Text, View } from "react-native";
import { styles } from "../order.styles";
import type { OrderItem } from "./types";
import { OrderListSkeleton } from "@/components/Skeleton";
import { EmptyState } from "@/components/EmptyState";
import { OrderCard } from "./OrderCard";

type Props = {
  orders: OrderItem[];
  isLoading: boolean;
  errorMessage: string | null;
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
  onRetry?: () => void;
};

export function OrderListView({
  orders,
  isLoading,
  errorMessage,
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
  onRetry,
}: Props) {
  return (
    <View style={styles.listScreen}>
      <Text style={styles.pageTitle}>Таны захиалга</Text>

      {isLoading ? (
        <OrderListSkeleton />
      ) : errorMessage ? (
        <EmptyState
          type="error"
          action={
            onRetry ? { label: "Дахин оролддо", onPress: onRetry } : undefined
          }
        />
      ) : orders.length === 0 ? (
        <EmptyState type="orders" />
      ) : (
        orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            profileRole={profileRole}
            profileId={profileId}
            isWorkerView={isWorkerView}
            updatingOrderId={updatingOrderId}
            updatingStatus={updatingStatus}
            onSelectOrder={onSelectOrder}
            onAccept={onAccept}
            onReject={onReject}
            onEnRoute={onEnRoute}
            onInProgress={onInProgress}
            onComplete={onComplete}
            onCancel={onCancel}
            onPay={onPay}
          />
        ))
      )}
    </View>
  );
}

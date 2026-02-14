import { useState } from "react";
import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./order.styles";
import { useOrdersList } from "./_components/useOrdersList";
import { useOrderDetail } from "./_components/useOrderDetail";
import { OrderListView } from "./_components/OrderListView";
import { OrderDetailView } from "./_components/OrderDetailView";
import type { OrderItem } from "./_components/types";

export default function OrderScreen() {
  const router = useRouter();
  const apiBaseUrl =
    process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
  const [showDetail, setShowDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  const ordersState = useOrdersList(apiBaseUrl);
  const detailState = useOrderDetail(
    apiBaseUrl,
    selectedOrder,
    showDetail,
    ordersState.profileRole,
  );

  const isWorkerView = ordersState.profileRole === "worker";

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {!showDetail ? (
          <OrderListView
            orders={ordersState.orders}
            isLoading={ordersState.isLoading}
            errorMessage={ordersState.errorMessage}
            profileRole={ordersState.profileRole}
            profileId={ordersState.profileId}
            onSelectOrder={(order) => {
              setSelectedOrder(order);
              setShowDetail(true);
            }}
            onAccept={ordersState.acceptOrder}
            onReject={ordersState.rejectOrder}
          />
        ) : (
          <OrderDetailView
            selectedOrder={selectedOrder}
            isWorkerView={isWorkerView}
            worker={detailState.worker}
            isWorkerLoading={detailState.isWorkerLoading}
            workerError={detailState.workerError}
            customer={detailState.customer}
            isCustomerLoading={detailState.isCustomerLoading}
            customerError={detailState.customerError}
            attachments={detailState.attachments}
            timeline={detailState.timeline}
            onBack={() => setShowDetail(false)}
            onChat={() => {
              if (!selectedOrder?.id) return;
              router.push({
                pathname: "/(tabs)/zurwas",
                params: {
                  orderId: selectedOrder.id,
                  userProfileId: selectedOrder.user_profile_id ?? "",
                  workerProfileId: selectedOrder.worker_profile_id ?? "",
                },
              });
            }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Alert, Linking, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "@/features/order/order.styles";
import { useOrdersList } from "@/features/order/_components/useOrdersList";
import { useOrderDetail } from "@/features/order/_components/useOrderDetail";
import { OrderListView } from "@/features/order/_components/OrderListView";
import { OrderDetailView } from "@/features/order/_components/OrderDetailView";
import type { OrderItem } from "@/features/order/_components/types";
import { usePullToRefresh } from "@/lib/hooks/usePullToRefresh";

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

  const handleRetry = () => {
    ordersState.retryLoadOrders?.();
  };

  const refreshConfig = usePullToRefresh({
    onRefresh: async () => {
      ordersState.retryLoadOrders?.();
    },
  });

  useEffect(() => {
    if (!showDetail) return;
    setSelectedOrder((current) => {
      if (!current?.id) return current;
      const updated = ordersState.orders.find(
        (order) => order.id === current.id,
      );
      return updated && updated !== current ? updated : current;
    });
  }, [ordersState.orders, showDetail]);

  const isWorkerView = ordersState.profileRole === "worker";
  const handleComplete = (orderId: string) => {
    router.push({ pathname: "/payment", params: { orderId } });
  };

  const handlePay = (orderId: string) => {
    const order = ordersState.orders.find((item) => item.id === orderId);
    const link = order?.payment_followup_link;
    if (!link) {
      Alert.alert("Алдаа", "Төлбөрийн холбоос олдсонгүй.");
      return;
    }
    Linking.openURL(link).catch(() => {
      Alert.alert("Алдаа", "Төлбөрийн холбоос нээх үед алдаа гарлаа.");
    });
  };

  return (
    <SafeAreaView style={styles.safe} edges={["left", "right", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          !showDetail ? (
            <RefreshControl
              refreshing={refreshConfig.refreshing}
              onRefresh={refreshConfig.onRefresh}
              tintColor={refreshConfig.tintColor}
              title={refreshConfig.title}
              titleColor={refreshConfig.titleColor}
            />
          ) : undefined
        }
      >
        {!showDetail ? (
          <OrderListView
            orders={ordersState.orders}
            isLoading={ordersState.isLoading}
            errorMessage={ordersState.errorMessage}
            profileRole={ordersState.profileRole}
            profileId={ordersState.profileId}
            isWorkerView={isWorkerView}
            updatingOrderId={ordersState.updatingOrderId}
            updatingStatus={ordersState.updatingStatus}
            onSelectOrder={(order) => {
              setSelectedOrder(order);
              setShowDetail(true);
            }}
            onAccept={ordersState.acceptOrder}
            onReject={ordersState.rejectOrder}
            onEnRoute={ordersState.setEnRoute}
            onInProgress={ordersState.setInProgress}
            onComplete={handleComplete}
            onCancel={ordersState.cancelOrder}
            onPay={handlePay}
            onRetry={handleRetry}
          />
        ) : (
          <OrderDetailView
            selectedOrder={selectedOrder}
            isWorkerView={isWorkerView}
            profileRole={ordersState.profileRole}
            profileId={ordersState.profileId}
            worker={detailState.worker}
            isWorkerLoading={detailState.isWorkerLoading}
            workerError={detailState.workerError}
            customer={detailState.customer}
            isCustomerLoading={detailState.isCustomerLoading}
            customerError={detailState.customerError}
            attachments={detailState.attachments}
            timeline={detailState.timeline}
            updatingOrderId={ordersState.updatingOrderId}
            updatingStatus={ordersState.updatingStatus}
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
            onAccept={ordersState.acceptOrder}
            onReject={ordersState.rejectOrder}
            onEnRoute={ordersState.setEnRoute}
            onInProgress={ordersState.setInProgress}
            onComplete={handleComplete}
            onCancel={ordersState.cancelOrder}
            onPay={handlePay}
            onConfirmCash={ordersState.confirmCashPayment}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

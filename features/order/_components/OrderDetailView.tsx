import { Alert, Pressable, Text, View } from "react-native";
import type { CustomerProfile, OrderItem, TimelineItem, WorkerProfile } from "./types";
import { OrderDetailHeader } from "./OrderDetailHeader";
import { OrderProfileCard } from "./OrderProfileCard";
import { OrderCustomerInfoCard } from "./OrderCustomerInfoCard";
import { OrderAddressCard } from "./OrderAddressCard";
import { OrderDescriptionCard } from "./OrderDescriptionCard";
import { OrderAttachmentsCard } from "./OrderAttachmentsCard";
import { OrderStatusTimeline } from "./OrderStatusTimeline";
import { orderDetailStyles } from "../order.detail.styles";
import { styles } from "../order.styles";
import { getWorkerActions } from "./helpers";

type Props = {
  selectedOrder: OrderItem | null;
  isWorkerView: boolean;
  profileRole: "user" | "worker" | null;
  profileId: string | null;
  worker: WorkerProfile | null;
  isWorkerLoading: boolean;
  workerError: string | null;
  customer: CustomerProfile | null;
  isCustomerLoading: boolean;
  customerError: string | null;
  attachments: string[];
  timeline: TimelineItem[];
  updatingOrderId: string | null;
  updatingStatus: string | null;
  onBack: () => void;
  onChat: () => void;
  onAccept: (orderId: string) => void;
  onReject: (orderId: string) => void;
  onEnRoute: (orderId: string) => void;
  onInProgress: (orderId: string) => void;
  onComplete: (orderId: string) => void;
  onCancel: (orderId: string) => void;
  onPay: (orderId: string) => void;
  onConfirmCash: (orderId: string) => void;
};

export function OrderDetailView({
  selectedOrder,
  isWorkerView,
  profileRole,
  profileId,
  worker,
  isWorkerLoading,
  workerError,
  customer,
  isCustomerLoading,
  customerError,
  attachments,
  timeline,
  updatingOrderId,
  updatingStatus,
  onBack,
  onChat,
  onAccept,
  onReject,
  onEnRoute,
  onInProgress,
  onComplete,
  onCancel,
  onPay,
  onConfirmCash,
}: Props) {
  const actions = getWorkerActions(selectedOrder, profileRole, profileId);
  const primary = actions?.primary;
  const secondary = actions?.secondary;
  const isUpdating =
    !!selectedOrder?.id && updatingOrderId === selectedOrder.id;
  const primaryLabel =
    isUpdating && updatingStatus === primary?.status
      ? "Ачаалж байна..."
      : primary?.label ?? "";
  const secondaryLabel =
    isUpdating && updatingStatus === secondary?.status
      ? "Ачаалж байна..."
      : secondary?.label ?? "";
  const paymentAmount = selectedOrder?.payment_amount;
  const paymentMethod = selectedOrder?.payment_method;
  const paymentStatus = selectedOrder?.payment_status;
  const paymentLink = selectedOrder?.payment_followup_link;
  const canCreatePayment =
    isWorkerView &&
    selectedOrder?.status === "completed" &&
    !paymentAmount &&
    !paymentMethod &&
    !paymentStatus &&
    !paymentLink;
  const showPaymentCard =
    canCreatePayment ||
    !!paymentAmount ||
    !!paymentMethod ||
    !!paymentStatus ||
    !!paymentLink;
  const showUserPayButton =
    !isWorkerView &&
    paymentMethod === "bank_app" &&
    paymentStatus === "pending" &&
    !!paymentLink;
  const showWorkerCashConfirm =
    isWorkerView && paymentMethod === "cash" && paymentStatus === "pending";
  const paymentMethodLabel =
    paymentMethod === "cash"
      ? "Бэлэн"
      : paymentMethod === "bank_app"
        ? "Банкны апп"
        : "—";
  const paymentStatusLabel =
    paymentStatus === "paid"
      ? "Төлсөн"
      : paymentStatus === "failed"
        ? "Амжилтгүй"
        : paymentStatus === "pending"
          ? "Хүлээгдэж байна"
          : "—";
  const paymentAmountLabel =
    typeof paymentAmount === "number"
      ? `${paymentAmount.toLocaleString("en-US")} ₮`
      : "—";

  const handleStatusChange = (status: string) => {
    if (!selectedOrder?.id) return;
    switch (status) {
      case "accepted":
        onAccept(selectedOrder.id);
        break;
      case "rejected":
        onReject(selectedOrder.id);
        break;
      case "cancelled":
        onCancel(selectedOrder.id);
        break;
      case "en_route":
        onEnRoute(selectedOrder.id);
        break;
      case "in_progress":
        onInProgress(selectedOrder.id);
        break;
      case "completed":
        onComplete(selectedOrder.id);
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

  return (
    <View style={orderDetailStyles.detailScreen}>
      <OrderDetailHeader onBack={onBack} />

      <OrderProfileCard
        isWorkerView={isWorkerView}
        customer={customer}
        worker={worker}
        selectedOrder={selectedOrder}
        isWorkerLoading={isWorkerLoading}
        workerError={workerError}
        onChat={onChat}
      />

      {primary && secondary ? (
        <View style={orderDetailStyles.profileCard}>
          <Text style={orderDetailStyles.sectionTitleSmall}>
            Статус шинэчлэх
          </Text>
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
        </View>
      ) : null}

      {isWorkerView ? (
        <OrderCustomerInfoCard
          customer={customer}
          isCustomerLoading={isCustomerLoading}
          customerError={customerError}
        />
      ) : null}

      {isWorkerView ? <OrderAddressCard order={selectedOrder} /> : null}

      {isWorkerView ? <OrderDescriptionCard order={selectedOrder} /> : null}

      {isWorkerView ? <OrderAttachmentsCard attachments={attachments} /> : null}

      <OrderStatusTimeline timeline={timeline} />

      {showPaymentCard ? (
        <View style={orderDetailStyles.profileCard}>
          <Text style={orderDetailStyles.sectionTitleSmall}>Төлбөр</Text>
          {!canCreatePayment ? (
            <View style={orderDetailStyles.profileStats}>
              <View style={orderDetailStyles.statRow}>
                <Text style={orderDetailStyles.statLabel}>Дүн</Text>
                <Text style={orderDetailStyles.statValue}>{paymentAmountLabel}</Text>
              </View>
              <View style={orderDetailStyles.statRow}>
                <Text style={orderDetailStyles.statLabel}>Төлбөрийн хэлбэр</Text>
                <Text style={orderDetailStyles.statValue}>{paymentMethodLabel}</Text>
              </View>
              <View style={orderDetailStyles.statRow}>
                <Text style={orderDetailStyles.statLabel}>Төлөв</Text>
                <Text style={orderDetailStyles.statValue}>{paymentStatusLabel}</Text>
              </View>
            </View>
          ) : (
            <Text style={orderDetailStyles.workerStatusText}>
              Төлбөрийн мэдээлэл оруулаагүй байна.
            </Text>
          )}
          {canCreatePayment ? (
            <View style={styles.orderActions}>
              <Pressable
                style={[styles.actionButton, styles.acceptButton]}
                onPress={() => {
                  if (!selectedOrder?.id) return;
                  onComplete(selectedOrder.id);
                }}
              >
                <Text style={styles.actionText}>Төлбөр үүсгэх</Text>
              </Pressable>
            </View>
          ) : null}
          {showUserPayButton ? (
            <View style={styles.orderActions}>
              <Pressable
                style={[styles.actionButton, styles.acceptButton]}
                onPress={() => {
                  if (!selectedOrder?.id) return;
                  onPay(selectedOrder.id);
                }}
              >
                <Text style={styles.actionText}>Төлбөр төлөх</Text>
              </Pressable>
            </View>
          ) : null}
          {showWorkerCashConfirm ? (
            <View style={styles.orderActions}>
              <Pressable
                style={[styles.actionButton, styles.acceptButton]}
                onPress={() => {
                  if (!selectedOrder?.id) return;
                  onConfirmCash(selectedOrder.id);
                }}
              >
                <Text style={styles.actionText}>Бэлнээр төлснийг батлах</Text>
              </Pressable>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

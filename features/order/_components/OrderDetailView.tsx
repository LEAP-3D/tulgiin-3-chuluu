import { View } from "react-native";
import type {
  CustomerProfile,
  OrderItem,
  TimelineItem,
  WorkerProfile,
} from "./types";
import { OrderDetailHeader } from "./OrderDetailHeader";
import { OrderProfileCard } from "./OrderProfileCard";
import { OrderCustomerInfoCard } from "./OrderCustomerInfoCard";
import { OrderAddressCard } from "./OrderAddressCard";
import { OrderDescriptionCard } from "./OrderDescriptionCard";
import { OrderAttachmentsCard } from "./OrderAttachmentsCard";
import { OrderStatusTimeline } from "./OrderStatusTimeline";
import { OrderPaymentSection } from "./OrderPaymentSection";
import { OrderActionSection } from "./OrderActionSection";
import { OrderMapSection } from "./OrderMapSection";
import { orderDetailStyles } from "../order.detail.styles";
import { getWorkerActions } from "./helpers";
import { EnhancedTimeline } from "@/components/EnhancedTimeline";

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
      : (primary?.label ?? "");

  const secondaryLabel =
    isUpdating && updatingStatus === secondary?.status
      ? "Ачаалж байна..."
      : (secondary?.label ?? "");

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

      <OrderActionSection
        primaryLabel={primaryLabel}
        secondaryLabel={secondaryLabel}
        isUpdating={isUpdating}
        primary={primary}
        secondary={secondary}
        onPrimaryPress={() => handleStatusChange(primary?.status ?? "")}
        onSecondaryPress={() => handleStatusChange(secondary?.status ?? "")}
      />

      {isWorkerView && (
        <OrderCustomerInfoCard
          customer={customer}
          isCustomerLoading={isCustomerLoading}
          customerError={customerError}
        />
      )}

      {isWorkerView && <OrderAddressCard order={selectedOrder} />}

      {isWorkerView && <OrderMapSection order={selectedOrder} />}

      {isWorkerView && <OrderDescriptionCard order={selectedOrder} />}

      {isWorkerView && <OrderAttachmentsCard attachments={attachments} />}

      {selectedOrder && <EnhancedTimeline order={selectedOrder} />}

      <OrderStatusTimeline timeline={timeline} />

      <OrderPaymentSection
        paymentAmount={paymentAmount}
        paymentMethod={paymentMethod}
        paymentStatus={paymentStatus}
        canCreatePayment={canCreatePayment}
        showPaymentCard={showPaymentCard}
        showUserPayButton={showUserPayButton}
        showWorkerCashConfirm={showWorkerCashConfirm}
        onCreatePayment={() => onComplete(selectedOrder?.id ?? "")}
        onPay={() => onPay(selectedOrder?.id ?? "")}
        onConfirmCash={() => onConfirmCash(selectedOrder?.id ?? "")}
      />
    </View>
  );
}

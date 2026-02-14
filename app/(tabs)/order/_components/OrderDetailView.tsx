import { View } from "react-native";
import type { CustomerProfile, OrderItem, TimelineItem, WorkerProfile } from "./types";
import { OrderDetailHeader } from "./OrderDetailHeader";
import { OrderProfileCard } from "./OrderProfileCard";
import { OrderCustomerInfoCard } from "./OrderCustomerInfoCard";
import { OrderAddressCard } from "./OrderAddressCard";
import { OrderDescriptionCard } from "./OrderDescriptionCard";
import { OrderAttachmentsCard } from "./OrderAttachmentsCard";
import { OrderStatusTimeline } from "./OrderStatusTimeline";
import { orderDetailStyles } from "../order.detail.styles";

type Props = {
  selectedOrder: OrderItem | null;
  isWorkerView: boolean;
  worker: WorkerProfile | null;
  isWorkerLoading: boolean;
  workerError: string | null;
  customer: CustomerProfile | null;
  isCustomerLoading: boolean;
  customerError: string | null;
  attachments: string[];
  timeline: TimelineItem[];
  onBack: () => void;
  onChat: () => void;
};

export function OrderDetailView({
  selectedOrder,
  isWorkerView,
  worker,
  isWorkerLoading,
  workerError,
  customer,
  isCustomerLoading,
  customerError,
  attachments,
  timeline,
  onBack,
  onChat,
}: Props) {
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
    </View>
  );
}

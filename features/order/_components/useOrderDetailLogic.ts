import type { OrderItem } from "./types";
import { getWorkerActions } from "./helpers";

type ActionLabels = {
  primaryLabel: string;
  secondaryLabel: string;
};

type PaymentFlags = {
  paymentAmount: number | null | undefined;
  paymentMethod: string | null | undefined;
  paymentStatus: string | null | undefined;
  paymentLink: string | null | undefined;
  canCreatePayment: boolean;
  showPaymentCard: boolean;
  showUserPayButton: boolean;
  showWorkerCashConfirm: boolean;
};

export function useOrderDetailLogic(
  selectedOrder: OrderItem | null,
  isWorkerView: boolean,
  profileRole: "user" | "worker" | null,
  profileId: string | null,
  updatingOrderId: string | null,
  updatingStatus: string | null,
): {
  actionLabels: ActionLabels;
  paymentFlags: PaymentFlags;
} {
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

  return {
    actionLabels: {
      primaryLabel,
      secondaryLabel,
    },
    paymentFlags: {
      paymentAmount,
      paymentMethod,
      paymentStatus,
      paymentLink,
      canCreatePayment,
      showPaymentCard,
      showUserPayButton,
      showWorkerCashConfirm,
    },
  };
}

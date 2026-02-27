import { Pressable, Text, View, StyleSheet } from "react-native";
import { orderDetailStyles } from "../order.detail.styles";
import { styles as orderStyles } from "../order.styles";

interface OrderPaymentSectionProps {
  paymentAmount?: number | null;
  paymentMethod?: string | null;
  paymentStatus?: string | null;
  canCreatePayment: boolean;
  showPaymentCard: boolean;
  showUserPayButton: boolean;
  showWorkerCashConfirm: boolean;
  onCreatePayment: () => void;
  onPay: () => void;
  onConfirmCash: () => void;
}

export function OrderPaymentSection({
  paymentAmount,
  paymentMethod,
  paymentStatus,
  canCreatePayment,
  showPaymentCard,
  showUserPayButton,
  showWorkerCashConfirm,
  onCreatePayment,
  onPay,
  onConfirmCash,
}: OrderPaymentSectionProps) {
  if (!showPaymentCard) return null;

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
        : "Хүлээгдэж байна";

  const paymentAmountLabel = paymentAmount
    ? `${paymentAmount.toLocaleString("en-US")} ₮`
    : "—";

  return (
    <View style={orderDetailStyles.profileCard}>
      <Text style={orderDetailStyles.sectionTitleSmall}>Төлбөр</Text>

      {!canCreatePayment && (
        <View style={orderDetailStyles.profileStats}>
          <View style={orderDetailStyles.statRow}>
            <Text style={orderDetailStyles.statLabel}>Дүн</Text>
            <Text style={orderDetailStyles.statValue}>
              {paymentAmountLabel}
            </Text>
          </View>
          <View style={orderDetailStyles.statRow}>
            <Text style={orderDetailStyles.statLabel}>Төлбөрийн хэлбэр</Text>
            <Text style={orderDetailStyles.statValue}>
              {paymentMethodLabel}
            </Text>
          </View>
          <View style={orderDetailStyles.statRow}>
            <Text style={orderDetailStyles.statLabel}>Төлөв</Text>
            <Text style={orderDetailStyles.statValue}>
              {paymentStatusLabel}
            </Text>
          </View>
        </View>
      )}

      {canCreatePayment && (
        <Text style={orderDetailStyles.workerStatusText}>
          Төлбөрийн мэдээлэл оруулаагүй байна.
        </Text>
      )}

      {canCreatePayment && (
        <Pressable
          style={[orderStyles.actionButton, orderStyles.acceptButton]}
          onPress={onCreatePayment}
          accessible={true}
          accessibilityLabel="Төлбөр үүсгэх"
        >
          <Text style={orderStyles.actionText}>Төлбөр үүсгэх</Text>
        </Pressable>
      )}

      {showUserPayButton && (
        <Pressable
          style={[orderStyles.actionButton, orderStyles.acceptButton]}
          onPress={onPay}
          accessible={true}
          accessibilityLabel="Төлбөр төлөх"
        >
          <Text style={orderStyles.actionText}>Төлбөр төлөх</Text>
        </Pressable>
      )}

      {showWorkerCashConfirm && (
        <Pressable
          style={[orderStyles.actionButton, orderStyles.acceptButton]}
          onPress={onConfirmCash}
          accessible={true}
          accessibilityLabel="Бэлнээр төлснийг батлах"
        >
          <Text style={orderStyles.actionText}>Бэлнээр төлснийг батлах</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({});

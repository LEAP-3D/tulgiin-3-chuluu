import { Image, Pressable, Text, View } from "react-native";
import CallIcon from "@/components/icons/call";
import { SERVICE_LABELS } from "@/constants/services";
import { formatAreas } from "@/lib/utils/formatAreas";
import { orderDetailStyles } from "../order.detail.styles";
import { styles } from "../order.styles";
import type { CustomerProfile, OrderItem, WorkerProfile } from "./types";

type Props = {
  isWorkerView: boolean;
  customer: CustomerProfile | null;
  worker: WorkerProfile | null;
  selectedOrder: OrderItem | null;
  isWorkerLoading: boolean;
  workerError: string | null;
  onChat: () => void;
};

export function OrderProfileCard({
  isWorkerView,
  customer,
  worker,
  selectedOrder,
  isWorkerLoading,
  workerError,
  onChat,
}: Props) {
  const profileName = isWorkerView
    ? customer?.name ?? "Хэрэглэгч"
    : worker?.name ?? "Засварчин";
  const serviceLabel = selectedOrder?.service_label
    ? `${selectedOrder.service_label} мэргэжилтэн`
    : selectedOrder?.service_key
      ? `${SERVICE_LABELS[selectedOrder.service_key] ?? selectedOrder.service_key} мэргэжилтэн`
      : "Мэргэжилтэн";

  return (
    <View style={orderDetailStyles.profileCard}>
      <View style={orderDetailStyles.profileTop}>
        <View style={orderDetailStyles.avatar}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
            }}
            style={orderDetailStyles.avatarImage}
          />
        </View>
        <View style={orderDetailStyles.profileInfo}>
          <Text style={orderDetailStyles.profileName}>{profileName}</Text>
          <Text style={orderDetailStyles.profileRole}>
            {isWorkerView ? "Захиалагч" : serviceLabel}
          </Text>
        </View>
        {!isWorkerView ? (
          <View style={orderDetailStyles.ratingWrap}>
            <Text style={orderDetailStyles.star}>★</Text>
            <Text style={orderDetailStyles.ratingText}>
              {typeof worker?.rating === "number" ? worker.rating.toFixed(1) : "—"}
            </Text>
          </View>
        ) : null}
      </View>

      {!isWorkerView ? (
        <View style={orderDetailStyles.profileStats}>
          <View style={orderDetailStyles.statRow}>
            <Text style={orderDetailStyles.statLabel}>Захиалга</Text>
            <Text style={orderDetailStyles.statValue}>
              {typeof worker?.orders === "number" ? worker.orders : "—"}
            </Text>
          </View>
          <View style={orderDetailStyles.statRow}>
            <Text style={orderDetailStyles.statLabel}>Ажилласан жил</Text>
            <Text style={orderDetailStyles.statValue}>
              {typeof worker?.years === "number" ? `${worker.years} жил` : "—"}
            </Text>
          </View>
          <View style={orderDetailStyles.statRow}>
            <Text style={orderDetailStyles.statLabel}>Үйлчлэх бүс</Text>
            <Text
              style={[orderDetailStyles.statValue, orderDetailStyles.statValueArea]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {worker ? formatAreas(worker.areas, 4) : "—"}
            </Text>
          </View>
        </View>
      ) : null}

      {isWorkerLoading ? (
        <Text style={orderDetailStyles.workerStatusText}>Ачаалж байна...</Text>
      ) : workerError ? (
        <Text style={orderDetailStyles.workerStatusText}>{workerError}</Text>
      ) : null}

      <View style={orderDetailStyles.profileActions}>
        <Pressable
          style={({ pressed }) => [
            orderDetailStyles.messageButton,
            pressed && styles.cardPressed,
          ]}
          onPress={onChat}
        >
          <Text style={orderDetailStyles.messageText}>Зурвас</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            orderDetailStyles.callButton,
            pressed && orderDetailStyles.callPressed,
          ]}
        >
          <CallIcon width={22} height={22} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

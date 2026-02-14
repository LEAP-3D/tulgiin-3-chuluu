import { Text, View } from "react-native";
import { orderDetailStyles } from "../../order.detail.styles";
import type { CustomerProfile } from "./types";

type Props = {
  customer: CustomerProfile | null;
  isCustomerLoading: boolean;
  customerError: string | null;
};

export function OrderCustomerInfoCard({
  customer,
  isCustomerLoading,
  customerError,
}: Props) {
  return (
    <View style={orderDetailStyles.profileCard}>
      <Text style={orderDetailStyles.sectionTitleSmall}>Хэрэглэгчийн мэдээлэл</Text>
      {isCustomerLoading ? (
        <Text style={orderDetailStyles.workerStatusText}>Ачаалж байна...</Text>
      ) : customerError ? (
        <Text style={orderDetailStyles.workerStatusText}>{customerError}</Text>
      ) : (
        <>
          <View style={orderDetailStyles.statRow}>
            <Text style={orderDetailStyles.statLabel}>Нэр</Text>
            <Text style={orderDetailStyles.statValue}>{customer?.name ?? "—"}</Text>
          </View>
          <View style={orderDetailStyles.statRow}>
            <Text style={orderDetailStyles.statLabel}>Утас</Text>
            <Text style={orderDetailStyles.statValue}>{customer?.phone ?? "—"}</Text>
          </View>
          <View style={orderDetailStyles.statRow}>
            <Text style={orderDetailStyles.statLabel}>И-мэйл</Text>
            <Text style={orderDetailStyles.statValue}>{customer?.email ?? "—"}</Text>
          </View>
        </>
      )}
    </View>
  );
}

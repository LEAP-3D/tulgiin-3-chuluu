import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, Text, View } from "react-native";
import { formatAreas } from "@/lib/utils/formatAreas";
import type { SelectedWorker } from "./types";
import { workerStyles } from "./styles/worker";
import { baseStyles } from "./styles/base";

type Props = {
  worker: SelectedWorker;
  serviceLabel: string;
};

export function WorkerCard({ worker, serviceLabel }: Props) {
  return (
    <>
      <Text style={baseStyles.label}>Засварчин</Text>
      <View style={workerStyles.workerCard}>
        <View style={workerStyles.workerTopRow}>
          <View style={workerStyles.workerAvatar}>
            <Image
              source={{
                uri:
                  worker.avatarUrl ??
                  "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
              }}
              style={workerStyles.workerAvatarImage}
            />
          </View>
          <View style={workerStyles.workerTitleBlock}>
            <Text style={workerStyles.workerName}>{worker.name}</Text>
            <Text style={workerStyles.workerSubtitle}>
              {serviceLabel} мэргэжилтэн
            </Text>
          </View>
          <View style={workerStyles.workerRating}>
            <MaterialCommunityIcons name="star" size={16} color="#F59E0B" />
            <Text style={workerStyles.workerRatingText}>
              {typeof worker.rating === "number"
                ? worker.rating.toFixed(1)
                : "—"}
            </Text>
          </View>
        </View>

        <View style={workerStyles.workerInfoRow}>
          <Text style={workerStyles.workerInfoLabel}>Захиалга</Text>
          <Text style={workerStyles.workerInfoValue}>
            {typeof worker.orders === "number" ? worker.orders : "—"}
          </Text>
        </View>
        <View style={workerStyles.workerInfoRow}>
          <Text style={workerStyles.workerInfoLabel}>Ажилласан жил</Text>
          <Text style={workerStyles.workerInfoValue}>
            {typeof worker.years === "number" ? `${worker.years} жил` : "—"}
          </Text>
        </View>
        <View style={workerStyles.workerInfoRow}>
          <Text style={workerStyles.workerInfoLabel}>Үйлчлэх бүс</Text>
          <Text style={workerStyles.workerInfoValue}>
            {formatAreas(worker.areas, 4)}
          </Text>
        </View>
      </View>
    </>
  );
}

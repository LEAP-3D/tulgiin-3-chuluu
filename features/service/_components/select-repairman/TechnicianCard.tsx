import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { RemoteAvatar } from "@/components/RemoteAvatar";
import { formatAreas } from "@/lib/utils/formatAreas";
import { styles } from "../../select-repairman.styles";
import type { Technician } from "./types";

type Props = {
  tech: Technician;
  typeLabel: string;
  onOpenProfile: (id: string) => void;
  onSelectWorker: (tech: Technician) => void;
};

export function TechnicianCard({
  tech,
  typeLabel,
  onOpenProfile,
  onSelectWorker,
}: Props) {
  return (
    <Pressable
      style={styles.card}
      onPress={() => onOpenProfile(tech.id)}
    >
      <View style={styles.cardTopRow}>
        <View style={styles.avatar}>
          <RemoteAvatar uri={tech.avatarUrl} imageStyle={styles.avatarImage} />
        </View>
        <View style={styles.cardTitleBlock}>
          <Text style={styles.name}>{tech.name}</Text>
          <Text style={styles.subtitle}>{typeLabel} мэргэжилтэн</Text>
        </View>
        <View style={styles.rating}>
          <MaterialCommunityIcons name="star" size={18} color="#F59E0B" />
          <Text style={styles.ratingText}>
            {typeof tech.rating === "number" ? tech.rating.toFixed(1) : "—"}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Захиалга</Text>
        <Text style={styles.infoValue}>
          {typeof tech.orders === "number" ? tech.orders : "—"}
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Ажилласан жил</Text>
        <Text style={styles.infoValue}>
          {typeof tech.years === "number" ? `${tech.years} жил` : "—"}
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Үйлчлэх бүс</Text>
        <Text
          style={[styles.infoValue, styles.infoValueArea]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {formatAreas(tech.areas, 4)}
        </Text>
      </View>

      <Pressable
        style={styles.selectButton}
        onPress={() => onSelectWorker(tech)}
      >
        <Text style={styles.selectText}>Сонгох</Text>
      </Pressable>
    </Pressable>
  );
}

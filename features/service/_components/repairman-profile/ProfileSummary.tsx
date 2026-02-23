import { Image, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { formatAreas } from "@/lib/utils/formatAreas";
import type { Technician } from "./types";
import { styles } from "../../repairman-profile.styles";

type Props = {
  technician: Technician;
  subtitle: string;
};

export function ProfileSummary({ technician, subtitle }: Props) {
  return (
    <>
      <View style={styles.profileRow}>
        <View style={styles.avatar}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/4140/4140048.png",
            }}
            style={styles.avatarImage}
          />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{technician.name}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={styles.rating}>
          <MaterialCommunityIcons name="star" size={18} color="#F59E0B" />
          <Text style={styles.ratingText}>
            {typeof technician.rating === "number"
              ? technician.rating.toFixed(1)
              : "—"}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Захиалга</Text>
        <Text style={styles.infoValue}>
          {typeof technician.orders === "number" ? technician.orders : "—"}
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Ажилласан жил</Text>
        <Text style={styles.infoValue}>
          {typeof technician.years === "number"
            ? `${technician.years} жил`
            : "—"}
        </Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Үйлчлэх бүс</Text>
        <Text style={styles.infoValue}>{formatAreas(technician.areas)}</Text>
      </View>
    </>
  );
}

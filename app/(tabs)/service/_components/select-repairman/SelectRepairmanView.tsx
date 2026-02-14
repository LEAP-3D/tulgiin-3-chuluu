import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { styles } from "../../select-repairman.styles";
import type { SelectRepairmanController } from "./useSelectRepairmanController";
import { TechnicianCard } from "./TechnicianCard";

type Props = {
  controller: SelectRepairmanController;
};

export function SelectRepairmanView({ controller }: Props) {
  const {
    insetsBottom,
    typeLabel,
    district,
    technicians,
    isLoading,
    errorMessage,
    onBack,
    onOpenProfile,
    onSelectWorker,
  } = controller;

  return (
    <View style={styles.container}>
      <View style={styles.divider} />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 40 + insetsBottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Pressable onPress={onBack} hitSlop={10} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={22} color="#111111" />
          </Pressable>
          <Text style={styles.headerTitle}>Засварчин сонгох</Text>
        </View>

        {isLoading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="small" color="#1F1F1F" />
          </View>
        ) : errorMessage ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Алдаа гарлаа.</Text>
            <Text style={styles.emptyText}>{errorMessage}</Text>
          </View>
        ) : technicians.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Одоогоор тохирох засварчин алга.</Text>
            <Text style={styles.emptyText}>
              {district ? `${district} дүүрэг` : "Сонгосон бүс"} ба {typeLabel}
              төрлөөр хайлт хийсэн үр дүн хоосон байна.
            </Text>
          </View>
        ) : (
          technicians.map((tech) => (
            <TechnicianCard
              key={tech.id}
              tech={tech}
              typeLabel={typeLabel}
              onOpenProfile={onOpenProfile}
              onSelectWorker={onSelectWorker}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

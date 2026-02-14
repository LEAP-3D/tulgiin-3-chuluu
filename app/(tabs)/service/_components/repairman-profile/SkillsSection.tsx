import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { SERVICE_ICON_NAMES, SERVICE_LABELS } from "@/constants/services";
import { styles } from "../../repairman-profile.styles";

type Props = {
  skills: string[];
};

export function SkillsSection({ skills }: Props) {
  return (
    <>
      <Text style={styles.sectionTitle}>Мэргэжил</Text>
      <View style={styles.chipRow}>
        {skills.length === 0 ? (
          <Text style={styles.emptySkill}>—</Text>
        ) : (
          skills.map((skill) => (
            <View key={skill} style={styles.chip}>
              <View style={styles.chipIconWrap}>
                <MaterialCommunityIcons
                  name={SERVICE_ICON_NAMES[skill] ?? "briefcase-outline"}
                  size={14}
                  color="#F59E0B"
                />
              </View>
              <Text style={styles.chipText}>
                {SERVICE_LABELS[skill] ?? skill}
              </Text>
            </View>
          ))
        )}
      </View>
    </>
  );
}

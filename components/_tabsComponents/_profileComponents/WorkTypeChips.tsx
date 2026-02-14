import { Text, View } from "react-native";
import { styles } from "./index.styles";
import { WORK_TYPE_ICON_MAP, WORK_TYPE_LABEL_MAP } from "./constants";

type Props = {
  workTypes: string[];
};

export function WorkTypeChips({ workTypes }: Props) {
  if (!workTypes || workTypes.length === 0) return null;

  return (
    <View style={styles.chipSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Мэргэжил</Text>
        <Text style={styles.sectionAction}>Засах</Text>
      </View>
      <View style={styles.chipWrap}>
        {workTypes.map((item) => {
          const Icon = WORK_TYPE_ICON_MAP[item];
          const label = WORK_TYPE_LABEL_MAP[item] ?? item;
          return (
            <View key={`work-${item}`} style={styles.chip}>
              {Icon ? <Icon width={18} height={18} /> : null}
              <Text style={styles.chipText}>{label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

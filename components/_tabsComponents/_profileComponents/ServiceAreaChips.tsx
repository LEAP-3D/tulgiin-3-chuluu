import { Text, View } from "react-native";
import { styles } from "./index.styles";
import { formatDistrictShort } from "./constants";

type Props = {
  serviceAreas: string[];
};

export function ServiceAreaChips({ serviceAreas }: Props) {
  if (!serviceAreas || serviceAreas.length === 0) return null;

  return (
    <View style={styles.chipSection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Үйлчилгээний бүс</Text>
        <Text style={styles.sectionAction}>Засах</Text>
      </View>
      <View style={styles.chipWrap}>
        {serviceAreas.map((item) => (
          <View key={`area-${item}`} style={styles.chip}>
            <Text style={styles.chipText}>{formatDistrictShort(item)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

import { ScrollView, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OrderScreen() {
  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Text>Order</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

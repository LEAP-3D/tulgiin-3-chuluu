import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import LeftArrowIcon from "@/components/icons/_serviceIcons/leftarrowIcon";
import SearchIcon from "@/components/icons/_serviceIcons/searchIcon";
import type { ServiceAllController } from "./useServiceAllController";
import { styles } from "./service-all.styles";

export function ServiceAllView({ controller }: { controller: ServiceAllController }) {
  const {
    insetsBottom,
    query,
    setQuery,
    services,
    onBack,
    onSelectService,
  } = controller;

  return (
    <View style={styles.container}>
      <View style={styles.divider} />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 120 + insetsBottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchRow}>
          <Pressable onPress={onBack} hitSlop={10} style={styles.backButton}>
            <LeftArrowIcon width={22} height={22} />
          </Pressable>
          <View style={styles.searchInputWrap}>
            <SearchIcon width={20} height={20} />
            <TextInput
              placeholder="Хайх"
              placeholderTextColor="#9B9B9B"
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
            />
          </View>
        </View>

        <View style={styles.grid}>
          {services.map((item) => (
            <Pressable
              key={item.key}
              style={styles.gridItem}
              onPress={() => onSelectService(item.label)}
            >
              <View style={styles.iconWrap}>
                <item.Icon width={26} height={26} />
              </View>
              <Text style={styles.iconLabel}>{item.label}</Text>
            </Pressable>
          ))}
        </View>

        {services.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Олдсон үйлчилгээ байхгүй байна</Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

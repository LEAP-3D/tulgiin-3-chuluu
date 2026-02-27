import React from "react";
import { StyleSheet, Text, View, Pressable, Image } from "react-native";

interface OrderMapProps {
  lat?: number | null;
  lng?: number | null;
  address?: string | null;
  onPress?: () => void;
}

export function OrderMap({ lat, lng, address, onPress }: OrderMapProps) {
  if (!lat || !lng) {
    return (
      <View style={styles.container}>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>📍</Text>
          <Text style={styles.placeholderTitle}>Байршил мэдээлэл байхгүй</Text>
          <Text style={styles.placeholderDesc}>
            Захиалгын байршлыг харьцах боломжгүй
          </Text>
        </View>
      </View>
    );
  }

  const mapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=300x200&markers=color:red%7C${lat},${lng}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || ""}`;

  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      accessible={true}
      accessibilityLabel="Байршил газрын зургаар харах"
      accessibilityRole="button"
    >
      <Image
        source={{ uri: mapImageUrl }}
        style={styles.mapImage}
        onError={() => (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Газрын зураг ачаалах алдаа</Text>
          </View>
        )}
      />
      {address && <Text style={styles.addressText}>{address}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#F8F8F8",
  },
  mapImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#E5E5E5",
  },
  placeholder: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  placeholderText: {
    fontSize: 48,
  },
  placeholderTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F1F1F",
  },
  placeholderDesc: {
    fontSize: 12,
    color: "#8E8E8E",
    textAlign: "center",
  },
  addressText: {
    padding: 12,
    fontSize: 13,
    color: "#5F5F5F",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#8E8E8E",
    fontSize: 12,
  },
});

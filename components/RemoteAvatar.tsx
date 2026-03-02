import { useEffect, useState, type ComponentProps } from "react";
import { Image as ExpoImage } from "expo-image";
import { ActivityIndicator, type ImageStyle, type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  uri?: string | null;
  containerStyle?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  iconName?: ComponentProps<typeof Ionicons>["name"];
  iconSize?: number;
  iconColor?: string;
};

const loadedUriCache = new Set<string>();

const normalizeAvatarUri = (value?: string | null) => {
  const trimmed = typeof value === "string" ? value.trim() : "";
  if (!trimmed) return "";
  if (trimmed.startsWith("http://")) {
    return `https://${trimmed.slice("http://".length)}`;
  }
  return trimmed;
};

export function RemoteAvatar({
  uri,
  containerStyle,
  imageStyle,
  iconName = "person",
  iconSize = 18,
  iconColor = "#8B8B8B",
}: Props) {
  const normalizedUri = normalizeAvatarUri(uri);
  const [isLoading, setIsLoading] = useState(
    !!normalizedUri && !loadedUriCache.has(normalizedUri),
  );
  const [showSpinner, setShowSpinner] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
    const isCached = !!normalizedUri && loadedUriCache.has(normalizedUri);
    setIsLoading(!!normalizedUri && !isCached);
    setShowSpinner(false);

    if (isCached || !normalizedUri) return;

    const timer = setTimeout(() => setShowSpinner(true), 140);
    return () => clearTimeout(timer);
  }, [normalizedUri]);

  const showImage = !!normalizedUri && !hasError;

  return (
    <View style={[styles.container, containerStyle]}>
      {showImage ? (
        <ExpoImage
          source={{ uri: normalizedUri }}
          style={[styles.image, imageStyle]}
          cachePolicy="memory-disk"
          contentFit="cover"
          transition={120}
          onLoadStart={() => setIsLoading(true)}
          onLoad={() => {
            loadedUriCache.add(normalizedUri);
            setIsLoading(false);
            setShowSpinner(false);
          }}
          onLoadEnd={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
            setShowSpinner(false);
          }}
        />
      ) : (
        <Ionicons name={iconName} size={iconSize} color={iconColor} />
      )}

      {showImage && isLoading && showSpinner ? (
        <View style={styles.overlay}>
          <ActivityIndicator size="small" color="#6B7280" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EDEDED",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.35)",
  },
});

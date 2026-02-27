import { useCallback, useRef } from "react";
import { Image } from "react-native";

const imageCache = new Map<string, string>();

export function useImageCache() {
  const cacheRef = useRef(imageCache);

  const getCachedUri = useCallback((uri: string) => {
    return cacheRef.current.get(uri) || uri;
  }, []);

  const cacheImage = useCallback(async (uri: string) => {
    if (cacheRef.current.has(uri)) {
      return cacheRef.current.get(uri)!;
    }

    try {
      Image.prefetch(uri);
      cacheRef.current.set(uri, uri);
      return uri;
    } catch {
      return uri;
    }
  }, []);

  const preloadImages = useCallback(
    async (uris: string[]) => {
      await Promise.allSettled(uris.map((uri) => cacheImage(uri)));
    },
    [cacheImage],
  );

  return {
    getCachedUri,
    cacheImage,
    preloadImages,
  };
}

export function clearImageCache() {
  imageCache.clear();
}

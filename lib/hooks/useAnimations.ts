import { useRef, useEffect } from "react";
import { Animated } from "react-native";

export function useScaleAnimation(initialValue = 1) {
  const scaleValue = useRef(new Animated.Value(initialValue)).current;

  const pulse = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.05,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: initialValue,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return { scaleValue, pulse };
}

export function useFadeAnimation(initialValue = 0) {
  const fadeValue = useRef(new Animated.Value(initialValue)).current;

  const fadeIn = (duration = 300) => {
    Animated.timing(fadeValue, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = (duration = 300) => {
    Animated.timing(fadeValue, {
      toValue: 0,
      duration,
      useNativeDriver: true,
    }).start();
  };

  return { fadeValue, fadeIn, fadeOut };
}

export function useSlideAnimation(initialValue = 0) {
  const slideValue = useRef(new Animated.Value(initialValue)).current;

  const slideIn = (toValue = 0, duration = 300) => {
    Animated.timing(slideValue, {
      toValue,
      duration,
      useNativeDriver: true,
    }).start();
  };

  return { slideValue, slideIn };
}

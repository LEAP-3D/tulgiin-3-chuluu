import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

const AnimatedView = Animated.createAnimatedComponent(View);

const useShimmerAnimation = () => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(animValue, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [animValue]);

  return animValue;
};

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  marginBottom?: number;
  style?: any;
}

export function Skeleton({
  width = "100%",
  height = 20,
  borderRadius = 8,
  marginBottom = 12,
  style,
}: SkeletonProps) {
  const animValue = useShimmerAnimation();

  return (
    <AnimatedView
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          marginBottom,
          opacity: animValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.3, 0.7],
          }),
        },
        style,
      ]}
    />
  );
}

export function OrderCardSkeleton() {
  return (
    <View style={styles.orderCard}>
      <View style={styles.orderCardHeader}>
        <View style={styles.orderCardLeft}>
          <Skeleton width={60} height={16} marginBottom={8} />
          <Skeleton width={100} height={20} marginBottom={4} />
          <Skeleton width={80} height={14} marginBottom={0} />
        </View>
        <Skeleton width={20} height={20} borderRadius={4} marginBottom={0} />
      </View>
    </View>
  );
}

export function OrderListSkeleton() {
  return (
    <View style={{ gap: 12 }}>
      {[1, 2, 3].map((i) => (
        <OrderCardSkeleton key={i} />
      ))}
    </View>
  );
}

export function OrderDetailSkeleton() {
  return (
    <View style={styles.detailContent}>
      <Skeleton width={200} height={28} marginBottom={24} />

      {/* Header Section */}
      <View style={styles.detailSection}>
        <Skeleton width={150} height={18} marginBottom={12} />
        <Skeleton width="100%" height={16} marginBottom={8} />
        <Skeleton width="80%" height={16} marginBottom={0} />
      </View>

      {/* Info Cards */}
      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.detailSection}>
          <Skeleton width={120} height={16} marginBottom={12} />
          <Skeleton
            width="100%"
            height={60}
            marginBottom={0}
            borderRadius={10}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#E5E5E5",
  },
  orderCard: {
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  orderCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  orderCardLeft: {
    flex: 1,
    gap: 4,
  },
  detailContent: {
    gap: 20,
  },
  detailSection: {
    gap: 12,
  },
});

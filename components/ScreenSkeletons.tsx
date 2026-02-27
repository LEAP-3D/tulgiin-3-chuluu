import { View, StyleSheet } from "react-native";
import { Skeleton } from "./Skeleton";

export function ProfileSkeleton() {
  return (
    <View style={styles.profileContent}>
      {/* Avatar */}
      <Skeleton width={80} height={80} borderRadius={40} marginBottom={16} />
      {/* Name */}
      <Skeleton width={150} height={20} marginBottom={8} />
      {/* Email/Phone */}
      <Skeleton width={120} height={14} marginBottom={24} />
      {/* Stats Row */}
      <View style={styles.statsRow}>
        <Skeleton width="30%" height={60} borderRadius={10} marginBottom={0} />
        <Skeleton width="30%" height={60} borderRadius={10} marginBottom={0} />
        <Skeleton width="30%" height={60} borderRadius={10} marginBottom={0} />
      </View>
      {/* Description Section */}
      <Skeleton width="100%" height={16} marginBottom={12} />
      <Skeleton width="100%" height={16} marginBottom={0} />
    </View>
  );
}

export function ProfileEditSkeleton() {
  return (
    <View style={styles.detailContent}>
      <Skeleton width={80} height={80} borderRadius={40} marginBottom={24} />
      {[1, 2, 3, 4, 5].map((i) => (
        <View key={i} style={styles.formField}>
          <Skeleton width={100} height={14} marginBottom={8} />
          <Skeleton
            width="100%"
            height={40}
            marginBottom={0}
            borderRadius={8}
          />
        </View>
      ))}
    </View>
  );
}

export function ServiceListSkeleton() {
  return (
    <View style={{ gap: 12 }}>
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={styles.serviceCard}>
          <Skeleton width={50} height={50} borderRadius={8} marginBottom={0} />
          <View style={{ flex: 1, marginLeft: 12, gap: 6 }}>
            <Skeleton width="80%" height={16} marginBottom={0} />
            <Skeleton width="60%" height={14} marginBottom={0} />
          </View>
        </View>
      ))}
    </View>
  );
}

export function MessageSkeleton() {
  return (
    <View style={styles.messageBubble}>
      <Skeleton width="70%" height={16} marginBottom={8} />
      <Skeleton width="50%" height={14} marginBottom={0} />
    </View>
  );
}

export function MessageListSkeleton() {
  return (
    <View style={{ gap: 16, paddingHorizontal: 16, paddingVertical: 16 }}>
      {[1, 2, 3].map((i) => (
        <View key={i} style={styles.messageBubble}>
          <Skeleton width="80%" height={16} marginBottom={8} />
          <Skeleton width="60%" height={12} marginBottom={0} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  profileContent: {
    alignItems: "center",
    gap: 12,
  },
  detailContent: {
    gap: 20,
  },
  formField: {
    gap: 8,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginBottom: 16,
  },
  serviceCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
  },
  messageBubble: {
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
});

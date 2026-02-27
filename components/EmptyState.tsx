import { StyleSheet, Text, View } from "react-native";

const EMPTY_STATES = {
  orders: {
    icon: "📋",
    title: "Захиалга байхгүй",
    description: "Одоогоор захиалга байхгүй байна. Шинээр захиалга үүсгээрэй.",
  },
  workers: {
    icon: "👷",
    title: "Мэргэжилтнүүд байхгүй",
    description: "Тодорхой хүн олдсонгүй байна.",
  },
  messages: {
    icon: "💬",
    title: "Мэдэгдэл байхгүй",
    description: "Одоогоор ямар ч мэдэгдэл байхгүй.",
  },
  error: {
    icon: "⚠️",
    title: "Алдаа гарлаа",
    description: "Өгөгдөл ачаалахад алдаа гарлаа. Дахин оролддо.",
  },
  networkError: {
    icon: "🌐",
    title: "Интернэт холболт байхгүй",
    description: "Сүлжээний холболтыг шалгаж дахин оролддо.",
  },
};

interface EmptyStateProps {
  type: keyof typeof EMPTY_STATES;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export function EmptyState({ type, action }: EmptyStateProps) {
  const state = EMPTY_STATES[type];

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{state.icon}</Text>
      <Text style={styles.title}>{state.title}</Text>
      <Text style={styles.description}>{state.description}</Text>
      {action && (
        <View style={styles.actionContainer}>
          <Text style={styles.actionButton}>{action.label}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    paddingHorizontal: 20,
    gap: 16,
  },
  icon: {
    fontSize: 56,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F1F1F",
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#8E8E8E",
    textAlign: "center",
    lineHeight: 20,
  },
  actionContainer: {
    marginTop: 8,
  },
  actionButton: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F59E0B",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});

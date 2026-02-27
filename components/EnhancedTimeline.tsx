import { StyleSheet, Text, View } from "react-native";
import { buildTimeline } from "@/lib/utils/timestamps";
import { getStatusColor } from "@/lib/status-colors";
import { formatDateTime } from "@/lib/utils/timestamps";

interface TimelineProps {
  order: {
    status?: string;
    created_at?: string;
    accepted_at?: string | null;
    rejected_at?: string | null;
    cancelled_at?: string | null;
    en_route_at?: string | null;
    in_progress_at?: string | null;
    completed_at?: string | null;
  };
}

export function EnhancedTimeline({ order }: TimelineProps) {
  const events = buildTimeline(order);

  if (events.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Захиалгын түүх</Text>
      <View style={styles.timeline}>
        {events.map((event, index) => {
          const colors = getStatusColor(event.status);
          const isLast = index === events.length - 1;

          return (
            <View key={`${event.status}-${index}`} style={styles.eventWrapper}>
              {/* Timeline Line */}
              {!isLast && (
                <View
                  style={[
                    styles.timelineLine,
                    { borderLeftColor: colors.border },
                  ]}
                />
              )}

              {/* Event Dot */}
              <View
                style={[
                  styles.eventDot,
                  {
                    backgroundColor: colors.border,
                  },
                ]}
              >
                <Text style={styles.eventDotIcon}>{colors.icon}</Text>
              </View>

              {/* Event Content */}
              <View
                style={[
                  styles.eventContent,
                  {
                    backgroundColor: colors.bg,
                    borderLeftColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.eventLabel, { color: colors.text }]}>
                  {event.label}
                </Text>
                {event.timestamp && (
                  <Text
                    style={[styles.eventTime, { color: colors.text }]}
                    accessibilityLabel={`${event.label} at ${formatDateTime(event.timestamp)}`}
                  >
                    {formatDateTime(event.timestamp)}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F1F1F",
  },
  timeline: {
    gap: 8,
  },
  eventWrapper: {
    flexDirection: "row",
    gap: 12,
  },
  timelineLine: {
    position: "absolute",
    left: 15,
    top: 40,
    width: 2,
    bottom: -16,
    borderLeftWidth: 2,
  },
  eventDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  eventDotIcon: {
    fontSize: 16,
  },
  eventContent: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderLeftWidth: 3,
    marginTop: 2,
  },
  eventLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 12,
    opacity: 0.7,
  },
});

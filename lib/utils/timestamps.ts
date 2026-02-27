/**
 * Timestamp formatting utilities for displaying dates and times
 */

export function formatTime(date: Date | string | null | undefined): string {
  if (!date) return "-";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";

  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "-";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "-";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";

  const dateStr = formatDate(d);
  const timeStr = formatTime(d);

  return `${dateStr} ${timeStr}`;
}

export function formatRelativeTime(
  date: Date | string | null | undefined,
): string {
  if (!date) return "-";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "-";

  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return "Сайхан";
  if (diffMinutes < 60) return `${diffMinutes} мин өмнө`;
  if (diffHours < 24) return `${diffHours} цаг өмнө`;
  if (diffDays < 7) return `${diffDays} өдөр өмнө`;

  return formatDate(d);
}

export interface TimelineEvent {
  status: string;
  timestamp: string | null;
  label: string;
  icon: string;
}

export function buildTimeline(order: {
  status?: string;
  created_at?: string;
  accepted_at?: string | null;
  rejected_at?: string | null;
  cancelled_at?: string | null;
  en_route_at?: string | null;
  in_progress_at?: string | null;
  completed_at?: string | null;
}): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  // pending
  if (order.created_at) {
    events.push({
      status: "pending",
      timestamp: order.created_at,
      label: "Захиалга үүсгэгдсэн",
      icon: "📋",
    });
  }

  // accepted
  if (order.accepted_at) {
    events.push({
      status: "accepted",
      timestamp: order.accepted_at,
      label: "Хүлээн авлаа",
      icon: "✓",
    });
  }

  // rejected
  if (order.rejected_at) {
    events.push({
      status: "rejected",
      timestamp: order.rejected_at,
      label: "Татгалзлаа",
      icon: "✕",
    });
  }

  // cancelled
  if (order.cancelled_at) {
    events.push({
      status: "cancelled",
      timestamp: order.cancelled_at,
      label: "Цуцаллаа",
      icon: "⊗",
    });
  }

  // en_route
  if (order.en_route_at) {
    events.push({
      status: "en_route",
      timestamp: order.en_route_at,
      label: "Явж байна",
      icon: "🚗",
    });
  }

  // in_progress
  if (order.in_progress_at) {
    events.push({
      status: "in_progress",
      timestamp: order.in_progress_at,
      label: "Ажил эхэлсэн",
      icon: "⚙️",
    });
  }

  // completed
  if (order.completed_at) {
    events.push({
      status: "completed",
      timestamp: order.completed_at,
      label: "Дууссан",
      icon: "✓",
    });
  }

  // Sort by timestamp
  return events.sort((a, b) => {
    const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
    const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
    return timeA - timeB;
  });
}

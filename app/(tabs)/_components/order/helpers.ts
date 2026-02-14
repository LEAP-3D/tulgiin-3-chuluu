import { formatTime } from "@/lib/utils/time";
import type { OrderItem, TimelineItem } from "./types";
import { STATUS_LABELS } from "./constants";

export const mapOrder = (item: any): OrderItem => ({
  id: String(item.id ?? ""),
  service_key: item.service_key ?? null,
  service_label: item.service_label ?? null,
  status: item.status ?? null,
  created_at: item.created_at ?? null,
  accepted_at: item.accepted_at ?? null,
  rejected_at: item.rejected_at ?? null,
  cancelled_at: item.cancelled_at ?? null,
  en_route_at: item.en_route_at ?? null,
  in_progress_at: item.in_progress_at ?? null,
  completed_at: item.completed_at ?? null,
  worker_profile_id: item.worker_profile_id ?? null,
  user_profile_id: item.user_profile_id ?? null,
  district: item.district ?? null,
  khoroo: item.khoroo ?? null,
  address: item.address ?? null,
  description: item.description ?? null,
  scheduled_date: item.scheduled_date ?? null,
  urgency: item.urgency ?? null,
  attachment_urls: item.attachment_urls ?? null,
});

export const buildTimeline = (order: OrderItem | null): TimelineItem[] => {
  const status = order?.status ?? "pending";
  const statusOrder = [
    "pending",
    "accepted",
    "en_route",
    "in_progress",
    "completed",
  ];
  const currentIndex = statusOrder.indexOf(status);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;
  return [
    {
      title: "Захиалга илгээгдсэн",
      time: formatTime(order?.created_at),
      active: activeIndex >= 0,
    },
    {
      title: "Засварчин хүлээн авсан",
      time: formatTime(order?.accepted_at),
      active: activeIndex >= 1,
    },
    {
      title: "Засварчин явж байна",
      time: formatTime(order?.en_route_at),
      active: activeIndex >= 2,
    },
    {
      title: "Ажил эхэлсэн",
      time: formatTime(order?.in_progress_at),
      active: activeIndex >= 3,
    },
    {
      title: "Ажил дууссан",
      time: formatTime(order?.completed_at),
      active: activeIndex >= 4,
    },
  ];
};

export const getStatusText = (status?: string | null) =>
  (status && STATUS_LABELS[status]) ?? STATUS_LABELS.pending;

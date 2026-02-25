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
  const isCancelled = order?.status === "cancelled";
  const isRejected = order?.status === "rejected";
  const hasTime = (value?: string | null) => {
    if (!value) return false;
    const date = new Date(value);
    return !Number.isNaN(date.getTime());
  };
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
  const isActive = (index: number, value?: string | null) =>
    hasTime(value) || index <= activeIndex;

  const baseItems: TimelineItem[] = [
    {
      title: "Захиалга илгээгдсэн",
      time: formatTime(order?.created_at),
      active: isActive(0, order?.created_at),
    },
    {
      title: "Засварчин хүлээн авсан",
      time: formatTime(order?.accepted_at),
      active: isActive(1, order?.accepted_at),
    },
    {
      title: "Засварчин явж байна",
      time: formatTime(order?.en_route_at),
      active: isActive(2, order?.en_route_at),
    },
    {
      title: "Ажил эхэлсэн",
      time: formatTime(order?.in_progress_at),
      active: isActive(3, order?.in_progress_at),
    },
    {
      title: "Ажил дууссан",
      time: formatTime(order?.completed_at),
      active: isActive(4, order?.completed_at),
    },
  ];

  if (isCancelled) {
    baseItems.push({
      title: "Цуцлагдсан",
      time: formatTime(order?.cancelled_at),
      active: true,
      tone: "danger",
    });
  }

  if (isRejected) {
    baseItems.push({
      title: "Татгалзсан",
      time: formatTime(order?.rejected_at),
      active: true,
      tone: "danger",
    });
  }

  return baseItems;
};

export const getStatusText = (status?: string | null) =>
  (status && STATUS_LABELS[status]) ?? STATUS_LABELS.pending;

export type WorkerActionConfig = {
  label: string;
  status:
    | "accepted"
    | "rejected"
    | "cancelled"
    | "en_route"
    | "in_progress"
    | "completed";
  confirm?: {
    title: string;
    message: string;
  };
};

export type WorkerActions = {
  primary?: WorkerActionConfig;
  secondary?: WorkerActionConfig;
};

export const getWorkerActions = (
  order: OrderItem | null,
  profileRole: "user" | "worker" | null,
  profileId: string | null,
): WorkerActions | null => {
  if (!order) return null;
  const isWorkerOwner =
    profileRole === "worker" &&
    !!order.worker_profile_id &&
    order.worker_profile_id === profileId;
  if (!isWorkerOwner) return null;

  switch (order.status) {
    case "pending":
      return {
        primary: { label: "Хүлээн авах", status: "accepted" },
        secondary: {
          label: "Татгалзах",
          status: "rejected",
          confirm: {
            title: "Захиалга татгалзах уу?",
            message: "Та энэ захиалгыг татгалзахдаа итгэлтэй байна уу?",
          },
        },
      };
    case "accepted":
      return {
        primary: { label: "Явж байна", status: "en_route" },
        secondary: {
          label: "Цуцлах",
          status: "cancelled",
          confirm: {
            title: "Захиалга цуцлах уу?",
            message: "Та энэ захиалгыг цуцлахдаа итгэлтэй байна уу?",
          },
        },
      };
    case "en_route":
      return {
        primary: { label: "Ажил эхлүүлэх", status: "in_progress" },
        secondary: {
          label: "Цуцлах",
          status: "cancelled",
          confirm: {
            title: "Захиалга цуцлах уу?",
            message: "Та энэ захиалгыг цуцлахдаа итгэлтэй байна уу?",
          },
        },
      };
    case "in_progress":
      return {
        primary: { label: "Дуусгах", status: "completed" },
        secondary: {
          label: "Цуцлах",
          status: "cancelled",
          confirm: {
            title: "Захиалга цуцлах уу?",
            message: "Та энэ захиалгыг цуцлахдаа итгэлтэй байна уу?",
          },
        },
      };
    default:
      return null;
  }
};

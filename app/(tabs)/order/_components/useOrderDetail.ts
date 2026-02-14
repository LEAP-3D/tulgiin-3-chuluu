import { useEffect, useMemo, useState } from "react";
import { normalizeList } from "@/lib/utils/normalize";
import { buildTimeline } from "./helpers";
import type { CustomerProfile, OrderItem, TimelineItem, WorkerProfile } from "./types";

export type OrderDetailState = {
  worker: WorkerProfile | null;
  isWorkerLoading: boolean;
  workerError: string | null;
  customer: CustomerProfile | null;
  isCustomerLoading: boolean;
  customerError: string | null;
  timeline: TimelineItem[];
  attachments: string[];
};

export function useOrderDetail(
  apiBaseUrl: string,
  selectedOrder: OrderItem | null,
  showDetail: boolean,
  profileRole: "user" | "worker" | null,
): OrderDetailState {
  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [isWorkerLoading, setIsWorkerLoading] = useState(false);
  const [workerError, setWorkerError] = useState<string | null>(null);
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [isCustomerLoading, setIsCustomerLoading] = useState(false);
  const [customerError, setCustomerError] = useState<string | null>(null);

  const timeline = useMemo(() => buildTimeline(selectedOrder), [selectedOrder]);
  const attachments = useMemo(() => {
    if (!selectedOrder) return [];
    return normalizeList(selectedOrder.attachment_urls);
  }, [selectedOrder]);

  useEffect(() => {
    const workerId = selectedOrder?.worker_profile_id;
    if (!showDetail) return;
    if (!workerId) {
      setWorker(null);
      setWorkerError("Засварчин томилогдоогүй байна.");
      return;
    }

    let cancelled = false;
    const loadWorker = async () => {
      setIsWorkerLoading(true);
      setWorkerError(null);
      try {
        const response = await fetch(`${apiBaseUrl}/workers/${workerId}`);
        const payload = await response.json().catch(() => null);
        if (!response.ok) {
          const message =
            payload?.error ?? payload?.message ?? `HTTP ${response.status}`;
          throw new Error(message);
        }
        const data = payload?.data ?? null;
        if (!data) throw new Error("Засварчин олдсонгүй.");
        const mapped: WorkerProfile = {
          id: String(data.id ?? ""),
          name:
            `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() ||
            "Засварчин",
          rating: typeof data.rating === "number" ? data.rating : null,
          orders: typeof data.orders === "number" ? data.orders : null,
          years: typeof data.years === "number" ? data.years : null,
          areas: normalizeList(data.service_area),
        };
        if (!cancelled) setWorker(mapped);
      } catch (err) {
        if (!cancelled) {
          setWorker(null);
          setWorkerError(
            err instanceof Error
              ? err.message
              : "Засварчин татах үед алдаа гарлаа.",
          );
        }
      } finally {
        if (!cancelled) setIsWorkerLoading(false);
      }
    };

    loadWorker();
    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl, selectedOrder?.worker_profile_id, showDetail]);

  useEffect(() => {
    if (!showDetail) return;
    if (profileRole !== "worker") return;
    const userId = selectedOrder?.user_profile_id;
    if (!userId) {
      setCustomer(null);
      setCustomerError("Хэрэглэгчийн мэдээлэл олдсонгүй.");
      return;
    }

    let cancelled = false;
    const loadCustomer = async () => {
      setIsCustomerLoading(true);
      setCustomerError(null);
      try {
        const response = await fetch(`${apiBaseUrl}/profiles/${userId}`);
        const payload = await response.json().catch(() => null);
        if (!response.ok) {
          const message =
            payload?.error ?? payload?.message ?? `HTTP ${response.status}`;
          throw new Error(message);
        }
        const data = payload?.data ?? null;
        if (!data) throw new Error("Хэрэглэгчийн мэдээлэл олдсонгүй.");
        const mapped: CustomerProfile = {
          id: String(data.id ?? ""),
          name:
            `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() ||
            "Хэрэглэгч",
          email: data.email ?? null,
          phone: data.phone_number ?? null,
        };
        if (!cancelled) setCustomer(mapped);
      } catch (err) {
        if (!cancelled) {
          setCustomer(null);
          setCustomerError(
            err instanceof Error
              ? err.message
              : "Хэрэглэгч татах үед алдаа гарлаа.",
          );
        }
      } finally {
        if (!cancelled) setIsCustomerLoading(false);
      }
    };

    loadCustomer();
    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl, profileRole, selectedOrder?.user_profile_id, showDetail]);

  return {
    worker,
    isWorkerLoading,
    workerError,
    customer,
    isCustomerLoading,
    customerError,
    timeline,
    attachments,
  };
}

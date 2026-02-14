import { useEffect, useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SERVICE_LABELS } from "@/constants/services";
import { normalizeList } from "@/lib/utils/normalize";
import type { RepairmanProfileParams, Technician } from "./types";

export type RepairmanProfileController = {
  insetsBottom: number;
  technician: Technician | null;
  subtitle: string;
  isLoading: boolean;
  errorMessage: string | null;
  onBack: () => void;
  onSelectWorker: () => void;
};

export function useRepairmanProfileController(): RepairmanProfileController {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const apiBaseUrl =
    process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
  const params = useLocalSearchParams<RepairmanProfileParams>();
  const workerId = typeof params.id === "string" ? params.id : "";
  const fallbackTypeLabel =
    typeof params.typeLabel === "string" ? params.typeLabel : "";

  const [technician, setTechnician] = useState<Technician | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const subtitle = useMemo(() => {
    if (fallbackTypeLabel) return `${fallbackTypeLabel} мэргэжилтэн`;
    const firstSkill = technician?.skills?.[0];
    if (firstSkill && SERVICE_LABELS[firstSkill]) {
      return `${SERVICE_LABELS[firstSkill]} мэргэжилтэн`;
    }
    return "Мэргэжилтэн";
  }, [fallbackTypeLabel, technician?.skills]);

  const carryParams = {
    typeKey: typeof params.typeKey === "string" ? params.typeKey : "",
    typeLabel: fallbackTypeLabel,
    district: typeof params.district === "string" ? params.district : "",
    date: typeof params.date === "string" ? params.date : "",
    khoroo: typeof params.khoroo === "string" ? params.khoroo : "",
    address: typeof params.address === "string" ? params.address : "",
    description:
      typeof params.description === "string" ? params.description : "",
    urgency: typeof params.urgency === "string" ? params.urgency : "",
  };

  useEffect(() => {
    if (!workerId) return;
    let cancelled = false;
    const loadWorker = async () => {
      setIsLoading(true);
      setErrorMessage(null);
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

        const mapped: Technician = {
          id: String(data.id ?? ""),
          name:
            `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() ||
            "Засварчин",
          rating: typeof data.rating === "number" ? data.rating : null,
          orders: typeof data.orders === "number" ? data.orders : null,
          years: typeof data.years === "number" ? data.years : null,
          areas: normalizeList(data.service_area),
          skills: normalizeList(data.work_types),
        };
        if (!cancelled) setTechnician(mapped);
      } catch (err) {
        if (!cancelled) {
          setErrorMessage(
            err instanceof Error
              ? err.message
              : "Өгөгдөл татах үед алдаа гарлаа.",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadWorker();
    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl, workerId]);

  const onSelectWorker = () => {
    if (!technician) return;
    router.push({
      pathname: "/service/create-order",
      params: {
        ...carryParams,
        selectedWorkerId: technician.id,
        selectedWorkerName: technician.name,
        selectedWorkerRating:
          typeof technician.rating === "number" ? String(technician.rating) : "",
        selectedWorkerOrders:
          typeof technician.orders === "number" ? String(technician.orders) : "",
        selectedWorkerYears:
          typeof technician.years === "number" ? String(technician.years) : "",
        selectedWorkerAreas: JSON.stringify(technician.areas),
      },
    });
  };

  return {
    insetsBottom: insets.bottom,
    technician,
    subtitle,
    isLoading,
    errorMessage,
    onBack: () => router.back(),
    onSelectWorker,
  };
}

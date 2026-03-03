import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SERVICE_LABELS } from "@/constants/services";
import { normalizeList } from "@/lib/utils/normalize";
import type { SelectRepairmanParams, Technician } from "./types";

export type SelectRepairmanController = {
  insetsBottom: number;
  typeLabel: string;
  district: string;
  technicians: Technician[];
  isLoading: boolean;
  errorMessage: string | null;
  onBack: () => void;
  onOpenProfile: (id: string) => void;
  onSelectWorker: (tech: Technician) => void;
  carryParams: Record<string, string>;
};

export function useSelectRepairmanController(): SelectRepairmanController {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const apiBaseUrl =
    process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
  const params = useLocalSearchParams<SelectRepairmanParams>();
  const typeKey = typeof params.typeKey === "string" ? params.typeKey : "";
  const typeLabel =
    typeof params.typeLabel === "string"
      ? params.typeLabel
      : SERVICE_LABELS[typeKey] ?? "Сантехник";
  const district = typeof params.district === "string" ? params.district : "";
  const date = typeof params.date === "string" ? params.date : "";
  const khoroo = typeof params.khoroo === "string" ? params.khoroo : "";
  const address = typeof params.address === "string" ? params.address : "";
  const description =
    typeof params.description === "string" ? params.description : "";
  const urgency = typeof params.urgency === "string" ? params.urgency : "";
  const attachments =
    typeof params.attachments === "string" ? params.attachments : "[]";

  const districtQuery = useMemo(() => {
    if (!district) return "";
    return district.endsWith("дүүрэг") ? district : `${district} дүүрэг`;
  }, [district]);

  const carryParams = {
    typeKey,
    typeLabel,
    district,
    date,
    khoroo,
    address,
    description,
    urgency,
    attachments,
  };

  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const parseNumber = (value: unknown) => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
    return null;
  };

  const readAvatarFromProfile = useCallback(async (profileId: string) => {
    const response = await fetch(`${apiBaseUrl}/profiles/${profileId}`);
    const payload = await response.json().catch(() => null);
    if (!response.ok) return null;
    const data = payload?.data;
    if (!data || typeof data !== "object") return null;
    if (typeof data.profile_url === "string" && data.profile_url.trim()) {
      return data.profile_url;
    }
    if (typeof data.avatar_url === "string" && data.avatar_url.trim()) {
      return data.avatar_url;
    }
    return null;
  }, [apiBaseUrl]);

  const onOpenProfile = (id: string) => {
    router.push({
      pathname: "/service/repairman-profile",
      params: { id, ...carryParams },
    });
  };

  const onSelectWorker = (tech: Technician) => {
    router.push({
      pathname: "/service/create-order",
      params: {
        ...carryParams,
        selectedWorkerId: tech.id,
        selectedWorkerName: tech.name,
        selectedWorkerRating:
          typeof tech.rating === "number" ? String(tech.rating) : "",
        selectedWorkerOrders:
          typeof tech.orders === "number" ? String(tech.orders) : "",
        selectedWorkerYears:
          typeof tech.years === "number" ? String(tech.years) : "",
        selectedWorkerAreas: JSON.stringify(tech.areas),
        selectedWorkerAvatar: tech.avatarUrl ?? "",
      },
    });
  };

  useEffect(() => {
    let cancelled = false;
    const loadWorkers = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const url = new URL(`${apiBaseUrl}/workers`);
        if (typeKey) url.searchParams.set("typeKey", typeKey);
        if (districtQuery) url.searchParams.set("district", districtQuery);
        const response = await fetch(url.toString());
        const payload = await response.json().catch(() => null);
        if (!response.ok) {
          const message =
            payload?.error ?? payload?.message ?? `HTTP ${response.status}`;
          throw new Error(message);
        }
        const data = Array.isArray(payload?.data) ? payload.data : [];
        const mapped: Technician[] = data.map((item: any) => ({
          id: String(item.id ?? ""),
          name:
            `${item.first_name ?? ""} ${item.last_name ?? ""}`.trim() ||
            "Засварчин",
          areas: normalizeList(item.service_area),
          services: normalizeList(item.work_types),
          rating: parseNumber(item.rating),
          orders: parseNumber(item.orders),
          years: parseNumber(item.years),
          avatarUrl:
            typeof item.profile_url === "string"
              ? item.profile_url
              : typeof item.avatar_url === "string"
                ? item.avatar_url
                : null,
        }));
        const missingAvatarIds = mapped
          .filter((item) => !item.avatarUrl && item.id)
          .map((item) => item.id);

        if (missingAvatarIds.length === 0) {
          if (!cancelled) setTechnicians(mapped);
          return;
        }

        const fallbackEntries = await Promise.all(
          missingAvatarIds.map(async (id) => ({
            id,
            avatarUrl: await readAvatarFromProfile(id),
          })),
        );
        const fallbackMap = new Map(
          fallbackEntries
            .filter((item) => typeof item.avatarUrl === "string" && item.avatarUrl)
            .map((item) => [item.id, item.avatarUrl as string]),
        );

        const enriched = mapped.map((item) => ({
          ...item,
          avatarUrl: item.avatarUrl ?? fallbackMap.get(item.id) ?? null,
        }));
        if (!cancelled) setTechnicians(enriched);
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

    loadWorkers();
    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl, districtQuery, readAvatarFromProfile, typeKey]);

  return {
    insetsBottom: insets.bottom,
    typeLabel,
    district,
    technicians,
    isLoading,
    errorMessage,
    onBack: () => router.back(),
    onOpenProfile,
    onSelectWorker,
    carryParams,
  };
}

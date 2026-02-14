import { useMemo, useState } from "react";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SERVICES, type ServiceItem } from "./services";

export type ServiceAllController = {
  insetsBottom: number;
  query: string;
  setQuery: (value: string) => void;
  services: ServiceItem[];
  onBack: () => void;
  onSelectService: (label: string) => void;
};

export function useServiceAllController(): ServiceAllController {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const services = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return SERVICES;
    return SERVICES.filter((item) =>
      item.label.toLowerCase().includes(needle),
    );
  }, [query]);

  const onSelectService = (label: string) => {
    router.push({ pathname: "/service/create-order", params: { type: label } });
  };

  return {
    insetsBottom: insets.bottom,
    query,
    setQuery,
    services,
    onBack: () => router.back(),
    onSelectService,
  };
}

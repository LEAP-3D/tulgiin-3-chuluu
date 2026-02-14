import { useMemo } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSupabaseAuth } from "@/lib/supabase-auth";
import type { CreateOrderParams } from "./types";
import { resolveService } from "./helpers";
import {
  useCreateOrderFormState,
  type CreateOrderFormState,
} from "./useCreateOrderFormState";
import {
  useCreateOrderSubmit,
  type SubmitState,
} from "./useCreateOrderSubmit";

export type CreateOrderController = CreateOrderFormState &
  SubmitState & {
    insetsBottom: number;
    selectedService: { key: string; label: string; icon: string };
    isServiceParamValid: boolean;
    handleBack: () => void;
  };

export function useCreateOrderController(): CreateOrderController {
  const insets = useSafeAreaInsets();
  const { user, isLoaded: isUserLoaded } = useSupabaseAuth();
  const apiBaseUrl =
    process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
  const params = useLocalSearchParams<CreateOrderParams>();
  const { selectedService, isServiceParamValid } = resolveService(params);

  const formState = useCreateOrderFormState(params);
  const submitState = useCreateOrderSubmit({
    apiBaseUrl,
    isUserLoaded,
    userEmail: user?.email ?? null,
    selectedService,
    apiDate: formState.apiDate,
    district: formState.district,
    khoroo: formState.khoroo,
    address: formState.address,
    description: formState.description,
    urgency: formState.urgency,
    date: formState.date,
    minimumDate: formState.minimumDate,
    isServiceParamValid,
    selectedWorker: formState.selectedWorker,
    setErrors: formState.setErrors,
  });

  const router = useRouter();
  const handleBack = useMemo(() => () => router.back(), [router]);

  return {
    insetsBottom: insets.bottom,
    selectedService,
    isServiceParamValid,
    handleBack,
    ...formState,
    ...submitState,
  };
}

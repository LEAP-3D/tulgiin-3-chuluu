import { useState, type Dispatch, type SetStateAction } from "react";
import { useRouter } from "expo-router";
import { buildValidationErrors } from "./helpers";
import type { FormErrors, SelectedWorker } from "./types";

type Params = {
  apiBaseUrl: string;
  isUserLoaded: boolean;
  userEmail?: string | null;
  accessToken?: string | null;
  selectedService: { key: string; label: string };
  apiDate: string;
  district: string;
  khoroo: string;
  address: string;
  description: string;
  urgency: "normal" | "urgent" | null;
  date: Date | null;
  minimumDate: Date;
  isServiceParamValid: boolean;
  selectedWorker: SelectedWorker | null;
  setErrors: Dispatch<SetStateAction<FormErrors>>;
};

export type SubmitState = {
  isSubmitting: boolean;
  submitError: string | null;
  handlePrimaryAction: () => Promise<void>;
};

export function useCreateOrderSubmit({
  apiBaseUrl,
  isUserLoaded,
  userEmail,
  accessToken,
  selectedService,
  apiDate,
  district,
  khoroo,
  address,
  description,
  urgency,
  date,
  minimumDate,
  isServiceParamValid,
  selectedWorker,
  setErrors,
}: Params): SubmitState {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchUserProfileId = async () => {
    const email = userEmail?.trim();
    if (!email) {
      throw new Error("Хэрэглэгчийн имэйл олдсонгүй.");
    }

    const authHeader = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : {};
    const response = await fetch(
      `${apiBaseUrl}/profiles?email=${encodeURIComponent(email)}`,
      { headers: authHeader },
    );
    if (!response.ok) {
      throw new Error(`Профайл татах үед алдаа гарлаа. HTTP ${response.status}`);
    }
    const payload = await response.json().catch(() => null);
    const data = payload?.data;
    if (!data?.id) {
      throw new Error("Хэрэглэгчийн профайл олдсонгүй.");
    }
    return data.id as string;
  };

  const handlePrimaryAction = async () => {
    const nextErrors = buildValidationErrors({
      isServiceParamValid,
      selectedServiceKey: selectedService.key,
      date,
      minimumDate,
      district,
      khoroo,
      address,
      description,
      urgency,
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (selectedWorker?.id) {
      if (!isUserLoaded) return;
      setIsSubmitting(true);
      setSubmitError(null);
      try {
        const userProfileId = await fetchUserProfileId();
        const payload = {
          service_key: selectedService.key,
          service_label: selectedService.label,
          scheduled_date: apiDate,
          district,
          khoroo,
          address: address.trim(),
          description: description.trim(),
          urgency: urgency ?? "normal",
          user_profile_id: userProfileId,
          worker_profile_id: selectedWorker.id,
        };

        const response = await fetch(`${apiBaseUrl}/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          body: JSON.stringify(payload),
        });
        const result = await response.json().catch(() => null);
        if (!response.ok) {
          const message =
            result?.error ?? result?.message ?? `HTTP ${response.status}`;
          throw new Error(message);
        }

        router.push("/(tabs)/order");
      } catch (err) {
        setSubmitError(
          err instanceof Error ? err.message : "Хадгалах үед алдаа гарлаа.",
        );
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    router.push({
      pathname: "/service/select-repairman",
      params: {
        typeKey: selectedService.key,
        typeLabel: selectedService.label,
        district,
        date: apiDate,
        khoroo,
        address,
        description,
        urgency: urgency ?? "",
      },
    });
  };

  return { isSubmitting, submitError, handlePrimaryAction };
}

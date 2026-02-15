import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { Platform } from "react-native";
import { DISTRICTS } from "@/constants/districts";
import type { CreateOrderParams, FormErrors, SelectedWorker } from "./types";
import { formatApiDate, formatDateLabel, parseSelectedWorker } from "./helpers";

export type CreateOrderFormState = {
  date: Date | null;
  tempDate: Date;
  minimumDate: Date;
  formattedDate: string;
  apiDate: string;
  district: string;
  khoroo: string;
  address: string;
  description: string;
  urgency: "normal" | "urgent" | null;
  errors: FormErrors;
  selectedWorker: SelectedWorker | null;
  showDatePicker: boolean;
  showDistrictPicker: boolean;
  showKhorooPicker: boolean;
  khorooOptions: string[];
  openDatePicker: () => void;
  closeDatePicker: () => void;
  confirmDatePicker: () => void;
  handleDateChange: (_event: unknown, selectedDate?: Date) => void;
  handleSelectDistrict: (value: string) => void;
  handleSelectKhoroo: (value: string) => void;
  setShowDistrictPicker: (value: boolean) => void;
  setShowKhorooPicker: (value: boolean) => void;
  setAddress: (value: string) => void;
  setDescription: (value: string) => void;
  setUrgency: (value: "normal" | "urgent") => void;
  setErrors: Dispatch<SetStateAction<FormErrors>>;
  setSelectedWorker: Dispatch<SetStateAction<SelectedWorker | null>>;
};

export function useCreateOrderFormState(
  params: CreateOrderParams,
): CreateOrderFormState {
  const [date, setDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());
  const [district, setDistrict] = useState("");
  const [khoroo, setKhoroo] = useState("");
  const [showDistrictPicker, setShowDistrictPicker] = useState(false);
  const [showKhorooPicker, setShowKhorooPicker] = useState(false);
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState<"normal" | "urgent" | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [selectedWorker, setSelectedWorker] = useState<SelectedWorker | null>(null);

  const minimumDate = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }, []);

  const formattedDate = useMemo(() => formatDateLabel(date), [date]);
  const apiDate = useMemo(() => formatApiDate(date), [date]);

  const khorooOptions = useMemo(() => {
    return DISTRICTS.find((item) => item.name === district)?.khoroos ?? [];
  }, [district]);

  const normalizeToMinimum = (value: Date) =>
    value < minimumDate ? minimumDate : value;

  const openDatePicker = () => {
    const baseDate = date ?? minimumDate;
    setTempDate(normalizeToMinimum(baseDate));
    setShowDatePicker(true);
  };

  const closeDatePicker = () => setShowDatePicker(false);

  const confirmDatePicker = () => {
    setDate(tempDate);
    setShowDatePicker(false);
    setErrors((prev) => ({ ...prev, date: undefined }));
  };

  const handleDateChange = (_event: unknown, selectedDate?: Date) => {
    if (!selectedDate) return;
    const nextDate = normalizeToMinimum(selectedDate);
    setTempDate(nextDate);
    if (Platform.OS !== "ios") {
      setDate(nextDate);
      setShowDatePicker(false);
      setErrors((prev) => ({ ...prev, date: undefined }));
    }
  };

  const handleSelectDistrict = (value: string) => {
    setDistrict(value);
    setKhoroo("");
    setShowDistrictPicker(false);
    setErrors((prev) => ({ ...prev, district: undefined, khoroo: undefined }));
  };

  const handleSelectKhoroo = (value: string) => {
    setKhoroo(value);
    setShowKhorooPicker(false);
    setErrors((prev) => ({ ...prev, khoroo: undefined }));
  };

  const isSameWorker = (
    current: SelectedWorker | null,
    next: SelectedWorker | null,
  ) => {
    if (current === next) return true;
    if (!current || !next) return false;
    if (
      current.id !== next.id ||
      current.name !== next.name ||
      current.rating !== next.rating ||
      current.orders !== next.orders ||
      current.years !== next.years ||
      current.avatarUrl !== next.avatarUrl
    ) {
      return false;
    }
    if (current.areas.length !== next.areas.length) return false;
    return current.areas.every((area, index) => area === next.areas[index]);
  };

  useEffect(() => {
    const paramDate = typeof params.date === "string" ? params.date : "";
    if (!date && paramDate) {
      const parsed = new Date(`${paramDate}T00:00:00`);
      if (!Number.isNaN(parsed.getTime())) setDate(parsed);
    }
    if (!district && typeof params.district === "string") {
      setDistrict(params.district);
    }
    if (!khoroo && typeof params.khoroo === "string") {
      setKhoroo(params.khoroo);
    }
    if (!address && typeof params.address === "string") {
      setAddress(params.address);
    }
    if (!description && typeof params.description === "string") {
      setDescription(params.description);
    }
    if (!urgency && typeof params.urgency === "string") {
      const nextUrgency =
        params.urgency === "urgent" || params.urgency === "normal"
          ? params.urgency
          : null;
      if (nextUrgency) setUrgency(nextUrgency);
    }

    const worker = parseSelectedWorker(params);
    if (!worker) return;
    setSelectedWorker((prev) => (isSameWorker(prev, worker) ? prev : worker));
  }, [params, address, date, description, district, khoroo, urgency]);

  return {
    date,
    tempDate,
    minimumDate,
    formattedDate,
    apiDate,
    district,
    khoroo,
    address,
    description,
    urgency,
    errors,
    selectedWorker,
    showDatePicker,
    showDistrictPicker,
    showKhorooPicker,
    khorooOptions,
    openDatePicker,
    closeDatePicker,
    confirmDatePicker,
    handleDateChange,
    handleSelectDistrict,
    handleSelectKhoroo,
    setShowDistrictPicker,
    setShowKhorooPicker,
    setAddress,
    setDescription,
    setUrgency,
    setErrors,
    setSelectedWorker,
  };
}

import { SERVICE_OPTIONS } from "@/constants/services";
import { normalizeList } from "@/lib/utils/normalize";
import type { CreateOrderParams, FormErrors, SelectedWorker } from "./types";

export const resolveService = (params: CreateOrderParams) => {
  const serviceParamLabel =
    typeof params.typeLabel === "string"
      ? params.typeLabel
      : typeof params.type === "string"
        ? params.type
        : "";
  const serviceParamKey =
    typeof params.typeKey === "string" ? params.typeKey : "";

  const selectedService = serviceParamKey
    ? SERVICE_OPTIONS.find((item) => item.key === serviceParamKey) ??
      SERVICE_OPTIONS[0]
    : SERVICE_OPTIONS.find((item) => item.label === serviceParamLabel) ??
      SERVICE_OPTIONS[0];

  const isServiceParamValid = !serviceParamLabel
    ? true
    : SERVICE_OPTIONS.some((item) => item.label === serviceParamLabel);

  return { selectedService, isServiceParamValid, serviceParamLabel, serviceParamKey };
};

export const formatDateLabel = (date: Date | null) => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}/${month}/${day}`;
};

export const formatApiDate = (date: Date | null) => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const buildValidationErrors = ({
  isServiceParamValid,
  selectedServiceKey,
  date,
  minimumDate,
  district,
  khoroo,
  address,
  description,
  urgency,
}: {
  isServiceParamValid: boolean;
  selectedServiceKey: string | undefined;
  date: Date | null;
  minimumDate: Date;
  district: string;
  khoroo: string;
  address: string;
  description: string;
  urgency: "normal" | "urgent" | null;
}): FormErrors => {
  const nextErrors: FormErrors = {};

  if (!isServiceParamValid || !selectedServiceKey) {
    nextErrors.service = "Үйлчилгээний төрөл буруу байна.";
  }

  if (!date) {
    nextErrors.date = "Огноо сонгоно уу.";
  } else if (date < minimumDate) {
    nextErrors.date = "Өнөөдрөөс өмнөх огноо сонгох боломжгүй.";
  }

  if (!district) {
    nextErrors.district = "Дүүрэг сонгоно уу.";
  }

  if (!khoroo) {
    nextErrors.khoroo = "Хороо сонгоно уу.";
  }

  if (!address.trim()) {
    nextErrors.address = "Дэлгэрэнгүй хаяг бичнэ үү.";
  }

  if (!description.trim()) {
    nextErrors.description = "Тайлбар бичнэ үү.";
  }

  if (!urgency) {
    nextErrors.urgency = "Яаралтай эсэхийг сонгоно уу.";
  }

  return nextErrors;
};

export const parseSelectedWorker = (params: CreateOrderParams): SelectedWorker | null => {
  if (typeof params.selectedWorkerId !== "string") return null;
  const areas = normalizeList(params.selectedWorkerAreas);
  const rating =
    typeof params.selectedWorkerRating === "string" &&
    params.selectedWorkerRating.trim()
      ? Number(params.selectedWorkerRating)
      : null;
  const orders =
    typeof params.selectedWorkerOrders === "string" &&
    params.selectedWorkerOrders.trim()
      ? Number(params.selectedWorkerOrders)
      : null;
  const years =
    typeof params.selectedWorkerYears === "string" &&
    params.selectedWorkerYears.trim()
      ? Number(params.selectedWorkerYears)
      : null;

  return {
    id: params.selectedWorkerId,
    name:
      typeof params.selectedWorkerName === "string"
        ? params.selectedWorkerName
        : "Засварчин",
    rating: Number.isFinite(rating) ? rating : null,
    orders: Number.isFinite(orders) ? orders : null,
    years: Number.isFinite(years) ? years : null,
    areas,
    avatarUrl:
      typeof params.selectedWorkerAvatar === "string"
        ? params.selectedWorkerAvatar
        : null,
  };
};

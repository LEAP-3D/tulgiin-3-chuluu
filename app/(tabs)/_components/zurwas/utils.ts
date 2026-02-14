import { SERVICE_LABELS } from "./constants";
import type { ProfileInfo } from "./types";

export const getParam = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

export const formatTime = (value?: string | null) => {
  if (!value) return "--:--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--:--";
  return date.toLocaleTimeString("mn-MN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getProfessionLabel = (profile?: ProfileInfo) => {
  if (!profile) return "Мэргэжилтэн";
  if (profile.role !== "worker") return "Хэрэглэгч";
  const firstSkill = profile.workTypes[0];
  if (!firstSkill) return "Мэргэжилтэн";
  return `${SERVICE_LABELS[firstSkill] ?? firstSkill} мэргэжилтэн`;
};

export const getInitials = (name?: string) => {
  if (!name) return "👤";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "👤";
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return `${first}${last}`.toUpperCase();
};

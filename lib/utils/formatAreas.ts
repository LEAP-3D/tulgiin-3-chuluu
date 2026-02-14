import { DISTRICT_SHORT } from "@/constants/districts";

export const formatAreas = (areas: string[], maxVisible?: number) => {
  if (areas.length === 0) return "—";
  const mapped = areas.map((area) => DISTRICT_SHORT[area] ?? area);
  const limit = typeof maxVisible === "number" ? maxVisible : mapped.length;
  if (mapped.length <= limit) return mapped.join(", ");
  const visible = mapped.slice(0, limit).join(", ");
  const remaining = mapped.length - limit;
  return `${visible} +${remaining}`;
};

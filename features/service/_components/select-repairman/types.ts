export type SelectRepairmanParams = {
  typeKey?: string;
  typeLabel?: string;
  district?: string;
  date?: string;
  khoroo?: string;
  address?: string;
  description?: string;
  urgency?: string;
};

export type Technician = {
  id: string;
  name: string;
  areas: string[];
  services: string[];
  rating?: number | null;
  orders?: number | null;
  years?: number | null;
  avatarUrl?: string | null;
};

export type RepairmanProfileParams = {
  id?: string;
  typeLabel?: string;
  typeKey?: string;
  district?: string;
  date?: string;
  khoroo?: string;
  address?: string;
  description?: string;
  urgency?: string;
  attachments?: string;
};

export type Technician = {
  id: string;
  name: string;
  avatarUrl?: string | null;
  rating?: number | null;
  orders?: number | null;
  years?: number | null;
  areas: string[];
  skills: string[];
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
};

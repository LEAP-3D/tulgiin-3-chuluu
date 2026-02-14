export type OrderItem = {
  id: string;
  service_key?: string | null;
  service_label?: string | null;
  status?: string | null;
  created_at?: string | null;
  accepted_at?: string | null;
  rejected_at?: string | null;
  cancelled_at?: string | null;
  en_route_at?: string | null;
  in_progress_at?: string | null;
  completed_at?: string | null;
  worker_profile_id?: string | null;
  user_profile_id?: string | null;
  district?: string | null;
  khoroo?: string | null;
  address?: string | null;
  description?: string | null;
  scheduled_date?: string | null;
  urgency?: string | null;
  attachment_urls?: unknown;
};

export type WorkerProfile = {
  id: string;
  name: string;
  rating?: number | null;
  orders?: number | null;
  years?: number | null;
  areas: string[];
};

export type CustomerProfile = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
};

export type TimelineItem = {
  title: string;
  time: string;
  active: boolean;
};

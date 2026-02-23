export type CreateOrderParams = {
  type?: string;
  typeKey?: string;
  typeLabel?: string;
  date?: string;
  district?: string;
  khoroo?: string;
  address?: string;
  description?: string;
  urgency?: string;
  selectedWorkerId?: string;
  selectedWorkerName?: string;
  selectedWorkerRating?: string;
  selectedWorkerOrders?: string;
  selectedWorkerYears?: string;
  selectedWorkerAreas?: string;
  selectedWorkerAvatar?: string;
};

export type FormErrors = {
  service?: string;
  date?: string;
  district?: string;
  khoroo?: string;
  address?: string;
  description?: string;
  urgency?: string;
};

export type SelectedWorker = {
  id: string;
  name: string;
  rating?: number | null;
  orders?: number | null;
  years?: number | null;
  areas: string[];
  avatarUrl?: string | null;
};

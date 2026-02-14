import { useEffect, useState } from "react";
import { useSupabaseAuth } from "@/lib/supabase-auth";
import type { OrderItem } from "./types";
import { mapOrder } from "./helpers";

type OrdersListState = {
  orders: OrderItem[];
  isLoading: boolean;
  errorMessage: string | null;
  profileId: string | null;
  profileRole: "user" | "worker" | null;
  acceptOrder: (orderId: string) => Promise<void>;
  rejectOrder: (orderId: string) => Promise<void>;
};

export function useOrdersList(apiBaseUrl: string): OrdersListState {
  const { user, isLoaded: isUserLoaded } = useSupabaseAuth();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [profileRole, setProfileRole] = useState<"user" | "worker" | null>(null);

  useEffect(() => {
    if (!isUserLoaded) return;
    const email = user?.email?.trim();
    if (!email) return;

    let cancelled = false;
    const load = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const profileResponse = await fetch(
          `${apiBaseUrl}/profiles?email=${encodeURIComponent(email)}`,
        );
        const profilePayload = await profileResponse.json().catch(() => null);
        if (!profileResponse.ok) {
          const message =
            profilePayload?.error ??
            profilePayload?.message ??
            `HTTP ${profileResponse.status}`;
          throw new Error(message);
        }
        const profileData = profilePayload?.data ?? null;
        if (profileData && !cancelled) {
          setProfileId(String(profileData.id ?? ""));
          setProfileRole(profileData.role === "worker" ? "worker" : "user");
        }

        let url = `${apiBaseUrl}/orders?email=${encodeURIComponent(email)}`;
        if (profileData?.role === "worker") {
          url = `${apiBaseUrl}/orders?worker_email=${encodeURIComponent(email)}`;
        }
        const response = await fetch(url);
        const payload = await response.json().catch(() => null);
        if (!response.ok) {
          const message =
            payload?.error ?? payload?.message ?? `HTTP ${response.status}`;
          throw new Error(message);
        }
        const data = Array.isArray(payload?.data) ? payload.data : [];
        const mapped = data.map(mapOrder);
        if (!cancelled) setOrders(mapped);
      } catch (err) {
        if (!cancelled) {
          setErrorMessage(
            err instanceof Error ? err.message : "Захиалга татах үед алдаа гарлаа.",
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [apiBaseUrl, isUserLoaded, user?.email]);

  const updateOrderStatus = async (orderId: string, status: string) => {
    const response = await fetch(`${apiBaseUrl}/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      const message =
        payload?.error ?? payload?.message ?? `HTTP ${response.status}`;
      throw new Error(message);
    }
    setOrders((prev) =>
      prev.map((item) => (item.id === orderId ? { ...item, status } : item)),
    );
  };

  const acceptOrder = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, "accepted");
    } catch {
      // ignore for now
    }
  };

  const rejectOrder = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, "rejected");
    } catch {
      // ignore for now
    }
  };

  return {
    orders,
    isLoading,
    errorMessage,
    profileId,
    profileRole,
    acceptOrder,
    rejectOrder,
  };
}

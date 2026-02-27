import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, AppState } from "react-native";
import { useSupabaseAuth } from "@/lib/supabase-auth";
import { supabase } from "@/lib/supabase";
import type { OrderItem } from "./types";
import { mapOrder } from "./helpers";

type OrdersListState = {
  orders: OrderItem[];
  isLoading: boolean;
  errorMessage: string | null;
  profileId: string | null;
  profileRole: "user" | "worker" | null;
  updatingOrderId: string | null;
  updatingStatus: string | null;
  acceptOrder: (orderId: string) => Promise<void>;
  rejectOrder: (orderId: string) => Promise<void>;
  setEnRoute: (orderId: string) => Promise<void>;
  setInProgress: (orderId: string) => Promise<void>;
  setCompleted: (orderId: string) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  confirmCashPayment: (orderId: string) => Promise<void>;
  retryLoadOrders?: () => void;
};

type StatusTimestampField =
  | "accepted_at"
  | "rejected_at"
  | "cancelled_at"
  | "en_route_at"
  | "in_progress_at"
  | "completed_at";

export function useOrdersList(apiBaseUrl: string): OrdersListState {
  const { user, session, isLoaded: isUserLoaded } = useSupabaseAuth();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [profileRole, setProfileRole] = useState<"user" | "worker" | null>(
    null,
  );
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const isFetchingRef = useRef(false);
  const isMountedRef = useRef(true);
  const appStateRef = useRef(AppState.currentState);
  const refreshIntervalMs = 15000;

  const statusTimestampMap: Partial<Record<string, StatusTimestampField>> = {
    accepted: "accepted_at",
    rejected: "rejected_at",
    cancelled: "cancelled_at",
    en_route: "en_route_at",
    in_progress: "in_progress_at",
    completed: "completed_at",
  };

  const statusSuccessMessages: Partial<Record<string, string>> = {
    accepted: "Захиалгыг хүлээн авлаа.",
    rejected: "Захиалгыг татгалзлаа.",
    cancelled: "Захиалгыг цуцаллаа.",
    en_route: "Засварчин явж байна гэж шинэчлэгдлээ.",
    in_progress: "Ажил эхэлсэн гэж шинэчлэгдлээ.",
    completed: "Ажил дууссан гэж шинэчлэгдлээ.",
  };

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadOrders = useCallback(
    async (options?: { silent?: boolean }) => {
      if (!isUserLoaded) return;
      const email = user?.email?.trim();
      if (!email) return;
      if (isFetchingRef.current) return;

      isFetchingRef.current = true;
      if (!options?.silent) {
        setIsLoading(true);
      }

      try {
        const authHeader = session?.access_token
          ? { Authorization: `Bearer ${session.access_token}` }
          : {};
        const profileResponse = await fetch(
          `${apiBaseUrl}/profiles?email=${encodeURIComponent(email)}`,
          { headers: authHeader },
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
        if (profileData && isMountedRef.current) {
          setProfileId(String(profileData.id ?? ""));
          setProfileRole(profileData.role === "worker" ? "worker" : "user");
        }

        let url = `${apiBaseUrl}/orders?email=${encodeURIComponent(email)}`;
        if (profileData?.role === "worker") {
          url = `${apiBaseUrl}/orders?worker_email=${encodeURIComponent(email)}`;
        }
        const response = await fetch(url, { headers: authHeader });
        const payload = await response.json().catch(() => null);
        if (!response.ok) {
          const message =
            payload?.error ?? payload?.message ?? `HTTP ${response.status}`;
          throw new Error(message);
        }
        const data = Array.isArray(payload?.data) ? payload.data : [];
        const mapped = data.map(mapOrder);
        if (isMountedRef.current) {
          setOrders(mapped);
          setErrorMessage(null);
        }
      } catch (err) {
        if (!options?.silent && isMountedRef.current) {
          setErrorMessage(
            err instanceof Error
              ? err.message
              : "Захиалга татах үед алдаа гарлаа.",
          );
        }
      } finally {
        if (!options?.silent && isMountedRef.current) {
          setIsLoading(false);
        }
        isFetchingRef.current = false;
      }
    },
    [apiBaseUrl, isUserLoaded, user?.email, session?.access_token],
  );

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      appStateRef.current = nextState;
      if (nextState === "active") {
        loadOrders({ silent: true });
      }
    });

    return () => {
      subscription.remove();
    };
  }, [loadOrders]);

  useEffect(() => {
    if (!profileId || !profileRole) return;

    const filterField =
      profileRole === "worker" ? "worker_profile_id" : "user_profile_id";
    const channel = supabase
      .channel(`orders-${profileRole}-${profileId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `${filterField}=eq.${profileId}`,
        },
        (payload) => {
          const row =
            (payload as { new?: any; old?: any }).new ??
            (payload as { old?: any }).old;
          if (!row?.id) {
            loadOrders({ silent: true });
            return;
          }

          const mapped = mapOrder(row);
          setOrders((prev) => {
            const exists = prev.some((item) => item.id === mapped.id);
            if (payload.eventType === "DELETE") {
              return prev.filter((item) => item.id !== mapped.id);
            }
            if (exists) {
              return prev.map((item) =>
                item.id === mapped.id ? mapped : item,
              );
            }
            return [mapped, ...prev];
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profileId, profileRole, loadOrders]);

  useEffect(() => {
    if (!isUserLoaded) return;
    if (!user?.email) return;
    if (appStateRef.current !== "active") return;

    const intervalId = setInterval(() => {
      if (updatingOrderId) return;
      loadOrders({ silent: true });
    }, refreshIntervalMs);

    return () => clearInterval(intervalId);
  }, [isUserLoaded, user?.email, updatingOrderId, loadOrders]);

  const updateOrderStatus = async (orderId: string, status: string) => {
    setUpdatingOrderId(orderId);
    setUpdatingStatus(status);
    const authHeader = session?.access_token
      ? { Authorization: `Bearer ${session.access_token}` }
      : {};
    try {
      const response = await fetch(`${apiBaseUrl}/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({ status }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        const message =
          payload?.error ?? payload?.message ?? `HTTP ${response.status}`;
        throw new Error(message);
      }
      const updatedOrder = payload?.data ? mapOrder(payload.data) : null;
      const timestampField = statusTimestampMap[status];
      setOrders((prev) =>
        prev.map((item) => {
          if (item.id !== orderId) return item;
          if (updatedOrder) return updatedOrder;
          const next: OrderItem = { ...item, status };
          if (timestampField) {
            next[timestampField] = new Date().toISOString();
          }
          return next;
        }),
      );
      const successMessage =
        statusSuccessMessages[status] ?? "Статус амжилттай шинэчлэгдлээ.";
      Alert.alert("Амжилттай", successMessage);
    } catch (err) {
      Alert.alert(
        "Алдаа",
        err instanceof Error
          ? err.message
          : "Захиалга шинэчлэх үед алдаа гарлаа.",
      );
      throw err;
    } finally {
      setUpdatingOrderId(null);
      setUpdatingStatus(null);
    }
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

  const setEnRoute = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, "en_route");
    } catch {
      // ignore for now
    }
  };

  const setInProgress = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, "in_progress");
    } catch {
      // ignore for now
    }
  };

  const setCompleted = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, "completed");
    } catch {
      // ignore for now
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      await updateOrderStatus(orderId, "cancelled");
    } catch {
      // ignore for now
    }
  };

  const confirmCashPayment = async (orderId: string) => {
    setUpdatingOrderId(orderId);
    setUpdatingStatus("payment");
    const authHeader = session?.access_token
      ? { Authorization: `Bearer ${session.access_token}` }
      : {};
    try {
      const response = await fetch(
        `${apiBaseUrl}/orders/${orderId}/payment/confirm-cash`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeader },
        },
      );
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        const message =
          payload?.error ?? payload?.message ?? `HTTP ${response.status}`;
        throw new Error(message);
      }
      const updatedOrder = payload?.data ? mapOrder(payload.data) : null;
      if (updatedOrder) {
        setOrders((prev) =>
          prev.map((item) => (item.id === orderId ? updatedOrder : item)),
        );
      }
      Alert.alert("Амжилттай", "Төлбөр бэлнээр төлөгдсөн гэж тэмдэглэлээ.");
    } catch (err) {
      Alert.alert(
        "Алдаа",
        err instanceof Error
          ? err.message
          : "Төлбөр баталгаажуулах үед алдаа гарлаа.",
      );
      throw err;
    } finally {
      setUpdatingOrderId(null);
      setUpdatingStatus(null);
    }
  };

  return {
    orders,
    isLoading,
    errorMessage,
    profileId,
    profileRole,
    updatingOrderId,
    updatingStatus,
    acceptOrder,
    rejectOrder,
    setEnRoute,
    setInProgress,
    setCompleted,
    cancelOrder,
    confirmCashPayment,
    retryLoadOrders: () => loadOrders(),
  };
}

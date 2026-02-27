import { useCallback, useState } from "react";

interface UsePullToRefreshProps {
  onRefresh: () => Promise<void>;
}

export interface RefreshConfig {
  refreshing: boolean;
  onRefresh: () => void;
  tintColor: string;
  title: string;
  titleColor: string;
}

export function usePullToRefresh({
  onRefresh,
}: UsePullToRefreshProps): RefreshConfig {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (refreshing) return;

    setRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh, refreshing]);

  return {
    refreshing,
    onRefresh: handleRefresh,
    tintColor: "#F59E0B",
    title: "Шинэчлэж байна...",
    titleColor: "#8E8E8E",
  };
}

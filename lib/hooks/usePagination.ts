import { useState, useCallback } from "react";

interface UsePaginationProps {
  initialPage?: number;
  pageSize?: number;
}

export function usePagination({
  initialPage = 1,
  pageSize = 20,
}: UsePaginationProps) {
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(true);

  const reset = useCallback(() => {
    setPage(initialPage);
    setHasMore(true);
  }, [initialPage]);

  const nextPage = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const loadMore = useCallback(
    (itemCount: number) => {
      const newHasMore = itemCount >= pageSize;
      setHasMore(newHasMore);
      if (newHasMore) {
        nextPage();
      }
    },
    [pageSize, nextPage],
  );

  return {
    page,
    pageSize,
    hasMore,
    nextPage,
    loadMore,
    reset,
    offset: (page - 1) * pageSize,
  };
}

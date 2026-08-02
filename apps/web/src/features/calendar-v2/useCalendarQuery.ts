import {
  useCallback,
  useEffect,
  useSyncExternalStore,
} from "react";

import type {
  EnterpriseCalendarItem,
} from "../../enterprise-api";

import {
  queryClient,
  type QuerySnapshot,
} from "../../api/data-engine/QueryClient";

import {
  apiQueryKeys,
} from "../../api/data-engine/queryKeys";

import {
  loadCalendar,
} from "./calendar-query";

interface UseCalendarQueryOptions {
  initialItems?: EnterpriseCalendarItem[];
  enabled?: boolean;
}

export function useCalendarQuery(
  options: UseCalendarQueryOptions = {},
) {
  const {
    initialItems = [],
    enabled = true,
  } = options;

  useEffect(() => {
    const cached =
      queryClient.getQueryData<
        EnterpriseCalendarItem[]
      >(apiQueryKeys.calendar);

    if (
      cached === undefined &&
      initialItems.length > 0
    ) {
      queryClient.setQueryData(
        apiQueryKeys.calendar,
        initialItems,
      );
    }
  }, [initialItems]);

  const subscribe = useCallback(
    (listener: () => void) =>
      queryClient.subscribe(
        apiQueryKeys.calendar,
        listener,
      ),
    [],
  );

  const getSnapshot = useCallback(
    (): QuerySnapshot<
      EnterpriseCalendarItem[]
    > =>
      queryClient.getSnapshot<
        EnterpriseCalendarItem[]
      >(apiQueryKeys.calendar),
    [],
  );

  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot,
  );

  const refresh = useCallback(
    async (): Promise<void> => {
      await loadCalendar(true);
    },
    [],
  );

  useEffect(() => {
    if (!enabled) {
      return;
    }

    void loadCalendar().catch(() => {
      // Error state is stored in QueryClient.
    });
  }, [enabled]);

  return {
    items:
      snapshot.data ??
      initialItems,

    loading:
      snapshot.status === "loading" &&
      snapshot.data === undefined,

    refreshing:
      snapshot.isFetching &&
      snapshot.data !== undefined,

    error:
      snapshot.status === "error"
        ? snapshot.error instanceof Error
          ? snapshot.error.message
          : "تعذر تحميل التقويم."
        : "",

    updatedAt:
      snapshot.updatedAt,

    refresh,
  };
}

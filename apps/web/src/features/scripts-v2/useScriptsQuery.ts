import {
  useCallback,
  useEffect,
  useSyncExternalStore,
} from "react";

import type {
  EnterpriseScript,
} from "../../enterprise-api";

import {
  queryClient,
  type QuerySnapshot,
} from "../../api/data-engine/QueryClient";

import {
  apiQueryKeys,
} from "../../api/data-engine/queryKeys";

import {
  loadScripts,
} from "./scripts-query";

interface UseScriptsQueryOptions {
  initialScripts?: EnterpriseScript[];
  enabled?: boolean;
}

export interface ScriptsQueryResult {
  scripts: EnterpriseScript[];
  loading: boolean;
  refreshing: boolean;
  error: string;
  updatedAt: number;
  refresh: () => Promise<void>;
}

function getErrorMessage(
  error: unknown,
): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "تعذر تحميل السكربتات.";
}

export function useScriptsQuery(
  options: UseScriptsQueryOptions = {},
): ScriptsQueryResult {
  const {
    initialScripts = [],
    enabled = true,
  } = options;

  useEffect(() => {
    const cached =
      queryClient.getQueryData<
        EnterpriseScript[]
      >(apiQueryKeys.scripts);

    if (
      cached === undefined &&
      initialScripts.length > 0
    ) {
      queryClient.setQueryData(
        apiQueryKeys.scripts,
        initialScripts,
      );
    }
  }, [initialScripts]);

  const subscribe = useCallback(
    (listener: () => void) =>
      queryClient.subscribe(
        apiQueryKeys.scripts,
        listener,
      ),
    [],
  );

  const getSnapshot = useCallback(
    (): QuerySnapshot<EnterpriseScript[]> =>
      queryClient.getSnapshot<
        EnterpriseScript[]
      >(apiQueryKeys.scripts),
    [],
  );

  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot,
  );

  const refresh = useCallback(
    async (): Promise<void> => {
      await loadScripts(true);
    },
    [],
  );

  useEffect(() => {
    if (!enabled) {
      return;
    }

    void loadScripts().catch(() => {
      // QueryClient stores the error state.
    });
  }, [enabled]);

  return {
    scripts:
      snapshot.data ??
      initialScripts,

    loading:
      snapshot.status === "loading" &&
      snapshot.data === undefined,

    refreshing:
      snapshot.isFetching &&
      snapshot.data !== undefined,

    error:
      snapshot.status === "error"
        ? getErrorMessage(snapshot.error)
        : "",

    updatedAt:
      snapshot.updatedAt,

    refresh,
  };
}

import {
  useCallback,
  useEffect,
  useSyncExternalStore,
} from "react";

import type {
  EnterpriseProject,
} from "../../enterprise-api";

import {
  queryClient,
  type QuerySnapshot,
} from "../../api/data-engine/QueryClient";

import {
  apiQueryKeys,
} from "../../api/data-engine/queryKeys";

import {
  loadProjects,
} from "./projects-query";

interface UseProjectsQueryOptions {
  initialProjects?: EnterpriseProject[];
  enabled?: boolean;
}

export interface ProjectsQueryResult {
  projects: EnterpriseProject[];
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

  return "تعذر تحميل المشاريع.";
}

export function useProjectsQuery(
  options: UseProjectsQueryOptions = {},
): ProjectsQueryResult {
  const {
    initialProjects = [],
    enabled = true,
  } = options;

  useEffect(() => {
    const cached =
      queryClient.getQueryData<
        EnterpriseProject[]
      >(apiQueryKeys.projects);

    if (
      cached === undefined &&
      initialProjects.length > 0
    ) {
      queryClient.setQueryData(
        apiQueryKeys.projects,
        initialProjects,
      );
    }
  }, [initialProjects]);

  const subscribe = useCallback(
    (listener: () => void) =>
      queryClient.subscribe(
        apiQueryKeys.projects,
        listener,
      ),
    [],
  );

  const getSnapshot = useCallback(
    (): QuerySnapshot<EnterpriseProject[]> =>
      queryClient.getSnapshot<
        EnterpriseProject[]
      >(apiQueryKeys.projects),
    [],
  );

  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot,
  );

  const refresh = useCallback(
    async (): Promise<void> => {
      await loadProjects(true);
    },
    [],
  );

  useEffect(() => {
    if (!enabled) {
      return;
    }

    void loadProjects().catch(() => {
      // QueryClient stores the error state.
    });
  }, [enabled]);

  return {
    projects:
      snapshot.data ??
      initialProjects,

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

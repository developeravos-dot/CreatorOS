import {
  useCallback,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

import type {
  EnterpriseDashboard,
} from "../../enterprise-api";

import {
  queryClient,
  type QuerySnapshot,
} from "../../api/data-engine/QueryClient";

import {
  ENTERPRISE_INTELLIGENCE_QUERY_KEY,
  loadEnterpriseIntelligence,
} from "./enterprise-intelligence-query";

import type {
  EnterpriseIntelligenceSnapshot,
} from "./enterprise-intelligence-types";

export interface EnterpriseIntelligenceResult {
  intelligence:
    | EnterpriseIntelligenceSnapshot
    | undefined;

  loading: boolean;
  refreshing: boolean;
  error: string;
  refresh: () => Promise<void>;
}

export function useEnterpriseIntelligence(
  dashboard: EnterpriseDashboard,
): EnterpriseIntelligenceResult {
  const dashboardSignature =
    useMemo(
      () =>
        JSON.stringify({
          metrics:
            dashboard.metrics,

          system:
            dashboard.system,

          projects:
            dashboard.projects.map(
              (project) => [
                project.id,
                project.status,
              ],
            ),

          scripts:
            dashboard.scripts.map(
              (script) => [
                script.id,
                script.status,
              ],
            ),

          calendar:
            dashboard.calendar.map(
              (item) => [
                item.id,
                item.scheduledAt,
              ],
            ),
        }),
      [dashboard],
    );

  const subscribe =
    useCallback(
      (listener: () => void) =>
        queryClient.subscribe(
          ENTERPRISE_INTELLIGENCE_QUERY_KEY,
          listener,
        ),
      [],
    );

  const getSnapshot =
    useCallback(
      (): QuerySnapshot<EnterpriseIntelligenceSnapshot> =>
        queryClient.getSnapshot<
          EnterpriseIntelligenceSnapshot
        >(
          ENTERPRISE_INTELLIGENCE_QUERY_KEY,
        ),
      [],
    );

  const snapshot =
    useSyncExternalStore(
      subscribe,
      getSnapshot,
      getSnapshot,
    );

  const refresh =
    useCallback(
      async (): Promise<void> => {
        await loadEnterpriseIntelligence(
          dashboard,
          true,
        );
      },
      [
        dashboard,
        dashboardSignature,
      ],
    );

  useEffect(() => {
    void loadEnterpriseIntelligence(
      dashboard,
      true,
    ).catch(() => {
      // QueryClient stores the error.
    });
  }, [
    dashboard,
    dashboardSignature,
  ]);

  return {
    intelligence:
      snapshot.data,

    loading:
      snapshot.status ===
        "loading" &&
      snapshot.data ===
        undefined,

    refreshing:
      snapshot.isFetching &&
      snapshot.data !==
        undefined,

    error:
      snapshot.status === "error"
        ? snapshot.error instanceof Error
          ? snapshot.error.message
          : "تعذر بناء بيانات Enterprise Intelligence."
        : "",

    refresh,
  };
}

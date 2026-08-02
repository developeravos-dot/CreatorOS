import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  EnterpriseDashboard,
} from "../enterprise-api";

import {
  dashboardApi,
} from "../api/services/dashboard";

import {
  isApiError,
} from "../api/core/errors";

import {
  queryClient,
} from "../api/data-engine/QueryClient";

import {
  apiQueryKeys,
} from "../api/data-engine/queryKeys";

import {
  queryPolicies,
} from "../api/data-engine/queryPolicies";

const EMPTY_DASHBOARD: EnterpriseDashboard = {
  projects: [],
  scripts: [],
  calendar: [],
  prompts: [],
  metrics: {
    projects: 0,
    activeProjects: 0,
    scripts: 0,
    scheduledContent: 0,
    prompts: 0,
  },
  system: {
    projectEngine: "unknown",
    scriptEngine: "unknown",
    calendarEngine: "unknown",
    promptEngine: "unknown",
    storage: "unknown",
  },
};

function getErrorMessage(
  error: unknown,
): string {
  if (isApiError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Ã˜Â­Ã˜Â¯Ã˜Â« Ã˜Â®Ã˜Â·Ã˜Â£ Ã˜ÂºÃ™Å Ã˜Â± Ã™â€¦Ã˜ÂªÃ™Ë†Ã™â€šÃ˜Â¹ Ã˜Â£Ã˜Â«Ã™â€ Ã˜Â§Ã˜Â¡ Ã˜Â§Ã™â€žÃ˜Â§Ã˜ÂªÃ˜ÂµÃ˜Â§Ã™â€ž Ã˜Â¨Ã˜Â§Ã™â€žÃ˜Â®Ã˜Â§Ã˜Â¯Ã™â€¦.";
}

export function useCreatorDashboard() {
  const mountedRef = useRef(true);

  const [dashboard, setDashboard] =
    useState<EnterpriseDashboard>(
      EMPTY_DASHBOARD,
    );

  const [connected, setConnected] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [busy, setBusy] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const loadDashboard = useCallback(
    async (force = false): Promise<void> => {
      if (force) {
        queryClient.invalidate(
          apiQueryKeys.enterpriseDashboard,
        );

        queryClient.invalidate(
          apiQueryKeys.enterpriseIntelligence,
        );

        queryClient.invalidate(
          apiQueryKeys.enterpriseHealth,
        );
      }

      setLoading(true);
      setError("");

      try {
        const [
          nextDashboard,
          health,
        ] = await Promise.all([
          queryClient.fetch(
            apiQueryKeys.enterpriseDashboard,
            () => dashboardApi.getDashboard(),
            force ? 0 : queryPolicies.dashboard.staleTime,
          ),
          queryClient.fetch(
            apiQueryKeys.enterpriseHealth,
            () => dashboardApi.getHealth(),
            force ? 0 : queryPolicies.health.staleTime,
          ),
        ]);

        if (!mountedRef.current) {
          return;
        }

        setDashboard(nextDashboard);

        setConnected(
          health.success === true &&
          health.status === "operational",
        );
      } catch (loadError) {
        if (!mountedRef.current) {
          return;
        }

        setConnected(false);

        setError(
          getErrorMessage(loadError),
        );
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [],
  );

  const runAction = useCallback(
    async (
      action: () => Promise<unknown>,
      successMessage: string,
    ): Promise<void> => {
      setBusy(true);
      setError("");
      setMessage("");

      try {
        await action();

        queryClient.invalidate(
          apiQueryKeys.enterpriseDashboard,
        );

        queryClient.invalidate(
          apiQueryKeys.enterpriseIntelligence,
        );

        await loadDashboard(true);

        if (mountedRef.current) {
          setMessage(successMessage);
        }
      } catch (actionError) {
        if (mountedRef.current) {
          setError(
            getErrorMessage(actionError),
          );
        }
      } finally {
        if (mountedRef.current) {
          setBusy(false);
        }
      }
    },
    [loadDashboard],
  );

  useEffect(() => {
    mountedRef.current = true;

    void loadDashboard();

    return () => {
      mountedRef.current = false;
    };
  }, [loadDashboard]);

  return {
    dashboard,
    connected,
    loading,
    busy,
    message,
    error,
    setError,
    setMessage,
    loadDashboard: () =>
      loadDashboard(true),
    runAction,
  };
}

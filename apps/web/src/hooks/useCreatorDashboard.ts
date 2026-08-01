import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  enterpriseApi,
  type EnterpriseDashboard,
} from "../enterprise-api";

import { queryClient } from "../api/data-engine/QueryClient";

const emptyDashboard: EnterpriseDashboard = {
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
    projectEngine: "loading",
    scriptEngine: "loading",
    calendarEngine: "loading",
    promptEngine: "loading",
    storage: "loading",
  },
};

export function useCreatorDashboard() {
  const [dashboard, setDashboard] =
    useState<EnterpriseDashboard>(emptyDashboard);

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

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [health, data] = await Promise.all([
        enterpriseApi.health(),
        queryClient.fetch(
          "dashboard",
          () => enterpriseApi.dashboard(),
          10000,
        ),
      ]);

      setConnected(
        Boolean(health.success) &&
          health.status === "operational",
      );

      setDashboard(data);
    } catch (currentError) {
      setConnected(false);

      setError(
        currentError instanceof Error
          ? currentError.message
          : "تعذر الاتصال بخادم CreatorOS.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const runAction = useCallback(
    async (
      action: () => Promise<unknown>,
      successMessage: string,
    ) => {
      setBusy(true);
      setError("");
      setMessage("");

      try {
        await action();
        setMessage(successMessage);
        queryClient.invalidate("dashboard");

        await loadDashboard();
      } catch (currentError) {
        setError(
          currentError instanceof Error
            ? currentError.message
            : "حدث خطأ غير متوقع.",
        );
      } finally {
        setBusy(false);
      }
    },
    [loadDashboard],
  );

  const clearFeedback = useCallback(() => {
    setMessage("");
    setError("");
  }, []);

  return {
    dashboard,
    connected,
    loading,
    busy,
    message,
    error,
    setError,
    setMessage,
    loadDashboard,
    runAction,
    clearFeedback,
  };
}




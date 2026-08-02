import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  approveAIRuntimeExecution,
  executeAIRuntimeCommand,
  loadAIRuntimeExecutionHistory,
  loadAIStudioRuntime,
  rejectAIRuntimeExecution,
} from "./ai-runtime-client";
import type {
  AIRuntimeCommandAction,
  AIRuntimeExecutionCollection,
  AIStudioRuntimeSnapshot,
} from "./ai-runtime-types";

const AUTO_REFRESH_INTERVAL = 15_000;

const emptyHistory: AIRuntimeExecutionCollection = {
  source: "creatoros-runtime",
  generatedAt: new Date(0).toISOString(),
  total: 0,
  items: [],
};

export function useAIStudioRuntime() {
  const [data, setData] =
    useState<AIStudioRuntimeSnapshot | null>(null);

  const [history, setHistory] =
    useState<AIRuntimeExecutionCollection>(
      emptyHistory,
    );

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pendingProviderId, setPendingProviderId] =
    useState<string | null>(null);

  const [pendingExecutionId, setPendingExecutionId] =
    useState<string | null>(null);

  const activeController =
    useRef<AbortController | null>(null);

  const refreshHistory = useCallback(async () => {
    const result =
      await loadAIRuntimeExecutionHistory();

    setHistory(result);
  }, []);

  const load = useCallback(async (initial = false) => {
    activeController.current?.abort();

    const controller = new AbortController();
    activeController.current = controller;

    if (initial) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    setError(null);

    try {
      const [snapshot, executionHistory] =
        await Promise.all([
          loadAIStudioRuntime(controller.signal),
          loadAIRuntimeExecutionHistory(
            controller.signal,
          ),
        ]);

      setData(snapshot);
      setHistory(executionHistory);
    } catch (caught) {
      if (controller.signal.aborted) {
        return;
      }

      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to load AI Studio Runtime.",
      );
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  const runCommand = useCallback(
    async (
      providerId: string,
      action: AIRuntimeCommandAction,
    ) => {
      setPendingProviderId(providerId);
      setError(null);

      try {
        await executeAIRuntimeCommand({
          providerId,
          action,
          input: {
            source: "ai-studio-runtime-ui",
          },
        });

        await refreshHistory();
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : "Runtime command failed.",
        );
      } finally {
        setPendingProviderId(null);
      }
    },
    [refreshHistory],
  );

  const approveExecution = useCallback(
    async (executionId: string) => {
      setPendingExecutionId(executionId);
      setError(null);

      try {
        await approveAIRuntimeExecution(executionId);
        await refreshHistory();
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : "Approval failed.",
        );
      } finally {
        setPendingExecutionId(null);
      }
    },
    [refreshHistory],
  );

  const rejectExecution = useCallback(
    async (executionId: string) => {
      setPendingExecutionId(executionId);
      setError(null);

      try {
        await rejectAIRuntimeExecution(executionId);
        await refreshHistory();
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : "Rejection failed.",
        );
      } finally {
        setPendingExecutionId(null);
      }
    },
    [refreshHistory],
  );

  useEffect(() => {
    void load(true);

    const intervalId = window.setInterval(() => {
      void load(false);
    }, AUTO_REFRESH_INTERVAL);

    return () => {
      window.clearInterval(intervalId);
      activeController.current?.abort();
    };
  }, [load]);

  return {
    data,
    history,
    loading,
    refreshing,
    error,
    pendingProviderId,
    pendingExecutionId,
    refresh: () => load(false),
    runCommand,
    approveExecution,
    rejectExecution,
  };
}

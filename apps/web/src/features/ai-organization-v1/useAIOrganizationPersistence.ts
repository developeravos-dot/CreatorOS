import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  AIOrganizationState,
} from "./ai-organization-types";

import {
  loadAIOrganizationWorkspace,
  saveAIOrganizationWorkspace,
} from "./ai-organization-persistence-client";

export type AIOrganizationPersistenceStatus =
  | "loading"
  | "ready"
  | "saving"
  | "saved"
  | "error";

interface UseAIOrganizationPersistenceOptions {
  workspaceKey: string;
  fallbackStorageKey: string;
  initialState: AIOrganizationState;
  debounceMs?: number;
}

interface UseAIOrganizationPersistenceResult {
  state: AIOrganizationState;
  setState: React.Dispatch<
    React.SetStateAction<AIOrganizationState>
  >;
  status: AIOrganizationPersistenceStatus;
  error: string | null;
  version: number | null;
  reload: () => Promise<void>;
}

function readLocalFallback(
  storageKey: string,
  initialState: AIOrganizationState,
): AIOrganizationState {
  try {
    const raw =
      window.localStorage.getItem(storageKey);

    if (!raw) {
      return initialState;
    }

    return JSON.parse(raw) as AIOrganizationState;
  } catch {
    return initialState;
  }
}

export function useAIOrganizationPersistence({
  workspaceKey,
  fallbackStorageKey,
  initialState,
  debounceMs = 700,
}: UseAIOrganizationPersistenceOptions): UseAIOrganizationPersistenceResult {
  const [state, setState] =
    useState<AIOrganizationState>(initialState);

  const [status, setStatus] =
    useState<AIOrganizationPersistenceStatus>(
      "loading",
    );

  const [error, setError] =
    useState<string | null>(null);

  const [version, setVersion] =
    useState<number | null>(null);

  const initializedRef = useRef(false);
  const saveTimerRef =
    useRef<number | null>(null);

  const latestStateRef = useRef(state);
  const versionRef = useRef<number | null>(null);

  useEffect(() => {
    latestStateRef.current = state;
  }, [state]);

  useEffect(() => {
    versionRef.current = version;
  }, [version]);

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);

    try {
      const remote =
        await loadAIOrganizationWorkspace(
          workspaceKey,
        );

      if (remote) {
        setState(remote.state);
        setVersion(remote.version);
        initializedRef.current = true;
        setStatus("ready");

        window.localStorage.setItem(
          fallbackStorageKey,
          JSON.stringify(remote.state),
        );

        return;
      }

      const localState = readLocalFallback(
        fallbackStorageKey,
        initialState,
      );

      const created =
        await saveAIOrganizationWorkspace(
          workspaceKey,
          {
            state: localState,
          },
        );

      setState(created.state);
      setVersion(created.version);
      initializedRef.current = true;
      setStatus("saved");

      window.localStorage.setItem(
        fallbackStorageKey,
        JSON.stringify(created.state),
      );
    } catch (loadError) {
      const fallback = readLocalFallback(
        fallbackStorageKey,
        initialState,
      );

      setState(fallback);
      initializedRef.current = true;
      setStatus("error");

      setError(
        loadError instanceof Error
          ? loadError.message
          : "تعذر تحميل منظمة الوكلاء.",
      );
    }
  }, [
    fallbackStorageKey,
    initialState,
    workspaceKey,
  ]);

  useEffect(() => {
    void load();

    return () => {
      if (saveTimerRef.current !== null) {
        window.clearTimeout(
          saveTimerRef.current,
        );
      }
    };
  }, [load]);

  useEffect(() => {
    if (!initializedRef.current) {
      return;
    }

    window.localStorage.setItem(
      fallbackStorageKey,
      JSON.stringify(state),
    );

    if (saveTimerRef.current !== null) {
      window.clearTimeout(
        saveTimerRef.current,
      );
    }

    setStatus("saving");
    setError(null);

    saveTimerRef.current =
      window.setTimeout(async () => {
        try {
          const saved =
            await saveAIOrganizationWorkspace(
              workspaceKey,
              {
                state: latestStateRef.current,
                expectedVersion:
                  versionRef.current ??
                  undefined,
              },
            );

          setVersion(saved.version);
          setStatus("saved");
        } catch (saveError) {
          const statusCode =
            typeof saveError === "object" &&
            saveError !== null &&
            "status" in saveError
              ? Number(
                  (
                    saveError as {
                      status?: unknown;
                    }
                  ).status,
                )
              : null;

          if (statusCode === 409) {
            setError(
              "حدث تعارض في نسخة البيانات. أعد تحميل الصفحة قبل المتابعة.",
            );
          } else {
            setError(
              saveError instanceof Error
                ? saveError.message
                : "تعذر حفظ منظمة الوكلاء.",
            );
          }

          setStatus("error");
        }
      }, debounceMs);

    return () => {
      if (saveTimerRef.current !== null) {
        window.clearTimeout(
          saveTimerRef.current,
        );
      }
    };
  }, [
    debounceMs,
    fallbackStorageKey,
    state,
    workspaceKey,
  ]);

  return {
    state,
    setState,
    status,
    error,
    version,
    reload: load,
  };
}

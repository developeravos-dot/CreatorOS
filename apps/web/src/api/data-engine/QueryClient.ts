import {
  recordQueryDiagnostic,
} from "../../core/observability/query-diagnostics";
export type QueryKey = string;

export type QueryStatus =
  | "idle"
  | "loading"
  | "success"
  | "error";

export interface QueryEntry<T = unknown> {
  data?: T;
  error?: unknown;
  status: QueryStatus;
  updatedAt: number;
  invalidatedAt?: number;
  promise?: Promise<T>;
}

export interface QuerySnapshot<T = unknown> {
  key: QueryKey;
  data?: T;
  error?: unknown;
  status: QueryStatus;
  updatedAt: number;
  isInvalidated: boolean;
  isFetching: boolean;
}

export interface QueryFetchOptions {
  staleTime?: number;
  force?: boolean;
}

export type QueryListener = (
  snapshot: QuerySnapshot,
) => void;

function createIdleEntry(): QueryEntry {
  return {
    status: "idle",
    updatedAt: 0,
  };
}

export class QueryClient {
  private readonly cache =
    new Map<QueryKey, QueryEntry>();

  private readonly listeners =
    new Map<QueryKey, Set<QueryListener>>();

  /**
   * Backward-compatible signature:
   *
   * fetch(key, loader, staleTime)
   *
   * New signature:
   *
   * fetch(key, loader, { staleTime, force })
   */
  async fetch<T>(
    key: QueryKey,
    loader: () => Promise<T>,
    options: number | QueryFetchOptions = 30_000,
  ): Promise<T> {
    const normalizedOptions =
      typeof options === "number"
        ? {
            staleTime: options,
            force: false,
          }
        : {
            staleTime:
              options.staleTime ?? 30_000,
            force: options.force ?? false,
          };

    const now = Date.now();

    const cached =
      this.cache.get(key) as
        | QueryEntry<T>
        | undefined;

    const isInvalidated =
      cached?.invalidatedAt !== undefined &&
      cached.invalidatedAt >= cached.updatedAt;

    const isFresh =
      cached?.data !== undefined &&
      !isInvalidated &&
      now - cached.updatedAt <
        normalizedOptions.staleTime;

    if (
      !normalizedOptions.force &&
      isFresh
    ) {
      return cached.data as T;
    }

    if (
      !normalizedOptions.force &&
      cached?.promise
    ) {
      return cached.promise;
    }

    const promise = loader()
      .then((data) => {
        this.cache.set(key, {
          data,
          status: "success",
          updatedAt: Date.now(),
        });

        this.notify(key);

        return data;
      })
      .catch((error: unknown) => {
        const current =
          this.cache.get(key) as
            | QueryEntry<T>
            | undefined;

        this.cache.set(key, {
          ...current,
          error,
          status: "error",
          updatedAt:
            current?.updatedAt ?? 0,
        });

        this.notify(key);

        throw error;
      })
      .finally(() => {
        const current =
          this.cache.get(key);

        if (current?.promise) {
          const {
            promise: _promise,
            ...entry
          } = current;

          this.cache.set(key, entry);
          this.notify(key);
        }
      });

    this.cache.set(key, {
      ...cached,
      error: undefined,
      status: "loading",
      updatedAt:
        cached?.updatedAt ?? 0,
      promise,
    });

    this.notify(key);

    return promise;
  }

  prefetch<T>(
    key: QueryKey,
    loader: () => Promise<T>,
    options?: number | QueryFetchOptions,
  ): Promise<T> {
    return this.fetch(
      key,
      loader,
      options,
    );
  }

  getQueryData<T>(
    key: QueryKey,
  ): T | undefined {
    return this.cache.get(key)?.data as
      | T
      | undefined;
  }

  setQueryData<T>(
    key: QueryKey,
    updater:
      | T
      | ((
          current: T | undefined,
        ) => T),
  ): T {
    const current =
      this.getQueryData<T>(key);

    const next =
      typeof updater === "function"
        ? (
            updater as (
              value: T | undefined,
            ) => T
          )(current)
        : updater;

    this.cache.set(key, {
      data: next,
      status: "success",
      updatedAt: Date.now(),
    });

    this.notify(key);

    return next;
  }

  getSnapshot<T>(
    key: QueryKey,
  ): QuerySnapshot<T> {
    const entry =
      (this.cache.get(key) as
        | QueryEntry<T>
        | undefined) ??
      createIdleEntry();

    return {
      key,
      data: entry.data as T | undefined,
      error: entry.error,
      status: entry.status,
      updatedAt: entry.updatedAt,
      isInvalidated:
        entry.invalidatedAt !== undefined &&
        entry.invalidatedAt >=
          entry.updatedAt,
      isFetching:
        entry.promise !== undefined,
    };
  }

  invalidate(
    key: QueryKey,
  ): void {
    const current =
      this.cache.get(key);

    if (!current) {
      this.cache.set(key, {
        status: "idle",
        updatedAt: 0,
        invalidatedAt: Date.now(),
      });
    } else {
      this.cache.set(key, {
        ...current,
        invalidatedAt: Date.now(),
      });
    }

    this.notify(key);
  }

  invalidateQueries(
    prefix: string,
  ): void {
    for (
      const key
      of this.cache.keys()
    ) {
      if (key.startsWith(prefix)) {
        this.invalidate(key);
      }
    }
  }

  remove(
    key: QueryKey,
  ): void {
    this.cache.delete(key);
    this.notify(key);
  }

  cancel(
    key: QueryKey,
  ): void {
    const current =
      this.cache.get(key);

    if (!current?.promise) {
      return;
    }

    const {
      promise: _promise,
      ...entry
    } = current;

    this.cache.set(key, {
      ...entry,
      status:
        entry.data === undefined
          ? "idle"
          : "success",
    });

    this.notify(key);
  }

  subscribe(
    key: QueryKey,
    listener: QueryListener,
  ): () => void {
    const listeners =
      this.listeners.get(key) ??
      new Set<QueryListener>();

    listeners.add(listener);
    this.listeners.set(
      key,
      listeners,
    );

    listener(this.getSnapshot(key));

    return () => {
      const current =
        this.listeners.get(key);

      current?.delete(listener);

      if (current?.size === 0) {
        this.listeners.delete(key);
      }
    };
  }

  clear(): void {
    const keys = [
      ...this.cache.keys(),
    ];

    this.cache.clear();

    for (const key of keys) {
      this.notify(key);
    }
  }

  private notify(
    key: QueryKey,
  ): void {
    const listeners =
      this.listeners.get(key);

    if (!listeners) {
      recordQueryDiagnostic(
        this.getSnapshot(key),
      );

      return;
    }

    const snapshot =
      this.getSnapshot(key);

    recordQueryDiagnostic(
      snapshot,
    );

    for (const listener of listeners) {
      listener(snapshot);
    }
  }
}

export const queryClient =
  new QueryClient();

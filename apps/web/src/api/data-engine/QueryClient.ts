export type QueryKey = string;

export interface QueryEntry<T = unknown> {
  data?: T;
  updatedAt: number;
  promise?: Promise<T>;
}

export class QueryClient {

  private cache = new Map<QueryKey, QueryEntry>();

  async fetch<T>(
    key: QueryKey,
    loader: () => Promise<T>,
    staleTime = 30000,
  ): Promise<T> {

    const now = Date.now();

    const cached = this.cache.get(key);

    if (
      cached &&
      cached.data !== undefined &&
      now - cached.updatedAt < staleTime
    ) {
      return cached.data as T;
    }

    if (cached?.promise) {
      return cached.promise as Promise<T>;
    }

    const promise = loader()
      .then((data) => {

        this.cache.set(key, {
          data,
          updatedAt: Date.now(),
        });

        return data;

      })
      .finally(() => {

        const current = this.cache.get(key);

        if (current) {
          delete current.promise;
        }

      });

    this.cache.set(key, {
      ...cached,
      updatedAt: now,
      promise,
    });

    return promise;
  }

  invalidate(key: QueryKey) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

}

export const queryClient = new QueryClient();

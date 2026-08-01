import { useEffect, useState } from "react";
import { queryClient } from "./QueryClient";

export interface UseQueryOptions<T> {
  queryKey: string;
  queryFn: () => Promise<T>;
  staleTime?: number;
}

export function useQuery<T>({
  queryKey,
  queryFn,
  staleTime,
}: UseQueryOptions<T>) {

  const [data, setData] = useState<T | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>();

  useEffect(() => {

    let active = true;

    setLoading(true);

    queryClient
      .fetch(
        queryKey,
        queryFn,
        staleTime,
      )
      .then((result) => {

        if (!active) return;

        setData(result);
        setError(undefined);

      })
      .catch((err) => {

        if (!active) return;

        setError(err);

      })
      .finally(() => {

        if (!active) return;

        setLoading(false);

      });

    return () => {

      active = false;

    };

  }, [queryKey]);

  return {

    data,
    loading,
    error,

    refetch() {

      queryClient.invalidate(queryKey);

      return queryClient.fetch(
        queryKey,
        queryFn,
        staleTime,
      );

    },

  };

}

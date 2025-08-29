"use client";

import { useEffect, useState, useCallback } from "react";

type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export function useFetch<T, A extends unknown[]>(
  fetcher: (...args: A) => Promise<T>,
  args: A = [] as unknown as A
) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const execute = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const result = await fetcher(...args);
      setState({ data: result, loading: false, error: null });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan";
      setState({
        data: null,
        loading: false,
        error: message,
      });
    }
  }, [fetcher, args]); // ✅ no spread, just args reference

  useEffect(() => {
    execute();
  }, [execute]);

  return { ...state, refetch: execute };
}

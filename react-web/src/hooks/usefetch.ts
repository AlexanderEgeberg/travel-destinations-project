import { useCallback, useEffect, useState } from "react";

const useFetch = <T>(
  fetchData: () => Promise<T>,
  dependencies = [],
): {
  data?: T;
  refresh: () => void;
  error?: unknown;
  loading: boolean;
} => {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<unknown | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getData = useCallback(fetchData, dependencies);

  const refresh = useCallback(async () => {
    setLoading(true);

    try {
      const result = await getData();
      setData(result);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }

    // We don't want to include `initialState` in the
    // As that would make the hook refresh every call
  }, [getData]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    data,
    refresh,
    error,
    loading,
  };
};

export default useFetch;

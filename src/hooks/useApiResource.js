import { useCallback, useEffect, useState } from 'react';

/**
 * Ejecuta una función que consume el API Gateway (fetcher) y expone
 * { data, loading, error, refetch }.
 *
 * Si el gateway todavía no está desplegado (o falla la conexión),
 * y se provee `fallbackData`, se usa como demostración visual y se
 * marca `isFallback: true` para que la UI pueda avisar al usuario.
 */
export function useApiResource(fetcher, { deps = [], fallbackData = null } = {}) {
  const [state, setState] = useState({
    data: fallbackData,
    loading: true,
    error: null,
    isFallback: false,
  });

  const run = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const data = await fetcher();
      setState({ data, loading: false, error: null, isFallback: false });
    } catch (err) {
      if (fallbackData !== null) {
        setState({ data: fallbackData, loading: false, error: err, isFallback: true });
      } else {
        setState({ data: null, loading: false, error: err, isFallback: false });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    run();
  }, [run]);

  return { ...state, refetch: run };
}

import React from 'react';
import { api } from './api';

// Example query template hook
export function useQuery<T>(path: string, options?: { enabled?: boolean }) {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(options?.enabled !== false);
  const [error, setError] = React.useState<any>(null);

  React.useEffect(() => {
    if (options?.enabled === false) return;

    setLoading(true);
    api.get<T>(path)
      .then((res) => {
        if (res.success && res.data) {
          setData(res.data);
        } else {
          setError(res.error);
        }
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [path, options?.enabled]);

  return { data, loading, error };
}

// Example mutation template hook
export function useMutation<TVariables, TResponse>(
  method: 'POST' | 'PUT' | 'DELETE',
  path: string
) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<any>(null);

  const mutate = async (variables: TVariables): Promise<TResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (method === 'POST') res = await api.post<TResponse>(path, variables);
      else if (method === 'PUT') res = await api.put<TResponse>(path, variables);
      else res = await api.delete<TResponse>(path);
      
      if (res.success && res.data) {
        return res.data;
      } else {
        setError(res.error);
        return null;
      }
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

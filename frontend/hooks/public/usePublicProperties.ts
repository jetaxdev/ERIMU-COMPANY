import { useEffect, useState } from 'react';
import {
  getProperties,
  PropertyQuery,
  PropertyRecord,
} from '@/services/api/properties';

export function usePublicProperties(query: PropertyQuery = { page: 1, limit: 100 }) {
  const [data, setData] = useState<PropertyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const queryKey = JSON.stringify(query);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getProperties(query)
      .then((result) => setData(result?.data ?? []))
      .catch(() => {
        setData([]);
        setError('Unable to load properties right now.');
      })
      .finally(() => setLoading(false));
  }, [queryKey]);

  return { data, loading, error };
}

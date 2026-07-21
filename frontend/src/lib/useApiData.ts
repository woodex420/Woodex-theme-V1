/**
 * Custom hook to fetch data from the backend API with static data fallback.
 * On mount, tries the API endpoint. If unavailable, falls back to imported static data.
 */
import { useState, useEffect, useRef } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

type FetchOptions = {
  /** Abort controller signal timeout in ms */
  timeout?: number;
};

export function useApiData<T>(
  endpoint: string,
  staticData: T[],
  options?: FetchOptions,
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<T[] | null>(null);

  useEffect(() => {
    // Use cached data if available
    if (cacheRef.current) {
      setData(cacheRef.current);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchData() {
      try {
        if (!API_BASE) {
          // No API configured — use static data immediately
          cacheRef.current = staticData;
          if (!cancelled) {
            setData(staticData);
            setLoading(false);
          }
          return;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), options?.timeout ?? 5000);

        const res = await fetch(`${API_BASE}${endpoint}`, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });
        clearTimeout(timeoutId);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        // API might wrap results in a key (e.g., { services: [...] })
        const list = Array.isArray(json) ? json : (Object.values(json).find(Array.isArray) as T[]) ?? [];

        cacheRef.current = list;
        if (!cancelled) {
          setData(list);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          // Fallback to static data
          cacheRef.current = staticData;
          setData(staticData);
          setError(err instanceof DOMException && err.name === 'AbortError' ? 'Request timed out' : null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [endpoint, options?.timeout]);

  return { data, loading, error };
}

/**
 * Fetch a single item from the API by slug, with static data fallback.
 */
export function useApiItem<T extends { slug?: string }>(
  endpoint: string,
  slug: string | undefined,
  staticData: T[],
  options?: FetchOptions,
) {
  const { data, loading, error } = useApiData<T>(endpoint, staticData, options);

  // Find the item by slug — if data came from the API it uses the same slug field
  const item = slug ? data.find((d) => d.slug === slug) ?? null : null;

  return { item, loading, error };
}

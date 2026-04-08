import useSWR from 'swr';
import type { MALUserStats, MALUserProfile, MALAnimeEntry, MALMangaEntry, MALFavorites } from '@/services/myanimelist';

const fetcher = (url: string) => fetch(url).then(r => {
  if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`);
  return r.json();
});

export function useMALUserStats() {
  const { data, error, isLoading } = useSWR<MALUserStats>('/api/mal/stats', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000, // 1 minute
    errorRetryCount: 3,
  });

  return { stats: data, loading: isLoading, error };
}

export function useMALUserProfile() {
  const { data, error, isLoading } = useSWR<MALUserProfile>('/api/mal/profile', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000, // 1 minute
    errorRetryCount: 3,
  });

  return { profile: data, loading: isLoading, error };
}

export function useMALAnimeList(status?: string) {
  const url = status ? `/api/mal/anime?status=${status}` : `/api/mal/anime`;
  const { data, error, isLoading } = useSWR<MALAnimeEntry[]>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000, // 1 minute
    errorRetryCount: 3,
  });

  return { animeList: data, loading: isLoading, error };
}

export function useMALMangaList(status?: string) {
  const url = status ? `/api/mal/manga?status=${status}` : `/api/mal/manga`;
  const { data, error, isLoading } = useSWR<MALMangaEntry[]>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000, // 1 minute
    errorRetryCount: 3,
  });

  return { mangaList: data, loading: isLoading, error };
}

export function useMALFavorites() {
  const { data, error, isLoading } = useSWR<MALFavorites>('/api/mal/favorites', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000, // 1 minute
    errorRetryCount: 3,
  });

  return { favorites: data, loading: isLoading, error };
}

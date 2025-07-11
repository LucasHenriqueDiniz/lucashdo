import useSWR from 'swr';
import { LastFmUser, LastFmTrack, LastFmArtist } from '@/types/lastfm.types';

const fetcher = (url: string) => fetch(url).then(r => r.json());

// Hook para dados do usuário LastFM
export function useLastFmUser() {
  const { data, error, isLoading, mutate } = useSWR<LastFmUser>('/api/lastfm/user', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 10000, // 10s
    errorRetryCount: 3,
    refreshInterval: 30000, // Revalidar a cada 30 segundos
  });

  return { user: data, isLoading, error, refresh: mutate };
}

// Hook para tracks recentes
export function useLastFmTracks() {
  const { data, error, isLoading, mutate } = useSWR<LastFmTrack[]>('/api/lastfm/tracks', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 5000, // 5s para tracks (mais frequente)
    errorRetryCount: 3,
    refreshInterval: 15000, // Revalidar a cada 15 segundos para tracks
  });

  return { tracks: data, isLoading, error, refresh: mutate };
}

// Hook para artistas
export function useLastFmArtists() {
  const { data, error, isLoading, mutate } = useSWR<LastFmArtist[]>(
    '/api/lastfm/artists',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 10000, // 10s
      errorRetryCount: 3,
      refreshInterval: 30000, // Revalidar a cada 30 segundos
    }
  );

  return { artists: data, isLoading, error, refresh: mutate };
}

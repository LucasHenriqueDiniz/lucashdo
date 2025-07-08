import useSWR from 'swr';
import { LastFmUser, LastFmTrack, LastFmArtist } from '@/types/lastfm.types';

const fetcher = (url: string) => fetch(url).then(r => r.json());

// Hook para dados do usuário LastFM
export function useLastFmUser() {
  const { data, error, isLoading } = useSWR<LastFmUser>('/api/lastfm/user', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 30000,
    errorRetryCount: 3,
  });

  return { user: data, isLoading, error };
}

// Hook para tracks recentes
export function useLastFmTracks() {
  const { data, error, isLoading } = useSWR<LastFmTrack[]>('/api/lastfm/tracks', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000, // 10s para tracks (mais frequente)
    errorRetryCount: 3,
  });

  return { tracks: data, isLoading, error };
}

// Hook para artistas
export function useLastFmArtists() {
  const { data, error, isLoading } = useSWR<LastFmArtist[]>('/api/lastfm/artists', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 30000,
    errorRetryCount: 3,
  });

  return { artists: data, isLoading, error };
}

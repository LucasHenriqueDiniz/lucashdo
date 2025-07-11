import useSWR from 'swr';
import { SteamStats } from '@/services/steam';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useSteamStats() {
  const {
    data: stats,
    error,
    isLoading,
    mutate,
  } = useSWR<SteamStats>('/api/steam/stats', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 30000, // 30s deduping
    errorRetryCount: 3,
    errorRetryInterval: 5000,
    refreshInterval: 120000, // Revalidar a cada 2 minutos
    shouldRetryOnError: true,
    // Sempre ativo, mesmo quando não visível
    isPaused: () => false,
  });

  return {
    stats,
    isLoading,
    error,
    mutate,
  };
}

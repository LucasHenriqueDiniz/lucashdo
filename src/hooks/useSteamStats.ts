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
    dedupingInterval: 30000, // 30s deduping - evita múltiplas chamadas simultâneas
    errorRetryCount: 3,
    errorRetryInterval: 5000,
    // Fallback para dados em cache quando offline
    shouldRetryOnError: true,
  });

  return {
    stats,
    isLoading,
    error,
    mutate, // Para forçar revalidação se necessário
  };
}

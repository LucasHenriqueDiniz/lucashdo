import useSWR from 'swr';
import { LyftaStats } from '@/services/lyfta';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useLyftaStats() {
  const { data, error, isLoading } = useSWR<LyftaStats>('/api/lyfta/stats', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // 1min deduping
    errorRetryCount: 3,
    refreshInterval: 180000, // Revalidar a cada 3 minutos
    // Sempre ativo, mesmo quando não visível
    isPaused: () => false,
  });

  return { stats: data, isLoading, error };
}

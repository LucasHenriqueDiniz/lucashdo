import useSWR from 'swr';
import { LyftaStats } from '@/services/lyfta';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useLyftaStats() {
  const { data, error, isLoading } = useSWR<LyftaStats>('/api/lyfta/stats', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000, // 1min deduping
    errorRetryCount: 3,
  });

  return { stats: data, isLoading, error };
}

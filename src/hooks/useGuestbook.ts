import useSWR from 'swr';

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  username?: string | null;
  is_developer: boolean;
  avatar_url?: string | null;
  created_at: string;
}

type AddEntryData = Omit<GuestbookEntry, 'id' | 'created_at' | 'avatar_url'>;

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useGuestbook() {
  const {
    data: entries,
    error,
    mutate,
  } = useSWR<GuestbookEntry[]>('/api/guestbook', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    refreshInterval: 30000, // Revalidar a cada 30 segundos
    dedupingInterval: 10000, // 10s deduping
    errorRetryCount: 3,
  });

  const addEntry = async (entry: AddEntryData) => {
    console.log('Sending entry:', entry);

    const response = await fetch('/api/guestbook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add entry');
    }

    const newEntry = await response.json();
    mutate(); // Revalidate data
    return newEntry;
  };

  return {
    entries: entries || [],
    isLoading: !error && !entries,
    error,
    addEntry,
  };
}

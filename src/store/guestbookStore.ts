import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GuestbookEntry, AddEntryData } from '@/types/guestbook.types';

interface GuestbookState {
  entries: GuestbookEntry[];
  isLoading: boolean;
  error: string | null;
  lastFetch: number | null;

  // Actions
  fetchEntries: () => Promise<void>;
  addEntry: (entry: AddEntryData) => Promise<GuestbookEntry>;
  clearEntries: () => void;
  setError: (error: string | null) => void;
}

const CACHE_DURATION = 120000;

export const useGuestbookStore = create<GuestbookState>()(
  persist(
    (set, get) => ({
      entries: [],
      isLoading: false,
      error: null,
      lastFetch: null,

      fetchEntries: async () => {
        const state = get();
        const now = Date.now();

        // Se já temos dados e o cache ainda é válido, não faz nova request
        if (state.entries.length > 0 && state.lastFetch && now - state.lastFetch < CACHE_DURATION) {
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await fetch('/api/guestbook');

          if (!response.ok) {
            if (response.status >= 500) {
              throw new Error('SERVICE_UNAVAILABLE');
            }

            const errorData = await response.json().catch(() => null);
            const serverMessage =
              errorData && typeof errorData.error === 'string'
                ? errorData.error
                : 'Erro ao buscar comentários';

            throw new Error(serverMessage);
          }

          const data: GuestbookEntry[] = await response.json();

          set({
            entries: data || [],
            lastFetch: now,
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          set({
            error: 'SERVICE_UNAVAILABLE',
            isLoading: false,
          });
        }
      },

      addEntry: async (entryData: AddEntryData) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch('/api/guestbook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entryData),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Erro ao adicionar comentário');
          }

          const newEntry: GuestbookEntry = await response.json();

          set(state => ({
            entries: [newEntry, ...state.entries],
            isLoading: false,
            error: null,
          }));

          return newEntry;
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Erro ao adicionar comentário';
          const normalizedMessage = /fetch failed/i.test(message) ? 'SERVICE_UNAVAILABLE' : message;

          set({
            error: normalizedMessage,
            isLoading: false,
          });
          throw new Error(normalizedMessage);
        }
      },

      clearEntries: () => set({ entries: [], lastFetch: null }),
      setError: (error: string | null) => set({ error }),
    }),
    {
      name: 'guestbook-storage',
      partialize: state => ({
        entries: state.entries,
        lastFetch: state.lastFetch,
      }),
    }
  )
);

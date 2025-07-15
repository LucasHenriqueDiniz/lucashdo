export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  username?: string | null;
  is_developer: boolean;
  avatar_url?: string | null;
  created_at?: string;
  emoji?: string | null;
}

export type AddEntryData = Omit<GuestbookEntry, 'id' | 'created_at' | 'avatar_url'>;

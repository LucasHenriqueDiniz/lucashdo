// src/lib/supabase/types.ts
export interface Database {
  public: {
    Tables: {
      api_cache: {
        Row: {
          id: string;
          cache_key: string;
          data: Record<string, unknown>;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          cache_key: string;
          data: Record<string, unknown>;
          expires_at: string;
        };
        Update: {
          cache_key?: string;
          data?: Record<string, unknown>;
          expires_at?: string;
        };
      };
      guestbook_entries: {
        Row: {
          id: string;
          name: string;
          message: string;
          github_username: string | null;
          is_developer: boolean;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          name: string;
          message: string;
          github_username?: string | null;
          is_developer?: boolean;
          avatar_url?: string | null;
        };
        Update: {
          name?: string;
          message?: string;
          github_username?: string | null;
          is_developer?: boolean;
          avatar_url?: string | null;
        };
      };
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

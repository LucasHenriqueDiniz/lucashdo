// Cloudflare KV adapter via OpenNext
// Acessa KV binding através de getCloudflareContext()

import { getCloudflareContext } from '@opennextjs/cloudflare';
import { GuestbookEntry } from '@/types/guestbook.types';

export const KV_KEYS = {
  guestbook: 'guestbook_entries',
  cache: (key: string) => `cache:${key}`,
} as const;

// Tipo para o KV binding do Cloudflare
interface CloudflareKV {
  get: (key: string, options?: { type?: 'text' | 'json' | 'arrayBuffer' | 'stream' }) => Promise<any>;
  put: (key: string, value: string | ArrayBuffer | ReadableStream, options?: { expirationTtl?: number }) => Promise<void>;
  delete: (key: string) => Promise<void>;
}

// Fallback em memória para desenvolvimento local
let memoryStore: GuestbookEntry[] = [];

// Helper para acessar o KV binding via OpenNext
function getKVBinding(): CloudflareKV | null {
  try {
    const context = getCloudflareContext();
    return context?.env?.KV as CloudflareKV || null;
  } catch {
    // Durante build ou dev local sem binding
    return null;
  }
}

// Guestbook operations
export const guestbook = {
  async getAll(): Promise<GuestbookEntry[]> {
    const kv = getKVBinding();
    
    if (!kv) {
      // Fallback para desenvolvimento local
      console.warn('KV binding not available, using memory store (dev mode)');
      return memoryStore;
    }

    try {
      const entries = await kv.get(KV_KEYS.guestbook, { type: 'json' });
      return entries || [];
    } catch (error) {
      console.error('Error reading guestbook from KV:', error);
      return [];
    }
  },

  async add(entry: GuestbookEntry): Promise<void> {
    const kv = getKVBinding();
    
    if (!kv) {
      // Fallback para desenvolvimento local
      console.warn('KV binding not available, using memory store (dev mode)');
      memoryStore.unshift(entry);
      memoryStore = memoryStore.slice(0, 50);
      return;
    }

    const entries = await this.getAll();
    entries.unshift(entry);
    
    const trimmed = entries.slice(0, 50);
    
    await kv.put(KV_KEYS.guestbook, JSON.stringify(trimmed));
  },

  async remove(id: string): Promise<void> {
    const kv = getKVBinding();
    
    if (!kv) {
      // Fallback para desenvolvimento local
      console.warn('KV binding not available, using memory store (dev mode)');
      memoryStore = memoryStore.filter(e => e.id !== id);
      return;
    }

    const entries = await this.getAll();
    const filtered = entries.filter(e => e.id !== id);
    
    await kv.put(KV_KEYS.guestbook, JSON.stringify(filtered));
  },
};

// Cache operations
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const kv = getKVBinding();
    if (!kv) return null;

    try {
      const cacheKey = KV_KEYS.cache(key);
      const data = await kv.get(cacheKey, { type: 'json' });
      return data as T | null;
    } catch (error) {
      console.error('Error reading cache from KV:', error);
      return null;
    }
  },

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const kv = getKVBinding();
    if (!kv) return;

    try {
      const cacheKey = KV_KEYS.cache(key);
      await kv.put(cacheKey, JSON.stringify(value), {
        expirationTtl: ttlSeconds,
      });
    } catch (error) {
      console.error('Error writing cache to KV:', error);
    }
  },

  async delete(key: string): Promise<void> {
    const kv = getKVBinding();
    if (!kv) return;

    try {
      const cacheKey = KV_KEYS.cache(key);
      await kv.delete(cacheKey);
    } catch (error) {
      console.error('Error deleting cache from KV:', error);
    }
  },
};

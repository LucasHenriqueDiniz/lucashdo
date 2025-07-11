import { createClient } from './supabase/server';

interface CacheConfig {
  ttl: number; // em segundos
  staleWhileRevalidate?: number;
}

const CACHE_CONFIGS: Record<string, CacheConfig> = {
  'steam:profile': { ttl: 3600, staleWhileRevalidate: 1800 }, // 1h + 30min
  'steam:games': { ttl: 86400, staleWhileRevalidate: 43200 }, // 24h + 12h
  'steam:stats': { ttl: 3600, staleWhileRevalidate: 1800 }, // 1h + 30min
  'lastfm:user': { ttl: 900, staleWhileRevalidate: 300 }, // 15min + 5min
  'lastfm:tracks': { ttl: 120, staleWhileRevalidate: 60 }, // 2min + 1min
  'lastfm:artists': { ttl: 900, staleWhileRevalidate: 300 }, // 15min + 5min
  'lyfta:stats': { ttl: 3600, staleWhileRevalidate: 1800 }, // 1h + 30min
};

export class SupabaseCache {
  private memoryCache = new Map<string, { data: unknown; expires: number }>();

  async get<T>(key: string): Promise<{
    data: T | null;
    isStale: boolean;
    shouldRevalidate: boolean;
  }> {
    // 1. Verificar cache em memória primeiro
    const memCached = this.memoryCache.get(key);
    if (memCached && Date.now() < memCached.expires) {
      return {
        data: memCached.data as T,
        isStale: false,
        shouldRevalidate: false,
      };
    }

    // 2. Buscar no Supabase
    const supabase = await createClient();
    const { data: cacheData, error } = await supabase
      .from('api_cache')
      .select('data, expires_at, created_at')
      .eq('cache_key', key)
      .single();

    if (error || !cacheData) {
      return { data: null, isStale: false, shouldRevalidate: true };
    }

    const now = new Date();
    const expiresAt = new Date(cacheData.expires_at);
    const config = this.getConfig(key);

    const isExpired = now > expiresAt;
    const staleUntil = config.staleWhileRevalidate
      ? new Date(expiresAt.getTime() + config.staleWhileRevalidate * 1000)
      : expiresAt;

    const isStale = now > staleUntil;

    // Adicionar ao cache em memória se ainda válido
    if (!isExpired) {
      this.memoryCache.set(key, {
        data: cacheData.data,
        expires: Math.min(expiresAt.getTime(), Date.now() + 300000),
      });
    }

    return {
      data: cacheData.data as T,
      isStale,
      shouldRevalidate: isExpired, // Corrigido: sempre revalidar se expirou
    };
  }

  async set<T>(key: string, data: T): Promise<void> {
    const config = this.getConfig(key);
    const expiresAt = new Date(Date.now() + config.ttl * 1000);

    try {
      const supabase = await createClient();

      // Tentar upsert primeiro, se falhar, delete e insert
      const { error: upsertError } = await supabase.from('api_cache').upsert(
        {
          cache_key: key,
          data: data as Record<string, unknown>,
          expires_at: expiresAt.toISOString(),
        },
        {
          onConflict: 'cache_key',
        }
      );

      if (upsertError) {
        console.log('Upsert failed, trying delete + insert:', upsertError.message);
        // Se upsert falhar, delete e insert
        await supabase.from('api_cache').delete().eq('cache_key', key);

        const { error: insertError } = await supabase.from('api_cache').insert({
          cache_key: key,
          data: data as Record<string, unknown>,
          expires_at: expiresAt.toISOString(),
        });

        if (insertError) throw insertError;
      }

      this.memoryCache.set(key, {
        data,
        expires: Date.now() + Math.min(config.ttl * 1000, 300000),
      });
    } catch (error) {
      console.error('Erro ao salvar cache:', error);
    }
  }

  async delete(key: string): Promise<void> {
    this.memoryCache.delete(key);
    const supabase = await createClient();
    await supabase.from('api_cache').delete().eq('cache_key', key);
  }

  async cleanup(): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('api_cache')
      .delete()
      .lt('expires_at', new Date().toISOString());

    if (error) console.error('Erro na limpeza do cache:', error);
  }

  private getConfig(key: string): CacheConfig {
    const parts = key.split(':');
    const configKey = `${parts[0]}:${parts[1]}`;
    return CACHE_CONFIGS[configKey] || { ttl: 300 };
  }
}

export const cache = new SupabaseCache();

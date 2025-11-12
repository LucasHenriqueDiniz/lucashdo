import { kv, KV_KEYS } from './kv';
import { logger } from './logger';

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

interface KvCachePayload<T> {
  data: T;
  expiresAt: string;
  staleUntil: string;
}

const MEMORY_MAX_TTL = 300000; // 5 minutes

export class KvBackedCache {
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

    // 2. Buscar no Vercel KV
    const cacheKey = KV_KEYS.cache(key);
    const cacheData = await kv.get<KvCachePayload<T>>(cacheKey);

    if (!cacheData) {
      return { data: null, isStale: false, shouldRevalidate: true };
    }

    const now = new Date();
    const expiresAt = new Date(cacheData.expiresAt);
    const staleUntil = new Date(cacheData.staleUntil);
    const config = this.getConfig(key);

    const isExpired = now.getTime() > expiresAt.getTime();
    const isStale = now.getTime() > staleUntil.getTime();

    // Adicionar ao cache em memória se ainda válido
    if (!isExpired) {
      this.memoryCache.set(key, {
        data: cacheData.data,
        expires: Math.min(expiresAt.getTime(), Date.now() + MEMORY_MAX_TTL),
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
    const staleUntil = config.staleWhileRevalidate
      ? new Date(expiresAt.getTime() + config.staleWhileRevalidate * 1000)
      : expiresAt;

    try {
      const cacheKey = KV_KEYS.cache(key);
      const payload: KvCachePayload<T> = {
        data,
        expiresAt: expiresAt.toISOString(),
        staleUntil: staleUntil.toISOString(),
      };

      const ttlSeconds =
        config.ttl + (config.staleWhileRevalidate ? config.staleWhileRevalidate : 0);

      await kv.set(cacheKey, payload, {
        ex: ttlSeconds,
      });

      this.memoryCache.set(key, {
        data,
        expires: Date.now() + Math.min(config.ttl * 1000, MEMORY_MAX_TTL),
      });
    } catch (error) {
      logger.error('Erro ao salvar cache:', error);
    }
  }

  async delete(key: string): Promise<void> {
    this.memoryCache.delete(key);
    const cacheKey = KV_KEYS.cache(key);
    await kv.del(cacheKey);
  }

  async cleanup(): Promise<void> {
    // Os registros recebem TTL via Vercel KV, então não há limpeza manual necessária.
  }

  private getConfig(key: string): CacheConfig {
    const parts = key.split(':');
    const configKey = `${parts[0]}:${parts[1]}`;
    return CACHE_CONFIGS[configKey] || { ttl: 300 };
  }
}

export const cache = new KvBackedCache();

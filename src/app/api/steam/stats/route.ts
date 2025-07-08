import { NextResponse } from 'next/server';
import { cache } from '@/lib/cache';
import { getSteamStats } from '@/services/steam';

export async function GET() {
  const cacheKey = 'steam:stats:main';

  try {
    // Buscar do cache
    const { data: cachedStats, isStale, shouldRevalidate } = await cache.get(cacheKey);

    // Se tem dados válidos (não stale), retorna imediatamente
    if (cachedStats && !isStale) {
      return NextResponse.json(cachedStats, {
        headers: {
          'Cache-Control': 'public, max-age=1800, stale-while-revalidate=3600',
          'X-Cache-Status': 'HIT',
        },
      });
    }

    // Se deve revalidar ou não tem dados, busca dados frescos
    if (shouldRevalidate || !cachedStats) {
      const freshStats = await getSteamStats();

      // Salva no cache (não await para não bloquear a resposta)
      cache.set(cacheKey, freshStats).catch(console.error);

      return NextResponse.json(freshStats, {
        headers: {
          'Cache-Control': 'public, max-age=1800, stale-while-revalidate=3600',
          'X-Cache-Status': 'REFRESH',
        },
      });
    }

    // Retorna dados stale se disponível
    return NextResponse.json(cachedStats, {
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
        'X-Cache-Status': 'STALE',
      },
    });
  } catch (error) {
    console.error('Erro na API Steam:', error);

    // Fallback: tenta retornar qualquer dado em cache
    const { data: fallbackData } = await cache.get(cacheKey);
    if (fallbackData) {
      return NextResponse.json(fallbackData, {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=60',
          'X-Cache-Status': 'ERROR-FALLBACK',
        },
      });
    }

    return NextResponse.json({ error: 'Serviço temporariamente indisponível' }, { status: 503 });
  }
}

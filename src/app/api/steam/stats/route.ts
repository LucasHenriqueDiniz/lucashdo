import { NextResponse } from 'next/server';
import { cache } from '@/lib/cache';
import { getSteamStats } from '@/services/steam';

export async function GET() {
  const cacheKey = 'steam:stats:main';

  try {
    console.log('📦 Verificando cache Steam...');
    // Buscar do cache
    const { data: cachedStats, isStale, shouldRevalidate } = await cache.get(cacheKey);
    console.log('- Cache Steam encontrado:', !!cachedStats);
    console.log('- Cache Steam stale:', isStale);
    console.log('- Deve revalidar Steam:', shouldRevalidate);

    // Se tem dados válidos e não precisa revalidar, retorna imediatamente
    if (cachedStats && !shouldRevalidate) {
      console.log('✅ Retornando Steam do cache');
      return NextResponse.json(cachedStats, {
        headers: {
          'Cache-Control': 'public, max-age=1800, stale-while-revalidate=3600',
          'X-Cache-Status': isStale ? 'STALE' : 'HIT',
        },
      });
    }

    // Se deve revalidar ou não tem dados, busca dados frescos
    if (shouldRevalidate || !cachedStats) {
      console.log('🔄 Fetching fresh Steam data...');
      const freshStats = await getSteamStats();
      console.log('✅ Steam dados obtidos com sucesso');

      // Salva no cache
      await cache.set(cacheKey, freshStats);

      return NextResponse.json(freshStats, {
        headers: {
          'Cache-Control': 'public, max-age=1800, stale-while-revalidate=3600',
          'X-Cache-Status': 'REFRESH',
        },
      });
    }

    // Retorna dados stale se disponível
    console.log('📦 Retornando Steam do cache (stale)');
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

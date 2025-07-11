import { NextResponse } from 'next/server';
import { cache } from '@/lib/cache';
import { getLyftaStats } from '@/services/lyfta';

export async function GET() {
  const cacheKey = 'lyfta:stats:main';

  try {
    console.log('📦 Verificando cache Lyfta...');
    const { data: cachedData, isStale, shouldRevalidate } = await cache.get(cacheKey);
    console.log('- Cache Lyfta encontrado:', !!cachedData);
    console.log('- Cache Lyfta stale:', isStale);
    console.log('- Deve revalidar Lyfta:', shouldRevalidate);

    if (cachedData && !shouldRevalidate) {
      console.log('✅ Retornando Lyfta do cache');
      return NextResponse.json(cachedData, {
        headers: {
          'Cache-Control': 'public, max-age=1800, stale-while-revalidate=3600',
          'X-Cache-Status': isStale ? 'STALE' : 'HIT',
        },
      });
    }

    if (shouldRevalidate || !cachedData) {
      console.log('🔄 Fetching fresh Lyfta data...');
      const freshData = await getLyftaStats();
      console.log('✅ Lyfta dados obtidos com sucesso');

      await cache.set(cacheKey, freshData);

      return NextResponse.json(freshData, {
        headers: {
          'Cache-Control': 'public, max-age=1800, stale-while-revalidate=3600',
          'X-Cache-Status': 'REFRESH',
        },
      });
    }

    console.log('📦 Retornando Lyfta do cache (stale)');
    return NextResponse.json(cachedData, {
      headers: {
        'Cache-Control': 'public, max-age=900, stale-while-revalidate=1800',
        'X-Cache-Status': 'STALE',
      },
    });
  } catch (error) {
    console.error('Erro na API Lyfta:', error);

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

    return NextResponse.json(
      { error: 'Serviço Lyfta temporariamente indisponível' },
      { status: 503 }
    );
  }
}

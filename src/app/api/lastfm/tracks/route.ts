import { NextResponse } from 'next/server';
import { cache } from '@/lib/cache';
import { getRecentTracks } from '@/services/lastfm';

const LASTFM_USERNAME = process.env.LASTFM_USERNAME ?? 'Amayacrab';

export async function GET() {
  const cacheKey = 'lastfm:tracks:recent';

  try {
    const { data: cachedData, isStale, shouldRevalidate } = await cache.get(cacheKey);

    if (cachedData && !isStale) {
      return NextResponse.json(cachedData, {
        headers: {
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
          'X-Cache-Status': 'HIT',
        },
      });
    }

    if (shouldRevalidate || !cachedData) {
      const freshData = await getRecentTracks(LASTFM_USERNAME, 10);

      cache.set(cacheKey, freshData).catch(console.error);

      return NextResponse.json(freshData, {
        headers: {
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
          'X-Cache-Status': 'REFRESH',
        },
      });
    }

    return NextResponse.json(cachedData, {
      headers: {
        'Cache-Control': 'public, max-age=150, stale-while-revalidate=300',
        'X-Cache-Status': 'STALE',
      },
    });
  } catch (error) {
    console.error('Erro na API LastFM Tracks:', error);

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
      { error: 'Serviço LastFM tracks temporariamente indisponível' },
      { status: 503 }
    );
  }
}

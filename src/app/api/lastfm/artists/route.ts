import { NextResponse } from 'next/server';
import { cache } from '@/lib/cache';
import { getTopArtists } from '@/services/lastfm';

const LASTFM_USERNAME = process.env.LASTFM_USERNAME ?? 'lucasjs7';
const LASTFM_API_KEY = process.env.LASTFM_API_KEY;

export async function GET() {
  const cacheKey = 'lastfm:artists:top';

  // Verificar se as variáveis de ambiente estão configuradas
  if (!LASTFM_API_KEY) {
    console.error('LASTFM_API_KEY não está configurada');
    return NextResponse.json({ error: 'Configuração LastFM incompleta' }, { status: 500 });
  }

  try {
    const { data: cachedData, isStale, shouldRevalidate } = await cache.get(cacheKey);

    if (cachedData && !isStale) {
      return NextResponse.json(cachedData, {
        headers: {
          'Cache-Control': 'public, max-age=900, stale-while-revalidate=1800',
          'X-Cache-Status': 'HIT',
        },
      });
    }

    if (shouldRevalidate || !cachedData) {
      console.log('🔄 Fetching fresh LastFM artists data...');
      const freshData = await getTopArtists(LASTFM_USERNAME, 'overall', 10);

      cache.set(cacheKey, freshData).catch(console.error);

      return NextResponse.json(freshData, {
        headers: {
          'Cache-Control': 'public, max-age=900, stale-while-revalidate=1800',
          'X-Cache-Status': 'REFRESH',
        },
      });
    }

    return NextResponse.json(cachedData, {
      headers: {
        'Cache-Control': 'public, max-age=450, stale-while-revalidate=900',
        'X-Cache-Status': 'STALE',
      },
    });
  } catch (error) {
    console.error('❌ Erro na API LastFM Artists:', error);

    const { data: fallbackData } = await cache.get(cacheKey);
    if (fallbackData) {
      console.log('📦 Retornando dados do cache devido ao erro');
      return NextResponse.json(fallbackData, {
        status: 200,
        headers: {
          'Cache-Control': 'public, max-age=60',
          'X-Cache-Status': 'ERROR-FALLBACK',
        },
      });
    }

    return NextResponse.json(
      { error: 'Serviço LastFM artists temporariamente indisponível' },
      { status: 503 }
    );
  }
}

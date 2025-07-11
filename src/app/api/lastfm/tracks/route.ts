import { NextResponse } from 'next/server';
import { cache } from '@/lib/cache';
import { getRecentTracks } from '@/services/lastfm';

const LASTFM_USERNAME = process.env.LASTFM_USERNAME ?? 'lucasjs7';
const LASTFM_API_KEY = process.env.LASTFM_API_KEY;

export async function GET() {
  const cacheKey = 'lastfm:tracks:recent';

  // Verificar se as variáveis de ambiente estão configuradas
  if (!LASTFM_API_KEY) {
    console.error('LASTFM_API_KEY não está configurada');
    return NextResponse.json({ error: 'Configuração LastFM incompleta' }, { status: 500 });
  }

  try {
    console.log('📦 Verificando cache tracks...');
    const { data: cachedData, isStale, shouldRevalidate } = await cache.get(cacheKey);
    console.log('- Cache tracks encontrado:', !!cachedData);
    console.log('- Cache tracks stale:', isStale);
    console.log('- Deve revalidar tracks:', shouldRevalidate);

    if (cachedData && !shouldRevalidate) {
      console.log('✅ Retornando tracks do cache');
      return NextResponse.json(cachedData, {
        headers: {
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
          'X-Cache-Status': isStale ? 'STALE' : 'HIT',
        },
      });
    }

    if (shouldRevalidate || !cachedData) {
      console.log('🔄 Fetching fresh LastFM tracks data...');
      const freshData = await getRecentTracks(LASTFM_USERNAME, 10);
      console.log('✅ Tracks obtidos com sucesso, total:', freshData?.length || 0);

      await cache.set(cacheKey, freshData);

      return NextResponse.json(freshData, {
        headers: {
          'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
          'X-Cache-Status': 'REFRESH',
        },
      });
    }

    console.log('📦 Retornando tracks do cache (stale)');
    return NextResponse.json(cachedData, {
      headers: {
        'Cache-Control': 'public, max-age=150, stale-while-revalidate=300',
        'X-Cache-Status': 'STALE',
      },
    });
  } catch (error) {
    console.error('❌ Erro na API LastFM Tracks:', error);

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
      { error: 'Serviço LastFM tracks temporariamente indisponível' },
      { status: 503 }
    );
  }
}

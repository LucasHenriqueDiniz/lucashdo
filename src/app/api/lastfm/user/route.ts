import { NextResponse } from 'next/server';
import { cache } from '@/lib/cache';
import { getUserInfo } from '@/services/lastfm';

const LASTFM_USERNAME = process.env.LASTFM_USERNAME ?? 'lucasjs7';
const LASTFM_API_KEY = process.env.LASTFM_API_KEY;

export async function GET() {
  const cacheKey = 'lastfm:user:main';

  console.log('🔍 Debug LastFM User API:');
  console.log('- LASTFM_USERNAME:', LASTFM_USERNAME);
  console.log('- LASTFM_API_KEY:', LASTFM_API_KEY ? '✅ Configurada' : '❌ Não configurada');

  // Verificar se as variáveis de ambiente estão configuradas
  if (!LASTFM_API_KEY) {
    console.error('❌ LASTFM_API_KEY não está configurada');
    return NextResponse.json({ error: 'Configuração LastFM incompleta' }, { status: 500 });
  }

  try {
    console.log('📦 Verificando cache...');
    const { data: cachedData, isStale, shouldRevalidate } = await cache.get(cacheKey);
    console.log('- Cache encontrado:', !!cachedData);
    console.log('- Cache stale:', isStale);
    console.log('- Deve revalidar:', shouldRevalidate);

    if (cachedData && !isStale) {
      console.log('✅ Retornando dados do cache (fresco)');
      return NextResponse.json(cachedData, {
        headers: {
          'Cache-Control': 'public, max-age=900, stale-while-revalidate=1800',
          'X-Cache-Status': 'HIT',
        },
      });
    }

    if (shouldRevalidate || !cachedData) {
      console.log('🔄 Fetching fresh LastFM user data...');
      const freshData = await getUserInfo(LASTFM_USERNAME);
      console.log('✅ Dados obtidos com sucesso');

      cache.set(cacheKey, freshData).catch(console.error);

      return NextResponse.json(freshData, {
        headers: {
          'Cache-Control': 'public, max-age=900, stale-while-revalidate=1800',
          'X-Cache-Status': 'REFRESH',
        },
      });
    }

    console.log('📦 Retornando dados do cache (stale)');
    return NextResponse.json(cachedData, {
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
        'X-Cache-Status': 'STALE',
      },
    });
  } catch (error) {
    console.error('❌ Erro na API LastFM User:', error);

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
      { error: 'Serviço LastFM temporariamente indisponível' },
      { status: 503 }
    );
  }
}

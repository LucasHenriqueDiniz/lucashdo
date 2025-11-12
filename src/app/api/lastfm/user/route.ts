import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { getUserInfo } from '@/services/lastfm';

export const revalidate = 86400; // 24h

const LASTFM_USERNAME = process.env.LASTFM_USERNAME ?? 'lucashdo';
const LASTFM_API_KEY = process.env.LASTFM_API_KEY;

export async function GET() {
  logger.debug('Debug LastFM User API:', {
    username: LASTFM_USERNAME,
    apiKeyConfigured: !!LASTFM_API_KEY,
  });

  // Verificar se as variáveis de ambiente estão configuradas
  if (!LASTFM_API_KEY) {
    logger.error('LASTFM_API_KEY não está configurada');
    return NextResponse.json({ error: 'Configuração LastFM incompleta' }, { status: 500 });
  }

  try {
    logger.debug('Fetching fresh LastFM user data...');
    const data = await getUserInfo(LASTFM_USERNAME);
    logger.debug('Dados obtidos com sucesso', {
      playcount: data.playcount,
      artist_count: data.artist_count,
    });
    return NextResponse.json(data);
  } catch (error) {
    logger.error('Erro na API LastFM User:', error);
    return NextResponse.json(
      { error: 'Serviço LastFM temporariamente indisponível' },
      { status: 503 }
    );
  }
}

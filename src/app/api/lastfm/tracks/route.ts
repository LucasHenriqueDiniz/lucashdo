import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { getRecentTracks } from '@/services/lastfm';

export const revalidate = 86400; // 24h

const LASTFM_USERNAME = process.env.LASTFM_USERNAME ?? 'lucashdo';
const LASTFM_API_KEY = process.env.LASTFM_API_KEY;

export async function GET() {
  // Verificar se as variáveis de ambiente estão configuradas
  if (!LASTFM_API_KEY) {
    logger.error('LASTFM_API_KEY não está configurada');
    return NextResponse.json({ error: 'Configuração LastFM incompleta' }, { status: 500 });
  }

  try {
    logger.debug('Fetching fresh LastFM tracks data...');
    const data = await getRecentTracks(LASTFM_USERNAME, 10);
    logger.debug('Tracks obtidos com sucesso', { total: data?.length || 0 });
    return NextResponse.json(data);
  } catch (error) {
    logger.error('Erro na API LastFM Tracks:', error);
    return NextResponse.json(
      { error: 'Serviço LastFM tracks temporariamente indisponível' },
      { status: 503 }
    );
  }
}

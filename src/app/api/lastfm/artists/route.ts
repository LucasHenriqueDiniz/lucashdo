import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { getTopArtists } from '@/services/lastfm';

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
    logger.debug('Fetching fresh LastFM artists data...');
    const data = await getTopArtists(LASTFM_USERNAME, 'overall', 10);
    return NextResponse.json(data);
  } catch (error) {
    logger.error('Erro na API LastFM Artists:', error);
    return NextResponse.json(
      { error: 'Serviço LastFM artists temporariamente indisponível' },
      { status: 503 }
    );
  }
}

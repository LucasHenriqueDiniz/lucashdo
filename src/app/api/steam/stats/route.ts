import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { getSteamStats } from '@/services/steam';

export const revalidate = 86400; // 24h

export async function GET() {
  try {
    logger.debug('Fetching fresh Steam data...');
    const data = await getSteamStats();
    logger.debug('Steam dados obtidos com sucesso');
    return NextResponse.json(data);
  } catch (error) {
    logger.error('Erro na API Steam:', error);
    return NextResponse.json({ error: 'Serviço temporariamente indisponível' }, { status: 503 });
  }
}

import { NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { getLyftaStats } from '@/services/lyfta';

export const revalidate = 86400; // 24h

export async function GET() {
  try {
    logger.debug('Fetching fresh Lyfta data...');
    const data = await getLyftaStats();
    logger.debug('Lyfta dados obtidos com sucesso');
    return NextResponse.json(data);
  } catch (error) {
    logger.error('Erro na API Lyfta:', error);
    return NextResponse.json(
      { error: 'Serviço Lyfta temporariamente indisponível' },
      { status: 503 }
    );
  }
}

import { NextResponse } from 'next/server';
import { getUserStats } from '@/services/myanimelist';

export const runtime = 'edge';
export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  const username = process.env.NEXT_PUBLIC_MAL_USERNAME;

  if (!username) {
    return NextResponse.json({ error: 'MAL username not configured' }, { status: 500 });
  }

  try {
    const stats = await getUserStats(username);

    if (!stats) {
      return NextResponse.json({ error: 'Failed to fetch MAL stats' }, { status: 404 });
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error('[MAL Stats API] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

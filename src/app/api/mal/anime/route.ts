import { NextRequest, NextResponse } from 'next/server';
import { getUserAnimeList, type MALAnimeStatus } from '@/services/myanimelist';

export const runtime = 'edge';
export const revalidate = 1800; // Cache for 30 minutes

export async function GET(request: NextRequest) {
  const username = process.env.NEXT_PUBLIC_MAL_USERNAME;

  if (!username) {
    return NextResponse.json({ error: 'MAL username not configured' }, { status: 500 });
  }

  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status') as MALAnimeStatus | null;

  try {
    console.log('[MAL API] Fetching anime list for:', username, 'status:', status);
    const animeList = await getUserAnimeList(username, status || undefined);

    if (!animeList) {
      console.error('[MAL API] No anime list returned');
      return NextResponse.json({ error: 'Failed to fetch MAL anime list' }, { status: 404 });
    }

    console.log('[MAL API] Anime list fetched:', animeList.length, 'entries');
    return NextResponse.json(animeList);
  } catch (error) {
    console.error('[MAL API] Error in MAL anime API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getUserMangaList, type MALMangaStatus } from '@/services/myanimelist';

export const runtime = 'edge';
export const revalidate = 1800; // Cache for 30 minutes

export async function GET(request: NextRequest) {
  const username = process.env.NEXT_PUBLIC_MAL_USERNAME;

  if (!username) {
    return NextResponse.json({ error: 'MAL username not configured' }, { status: 500 });
  }

  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get('status') as MALMangaStatus | null;

  try {
    const mangaList = await getUserMangaList(username, status || undefined);

    if (!mangaList) {
      return NextResponse.json({ error: 'Failed to fetch MAL manga list' }, { status: 404 });
    }

    return NextResponse.json(mangaList);
  } catch (error) {
    console.error('Error in MAL manga API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

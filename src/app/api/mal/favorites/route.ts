import { NextResponse } from 'next/server';
import { getUserFavorites } from '@/services/myanimelist';

export const runtime = 'edge';
export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  const username = process.env.NEXT_PUBLIC_MAL_USERNAME;

  if (!username) {
    return NextResponse.json({ error: 'MAL username not configured' }, { status: 500 });
  }

  try {
    const favorites = await getUserFavorites(username);

    if (!favorites) {
      return NextResponse.json({ error: 'Failed to fetch MAL favorites' }, { status: 404 });
    }

    return NextResponse.json(favorites);
  } catch (error) {
    console.error('[MAL Favorites API] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

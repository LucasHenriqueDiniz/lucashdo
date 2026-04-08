import { NextResponse } from 'next/server';
import { getUserProfile } from '@/services/myanimelist';

export const runtime = 'edge';
export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  const username = process.env.NEXT_PUBLIC_MAL_USERNAME;

  if (!username) {
    return NextResponse.json({ error: 'MAL username not configured' }, { status: 500 });
  }

  try {
    const profile = await getUserProfile(username);

    if (!profile) {
      return NextResponse.json({ error: 'Failed to fetch MAL profile' }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error in MAL profile API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

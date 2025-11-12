import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const { tag } = await request.json();
    if (!tag || typeof tag !== 'string') {
      return NextResponse.json({ error: 'Invalid tag' }, { status: 400 });
    }

    revalidateTag(tag, 'max');
    return NextResponse.json({ revalidated: true, tag });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const guestbookSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  message: z.string().min(1).max(500).trim(),
  github_username: z.string().max(39).optional(),
  is_developer: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = guestbookSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validated.error.issues },
        { status: 400 }
      );
    }

    const { name, message, github_username, is_developer } = validated.data;
    const supabase = await createClient();

    // Inserir no Supabase
    const { data, error } = await supabase
      .from('guestbook_entries')
      .insert({
        name,
        message,
        github_username: github_username || null,
        is_developer,
        avatar_url: github_username ? `https://github.com/${github_username}.png` : null,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro no guestbook:', error);
      return NextResponse.json({ error: 'Erro ao salvar mensagem' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Erro no guestbook:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('guestbook_entries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Erro ao buscar guestbook:', error);
    return NextResponse.json({ error: 'Erro ao buscar mensagens' }, { status: 500 });
  }
}

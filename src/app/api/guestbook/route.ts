import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const guestbookSchema = z.object({
  name: z.string().min(1).max(100),
  message: z.string().min(1).max(500),
  username: z.string().optional().nullable(),
  is_developer: z.boolean(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received body:', body);

    const validated = guestbookSchema.safeParse(body);

    if (!validated.success) {
      console.log('Validation failed:', validated.error.issues);
      return NextResponse.json(
        { error: 'Dados inválidos', details: validated.error.issues },
        { status: 400 }
      );
    }

    const { name, message, username, is_developer } = validated.data;
    const supabase = await createClient();

    // Gerar URL do avatar baseado no tipo de usuário
    let avatar_url: string | null = null;
    if (username) {
      if (is_developer) {
        // GitHub avatar
        avatar_url = `https://github.com/${username}.png`;
      } else {
        // Boring avatars para Instagram/visitantes
        avatar_url = `https://source.boringavatars.com/beam/120/${encodeURIComponent(username)}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51`;
      }
    }

    // Inserir no Supabase
    const { data, error } = await supabase
      .from('guestbook_entries')
      .insert({
        name,
        message,
        username: username || null,
        is_developer,
        avatar_url,
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

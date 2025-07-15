import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { rateLimiter, getClientIP } from '@/utils/rateLimiter';
import { containsBlockedTerms, getFoundBlockedTerms } from '@/constants/guestbookBlockedTerms';

const guestbookSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(50, 'Nome muito longo (máximo 50 caracteres)'),
  message: z
    .string()
    .min(1, 'Mensagem é obrigatória')
    .max(280, 'Mensagem muito longa (máximo 280 caracteres)'),
  username: z.string().optional().nullable(),
  is_developer: z.boolean(),
  emoji: z.string().min(1, 'Emoji é obrigatório').max(10),
});

export async function POST(request: NextRequest) {
  try {
    // Verificar rate limiting por IP
    const clientIP = getClientIP(request);
    const rateLimitResult = rateLimiter.check(clientIP);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: rateLimitResult.message,
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.retryAfter?.toString() || '60',
          },
        }
      );
    }

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

    const { name, message, username, is_developer, emoji } = validated.data;

    // Validações adicionais de segurança
    const trimmedName = name.trim();
    const trimmedMessage = message.trim();
    const trimmedUsername = username?.trim();

    // Verificar conteúdo spam/malicioso
    const hasUrls = /https?:\/\//gi.test(trimmedMessage) || /https?:\/\//gi.test(trimmedName);
    const hasRepeatedChars =
      /(.)\1{10,}/gi.test(trimmedMessage) || /(.)\1{10,}/gi.test(trimmedName);
    const hasBlockedTerms =
      containsBlockedTerms(trimmedMessage) || containsBlockedTerms(trimmedName);

    if (hasUrls || hasRepeatedChars || hasBlockedTerms) {
      // Log para debugging em desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        const foundTerms = [
          ...getFoundBlockedTerms(trimmedMessage),
          ...getFoundBlockedTerms(trimmedName),
        ];
        console.log('Spam detected:', {
          hasUrls,
          hasRepeatedChars,
          hasBlockedTerms,
          foundTerms: foundTerms.length > 0 ? foundTerms : undefined,
          message: trimmedMessage,
          name: trimmedName,
        });
      }

      return NextResponse.json({ error: 'Conteúdo não permitido detectado.' }, { status: 400 });
    }

    const supabase = await createClient();

    // Gerar URL do avatar baseado no tipo de usuário
    let avatar_url: string | null = null;
    if (trimmedUsername && is_developer) {
      // GitHub avatar apenas para desenvolvedores com username
      avatar_url = `https://github.com/${trimmedUsername}.png`;
    }
    // Para todos os outros casos (visitantes, sem username, etc.), deixamos null

    // Inserir no Supabase
    const { data, error } = await supabase
      .from('guestbook_entries')
      .insert({
        name: trimmedName,
        message: trimmedMessage,
        username: trimmedUsername || null,
        is_developer,
        avatar_url,
        emoji,
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

import { randomUUID } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from '@/lib/logger';
import { rateLimiter, getClientIP } from '@/utils/rateLimiter';
import { containsBlockedTerms, getFoundBlockedTerms } from '@/constants/guestbookBlockedTerms';
import { GuestbookEntry } from '@/types/guestbook.types';
import { guestbook } from '@/lib/cloudflare-kv';

function normalizeUsername(raw: string | null | undefined, isDeveloper: boolean): string | null {
  if (!raw) return null;

  let value = raw.trim();
  if (!value) return null;

  value = value.replace(/^@+/, '');

  const hasUrlIndicators = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(value) || value.includes('/');

  if (hasUrlIndicators) {
    const candidate = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(value) ? value : `https://${value}`;
    try {
      const url = new URL(candidate);
      const host = url.hostname.toLowerCase();
      const segments = url.pathname.split('/').filter(Boolean);

      if (
        segments.length > 0 &&
        (host.includes('github.com') ||
          host.includes('instagram.com') ||
          host.includes('www.github.com') ||
          host.includes('www.instagram.com'))
      ) {
        value = segments[0];
      }
    } catch {
      // Se não for uma URL válida, ignora
    }
  }

  value = value.replace(/^@+/, '').replace(/\/+$/, '');
  value = value.split('?')[0].split('#')[0];
  value = value.split(/\s+/)[0];

  if (!value) return null;

  try {
    value = decodeURIComponent(value);
  } catch {
    // Ignora erros de decode
  }

  if (isDeveloper) {
    return value.replace(/[^0-9a-zA-Z-]/g, '').slice(0, 39) || null;
  }

  return value;
}

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
    logger.debug('Received guestbook body');

    const validated = guestbookSchema.safeParse(body);

    if (!validated.success) {
      logger.debug('Validation failed:', validated.error.issues);
      return NextResponse.json(
        { error: 'Dados inválidos', details: validated.error.issues },
        { status: 400 }
      );
    }

    const { name, message, username, is_developer, emoji } = validated.data;

    // Validações adicionais de segurança
    const trimmedName = name.trim();
    const trimmedMessage = message.trim();
    const sanitizedUsername = normalizeUsername(username, is_developer);

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
        logger.debug('Spam detected:', {
          hasUrls,
          hasRepeatedChars,
          hasBlockedTerms,
          foundTerms: foundTerms.length > 0 ? foundTerms : undefined,
        });
      }

      return NextResponse.json({ error: 'Conteúdo não permitido detectado.' }, { status: 400 });
    }

    // Gerar URL do avatar baseado no tipo de usuário
    let avatar_url: string | null = null;
    if (sanitizedUsername && is_developer) {
      // GitHub avatar apenas para desenvolvedores com username
      avatar_url = `https://github.com/${sanitizedUsername}.png`;
    }
    // Para todos os outros casos (visitantes, sem username, etc.), deixamos null

    const entry: GuestbookEntry = {
      id: randomUUID(),
      name: trimmedName,
      message: trimmedMessage,
      username: sanitizedUsername,
      is_developer,
      avatar_url,
      emoji,
      created_at: new Date().toISOString(),
    };

    await guestbook.add(entry);

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    logger.error('Erro no guestbook:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const entries = await guestbook.getAll();

    return NextResponse.json(entries, {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    logger.error('Erro ao buscar guestbook:', error);
    return NextResponse.json({ error: 'Erro ao buscar mensagens' }, { status: 500 });
  }
}

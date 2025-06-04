// Middleware para suporte a idiomas via cookie
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { defaultLocale, locales, type Locale } from './lib/i18n/config';
import { COOKIE_NAME } from './lib/i18n/cookies';

export function middleware(request: NextRequest) {
  // Verifica se já tem cookie de idioma
  const locale = request.cookies.get(COOKIE_NAME)?.value || defaultLocale;

  // Se o locale não for válido, use o padrão
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale;

  // Clone a resposta para poder modificá-la
  const response = NextResponse.next();

  // Define o cookie do idioma se ainda não existir
  if (!request.cookies.has(COOKIE_NAME)) {
    response.cookies.set(COOKIE_NAME, validLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 ano
      sameSite: 'lax',
    });
  }

  return response;
}

export const config = {
  // Match com todas as rotas exceto assets estáticos e arquivos do sistema
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};

// Utilitário para gerenciar o idioma nos cookies
'use server';

import { cookies } from 'next/headers';

import { defaultLocale, locales, type Locale } from '@/lib/i18n/config';

import { COOKIE_NAME } from './cookies';

// Função para obter o idioma atual do cookie
export async function getCurrentLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get(COOKIE_NAME);
  const locale = localeCookie?.value || defaultLocale;

  // Verifica se é um locale válido
  return locales.includes(locale as Locale) ? (locale as Locale) : defaultLocale;
}

// Função para definir o idioma no cookie
export async function setLocale(locale: string) {
  // Verifica se o locale é válido
  if (!locales.includes(locale as Locale)) {
    return false;
  }

  // Define o cookie
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 ano
    sameSite: 'lax',
  });

  return true;
}

'use server';
import { cookies } from 'next/headers';

import { COOKIE_NAME, getValidLocale } from './cookies';
import { defaultLocale } from './config';

export async function getLocaleFromCookies(): Promise<string> {
  try {
    // Obter cookies (é uma Promise em next/headers)
    const cookieStore = await cookies();
    const localeCookie = cookieStore.get(COOKIE_NAME);
    const locale = localeCookie?.value || defaultLocale;

    // Verifica se é um locale válido usando a função compartilhada
    return getValidLocale(locale);
  } catch (error) {
    console.error('Error getting locale from cookies:', error);
    return defaultLocale;
  }
}

export async function setServerLocale(locale: string): Promise<string> {
  const validLocale = getValidLocale(locale);

  // Define o cookie
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, validLocale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 ano
    sameSite: 'lax',
  });

  return validLocale;
}

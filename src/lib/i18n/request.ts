import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { locales, type Locale } from './config';

export default getRequestConfig(async ({ locale }) => {
  // Validar se o locale é suportado
  if (!locale || !locales.includes(locale as Locale)) {
    return notFound();
  }

  // Usar o locale validado
  const validLocale = locale;

  // Carregar os messages para o locale
  const messages = (await import(`../../messages/${validLocale}.json`)).default;

  return {
    messages,
    locale: validLocale,
    timeZone: 'America/Sao_Paulo',
    now: new Date(),
  };
});

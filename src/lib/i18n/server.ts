import { getRequestConfig } from 'next-intl/server';

import { getLocaleFromCookies } from './cookies.server';
import { defaultLocale } from './config';

export default getRequestConfig(async ({ locale: _locale }) => {
  try {
    // Obtém o locale dos cookies
    const locale = await getLocaleFromCookies();

    // Carrega as mensagens para o locale
    const messages = (await import(`@/messages/${locale}.json`)).default;

    return {
      messages,
      locale,
      timeZone: 'America/Sao_Paulo',
    };
  } catch (error) {
    console.error('Erro ao carregar o locale:', error);
    const messages = (await import(`@/messages/${defaultLocale}.json`)).default;

    return {
      messages,
      locale: defaultLocale,
      timeZone: 'America/Sao_Paulo',
    };
  }
});

import { getRequestConfig } from 'next-intl/server';

import { getLocaleFromCookies } from '@/lib/i18n/cookies.server';
import { defaultLocale } from '@/lib/i18n/config';

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
      formats: {
        dateTime: {
          short: {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          },
        },
      },
    };
  } catch (error) {
    // Em caso de erro, usa o locale padrão
    const messages = (await import(`@/messages/${defaultLocale}.json`)).default;

    return {
      messages,
      locale: defaultLocale,
      timeZone: 'America/Sao_Paulo',
      formats: {
        dateTime: {
          short: {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          },
        },
      },
    };
  }
});

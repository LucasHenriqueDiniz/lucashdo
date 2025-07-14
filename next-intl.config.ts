import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, locales, type Locale } from '@/lib/i18n/config';

export default getRequestConfig(async ({ locale: _locale }) => {
  const locale = _locale || defaultLocale;
  const validLocale = locales.includes(locale as Locale) ? locale : defaultLocale;

  return {
    locale: validLocale,
    messages: (await import(`@/messages/${validLocale}.json`)).default,
    timeZone: 'America/Sao_Paulo',
  };
});

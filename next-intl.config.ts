import { getRequestConfig } from 'next-intl/server';
import { defaultLocale } from '@/lib/i18n/config';

export default getRequestConfig(async () => {
  return {
    locale: defaultLocale,
    messages: (await import(`@/messages/${defaultLocale}.json`)).default,
    timeZone: 'America/Sao_Paulo',
  };
});

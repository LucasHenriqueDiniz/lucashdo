// Configuração para a internacionalização
export const locales = ['en', 'pt'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'pt';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  pt: 'Português',
};

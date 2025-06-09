// Configuração para a internacionalização
export const locales = ['en', 'pt'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'pt';

export const localeNames: Record<Locale, string> = {
  en: 'English',
  pt: 'Português',
};

// Mapeamento de rotas - todas as rotas são iguais independente do idioma
export const pathnames = {
  '/': '/',
  '/about': '/about',
  '/projects': '/projects',
  '/projects/[id]': '/projects/[id]',
  '/blog': '/blog',
  '/blog/[id]': '/blog/[id]',
  '/gallery': {
    en: '/gallery',
    'pt-BR': '/galeria',
  },
} as const;

// Tipo para os paths
export type Pathnames = typeof pathnames;

// Função para traduzir path
export function getPathname<P extends keyof Pathnames>(path: P, locale: Locale): string {
  const value = pathnames[path];

  if (typeof value === 'string') {
    return value;
  }

  return value[locale];
}

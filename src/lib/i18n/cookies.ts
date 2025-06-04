// Utilitário para gerenciar o idioma
import { defaultLocale, locales, type Locale } from './config';

// Nome do cookie para armazenar o idioma
export const COOKIE_NAME = 'NEXT_LOCALE';

// Essa constante e funções podem ser usadas em componentes client e server
export function getValidLocale(locale: string | undefined): string {
  return locale && locales.includes(locale as Locale) ? locale : defaultLocale;
}

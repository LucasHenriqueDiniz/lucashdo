import { create } from 'zustand';
import { Locale, defaultLocale, locales } from '@/lib/i18n/config';

const LANGUAGE_STORAGE_KEY = 'language-preference';

const isLocale = (value: string | null | undefined): value is Locale => {
  if (!value) return false;
  return (locales as readonly string[]).includes(value);
};

const detectBrowserLocale = (): Locale => {
  if (typeof navigator === 'undefined') {
    return defaultLocale;
  }

  const candidates = [...(navigator.languages ?? []), navigator.language].filter(Boolean);

  for (const candidate of candidates) {
    const normalized = candidate?.split('-')[0]?.toLowerCase();
    if (isLocale(normalized)) {
      return normalized;
    }
  }

  return defaultLocale;
};

interface LanguageState {
  lang: Locale;
  setLang: (lang: Locale) => void;
  hydrate: () => void;
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
  lang: defaultLocale,
  setLang: (lang: Locale) => {
    if (get().lang === lang) return;
    set({ lang });
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    }
  },
  hydrate: () => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isLocale(stored)) {
      if (get().lang !== stored) {
        set({ lang: stored });
      }
      return;
    }

    const detected = detectBrowserLocale();
    if (get().lang !== detected) {
      set({ lang: detected });
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, detected);
    }
  },
}));

export { LANGUAGE_STORAGE_KEY };

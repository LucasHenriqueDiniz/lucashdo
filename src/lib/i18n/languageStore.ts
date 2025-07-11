import { create } from 'zustand';
import { Locale } from './config';

interface LanguageState {
  lang: Locale;
  setLang: (lang: Locale) => void;
}

export const useLanguageStore = create<LanguageState>(set => ({
  lang: 'pt',
  setLang: lang => set({ lang }),
}));

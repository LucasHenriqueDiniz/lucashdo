'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { COOKIE_NAME } from '@/lib/i18n/cookies';
import { locales, type Locale } from '@/lib/i18n/config';

export default function LanguageSwitcher() {
  const [isChanging, setIsChanging] = useState(false);
  const router = useRouter();

  const handleLanguageChange = async (newLocale: string) => {
    if (!locales.includes(newLocale as Locale)) return;

    setIsChanging(true);

    // Define o cookie de idioma
    document.cookie = `${COOKIE_NAME}=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;

    // Atualiza a página
    router.refresh();

    setIsChanging(false);
  };
  // Use useEffect to get language from html attribute after hydration
  const [currentLang, setCurrentLang] = useState<string>('');

  // Set current language after component is mounted
  useEffect(() => {
    setCurrentLang(document.documentElement.lang || 'pt-BR');
  }, []);

  return (
    <div className="relative">
      <button
        disabled={isChanging}
        className="p-2 rounded-md hover:bg-accent disabled:opacity-50 flex items-center"
        onClick={() => handleLanguageChange(currentLang === 'pt-BR' ? 'en' : 'pt-BR')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          <path d="M2 12h20" />
        </svg>
        <span className="ml-2">{currentLang === 'pt-BR' ? 'EN' : 'PT'}</span>
      </button>
    </div>
  );
}

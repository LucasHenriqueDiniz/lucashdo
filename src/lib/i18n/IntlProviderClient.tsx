/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { ReactNode, useEffect, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { useLanguageStore } from '@/store/languageStore';

export function IntlProviderClient({ children }: { children: ReactNode }) {
  const lang = useLanguageStore(state => state.lang);
  const hydrateLanguage = useLanguageStore(state => state.hydrate);
  const [messages, setMessages] = useState<any>(null);

  useEffect(() => {
    hydrateLanguage();
  }, [hydrateLanguage]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', lang);
    }
  }, [lang]);

  useEffect(() => {
    let isMounted = true;
    setMessages(null);
    import(`@/messages/${lang}.json`).then(mod => {
      if (isMounted) setMessages(mod.default);
    });
    return () => {
      isMounted = false;
    };
  }, [lang]);

  if (!messages) return null; // ou um loader/spinner

  return (
    <NextIntlClientProvider key={lang} locale={lang} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

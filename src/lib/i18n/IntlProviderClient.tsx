/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { ReactNode, useEffect, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { useLanguageStore } from '@/lib/i18n/languageStore';

export function IntlProviderClient({ children }: { children: ReactNode }) {
  const lang = useLanguageStore(state => state.lang);
  const [messages, setMessages] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
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

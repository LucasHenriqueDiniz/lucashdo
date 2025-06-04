import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Geist, Geist_Mono } from 'next/font/google';

import { getLocaleFromCookies } from '@/lib/i18n/cookies.server';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Lucas | Portfólio',
    template: '%s | Lucas',
  },
  description: 'Portfólio pessoal com projetos, blog e galeria',
  applicationName: 'Lucas Portfolio',
  authors: [{ name: 'Lucas' }],
  keywords: ['portfolio', 'desenvolvedor', 'designer', 'projetos', 'blog'],
  creator: 'Lucas',
  publisher: 'Lucas',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    alternateLocale: 'en_US',
    title: 'Lucas | Portfólio',
    description: 'Portfólio pessoal com projetos, blog e galeria',
    siteName: 'Lucas Portfolio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Lucas Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lucas | Portfólio',
    description: 'Portfólio pessoal com projetos, blog e galeria',
    creator: '@yourusername',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
    },
  },
  manifest: '/site.webmanifest',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Obtém o idioma do cookie ou usa o padrão
  const locale = await getLocaleFromCookies();

  // Carrega as mensagens para o idioma atual
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

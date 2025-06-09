import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Roboto_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { defaultLocale, locales } from '@/lib/i18n/config';

import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const robotoMono = Roboto_Mono({ subsets: ['latin'], variable: '--font-roboto-mono' });

export const metadata: Metadata = {
  title: {
    default: 'Lucas Hdo - Portfolio',
    template: '%s | Lucas Hdo - Portfolio',
  },
  description:
    'Portfolio website showcasing my projects and skills in web development, software engineering, and creative coding.',
  keywords: [
    'portfolio',
    'web development',
    'software engineer',
    'frontend developer',
    'fullstack developer',
  ],
  authors: [{ name: 'Lucas Hdo' }],
  creator: 'Lucas Hdo',
  publisher: 'Lucas Hdo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
    languages: {
      en: '/en',
      pt: '/pt',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Lucas Hdo - Portfolio',
    description:
      'Portfolio website showcasing my projects and skills in web development, software engineering, and creative coding.',
    siteName: 'Lucas Hdo Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lucas Hdo - Portfolio',
    description:
      'Portfolio website showcasing my projects and skills in web development, software engineering, and creative coding.',
    creator: '@yourtwitterhandle',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification',
  },
};

export function generateStaticParams() {
  return locales.map(locale => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Use default locale if the provided one is invalid
  const validLocale = locales.includes(locale as any) ? locale : defaultLocale;

  let messages;
  try {
    messages = (await import(`@/messages/${validLocale}.json`)).default;
  } catch (error) {
    // Fallback to default locale messages if the requested ones fail to load
    messages = (await import(`@/messages/${defaultLocale}.json`)).default;
  }

  return (
    <html lang={validLocale} suppressHydrationWarning>
      <head>{/* Add any additional head elements here */}</head>
      <body className={`${inter.variable} ${robotoMono.variable} font-sans antialiased`}>
        <NextIntlClientProvider locale={validLocale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

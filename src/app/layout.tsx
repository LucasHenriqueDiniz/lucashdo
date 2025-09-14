import { TooltipProvider } from '@radix-ui/react-tooltip';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import dynamic from 'next/dynamic';
import { Inter, Roboto_Mono } from 'next/font/google';
import { IntlProviderClient } from '@/lib/i18n/IntlProviderClient';
import { GoogleAnalytics } from '@/components/SEO/GoogleAnalytics';
import './globals.css';
import { logo } from '../../public';

const Header = dynamic(() => import('@/components/layout/Header'));
const Footer = dynamic(() => import('@/components/layout/Footer'));

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});
const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://lucashdo.com'),
  title: {
    default: 'Lucas Hdo - Desenvolvedor Full Stack & Designer',
    template: '%s | Lucas Hdo - Portfolio',
  },
  description:
    'Portfólio de Lucas Hdo - Desenvolvedor Full Stack especializado em React, Next.js, TypeScript e design criativo. Projetos inovadores e soluções web modernas.',
  keywords: [
    'desenvolvedor full stack',
    'react developer',
    'next.js',
    'typescript',
    'web development',
    'frontend developer',
    'backend developer',
    'portfolio',
    'lucas hdo',
    'brasil',
    'são paulo',
    'desenvolvimento web',
    'programação',
    'designer',
    'creative coding',
    'software engineering',
  ],
  authors: [
    {
      name: 'Lucas Hdo',
      url: 'https://lucashdo.com',
    },
  ],
  creator: 'Lucas Hdo',
  publisher: 'Lucas Hdo',
  category: 'technology',
  classification: 'portfolio',
  formatDetection: {
    email: true,
    address: false,
    telephone: true,
  },
  alternates: {
    canonical: '/',
    languages: {
      'pt-BR': '/pt-BR',
      en: '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://lucashdo.com',
    siteName: 'Lucas Hdo - Portfolio',
    title: 'Lucas Hdo - Desenvolvedor Full Stack & Designer',
    description:
      'Portfólio de Lucas Hdo - Desenvolvedor Full Stack especializado em React, Next.js, TypeScript e design criativo. Projetos inovadores e soluções web modernas.',
    images: [
      {
        url: logo.src,
        width: 1200,
        height: 630,
        alt: 'Lucas Hdo - Desenvolvedor Full Stack & Designer',
        type: 'image/webp',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@lucashdo',
    creator: '@lucashdo',
    title: 'Lucas Hdo - Desenvolvedor Full Stack & Designer',
    description:
      'Portfólio de Lucas Hdo - Desenvolvedor Full Stack especializado em React, Next.js, TypeScript e design criativo.',
    images: [logo.src],
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
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    yahoo: 'yahoo-verification-code',
  },
  other: {
    'msapplication-TileColor': '#000000',
    'theme-color': '#000000',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="icon" type="image/webp" href="/logo.webp" />
        <link rel="apple-touch-icon" href="/logo.webp" />
      </head>
      <body className={`${inter.variable} ${robotoMono.variable} font-sans antialiased`}>
        <IntlProviderClient>
          <TooltipProvider>
            <Header />
            {children}
            <Footer />
            <SpeedInsights />
            <GoogleAnalytics
              gaId={process.env.NEXT_PUBLIC_GA_ID}
              gtmId={process.env.NEXT_PUBLIC_GTM_ID}
            />
          </TooltipProvider>
        </IntlProviderClient>
      </body>
    </html>
  );
}

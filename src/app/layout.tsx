import { TooltipProvider } from '@radix-ui/react-tooltip';
import type { Metadata, Viewport } from 'next';
import { IntlProviderClient } from '@/lib/i18n/IntlProviderClient';
import { GoogleAnalytics } from '@/components/SEO/GoogleAnalytics';
import AppShell from '@/components/layout/AppShell';
import './globals.css';
import { logo } from '../../public';

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
  metadataBase: new URL('https://www.lucashdo.com'),
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
      url: 'https://www.lucashdo.com',
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
    url: 'https://www.lucashdo.com',
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
  icons: {
    icon: '/logo.webp',
    apple: '/logo.webp',
  },
  manifest: '/site.webmanifest',
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
    google: 'TjTYF3JIy6CpIclGSHBWOmwz_gbk_OOQnV5rI5rM-KI',
  },
  other: {
    'msapplication-TileColor': '#000000',
    'theme-color': '#000000',
    'msvalidate.01': 'FC3E7584A52FA48F6866E5465BF8EFBD',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">
        <IntlProviderClient>
          <TooltipProvider>
            <AppShell>{children}</AppShell>
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

import { TooltipProvider } from '@radix-ui/react-tooltip';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import { IntlProviderClient } from '@/lib/i18n/IntlProviderClient';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
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
  keywords: ['portfolio', 'web development', 'software engineering', 'creative coding'],
  authors: [{ name: 'Lucas Hdo' }],
  creator: 'Lucas Hdo',
  publisher: 'Lucas Hdo',
  formatDetection: {
    email: true,
    address: false,
    telephone: true,
  },
  metadataBase: new URL('https://lucashdo.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Lucas Hdo - Portfolio',
    description:
      'Portfolio website showcasing my projects and skills in web development, software engineering, and creative coding.',
    url: 'https://lucashdo.dev',
    siteName: 'Lucas Hdo - Portfolio',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Lucas Hdo - Portfolio',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lucas Hdo - Portfolio',
    description:
      'Portfolio website showcasing my projects and skills in web development, software engineering, and creative coding.',
    images: ['/logo.png'],
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
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      {/* <head>
        <Script
          src="https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js"
          strategy="beforeInteractive"
        />
        <Script
          id="live2d-widget-cdn"
          src="https://unpkg.com/live2d-widget@3.1.4/lib/L2Dwidget.min.js"
          strategy="beforeInteractive"
        />
      </head> */}
      <body className={`${inter.variable} ${robotoMono.variable} font-sans antialiased`}>
        <IntlProviderClient>
          <TooltipProvider>
            <Header />
            {children}
            <Footer />
            <SpeedInsights />
          </TooltipProvider>
        </IntlProviderClient>
      </body>
    </html>
  );
}

import { TooltipProvider } from '@radix-ui/react-tooltip';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { IntlProviderClient } from '@/lib/i18n/IntlProviderClient';
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <head>{/* Add any additional head elements here */}</head>
      <body className={`${inter.variable} ${robotoMono.variable} font-sans antialiased`}>
        <IntlProviderClient>
          <TooltipProvider delayDuration={100}>
            <Header />
            {children}
            <Footer />
          </TooltipProvider>
        </IntlProviderClient>
        <SpeedInsights />
      </body>
    </html>
  );
}

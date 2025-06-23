import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

// Configure o plugin next-intl
const withNextIntl = createNextIntlPlugin('./src/lib/i18n/server.ts');

const nextConfig: NextConfig = {
  output: 'standalone',
  // Configurações avançadas de imagens
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placeholdr.ai',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
      {
        protocol: 'https',
        hostname: 'lastfm.freetls.fastly.net',
      },
      {
        protocol: 'https',
        hostname: '*.last.fm',
      },
      {
        protocol: 'https',
        hostname: 'avatars.steamstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'media.steampowered.com',
      },
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Configuração de ambiente para produção/desenvolvimento
  env: {
    SITE_URL:
      process.env.NODE_ENV === 'production' ? 'https://www.lucashdo.com' : 'http://localhost:3000',
  },

  // Expor variáveis de ambiente para o cliente
  publicRuntimeConfig: {
    NEXT_PUBLIC_LASTFM_API_KEY: process.env.NEXT_PUBLIC_LASTFM_API_KEY,
    NEXT_PUBLIC_STEAM_API_KEY: process.env.NEXT_PUBLIC_STEAM_API_KEY,
    NEXT_PUBLIC_STEAM_ID: process.env.NEXT_PUBLIC_STEAM_ID,
    NEXT_PUBLIC_LYFTA_API_KEY: process.env.NEXT_PUBLIC_LYFTA_API_KEY,
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ];
  },

  // Performance optimizations
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,

  // Geração de sitemap
  experimental: {
    // O App Router já tem suporte a sitemap.xml
    // https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
  },
};

// Apply the plugin and export
export default withNextIntl(nextConfig);

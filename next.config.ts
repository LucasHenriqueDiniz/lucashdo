import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

// Configure o plugin next-intl
const withNextIntl = createNextIntlPlugin('./src/lib/i18n/server.ts');

const nextConfig: NextConfig = {
  // Configurações avançadas de imagens
  images: {
    domains: ['images.unsplash.com'], // Permitir imagens do Unsplash
    formats: ['image/avif', 'image/webp'],
  },

  // Configuração de ambiente para produção/desenvolvimento
  env: {
    SITE_URL: process.env.NODE_ENV === 'production' ? 'www.lucashdo.com' : 'http://localhost:3000',
  },

  // Geração de sitemap
  experimental: {
    // O App Router já tem suporte a sitemap.xml
    // https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
  },
};

// Apply the plugin and export
export default withNextIntl(nextConfig);

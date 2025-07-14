import { Metadata } from 'next';
import GalleryClient from '@/app/gallery/client';

export const metadata: Metadata = {
  title: 'Galeria | Lucas Hdo - Desenvolvedor Full Stack',
  description:
    'Explore minha galeria de trabalhos visuais, incluindo vetores, logos, modelos Live2D e projetos criativos. Uma coleção de designs e criações digitais.',
  keywords: [
    'galeria lucas hdo',
    'trabalhos visuais',
    'design digital',
    'vetores',
    'logos',
    'live2d',
    'modelos 3d',
    'arte digital',
    'design gráfico',
    'criações visuais',
    'portfolio visual',
    'designer',
    'creative work',
    'digital art',
    'visual projects',
  ],
  openGraph: {
    title: 'Galeria | Lucas Hdo - Desenvolvedor Full Stack',
    description:
      'Explore minha galeria de trabalhos visuais, incluindo vetores, logos, modelos Live2D e projetos criativos.',
    url: 'https://lucashdo.com/gallery',
    siteName: 'Lucas Hdo - Portfolio',
    images: [
      {
        url: '/gallery/live2d/sister/preview.webp',
        width: 1200,
        height: 630,
        alt: 'Galeria - Lucas Hdo Portfolio',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Galeria | Lucas Hdo - Desenvolvedor Full Stack',
    description:
      'Explore minha galeria de trabalhos visuais, incluindo vetores, logos, modelos Live2D e projetos criativos.',
    images: ['/gallery/live2d/sister/preview.webp'],
  },
  alternates: {
    canonical: 'https://lucashdo.com/gallery',
  },
};

export default function GalleryPage() {
  return <GalleryClient />;
}

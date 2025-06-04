import { useTranslations } from 'next-intl';
import { Metadata } from 'next';
import Image from 'next/image';

import MainLayout from '@/components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'A showcase of visual works and photography.',
};

// Dados simulados - Depois será substituído por dados reais de um CMS ou API
const images = [
  {
    id: 1,
    title: 'Urban Architecture',
    description: 'Modern cityscape and architectural details.',
    src: 'https://images.unsplash.com/photo-1470723710355-95304d8aece4?q=80&w=800',
    aspectRatio: 'aspect-[4/3]',
  },
  {
    id: 2,
    title: 'Nature Exploration',
    description: 'Beautiful landscapes and natural wonders.',
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800',
    aspectRatio: 'aspect-square',
  },
  {
    id: 3,
    title: 'Abstract Patterns',
    description: 'Finding patterns in everyday objects and scenes.',
    src: 'https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?q=80&w=800',
    aspectRatio: 'aspect-[3/4]',
  },
  {
    id: 4,
    title: 'Minimalism',
    description: 'Simple compositions with strong visual impact.',
    src: 'https://images.unsplash.com/photo-1476231682828-37e571bc172f?q=80&w=800',
    aspectRatio: 'aspect-[4/3]',
  },
  {
    id: 5,
    title: 'Portraits',
    description: 'Capturing emotions and personality through portraiture.',
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800',
    aspectRatio: 'aspect-square',
  },
  {
    id: 6,
    title: 'Street Photography',
    description: 'Candid moments from urban environments.',
    src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=800',
    aspectRatio: 'aspect-[3/4]',
  },
  {
    id: 7,
    title: 'Experimental',
    description: 'Creative experiments with light and composition.',
    src: 'https://images.unsplash.com/photo-1488554378835-f7acf46e6c98?q=80&w=800',
    aspectRatio: 'aspect-[4/3]',
  },
  {
    id: 8,
    title: 'Product Design',
    description: 'Showcasing product design and photography work.',
    src: 'https://images.unsplash.com/photo-1504274066651-8d31a536b11a?q=80&w=800',
    aspectRatio: 'aspect-square',
  },
];

export default function Gallery() {
  const t = useTranslations('Gallery');

  return (
    <MainLayout>
      <section className="py-16 max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-4">{t('title')}</h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-3xl">{t('description')}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map(image => (
            <div
              key={image.id}
              className={`group relative ${image.aspectRatio} overflow-hidden rounded-xl`}
            >
              <Image
                src={image.src}
                alt={image.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="text-white text-xl font-medium mb-1">{image.title}</h3>
                <p className="text-white/80 text-sm">{image.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}

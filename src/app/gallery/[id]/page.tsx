import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { galleryItems } from '@/constants/gallery';
import GalleryItemClient from '@/app/gallery/[id]/client';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const item = galleryItems.find(i => i.id === id);

  if (!item) {
    return {
      title: 'Item não encontrado | Lucas HDO',
      description: 'O item da galeria que você está procurando não foi encontrado.',
    };
  }

  return {
    title: `${item.title} | Galeria | Lucas HDO`,
    description: item.description.pt,
  };
}

export default async function GalleryItemPage({ params }: PageProps) {
  const { id } = await params;
  const item = galleryItems.find(i => i.id === id);

  if (!item) notFound();
  if (item.type === 'live2d' && !item.live2dModelUrl) {
    notFound();
  }

  return <GalleryItemClient item={item} />;
}

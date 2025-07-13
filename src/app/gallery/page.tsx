import { Metadata } from 'next';
import GalleryClient from '@/app/gallery/client';

export const metadata: Metadata = {
  title: 'Galeria | Lucas HDO',
  description: 'Uma coletânea de trabalhos visuais, vetores, logos e modelos Live2D.',
};

export default function GalleryPage() {
  return <GalleryClient />;
}

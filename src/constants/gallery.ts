export type ArtType = 'vector' | 'logo' | 'drawing' | 'live2d';

export interface ArtItem {
  id: string;
  title: string;
  description: {
    pt: string;
    en: string;
  };
  type: ArtType;
  image: string; // caminho da imagem/thumbnail
  featured?: boolean;
  live2dModelUrl?: string; // para animações
  tags?: string[];
}

export const galleryItems: ArtItem[] = [
  // LOGOS
  {
    id: 'weebprofile-logo',
    title: 'Logo WeebProfile',
    description: {
      pt: 'Logo vetorial para o projeto WeebProfile.',
      en: 'Vector logo for the WeebProfile project.',
    },
    type: 'logo',
    image: '/gallery/logos/weebprofile-logo.png',
    featured: true,
    tags: ['logo', 'vetor'],
  },
  // VECTORS
  {
    id: 'vector-gif-1',
    title: 'GIF Vetorial',
    description: {
      pt: 'GIF vetorial animado.',
      en: 'Animated vector GIF.',
    },
    type: 'vector',
    image: '/gallery/vectors/66300558394.gif',
    tags: ['vetor', 'gif'],
  },
  // LIVE2D
  {
    id: 'shizuku',
    title: 'Shizuku',
    description: {
      pt: 'Modelo Live2D Shizuku.',
      en: 'Live2D model Shizuku.',
    },
    type: 'live2d',
    image: '/gallery/live2d/shizuku/runtime/shizuku.1024/texture_00.png',
    live2dModelUrl: '/gallery/live2d/shizuku/runtime/shizuku.model3.json',
    tags: ['live2d', 'avatar'],
  },
];

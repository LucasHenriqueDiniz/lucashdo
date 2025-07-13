'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { RiArrowLeftLine, RiExternalLinkLine } from 'react-icons/ri';
import { ArtItem } from '@/constants/gallery';

interface GalleryItemClientProps {
  item: ArtItem;
}

export default function GalleryItemClient({ item }: GalleryItemClientProps) {
  return (
    <div className="mt-[110px] min-h-screen ">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors duration-300"
          >
            <RiArrowLeftLine size={20} />
            <span>Voltar para Galeria</span>
          </Link>
        </motion.div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.1)] backdrop-blur-sm">
              {item.type === 'live2d' && item.live2dModelUrl ? (
                <div className="aspect-square flex items-center justify-center bg-[rgba(255,255,255,0.02)]">
                  <div className="text-center">
                    <div className="text-[var(--primary)] text-2xl mb-2">🎭</div>
                    <p className="text-[var(--muted-foreground)]">Live2D Model</p>
                    <p className="text-sm text-[var(--muted-foreground)] mt-1">
                      Implementação em desenvolvimento
                    </p>
                  </div>
                </div>
              ) : (
                <Image
                  src={item.image}
                  alt={item.title}
                  width={600}
                  height={600}
                  className="w-full h-auto object-cover"
                />
              )}
            </div>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-sm bg-[var(--primary)]/10 text-[var(--primary)] px-3 py-1 rounded-full border border-[var(--primary)]/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Type Badge */}
            <div className="inline-block">
              <span className="text-sm bg-gradient-to-r from-[var(--primary)] to-[var(--cyan)] text-white px-4 py-2 rounded-full">
                {item.type === 'vector' && 'Vetor'}
                {item.type === 'logo' && 'Logo'}
                {item.type === 'drawing' && 'Desenho'}
                {item.type === 'live2d' && 'Live2D'}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--cyan)] bg-clip-text text-transparent">
              {item.title}
            </h1>

            {/* Description */}
            <p className="text-lg text-[var(--muted-foreground)] leading-relaxed">
              {item.description.pt}
            </p>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--cyan)] text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[var(--primary)]/25 hover:scale-105"
              >
                <RiArrowLeftLine size={18} />
                Ver Mais Trabalhos
              </Link>

              {item.type === 'live2d' && item.live2dModelUrl && (
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-[rgba(255,255,255,0.05)] text-[var(--foreground)] rounded-xl font-medium border border-[rgba(255,255,255,0.1)] transition-all duration-300 hover:border-[var(--primary)] hover:text-[var(--primary)]">
                  <RiExternalLinkLine size={18} />
                  Ver Modelo Live2D
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

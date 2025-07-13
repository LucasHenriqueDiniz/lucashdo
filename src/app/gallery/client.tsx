'use client';

import { motion } from 'framer-motion';
import GallerySection from '@/components/gallery/GallerySection';
import GalleryShowcase from '@/components/gallery/GalleryShowcase';
import { galleryItems } from '@/constants/gallery';

export default function GalleryClient() {
  const featured = galleryItems.filter(item => item.featured);
  const types = Array.from(new Set(galleryItems.map(item => item.type)));

  return (
    <div className="mt-[110px] min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[var(--primary)] to-[var(--cyan)] bg-clip-text text-transparent mb-4">
            Galeria
          </h1>
          <p className="text-lg md:text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto">
            Uma coletânea de trabalhos visuais, vetores, logos e modelos Live2D.
          </p>
        </motion.div>

        {/* Featured Section */}
        {featured.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-16"
          >
            <GalleryShowcase items={featured} />
          </motion.div>
        )}

        {/* Main Gallery Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <GallerySection items={galleryItems} types={types} />
        </motion.div>
      </div>
    </div>
  );
}

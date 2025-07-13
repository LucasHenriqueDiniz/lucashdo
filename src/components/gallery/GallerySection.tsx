'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArtItem, ArtType } from '@/constants/gallery';
import GalleryTabs from './GalleryTabs';
import GalleryGrid from './GalleryGrid';

interface GallerySectionProps {
  items: ArtItem[];
  types: ArtType[];
}

export default function GallerySection({ items, types }: GallerySectionProps) {
  const [selectedType, setSelectedType] = useState<ArtType | undefined>(undefined);
  const filtered = selectedType ? items.filter(i => i.type === selectedType) : items;

  return (
    <section className="space-y-8">
      <GalleryTabs types={types} selectedType={selectedType} onSelectType={setSelectedType} />

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedType || 'all'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <GalleryGrid items={filtered} />
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

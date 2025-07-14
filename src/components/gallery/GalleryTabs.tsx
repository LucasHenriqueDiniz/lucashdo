'use client';

import { motion } from 'framer-motion';
import { ArtType } from '@/constants/gallery';

interface GalleryTabsProps {
  types: ArtType[];
  selectedType?: ArtType;
  onSelectType?: (type: ArtType) => void;
}

export default function GalleryTabs({ types, selectedType, onSelectType }: GalleryTabsProps) {
  const getTypeLabel = (type: ArtType) => {
    switch (type) {
      case 'vector':
        return 'Vetores';
      case 'logo':
        return 'Logos';
      case 'drawing':
        return 'Desenhos';
      case 'live2d':
        return 'Live2D';
      default:
        return type;
    }
  };

  return (
    <div className="mb-8">
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-[var(--primary)] to-[var(--cyan)] bg-clip-text text-transparent">
          Navegar por Tipo
        </h2>
        <p className="text-[var(--muted-foreground)]">
          Filtre os trabalhos por categoria para encontrar exatamente o que procura.
        </p>
      </motion.div>

      <motion.div
        className="flex flex-wrap justify-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.button
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
            selectedType === undefined
              ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--cyan)] text-white shadow-lg shadow-[var(--primary)]/25'
              : 'bg-[rgba(255,255,255,0.05)] text-[var(--muted-foreground)] border border-[rgba(255,255,255,0.1)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
          }`}
          onClick={() => onSelectType?.(undefined as unknown as ArtType)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Todos os Tipos
        </motion.button>

        {types.map((type, index) => (
          <motion.button
            key={type}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              selectedType === type
                ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--cyan)] text-white shadow-lg shadow-[var(--primary)]/25'
                : 'bg-[rgba(255,255,255,0.05)] text-[var(--muted-foreground)] border border-[rgba(255,255,255,0.1)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
            }`}
            onClick={() => onSelectType?.(type)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
          >
            {getTypeLabel(type)}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArtItem } from '@/constants/gallery';

interface GalleryGridProps {
  items: ArtItem[];
}

export default function GalleryGrid({ items }: GalleryGridProps) {
  if (!items.length) {
    return (
      <motion.div
        className="text-center py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-[var(--muted-foreground)] text-lg">
          Nenhum item encontrado nesta categoria.
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          whileHover={{ y: -5 }}
          className="group"
        >
          <Link href={`/gallery/${item.id}`} className="block">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[rgba(255,255,255,0.03)] to-[rgba(255,255,255,0.01)] border border-[rgba(255,255,255,0.08)] backdrop-blur-sm transition-all duration-300 hover:border-[var(--primary)] hover:shadow-xl hover:shadow-[var(--primary)]/10">
              <div className="relative overflow-hidden rounded-t-xl">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={300}
                  height={200}
                  className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Type badge */}
                <div className="absolute top-3 left-3">
                  <span className="text-xs bg-[var(--primary)]/90 text-white px-2 py-1 rounded-full backdrop-blur-sm">
                    {item.type === 'vector' && 'Vetor'}
                    {item.type === 'logo' && 'Logo'}
                    {item.type === 'drawing' && 'Desenho'}
                    {item.type === 'live2d' && 'Live2D'}
                  </span>
                </div>

                {/* Featured badge */}
                {item.featured && (
                  <div className="absolute top-3 right-3">
                    <span className="text-xs bg-[var(--cyan)]/90 text-white px-2 py-1 rounded-full backdrop-blur-sm">
                      Destaque
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4 space-y-3">
                <h3 className="font-semibold text-lg text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors duration-300 line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] line-clamp-2">
                  {item.description.pt}
                </p>

                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 2).map(tag => (
                      <span
                        key={tag}
                        className="text-xs bg-[var(--primary)]/10 text-[var(--primary)] px-2 py-0.5 rounded-full border border-[var(--primary)]/20"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.tags.length > 2 && (
                      <span className="text-xs text-[var(--muted-foreground)] px-1">
                        +{item.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/10 to-[var(--cyan)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

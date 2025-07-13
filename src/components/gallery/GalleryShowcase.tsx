'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArtItem } from '@/constants/gallery';

interface GalleryShowcaseProps {
  items: ArtItem[];
}

export default function GalleryShowcase({ items }: GalleryShowcaseProps) {
  if (!items.length) return null;

  return (
    <section className="mb-16">
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[var(--primary)] to-[var(--cyan)] bg-clip-text text-transparent">
          Destaques
        </h2>
        <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
          Trabalhos selecionados que representam melhor meu estilo e habilidades.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="group"
          >
            <Link href={`/gallery/${item.id}`} className="block">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.1)] backdrop-blur-sm p-6 transition-all duration-300 hover:border-[var(--primary)] hover:shadow-2xl hover:shadow-[var(--primary)]/20">
                <div className="relative mb-4 overflow-hidden rounded-xl">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div className="space-y-3">
                  <h3 className="font-bold text-xl text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] line-clamp-2">
                    {item.description.pt}
                  </p>

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className="text-xs bg-[var(--primary)]/10 text-[var(--primary)] px-2 py-1 rounded-full border border-[var(--primary)]/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-8 h-8 bg-[var(--primary)] rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

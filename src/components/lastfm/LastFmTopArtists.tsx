'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getTopArtists } from '@/services/lastfm';
import { LastFmArtist } from '@/types/lastfm.types';

interface LastFmTopArtistsProps {
  username: string;
  period?: string;
  limit?: number;
  className?: string;
}

export default function LastFmTopArtists({
  username,
  period = '1month',
  limit = 6,
  className = '',
}: LastFmTopArtistsProps) {
  const [topArtists, setTopArtists] = useState<LastFmArtist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArtists() {
      try {
        setIsLoading(true);
        const artists = await getTopArtists(username, period, limit);
        setTopArtists(artists);
        setError(null);
      } catch (err) {
        setError('Não foi possível carregar os artistas');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchArtists();
  }, [username, period, limit]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const periodLabels = {
    overall: 'De todos os tempos',
    '7day': 'Última semana',
    '1month': 'Último mês',
    '3month': 'Últimos 3 meses',
    '6month': 'Últimos 6 meses',
    '12month': 'Último ano',
  };

  // Get period label
  const periodLabel = periodLabels[period as keyof typeof periodLabels] || periodLabels['1month'];

  return (
    <div className={`lastfm-top-artists ${className}`}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <motion.h3
          className="text-xl font-bold mb-2 flex items-center gap-2"
          variants={itemVariants}
        >
          <svg viewBox="0 0 168 168" className="w-5 h-5 text-red-500 fill-current">
            <path d="M83.996.277C37.747.277.253 37.77.253 84.019c0 46.251 37.494 83.741 83.743 83.741 46.254 0 83.744-37.49 83.744-83.741 0-46.246-37.49-83.738-83.745-83.738l.001-.004zm38.404 120.78a5.217 5.217 0 01-7.18 1.73c-19.662-12.01-44.414-14.73-73.564-8.07a5.222 5.222 0 01-6.249-3.93 5.213 5.213 0 013.926-6.25c31.9-7.291 59.263-4.15 81.337 9.34 2.46 1.51 3.24 4.72 1.73 7.18zm10.25-22.805c-1.89 3.075-5.91 4.045-8.98 2.155-22.51-13.839-56.823-17.846-83.448-9.764-3.453 1.043-7.1-.903-8.148-4.35a6.538 6.538 0 014.354-8.143c30.413-9.228 68.222-4.758 94.072 11.127 3.07 1.89 4.04 5.91 2.15 8.976v-.001zm.88-23.744c-26.99-16.031-71.52-17.505-97.289-9.684-4.138 1.255-8.514-1.081-9.768-5.219a7.835 7.835 0 015.221-9.771c29.581-8.98 78.756-7.245 109.83 11.202a7.823 7.823 0 012.74 10.733c-2.2 3.722-7.02 4.949-10.73 2.739z" />
          </svg>
          Artistas Favoritos
        </motion.h3>

        <motion.p className="text-sm text-gray-500 mb-4" variants={itemVariants}>
          {periodLabel}
        </motion.p>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array(limit)
              .fill(0)
              .map((_, idx) => (
                <div key={idx} className="animate-pulse flex gap-3 items-center p-2 rounded-md">
                  <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
          </div>
        ) : error ? (
          <div className="text-red-500 p-4 rounded-md bg-red-900/20">
            Não foi possível carregar os artistas
          </div>
        ) : !topArtists || topArtists.length === 0 ? (
          <div className="text-gray-500 p-4 rounded-md bg-gray-800/50">
            Nenhum artista encontrado neste período
          </div>
        ) : (
          <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {topArtists.map((artist, index) => {
              const imageUrl =
                artist.image?.find(img => img.size === 'extralarge')?.['#text'] ||
                artist.image?.find(img => img.size === 'mega')?.['#text'] ||
                artist.image?.find(img => img.size === 'large')?.['#text'] ||
                artist.image?.find(img => img.size === 'medium')?.['#text'] ||
                artist.image?.find(img => img.size === 'small')?.['#text'] ||
                (artist.image && artist.image.length > 0
                  ? artist.image[artist.image.length - 1]['#text']
                  : '') ||
                (artist.image && artist.image.length > 0 ? artist.image[0]['#text'] : '') ||
                '';
              return (
                <a
                  key={index}
                  href={artist.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-3 items-center p-2 rounded-md hover:bg-gray-800 transition-colors group"
                >
                  <div className="w-12 h-12 flex-shrink-0">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={artist.name}
                        width={48}
                        height={48}
                        className="object-cover rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="overflow-hidden">
                    <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                      {artist.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {artist.playcount ? parseInt(artist.playcount).toLocaleString() : 0} plays
                    </p>
                  </div>
                </a>
              );
            })}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

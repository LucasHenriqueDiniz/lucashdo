'use client';

import { getRecentTracks, LastFmTrack } from '@/services/lastfm';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MusicalBar } from '@/components/lastfm';
import useSWR from 'swr';

interface LastFmProfileProps {
  username: string;
  className?: string;
}

const recentTracksFetcher = (args: string[]) => {
  const [username, limitStr] = args;
  const limit = parseInt(limitStr);
  return getRecentTracks(username, limit);
};

export default function LastFmProfile({ username, className = '' }: LastFmProfileProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  // Use SWR for better data fetching with caching
  const {
    data: recentTracks,
    error,
    isLoading,
  } = useSWR([`${username}`, '8'], recentTracksFetcher, {
    refreshInterval: 180000, // Refresh every 3 minutes
    revalidateOnFocus: false, // Don't refresh on tab focus
    dedupingInterval: 120000, // 2 minutes - prevent duplicate requests
    revalidateOnMount: true, // Fetch on initial component mount
  });

  // Auto-rotate through tracks
  useEffect(() => {
    if (!recentTracks || recentTracks.length === 0) return;

    const interval = setInterval(() => {
      setCurrentTrackIndex(prev => (prev + 1) % Math.min(5, recentTracks.length));
    }, 5000);

    return () => clearInterval(interval);
  }, [recentTracks]);

  // Get the currently playing or most recent track
  const currentTrack = recentTracks?.length > 0 ? recentTracks[0] : undefined;
  const isPlaying = currentTrack?.date?.uts === undefined;

  // Helper function to get artist name safely
  const getArtistName = (track: LastFmTrack | undefined): string => {
    if (!track) return '';
    return track.artist.name || track.artist['#text'] || '';
  };

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

  return (
    <div className={`lastfm-profile ${className}`}>
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        {/* Music visualization */}
        <div className="w-full md:w-1/3 relative">
          {isLoading ? (
            <div className="h-72 w-full bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse flex items-center justify-center">
              <span className="text-gray-500">Carregando...</span>
            </div>
          ) : error ? (
            <div className="h-72 w-full bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <span className="text-red-500">Falha ao carregar dados musicais</span>
            </div>
          ) : !recentTracks || recentTracks.length === 0 ? (
            <div className="h-72 w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Nenhuma música encontrada</span>
            </div>
          ) : (
            <div className="relative h-72 w-full rounded-lg overflow-hidden">
              {/* Album cover background with blur */}
              {recentTracks[currentTrackIndex]?.image &&
                recentTracks[currentTrackIndex].image[3]['#text'] && (
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={recentTracks[currentTrackIndex].image[3]['#text']}
                      alt="Album background"
                      fill
                      className="object-cover blur-md opacity-50"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />

              {/* Current display track */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`track-${currentTrackIndex}`}
                  className="absolute inset-0 flex flex-col items-center justify-center z-20 p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {recentTracks[currentTrackIndex]?.image &&
                  recentTracks[currentTrackIndex].image[3]['#text'] ? (
                    <motion.div
                      className="relative w-40 h-40 mb-4 shadow-xl rounded-md overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      animate={
                        currentTrackIndex === 0 && isPlaying
                          ? {
                              rotate: [0, 360],
                              transition: {
                                repeat: Infinity,
                                duration: 15,
                                ease: 'linear',
                              },
                            }
                          : {}
                      }
                    >
                      <Image
                        src={recentTracks[currentTrackIndex].image[3]['#text']}
                        alt={`${recentTracks[currentTrackIndex].name} album art`}
                        fill
                        className="object-cover"
                        sizes="160px"
                      />
                    </motion.div>
                  ) : (
                    <div className="w-40 h-40 mb-4 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </div>
                  )}

                  <div className="text-center">
                    <h4 className="font-bold text-lg text-white truncate max-w-[200px]">
                      {recentTracks[currentTrackIndex]?.name}
                    </h4>
                    <p className="text-gray-200 text-sm truncate max-w-[200px]">
                      {getArtistName(recentTracks[currentTrackIndex])}
                    </p>

                    {/* Music bars animation */}
                    {currentTrackIndex === 0 && isPlaying && (
                      <div className="flex items-center justify-center gap-1 mt-2">
                        <MusicalBar delay={0} />
                        <MusicalBar delay={0.2} />
                        <MusicalBar delay={0.1} />
                        <MusicalBar delay={0.3} />
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
              {/* Small indicator dots */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-30">
                {recentTracks.slice(0, 5).map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-2 h-2 rounded-full ${idx === currentTrackIndex ? 'bg-white' : 'bg-white/40'}`}
                    onClick={() => setCurrentTrackIndex(idx)}
                    aria-label={`View track ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Track list */}
        <div className="w-full md:w-2/3">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-1"
          >
            <motion.h3
              className="text-xl font-bold mb-4 flex items-center gap-2"
              variants={itemVariants}
            >
              <svg viewBox="0 0 168 168" className="w-5 h-5 text-red-500 fill-current">
                <path d="M83.996.277C37.747.277.253 37.77.253 84.019c0 46.251 37.494 83.741 83.743 83.741 46.254 0 83.744-37.49 83.744-83.741 0-46.246-37.49-83.738-83.745-83.738l.001-.004zm38.404 120.78a5.217 5.217 0 01-7.18 1.73c-19.662-12.01-44.414-14.73-73.564-8.07a5.222 5.222 0 01-6.249-3.93 5.213 5.213 0 013.926-6.25c31.9-7.291 59.263-4.15 81.337 9.34 2.46 1.51 3.24 4.72 1.73 7.18zm10.25-22.805c-1.89 3.075-5.91 4.045-8.98 2.155-22.51-13.839-56.823-17.846-83.448-9.764-3.453 1.043-7.1-.903-8.148-4.35a6.538 6.538 0 014.354-8.143c30.413-9.228 68.222-4.758 94.072 11.127 3.07 1.89 4.04 5.91 2.15 8.976v-.001zm.88-23.744c-26.99-16.031-71.52-17.505-97.289-9.684-4.138 1.255-8.514-1.081-9.768-5.219a7.835 7.835 0 015.221-9.771c29.581-8.98 78.756-7.245 109.83 11.202a7.823 7.823 0 012.74 10.733c-2.2 3.722-7.02 4.949-10.73 2.739z" />
              </svg>
              O Que Estou Ouvindo
            </motion.h3>
            <div className="space-y-2">
              {!isLoading && !error && recentTracks && recentTracks.length > 0 && (
                <>
                  {/* Currently playing or last played */}
                  {currentTrack && (
                    <motion.div variants={itemVariants} className="mb-3">
                      <p className="text-sm text-gray-500 mb-1">
                        {isPlaying ? 'Tocando agora' : 'Última música'}:
                      </p>
                      <a
                        href={currentTrack.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-800 transition-colors border border-gray-700"
                      >
                        {/* Album art */}
                        <div className="relative w-12 h-12 flex-shrink-0">
                          {currentTrack.image && currentTrack.image[2]['#text'] ? (
                            <Image
                              src={currentTrack.image[2]['#text']}
                              alt={`${currentTrack.name} album art`}
                              width={48}
                              height={48}
                              className="object-cover rounded-md"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <circle cx="12" cy="12" r="10" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            </div>
                          )}

                          {isPlaying && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                          )}
                        </div>

                        {/* Track info */}
                        <div className="overflow-hidden flex-grow">
                          <p className="font-medium truncate">{currentTrack.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {getArtistName(currentTrack)}
                          </p>
                        </div>

                        {/* "Playing now" indicator */}
                        {isPlaying && (
                          <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
                            <MusicalBar delay={0} height="small" />
                            <MusicalBar delay={0.2} height="small" />
                            <MusicalBar delay={0.1} height="small" />
                          </div>
                        )}
                      </a>
                    </motion.div>
                  )}

                  {/* Recent tracks grid */}
                  <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2"
                  >
                    {recentTracks.slice(1, 7).map((track, index) => (
                      <a
                        key={index}
                        href={track.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-md hover:bg-gray-800 transition-colors group"
                      >
                        <div className="flex gap-2 items-center">
                          {/* Small album art */}
                          <div className="w-8 h-8 flex-shrink-0">
                            {track.image && track.image[0]['#text'] ? (
                              <Image
                                src={track.image[0]['#text']}
                                alt=""
                                width={32}
                                height={32}
                                className="object-cover rounded"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <circle cx="12" cy="12" r="10" />
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                              </div>
                            )}
                          </div>

                          {/* Track name */}
                          <div className="overflow-hidden">
                            <p className="text-xs font-medium truncate group-hover:text-primary transition-colors">
                              {track.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {getArtistName(track)}
                            </p>
                          </div>
                        </div>
                      </a>
                    ))}
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>

          {/* Last.fm Profile Link */}
          <motion.div variants={itemVariants} className="mt-4 text-xs text-center">
            <a
              href={`https://www.last.fm/user/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-red-500 transition-colors text-xs flex items-center justify-center gap-1"
            >
              <svg viewBox="0 0 168 168" className="w-3 h-3 fill-current">
                <path d="M83.996.277C37.747.277.253 37.77.253 84.019c0 46.251 37.494 83.741 83.743 83.741 46.254 0 83.744-37.49 83.744-83.741 0-46.246-37.49-83.738-83.745-83.738l.001-.004zm38.404 120.78a5.217 5.217 0 01-7.18 1.73c-19.662-12.01-44.414-14.73-73.564-8.07a5.222 5.222 0 01-6.249-3.93 5.213 5.213 0 013.926-6.25c31.9-7.291 59.263-4.15 81.337 9.34 2.46 1.51 3.24 4.72 1.73 7.18zm10.25-22.805c-1.89 3.075-5.91 4.045-8.98 2.155-22.51-13.839-56.823-17.846-83.448-9.764-3.453 1.043-7.1-.903-8.148-4.35a6.538 6.538 0 014.354-8.143c30.413-9.228 68.222-4.758 94.072 11.127 3.07 1.89 4.04 5.91 2.15 8.976v-.001zm.88-23.744c-26.99-16.031-71.52-17.505-97.289-9.684-4.138 1.255-8.514-1.081-9.768-5.219a7.835 7.835 0 015.221-9.771c29.581-8.98 78.756-7.245 109.83 11.202a7.823 7.823 0 012.74 10.733c-2.2 3.722-7.02 4.949-10.73 2.739z" />
              </svg>
              Ver perfil no Last.fm
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

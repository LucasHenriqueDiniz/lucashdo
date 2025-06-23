'use client';

import type { AnimationGeneratorType } from 'framer-motion';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getRecentTracks, LastFmTrack } from '@/services/lastfm';
import { MusicalBar } from '@/components/lastfm';
interface LastFmProfileProps {
  username: string;
  className?: string;
}

export default function LastFmProfile({ username, className = '' }: LastFmProfileProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [recentTracks, setRecentTracks] = useState<LastFmTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTracks() {
      try {
        setIsLoading(true);
        const tracks = await getRecentTracks(username, 8);
        setRecentTracks(tracks);
        setError(null);
      } catch (err) {
        setError('Falha ao carregar dados musicais');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTracks();
  }, [username]);

  // Auto-rotate through tracks
  useEffect(() => {
    if (!recentTracks || recentTracks.length === 0) return;

    const interval = setInterval(() => {
      setCurrentTrackIndex(prev => (prev + 1) % Math.min(5, recentTracks.length));
    }, 8000);

    return () => clearInterval(interval);
  }, [recentTracks]);

  // Get the currently playing or most recent track
  const currentTrack = recentTracks && recentTracks.length > 0 ? recentTracks[0] : undefined;
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
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as AnimationGeneratorType,
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <div className={`lastfm-profile ${className}`}>
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        {/* Music visualization */}
        <div className="w-full md:w-1/3 relative">
          {isLoading ? (
            <div className="h-72 w-full bg-gray-100 dark:bg-[color:var(--card)] rounded-lg animate-pulse flex items-center justify-center">
              <span className="text-[color:var(--muted-foreground)]">Carregando...</span>
            </div>
          ) : error ? (
            <div className="h-72 w-full bg-red-50 dark:bg-[color:var(--destructive)]/20 rounded-lg flex items-center justify-center">
              <span className="text-[color:var(--destructive)]">
                Falha ao carregar dados musicais
              </span>
            </div>
          ) : !recentTracks || recentTracks.length === 0 ? (
            <div className="h-72 w-full bg-gray-100 dark:bg-[color:var(--card)] rounded-lg flex items-center justify-center">
              <span className="text-[color:var(--muted-foreground)]">
                Nenhuma música encontrada
              </span>
            </div>
          ) : (
            <motion.div
              className="relative h-72 w-full rounded-lg overflow-hidden group"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
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
                )}{' '}
              <motion.div
                className="absolute -top-20 -right-20 w-40 h-40 bg-red-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-30 z-0"
                initial={{ scale: 0.8 }}
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 1 }}
              />
              <motion.div
                className="absolute -bottom-20 left-10 w-40 h-40 bg-[color:var(--primary)]/10 rounded-full blur-3xl opacity-0 group-hover:opacity-30 z-0"
                initial={{ scale: 0.8 }}
                animate={{
                  scale: [0.8, 1.2, 0.8],
                  transition: {
                    repeat: Infinity,
                    duration: 5,
                  },
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 z-0" />
              {/* Current display track */}{' '}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`track-${currentTrackIndex}`}
                  className="absolute inset-0 flex flex-col items-center justify-center z-5 p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {recentTracks[currentTrackIndex]?.image &&
                  recentTracks[currentTrackIndex].image[3]['#text'] ? (
                    <div className="relative w-48 h-48 mb-4">
                      {/* Album Cover (Sleeve) */}
                      <motion.div
                        className="absolute left-0 top-0 w-44 h-44 rounded-md shadow-xl overflow-hidden border border-white/10 z-10"
                        initial={{ x: 0 }}
                        animate={currentTrackIndex === 0 && isPlaying ? { x: -10 } : { x: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Image
                          src={recentTracks[currentTrackIndex].image[3]['#text']}
                          alt={`${recentTracks[currentTrackIndex].name} album art`}
                          fill
                          className="object-cover"
                          sizes="176px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
                      </motion.div>

                      {/* Vinyl Record */}
                      {currentTrackIndex === 0 && isPlaying && (
                        <motion.div
                          className="absolute right-0 w-44 h-44 z-0"
                          initial={{ x: -44 }}
                          animate={{ x: 10 }}
                          transition={{ duration: 3, ease: 'easeOut' }}
                        >
                          <motion.div
                            className="relative w-full h-full"
                            animate={{
                              rotate: 360,
                              transition: {
                                repeat: Infinity,
                                duration: 30,
                                ease: 'linear',
                              },
                            }}
                          >
                            {/* Vinyl Image */}
                            <Image
                              src="/vinyl.webp"
                              alt="Vinyl record"
                              fill
                              className="object-contain"
                              sizes="176px"
                            />{' '}
                          </motion.div>
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <div className="w-44 h-44 mb-4 bg-gray-200 dark:bg-[color:var(--card)] rounded-md flex items-center justify-center">
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
                  <div className="text-center mt-2 relative z-20">
                    <h4 className="font-bold text-lg text-white truncate max-w-[200px] drop-shadow-md mb-1">
                      {recentTracks[currentTrackIndex]?.name}
                    </h4>
                    <div className="flex items-center justify-center gap-1 mt-2 min-h-8">
                      {currentTrackIndex === 0 && isPlaying ? (
                        <>
                          <MusicalBar delay={0} height="small" color="bg-white" />
                          <MusicalBar delay={0.2} height="small" color="bg-white" />
                          <MusicalBar delay={0.1} height="small" color="bg-white" />
                        </>
                      ) : null}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              {/* Small indicator dots */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-30">
                {recentTracks.slice(0, 5).map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-2 h-2 rounded-full ${idx === currentTrackIndex ? 'bg-[color:var(--primary)]' : 'bg-white/40'}`}
                    onClick={() => setCurrentTrackIndex(idx)}
                    aria-label={`View track ${idx + 1}`}
                  />
                ))}
              </div>
            </motion.div>
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
              className="text-xl font-bold mb-4 flex items-center gap-2 relative"
              variants={itemVariants}
            >
              <svg viewBox="0 0 168 168" className="w-5 h-5 text-red-500 fill-current">
                <path d="M83.996.277C37.747.277.253 37.77.253 84.019c0 46.251 37.494 83.741 83.743 83.741 46.254 0 83.744-37.49 83.744-83.741 0-46.246-37.49-83.738-83.745-83.738l.001-.004zm38.404 120.78a5.217 5.217 0 01-7.18 1.73c-19.662-12.01-44.414-14.73-73.564-8.07a5.222 5.222 0 01-6.249-3.93 5.213 5.213 0 013.926-6.25c31.9-7.291 59.263-4.15 81.337 9.34 2.46 1.51 3.24 4.72 1.73 7.18zm10.25-22.805c-1.89 3.075-5.91 4.045-8.98 2.155-22.51-13.839-56.823-17.846-83.448-9.764-3.453 1.043-7.1-.903-8.148-4.35a6.538 6.538 0 014.354-8.143c30.413-9.228 68.222-4.758 94.072 11.127 3.07 1.89 4.04 5.91 2.15 8.976v-.001zm.88-23.744c-26.99-16.031-71.52-17.505-97.289-9.684-4.138 1.255-8.514-1.081-9.768-5.219a7.835 7.835 0 015.221-9.771c29.581-8.98 78.756-7.245 109.83 11.202a7.823 7.823 0 012.74 10.733c-2.2 3.722-7.02 4.949-10.73 2.739z" />
              </svg>
              O Que Estou Ouvindo
              <motion.span
                className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-[color:var(--primary)] to-red-500"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.2, duration: 0.8 }}
              />
            </motion.h3>
            <div className="space-y-2">
              {!isLoading && !error && recentTracks && recentTracks.length > 0 && (
                <>
                  {/* Currently playing or last played */}
                  {currentTrack && (
                    <motion.div
                      variants={itemVariants}
                      className="mb-3"
                      whileHover={{
                        scale: 1.01,
                        backgroundColor: 'rgba(var(--background-rgb), 0.05)',
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                      <p className="text-sm text-[color:var(--muted-foreground)] mb-1">
                        {isPlaying ? 'Tocando agora' : 'Última música'}:
                      </p>
                      <Link
                        href={currentTrack.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-[color:var(--card)] transition-colors border border-[color:var(--border)]"
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
                            <div className="w-12 h-12 bg-gray-200 dark:bg-[color:var(--card)] rounded-md flex items-center justify-center">
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
                          <p className="text-sm text-[color:var(--muted-foreground)] truncate">
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
                      </Link>
                    </motion.div>
                  )}

                  {/* Recent tracks grid with improved styling */}
                  <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-2 p-3 rounded-md bg-[color:var(--card)]/30"
                  >
                    {recentTracks.slice(1, 7).map((track, index) => (
                      <motion.a
                        key={index}
                        href={track.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-md hover:bg-[color:var(--card)]/70 transition-colors group"
                        whileHover={{ scale: 1.03 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
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
                              <div className="w-8 h-8 bg-gray-200 dark:bg-[color:var(--card)] rounded flex items-center justify-center">
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
                            <p className="text-xs font-medium truncate group-hover:text-[color:var(--primary)] transition-colors">
                              {track.name}
                            </p>
                            <p className="text-xs text-[color:var(--muted-foreground)] truncate">
                              {getArtistName(track)}
                            </p>
                          </div>
                        </div>
                      </motion.a>
                    ))}
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

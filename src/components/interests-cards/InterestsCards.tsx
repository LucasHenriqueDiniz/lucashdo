'use client';

import { MusicalBar } from '@/components/MusicalBar';
import { useLastFmArtists, useLastFmTracks, useLastFmUser } from '@/hooks/useLastFm';
import { useLyftaStats } from '@/hooks/useLyfta';
import { useSteamStats } from '@/hooks/useSteamStats';
import { useMALUserStats, useMALAnimeList, useMALFavorites } from '@/hooks/useMyAnimeList';
import type { LyftaExercise, LyftaWorkout } from '@/services/lyfta';
import type { SteamGame } from '@/services/steam';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
  ChevronRight,
  Disc3,
  Dumbbell,
  Flame,
  Gamepad2,
  Medal,
  Music,
  TrendingUp,
  MessageCircle,
  Activity,
  Tv,
  BookOpen,
  Star,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { vinylDisk } from '../../../public';
import DiscordCard from '@/components/DiscordCard/DiscordCard';

type TabId = 'music' | 'fitness' | 'gaming' | 'discord' | 'anime';

// Variantes de animação para transições suaves
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      type: 'spring',
      stiffness: 100,
      damping: 15,
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3, ease: 'easeIn' },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      type: 'spring',
      stiffness: 150,
      damping: 12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      type: 'spring',
      stiffness: 200,
      damping: 15,
    },
  },
};

// Componente de Loading State
const LoadingState = ({ color }: { color: string }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex items-center justify-center h-full min-h-[400px]"
  >
    <div className="text-center space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`mx-auto h-12 w-12 rounded-full border-4 border-t-transparent ${color}`}
      />
      <p className="text-sm text-gray-500 dark:text-gray-400">Carregando...</p>
    </div>
  </motion.div>
);

// Componente de Error State
const ErrorState = ({ message, color }: { message: string; color: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex items-center justify-center h-full min-h-[400px]"
  >
    <div className="text-center space-y-4 max-w-md">
      <div className={`mx-auto h-16 w-16 rounded-full ${color} bg-opacity-10 flex items-center justify-center`}>
        <Activity className={`h-8 w-8 ${color}`} />
      </div>
      <p className={`text-sm ${color}`}>{message}</p>
    </div>
  </motion.div>
);

// Componente de Service Badge
const ServiceBadge = ({ 
  name, 
  icon: Icon, 
  color 
}: { 
  name: string; 
  icon: LucideIcon; 
  color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 15 }}
    className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${color} backdrop-blur-sm`}
  >
    <Icon className="h-3.5 w-3.5" />
    <span className="uppercase tracking-[0.15em]">{name}</span>
  </motion.div>
);

const colorPalette: Record<
  TabId,
  {
    accent: string;
    accentSoft: string;
    border: string;
    ring: string;
    iconBg: string;
    chipBg: string;
    chipText: string;
    surfaceGradient: string;
    progressGradient: string;
    glow: string;
  }
> = {
  music: {
    accent: 'text-amber-400',
    accentSoft: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    ring: 'ring-amber-500/30',
    iconBg: 'bg-amber-500/15',
    chipBg: 'bg-amber-500/15',
    chipText: 'text-amber-300',
    surfaceGradient: 'from-amber-500/20 via-amber-500/5 to-transparent',
    progressGradient: 'from-amber-400 to-orange-500',
    glow: 'shadow-[0_0_45px_-15px_rgba(245,158,11,0.6)]',
  },
  fitness: {
    accent: 'text-emerald-400',
    accentSoft: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    ring: 'ring-emerald-500/20',
    iconBg: 'bg-emerald-500/15',
    chipBg: 'bg-emerald-500/15',
    chipText: 'text-emerald-200',
    surfaceGradient: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
    progressGradient: 'from-emerald-400 to-lime-400',
    glow: 'shadow-[0_0_45px_-15px_rgba(16,185,129,0.6)]',
  },
  gaming: {
    accent: 'text-cyan-400',
    accentSoft: 'bg-cyan-500/10',
    border: 'border-cyan-500/20',
    ring: 'ring-cyan-500/20',
    iconBg: 'bg-cyan-500/15',
    chipBg: 'bg-cyan-500/15',
    chipText: 'text-cyan-200',
    surfaceGradient: 'from-cyan-500/20 via-cyan-500/5 to-transparent',
    progressGradient: 'from-cyan-400 to-sky-500',
    glow: 'shadow-[0_0_45px_-15px_rgba(6,182,212,0.6)]',
  },
  discord: {
    accent: 'text-indigo-400',
    accentSoft: 'bg-indigo-500/10',
    border: 'border-indigo-500/20',
    ring: 'ring-indigo-500/20',
    iconBg: 'bg-indigo-500/15',
    chipBg: 'bg-indigo-500/15',
    chipText: 'text-indigo-200',
    surfaceGradient: 'from-indigo-500/20 via-indigo-500/5 to-transparent',
    progressGradient: 'from-indigo-400 to-purple-500',
    glow: 'shadow-[0_0_45px_-15px_rgba(99,102,241,0.6)]',
  },
  anime: {
    accent: 'text-pink-400',
    accentSoft: 'bg-pink-500/10',
    border: 'border-pink-500/20',
    ring: 'ring-pink-500/20',
    iconBg: 'bg-pink-500/15',
    chipBg: 'bg-pink-500/15',
    chipText: 'text-pink-200',
    surfaceGradient: 'from-pink-500/20 via-pink-500/5 to-transparent',
    progressGradient: 'from-pink-400 to-rose-500',
    glow: 'shadow-[0_0_45px_-15px_rgba(236,72,153,0.6)]',
  },
};

const formatNumber = (n: string | number | undefined): string => {
  if (!n) return '-';
  const num = typeof n === 'string' ? Number.parseInt(n, 10) : n;
  if (Number.isNaN(num)) return String(n);
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toString();
};

const formatHours = (minutes?: number): string => {
  if (!minutes) return '0h';
  const hours = minutes / 60;
  if (hours >= 10) {
    return `${Math.round(hours)}h`;
  }
  return `${hours.toFixed(1).replace(/\.0$/, '')}h`;
};

const formatDuration = (seconds?: number): string => {
  if (!seconds) return '0m';
  const totalSeconds = Math.max(0, seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const parts: string[] = [];
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  if (parts.length === 0) {
    return '<1m';
  }
  return parts.join(' ');
};

const formatDateTime = (isoDate?: string): string => {
  if (!isoDate) return '-';
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleString('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

const getSafeImageUrl = (imageArray: any[] | undefined): string | null => {
  if (!imageArray || imageArray.length === 0) return null;
  const preferredSizes = ['mega', 'extralarge', 'large', 'medium', 'small'];
  for (const size of preferredSizes) {
    const match = imageArray.find((img: any) => img?.size === size && img['#text']);
    if (match?.['#text']) {
      return match['#text'];  
    }
  }
  const fallbackImage = imageArray.find((img: any) => img?.['#text']);
  return fallbackImage?.['#text'] || null;
};

const getSteamImageUrl = (game?: SteamGame): string | null => {
  if (!game || !game.appid) return null;
  if (game.img_logo_url) {
    return `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_logo_url}.jpg`;
  }
  if (game.img_icon_url) {
    return `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`;
  }
  return null;
};

const getSteamCoverImageUrl = (game?: SteamGame): string | null => {
  if (!game || !game.appid) return null;
  return `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/library_hero.jpg`;
};

const parseNumericValue = (value: string | number | null | undefined): number => {
  if (value === null || value === undefined) return 0;
  const numeric = typeof value === 'number' ? value : Number.parseFloat(value);
  return Number.isNaN(numeric) ? 0 : numeric;
};

const epley1RM = (weight: number, reps: number): number => {
  if (!weight || !reps) return 0;
  return Math.round(weight * (1 + reps / 30));
};

const getExerciseBest = (exercise: LyftaExercise) => {
  return exercise.sets.reduce(
    (acc, set) => {
      const w = parseNumericValue(set.weight);
      const r = parseNumericValue(set.reps);
      const rm = epley1RM(w, r);
      if (rm > acc.est1RM) {
        return { weight: w, reps: r, est1RM: rm };
      }
      return acc;
    },
    { weight: 0, reps: 0, est1RM: 0 }
  );
};

const getWorkoutEstimatedDuration = (workout: LyftaWorkout | null): number => {
  if (!workout) return 0;
  return workout.exercises.reduce<number>((exerciseAcc, exercise) => {
    const setsDuration =
      exercise.sets?.reduce<number>((setAcc, set) => {
        if (set?.duration) return setAcc + set.duration;
        const reps = parseNumericValue(set?.reps);
        return setAcc + reps * 2;
      }, 0) ?? 0;
    const rest = exercise.exercise_rest_time || 0;
    return exerciseAcc + setsDuration + rest;
  }, 0);
};

const formatVolume = (kg?: number): string => {
  if (!kg) return '0kg';
  if (kg >= 1000) {
    const value = kg / 1000;
    const formatted = value >= 10 ? value.toFixed(0) : value.toFixed(1);
    return `${formatted.replace(/\.0$/, '')}k kg`;
  }
  return `${kg % 1 === 0 ? kg.toFixed(0) : kg.toFixed(1)} kg`;
};

const formatWeightValue = (kg?: number): string => {
  if (!kg) return '0kg';
  const formatted = Number.isInteger(kg) ? kg.toFixed(0) : kg.toFixed(1);
  return `${formatted.replace(/\.0$/, '')}kg`;
};

const formatRepsValue = (reps?: number): string => {
  if (!reps) return '0';
  return Number.isInteger(reps) ? reps.toString() : reps.toFixed(1).replace(/\.0$/, '');
};

const formatExerciseCategory = (type?: string): string => {
  if (!type) return 'Geral';
  const key = type.split('_')[0];
  return key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
};

const TRACKS_REFRESH_INTERVAL = 30;

const InterestsCards = () => {
  const [activeTab, setActiveTab] = useState<TabId>('music');
  const [tracksCountdown, setTracksCountdown] = useState(TRACKS_REFRESH_INTERVAL);
  const [isFirstUpdate, setIsFirstUpdate] = useState(true);
  const t = useTranslations('About.interests');
  const { user: lastfmUser } = useLastFmUser();
  const { tracks: lastfmTracks, refresh: refreshTracks } = useLastFmTracks();
  const { artists: lastfmArtists } = useLastFmArtists();
  const { stats: steamStats } = useSteamStats();
  const { stats: lyftaStats } = useLyftaStats();
  const { stats: malStats, loading: malLoading, error: malError } = useMALUserStats();
  const { favorites: malFavorites, loading: malFavoritesLoading } = useMALFavorites();

  const tabs: Array<{
    id: TabId;
    label: string;
    icon: LucideIcon;
  }> = useMemo(
    () => [
      { id: 'music', label: t('music.tab'), icon: Music },
      { id: 'fitness', label: t('fitness.tab'), icon: Dumbbell },
      { id: 'gaming', label: t('games.tab'), icon: Gamepad2 },
      { id: 'discord', label: 'Discord', icon: MessageCircle },
      { id: 'anime', label: 'Anime', icon: Tv },
    ],
    [t]
  );

  const nowPlaying = lastfmTracks?.find(track => track['@attr']?.nowplaying === 'true');
  const lastTrack = lastfmTracks?.[0];
  const displayTrack = nowPlaying || lastTrack;
  const isActuallyPlaying = !!nowPlaying;
  const featuredGame =
    steamStats?.recentGames?.[0] ||
    steamStats?.mostPlayedGames?.[0] ||
    steamStats?.recentGames?.[1];
  const lastWorkout = lyftaStats?.lastWorkout ?? null;
  const activeColors = colorPalette[activeTab];

  const musicStats = [
    {
      label: t('music.totalScrobbles'),
      value:
        formatNumber(
          ((lastfmUser as any)?.playcount ||
            (lastfmUser as any)?.user?.playcount ||
            lastfmTracks?.length) ??
            0
        ) || '-',
    },
    {
      label: t('music.recentTracks'),
      value: formatNumber(lastfmTracks?.length || 0),
    },
    {
      label: t('music.topArtists'),
      value: formatNumber(lastfmArtists?.length || 0),
    },
  ];

  const bestExercises =
    lastWorkout?.exercises
      ?.map(exercise => {
        const best = getExerciseBest(exercise);
        return {
          name: exercise.excercise_name,
          category: formatExerciseCategory(exercise.exercise_type),
          image: exercise.exercise_image,
          ...best,
        };
      })
      .filter(item => item.est1RM > 0)
      .sort((a, b) => b.est1RM - a.est1RM)
      .slice(0, 4) ?? [];

  const lastWorkoutDuration = getWorkoutEstimatedDuration(lastWorkout);
  const favoriteExercise = lyftaStats?.favoriteExercise ?? null;

  const totalRecentMinutes =
    steamStats?.recentGames?.reduce((acc, game) => acc + (game.playtime_2weeks || 0), 0) ?? 0;
  const totalExercisesCount = lastWorkout?.exercises?.length ?? 0;
  const totalSetsCount =
    lastWorkout?.exercises?.reduce((acc, exercise) => acc + (exercise.sets?.length ?? 0), 0) ?? 0;
  const topExercise = bestExercises[0] ?? null;

  useEffect(() => {
    if (activeTab !== 'music') {
      if (tracksCountdown !== TRACKS_REFRESH_INTERVAL) {
        setTracksCountdown(TRACKS_REFRESH_INTERVAL);
      }
      setIsFirstUpdate(true);
      return;
    }

    if (tracksCountdown <= 0) {
      if (typeof refreshTracks === 'function') {
        if (isFirstUpdate) {
          // Primeiro update após 30s: usuário ficou na página, busca dados novos
          // O dedupingInterval do SWR (30s) garante que não busca se já buscou recentemente
          void refreshTracks(undefined, { revalidate: true });
          setIsFirstUpdate(false);
        } else {
          // Updates subsequentes: sempre busca dados novos (limpa cache)
          void refreshTracks(undefined, { revalidate: true });
        }
      }
      setTracksCountdown(TRACKS_REFRESH_INTERVAL);
      return;
    }

    const timeout = window.setTimeout(() => {
      setTracksCountdown(prev => Math.max(prev - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, tracksCountdown, isFirstUpdate]);

  return (
    <div className="relative flex w-full flex-col md:h-full">
      <div className="relative flex h-full flex-col gap-6 rounded-3xl border border-white/10 bg-white/80 p-5 shadow-xl backdrop-blur-xl transition-colors dark:border-white/5 dark:bg-gray-900/60 sm:p-6 md:gap-8 md:p-8 md:shadow-2xl">
        <div className="absolute inset-x-12 top-0 h-40 -translate-y-1/2 rounded-full bg-gradient-to-br from-white/40 to-transparent blur-3xl opacity-40 dark:from-white/10" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="md:hidden">
            <div className="-mx-1 flex gap-3 overflow-x-auto pb-2 px-1 justify-between">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const tabColors = colorPalette[tab.id];
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-shrink-0 flex-col items-start gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold text-left transition-all duration-200 ${
                      isActive
                        ? `${tabColors.accentSoft} ${tabColors.border} ring-1 ${tabColors.ring}`
                        : 'border-white/20 bg-white/70 text-gray-700 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-gray-200 dark:hover:bg-white/10'
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                        isActive ? tabColors.iconBg : 'bg-white/70 dark:bg-white/10'
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 transition-colors ${
                          isActive ? tabColors.accent : 'text-gray-500 dark:text-gray-400'
                        }`}
                      />
                    </span>
                    <span className={`block ${isActive ? 'text-gray-900 dark:text-white' : ''}`}>
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <aside className="hidden w-full shrink-0 md:block md:w-64 md:max-h-full md:pr-4 lg:w-60 lg:pr-1">
            <div className="mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{t('title')}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('subtitle')}</p>
            </div>
            <div className="space-y-3">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                const tabColors = colorPalette[tab.id];
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`group relative flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all duration-300 ${
                      isActive
                        ? `${tabColors.accentSoft} ${tabColors.border} ${tabColors.ring} ${tabColors.glow} scale-[1.02] ring-1`
                        : 'border-white/10 bg-white/40 text-gray-600 hover:bg-white/70 dark:border-white/5 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10'
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                        isActive ? tabColors.iconBg : 'bg-white/70 dark:bg-white/10'
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 transition-colors ${
                          isActive ? tabColors.accent : 'text-gray-500 dark:text-gray-400'
                        }`}
                      />
                    </span>
                    <span
                      className={`font-semibold transition-colors ${
                        isActive ? 'text-gray-900 dark:text-white' : ''
                      }`}
                    >
                      {tab.label}
                    </span>
                    {isActive && (
                      <ChevronRight
                        className={`ml-auto h-4 w-4 transition-opacity ${tabColors.accent}`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </aside>

          <section
            className={`relative flex flex-1 flex-col gap-8 overflow-hidden rounded-3xl border bg-white/80 p-6 shadow-lg ring-1 backdrop-blur-2xl transition-all duration-500 dark:bg-gray-900/70 sm:p-8 md:h-full ${activeColors.border} ${activeColors.ring}`}
          >
            <div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${activeColors.surfaceGradient}`}
            />
            <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-white/50 to-transparent blur-3xl opacity-30 dark:from-white/10" />
            <div className="relative flex flex-1 flex-col gap-8 md:h-full">
              {activeTab === 'music' && (
                <motion.div
                  key="music"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col gap-8 md:h-full md:gap-10 md:justify-between"
                >
                  <motion.div variants={itemVariants} className="flex flex-col gap-8 lg:flex-row">
                    <div className="relative mx-auto flex h-48 w-48 items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                        className="h-full w-full"
                      >
                        <Image
                          src={vinylDisk}
                          alt="Disco de vinil"
                          width={192}
                          height={192}
                          className="h-full w-full object-contain"
                        />
                      </motion.div>
                      {displayTrack && (() => {
                        const imageUrl = getSafeImageUrl(displayTrack.image);
                        return (
                          <div className="absolute h-24 w-24 overflow-hidden rounded-xl border border-white/20 shadow-xl">
                            {imageUrl ? (
                              <Image
                                src={imageUrl}
                                alt={displayTrack.name}
                                width={96}
                                height={96}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full bg-gradient-to-br from-gray-400/20 to-gray-600/20 dark:from-gray-500/20 dark:to-gray-700/20 flex items-center justify-center">
                                <Music className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                    <div className="flex-1">
                      <ServiceBadge 
                        name="Last.fm" 
                        icon={Music} 
                        color={`${activeColors.chipBg} ${activeColors.chipText}`}
                      />
                      <div className="mt-2 flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${isActuallyPlaying ? 'animate-pulse bg-green-400' : 'bg-gray-400'}`} />
                        <span className="text-xs uppercase tracking-[0.2em] text-gray-500">
                          {isActuallyPlaying ? t('music.nowPlaying') : 'Última música'}
                        </span>
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {displayTrack?.name ?? t('noData')}
                      </h3>
                      <p className="mt-1 text-lg text-gray-600 dark:text-gray-300">
                        {displayTrack
                          ? displayTrack.artist['#text'] || displayTrack.artist.name
                          : t('noData')}
                      </p>
                      <div className="mt-6">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200/60 dark:bg-white/5">
                          <motion.div
                            initial={{ width: '0%' }}
                            animate={{ width: `${displayTrack ? (isActuallyPlaying ? 68 : 45) : 38}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className={`h-full rounded-full bg-gradient-to-r ${activeColors.progressGradient}`}
                          />
                        </div>
                        <div className="mt-3 flex flex-wrap items-end gap-3 text-xs uppercase tracking-wide text-gray-500">
                          <span>{t('music.liveTicker')}</span>
                          <div className="hidden h-6 items-end gap-1 sm:flex">
                            <MusicalBar delay={0} />
                            <MusicalBar delay={0.15} />
                            <MusicalBar delay={0.3} />
                          </div>
                          <span className="ml-auto text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                            {t('music.nextUpdate', { seconds: tracksCountdown })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-3">
                    {musicStats.map(stat => (
                      <div
                        key={stat.label}
                        className={`rounded-2xl border bg-white/70 p-4 shadow-sm transition-colors dark:bg-gray-900/70 ${activeColors.border}`}
                      >
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                          {stat.label}
                        </p>
                        <p className={`mt-2 text-2xl font-semibold ${activeColors.accent}`}>
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </motion.div>

                  <motion.div variants={itemVariants} className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-2xl border border-white/20 bg-white/70 p-5 shadow-sm transition-colors dark:bg-gray-900/60">
                      <div className="mb-4 flex items-center gap-2">
                        <Disc3 className={`h-5 w-5 ${activeColors.accent}`} />
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {t('music.recentTracks')}
                        </h4>
                      </div>
                      <div className="space-y-3">
                        {(lastfmTracks?.slice(0, 4) || []).map(track => {
                          const imageUrl = getSafeImageUrl(track.image);
                          return (
                            <div
                              key={`${track.name}-${track.mbid || track.date?.uts || track.url}`}
                              className="flex items-center gap-3"
                            >
                              {imageUrl ? (
                                <Image
                                  src={imageUrl}
                                  alt={track.name}
                                  width={40}
                                  height={40}
                                  className="h-10 w-10 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-gray-300/30 to-gray-400/30 dark:from-gray-600/30 dark:to-gray-700/30 flex items-center justify-center flex-shrink-0">
                                  <Music className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                                  {track.name}
                                </p>
                                <p className="truncate text-xs text-gray-500">
                                  {track.artist['#text'] || track.artist.name}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/20 bg-white/70 p-5 shadow-sm transition-colors dark:bg-gray-900/60">
                      <div className="mb-4 flex items-center gap-2">
                        <Medal className={`h-5 w-5 ${activeColors.accent}`} />
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {t('music.topArtists')}
                        </h4>
                      </div>
                      <div className="space-y-3">
                        {(lastfmArtists?.slice(0, 4) || []).map((artist, index) => {
                          const imageUrl = getSafeImageUrl(artist.image);
                          return (
                            <div
                              key={`${artist.name}-${artist.mbid || index}`}
                              className="flex items-center gap-3"
                            >
                              {imageUrl ? (
                                <Image
                                  src={imageUrl}
                                  alt={artist.name}
                                  width={40}
                                  height={40}
                                  className="h-10 w-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-300/30 to-gray-400/30 dark:from-gray-600/30 dark:to-gray-700/30 flex items-center justify-center flex-shrink-0">
                                  <Music className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                                  {artist.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatNumber(artist.playcount)} {t('music.plays')}
                                </p>
                              </div>
                              <span
                                className={`text-xs font-semibold ${activeColors.accentSoft} ${activeColors.accent} rounded-full px-2 py-1`}
                              >
                                #{index + 1}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {activeTab === 'fitness' && (
                <motion.div
                  key="fitness"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col gap-8 md:h-full md:gap-10 md:justify-between"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <ServiceBadge 
                        name="Lyfta" 
                        icon={Dumbbell} 
                        color={`${activeColors.chipBg} ${activeColors.chipText}`}
                      />
                      <div className="mt-2 flex items-center gap-2">
                        <Flame className="h-4 w-4 text-orange-400" />
                        <span className="text-xs uppercase tracking-[0.2em] text-gray-500">
                          {t('fitness.currentStreak')}
                        </span>
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {lastWorkout?.title ?? t('fitness.noWorkout')}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {lastWorkout
                          ? `${t('fitness.lastWorkout')} • ${formatDateTime(lastWorkout.workout_perform_date)}`
                          : t('noData')}
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-500/10">
                        <Flame className="h-10 w-10 text-orange-400" />
                      </div>
                      <div>
                        <p className={`text-4xl font-bold ${activeColors.accent}`}>
                          {lyftaStats?.currentStreak ?? 0}
                        </p>
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                          {t('fitness.weeks')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {t('fitness.totalWorkouts')}: {lyftaStats?.totalWorkouts ?? 0}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div
                      className={`rounded-2xl border bg-white/70 p-5 shadow-sm transition-colors dark:bg-gray-900/70 ${activeColors.border}`}
                    >
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        {t('fitness.lastWorkoutVolume')}
                      </p>
                      <p className={`mt-2 text-3xl font-semibold ${activeColors.accent}`}>
                        {formatVolume(lastWorkout?.total_volume)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {t('fitness.totalLiftedWeight')}:{' '}
                        {formatVolume(lyftaStats?.totalLiftedWeight)}
                      </p>
                    </div>
                    <div
                      className={`rounded-2xl border bg-white/70 p-5 shadow-sm transition-colors dark:bg-gray-900/70 ${activeColors.border}`}
                    >
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        {t('fitness.sessionOverview')}
                      </p>
                      <p className={`mt-2 text-2xl font-semibold ${activeColors.accent}`}>
                        {topExercise?.name ??
                          favoriteExercise ??
                          t('fitness.sessionOverviewFallback')}
                      </p>
                      <div className="mt-2 space-y-1 text-sm text-gray-500">
                        <p>{t('fitness.totalExercises', { count: totalExercisesCount })}</p>
                        <p>{t('fitness.totalSets', { count: totalSetsCount })}</p>
                        <p>
                          {t('fitness.sessionDuration', {
                            duration: formatDuration(lastWorkoutDuration),
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {bestExercises.length > 0 && (
                    <div className="space-y-4 rounded-2xl border border-white/15 bg-white/80 p-4 shadow-sm transition-colors dark:bg-gray-900/60 md:bg-white/70 md:p-5">
                      <div className="flex items-center gap-2">
                        <TrendingUp className={`h-5 w-5 ${activeColors.accent}`} />
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {t('fitness.bestSets')}
                        </h4>
                      </div>
                      <div className="space-y-3 md:max-h-60 md:overflow-y-auto md:pr-2">
                        {bestExercises.map(item => (
                          <div
                            key={item.name}
                            className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/60 p-4 dark:bg-white/5 md:flex-row md:items-center md:justify-between"
                          >
                            <div className="flex items-start gap-3 md:items-center">
                              {item.image && (
                                <div className="flex items-center justify-center rounded-xl bg-white/70 p-1 dark:bg-white/10">
                                  <Image
                                    src={item.image}
                                    alt={item.name}
                                    width={48}
                                    height={48}
                                    className="h-12 w-12 rounded-xl object-cover shadow-sm"
                                  />
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                                  {item.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {t('fitness.categoryLabel')}: {item.category}
                                </p>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 md:text-right md:min-w-[140px]">
                              <span className={`font-semibold ${activeColors.accent}`}>
                                {formatWeightValue(item.weight)} × {formatRepsValue(item.reps)}
                              </span>
                              <span className="ml-1 text-gray-500">
                                (~{formatWeightValue(item.est1RM)} 1RM)
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'gaming' && (
                <motion.div
                  key="gaming"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col gap-8 md:h-full md:gap-10 md:justify-between"
                >
                  {steamStats?.profile && (
                    <motion.div variants={itemVariants} className="flex flex-col gap-4 rounded-2xl border border-white/20 bg-white/70 p-5 shadow-sm transition-colors dark:bg-gray-900/60 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <Image
                          src={steamStats.profile.avatarfull}
                          alt={steamStats.profile.personaname}
                          width={64}
                          height={64}
                          className="h-16 w-16 rounded-2xl object-cover"
                        />
                        <div>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {steamStats.profile.personaname}
                          </p>
                          <p className="text-xs uppercase tracking-wide text-gray-500">
                            {formatNumber(steamStats.totalGames)} {t('games.totalGamesLabel')}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div
                          className={`rounded-xl border bg-white/60 p-4 text-center dark:bg-white/5 ${activeColors.border}`}
                        >
                          <p className="text-xs uppercase tracking-wide text-gray-500">
                            {t('games.totalHours')}
                          </p>
                          <p className={`mt-1 text-lg font-semibold ${activeColors.accent}`}>
                            {formatHours(steamStats?.totalPlaytime)}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            {t('games.totalGames')}: {formatNumber(steamStats.totalGames)}
                          </p>
                        </div>
                        <div
                          className={`rounded-xl border bg-white/60 p-4 text-center dark:bg-white/5 ${activeColors.border}`}
                        >
                          <p className="text-xs uppercase tracking-wide text-gray-500">
                            {t('games.lastTwoWeeks')}
                          </p>
                          <p className={`mt-1 text-lg font-semibold ${activeColors.accent}`}>
                            {formatHours(totalRecentMinutes)}
                          </p>
                          <p className="text-[11px] text-gray-500">
                            {t('games.activeGames')}:{' '}
                            {formatNumber(steamStats.recentGames?.length || 0)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <motion.div variants={itemVariants} className="grid gap-4 lg:grid-cols-2">
                    <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-gray-900/80 p-6 shadow-sm transition-colors dark:border-white/10 dark:bg-gray-900/80 lg:col-span-2">
                      {featuredGame && (() => {
                        const coverUrl = getSteamCoverImageUrl(featuredGame);
                        return (
                          <>
                            {coverUrl ? (
                              <Image
                                src={coverUrl}
                                alt={featuredGame.name}
                                fill
                                sizes="(max-width: 1024px) 100vw, 70vw"
                                className="absolute inset-0 h-full w-full object-cover opacity-70"
                                priority={false}
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-br from-gray-800/80 to-gray-900/80" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-transparent" />
                          </>
                        );
                      })()}
                      <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur ${activeColors.border}`}
                          >
                            <Gamepad2 className={`h-6 w-6 ${activeColors.accent}`} />
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wide text-gray-300">
                              {t('games.recentHighlight')}
                            </p>
                            <h4 className="text-lg font-semibold text-white">
                              {featuredGame?.name ?? t('noData')}
                            </h4>
                          </div>
                        </div>
                        {featuredGame && (() => {
                          const imageUrl = getSteamImageUrl(featuredGame);
                          return (
                            <div className="flex items-center gap-4">
                              {imageUrl ? (
                                <Image
                                  src={imageUrl}
                                  alt={featuredGame.name}
                                  width={72}
                                  height={72}
                                  className="h-16 w-16 rounded-xl border border-white/20 object-cover shadow-lg"
                                />
                              ) : (
                                <div className="h-16 w-16 rounded-xl border border-white/20 bg-gradient-to-br from-gray-700/50 to-gray-800/50 flex items-center justify-center flex-shrink-0">
                                  <Gamepad2 className="h-8 w-8 text-gray-400" />
                                </div>
                              )}
                              <div className="text-sm text-gray-200">
                                <p>
                                  {t('games.lastTwoWeeks')}:{' '}
                                  <span className={`font-semibold ${activeColors.accent}`}>
                                    {formatHours(featuredGame.playtime_2weeks)}
                                  </span>
                                </p>
                                <p>
                                  {t('games.totalPlaytime')}:{' '}
                                  <span className={`font-semibold ${activeColors.accent}`}>
                                    {formatHours(featuredGame.playtime_forever)}
                                  </span>
                                </p>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="rounded-2xl border border-white/15 bg-white/80 p-4 shadow-sm transition-colors dark:bg-gray-900/60 md:bg-white/70 md:p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <Medal className={`h-5 w-5 ${activeColors.accent}`} />
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {t('games.topRecently')}
                      </h4>
                    </div>

                    <div className="space-y-3 md:max-h-60 md:overflow-y-auto md:pr-2">
                      {(steamStats?.recentGames?.slice(0, 5) || []).map(game => {
                        const coverUrl = getSteamCoverImageUrl(game);
                        return (
                          <div
                            key={`${game.appid}-${game.name}`}
                            className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/60 p-4 dark:bg-white/5 md:flex-row md:items-center md:justify-between"
                          >
                            <div className="flex flex-col items-start gap-3 md:flex-row md:items-center">
                              {coverUrl ? (
                                <Image
                                  src={coverUrl}
                                  alt={game.name}
                                  width={96}
                                  height={54}
                                  className="h-14 w-auto max-w-[96px] rounded-lg object-cover"
                                  style={{ width: 'auto' }}
                                />
                              ) : (
                                <div className="h-14 w-24 rounded-lg bg-gradient-to-br from-gray-300/30 to-gray-400/30 dark:from-gray-600/30 dark:to-gray-700/30 flex items-center justify-center flex-shrink-0">
                                  <Gamepad2 className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {game.name}
                                </p>
                                <p className="text-xs text-gray-500 md:truncate">
                                  {formatHours(game.playtime_2weeks)}{' '}
                                  {t('games.lastTwoWeeks').toLowerCase()}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`text-xs font-semibold ${activeColors.accentSoft} ${activeColors.accent} self-start rounded-full px-2 py-1 md:self-auto`}
                            >
                              {formatHours(game.playtime_forever)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {activeTab === 'discord' && (
                <motion.div
                  key="discord"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col gap-8 md:h-full md:items-center md:justify-center"
                >
                  <div className="text-center space-y-4">
                    <div
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${activeColors.chipBg} ${activeColors.chipText}`}
                    >
                      <Activity className="h-4 w-4" />
                      <span className="uppercase tracking-[0.2em]">Status ao vivo</span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                      Discord
                    </h3>
                    <p className="text-sm text-gray-500">
                      Veja o que estou fazendo agora mesmo
                    </p>
                  </div>

                  <div className="flex justify-center w-full">
                    <DiscordCard />
                  </div>
                </motion.div>
              )}

              {activeTab === 'anime' && (
                <motion.div
                  key="anime"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col gap-8 md:h-full md:gap-10 md:justify-between"
                >
                  {malLoading ? (
                    <LoadingState color="border-pink-400" />
                  ) : malError ? (
                    <ErrorState message="Erro ao carregar dados do MyAnimeList" color="text-pink-400" />
                  ) : (
                    <>
                      <motion.div variants={itemVariants} className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                          <ServiceBadge 
                            name="MyAnimeList" 
                            icon={Star} 
                            color={`${activeColors.chipBg} ${activeColors.chipText}`}
                          />
                          <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Anime & Mangá
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">
                            Estatísticas do MyAnimeList
                          </p>
                        </div>
                      </motion.div>

                  <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-3">
                    <div
                      className={`rounded-2xl border bg-white/70 p-4 shadow-sm transition-colors dark:bg-gray-900/70 ${activeColors.border}`}
                    >
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Dias assistidos
                      </p>
                      <p className={`mt-2 text-2xl font-semibold ${activeColors.accent}`}>
                        {malStats?.anime?.days_watched?.toFixed(1) || '0'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatNumber(malStats?.anime?.episodes_watched || 0)} episódios
                      </p>
                    </div>
                    <div
                      className={`rounded-2xl border bg-white/70 p-4 shadow-sm transition-colors dark:bg-gray-900/70 ${activeColors.border}`}
                    >
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Animes completos
                      </p>
                      <p className={`mt-2 text-2xl font-semibold ${activeColors.accent}`}>
                        {formatNumber(malStats?.anime?.completed || 0)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Nota média: {malStats?.anime?.mean_score?.toFixed(1) || '0'}
                      </p>
                    </div>
                    <div
                      className={`rounded-2xl border bg-white/70 p-4 shadow-sm transition-colors dark:bg-gray-900/70 ${activeColors.border}`}
                    >
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Assistindo
                      </p>
                      <p className={`mt-2 text-2xl font-semibold ${activeColors.accent}`}>
                        {formatNumber(malStats?.anime?.watching || 0)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Total: {formatNumber(malStats?.anime?.total_entries || 0)}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-2xl border border-white/20 bg-white/70 p-5 shadow-sm transition-colors dark:bg-gray-900/60">
                      <div className="mb-4 flex items-center gap-2">
                        <Tv className={`h-5 w-5 ${activeColors.accent}`} />
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                          Animes Favoritos
                        </h4>
                      </div>
                      <div className="space-y-3">
                        {malFavoritesLoading ? (
                          <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-400 mx-auto" />
                          </div>
                        ) : malFavorites?.anime && malFavorites.anime.length > 0 ? (
                          malFavorites.anime.slice(0, 4).map((anime) => (
                            <div
                              key={anime.mal_id}
                              className="flex items-center gap-3"
                            >
                              {anime.images?.webp?.image_url ? (
                                <Image
                                  src={anime.images.webp.image_url}
                                  alt={anime.title}
                                  width={40}
                                  height={56}
                                  className="h-14 w-10 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="h-14 w-10 rounded-lg bg-gradient-to-br from-gray-300/30 to-gray-400/30 dark:from-gray-600/30 dark:to-gray-700/30 flex items-center justify-center flex-shrink-0">
                                  <Tv className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                                  {anime.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {anime.type} • {anime.start_year || 'N/A'}
                                </p>
                              </div>
                              <Star className={`h-4 w-4 ${activeColors.accent} flex-shrink-0`} />
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 text-center py-4">
                            Nenhum anime favorito
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/20 bg-white/70 p-5 shadow-sm transition-colors dark:bg-gray-900/60">
                      <div className="mb-4 flex items-center gap-2">
                        <BookOpen className={`h-5 w-5 ${activeColors.accent}`} />
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                          Mangás Favoritos
                        </h4>
                      </div>
                      <div className="space-y-3">
                        {malFavoritesLoading ? (
                          <div className="text-center py-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-400 mx-auto" />
                          </div>
                        ) : malFavorites?.manga && malFavorites.manga.length > 0 ? (
                          malFavorites.manga.slice(0, 4).map((manga) => (
                            <div
                              key={manga.mal_id}
                              className="flex items-center gap-3"
                            >
                              {manga.images?.webp?.image_url ? (
                                <Image
                                  src={manga.images.webp.image_url}
                                  alt={manga.title}
                                  width={40}
                                  height={56}
                                  className="h-14 w-10 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="h-14 w-10 rounded-lg bg-gradient-to-br from-gray-300/30 to-gray-400/30 dark:from-gray-600/30 dark:to-gray-700/30 flex items-center justify-center flex-shrink-0">
                                  <BookOpen className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                                  {manga.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {manga.type} • {manga.start_year || 'N/A'}
                                </p>
                              </div>
                              <Star className={`h-4 w-4 ${activeColors.accent} flex-shrink-0`} />
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 text-center py-4">
                            Nenhum mangá favorito
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                    </>
                  )}
                </motion.div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default InterestsCards;


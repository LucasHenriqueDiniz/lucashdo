'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  Award,
  Calendar,
  Clock,
  Disc3,
  Dumbbell,
  Gamepad2,
  Medal,
  Mic2,
  Music,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useLastFmArtists, useLastFmTracks, useLastFmUser } from '@/hooks/useLastFm';
import { useLyftaStats } from '@/hooks/useLyfta';
import { useSteamStats } from '@/hooks/useSteamStats';
import { LyftaExercise } from '@/services/lyfta';
import { LastFmArtist, LastFmImage, LastFmTrack } from '@/types/lastfm.types';
import { SteamGame } from '@/services/steam';
import { MusicalBar } from '@/components/MusicalBar';
import { vinylDisk } from '../../../public';
import styles from './InterestsCards.module.css';

// Types
interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
  border: string;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  value: string | number;
  label: string;
  color: string;
}

interface NowPlayingProps {
  track: LastFmTrack;
  color: ColorScheme;
}

interface ItemListProps<T> {
  items: T[];
  title: string;
  renderItem: (item: T, index: number) => React.ReactNode;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

interface LyftaDay {
  day: string;
  count: number;
}

// Função para formatação de números
function formatNumber(n: string | number | undefined): string {
  if (!n) return '-';
  const num = typeof n === 'string' ? parseInt(n) : n;
  if (isNaN(num)) return String(n);
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
  return num.toString();
}

// Cores padronizadas
const colors: Record<string, ColorScheme> = {
  music: {
    primary: 'rgb(245, 158, 11)', // amber-500
    secondary: 'rgb(251, 191, 36)', // amber-400
    accent: 'rgb(217, 119, 6)', // amber-600
    bg: 'rgb(254, 243, 199)', // amber-100
    border: 'rgb(252, 211, 77)', // amber-300
  },
  games: {
    primary: 'rgb(6, 182, 212)', // cyan-500
    secondary: 'rgb(34, 211, 238)', // cyan-400
    accent: 'rgb(8, 145, 178)', // cyan-600
    bg: 'rgb(207, 250, 254)', // cyan-100
    border: 'rgb(103, 232, 249)', // cyan-300
  },
  fitness: {
    primary: 'rgb(34, 197, 94)', // green-500
    secondary: 'rgb(74, 222, 128)', // green-400
    accent: 'rgb(22, 163, 74)', // green-600
    bg: 'rgb(220, 252, 231)', // green-100
    border: 'rgb(134, 239, 172)', // green-300
  },
};

const InterestsCards = () => {
  const [activeCard, setActiveCard] = useState('music');
  const [isPlaying] = useState(true);

  // Hooks
  const { user: lastfmUser } = useLastFmUser();
  const { tracks: lastfmTracks } = useLastFmTracks();
  const { artists: lastfmArtists } = useLastFmArtists();
  const { stats: steamStats } = useSteamStats();
  const { stats: lyftaStats } = useLyftaStats();

  // Debug logs para verificar se os dados estão sendo carregados
  useEffect(() => {
    console.log('🎵 LastFM User:', lastfmUser);
    console.log('🎮 Steam Stats:', steamStats);
    console.log('💪 Lyfta Stats:', lyftaStats);
  }, [lastfmUser, steamStats, lyftaStats]);

  const cards = [
    { id: 'music', label: 'Music', icon: Music, colors: colors.music },
    { id: 'games', label: 'Games', icon: Gamepad2, colors: colors.games },
    { id: 'fitness', label: 'Fitness', icon: Dumbbell, colors: colors.fitness },
  ];

  const formatTime = (minutes: number): string => {
    const totalHours = Math.floor(minutes / 60);
    const days = Math.floor(totalHours / 24);
    const remainingHours = totalHours % 24;

    if (days > 0) {
      return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
    }
    return remainingHours > 0 ? `${remainingHours}h` : `${minutes}m`;
  };

  const formatWeight = (kg: number): string => {
    return kg >= 1000 ? `${(kg / 1000).toFixed(1)}k kg` : `${kg} kg`;
  };

  // Função para obter URL segura da imagem
  const getSafeImageUrl = (
    imageArray: LastFmImage[] | undefined,
    fallback: string = '/placeholder.webp'
  ): string => {
    if (!imageArray || imageArray.length === 0) return fallback;
    const image = imageArray.findLast(img => img['#text'] && img['#text'].startsWith('http'));
    return image?.['#text'] || fallback;
  };

  // Componente base para cards com hover melhorado
  const Card: React.FC<CardProps> = ({ children, className = '' }) => {
    return (
      <motion.div
        className={`${styles.card} ${styles[activeCard]} relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg transition-all duration-300 space-y-4 overflow-hidden ${className}`}
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
      >
        {/* Conteúdo */}
        <div className={styles.cardContent}>{children}</div>
      </motion.div>
    );
  };

  // Componente para estatísticas
  const StatCard: React.FC<StatCardProps> = ({ icon: Icon, value, label, color }) => (
    <Card className="text-center" color={color}>
      <Icon className="w-8 h-8 mx-auto mb-3" style={{ color }} />
      <div className="text-2xl font-bold mb-1" style={{ color }}>
        {formatNumber(value)}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
    </Card>
  );

  // Now Playing Component
  const NowPlaying: React.FC<NowPlayingProps> = ({ track, color }) => {
    return (
      <Card color={color.primary} className="mb-8">
        <div className="flex items-center gap-12">
          <div className="relative">
            <motion.div
              animate={{ rotate: isPlaying ? 360 : 0 }}
              className="translate-x-10"
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            >
              <Image
                width={80}
                height={80}
                src={vinylDisk}
                alt="Vinyl disk"
                className="object-cover"
                priority
                quality={60}
              />
            </motion.div>
            <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center translate-x-5">
              <Image
                width={80}
                height={80}
                src={getSafeImageUrl(track.image)}
                alt="Album cover"
                className="w-20 h-20 rounded-lg object-cover shadow-md"
              />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: color.secondary }}
              ></div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400">
                Now Listening
              </span>
            </div>
            <h3 className="font-bold text-xl text-gray-900 dark:text-white truncate">
              {track.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 truncate text-base font-medium">
              {track.artist['#text'] || track.artist.name}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <MusicalBar delay={0} />
            <MusicalBar delay={0.2} />
            <MusicalBar delay={0.4} />
            <MusicalBar delay={0.6} />
          </div>
        </div>
      </Card>
    );
  };

  // Título com ícone e animação de linha
  const AnimatedTitle: React.FC<{
    title: string;
    icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
    color: ColorScheme;
  }> = ({ title, icon: Icon, color }) => (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-1">
        <Icon className="w-5 h-5" style={{ color: color.primary }} />
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{title}</h3>
      </div>
      <motion.div
        className="h-1 rounded-full w-full"
        style={{
          background: `linear-gradient(90deg, ${color.primary}, ${color.secondary}, ${color.accent})`,
          boxShadow: `0 0 8px 0 ${color.primary}99, 0 0 16px 0 ${color.secondary}66`,
        }}
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      />
    </div>
  );

  // Lista de itens (músicas, jogos, etc.)
  const ItemList = <T,>({ items, title, renderItem, icon: Icon }: ItemListProps<T>) => (
    <Card className="space-y-4">
      <AnimatedTitle title={title} icon={Icon} color={colors[activeCard]} />
      <div className="space-y-3">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
          >
            {renderItem(item, index)}
          </motion.div>
        ))}
      </div>
    </Card>
  );

  // Music Card
  const MusicCard = () => {
    const nowPlaying =
      lastfmTracks?.find(t => t['@attr']?.nowplaying === 'true') || lastfmTracks?.[0];
    const currentColors = colors.music;

    return (
      <motion.div
        key="music"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="space-y-6"
      >
        {nowPlaying && <NowPlaying track={nowPlaying} color={currentColors} />}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ItemList<LastFmTrack>
            title="Recent Tracks"
            items={lastfmTracks?.slice(0, 5) || []}
            icon={Disc3}
            renderItem={track => (
              <>
                <Image
                  src={getSafeImageUrl(track.image)}
                  alt={track.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate text-gray-900 dark:text-white">
                    {track.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {track.artist['#text'] || track.artist.name}
                  </p>
                </div>
              </>
            )}
          />

          <ItemList<LastFmArtist>
            title="Top Artists"
            items={lastfmArtists?.slice(0, 5) || []}
            icon={Mic2}
            renderItem={artist => (
              <>
                <Image
                  src={getSafeImageUrl(artist.image)}
                  alt={artist.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate text-gray-900 dark:text-white">
                    {artist.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {formatNumber(artist.playcount)} plays
                  </p>
                </div>
              </>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <StatCard
            icon={Music}
            value={lastfmUser?.playcount || '-'}
            label="Total Scrobbles"
            color={currentColors.primary}
          />
          <StatCard
            icon={Users}
            value={lastfmUser?.artist_count || '-'}
            label="Artists"
            color={currentColors.secondary}
          />
          <StatCard
            icon={Trophy}
            value={lastfmUser?.album_count || '-'}
            label="Albums"
            color={currentColors.accent}
          />
        </div>
      </motion.div>
    );
  };

  // Games Card
  const GamesCard = () => {
    const currentColors = colors.games;

    return (
      <motion.div
        key="games"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="space-y-6"
      >
        {steamStats?.profile && (
          <Card color={currentColors.primary}>
            <div className="flex items-center gap-4">
              <Image
                width={64}
                height={64}
                src={steamStats.profile.avatarfull}
                alt="Avatar"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  {steamStats.profile.personaname}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {formatNumber(steamStats.totalGames)} games •{' '}
                  {formatTime(steamStats.totalPlaytime)} played
                </p>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ItemList<SteamGame>
            title="Recent Games"
            items={steamStats?.recentGames || []}
            icon={Clock}
            renderItem={game => (
              <>
                <Image
                  width={48}
                  height={48}
                  src={
                    game.img_icon_url
                      ? `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`
                      : '/placeholder.webp'
                  }
                  alt={game.name || 'Game'}
                  className="w-12 h-12 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate text-gray-900 dark:text-white">
                    {game.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {formatTime(game.playtime_forever)}
                  </p>
                </div>
              </>
            )}
          />

          <ItemList<SteamGame>
            title="Most Played"
            items={steamStats?.mostPlayedGames || []}
            icon={Medal}
            renderItem={(game, index) => (
              <>
                <Image
                  width={48}
                  height={48}
                  src={
                    game.img_icon_url
                      ? `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`
                      : '/placeholder.webp'
                  }
                  alt={game.name || 'Game'}
                  className="w-12 h-12 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate text-gray-900 dark:text-white">
                    {game.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {formatTime(game.playtime_forever)}
                  </p>
                </div>
                <div
                  className="text-xs font-medium px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: `${colors.games.primary}20`,
                    color: colors.games.primary,
                  }}
                >
                  #{index + 1}
                </div>
              </>
            )}
          />
        </div>
      </motion.div>
    );
  };

  // Fitness Card
  const FitnessCard = () => {
    const currentColors = colors.fitness;
    const bestStreak = lyftaStats
      ? Math.max(lyftaStats.currentStreak || 0, lyftaStats.longestStreak || 0)
      : 0;

    return (
      <motion.div
        key="fitness"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="space-y-6"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={Target}
            value={lyftaStats?.totalWorkouts || '-'}
            label="Workouts"
            color={currentColors.primary}
          />
          <StatCard
            icon={Dumbbell}
            value={lyftaStats?.totalLiftedWeight || '-'}
            label="Lifted"
            color={currentColors.secondary}
          />
          <StatCard
            icon={Zap}
            value={lyftaStats?.currentStreak || '-'}
            label="Week Streak"
            color={currentColors.accent}
          />
          <StatCard
            icon={Award}
            value={bestStreak || '-'}
            label="Best Streak"
            color={currentColors.primary}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <AnimatedTitle title="Last Workout" icon={Activity} color={currentColors} />
            <div className="space-y-4">
              <div>
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {lyftaStats?.lastWorkout?.title || '-'}
                </p>
                <div className="flex justify-between gap-2 mt-1 w-full">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {lyftaStats?.lastWorkout
                      ? formatWeight(lyftaStats.lastWorkout.total_volume)
                      : '-'}{' '}
                    total volume
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {lyftaStats?.lastWorkout?.workout_perform_date
                      ? new Date(
                          lyftaStats.lastWorkout.workout_perform_date
                        ).toLocaleDateString('en-US', { timeZone: 'UTC' })
                      : '-'}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                {lyftaStats?.lastWorkout?.exercises
                  ?.slice(0, 4)
                  .map((exercise: LyftaExercise, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                    >
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {exercise.excercise_name}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400 text-nowrap w-fit">
                        {exercise.sets[0]?.weight
                          ? `${Number(exercise.sets[0].weight)}kg`
                          : 'Bodyweight'}{' '}
                        × {exercise.sets[0]?.reps ? formatNumber(exercise.sets[0]?.reps) : '-'}{' '}
                      </span>
                    </motion.div>
                  ))}
                {lyftaStats?.lastWorkout?.exercises &&
                  lyftaStats.lastWorkout.exercises.length > 4 && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-sm text-gray-600 dark:text-gray-400 text-center"
                    >
                      +{lyftaStats.lastWorkout.exercises.length - 4} more exercises
                    </motion.div>
                  )}
              </div>
            </div>
          </Card>

          <Card>
            <AnimatedTitle title="Weekly Activity" icon={Calendar} color={currentColors} />
            <div className="space-y-4">
              {lyftaStats?.weeklyActivity?.map((day: LyftaDay, index: number) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-8 text-sm text-gray-600 dark:text-gray-400">{day.day}</div>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(day.count / 10) * 100}%` }}
                      transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                      className="h-2 rounded-full"
                      style={{ backgroundColor: currentColors.primary }}
                    />
                  </div>
                  <div
                    className="w-6 text-sm font-medium text-right"
                    style={{ color: currentColors.primary }}
                  >
                    {day.count}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        <Card color={currentColors.primary} className="text-center">
          <TrendingUp className="w-10 h-10 mx-auto mb-3" style={{ color: currentColors.primary }} />
          <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
            Favorite Exercise
          </h3>
          <p className="text-2xl font-bold" style={{ color: currentColors.primary }}>
            {lyftaStats?.favoriteExercise || '-'}
          </p>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Card Selector */}
      <div className="flex justify-center mb-8">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            {cards.map(card => {
              const Icon = card.icon;
              const isActive = activeCard === card.id;
              return (
                <motion.button
                  key={card.id}
                  onClick={() => setActiveCard(card.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  style={{
                    backgroundColor: isActive ? card.colors.primary : 'transparent',
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-5 h-5" />
                  <span>{card.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeCard === 'music' && <MusicCard />}
        {activeCard === 'games' && <GamesCard />}
        {activeCard === 'fitness' && <FitnessCard />}
      </AnimatePresence>
    </div>
  );
};

export default InterestsCards;

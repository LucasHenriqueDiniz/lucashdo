'use client';

import type { AnimationGeneratorType } from 'framer-motion';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaClock, FaGamepad, FaSteam, FaTrophy } from 'react-icons/fa';
import { SiSteam } from 'react-icons/si';
import Image from 'next/image';
import { getSteamStats, SteamStats } from '@/services/steam';

interface SteamProfileProps {
  className?: string;
}

export default function SteamProfile({ className = '' }: SteamProfileProps) {
  const [stats, setStats] = useState<SteamStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const data = await getSteamStats();
        setStats(data);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar dados do Steam');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Format playtime from minutes to readable format
  const formatPlaytime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h`;
  };

  /*   // Get Steam game image URL
  const getSteamImageUrl = (appId: string, hash: string): string => {
    if (!hash) return '/icons/steam-placeholder.jpg';
    return `https://media.steampowered.com/steamcommunity/public/images/apps/${appId}/${hash}.jpg`;
  };
 */

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
    hidden: { opacity: 0, y: 10 },
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

  if (isLoading) {
    return (
      <div className={`w-full ${className}`}>
        <div className="h-36 bg-gray-100 dark:bg-[color:var(--card)] rounded-lg animate-pulse flex items-center justify-center">
          <span className="text-[color:var(--muted-foreground)]">Carregando dados do Steam...</span>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className={`w-full ${className}`}>
        <div className="h-36 bg-red-50 dark:bg-[color:var(--destructive)]/20 rounded-lg flex items-center justify-center">
          <span className="text-[color:var(--destructive)]">
            {error || 'Dados não disponíveis'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`steam-profile ${className}`}>
      {/* Profile Header */}
      <motion.div
        className="bg-white dark:bg-[color:var(--card)]/50 rounded-lg p-6 mb-6 flex items-center gap-6 relative overflow-hidden group"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[color:var(--blue)]/10 to-transparent z-0 opacity-0 group-hover:opacity-100"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        <Image
          src={
            stats.profile?.avatarfull ??
            'https://images.unsplash.com/photo-1541560052-5e137f229371?q=80&w=800'
          }
          alt={stats.profile?.personaname ?? 'unknown'}
          className="w-24 h-24 rounded-full relative z-10"
          width={96}
          height={96}
        />
        <div className="relative z-10">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {stats.profile?.personaname}
            <FaSteam className="text-[color:var(--blue)]" />
          </h2>
          <p className="text-gray-500 dark:text-[color:var(--muted-foreground)]">
            {stats.profile?.loccountrycode ? `País: ${stats.profile.loccountrycode}` : ''}
          </p>
        </div>
      </motion.div>
      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Total Games */}
        <motion.div
          className="bg-white dark:bg-[color:var(--card)]/50 rounded-lg p-4 shadow-sm flex items-center gap-4 relative overflow-hidden group"
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[color:var(--blue)]/10 to-transparent z-0 opacity-0 group-hover:opacity-100"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          <div className="bg-[color:var(--blue)]/20 dark:bg-[color:var(--blue)]/30 p-3 rounded-full relative z-10">
            <FaGamepad className="text-[color:var(--blue)] dark:text-[color:var(--blue)] text-xl" />
          </div>
          <div className="relative z-10">
            <p className="text-sm text-gray-500 dark:text-[color:var(--muted-foreground)]">
              Total de Jogos
            </p>
            <p className="text-2xl font-bold">{stats.totalGames}</p>
          </div>
        </motion.div>

        {/* Total Playtime */}
        <motion.div
          className="bg-white dark:bg-[color:var(--card)]/50 rounded-lg p-4 shadow-sm flex items-center gap-4 relative overflow-hidden group"
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[color:var(--accent)]/10 to-transparent z-0 opacity-0 group-hover:opacity-100"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          <div className="bg-[color:var(--accent)]/20 dark:bg-[color:var(--accent)]/30 p-3 rounded-full relative z-10">
            <FaClock className="text-[color:var(--accent)] dark:text-[color:var(--accent)] text-xl" />
          </div>
          <div className="relative z-10">
            <p className="text-sm text-gray-500 dark:text-[color:var(--muted-foreground)]">
              Tempo Total
            </p>
            <p className="text-2xl font-bold">{formatPlaytime(stats.totalPlaytime)}</p>
          </div>
        </motion.div>

        {/* Recent Games */}
        <motion.div
          className="bg-white dark:bg-[color:var(--card)]/50 rounded-lg p-4 shadow-sm flex items-center gap-4 relative overflow-hidden group"
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[color:var(--green)]/10 to-transparent z-0 opacity-0 group-hover:opacity-100"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          <div className="bg-[color:var(--green)]/20 dark:bg-[color:var(--green)]/30 p-3 rounded-full relative z-10">
            <FaTrophy className="text-[color:var(--green)] dark:text-[color:var(--green)] text-xl" />
          </div>
          <div className="relative z-10">
            <p className="text-sm text-gray-500 dark:text-[color:var(--muted-foreground)]">
              Jogos Recentes
            </p>
            <p className="text-2xl font-bold">{stats.recentGames.length}</p>
          </div>
        </motion.div>
      </motion.div>{' '}
      {/* Most Played Games */}
      <motion.div
        className="bg-white dark:bg-[color:var(--card)]/50 rounded-lg p-6 relative overflow-hidden group"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[color:var(--cyan)]/5 via-[color:var(--blue)]/5 to-transparent z-0 opacity-0 group-hover:opacity-100"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        <motion.div
          className="absolute -top-12 -right-12 w-40 h-40 bg-[color:var(--blue)]/10 rounded-full blur-2xl opacity-0 group-hover:opacity-30"
          initial={{ scale: 0.8 }}
          whileHover={{ scale: 1.2 }}
          transition={{ duration: 1 }}
        />
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2 relative z-10">
          <FaTrophy className="text-[color:var(--amber)]" />
          Jogos Mais Jogados
          <motion.span
            className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--cyan)]"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.3, duration: 0.8 }}
          />
        </h3>
        <div className="space-y-4 relative z-10">
          {stats.mostPlayedGames.map((game, index) => (
            <motion.div
              key={game.appid}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              variants={itemVariants}
              whileHover={{
                scale: 1.02,
                backgroundColor: 'rgba(var(--background-rgb), 0.05)',
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-[color:var(--muted-foreground)]">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium">{game.name}</p>
                  <p className="text-sm text-gray-500 dark:text-[color:var(--muted-foreground)]">
                    {formatPlaytime(game.playtime_forever)}
                  </p>
                </div>
              </div>
              <Image
                src={`https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
                alt={game.name}
                className="w-12 h-12 rounded"
                width={48}
                height={48}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
      {/* Steam Attribution */}
      <motion.div
        className="mt-4 text-sm text-gray-500 dark:text-[color:var(--muted-foreground)] flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <SiSteam className="text-[color:var(--blue)]" />
        Dados fornecidos pelo Steam
      </motion.div>
    </div>
  );
}

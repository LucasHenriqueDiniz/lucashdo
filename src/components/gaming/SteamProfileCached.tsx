'use client';

import type { Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import { FaClock, FaGamepad, FaSteam, FaTrophy } from 'react-icons/fa';
import { SiSteam } from 'react-icons/si';
import Image from 'next/image';
import { useSteamStats } from '@/hooks/useSteamStats';

interface SteamProfileProps {
  className?: string;
}

export default function SteamProfile({ className = '' }: SteamProfileProps) {
  // 🚀 Nova implementação usando hook com cache inteligente
  const { stats, isLoading, error } = useSteamStats();

  // Format playtime from minutes to readable format
  const formatPlaytime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h`;
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  };

  if (isLoading) {
    return (
      <div
        className={`bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 ${className}`}
      >
        <div className="flex items-center gap-3 mb-4">
          <SiSteam className="text-2xl text-blue-600 dark:text-blue-400" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Steam Profile</h3>
        </div>

        {/* Loading skeleton */}
        <div className="space-y-4 animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 ${className}`}
      >
        <div className="flex items-center gap-3 mb-4">
          <SiSteam className="text-2xl text-red-600 dark:text-red-400" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Steam Profile</h3>
        </div>

        <div className="text-center py-8">
          <FaSteam className="text-4xl text-red-500 mx-auto mb-3" />
          <p className="text-red-600 dark:text-red-400 mb-2">{error}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Dados em cache podem estar sendo exibidos
          </p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div
        className={`bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 ${className}`}
      >
        <div className="flex items-center gap-3 mb-4">
          <SiSteam className="text-2xl text-gray-600 dark:text-gray-400" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Steam Profile</h3>
        </div>
        <p className="text-gray-500 dark:text-gray-400">Nenhum dado disponível</p>
      </div>
    );
  }

  return (
    <motion.div
      className={`bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <SiSteam className="text-2xl text-blue-600 dark:text-blue-400" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Steam Profile</h3>
      </div>

      {/* Profile Info */}
      {stats.profile && (
        <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
          <Image
            src={stats.profile.avatarfull}
            alt={stats.profile.personaname}
            width={64}
            height={64}
            className="rounded-full border-2 border-blue-300 dark:border-blue-600"
          />
          <div>
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              {stats.profile.personaname}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {stats.profile.realname || 'Steam Gamer'}
            </p>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-700 rounded-lg p-4 text-center"
        >
          <FaGamepad className="text-2xl text-green-600 dark:text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalGames}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Jogos</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-700 rounded-lg p-4 text-center"
        >
          <FaClock className="text-2xl text-orange-600 dark:text-orange-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatPlaytime(stats.totalPlaytime)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Total</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-700 rounded-lg p-4 text-center"
        >
          <FaTrophy className="text-2xl text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.mostPlayedGames?.length || 0}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Favoritos</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-700 rounded-lg p-4 text-center"
        >
          <FaSteam className="text-2xl text-blue-600 dark:text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.recentGames?.length || 0}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Recentes</p>
        </motion.div>
      </div>

      {/* Most Played Games */}
      {stats.mostPlayedGames && stats.mostPlayedGames.length > 0 && (
        <motion.div variants={itemVariants} className="mt-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Mais Jogados</h4>
          <div className="space-y-2">
            {stats.mostPlayedGames.slice(0, 3).map(game => (
              <div
                key={game.appid}
                className="flex items-center justify-between bg-white dark:bg-gray-700 rounded-lg p-3"
              >
                <span className="text-sm font-medium text-gray-900 dark:text-white truncate flex-1">
                  {game.name}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">
                  {formatPlaytime(game.playtime_forever)}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Cache status indicator (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          💾 Dados com cache inteligente
        </div>
      )}
    </motion.div>
  );
}

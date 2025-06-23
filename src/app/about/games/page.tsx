'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaSteam,
  FaGamepad,
  FaClock,
  FaTrophy,
  FaWindows,
  FaApple,
  FaLinux,
  FaChartLine,
  FaCalendarAlt,
  FaGamepad as FaSteamDeck,
} from 'react-icons/fa';
import { SiSteam } from 'react-icons/si';
import Image from 'next/image';
import { getSteamStats, SteamStats } from '@/services/steam';

export default function GamesPage() {
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-96 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse flex items-center justify-center">
          <span className="text-gray-500">Carregando dados do Steam...</span>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-96 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
          <span className="text-red-500">{error || 'Dados não disponíveis'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <motion.div
        className="bg-white dark:bg-gray-800/50 rounded-lg p-8 mb-8 flex items-center gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src={stats.profile?.avatarfull ?? ''}
          alt={stats.profile?.personaname ?? ''}
          className="w-32 h-32 rounded-full"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold flex items-center gap-3 mb-2">
            {stats.profile?.personaname}
            <FaSteam className="text-blue-500" />
          </h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">País</p>
              <p className="font-medium">{stats.profile?.loccountrycode || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Membro desde</p>
              <p className="font-medium">
                {stats.profile?.timecreated
                  ? new Date(stats.profile.timecreated * 1000).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
              <p className="font-medium">
                {stats.profile?.personastate === 0
                  ? 'Offline'
                  : stats.profile?.personastate === 1
                    ? 'Online'
                    : 'Away'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Último login</p>
              <p className="font-medium">
                {stats.profile?.lastlogoff
                  ? new Date(stats.profile.lastlogoff * 1000).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          className="bg-white dark:bg-gray-800/50 rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
              <FaGamepad className="text-blue-500 dark:text-blue-400 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total de Jogos</p>
              <p className="text-2xl font-bold">{stats.totalGames}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800/50 rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
              <FaClock className="text-purple-500 dark:text-purple-400 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Tempo Total</p>
              <p className="text-2xl font-bold">{formatPlaytime(stats.totalPlaytime)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800/50 rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
              <FaTrophy className="text-green-500 dark:text-green-400 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Jogos Recentes</p>
              <p className="text-2xl font-bold">{stats.recentGames.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800/50 rounded-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full">
              <FaCalendarAlt className="text-yellow-500 dark:text-yellow-400 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Último Jogo</p>
              <p className="text-2xl font-bold">
                {stats.lastPlayed ? new Date(stats.lastPlayed * 1000).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Platform Stats */}
      <motion.div
        className="bg-white dark:bg-gray-800/50 rounded-lg p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <FaChartLine className="text-blue-500" />
          Tempo por Plataforma
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-4">
            <FaWindows className="text-blue-500 text-2xl" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Windows</p>
              <p className="font-medium">{formatPlaytime(stats.totalPlaytimeWindows)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <FaApple className="text-gray-500 text-2xl" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Mac</p>
              <p className="font-medium">{formatPlaytime(stats.totalPlaytimeMac)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <FaLinux className="text-orange-500 text-2xl" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Linux</p>
              <p className="font-medium">{formatPlaytime(stats.totalPlaytimeLinux)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <FaSteamDeck className="text-blue-500 text-2xl" />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Steam Deck</p>
              <p className="font-medium">{formatPlaytime(stats.totalPlaytimeDeck)}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Games */}
      <motion.div
        className="bg-white dark:bg-gray-800/50 rounded-lg p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <FaClock className="text-green-500" />
          Jogos Recentes
        </h2>
        <div className="space-y-4">
          {stats.recentGames.map(game => (
            <div
              key={game.appid}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={`https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
                  alt={game.name}
                  className="w-16 h-16 rounded"
                />
                <div>
                  <p className="font-medium text-lg">{game.name}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatPlaytime(game.playtime_forever)}
                    </p>
                    {game.playtime_2weeks && (
                      <p className="text-sm text-green-500">
                        +{formatPlaytime(game.playtime_2weeks)} nas últimas 2 semanas
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {game.has_community_visible_stats && (
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded">
                    Estatísticas
                  </span>
                )}
                {game.has_leaderboards && (
                  <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 text-xs rounded">
                    Rankings
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Most Played Games */}
      <motion.div
        className="bg-white dark:bg-gray-800/50 rounded-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <FaTrophy className="text-yellow-500" />
          Jogos Mais Jogados
        </h2>
        <div className="space-y-4">
          {stats.mostPlayedGames.map((game, index) => (
            <div
              key={game.appid}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/70 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-gray-400">{index + 1}</span>
                <Image
                  src={`https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
                  alt={game.name}
                  className="w-16 h-16 rounded"
                />
                <div>
                  <p className="font-medium text-lg">{game.name}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formatPlaytime(game.playtime_forever)}
                    </p>
                    {game.playtime_2weeks && (
                      <p className="text-sm text-green-500">
                        +{formatPlaytime(game.playtime_2weeks)} nas últimas 2 semanas
                      </p>
                    )}
                    {game.rtime_last_played && (
                      <p className="text-sm text-blue-500">
                        Último jogo: {new Date(game.rtime_last_played * 1000).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {game.has_community_visible_stats && (
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs rounded">
                    Estatísticas
                  </span>
                )}
                {game.has_leaderboards && (
                  <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 text-xs rounded">
                    Rankings
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Steam Attribution */}
      <div className="mt-8 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
        <SiSteam className="text-blue-500" />
        Dados fornecidos pelo Steam
      </div>
    </div>
  );
}

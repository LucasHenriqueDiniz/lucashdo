'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getUserInfo } from '@/services/lastfm';

interface LastFmStatsProps {
  username: string;
  className?: string;
}

interface UserStats {
  name: string;
  playcount: string;
  registered: {
    unixtime: string;
    '#text': string;
  };
}

export default function LastFmStats({ username, className = '' }: LastFmStatsProps) {
  const [data, setData] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        setIsLoading(true);
        const stats = await getUserInfo(username);
        setData(stats);
        setError(null);
      } catch (err) {
        setError('Não foi possível carregar estatísticas');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [username]);

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
    visible: { opacity: 1, y: 0 },
  };

  const formatNumber = (num: string): string => {
    return parseInt(num).toLocaleString();
  };

  return (
    <div className={`lastfm-stats ${className}`}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-rows-2 gap-2 md:gap-4"
      >
        {isLoading ? (
          <>
            {Array(2)
              .fill(0)
              .map((_, idx) => (
                <div key={idx} className="animate-pulse bg-gray-800 p-3 md:p-4 rounded-lg">
                  <div className="h-4 bg-gray-700 rounded w-16 mb-2"></div>
                  <div className="h-6 bg-gray-700 rounded w-12"></div>
                </div>
              ))}
          </>
        ) : error ? (
          <div className="col-span-3 text-red-500 text-center">
            Não foi possível carregar estatísticas
          </div>
        ) : !data ? (
          <div className="col-span-3 text-gray-500 text-center">Nenhum dado encontrado</div>
        ) : (
          <>
            <motion.div
              variants={itemVariants}
              className="bg-gray-800/50 p-3 md:p-4 rounded-lg text-center"
            >
              <p className="text-xs text-gray-400 mb-1">Músicas</p>
              <p className="text-lg md:text-2xl font-bold text-primary">
                {formatNumber(data.playcount)}
              </p>
            </motion.div>
            <motion.div
              variants={itemVariants}
              className="bg-gray-800/50 p-3 md:p-4 rounded-lg text-center"
            >
              <p className="text-xs text-gray-400 mb-1">Por Dia</p>
              <p className="text-lg md:text-2xl font-bold text-primary">
                {data.registered?.unixtime
                  ? Math.round(
                      parseInt(data.playcount) /
                        ((Date.now() / 1000 - parseInt(data.registered.unixtime)) / 86400)
                    ).toString()
                  : '0'}
              </p>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}

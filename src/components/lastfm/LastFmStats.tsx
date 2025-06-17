'use client';

import { getUserInfo } from '@/services/lastfm';
import React from 'react';
import { motion } from 'framer-motion';
import useSWR from 'swr';

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

const statsFetcher = (username: string) => getUserInfo(username);

export default function LastFmStats({ username, className = '' }: LastFmStatsProps) {
  // Use SWR for better data fetching with caching
  const { data, error, isLoading } = useSWR(username, statsFetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 1000 * 60 * 60 * 6, // 6 hours - stats don't change frequently
    refreshInterval: 1000 * 60 * 60 * 24, // Update once per day
    revalidateIfStale: false, // Don't revalidate just because data is stale
  });

  const calculateYearsOnLastfm = (registeredUnixtime?: string): string => {
    if (!registeredUnixtime) return '0';

    const registeredDate = new Date(parseInt(registeredUnixtime) * 1000);
    const now = new Date();

    const years = now.getFullYear() - registeredDate.getFullYear();

    // Adjust for if the current date is before the anniversary date
    const isBefore =
      now.getMonth() < registeredDate.getMonth() ||
      (now.getMonth() === registeredDate.getMonth() && now.getDate() < registeredDate.getDate());

    return isBefore ? (years - 1).toString() : years.toString();
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
        className="grid grid-cols-3 gap-2 md:gap-4"
      >
        {isLoading ? (
          <>
            {Array(3)
              .fill(0)
              .map((_, idx) => (
                <div key={idx} className="animate-pulse bg-gray-800 p-3 md:p-4 rounded-lg">
                  {' '}
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
            {' '}
            <motion.div
              variants={itemVariants}
              className="bg-gray-800/50 p-3 md:p-4 rounded-lg text-center"
            >
              <p className="text-xs text-gray-400 mb-1">Músicas</p>
              <p className="text-lg md:text-2xl font-bold text-primary">
                {formatNumber(data.playcount)}
              </p>
            </motion.div>{' '}
            <motion.div
              variants={itemVariants}
              className="bg-gray-800/50 p-3 md:p-4 rounded-lg text-center"
            >
              <p className="text-xs text-gray-400 mb-1">Anos</p>
              <p className="text-lg md:text-2xl font-bold text-primary">
                {calculateYearsOnLastfm(data.registered?.unixtime)}
              </p>
            </motion.div>{' '}
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

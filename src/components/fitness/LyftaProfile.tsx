'use client';

import type { AnimationGeneratorType } from 'framer-motion';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
  FaCalendarCheck,
  FaChartLine,
  FaDumbbell,
  FaRegClock,
  FaWeightHanging,
} from 'react-icons/fa';
import { SiLyft } from 'react-icons/si';
import { TbFlame } from 'react-icons/tb';
import { getLyftaStats, LyftaStats } from '@/services/lyfta';

interface LyftaProfileProps {
  className?: string;
}

export default function LyftaProfile({ className = '' }: LyftaProfileProps) {
  const [stats, setStats] = useState<LyftaStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const data = await getLyftaStats();
        setStats(data);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar dados de treino');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Format duration from seconds to readable format
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} min`;
  };

  // Format weight in kg
  const formatWeight = (kg: number): string => {
    return `${Math.round(kg)} kg`;
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
          <span className="text-[color:var(--muted-foreground)]">
            Carregando dados de treino...
          </span>
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
    <div className={`lyfta-profile ${className}`}>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Stat Card: Total Workouts */}
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
            <FaDumbbell className="text-[color:var(--blue)] dark:text-[color:var(--blue)] text-xl" />
          </div>
          <div className="relative z-10">
            <p className="text-sm text-gray-500 dark:text-[color:var(--muted-foreground)]">
              Total de Treinos
            </p>
            <p className="text-2xl font-bold">{stats.totalWorkouts}</p>
          </div>
        </motion.div>

        {/* Stat Card: Total Weight */}
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
            <FaWeightHanging className="text-[color:var(--accent)] dark:text-[color:var(--accent)] text-xl" />
          </div>
          <div className="relative z-10">
            <p className="text-sm text-gray-500 dark:text-[color:var(--muted-foreground)]">
              Peso Total
            </p>
            <p className="text-2xl font-bold">{formatWeight(stats.totalLiftedWeight)}</p>
          </div>
        </motion.div>

        {/* Stat Card: Current Streak */}
        <motion.div
          className="bg-white dark:bg-[color:var(--card)]/50 rounded-lg p-4 shadow-sm flex items-center gap-4 relative overflow-hidden group"
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[color:var(--amber)]/10 to-transparent z-0 opacity-0 group-hover:opacity-100"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          <div className="bg-[color:var(--amber)]/20 dark:bg-[color:var(--amber)]/30 p-3 rounded-full relative z-10">
            <TbFlame className="text-[color:var(--amber)] dark:text-[color:var(--amber)] text-xl" />
          </div>
          <div className="relative z-10">
            <p className="text-sm text-gray-500 dark:text-[color:var(--muted-foreground)]">
              Sequência Atual
            </p>
            <p className="text-2xl font-bold">{stats.currentStreak} semanas</p>
            {stats.longestStreak > 0 && (
              <p className="text-xs text-gray-400 dark:text-[color:var(--muted-foreground)]">
                Recorde: {stats.longestStreak} semanas
              </p>
            )}
          </div>
        </motion.div>

        {/* Stat Card: Total Time */}
        <motion.div
          className="bg-white dark:bg-[color:var(--card)]/50 rounded-lg p-4 shadow-sm flex items-center gap-4 relative overflow-hidden group"
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-[color:var(--cyan)]/10 to-transparent z-0 opacity-0 group-hover:opacity-100"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
          <div className="bg-[color:var(--cyan)]/20 dark:bg-[color:var(--cyan)]/30 p-3 rounded-full relative z-10">
            <FaRegClock className="text-[color:var(--cyan)] dark:text-[color:var(--cyan)] text-xl" />
          </div>
          <div className="relative z-10">
            <p className="text-sm text-gray-500 dark:text-[color:var(--muted-foreground)]">
              Tempo Total
            </p>
            <p className="text-2xl font-bold">{formatDuration(stats.totalDuration)}</p>
          </div>
        </motion.div>
      </motion.div>{' '}
      {/* Activity Calendar */}
      <motion.div
        className="bg-white dark:bg-[color:var(--card)]/50 rounded-lg p-6 shadow-sm mb-6 relative overflow-hidden group"
        variants={itemVariants}
        whileHover={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[color:var(--blue)]/5 via-[color:var(--cyan)]/5 to-transparent z-0 opacity-0 group-hover:opacity-100"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2 relative z-10">
          <FaCalendarCheck className="text-[color:var(--cyan)]" />
          Calendário de Atividade
          <motion.span
            className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--cyan)]"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.2, duration: 0.8 }}
          />
        </h3>

        {/* GitHub-style Activity Calendar */}
        <div className="flex flex-col gap-1 relative z-10">
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-[2px] mb-1">
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(day => (
              <div
                key={day}
                className="text-center text-xs text-gray-500 dark:text-[color:var(--muted-foreground)]"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-[2px]">
            {stats.workoutStreak.map((day, index) => {
              // Define intensity classes based on count
              const getIntensityClass = (count: number) => {
                if (count === 0) return 'bg-gray-100 dark:bg-gray-800/30';
                if (count === 1) return 'bg-emerald-200 dark:bg-emerald-900/40';
                if (count === 2) return 'bg-emerald-300 dark:bg-emerald-700/50';
                if (count === 3) return 'bg-emerald-400 dark:bg-emerald-600/70';
                return 'bg-emerald-500 dark:bg-emerald-500/80'; // 4+
              };

              return (
                <motion.div
                  key={day.date}
                  className={`w-4 h-4 rounded-sm ${getIntensityClass(day.count)}`}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.003, duration: 0.2 }}
                  title={`${day.date}: ${day.count} treino${day.count !== 1 ? 's' : ''}`}
                  whileHover={{
                    scale: 1.3,
                    transition: { duration: 0.2 },
                    zIndex: 20,
                  }}
                />
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end mt-2 text-xs text-gray-500 dark:text-[color:var(--muted-foreground)] gap-2">
            <span>Menos</span>
            <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800/30"></div>
            <div className="w-3 h-3 rounded-sm bg-emerald-200 dark:bg-emerald-900/40"></div>
            <div className="w-3 h-3 rounded-sm bg-emerald-300 dark:bg-emerald-700/50"></div>
            <div className="w-3 h-3 rounded-sm bg-emerald-400 dark:bg-emerald-600/70"></div>
            <div className="w-3 h-3 rounded-sm bg-emerald-500 dark:bg-emerald-500/80"></div>
            <span>Mais</span>
          </div>
        </div>
      </motion.div>
      {/* Exercise Stats */}
      <motion.div
        className="bg-white dark:bg-[color:var(--card)]/50 rounded-lg p-6 shadow-sm relative overflow-hidden group"
        variants={itemVariants}
        whileHover={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        {' '}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[color:var(--cyan)]/5 via-[color:var(--blue)]/5 to-transparent z-0 opacity-0 group-hover:opacity-100"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        <motion.div
          className="absolute -top-12 -right-12 w-32 h-32 bg-[color:var(--cyan)]/10 rounded-full blur-2xl opacity-0 group-hover:opacity-30"
          initial={{ scale: 0.8 }}
          whileHover={{ scale: 1.2 }}
          transition={{ duration: 1 }}
        />
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2 relative z-10">
          <FaChartLine className="text-[color:var(--cyan)]" />
          Estatísticas de Exercícios
          <motion.span
            className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--cyan)]"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.3, duration: 0.8 }}
          />
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
          <motion.div className="text-center" variants={itemVariants}>
            <p className="text-sm text-gray-500 dark:text-[color:var(--muted-foreground)]">
              Exercícios Favoritos
            </p>
            <p className="text-xl font-bold">{stats.favoriteExercise}</p>
          </motion.div>
          <motion.div className="text-center" variants={itemVariants}>
            <p className="text-sm text-gray-500 dark:text-[color:var(--muted-foreground)]">
              Total de Exercícios
            </p>
            <p className="text-xl font-bold">{stats.exerciseStats.totalExercises}</p>
          </motion.div>
          <motion.div className="text-center" variants={itemVariants}>
            <p className="text-sm text-gray-500 dark:text-[color:var(--muted-foreground)]">
              Peso Mais Usado
            </p>
            <p className="text-xl font-bold">{formatWeight(stats.exerciseStats.mostUsedWeight)}</p>
          </motion.div>{' '}
          <motion.div className="text-center" variants={itemVariants}>
            <p className="text-sm text-gray-500 dark:text-[color:var(--muted-foreground)]">
              Média de Repetições
            </p>
            <p className="text-xl font-bold">{Math.round(stats.exerciseStats.averageReps)}</p>
          </motion.div>
        </div>
      </motion.div>
      {/* Lyfta Attribution */}
      <motion.div
        className="mt-4 text-sm text-gray-500 dark:text-[color:var(--muted-foreground)] flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <SiLyft className="text-[color:var(--cyan)]" />
        Dados fornecidos pelo Lyfta
      </motion.div>
    </div>
  );
}

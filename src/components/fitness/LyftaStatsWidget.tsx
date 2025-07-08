'use client';

import { motion } from 'framer-motion';
import { FaDumbbell, FaFire, FaTrophy, FaClock } from 'react-icons/fa';
import { GiMuscleUp } from 'react-icons/gi';
import { useLyftaStats } from '@/hooks/useLyfta';

interface LyftaStatsWidgetProps {
  className?: string;
}

export function LyftaStatsWidget({ className = '' }: LyftaStatsWidgetProps) {
  const { stats, isLoading, error } = useLyftaStats();

  const containerVariants = {
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

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    return `${hours}h`;
  };

  const formatWeight = (kg: number): string => {
    return `${kg.toLocaleString()}kg`;
  };

  if (isLoading) {
    return (
      <div
        className={`bg-gradient-to-br from-orange-50 to-red-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 ${className}`}
      >
        <div className="flex items-center gap-3 mb-6">
          <GiMuscleUp className="text-2xl text-orange-600 dark:text-orange-400" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Fitness Stats</h3>
        </div>

        <div className="space-y-4 animate-pulse">
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
          <GiMuscleUp className="text-2xl text-red-600 dark:text-red-400" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Fitness Stats</h3>
        </div>

        <div className="text-center py-8">
          <FaDumbbell className="text-4xl text-red-500 mx-auto mb-3" />
          <p className="text-red-600 dark:text-red-400 mb-2">Failed to load fitness data</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Cached data may be displayed</p>
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
          <GiMuscleUp className="text-2xl text-gray-600 dark:text-gray-400" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Fitness Stats</h3>
        </div>
        <p className="text-gray-500 dark:text-gray-400">No fitness data available</p>
      </div>
    );
  }

  return (
    <motion.div
      className={`bg-gradient-to-br from-orange-50 to-red-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <GiMuscleUp className="text-2xl text-orange-600 dark:text-orange-400" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Fitness Stats</h3>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-700 rounded-lg p-4 text-center"
        >
          <FaDumbbell className="text-2xl text-orange-600 dark:text-orange-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {Number.isFinite(stats.totalWorkouts) ? stats.totalWorkouts : 0}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Workouts</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-700 rounded-lg p-4 text-center"
        >
          <FaClock className="text-2xl text-blue-600 dark:text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {Number.isFinite(stats.totalDuration) ? formatDuration(stats.totalDuration) : '0h'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Total Time</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-700 rounded-lg p-4 text-center"
        >
          <FaTrophy className="text-2xl text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {Number.isFinite(stats.totalLiftedWeight)
              ? formatWeight(stats.totalLiftedWeight)
              : '0kg'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Total Lifted</p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-700 rounded-lg p-4 text-center"
        >
          <FaFire className="text-2xl text-red-600 dark:text-red-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {Number.isFinite(stats.currentStreak) ? stats.currentStreak : 0}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">Week Streak</p>
        </motion.div>
      </div>

      {/* Favorite Exercise */}
      {stats.favoriteExercise && stats.favoriteExercise !== 'Nenhum' && (
        <motion.div variants={itemVariants} className="mb-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Favorite Exercise
          </h4>
          <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {stats.favoriteExercise}
            </p>
          </div>
        </motion.div>
      )}

      {/* Top Muscle Groups */}
      {stats.topMuscleGroups && stats.topMuscleGroups.length > 0 && (
        <motion.div variants={itemVariants}>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Top Muscle Groups
          </h4>
          <div className="space-y-2">
            {stats.topMuscleGroups.slice(0, 3).map((group, index) => (
              <div
                key={group.name + '-' + index}
                className="flex items-center justify-between bg-white dark:bg-gray-700 rounded-lg p-3"
              >
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {group.name}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {Number.isFinite(group.count) ? group.count : 0} workouts
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Cache indicator em development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          💾 Fitness data cached intelligently
        </div>
      )}
    </motion.div>
  );
}

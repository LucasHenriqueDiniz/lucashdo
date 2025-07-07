'use client';

import { motion } from 'framer-motion';
import { LuCode, LuGraduationCap, LuStar, LuUsers, LuAward, LuTrendingUp } from 'react-icons/lu';
import { useTranslations } from 'next-intl';

export default function AboutStats() {
  const t = useTranslations('About.stats');

  const stats = [
    {
      icon: LuCode,
      value: '3+',
      label: t('yearsExperience'),
      description: t('yearsExperienceDesc'),
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      icon: LuGraduationCap,
      value: '15+',
      label: t('projectsCompleted'),
      description: t('projectsCompletedDesc'),
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
    },
    {
      icon: LuStar,
      value: '20+',
      label: t('technologies'),
      description: t('technologiesDesc'),
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
    },
    {
      icon: LuUsers,
      value: '100%',
      label: t('clientSatisfaction'),
      description: t('clientSatisfactionDesc'),
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
    },
    {
      icon: LuAward,
      value: '24/7',
      label: t('availability'),
      description: t('availabilityDesc'),
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
    },
    {
      icon: LuTrendingUp,
      value: '∞',
      label: t('learning'),
      description: t('learningDesc'),
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          className={`p-6 rounded-xl border ${stat.bgColor} ${stat.borderColor} hover:shadow-lg transition-all duration-300 group`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5, scale: 1.02 }}
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} text-white`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {stat.label}
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 leading-relaxed">
            {stat.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

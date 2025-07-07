'use client';

import { motion } from 'framer-motion';
import { LuHeart, LuTarget, LuZap, LuUsers, LuLightbulb, LuShield } from 'react-icons/lu';
import { useTranslations } from 'next-intl';

export default function AboutValues() {
  const t = useTranslations('About.values');

  const values = [
    {
      icon: LuHeart,
      title: t('passion.title'),
      description: t('passion.description'),
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
    },
    {
      icon: LuTarget,
      title: t('excellence.title'),
      description: t('excellence.description'),
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      icon: LuZap,
      title: t('innovation.title'),
      description: t('innovation.description'),
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
    },
    {
      icon: LuUsers,
      title: t('collaboration.title'),
      description: t('collaboration.description'),
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
    },
    {
      icon: LuLightbulb,
      title: t('creativity.title'),
      description: t('creativity.description'),
      color: 'from-purple-500 to-violet-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
    },
    {
      icon: LuShield,
      title: t('integrity.title'),
      description: t('integrity.description'),
      color: 'from-gray-500 to-slate-500',
      bgColor: 'bg-gray-500/10',
      borderColor: 'border-gray-500/20',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h3 className="text-2xl font-bold mb-4">Meus Valores</h3>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Os princípios que guiam minha jornada como desenvolvedor e moldam minha abordagem para
          cada projeto.
        </p>
      </motion.div>

      {/* Values grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {values.map((value, index) => (
          <motion.div
            key={index}
            className={`p-6 rounded-xl border ${value.bgColor} ${value.borderColor} hover:shadow-lg transition-all duration-300 group`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-r ${value.color} text-white`}>
                <value.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{value.title}</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{value.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

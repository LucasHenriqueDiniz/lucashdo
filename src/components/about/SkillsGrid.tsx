'use client';

import { AnimatePresence, motion } from 'framer-motion';
import type { MouseEvent } from 'react';
import { useState } from 'react';
import { LuBriefcase, LuCode, LuStar, LuX } from 'react-icons/lu';
import { useTranslations } from 'next-intl';
import { SkillDataType } from '@/constants/skillsData';

// Adicionar tipagem para as chaves possíveis de skillCategories
const skillCategoryKeys = [
  'frontend',
  'backend',
  'mobile',
  'desktop',
  'devops',
  'database',
  'tools',
  'design',
  'other',
] as const;

type SkillCategoryKey = (typeof skillCategoryKeys)[number];

const skillCategories: Record<
  SkillCategoryKey,
  {
    label: string;
    color: string;
    textColor: string;
    bgColor: string;
  }
> = {
  frontend: {
    label: 'Frontend',
    color: 'bg-blue-500/90 dark:bg-blue-600/90',
    textColor: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
  },
  backend: {
    label: 'Backend',
    color: 'bg-green-500/90 dark:bg-green-600/90',
    textColor: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
  },
  mobile: {
    label: 'Mobile',
    color: 'bg-purple-500/90 dark:bg-purple-600/90',
    textColor: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
  },
  desktop: {
    label: 'Desktop',
    color: 'bg-orange-500/90 dark:bg-orange-600/90',
    textColor: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
  },
  devops: {
    label: 'DevOps',
    color: 'bg-amber-500/90 dark:bg-amber-600/90',
    textColor: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
  },
  database: {
    label: 'Database',
    color: 'bg-teal-500/90 dark:bg-teal-600/90',
    textColor: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-50 dark:bg-teal-900/20',
  },
  tools: {
    label: 'Tooling',
    color: 'bg-gray-500/90 dark:bg-gray-600/90',
    textColor: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-50 dark:bg-gray-900/20',
  },
  design: {
    label: 'UI/UX',
    color: 'bg-fuchsia-500/90 dark:bg-fuchsia-600/90',
    textColor: 'text-fuchsia-600 dark:text-fuchsia-400',
    bgColor: 'bg-fuchsia-50 dark:bg-fuchsia-900/20',
  },
  other: {
    label: 'Other',
    color: 'bg-slate-500/90 dark:bg-slate-600/90',
    textColor: 'text-slate-600 dark:text-slate-400',
    bgColor: 'bg-slate-50 dark:bg-slate-900/20',
  },
};

interface SkillsGridProps {
  skills: SkillDataType[];
}

export default function SkillsGrid({ skills }: SkillsGridProps) {
  const t = useTranslations('About.skills');
  const [selectedCategory, setSelectedCategory] = useState<SkillCategoryKey | null>(null);

  // Get unique categories and sort them for consistent display
  const categories = [...new Set(skills.map(skill => skill.category))]
    .filter((cat): cat is SkillCategoryKey => skillCategoryKeys.includes(cat as SkillCategoryKey))
    .sort();

  const handleCategoryChange = (category: SkillCategoryKey | null) => {
    if (category === selectedCategory) return;
    setSelectedCategory(category);
  };

  // Filtragem aprimorada
  const filteredSkills = selectedCategory
    ? skills.filter(skill => skill.category === selectedCategory)
    : skills;

  // Ordenação otimizada
  const sortFn = (a: SkillDataType, b: SkillDataType) => {
    if (!!a.featured !== !!b.featured) return a.featured ? -1 : 1;
    const expA = (a.proexp || 0) + (a.exp || 0);
    const expB = (b.proexp || 0) + (b.exp || 0);
    if (expA !== expB) return expB - expA;
    if ((a.order ?? 999) !== (b.order ?? 999)) return (a.order ?? 999) - (b.order ?? 999);
    return a.name.localeCompare(b.name);
  };

  const sortedSkills = [...filteredSkills].sort(sortFn);

  // Animações mais fluidas
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  // Corrigir o erro de tipagem do framer-motion para o variants
  const itemVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 20,
      filter: 'blur(4px)',
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -10,
      filter: 'blur(4px)',
      transition: {
        duration: 0.2,
      },
    },
  };

  // Animação para o contador de skills
  const countVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3,
        duration: 0.5,
      },
    },
  };

  return (
    <div className="skills-grid">
      {/* Enhanced category filter with animations */}
      <motion.div
        className="flex flex-wrap justify-center gap-3 mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.button
          onClick={() => handleCategoryChange(null)}
          className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all relative overflow-hidden
              ${
                !selectedCategory
                  ? 'bg-[color:var(--primary)] text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Efeito de ondulação para botão ativo */}
          {!selectedCategory && (
            <motion.div
              className="absolute inset-0 bg-white/20 rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1.2, 0],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
          <span className="relative z-10">{t('all')}</span>
        </motion.button>

        {categories.map((category, idx) => (
          <motion.button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 relative overflow-hidden
              ${
                selectedCategory === category
                  ? `${skillCategories[category]?.color || ''} text-white shadow-lg`
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.1 + idx * 0.05,
              duration: 0.3,
            }}
          >
            {/* Indicador de cor animado */}
            <motion.span
              className={`w-2 h-2 rounded-full ${skillCategories[category]?.color || ''}`}
              animate={
                selectedCategory === category
                  ? {
                      scale: [1, 1.2, 1],
                    }
                  : {}
              }
              transition={{
                duration: 1.5,
                repeat: selectedCategory === category ? Infinity : 0,
                ease: 'easeInOut',
              }}
            />

            {skillCategories[category]?.label || category}

            {/* Botão de fechar com animação */}
            <AnimatePresence>
              {selectedCategory === category && (
                <motion.span
                  className="ml-1 text-white/80 hover:text-white cursor-pointer"
                  onClick={(e: MouseEvent) => {
                    e.stopPropagation();
                    handleCategoryChange(null);
                  }}
                  initial={{ opacity: 0, scale: 0, rotate: 90 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0, rotate: -90 }}
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  role="button"
                  tabIndex={0}
                  aria-label="Limpar filtro"
                >
                  <LuX size={12} />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </motion.div>

      {/* Contador de skills com animação */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory || 'all'}
          className="text-center mb-6"
          variants={countVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {sortedSkills.length} {sortedSkills.length === 1 ? 'skill' : 'skills'}
            {selectedCategory &&
              ` em ${skillCategories[selectedCategory]?.label || selectedCategory}`}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Grid de skills com animações aprimoradas */}
      <AnimatePresence mode="wait">
        <motion.ul
          key={selectedCategory || 'all'}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 justify-center items-stretch relative list-none p-0 m-0 min-h-[224px]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {sortedSkills.length === 0 && (
            <motion.div
              className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {t('noSkills')}
            </motion.div>
          )}

          {sortedSkills.map((skill, index) => (
            <motion.li
              key={skill.name}
              className={`bg-white dark:bg-gray-800/50 rounded-lg p-3 flex flex-col items-center text-center h-full min-h-[220px] max-h-full hover:shadow-xl transition-all relative overflow-hidden backdrop-blur-sm ${skill.featured ? 'ring-2 ring-[color:var(--primary)]/30' : ''} border border-gray-100 dark:border-gray-700/50`}
              style={{
                width: '100%',
                maxWidth: 180,
                height: '100%',
                minHeight: 220,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'stretch',
              }}
              variants={itemVariants}
              whileHover={{
                y: -5,
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              role="listitem"
            >
              {/* Gradiente de categoria animado */}
              <motion.div
                className={`absolute top-0 left-0 w-full h-1 ${
                  skillCategories[skill.category as SkillCategoryKey]?.color || ''
                }`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              />

              {/* Brilho de hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 pointer-events-none"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />

              {/* Ícone da skill com animação */}
              <motion.div
                className={`mb-3 p-2.5 rounded-full ${skillCategories[skill.category as SkillCategoryKey]?.bgColor || ''} group relative z-10`}
                whileHover={{
                  scale: 1.1,
                  rotate: 5,
                }}
                transition={{ duration: 0.2 }}
              >
                <skill.icon
                  className={`w-6 h-6 ${skillCategories[skill.category as SkillCategoryKey]?.textColor || ''}`}
                />
              </motion.div>

              {/* Nome da skill */}
              <motion.h3
                className="font-medium text-base mb-1.5 relative z-10"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {skill.name}
              </motion.h3>

              {/* Experiência com animações */}
              <motion.div
                className="text-xs mt-auto flex flex-col justify-start gap-1 w-full relative z-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 + 0.2 }}
              >
                <span className="font-medium text-gray-700 dark:text-gray-300">Experiência:</span>

                <div className="flex flex-col gap-2 items-center w-full">
                  <AnimatePresence>
                    {skill.proexp > 0 && (
                      <motion.div
                        className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/20 px-2 py-0.5 rounded w-full justify-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <LuBriefcase size={12} className="text-blue-600 dark:text-blue-400" />
                        <span className="text-blue-600 dark:text-blue-400">
                          {skill.proexp} {skill.proexp > 1 ? 'anos' : 'ano'}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {skill.exp > 0 && (
                      <motion.div
                        className="flex items-center gap-1 bg-purple-100 dark:bg-purple-900/20 px-2 py-0.5 rounded w-full justify-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <LuCode size={12} className="text-purple-600 dark:text-purple-400" />
                        <span className="text-purple-600 dark:text-purple-400">
                          {skill.exp} {skill.exp > 1 ? 'anos' : 'ano'}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {skill.proexp === 0 && skill.exp === 0 && (
                    <motion.span
                      className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-500 dark:text-gray-400 w-full flex items-center justify-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      Em aprendizado
                    </motion.span>
                  )}
                </div>
              </motion.div>

              {/* Indicador de destaque com animação */}
              <AnimatePresence>
                {skill.featured && (
                  <motion.div
                    className="absolute top-1.5 right-1.5 z-20"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{
                      scale: 1,
                      rotate: 0,
                      transition: {
                        delay: index * 0.05 + 0.3,
                        duration: 0.4,
                        type: 'spring',
                        stiffness: 300,
                        damping: 20,
                      },
                    }}
                    whileHover={{
                      scale: 1.2,
                      rotate: 360,
                      transition: { duration: 0.3 },
                    }}
                  >
                    <span className="flex items-center justify-center w-5 h-5 bg-[color:var(--amber)]/90 text-white rounded-full shadow-lg">
                      <LuStar size={12} />
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          ))}
        </motion.ul>
      </AnimatePresence>

      {/* Legenda com animação */}
      <motion.div
        className="text-center text-sm text-gray-600 dark:text-gray-400 mt-8 max-w-2xl mx-auto bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700/50 shadow-sm backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <div className="font-medium mb-3 text-gray-700 dark:text-gray-300">{t('legend.title')}</div>
        <motion.div
          className="flex flex-wrap justify-center gap-4 items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          {[
            { icon: LuBriefcase, color: 'blue', label: t('legend.professional') },
            { icon: LuCode, color: 'purple', label: t('legend.personal') },
            { icon: LuStar, color: 'amber', label: t('legend.favorites') },
          ].map(({ icon: Icon, color, label }, index) => (
            <motion.div
              key={label}
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + index * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <div
                className={`flex items-center justify-center w-6 h-6 ${
                  color === 'amber'
                    ? 'bg-[color:var(--amber)]/90'
                    : `bg-${color}-100 dark:bg-${color}-900/30`
                } rounded-full`}
              >
                <Icon
                  size={14}
                  className={
                    color === 'amber' ? 'text-white' : `text-${color}-600 dark:text-${color}-400`
                  }
                />
              </div>
              <span>{label}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

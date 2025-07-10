'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { LuBriefcase, LuCode, LuStar, LuX } from 'react-icons/lu';
import { useTranslations } from 'next-intl';
import { SkillDataType } from '@/constants/skillsData';

const skillCategories = {
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
  className?: string;
}

export default function SkillsGrid({ skills, className = '' }: SkillsGridProps) {
  const t = useTranslations('About.skills');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFilterAnimating, setIsFilterAnimating] = useState(false);
  const [isTodosSelected, setIsTodosSelected] = useState(true);

  // Get unique categories and sort them for consistent display
  const categories = [...new Set(skills.map(skill => skill.category))].sort();

  // Simplificada e otimizada para transições mais suaves
  const handleCategoryChange = (category: string | null) => {
    if (category === selectedCategory) return;

    setIsFilterAnimating(true);
    setIsTodosSelected(category === null);

    // Mudança imediata de categoria para evitar discrepâncias de estado
    setSelectedCategory(category);

    // Tempo suficiente para completar todas as animações
    const timeoutId = setTimeout(() => {
      setIsFilterAnimating(false);
    }, 800);

    return () => clearTimeout(timeoutId);
  };

  // Filter skills based on selected category
  const filteredSkills = selectedCategory
    ? skills.filter(skill => skill.category === selectedCategory)
    : skills;

  // Ordenação otimizada: destaque > anos totais > ordem > nome
  const sortedSkills = [...filteredSkills].sort((a, b) => {
    if (!!a.featured !== !!b.featured) return a.featured ? -1 : 1;
    const expA = (a.proexp || 0) + (a.exp || 0);
    const expB = (b.proexp || 0) + (b.exp || 0);
    if (expA !== expB) return expB - expA;
    if ((a.order ?? 999) !== (b.order ?? 999)) return (a.order ?? 999) - (b.order ?? 999);
    return a.name.localeCompare(b.name);
  });

  // Função simplificada para calcular delay com base apenas no índice
  const getStaggerDelay = (index: number) => {
    // Usar delays muito mais simples e consistentes
    if (isTodosSelected) {
      // Para "Todos", um padrão linear simples
      return 0.1 + index * 0.03; // 0.03s entre cada item = 30ms
    } else {
      // Para categorias, um pouco mais rápido
      return 0.05 + index * 0.02; // 0.02s entre cada item = 20ms
    }
  };

  return (
    <div className={`skills-grid ${className}`}>
      {/* Enhanced category filter with animations */}
      <motion.div
        className="flex flex-wrap justify-center gap-3 mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.button
          onClick={() => handleCategoryChange(null)}
          className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all relative
              ${
                !selectedCategory
                  ? 'bg-[color:var(--primary)] text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {/* Simplificado para melhor performance */}
          {!selectedCategory && (
            <motion.span
              className="absolute inset-0 rounded-full bg-[color:var(--primary)]/20"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.5,
                ease: 'easeInOut',
              }}
            />
          )}
          <span>{t('all')}</span>
        </motion.button>
        {categories.map((category, idx) => (
          <motion.button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2
              ${
                selectedCategory === category
                  ? `${skillCategories[category]?.color || ''} text-white shadow-md`
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.1 + idx * 0.05,
              duration: 0.3,
            }}
          >
            <span
              className={`w-2 h-2 rounded-full ${skillCategories[category]?.color || ''}`}
            ></span>
            {skillCategories[category]?.label || category}
            {selectedCategory === category && (
              <motion.span
                className="ml-1 text-white/80 hover:text-white cursor-pointer"
                onClick={e => {
                  e.stopPropagation();
                  handleCategoryChange(null);
                }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                role="button"
                tabIndex={0}
                aria-label="Limpar filtro"
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCategoryChange(null);
                  }
                }}
              >
                <LuX size={12} />
              </motion.span>
            )}
          </motion.button>
        ))}
      </motion.div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 relative">
        {/* Shimmer effect */}
        {isFilterAnimating && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent z-10 pointer-events-none"
            initial={{ left: '-100%' }}
            animate={{
              left: '100%',
              transition: { duration: 0.8, ease: 'easeInOut' },
            }}
          />
        )}
        {/* No skills match the filter */}
        {sortedSkills.length === 0 && (
          <motion.div
            className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {t('noSkills')}
          </motion.div>
        )}
        <AnimatePresence mode="sync" initial={false}>
          {sortedSkills.map((skill, index) => {
            return (
              <motion.div
                key={skill.name}
                className={`bg-white dark:bg-gray-800/50 rounded-lg p-4 flex flex-col items-center text-center
                  hover:shadow-md transition-all relative overflow-hidden
                  ${skill.featured ? 'ring-1 ring-[color:var(--primary)]/20' : ''}
                  border border-gray-100 dark:border-gray-700/50
                `}
                layout="position"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                  transition: {
                    // Animações mais simples e previsíveis
                    delay: getStaggerDelay(index),
                    duration: 0.2, // Reduzir duração para animações mais rápidas
                    ease: 'easeOut', // Usar easing simples em vez de spring
                  },
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  transition: {
                    duration: 0.15, // Animações de saída ainda mais rápidas
                    ease: 'easeIn',
                  },
                }}
                whileHover={{
                  y: -3, // Reduzir movimento do hover para menos janky
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                  transition: {
                    duration: 0.2,
                  },
                }}
              >
                {/* Enhanced category indicator with gradient */}
                <div
                  className={`absolute top-0 left-0 w-full h-1 ${
                    skillCategories[skill.category]?.color || ''
                  }`}
                />
                {/* Simplified skill icon display - menos animações = menos bugs */}
                <div
                  className={`mb-3 p-2.5 rounded-full ${skillCategories[skill.category]?.bgColor || ''} group`}
                >
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 10,
                    }}
                  >
                    {
                      <skill.icon
                        className={`w-6 h-6 ${skillCategories[skill.category]?.textColor || ''}`}
                      />
                    }
                  </motion.div>
                </div>
                {/* Skill name with hover effect */}
                <h3 className="font-medium text-base mb-1.5">{skill.name}</h3>
                {/* Experiência com ícones para diferenciar tipos */}
                <div className="text-xs mt-auto flex flex-col justify-start gap-1 w-full">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Experiência:</span>

                  <div className="flex flex-col gap-2 items-center w-full">
                    {skill.proexp > 0 && (
                      <div className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/20 px-2 py-0.5 rounded w-full justify-center">
                        <LuBriefcase size={12} className="text-blue-600 dark:text-blue-400" />
                        <span className="text-blue-600 dark:text-blue-400">
                          {skill.proexp} {skill.proexp > 1 ? 'anos' : 'ano'}
                        </span>
                      </div>
                    )}

                    {skill.exp > 0 && (
                      <div className="flex items-center gap-1 bg-purple-100 dark:bg-purple-900/20 px-2 py-0.5 rounded w-full justify-center">
                        <LuCode size={12} className="text-purple-600 dark:text-purple-400" />
                        <span className="text-purple-600 dark:text-purple-400">
                          {skill.exp} {skill.exp > 1 ? 'anos' : 'ano'}
                        </span>
                      </div>
                    )}

                    {skill.proexp === 0 && skill.exp === 0 && (
                      <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-gray-500 dark:text-gray-400 w-full flex items-center justify-center">
                        Em aprendizado
                      </span>
                    )}
                  </div>
                </div>
                {/* Featured indicator com ícone consistente */}
                {skill.featured && (
                  <motion.div
                    className="absolute top-1.5 right-1.5 z-10"
                    initial={{ scale: 0 }}
                    animate={{
                      scale: 1,
                      transition: {
                        delay: 0.3,
                        duration: 0.2,
                      },
                    }}
                    whileHover={{ scale: 1.2 }}
                  >
                    <span className="flex items-center justify-center w-5 h-5 bg-[color:var(--amber)]/90 text-white rounded-full">
                      <LuStar size={12} />
                    </span>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      {/* Legenda explicativa */}
      <motion.div
        className="text-center text-sm text-gray-600 dark:text-gray-400 mt-8 max-w-2xl mx-auto bg-white dark:bg-gray-800/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700/50 shadow-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <div className="font-medium mb-3 text-gray-700 dark:text-gray-300">{t('legend.title')}</div>
        <div className="flex flex-wrap justify-center gap-4 items-center">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <LuBriefcase size={14} className="text-blue-600 dark:text-blue-400" />
            </div>
            <span>{t('legend.professional')}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <LuCode size={14} className="text-purple-600 dark:text-purple-400" />
            </div>
            <span>{t('legend.personal')}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 bg-[color:var(--amber)]/90 rounded-full">
              <LuStar size={14} className="text-white" />
            </div>
            <span>{t('legend.favorites')}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

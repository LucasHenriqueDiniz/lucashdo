'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { LuBriefcase, LuCode, LuStar, LuX } from 'react-icons/lu';
import { useTranslations } from 'next-intl';
import { SkillDataType } from '@/constants/skillsData';

const skillCategoryKeys = [
  'frontend',
  'backend',
  'integration',
  'automation',
  'ai',
  'database',
  'devops',
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
  integration: {
    label: 'Integration',
    color: 'bg-cyan-500/90 dark:bg-cyan-600/90',
    textColor: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-50 dark:bg-cyan-900/20',
  },
  automation: {
    label: 'Automation',
    color: 'bg-indigo-500/90 dark:bg-indigo-600/90',
    textColor: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
  },
  ai: {
    label: 'AI & LLM',
    color: 'bg-pink-500/90 dark:bg-pink-600/90',
    textColor: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20',
  },
  database: {
    label: 'Database',
    color: 'bg-teal-500/90 dark:bg-teal-600/90',
    textColor: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-50 dark:bg-teal-900/20',
  },
  devops: {
    label: 'DevOps',
    color: 'bg-amber-500/90 dark:bg-amber-600/90',
    textColor: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
  },
  design: {
    label: 'Design & SEO',
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

  // Get unique categories
  const categories = [...new Set(skills.map(skill => skill.category))]
    .filter((cat): cat is SkillCategoryKey => skillCategoryKeys.includes(cat as SkillCategoryKey))
    .sort();

  const handleCategoryChange = (category: SkillCategoryKey | null) => {
    if (category === selectedCategory) return;
    setSelectedCategory(category);
  };

  const filteredSkills = selectedCategory
    ? skills.filter(skill => skill.category === selectedCategory)
    : skills;

  const sortedSkills = [...filteredSkills].sort((a, b) => {
    if (!!a.featured !== !!b.featured) return a.featured ? -1 : 1;
    const expA = (a.proexp || 0) + (a.exp || 0);
    const expB = (b.proexp || 0) + (b.exp || 0);
    if (expA !== expB) return expB - expA;
    return (a.order ?? 999) - (b.order ?? 999);
  });

  return (
    <div className="skills-grid space-y-6">
      {/* Category filter - compacto */}
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => handleCategoryChange(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            !selectedCategory
              ? 'bg-[color:var(--primary)] text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {t('all')}
        </button>

        {categories.map(category => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              selectedCategory === category
                ? `${skillCategories[category]?.color || ''} text-white shadow-lg`
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${skillCategories[category]?.color || ''}`} />
            {skillCategories[category]?.label || category}
            {selectedCategory === category && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  handleCategoryChange(null);
                }}
                className="ml-1 hover:scale-110 transition-transform"
              >
                <LuX size={12} />
              </button>
            )}
          </button>
        ))}
      </div>

      {/* Skills count */}
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        {sortedSkills.length} {sortedSkills.length === 1 ? 'skill' : 'skills'}
        {selectedCategory && ` em ${skillCategories[selectedCategory]?.label || selectedCategory}`}
      </div>

      {/* Grid de skills - simplificado */}
      <motion.ul
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 list-none p-0 m-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {sortedSkills.map((skill, index) => (
          <motion.li
            key={skill.name}
            className={`bg-white dark:bg-gray-800/50 rounded-lg p-4 flex flex-col items-center text-center hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700/50 ${
              skill.featured ? 'ring-2 ring-[color:var(--primary)]/30' : ''
            }`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.03, duration: 0.2 }}
            whileHover={{ y: -2, scale: 1.02 }}
          >
            <div
              className={`mb-3 p-2.5 rounded-full ${skillCategories[skill.category as SkillCategoryKey]?.bgColor || ''}`}
            >
              <skill.icon
                className={`w-5 h-5 ${skillCategories[skill.category as SkillCategoryKey]?.textColor || ''}`}
              />
            </div>

            <h3 className="font-medium text-sm mb-2">{skill.name}</h3>

            <div className="text-xs mt-auto space-y-1">
              {skill.proexp > 0 && (
                <div className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/20 px-2 py-0.5 rounded">
                  <LuBriefcase size={10} className="text-blue-600 dark:text-blue-400" />
                  <span className="text-blue-600 dark:text-blue-400">
                    {skill.proexp} {skill.proexp > 1 ? 'anos' : 'ano'}
                  </span>
                </div>
              )}
              {skill.exp > 0 && (
                <div className="flex items-center gap-1 bg-purple-100 dark:bg-purple-900/20 px-2 py-0.5 rounded">
                  <LuCode size={10} className="text-purple-600 dark:text-purple-400" />
                  <span className="text-purple-600 dark:text-purple-400">
                    {skill.exp} {skill.exp > 1 ? 'anos' : 'ano'}
                  </span>
                </div>
              )}
            </div>

            {skill.featured && (
              <div className="absolute top-2 right-2">
                <LuStar size={14} className="text-amber-500" />
              </div>
            )}
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}

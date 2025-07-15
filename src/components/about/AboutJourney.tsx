'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import { LuBriefcase, LuCalendar, LuExternalLink, LuGraduationCap } from 'react-icons/lu';
import { formatExperienceDates, getFilteredAndSortedExperiences } from '@/utils/experienceUtils';
import { useLanguageStore } from '@/lib/i18n/languageStore';
import { jobExperiences } from '@/constants/jobExperiences';
import { academicExperiences } from '@/constants/academicExperiences';

export default function AboutJourney() {
  const t = useTranslations('About.journey');
  const locale = useLanguageStore(state => state.lang);
  const [activeTab, setActiveTab] = useState<'academic' | 'professional'>('professional');

  // Filtrar e ordenar experiências
  const getFilteredExperiences = (type: 'academic' | 'professional') => {
    const experiences = type === 'academic' ? academicExperiences : jobExperiences;
    return getFilteredAndSortedExperiences(experiences, true);
  };

  const filteredItems = getFilteredExperiences(activeTab);

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('professional')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'professional'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-750'
            }`}
          >
            <div className="flex items-center gap-2">
              <LuBriefcase className="w-4 h-4" />
              <span className="text-sm font-semibold">{t('professional')}</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('academic')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'academic'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-750'
            }`}
          >
            <div className="flex items-center gap-2">
              <LuGraduationCap className="w-4 h-4" />
              <span className="text-sm font-semibold">{t('academic')}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Journey Timeline */}
      <motion.div
        className="relative"
        key={activeTab}
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-blue-400 to-blue-300 dark:from-blue-400 dark:via-blue-500 dark:to-blue-600 opacity-20"></div>

        <div className="space-y-8">
          {filteredItems.map((item, index) => (
            <div key={item.id} className="relative pl-16">
              {/* Timeline dot */}
              <div className="absolute left-6 top-6 w-5 h-5 bg-blue-500 rounded-full border-4 border-white dark:border-gray-900 shadow-sm"></div>
              {/* Content card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 hover:border-blue-200 dark:hover:border-blue-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-3 line-clamp-1">
                      {item.institution}
                    </p>
                  </div>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 ml-4 text-gray-400 hover:text-blue-500 transition-colors"
                      aria-label="Visit website"
                    >
                      <LuExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>

                {/* Period and Top Tags */}
                <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <LuCalendar className="w-4 h-4 flex-shrink-0" />
                    <span className="font-medium">
                      {formatExperienceDates(item.startDate, item.endDate, locale)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {item.topTags.map((topTag, topTagIndex) => (
                      <span
                        key={topTagIndex}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md font-medium"
                      >
                        {topTag.labels[locale]}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-3">
                  {item.description[locale]}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, tagIndex) => (
                    <div
                      key={tagIndex}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-full font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    >
                      {typeof tag.icon === 'string' ? (
                        <Image
                          src={tag.icon}
                          alt={tag.labels[locale]}
                          width={14}
                          height={14}
                          className="w-3.5 h-3.5 flex-shrink-0"
                        />
                      ) : (
                        <tag.icon className="w-3.5 h-3.5 flex-shrink-0" />
                      )}
                      <span className="truncate">{tag.labels[locale]}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* eslint-disable */
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useEffect, useState, type MouseEvent } from 'react';
import {
  LuBriefcase,
  LuCalendar,
  LuExternalLink,
  LuGraduationCap,
  LuCode,
  LuX,
  LuChevronRight,
  LuSparkles,
} from 'react-icons/lu';
import { formatExperienceDates, getFilteredAndSortedExperiences } from '@/utils/experienceUtils';
import { useLanguageStore } from '@/store/languageStore';
import { jobExperiences } from '@/constants/jobExperiences';
import { academicExperiences } from '@/constants/academicExperiences';
import { projects, type Project } from '@/constants/projects';

const getStatusLabel = (status?: Project['status'], locale: 'pt' | 'en' = 'pt') => {
  if (!status) return '';
  const map: Record<NonNullable<Project['status']>, { pt: string; en: string }> = {
    workInProgress: { pt: 'Em desenvolvimento', en: 'Work in progress' },
    discontinued: { pt: 'Descontinuado', en: 'Discontinued' },
    experimental: { pt: 'Experimental', en: 'Experimental' },
    completed: { pt: 'Concluído', en: 'Completed' },
  };
  return map[status]?.[locale] || status;
};

const variants = {
  A: ({ t, locale, activeTab, setActiveTab, filteredItems }: any) => (
    <div className="space-y-4">
      <div className="flex justify-center mb-6">
        <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1">
          <button
            onClick={() => setActiveTab('professional')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'professional'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <LuBriefcase className="w-4 h-4 inline mr-2" />
            {t('professional')}
          </button>
          <button
            onClick={() => setActiveTab('academic')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'academic'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            <LuGraduationCap className="w-4 h-4 inline mr-2" />
            {t('academic')}
          </button>
        </div>
      </div>

      <div className="space-y-3 divide-y divide-gray-200 dark:divide-gray-800">
        {filteredItems.map((item: any, index: number) => (
          <motion.div
            key={item.id}
            className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-5 border-l-4 border-[color:var(--primary)] leading-relaxed"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <h3 className="text-lg font-bold mb-1">{item.title}</h3>
            <p className="text-[color:var(--primary)] font-medium mb-2">{item.institution}</p>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <LuCalendar className="w-4 h-4" />
              {formatExperienceDates(item.startDate, item.endDate, locale)}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  ),

  B: ({ t, locale, activeTab, setActiveTab, filteredItems }: any) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const featuredProjects: Project[] = projects.filter(p => p.featured).slice(0, 4);

    const displayedExperiences: any[] = filteredItems;
    const displayedProjects: Project[] = projects.slice(0, 6);
    const opened =
      openIndex !== null
        ? activeTab === 'projects'
          ? displayedProjects[openIndex]
          : displayedExperiences[openIndex]
        : null;

    useEffect(() => {
      if (openIndex !== null) {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
          document.body.style.overflow = prev;
        };
      }
    }, [openIndex]);

    return (
      <div className="space-y-6">
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setActiveTab('professional')}
            className={`px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'professional'
                ? 'bg-[color:var(--primary)] text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
            }`}
          >
            <LuBriefcase className="w-4 h-4 inline mr-2" /> {t('professional')}
          </button>
          <button
            onClick={() => setActiveTab('academic')}
            className={`px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'academic'
                ? 'bg-[color:var(--primary)] text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
            }`}
          >
            <LuGraduationCap className="w-4 h-4 inline mr-2" /> {t('academic')}
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'projects'
                ? 'bg-[color:var(--primary)] text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
            }`}
          >
            <LuCode className="w-4 h-4 inline mr-2" /> Projetos
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 h-[50vh] overflow-y-auto">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {activeTab !== 'projects' &&
              displayedExperiences.map((item: any, index: number) => (
                <motion.div
                  key={item.id}
                  className="rounded-2xl p-4 border border-gray-200/40 dark:border-white/10 bg-white/70 dark:bg-white/5 hover:shadow-md transition-all hover:-translate-y-0.5"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.06, duration: 0.25, ease: 'easeOut' }}
                  onClick={() => setOpenIndex(index)}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-base font-bold mb-1 text-gray-900 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="text-[color:var(--primary)] font-medium text-sm">
                        {item.institution}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <LuCalendar className="w-4 h-4" />
                        {formatExperienceDates(item.startDate, item.endDate, locale)}
                      </div>
                    </div>
                    <div className="opacity-50 text-gray-400 dark:text-gray-300">
                      {activeTab === 'professional' ? <LuBriefcase /> : <LuGraduationCap />}
                    </div>
                  </div>
                  {(() => {
                    const d = item?.description as { pt: string; en: string } | undefined;
                    const text = d ? (d[locale as 'pt' | 'en'] ?? d.pt) : '';
                    return (
                      <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                        {text}
                      </p>
                    );
                  })()}
                  <div className="mt-4 flex items-center gap-3 text-sm">
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[color:var(--primary)] hover:underline inline-flex items-center gap-1"
                        onClick={e => e.stopPropagation()}
                      >
                        <LuExternalLink className="w-4 h-4" /> {t('visit') || 'Visitar'}
                      </a>
                    )}
                    <span className="ml-auto text-gray-500">{t('seeDetails')}</span>
                  </div>
                </motion.div>
              ))}

            {activeTab === 'projects' &&
              displayedProjects.map((p: Project, index: number) => (
                <motion.div
                  key={p.id}
                  className="rounded-2xl p-4 border border-gray-200/40 dark:border-white/10 bg-white/70 dark:bg-white/5 hover:shadow-md transition-all hover:-translate-y-0.5"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: index * 0.06, duration: 0.25, ease: 'easeOut' }}
                  onClick={() => setOpenIndex(index)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {p.title}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {(p.description as any)[locale] || p.description.pt}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {p.tags.slice(0, 4).map((tag: string) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-1 rounded-full bg-[color:var(--primary)]/10 text-[color:var(--primary)] flex-shrink-0">
                      {p.status || 'project'}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-3 text-sm">
                    {p.demoUrl && (
                      <a
                        href={p.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[color:var(--primary)] hover:underline inline-flex items-center gap-1"
                        onClick={e => e.stopPropagation()}
                      >
                        <LuExternalLink className="w-4 h-4" /> {t('demo')}
                      </a>
                    )}
                    <a
                      href={p.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[color:var(--primary)] hover:underline inline-flex items-center gap-1"
                      onClick={e => e.stopPropagation()}
                    >
                      <LuExternalLink className="w-4 h-4" /> {t('repo')}
                    </a>
                    <span className="ml-auto text-gray-500">{t('seeDetails')}</span>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>

        {activeTab !== 'projects' && (
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4 h-[22vh] overflow-y-auto">
            <h4 className="text-sm font-semibold text-gray-100 mb-3">Projetos em destaque</h4>
            <div className="grid grid-cols-1 gap-3">
              {featuredProjects.map((p: Project) => (
                <a
                  key={p.id}
                  href={p.demoUrl || p.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-gray-200/30 dark:border-gray-800 p-3 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-gray-200 group-hover:text-[color:var(--primary)]">
                        {p.title}
                      </div>
                      <div className="text-xs text-gray-300 mt-1 line-clamp-2">
                        {(p.description as any)[locale] || p.description.pt}
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-1 rounded-full bg-[color:var(--primary)]/10 text-[color:var(--primary)]">
                      {getStatusLabel(p.status, (locale as 'pt' | 'en') || 'pt')}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {opened && (
            <motion.div
              key="drawer-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50"
              onClick={() => setOpenIndex(null)}
            >
              <div className="absolute inset-0 bg-black/50" />
              <motion.div
                key="drawer"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="absolute right-0 top-0 h-full w-full sm:w-[520px] bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-800 flex flex-col"
                onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
              >
                <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {opened.title}
                    </h3>
                    {activeTab === 'projects' ? null : (
                      <p className="text-[color:var(--primary)] font-medium">
                        {(opened as any).institution}
                      </p>
                    )}
                    {activeTab !== 'projects' && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <LuCalendar className="w-4 h-4" />
                        {formatExperienceDates(
                          (opened as any).startDate,
                          (opened as any).endDate,
                          locale
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => setOpenIndex(null)}
                  >
                    ✕
                  </button>
                </div>
                <div className="p-5 space-y-4 overflow-y-auto">
                  {activeTab === 'projects' ? (
                    <>
                      <p className="text-gray-700 dark:text-gray-300">
                        {(opened as any).description?.[locale] || (opened as any).description?.pt}
                      </p>
                      {(opened as Project).tags && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {(opened as Project).tags.slice(0, 10).map(tag => (
                            <span
                              key={tag}
                              className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-3 text-sm pt-1">
                        {(opened as Project).demoUrl && (
                          <a
                            href={(opened as Project).demoUrl!}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[color:var(--primary)] hover:underline inline-flex items-center gap-1"
                          >
                            <LuExternalLink className="w-4 h-4" /> Demo
                          </a>
                        )}
                        <a
                          href={(opened as Project).repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[color:var(--primary)] hover:underline inline-flex items-center gap-1"
                        >
                          <LuExternalLink className="w-4 h-4" /> Repo
                        </a>
                      </div>
                    </>
                  ) : (
                    (() => {
                      const d = (opened as any)?.description as
                        | { pt: string; en: string }
                        | undefined;
                      const openDesc = d ? (d[locale as 'pt' | 'en'] ?? d.pt) : '';
                      return <p className="text-gray-700 dark:text-gray-300">{openDesc}</p>;
                    })()
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  },

  C: ({ t, locale, activeTab, setActiveTab, filteredItems }: any) => (
    <div className="space-y-4">
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('professional')}
          className={`px-6 py-3 font-medium border-b-2 transition-all ${
            activeTab === 'professional'
              ? 'border-[color:var(--primary)] text-[color:var(--primary)]'
              : 'border-transparent text-gray-600 dark:text-gray-400'
          }`}
        >
          {t('professional')}
        </button>
        <button
          onClick={() => setActiveTab('academic')}
          className={`px-6 py-3 font-medium border-b-2 transition-all ${
            activeTab === 'academic'
              ? 'border-[color:var(--primary)] text-[color:var(--primary)]'
              : 'border-transparent text-gray-600 dark:text-gray-400'
          }`}
        >
          {t('academic')}
        </button>
      </div>

      <div className="space-y-3">
        {filteredItems.map((item: any, index: number) => (
          <motion.div
            key={item.id}
            className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="w-1 bg-[color:var(--primary)] rounded-full flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg mb-1">{item.title}</h3>
              <p className="text-[color:var(--primary)] mb-2">{item.institution}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <LuCalendar className="w-3 h-3 inline mr-1" />
                {formatExperienceDates(item.startDate, item.endDate, locale)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  ),

  D: ({ t, locale, activeTab, setActiveTab, filteredItems }: any) => {
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const displayedProjects: Project[] = projects;
    const currentData = activeTab === 'projects' ? displayedProjects : (filteredItems as any[]);

    // status label handled by top-level getStatusLabel

    const TabButton = ({
      active,
      onClick,
      icon: Icon,
      children,
    }: {
      active: boolean;
      onClick: () => void;
      icon: React.ComponentType<{ className?: string }>;
      children: React.ReactNode;
    }) => (
      <button
        onClick={onClick}
        className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
          active
            ? 'text-white border border-blue-500/60 shadow-sm'
            : 'text-gray-400 hover:text-gray-200 border border-transparent'
        }`}
      >
        <span className="relative z-10 flex items-center gap-2">
          <Icon className="w-4 h-4" />
          {children}
        </span>
      </button>
    );

    const Card = ({
      item,
      index,
      onClick,
      type,
    }: {
      item: any;
      index: number;
      onClick: () => void;
      type: 'academic' | 'professional' | 'projects';
    }) => (
      <motion.div
        whileInView={{ opacity: 1, y: 0 }}
        initial={false}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ delay: index * 0.08, duration: 0.4 }}
        className={`group relative ${
          type !== 'projects' && !item.endDate
            ? 'bg-gradient-to-br from-emerald-500/10 via-blue-500/5 to-purple-500/10 border-2 border-emerald-500/50 shadow-[0_0_30px_rgba(34,211,238,0.2)] ring-2 ring-emerald-500/20'
            : 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50 hover:border-blue-500/50'
        } backdrop-blur-sm rounded-2xl p-6 transition-all duration-300 cursor-pointer overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 hover:scale-[1.02]`}
        onClick={onClick}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300 rounded-2xl" />
        <div className="relative z-10">
          <div className="flex items-start gap-4 mb-4">
            {type === 'projects' ? (
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 shrink-0">
                <LuCode className="w-5 h-5 text-white" />
              </div>
            ) : (
              <div
                className={`p-3 rounded-xl shrink-0 ${
                  type === 'professional'
                    ? 'bg-gradient-to-br from-blue-600 to-cyan-600'
                    : 'bg-gradient-to-br from-purple-600 to-pink-600'
                }`}
              >
                {type === 'professional' ? (
                  <LuBriefcase className="w-5 h-5 text-white" />
                ) : (
                  <LuGraduationCap className="w-5 h-5 text-white" />
                )}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-1">
                {item.title}
              </h3>
              {type !== 'projects' && (
                <p className="text-blue-400 font-medium text-sm">{item.institution}</p>
              )}
            </div>
            {type === 'projects' ? (
              <span className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold">
                {getStatusLabel(item.status, (locale as 'pt' | 'en') || 'pt')}
              </span>
            ) : null}
          </div>

          {type !== 'projects' && (
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <LuCalendar className="w-4 h-4" />
                {formatExperienceDates(item.startDate, item.endDate, locale)}
              </div>
              {!item.endDate && (
                <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-semibold shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {locale === 'en' ? 'Current' : 'Atual'}
                </span>
              )}
            </div>
          )}

          {(() => {
            const d = (item?.description as { pt?: string; en?: string } | undefined) || {};
            const text = d[locale as 'pt' | 'en'] || d.pt || d.en || '';
            return (
              <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 mb-4">{text}</p>
            );
          })()}

          {type === 'projects' && (
            <div className="flex flex-wrap gap-2 mb-4">
              {(item.tags || []).slice(0, 5).map((tag: string) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-md bg-gray-700/60 text-gray-300 border border-gray-600/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-700/30">
            <div className="flex items-center gap-4 text-sm">
              {item.url && type !== 'projects' && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1.5 transition-colors font-medium"
                >
                  <LuExternalLink className="w-4 h-4" />
                  {t('visit') || 'Visitar'}
                </a>
              )}
              {type === 'projects' && (
                <>
                  {item.demoUrl && (
                    <a
                      href={item.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1.5 transition-colors font-medium"
                    >
                      <LuExternalLink className="w-4 h-4" />
                      Demo
                    </a>
                  )}
                  <a
                    href={item.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1.5 transition-colors font-medium"
                  >
                    <LuExternalLink className="w-4 h-4" />
                    Repo
                  </a>
                </>
              )}
            </div>
            <span className="text-gray-400 group-hover:text-blue-400 transition-colors inline-flex items-center gap-1.5 font-medium">
              {t('seeDetails') || 'Ver detalhes'}
              <LuChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </motion.div>
    );

    const Drawer = ({
      item,
      onClose,
      type,
    }: {
      item: any;
      onClose: () => void;
      type: 'academic' | 'professional' | 'projects';
    }) => {
      useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
          document.body.style.overflow = prev;
        };
      }, []);

      const desc =
        ((item?.description || {}) as { pt?: string; en?: string })[locale as 'pt' | 'en'] ||
        (item?.description || {}).pt ||
        (item?.description || {}).en ||
        '';

      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative w-full sm:max-w-3xl bg-gradient-to-br from-gray-950 to-black border border-gray-700/70 rounded-t-3xl sm:rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="relative border-b border-gray-700/50 p-6 bg-gradient-to-r from-blue-600/10 to-purple-600/10">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all"
              >
                <LuX className="w-5 h-5" />
              </button>
              <div className="flex items-start gap-4 pr-12">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 ring-2 ring-white/10">
                  {type === 'professional' ? (
                    <LuBriefcase className="w-6 h-6 text-white" />
                  ) : type === 'academic' ? (
                    <LuGraduationCap className="w-6 h-6 text-white" />
                  ) : (
                    <LuCode className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-bold text-white mb-2">{item.title}</h2>
                  {type !== 'projects' ? (
                    <>
                      <p className="text-blue-400 font-semibold mb-2">{item.institution}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <LuCalendar className="w-4 h-4" />
                        {formatExperienceDates(item.startDate, item.endDate, locale)}
                      </div>
                    </>
                  ) : (
                    <span className="inline-block text-sm px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-inner">
                      {getStatusLabel(item.status, (locale as 'pt' | 'en') || 'pt')}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {type === 'projects' && item.image && (
                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-700/50">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
              )}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <LuSparkles className="w-4 h-4" />
                  {t('description') || 'Descrição'}
                </h3>
                <p className="text-gray-200 leading-relaxed">{desc}</p>
              </div>
              {type === 'projects' && item.tags && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    {t('technologies') || 'Tecnologias'}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-gray-700/50 to-gray-800/50 border border-gray-600/50 text-gray-200 text-sm font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-3 pt-4">
                {item.url && type !== 'projects' && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                  >
                    <LuExternalLink className="w-4 h-4" />
                    {t('visit') || 'Visitar Site'}
                  </a>
                )}
                {type === 'projects' && (
                  <>
                    {item.demoUrl && (
                      <a
                        href={item.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                      >
                        <LuExternalLink className="w-4 h-4" />
                        {t('demo') || 'Ver Demo'}
                      </a>
                    )}
                    <a
                      href={item.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 text-white rounded-xl font-semibold transition-all"
                    >
                      <LuExternalLink className="w-4 h-4" />
                      {t('repo') || 'Ver Repositório'}
                    </a>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      );
    };

    return (
      <section className="min-h-screen w-full bg-gradient-to-br from-[#0B1020] via-[#0A0F1A] to-black px-6 md:px-12 py-16 flex items-center overflow-hidden">
        <div className="w-full max-w-7xl mx-auto flex-1 flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4 mb-12"
          >
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {t('title') || 'Minha Jornada'}
            </h2>
            <p className="text-gray-400 text-xl">
              {t('subtitle') || 'Experiências, aprendizados e projetos'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center mb-10"
          >
            <div className="inline-flex bg-gray-800/50 backdrop-blur-sm rounded-2xl p-1.5 border border-gray-700/50 gap-2">
              <TabButton
                active={activeTab === 'professional'}
                onClick={() => setActiveTab('professional')}
                icon={LuBriefcase}
              >
                {t('professional')}
              </TabButton>
              <TabButton
                active={activeTab === 'academic'}
                onClick={() => setActiveTab('academic')}
                icon={LuGraduationCap}
              >
                {t('academic')}
              </TabButton>
              <TabButton
                active={activeTab === 'projects'}
                onClick={() => setActiveTab('projects')}
                icon={LuCode}
              >
                {t('projects') || 'Projetos'}
              </TabButton>
            </div>
          </motion.div>

          <div className="flex-1 overflow-hidden">
            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6 w-full">
              <AnimatePresence>
                {currentData.map((item: any, index: number) => (
                  <Card
                    key={item.id}
                    item={item}
                    index={index}
                    onClick={() => setSelectedItem(item)}
                    type={activeTab}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>

          <AnimatePresence>
            {selectedItem && (
              <Drawer item={selectedItem} onClose={() => setSelectedItem(null)} type={activeTab} />
            )}
          </AnimatePresence>
        </div>
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(59, 130, 246, 0.5);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(59, 130, 246, 0.7);
          }
        `}</style>
      </section>
    );
  },
};

export default function AboutJourneyVariants() {
  const t = useTranslations('About.journey');
  const locale = useLanguageStore(state => state.lang);
  const [activeTab, setActiveTab] = useState<'academic' | 'professional' | 'projects'>(
    'professional'
  );

  const getFilteredExperiences = (type: 'academic' | 'professional') => {
    const experiences = type === 'academic' ? academicExperiences : jobExperiences;
    const list = getFilteredAndSortedExperiences(experiences, true).slice(0, 6);
    return list.sort((a: any, b: any) => (b.endDate ? 0 : 1) - (a.endDate ? 0 : 1));
  };

  const filteredItems = activeTab === 'projects' ? [] : getFilteredExperiences(activeTab);
  const Component = (variants as any).D;

  return (
    <Component
      t={t}
      locale={locale}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      filteredItems={filteredItems}
    />
  );
}

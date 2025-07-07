'use client';

import { motion, useInView, Variants } from 'framer-motion';
import { Code2, Eye, Filter, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { Locale } from '@/lib/i18n/config';
import { Project } from '@/constants';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { createColumns } from './columns';
import { DataTable } from './data-table';
import { StatusFilter } from './status-filter';
import { TagFilter } from './tag-filter';
import { ViewToggle } from './view-toggle';

interface ProjectCardProps {
  project: Project;
  index: number;
  locale: Locale;
  translations: {
    featured: string;
    viewProject: string;
  };
}

// Variantes de animação simplificadas para os cartões de projeto
const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

export const ProjectCard = memo(({ project, index, locale, translations }: ProjectCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-5%' });

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className="group relative bg-white/80 dark:bg-gray-800/50 backdrop-blur-md rounded-xl overflow-hidden shadow-lg transition-all border border-gray-100/40 dark:border-gray-700/30 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="relative rounded-xl overflow-hidden z-10 bg-white/90 dark:bg-gray-800/90 h-full flex flex-col">
        {/* Image container */}
        <div className="aspect-video bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority={index < 6}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
          />

          {project.featured && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--blue)] text-white font-medium text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1">
              <Star className="w-3 h-3" />
              {translations.featured}
            </div>
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="p-6 space-y-4 flex-grow flex flex-col">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 group-hover:text-[color:var(--primary)] transition-colors duration-300">
            {project.title}
          </h3>

          <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
            {project.description[locale]}
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {project.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-full font-medium text-gray-700 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="text-xs px-2.5 py-1 bg-gray-200 dark:bg-gray-600 rounded-full font-medium text-gray-600 dark:text-gray-400">
                +{project.tags.length - 3}
              </span>
            )}
          </div>

          <div className="pt-3 flex justify-between items-center mt-auto">
            <Link
              href={`/projects/${project.id}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--primary)] hover:underline group/link"
            >
              <span>{translations.viewProject}</span>
              <svg
                className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>

            <div className="flex gap-2">
              <Tooltip>
                <TooltipContent>
                  <p>Ver código</p>
                </TooltipContent>
                <TooltipTrigger asChild>
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-[color:var(--primary)] rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Code2 className="w-4 h-4" />
                  </a>
                </TooltipTrigger>
              </Tooltip>

              {project.demoUrl && (
                <Tooltip>
                  <TooltipContent>
                    <p>Ver demo</p>
                  </TooltipContent>
                  <TooltipTrigger asChild>
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-[color:var(--primary)] rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                  </TooltipTrigger>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ProjectCard.displayName = 'ProjectCard';

type ViewMode = 'cards' | 'list';
type StatusFilter = 'all' | 'featured';

export const ProjectsGrid = memo(
  ({
    projects,
    locale,
    translations,
  }: {
    projects: Project[];
    locale: Locale;
    translations: {
      featured: string;
      viewProject: string;
      search: string;
      columns: string;
      noResults: string;
      previous: string;
      next: string;
      showing: string;
      of: string;
      results: string;
      filterByTags: string;
      clearAll: string;
      allTags: string;
      cards: string;
      list: string;
      all: string;
      title: string;
      description: string;
      tags: string;
      status: string;
      viewCode: string;
      viewDemo: string;
    };
  }) => {
    const [viewMode, setViewMode] = useState<ViewMode>('cards');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Filtrar projetos baseado no status e tags
    const filteredProjects = useMemo(() => {
      setIsLoading(true);
      let filtered = projects;

      // Filtrar por status
      if (statusFilter === 'featured') {
        filtered = filtered.filter(project => project.featured);
      }

      // Filtrar por tags
      if (selectedTags.length > 0) {
        filtered = filtered.filter(project => selectedTags.some(tag => project.tags.includes(tag)));
      }

      // Simular um pequeno delay para feedback visual
      setTimeout(() => setIsLoading(false), 100);
      return filtered;
    }, [projects, statusFilter, selectedTags]);

    const featuredCount = useMemo(() => projects.filter(p => p.featured).length, [projects]);
    const totalCount = projects.length;

    const handleTagToggle = useCallback((tag: string) => {
      setSelectedTags(prev => (prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]));
    }, []);

    const handleClearAllTags = useCallback(() => {
      setSelectedTags([]);
    }, []);

    const columns = useMemo(
      () =>
        createColumns({
          locale,
          translations: {
            featured: translations.featured,
            viewProject: translations.viewProject,
            viewCode: translations.viewCode,
            viewDemo: translations.viewDemo,
            title: translations.title,
            description: translations.description,
            tags: translations.tags,
            status: translations.status,
          },
        }),
      [locale, translations]
    );

    const tableTranslations = useMemo(
      () => ({
        search: translations.search,
        columns: translations.columns,
        noResults: translations.noResults,
        previous: translations.previous,
        next: translations.next,
        showing: translations.showing,
        of: translations.of,
        results: translations.results,
      }),
      [translations]
    );

    const statusFilterTranslations = useMemo(
      () => ({
        all: translations.all,
        featured: translations.featured,
      }),
      [translations]
    );

    const tagFilterTranslations = useMemo(
      () => ({
        filterByTags: translations.filterByTags,
        clearAll: translations.clearAll,
        allTags: translations.allTags,
      }),
      [translations]
    );

    const viewToggleTranslations = useMemo(
      () => ({
        cards: translations.cards,
        list: translations.list,
      }),
      [translations]
    );

    const projectCardTranslations = useMemo(
      () => ({
        featured: translations.featured,
        viewProject: translations.viewProject,
      }),
      [translations]
    );

    return (
      <div className="space-y-8">
        {/* Header melhorado */}
        <div className="bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--blue)] rounded-lg">
                <Filter className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Filtros e Visualização
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredProjects.length} de {totalCount} projetos encontrados
                </p>
              </div>
            </div>
            <ViewToggle
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              translations={viewToggleTranslations}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Status Filter */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Star className="h-4 w-4" />
                Status dos Projetos
              </h3>
              <StatusFilter
                status={statusFilter}
                onStatusChange={setStatusFilter}
                featuredCount={featuredCount}
                totalCount={totalCount}
                translations={statusFilterTranslations}
              />
            </div>

            {/* Tag Filter */}
            <div className="space-y-3">
              <TagFilter
                projects={projects}
                selectedTags={selectedTags}
                onTagToggle={handleTagToggle}
                onClearAll={handleClearAllTags}
                translations={tagFilterTranslations}
              />
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        {viewMode === 'cards' ? (
          <div className="relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl z-10 flex items-center justify-center">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-[color:var(--primary)] rounded-full animate-spin"></div>
                  <span>Filtrando projetos...</span>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
              {filteredProjects.slice(0, 50).map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  locale={locale}
                  translations={projectCardTranslations}
                />
              ))}
              {filteredProjects.length > 50 && (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    Mostrando 50 de {filteredProjects.length} projetos. Use os filtros para refinar
                    os resultados.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6">
            <DataTable
              columns={columns}
              data={filteredProjects}
              searchPlaceholder={translations.search}
              translations={tableTranslations}
            />
          </div>
        )}

        {/* Mensagem quando não há resultados */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12 bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-gray-500 dark:text-gray-400 text-lg">{translations.noResults}</div>
            <p className="text-gray-400 dark:text-gray-500 mt-2">
              Tente ajustar os filtros para encontrar mais projetos.
            </p>
          </div>
        )}
      </div>
    );
  }
);

ProjectsGrid.displayName = 'ProjectsGrid';

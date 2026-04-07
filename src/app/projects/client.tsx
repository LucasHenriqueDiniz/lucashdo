'use client';

import { Filter, Star } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Locale } from '@/lib/i18n/config';
import { Project } from '@/constants';
import { ProjectGrid, ProjectFilters } from '@/components/projects';
import { createColumns } from './columns';
import { DataTable } from './data-table';
import { ViewToggle } from './view-toggle';

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
      let filtered = projects;

      // Filtrar por status
      if (statusFilter === 'featured') {
        filtered = filtered.filter(project => project.featured);
      }

      // Filtrar por tags
      if (selectedTags.length > 0) {
        filtered = filtered.filter(project => selectedTags.some(tag => project.tags.includes(tag)));
      }

      return filtered;
    }, [projects, statusFilter, selectedTags]);

    useEffect(() => {
      if (!isLoading) {
        return;
      }

      const timeoutId = setTimeout(() => setIsLoading(false), 100);

      return () => clearTimeout(timeoutId);
    }, [filteredProjects, isLoading]);

    const featuredCount = useMemo(() => projects.filter(p => p.featured).length, [projects]);
    const totalCount = projects.length;

    const handleStatusChange = useCallback(
      (status: StatusFilter) => {
        setIsLoading(true);
        setStatusFilter(status);
      },
      [setIsLoading, setStatusFilter]
    );

    const handleTagToggle = useCallback(
      (tag: string) => {
        setIsLoading(true);
        setSelectedTags(prev =>
          prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );
      },
      [setIsLoading, setSelectedTags]
    );

    const handleClearAllTags = useCallback(() => {
      setIsLoading(true);
      setSelectedTags([]);
    }, [setIsLoading, setSelectedTags]);

    const projectFiltersTranslations = useMemo(
      () => ({
        all: translations.all,
        featured: translations.featured,
        filterByTags: translations.filterByTags,
        clearAll: translations.clearAll,
        allTags: translations.allTags,
      }),
      [translations]
    );

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
        viewCode: translations.viewCode,
        viewDemo: translations.viewDemo,
      }),
      [translations]
    );

    return (
      <div className="space-y-6 md:space-y-8 container mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-12 max-w-[100vw] overflow-x-hidden">
        {/* Header melhorado */}
        <div className="bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 md:mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--blue)] rounded-lg">
                <Filter className="h-4 w-4 md:h-5 md:w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Filtros e Visualização
                </h2>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Integrated Filters */}
            <div className="lg:col-span-2">
              <ProjectFilters
                projects={projects}
                statusFilter={statusFilter}
                selectedTags={selectedTags}
                onStatusChange={handleStatusChange}
                onTagToggle={handleTagToggle}
                onClearTags={handleClearAllTags}
                translations={projectFiltersTranslations}
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
            <div className="max-w-7xl mx-auto">
              <ProjectGrid
                projects={filteredProjects}
                locale={locale}
                translations={projectCardTranslations}
                columns={3}
                maxItems={50}
              />
              {filteredProjects.length > 50 && (
                <div className="text-center py-8">
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

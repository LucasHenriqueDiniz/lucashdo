'use client';

import { useTranslations } from 'next-intl';
import { useLanguageStore } from '@/store/languageStore';
import { Project } from '@/constants';
import { 
  ProjectGrid, 
  ProjectFilters, 
  ProjectsHero 
} from '@/components/projects';
import { motion } from 'framer-motion';
import { Search, Filter as FilterIcon } from 'lucide-react';
import { useState, useMemo, useCallback, useEffect } from 'react';

interface ProjectsClientProps {
  projects: Project[];
}

type StatusFilter = 'all' | 'featured';

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  const t = useTranslations('Projects');
  const locale = useLanguageStore(state => state.lang);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Remove body background to show the gradient background
  useEffect(() => {
    const originalBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#000000';
    
    return () => {
      document.body.style.backgroundColor = originalBg;
    };
  }, []);

  const projectCardTranslations = {
    featured: t('featured'),
    viewProject: t('viewProject'),
    viewCode: t('viewCode'),
    viewDemo: t('viewDemo'),
  };

  const projectsHeroTranslations = {
    title: t('title'),
    subtitle: t('description'),
    stats: {
      projects: t('projects'),
      featured: t('featured'),
      technologies: t('technologies'),
    },
  };

  const projectFiltersTranslations = {
    all: t('all'),
    featured: t('featured'),
    filterByTags: t('filterByTags'),
    clearAll: t('clearAll'),
    allTags: t('allTags'),
  };

  // Filtrar projetos
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    if (statusFilter === 'featured') {
      filtered = filtered.filter(project => project.featured);
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(project => selectedTags.some(tag => project.tags.includes(tag)));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        project =>
          project.title.toLowerCase().includes(query) ||
          project.description[locale].toLowerCase().includes(query) ||
          project.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [projects, statusFilter, selectedTags, searchQuery, locale]);

  const handleStatusChange = useCallback((status: StatusFilter) => {
    setStatusFilter(status);
  }, []);

  const handleTagToggle = useCallback((tag: string) => {
    setSelectedTags(prev => (prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]));
  }, []);

  const handleClearTags = useCallback(() => {
    setSelectedTags([]);
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Animated gradient background */}
      <div 
        className="fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(1, 132, 252, 0.3), transparent),
            radial-gradient(ellipse 60% 50% at 50% 120%, rgba(0, 212, 255, 0.2), transparent),
            linear-gradient(180deg, #000814 0%, #000000 100%)
          `,
        }}
      />
      
      {/* Hero Section */}
      <ProjectsHero 
        projects={projects} 
        translations={projectsHeroTranslations}
      />

      {/* Main Content */}
      <section className="relative z-20 px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filters Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-gray-900/80 backdrop-blur-2xl border border-gray-800 rounded-3xl p-8 mb-12 shadow-2xl"
          >
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={22} />
                <input
                  type="text"
                  placeholder={locale === 'pt' ? 'Buscar projetos por nome, descrição ou tecnologia...' : 'Search projects by name, description or technology...'}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 bg-gray-800/50 border border-gray-700 rounded-2xl text-white text-lg placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-gray-800 transition-all duration-300"
                />
              </div>
            </div>

            {/* Filters Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <FilterIcon className="text-blue-400" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {locale === 'pt' ? 'Filtros' : 'Filters'}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {filteredProjects.length} {locale === 'pt' ? 'de' : 'of'} {projects.length}{' '}
                    {locale === 'pt' ? 'projetos encontrados' : 'projects found'}
                  </p>
                </div>
              </div>
              {(selectedTags.length > 0 || statusFilter !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setStatusFilter('all');
                    setSelectedTags([]);
                    setSearchQuery('');
                  }}
                  className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  {locale === 'pt' ? 'Limpar tudo' : 'Clear all'}
                </button>
              )}
            </div>

            {/* Filters */}
            <ProjectFilters
              projects={projects}
              statusFilter={statusFilter}
              selectedTags={selectedTags}
              onStatusChange={handleStatusChange}
              onTagToggle={handleTagToggle}
              onClearTags={handleClearTags}
              translations={projectFiltersTranslations}
            />
          </motion.div>

          {/* Projects Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {filteredProjects.length > 0 ? (
              <ProjectGrid
                projects={filteredProjects}
                locale={locale}
                translations={projectCardTranslations}
                columns={3}
              />
            ) : (
              <div className="text-center py-32">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800/50 rounded-full mb-6">
                  <Search className="text-gray-500" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {locale === 'pt' ? 'Nenhum projeto encontrado' : 'No projects found'}
                </h3>
                <p className="text-gray-400 text-lg mb-8">
                  {locale === 'pt'
                    ? 'Tente ajustar os filtros ou a busca para encontrar mais projetos'
                    : 'Try adjusting your filters or search to find more projects'}
                </p>
                <button
                  onClick={() => {
                    setStatusFilter('all');
                    setSelectedTags([]);
                    setSearchQuery('');
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 transition-all duration-300 hover:scale-105"
                >
                  {locale === 'pt' ? 'Limpar filtros' : 'Clear filters'}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

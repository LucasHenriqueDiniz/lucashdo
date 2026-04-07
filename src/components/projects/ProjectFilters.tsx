'use client';

import { motion } from 'framer-motion';
import { Filter, Star, X } from 'lucide-react';
import { useMemo } from 'react';
import { Project, ProjectFiltersTranslations } from './types';

interface ProjectFiltersProps {
  projects: Project[];
  statusFilter: 'all' | 'featured';
  selectedTags: string[];
  onStatusChange: (status: 'all' | 'featured') => void;
  onTagToggle: (tag: string) => void;
  onClearTags: () => void;
  translations: ProjectFiltersTranslations;
}

export function ProjectFilters({
  projects,
  statusFilter,
  selectedTags,
  onStatusChange,
  onTagToggle,
  onClearTags,
  translations
}: ProjectFiltersProps) {
  // Get all unique tags
  const allTags = useMemo(() => {
    const tagCounts = projects.reduce((acc, project) => {
      project.tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({ tag, count }));
  }, [projects]);

  const featuredCount = projects.filter(p => p.featured).length;
  
  // Calculate active filter count
  const activeFilterCount = selectedTags.length + (statusFilter === 'featured' ? 1 : 0);

  return (
    <div 
      className="
        relative p-6 space-y-6
        bg-white/10 backdrop-blur-md
        border border-white/20
        rounded-2xl
        transition-all duration-300
      "
      style={{
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
      }}
    >
      {/* Active Filter Count Badge */}
      {activeFilterCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="
            absolute -top-3 -right-3
            flex items-center justify-center
            w-8 h-8
            bg-gradient-to-br from-blue-500 to-cyan-500
            text-white text-sm font-bold
            rounded-full
            shadow-lg shadow-blue-500/50
            border-2 border-white/20
          "
        >
          {activeFilterCount}
        </motion.div>
      )}

      {/* Status Filter */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
          <Star className="w-4 h-4" />
          <span>Status</span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onStatusChange('all')}
            className={`
              relative flex-1 px-4 py-2.5 rounded-2xl font-medium text-sm 
              transition-all duration-300
              ${statusFilter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 hover:scale-105'
              }
            `}
            style={
              statusFilter === 'all'
                ? {
                    boxShadow: '0 0 30px rgba(1, 132, 252, 0.5), 0 10px 20px rgba(1, 132, 252, 0.3)',
                  }
                : undefined
            }
          >
            {translations.all}
            <span className="ml-2 text-xs opacity-75">({projects.length})</span>
          </button>
          <button
            onClick={() => onStatusChange('featured')}
            className={`
              relative flex-1 px-4 py-2.5 rounded-2xl font-medium text-sm 
              transition-all duration-300
              ${statusFilter === 'featured'
                ? 'bg-blue-500 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 hover:scale-105'
              }
            `}
            style={
              statusFilter === 'featured'
                ? {
                    boxShadow: '0 0 30px rgba(1, 132, 252, 0.5), 0 10px 20px rgba(1, 132, 252, 0.3)',
                  }
                : undefined
            }
          >
            {translations.featured}
            <span className="ml-2 text-xs opacity-75">({featuredCount})</span>
          </button>
        </div>
      </div>

      {/* Tags Filter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-300">
            <Filter className="w-4 h-4" />
            <span>{translations.filterByTags}</span>
          </div>
          {selectedTags.length > 0 && (
            <button
              onClick={onClearTags}
              className="
                flex items-center gap-1 
                text-xs text-blue-400 hover:text-blue-300 
                transition-all duration-300
                hover:scale-110
              "
            >
              <X className="w-3 h-3" />
              {translations.clearAll}
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {allTags.map(({ tag, count }) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <motion.button
                key={tag}
                onClick={() => onTagToggle(tag)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative px-3 py-1.5 rounded-xl text-xs font-medium 
                  transition-all duration-300
                  ${isSelected
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                  }
                `}
                style={
                  isSelected
                    ? {
                        boxShadow: '0 0 20px rgba(1, 132, 252, 0.4), 0 5px 15px rgba(1, 132, 252, 0.3)',
                      }
                    : undefined
                }
              >
                {tag}
                <span className="ml-1.5 opacity-75">({count})</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

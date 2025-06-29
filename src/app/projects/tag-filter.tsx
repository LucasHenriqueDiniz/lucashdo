'use client';

import * as React from 'react';
import { X, Tag } from 'lucide-react';
import { memo, useMemo, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Project } from '@/constants';

interface TagFilterProps {
  projects: Project[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  onClearAll: () => void;
  translations: {
    filterByTags: string;
    clearAll: string;
    allTags: string;
  };
}

export const TagFilter = memo(
  ({ projects, selectedTags, onTagToggle, onClearAll, translations }: TagFilterProps) => {
    // Extrair todas as tags únicas dos projetos com contagem
    const allTags = useMemo(() => {
      const tagCount = new Map<string, number>();
      projects.forEach(project => {
        project.tags.forEach(tag => {
          tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
        });
      });
      return Array.from(tagCount.entries())
        .sort((a, b) => b[1] - a[1]) // Ordenar por frequência
        .map(([tag]) => tag);
    }, [projects]);

    const handleTagClick = useCallback(
      (tag: string) => {
        onTagToggle(tag);
      },
      [onTagToggle]
    );

    return (
      <div className="space-y-4">
        {/* Header com ícone e contador */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {translations.filterByTags}
            </h3>
            <Badge variant="outline" className="text-xs">
              {allTags.length}
            </Badge>
          </div>
          {selectedTags.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 h-7 px-2"
            >
              <X className="mr-1 h-3 w-3" />
              {translations.clearAll}
            </Button>
          )}
        </div>

        {/* Tags selecionadas */}
        {selectedTags.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Selecionadas ({selectedTags.length}):
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map(tag => (
                <Badge
                  key={tag}
                  variant="default"
                  className="cursor-pointer bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--blue)] text-white hover:from-[color:var(--primary)]/90 hover:to-[color:var(--blue)]/90 transition-all duration-200 hover:scale-105"
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Todas as tags */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
            {translations.allTags}:
          </div>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-2">
            {allTags.map(tag => {
              const isSelected = selectedTags.includes(tag);
              return (
                <Badge
                  key={tag}
                  variant={isSelected ? 'default' : 'outline'}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--blue)] text-white'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600'
                  }`}
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </Badge>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
);

TagFilter.displayName = 'TagFilter';

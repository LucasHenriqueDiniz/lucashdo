'use client';

import { Grid3X3, List } from 'lucide-react';
import { memo, useCallback } from 'react';
import { Button } from '@/components/ui/button';

type ViewMode = 'cards' | 'list';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  translations: {
    cards: string;
    list: string;
  };
}

export const ViewToggle = memo(({ viewMode, onViewModeChange, translations }: ViewToggleProps) => {
  const handleCardsClick = useCallback(() => {
    onViewModeChange('cards');
  }, [onViewModeChange]);

  const handleListClick = useCallback(() => {
    onViewModeChange('list');
  }, [onViewModeChange]);

  return (
    <div className="flex items-center gap-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-lg p-1 border border-gray-200/50 dark:border-gray-700/50">
      <Button
        variant={viewMode === 'cards' ? 'default' : 'ghost'}
        size="sm"
        onClick={handleCardsClick}
        className={`relative transition-all duration-200 ${
          viewMode === 'cards'
            ? 'bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--blue)] text-white shadow-sm hover:from-[color:var(--primary)]/90 hover:to-[color:var(--blue)]/90'
            : 'hover:bg-gray-200/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
        }`}
      >
        <Grid3X3
          className={`relative z-10 h-4 w-4 ${
            viewMode === 'cards' ? 'text-white' : 'text-gray-600 dark:text-gray-400'
          }`}
        />
        <span
          className={`relative z-10 ml-2 text-sm font-medium ${
            viewMode === 'cards' ? 'text-white' : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          {translations.cards}
        </span>
      </Button>

      <Button
        variant={viewMode === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={handleListClick}
        className={`relative transition-all duration-200 ${
          viewMode === 'list'
            ? 'bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--blue)] text-white shadow-sm hover:from-[color:var(--primary)]/90 hover:to-[color:var(--blue)]/90'
            : 'hover:bg-gray-200/50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
        }`}
      >
        <List
          className={`relative z-10 h-4 w-4 ${
            viewMode === 'list' ? 'text-white' : 'text-gray-600 dark:text-gray-400'
          }`}
        />
        <span
          className={`relative z-10 ml-2 text-sm font-medium ${
            viewMode === 'list' ? 'text-white' : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          {translations.list}
        </span>
      </Button>
    </div>
  );
});

ViewToggle.displayName = 'ViewToggle';

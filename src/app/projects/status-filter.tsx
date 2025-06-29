'use client';

import { Star, FolderOpen } from 'lucide-react';
import { memo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type StatusFilter = 'all' | 'featured';

interface StatusFilterProps {
  status: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  featuredCount: number;
  totalCount: number;
  translations: {
    all: string;
    featured: string;
  };
}

export const StatusFilter = memo(
  ({ status, onStatusChange, featuredCount, totalCount, translations }: StatusFilterProps) => {
    const handleAllClick = useCallback(() => {
      onStatusChange('all');
    }, [onStatusChange]);

    const handleFeaturedClick = useCallback(() => {
      onStatusChange('featured');
    }, [onStatusChange]);

    return (
      <div className="flex items-center gap-3">
        <Button
          variant={status === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={handleAllClick}
          className={`relative transition-all duration-200 ${
            status === 'all'
              ? 'bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--blue)] text-white shadow-sm hover:from-[color:var(--primary)]/90 hover:to-[color:var(--blue)]/90'
              : 'bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 hover:border-gray-300/50 dark:hover:border-gray-600/50'
          }`}
        >
          <FolderOpen
            className={`relative z-10 h-4 w-4 ${
              status === 'all' ? 'text-white' : 'text-gray-600 dark:text-gray-400'
            }`}
          />
          <span
            className={`relative z-10 ml-2 ${
              status === 'all' ? 'text-white' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            {translations.all}
          </span>
          <Badge
            variant={status === 'all' ? 'secondary' : 'outline'}
            className={`relative z-10 ml-2 ${
              status === 'all' ? 'bg-white/20 text-white' : 'bg-gray-100/50 dark:bg-gray-700/50'
            }`}
          >
            {totalCount}
          </Badge>
        </Button>

        <Button
          variant={status === 'featured' ? 'default' : 'outline'}
          size="sm"
          onClick={handleFeaturedClick}
          className={`relative transition-all duration-200 ${
            status === 'featured'
              ? 'bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--blue)] text-white shadow-sm hover:from-[color:var(--primary)]/90 hover:to-[color:var(--blue)]/90'
              : 'bg-white/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 hover:border-gray-300/50 dark:hover:border-gray-600/50'
          }`}
        >
          <Star
            className={`relative z-10 h-4 w-4 ${
              status === 'featured' ? 'text-white' : 'text-yellow-500'
            }`}
          />
          <span
            className={`relative z-10 ml-2 ${
              status === 'featured' ? 'text-white' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            {translations.featured}
          </span>
          <Badge
            variant={status === 'featured' ? 'secondary' : 'outline'}
            className={`relative z-10 ml-2 ${
              status === 'featured'
                ? 'bg-white/20 text-white'
                : 'bg-gray-100/50 dark:bg-gray-700/50'
            }`}
          >
            {featuredCount}
          </Badge>
        </Button>
      </div>
    );
  }
);

StatusFilter.displayName = 'StatusFilter';

'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Code2, Eye, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Project } from '@/constants';
import { Locale } from '@/lib/i18n/config';

interface ColumnsProps {
  locale: Locale;
  translations: {
    featured: string;
    viewProject: string;
    viewCode: string;
    viewDemo: string;
    title: string;
    description: string;
    tags: string;
    status: string;
  };
}

export const createColumns = ({ locale, translations }: ColumnsProps): ColumnDef<Project>[] => [
  {
    accessorKey: 'image',
    header: '',
    cell: ({ row }) => {
      const project = row.original;
      return (
        <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            sizes="64px"
          />
          {project.featured && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--blue)] rounded-full" />
          )}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="h-auto p-0 font-semibold text-left hover:bg-transparent"
        >
          {translations.title}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const project = row.original;
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{project.title}</h3>
            {project.featured && (
              <Badge variant="secondary" className="text-xs">
                {translations.featured}
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 max-w-md">
            {project.description[locale]}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: 'tags',
    header: translations.tags,
    cell: ({ row }) => {
      const project = row.original;
      return (
        <div className="flex flex-wrap gap-1">
          {project.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {project.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{project.tags.length - 3}
            </Badge>
          )}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => {
      const project = row.original;
      return (
        <div className="flex items-center gap-2">
          <Link href={`/projects/${project.id}`}>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">{translations.viewProject}</span>
            </Button>
          </Link>

          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={translations.viewCode}
            >
              <Code2 className="h-4 w-4" />
            </a>
          </Button>

          {project.demoUrl && (
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={translations.viewDemo}
              >
                <Eye className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];

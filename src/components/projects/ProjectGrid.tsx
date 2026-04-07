'use client';

import { Project, ProjectCardTranslations } from './types';
import { ProjectCard } from './ProjectCard';

interface ProjectGridProps {
  projects: Project[];
  locale: 'pt' | 'en';
  translations: ProjectCardTranslations;
  columns?: 2 | 3 | 4;
  maxItems?: number;
  onProjectClick?: (projectId: string) => void;
}

export function ProjectGrid({ 
  projects, 
  locale, 
  translations,
  columns = 3,
  maxItems,
  onProjectClick 
}: ProjectGridProps) {
  const displayProjects = maxItems ? projects.slice(0, maxItems) : projects;
  
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-6 lg:gap-8`}>
      {displayProjects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          index={index}
          locale={locale}
          translations={translations}
          priority={index < 6}
          onProjectClick={onProjectClick}
        />
      ))}
    </div>
  );
}

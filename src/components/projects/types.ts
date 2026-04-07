export interface Project {
  id: string;
  title: string;
  description: {
    pt: string;
    en: string;
  };
  image: string;
  tags: string[];
  featured: boolean;
  repoUrl?: string;
  demoUrl?: string;
  status?: 'workInProgress' | 'discontinued' | 'experimental' | 'completed';
}

export interface ProjectCardTranslations {
  featured: string;
  viewProject: string;
  viewCode: string;
  viewDemo: string;
}

export interface ProjectStatsTranslations {
  projects: string;
  featured: string;
  technologies: string;
}

export interface ProjectFiltersTranslations {
  all: string;
  featured: string;
  filterByTags: string;
  clearAll: string;
  allTags: string;
}

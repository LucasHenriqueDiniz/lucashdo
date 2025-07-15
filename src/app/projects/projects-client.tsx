'use client';

import { useTranslations } from 'next-intl';
import { useLanguageStore } from '@/lib/i18n/languageStore';
import { Project } from '@/constants';
import { AnimatedProjectsLayout } from './AnimatedProjects';
import { ProjectsGrid } from './client';
import { ProjectsHeader } from './ProjectsHeader';

interface ProjectsClientProps {
  projects: Project[];
}

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  const t = useTranslations('Projects');
  const locale = useLanguageStore(state => state.lang);

  return (
    <AnimatedProjectsLayout>
      <ProjectsHeader
        title={t('title')}
        description={t('description')}
        githubLabel={t('allProjects')}
        contactLabel={t('contactMe')}
      />

      <ProjectsGrid
        projects={projects}
        locale={locale}
        translations={{
          featured: t('featured'),
          viewProject: t('viewProject'),
          search: t('search'),
          columns: t('columns'),
          noResults: t('noResults'),
          previous: t('previous'),
          next: t('next'),
          showing: t('showing'),
          of: t('of'),
          results: t('results'),
          filterByTags: t('filterByTags'),
          clearAll: t('clearAll'),
          allTags: t('allTags'),
          cards: t('cards'),
          list: t('list'),
          all: t('all'),
          title: t('title'),
          description: t('description'),
          tags: t('tags'),
          status: t('status'),
          viewCode: t('viewCode'),
          viewDemo: t('viewDemo'),
        }}
      />
    </AnimatedProjectsLayout>
  );
}

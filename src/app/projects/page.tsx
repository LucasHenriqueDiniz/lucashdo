import { Metadata } from 'next';
import { useLocale, useTranslations } from 'next-intl';
import { projects } from '@/constants';
import { Locale } from '@/lib/i18n/config';
import { AnimatedProjectsLayout } from './AnimatedProjects';
import { ProjectsGrid } from './client';
import { ProjectsHeader } from './ProjectsHeader';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'A showcase of my latest and best projects.',
  openGraph: {
    title: 'Projects | Lucas Portfolio',
    description: 'A showcase of my latest and best projects.',
    type: 'website',
  },
};

export default function Projects() {
  const t = useTranslations('Projects');
  const locale = useLocale() as Locale;

  return (
    <>
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
    </>
  );
}

import { Metadata } from 'next';
import { useLocale, useTranslations } from 'next-intl';
import { projects } from '@/constants';
import { Locale } from '@/lib/i18n/config';
import { ProjectStructuredData } from '@/components/SEO/StructuredData';
import { AnimatedProjectsLayout } from './AnimatedProjects';
import { ProjectsGrid } from './client';
import { ProjectsHeader } from './ProjectsHeader';

export const metadata: Metadata = {
  title: 'Projetos | Lucas Hdo - Desenvolvedor Full Stack',
  description:
    'Explore minha coleção de projetos desenvolvidos com React, Next.js, TypeScript e outras tecnologias modernas. Aplicações web inovadoras e soluções criativas.',
  keywords: [
    'projetos lucas hdo',
    'portfolio projetos',
    'react projects',
    'next.js projects',
    'typescript projects',
    'web development projects',
    'frontend projects',
    'backend projects',
    'full stack projects',
    'aplicações web',
    'soluções digitais',
    'desenvolvimento de software',
    'projetos inovadores',
    'creative coding projects',
    'ui/ux projects',
  ],
  openGraph: {
    title: 'Projetos | Lucas Hdo - Desenvolvedor Full Stack',
    description:
      'Explore minha coleção de projetos desenvolvidos com React, Next.js, TypeScript e outras tecnologias modernas.',
    url: 'https://lucashdo.com/projects',
    siteName: 'Lucas Hdo - Portfolio',
    images: [
      {
        url: '/projects/weebprofile.webp',
        width: 1200,
        height: 630,
        alt: 'Projetos - Lucas Hdo Portfolio',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projetos | Lucas Hdo - Desenvolvedor Full Stack',
    description:
      'Explore minha coleção de projetos desenvolvidos com React, Next.js, TypeScript e outras tecnologias modernas.',
    images: ['/projects/weebprofile.webp'],
  },
  alternates: {
    canonical: 'https://lucashdo.com/projects',
  },
};

export default function Projects() {
  const t = useTranslations('Projects');
  const locale = useLocale() as Locale;

  return (
    <>
      {/* Structured Data for featured projects */}
      {projects.slice(0, 3).map(project => (
        <ProjectStructuredData
          key={project.id}
          name={project.title}
          description={project.description.pt}
          url={`https://lucashdo.com/projects/${project.id}`}
          image={`https://lucashdo.com${project.image}`}
          technologies={project.tags}
          datePublished="2024-01-01"
          author={{
            name: 'Lucas Hdo',
            url: 'https://lucashdo.com',
          }}
        />
      ))}

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

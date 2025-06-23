import { Metadata } from 'next';
import { useLocale, useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { projects } from '@/constants';
import { Locale } from '@/lib/i18n/config';
import { AnimatedProjectsLayout } from '../AnimatedProjects';
import { ProjectDetail } from './client';

export async function generateStaticParams() {
  return projects.map(p => ({
    id: p.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = projects.find(p => p.id === id);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.title} | Project Details`,
    description: project.description.en,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = projects.find(p => p.id === id);

  if (!project) {
    notFound();
  }

  return <ProjectPageContent project={project} />;
}

function ProjectPageContent({ project }: { project: (typeof projects)[number] }) {
  const t = useTranslations('Projects');
  const locale = useLocale() as Locale;

  return (
    <MainLayout>
      <AnimatedProjectsLayout>
        <ProjectDetail
          project={project}
          locale={locale}
          translations={{
            viewSource: t('viewSource'),
            viewDemo: t('viewDemo'),
            techStack: t('techStack'),
          }}
        />
      </AnimatedProjectsLayout>
    </MainLayout>
  );
}

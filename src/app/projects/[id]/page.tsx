import { useTranslations, useLocale } from 'next-intl';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import MainLayout from '@/components/layout/MainLayout';
import { projects } from '@/constants';
import { type Locale } from '@/lib/i18n/config';

export const metadata: Metadata = {
  title: 'Project Details',
  description: 'Detailed information about the project.',
};

export default function ProjectPage({ params }: { params: { id: string } }) {
  const t = useTranslations('Projects');
  const locale = useLocale() as Locale;
  const project = projects.find(p => p.id === params.id);

  if (!project) {
    notFound();
  }

  return (
    <MainLayout>
      <section className="py-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-video bg-muted relative overflow-hidden rounded-xl">
            <Image src={project.image} alt={project.title} fill className="object-cover" />
          </div>
          <div className="space-y-6">
            <h1 className="text-4xl font-bold">{project.title}</h1>
            <p className="text-xl text-muted-foreground">{project.description[locale]}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span key={tag} className="text-sm px-3 py-1 bg-muted rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex gap-4 pt-4">
              <Link
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
              >
                {t('viewSource')} →
              </Link>
              {project.demoUrl && (
                <Link
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                >
                  {t('viewDemo')} →
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

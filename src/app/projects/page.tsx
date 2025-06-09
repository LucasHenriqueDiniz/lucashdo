import { useTranslations, useLocale } from 'next-intl';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import MainLayout from '@/components/layout/MainLayout';
import { projects } from '@/constants';
import { type Locale } from '@/lib/i18n/config';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'A showcase of my latest and best projects.',
  openGraph: {
    title: 'Projects | Lucas Portfolio',
    description: 'A showcase of my latest and best projects.',
    type: 'website',
  },
};

// Projects data is now imported from constants

export default function Projects() {
  const t = useTranslations('Projects');
  const locale = useLocale() as Locale;

  return (
    <MainLayout>
      <section className="py-16 max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-4">{t('title')}</h1>
        <p className="text-xl text-muted-foreground mb-12 max-w-3xl">{t('description')}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map(project => (
            <div
              key={project.id}
              className="group border border-border/50 rounded-xl overflow-hidden hover:border-primary transition-colors"
            >
              <div className="aspect-video bg-muted relative overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {project.featured && (
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                    {t('featured')}
                  </div>
                )}
              </div>
              <div className="p-5 space-y-3">
                <h3 className="text-xl font-medium group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground line-clamp-2">{project.description[locale]}</p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-1 bg-muted rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/projects/${project.id}`}
                  className="inline-block pt-3 text-sm font-medium hover:underline"
                >
                  {t('viewProject')} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}

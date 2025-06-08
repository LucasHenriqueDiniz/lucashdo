import { useTranslations } from 'next-intl';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import MainLayout from '@/components/layout/MainLayout';
import { projects } from '@/constants';

export const generateMetadata = ({ params }: { params: { id: string } }): Metadata => {
  const project = projects.find(p => p.id === params.id);

  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found',
    };
  }

  return {
    title: project.title,
    description: project.description.en,
    openGraph: {
      title: `${project.title} | Lucas Portfolio`,
      description: project.description.en,
      images: [{ url: project.image }],
      type: 'website',
    },
  };
};

export default function ProjectDetail({ params }: { params: { id: string } }) {
  const t = useTranslations('Projects');
  let locale: 'pt-BR' | 'en' = 'en'; // Fallback locale

  const project = projects.find(p => p.id === params.id);

  if (!project) {
    notFound();
  }

  // Get the current locale safely
  try {
    // @ts-ignore - handle locale detection differently per Next.js intl setup
    const currentLocale = useTranslations().locale();
    if (currentLocale === 'pt-BR' || currentLocale === 'en') {
      locale = currentLocale;
    }
  } catch (error) {
    console.log('Error getting locale, using fallback');
  }

  // Create a description string from the project data based on the current locale
  const description = project.description[locale];

  // Create a full description from the project data
  const fullDescription = `
    <p>${description}</p>
    <p>Tech stack: ${project.tags.join(', ')}</p>
  `;

  return (
    <MainLayout>
      <article className="py-16 max-w-4xl mx-auto">
        <div className="mb-12 space-y-2">
          <Link href="/projects" className="text-muted-foreground hover:text-primary">
            ← {t('allProjects')}
          </Link>
          <h1 className="text-4xl font-bold mt-4">{project.title}</h1>
          <p className="text-xl text-muted-foreground">{description}</p>
          <div className="flex flex-wrap gap-2 pt-4">
            {project.tags.map(tag => (
              <span key={tag} className="text-xs px-2 py-1 bg-muted rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="relative aspect-video rounded-xl overflow-hidden mb-12">
          <Image src={project.image} alt={project.title} fill className="object-cover" priority />
        </div>

        <div
          className="prose prose-lg dark:prose-invert max-w-none mb-10"
          dangerouslySetInnerHTML={{ __html: fullDescription }}
        />

        <div className="flex gap-4 mt-8">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-foreground text-background px-6 py-3 rounded-full hover:bg-foreground/90 transition-colors font-medium"
            >
              {t('viewDemo')}
            </a>
          )}
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-foreground px-6 py-3 rounded-full hover:bg-muted transition-colors font-medium"
          >
            {t('viewSource')}
          </a>
        </div>
      </article>
    </MainLayout>
  );
}

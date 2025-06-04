import { useTranslations } from 'next-intl';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import MainLayout from '@/components/layout/MainLayout';

export const generateMetadata = ({ params }: { params: { id: string } }): Metadata => {
  return {
    title: `Project ${params.id}`,
    description: `Detailed information about project ${params.id}`,
  };
};

export default function ProjectDetail({ params }: { params: { id: string } }) {
  const t = useTranslations('Projects');
  const projectId = params.id;

  // Em um cenário real, você carregaria os dados do projeto de uma API ou CMS
  const project = {
    id: projectId,
    title: `Project ${projectId}`,
    description:
      'This is a detailed description of the project. It includes information about the technologies used, the challenges faced, and the solutions implemented.',
    fullDescription: `
      <p>This project was created to solve a specific problem in the industry. The main challenge was to implement a scalable solution that could handle a large amount of data while maintaining performance.</p>
      <p>I used modern technologies like React, TypeScript, and Node.js to create a robust application that is both performant and maintainable.</p>
      <p>The project features a clean architecture with separation of concerns, making it easy to extend and modify. It also includes comprehensive testing to ensure reliability.</p>
    `,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000',
    tags: ['Next.js', 'TypeScript', 'TailwindCSS', 'API Integration'],
    demoUrl: 'https://example.com',
    repoUrl: 'https://github.com/yourusername/project',
    date: '2025-05-15',
  };

  return (
    <MainLayout>
      <article className="py-16 max-w-4xl mx-auto">
        <div className="mb-12 space-y-2">
          <Link href="/projects" className="text-muted-foreground hover:text-primary">
            ← {t('allProjects')}
          </Link>
          <h1 className="text-4xl font-bold mt-4">{project.title}</h1>
          <p className="text-xl text-muted-foreground">{project.description}</p>
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
          dangerouslySetInnerHTML={{ __html: project.fullDescription }}
        />

        <div className="flex gap-4 mt-8">
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-foreground text-background px-6 py-3 rounded-full hover:bg-foreground/90 transition-colors font-medium"
          >
            View Live Demo
          </a>
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-foreground px-6 py-3 rounded-full hover:bg-muted transition-colors font-medium"
          >
            View Source Code
          </a>
        </div>
      </article>
    </MainLayout>
  );
}

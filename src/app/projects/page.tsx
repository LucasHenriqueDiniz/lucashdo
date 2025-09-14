import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { ProjectStructuredData } from '@/components/SEO/StructuredData';
import { projects } from '@/constants';

const ProjectsClient = dynamic(() => import('./projects-client'));

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

      <ProjectsClient projects={projects} />
    </>
  );
}

import { useTranslations } from 'next-intl';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import MainLayout from '@/components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'A showcase of my latest and best projects.',
};

// Dados simulados - Depois será substituído por dados reais de um CMS ou API
const projects = [
  {
    id: 1,
    title: 'E-commerce Platform',
    description: 'A modern e-commerce platform built with Next.js and Stripe integration.',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=800',
    tags: ['Next.js', 'Stripe', 'TypeScript', 'Tailwind CSS'],
  },
  {
    id: 2,
    title: 'Portfolio Website',
    description: 'A unique portfolio website with animated transitions and interactive elements.',
    image: 'https://images.unsplash.com/photo-1541560052-5e137f229371?q=80&w=800',
    tags: ['React', 'Framer Motion', 'GSAP', 'Styled Components'],
  },
  {
    id: 3,
    title: 'Dashboard UI',
    description:
      'A comprehensive dashboard interface with data visualization and real-time analytics.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800',
    tags: ['React', 'D3.js', 'Material UI', 'Firebase'],
  },
  {
    id: 4,
    title: 'Mobile App',
    description: 'A cross-platform mobile application for health tracking and wellness.',
    image: 'https://images.unsplash.com/photo-1523800503107-5bc3ba2a6f81?q=80&w=800',
    tags: ['React Native', 'Expo', 'GraphQL', 'Node.js'],
  },
  {
    id: 5,
    title: 'AI Web Tool',
    description: 'An AI-powered web tool for content analysis and optimization.',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800',
    tags: ['Next.js', 'OpenAI API', 'Python', 'FastAPI'],
  },
];

export default function Projects() {
  const t = useTranslations('Projects');

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
              </div>
              <div className="p-5 space-y-3">
                <h3 className="text-xl font-medium group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-muted-foreground line-clamp-2">{project.description}</p>
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

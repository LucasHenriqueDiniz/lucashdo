import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { projects } from '@/constants';
import { getRepoStars } from '@/services/github';

const ProjectDetailClient = dynamic(() => import('./client'));

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
  const [, , , owner = 'LucasHenriqueDiniz', repo = 'lucashdo'] = project.repoUrl.split('/');
  const stars = await getRepoStars(owner, repo);

  return <ProjectDetailClient project={project} stars={stars} />;
}

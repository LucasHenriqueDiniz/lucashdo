'use client';
import Image from 'next/image';
import { Browser, BrowserTab } from '@/components/home/Browser';
import { Project, projects } from '@/constants';

// Placeholder for project content
function generateProjectContent(project: Project) {
  return (
    <div style={{ padding: 16 }}>
      <h2>{project.title}</h2>
      <p>{project.description.pt}</p>
      {project.image && <Image src={project.image} alt={project.title} width={120} height={80} />}
      <div style={{ marginTop: 8 }}>
        {project.tags?.map((tag: string) => (
          <span key={tag} style={{ marginRight: 8, fontSize: 12, color: '#888' }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Blog() {
  const projectTabs: BrowserTab[] = projects.map(project => ({
    id: project.id,
    title: project.title,
    url: project.repoUrl || `https://lucashdo.com/projects/${project.id}`,
    content: generateProjectContent({ ...project }),
    icon: project.image ? (
      <Image
        src={project.image}
        alt={project.title}
        width={24}
        height={24}
        style={{ borderRadius: 4 }}
      />
    ) : (
      <span>{project.title.charAt(0).toUpperCase()}</span>
    ),
  }));

  return (
    <section className="mt-36 min-h-screen flex flex-col items-center justify-center p-4">
      <Browser tabs={projectTabs} />
    </section>
  );
}

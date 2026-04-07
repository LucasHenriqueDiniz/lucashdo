import { Project } from '@/constants';
import { Code2, Eye, ExternalLink, Star, Calendar, Tag } from 'lucide-react';
import Image from 'next/image';

interface ProjectTabContentProps {
  project: Project;
  locale: 'pt' | 'en';
}

export default function ProjectTabContent({ project, locale }: ProjectTabContentProps) {
  return (
    <div className="project-tab-content">
      {/* Header com imagem */}
      <div className="project-tab-header">
        <div className="project-tab-image-container">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="project-tab-image"
            priority
          />
          <div className="project-tab-overlay" />
        </div>
        
        <div className="project-tab-header-content">
          {project.featured && (
            <div className="project-tab-featured-badge">
              <Star size={16} className="fill-current" />
              <span>{locale === 'pt' ? 'Destaque' : 'Featured'}</span>
            </div>
          )}
          <h1 className="project-tab-title">{project.title}</h1>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="project-tab-body">
        {/* Descrição */}
        <section className="project-tab-section">
          <h2 className="project-tab-section-title">
            {locale === 'pt' ? 'Sobre o Projeto' : 'About the Project'}
          </h2>
          <p className="project-tab-description">{project.description[locale]}</p>
        </section>

        {/* Tags */}
        <section className="project-tab-section">
          <h2 className="project-tab-section-title">
            <Tag size={20} />
            {locale === 'pt' ? 'Tecnologias' : 'Technologies'}
          </h2>
          <div className="project-tab-tags">
            {project.tags.map(tag => (
              <span key={tag} className="project-tab-tag">
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* Links */}
        <section className="project-tab-section">
          <h2 className="project-tab-section-title">
            {locale === 'pt' ? 'Links' : 'Links'}
          </h2>
          <div className="project-tab-links">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-tab-link project-tab-link-repo"
              >
                <Code2 size={20} />
                <span>{locale === 'pt' ? 'Ver Código' : 'View Code'}</span>
                <ExternalLink size={16} />
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-tab-link project-tab-link-demo"
              >
                <Eye size={20} />
                <span>{locale === 'pt' ? 'Ver Demo' : 'View Demo'}</span>
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

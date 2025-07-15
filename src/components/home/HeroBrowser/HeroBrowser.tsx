'use client';

import { Code, ExternalLink, Github, Star } from 'lucide-react';
import { projects } from '@/constants/projects';
import { useLanguageStore } from '@/lib/i18n/languageStore';
import Browser from '../Browser/Browser';
import { BrowserTab } from '../Browser/types/BrowserTab';
import './HeroBrowser.css';

/**
 * HeroBrowser - Versão componentizada do Browser para a seção de projetos
 */

export default function HeroBrowser() {
  const locale = useLanguageStore(state => state.lang);

  // Função para gerar o conteúdo de um projeto
  const generateProjectContent = (project: (typeof projects)[0]) => {
    const getStatusText = (status: string) => {
      const statusMap = {
        workInProgress: locale === 'pt' ? 'Em desenvolvimento' : 'Work in Progress',
        discontinued: locale === 'pt' ? 'Descontinuado' : 'Discontinued',
        experimental: locale === 'pt' ? 'Experimental' : 'Experimental',
        completed: locale === 'pt' ? 'Concluído' : 'Completed',
      };
      return statusMap[status as keyof typeof statusMap] || status;
    };

    const getStatusColor = (status: string) => {
      const colorMap = {
        workInProgress: '#3b82f6',
        discontinued: '#ef4444',
        experimental: '#f59e0b',
        completed: '#10b981',
      };
      return colorMap[status as keyof typeof colorMap] || '#6b7280';
    };

    return (
      <div className="mac-project-browser-content">
        {/* Imagem de capa do projeto */}
        <div className="mac-project-header">
          <div
            className="mac-project-cover-image"
            style={{
              backgroundImage: `url(${project.image})`,
              height: '300px',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
            }}
          >
            <div className="mac-project-overlay">
              <div className="mac-project-header-content">
                <h1 className="mac-project-title">{project.title}</h1>
                <div className="mac-project-badges">
                  {project.featured && (
                    <div className="mac-project-featured">
                      <Star size={14} />
                      <span>{locale === 'pt' ? 'Destaque' : 'Featured'}</span>
                    </div>
                  )}
                  {project.status && (
                    <div
                      className="mac-project-status"
                      style={{ backgroundColor: getStatusColor(project.status) }}
                    >
                      <span>{getStatusText(project.status)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mac-project-details">
          {/* Descrição do projeto */}
          <div className="mac-project-description">
            <h2 className="mac-project-section-title">
              {locale === 'pt' ? 'Sobre o projeto' : 'About the project'}
            </h2>
            <p>{locale === 'pt' ? project.description.pt : project.description.en}</p>
          </div>

          {/* Tecnologias utilizadas */}
          <div className="mac-project-technologies">
            <h2 className="mac-project-section-title">
              <Code size={16} />
              {locale === 'pt' ? 'Tecnologias' : 'Technologies'}
            </h2>
            <div className="mac-project-tags">
              {project.tags.map(tag => (
                <span key={tag} className="mac-project-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Links do projeto */}
          <div className="mac-project-links">
            <a href={`/projects/${project.id}`} className="mac-project-link info-link">
              <ExternalLink size={18} />
              <span>{locale === 'pt' ? 'Saber mais' : 'Learn more'}</span>
            </a>

            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mac-project-link repo-link"
              >
                <Github size={18} />
                <span>{locale === 'pt' ? 'Código Fonte' : 'Source Code'}</span>
              </a>
            )}

            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mac-project-link demo-link"
              >
                <ExternalLink size={18} />
                <span>{locale === 'pt' ? 'Ver site' : 'View site'}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };
  // Criar abas para projetos destacados
  const featuredProjects = projects.filter(project => project.featured).slice(0, 4);

  // Todos os projetos para o showcase
  const allProjectTabs: BrowserTab[] = projects.map(project => {
    return {
      id: project.id,
      title: project.title,
      url: project.repoUrl || `https://lucashdo.com/projects/${project.id}`,
      content: generateProjectContent(project),
      icon: project.image || project.title.charAt(0).toUpperCase(),
      data: {
        featured: project.featured,
        tags: project.tags,
        description: project.description[locale],
        demoUrl: project.demoUrl,
        repoUrl: project.repoUrl,
        status: project.status || 'workInProgress',
      },
    };
  });

  // Componente para a tela inicial personalizada
  const CustomHomeScreen = ({ onTabOpen }: { onTabOpen?: (tabId: string) => void }) => {
    // Manipular clique em um projeto - agora usa onTabOpen se disponível
    const handleProjectClick = (projectId: string) => {
      if (onTabOpen) {
        onTabOpen(projectId);
      } else {
        console.log('Project clicked:', projectId);
      }
    };

    return (
      <div className="mac-browser-home">
        {/* Seção de introdução */}
        <div className="mac-browser-intro-section">
          <h1 className="mac-browser-intro-title">
            {locale === 'pt' ? 'Meus Projetos' : 'My Projects'}
          </h1>
          <p className="mac-browser-intro-description">
            {locale === 'pt'
              ? 'Explore meus projetos abaixo e clique para saber mais detalhes sobre cada um. Você pode navegar pelas abas para ver mais informações, código fonte e demonstrações ao vivo.'
              : 'Explore my projects below and click to learn more details about each one. You can navigate through the tabs to see more information, source code, and live demonstrations.'}
          </p>
        </div>

        {/* Seção de projetos em destaque */}
        <div className="mac-browser-featured-section">
          <h2 className="mac-browser-section-title">
            <Star className="mac-browser-section-icon" size={18} />
            {locale === 'pt' ? 'Projetos em Destaque' : 'Featured Projects'}
          </h2>

          <div className="mac-browser-featured-grid">
            {featuredProjects.map(project => (
              <div
                key={project.id}
                className="mac-browser-project-card mac-browser-featured-card"
                onClick={() => handleProjectClick(project.id)}
              >
                <div
                  className="mac-browser-project-card-image"
                  style={{ backgroundImage: `url(${project.image})` }}
                >
                  <div className="mac-browser-project-card-featured-badge">
                    <Star size={12} />
                    <span>{locale === 'pt' ? 'Destaque' : 'Featured'}</span>
                  </div>
                </div>
                <div className="mac-browser-project-card-content">
                  <h3 className="mac-browser-project-card-title">{project.title}</h3>
                  <p className="mac-browser-project-card-description">
                    {project.description[locale].length > 120
                      ? `${project.description[locale].substring(0, 120)}...`
                      : project.description[locale]}
                  </p>
                  <div className="mac-browser-project-card-tags">
                    {project.tags.slice(0, 4).map(tag => (
                      <span key={tag} className="mac-browser-project-card-tag">
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 4 && (
                      <span className="mac-browser-project-card-more-tags">
                        +{project.tags.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grid de todos os projetos */}
        <div className="mac-browser-all-projects">
          <h2 className="mac-browser-section-title">
            <Code className="mac-browser-section-icon" size={18} />
            {locale === 'pt' ? 'Todos os Projetos' : 'All Projects'}
          </h2>

          <div className="mac-browser-projects-grid">
            {projects.map(project => (
              <div
                key={project.id}
                className="mac-browser-project-card"
                onClick={() => handleProjectClick(project.id)}
              >
                <div
                  className="mac-browser-project-card-image"
                  style={{ backgroundImage: `url(${project.image})` }}
                >
                  {project.featured && (
                    <div className="mac-browser-project-card-badge">
                      <Star size={12} />
                    </div>
                  )}
                </div>
                <div className="mac-browser-project-card-content">
                  <h3 className="mac-browser-project-card-title">{project.title}</h3>
                  <div className="mac-browser-project-card-tags">
                    {project.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="mac-browser-project-card-tag">
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="mac-browser-project-card-more-tags">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Browser
      tabs={allProjectTabs}
      homeContent={<CustomHomeScreen />}
      width={1200}
      height={600}
      isInteractive={true}
      showWindowControls={true}
    />
  );
}

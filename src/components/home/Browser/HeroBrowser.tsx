'use client';

import { Code, ExternalLink, Github, Search, Star } from 'lucide-react';
import { useState } from 'react';
import { useLocale } from 'next-intl';
import { projects } from '@/constants/projects';
import Browser, { BrowserTab } from './Browser';
import './HeroBrowser.css';

interface HeroBrowserProps {
  title?: string;
  subtitle?: string;
  width?: string | number;
  height?: string | number;
  isInteractive?: boolean;
}

/**
 * HeroBrowser - Versão componentizada do Browser para a seção de projetos
 */
export default function HeroBrowser({
  title = 'Meus Projetos',
  subtitle = 'Explore alguns dos meus trabalhos recentes',
  width = 1200,
  height = 600,
  isInteractive = true,
}: HeroBrowserProps) {
  const locale = useLocale() as 'pt' | 'en';

  // Estado para controlar pesquisa
  const [searchQuery, setSearchQuery] = useState('');

  // Função para gerar o conteúdo de um projeto
  const generateProjectContent = (project: (typeof projects)[0]) => {
    return (
      <div className="mac-project-browser-content">
        {/* Imagem de capa do projeto com overlay de gradiente */}
        <div className="mac-project-header">
          <div
            className="mac-project-cover-image"
            style={{ backgroundImage: `url(${project.image})` }}
          >
            <div className="mac-project-overlay">
              <h1 className="mac-project-title">{project.title}</h1>
              {project.featured && (
                <div className="mac-project-featured">
                  <Star size={14} />
                  <span>{locale === 'pt' ? 'Destaque' : 'Featured'}</span>
                </div>
              )}
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
                <span>{locale === 'pt' ? 'Demo ao vivo' : 'Live Demo'}</span>
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
      },
    };
  });

  // Componente para a tela inicial personalizada
  const CustomHomeScreen = ({ onTabOpen }: { onTabOpen?: (tabId: string) => void }) => {
    // Filtrar projetos com base na pesquisa
    const filteredProjects = projects.filter(
      project =>
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.description[locale] || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Manipular alteração na pesquisa
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    };

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
        {/* Cabeçalho da página inicial */}
        <div className="mac-browser-home-header">
          <h1 className="mac-browser-home-title">{title}</h1>
          <p className="mac-browser-home-subtitle">{subtitle}</p>
          {/* Barra de pesquisa de projetos */}
          <div className="mac-browser-search">
            <Search className="mac-browser-search-icon" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="mac-browser-search-input"
              placeholder={locale === 'pt' ? 'Pesquisar projetos...' : 'Search projects...'}
            />
          </div>
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
                    {project.description[locale].length > 100
                      ? `${project.description[locale].substring(0, 100)}...`
                      : project.description[locale]}
                  </p>
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

        {/* Grid de todos os projetos */}
        <div className="mac-browser-all-projects">
          <h2 className="mac-browser-section-title">
            <Code className="mac-browser-section-icon" size={18} />
            {locale === 'pt' ? 'Todos os Projetos' : 'All Projects'}
          </h2>

          <div className="mac-browser-projects-grid">
            {filteredProjects.length > 0 ? (
              filteredProjects.map(project => (
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
                      {project.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="mac-browser-project-card-tag">
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 2 && (
                        <span className="mac-browser-project-card-more-tags">
                          +{project.tags.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="mac-browser-no-results">
                <Search size={32} />
                <p>
                  {locale === 'pt'
                    ? 'Nenhum projeto encontrado para sua pesquisa'
                    : 'No projects found for your search'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Browser
      tabs={allProjectTabs}
      homeContent={<CustomHomeScreen />}
      initialOpenTabs={featuredProjects.slice(0, 2).map(p => p.id)} // Abrir 2 projetos em destaque
      width={width}
      height={height}
      isInteractive={isInteractive}
      showWindowControls={true}
    />
  );
}

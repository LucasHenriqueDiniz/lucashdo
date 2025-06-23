'use client';

import { Code, ExternalLink, Github, Home, Search, Star } from 'lucide-react';
import { useRef, useState } from 'react';
import { projects } from '@/constants/projects';
import Browser, { BrowserRefType, BrowserTab } from './Browser';
import './Browser.css';
import './MacBrowser.css';

interface MacBrowserProps {
  /** Define se o navegador está em modo decorativo */
  isDecorative?: boolean;
  /** Modo antigo ou novo do MacBrowser (uso do Browser ou ProjectsBrowser) */
  useProjectBrowser?: boolean;
  /** Título personalizado para a seção de projetos */
  title?: string;
  /** Subtítulo personalizado para a seção de projetos */
  subtitle?: string;
  /** URL personalizada para exibir na barra de endereço */
  url?: string;
  /** Nome da aba personalizado */
  tabName?: string;
  /** Largura personalizada do navegador */
  width?: string;
  /** Altura personalizada do navegador */
  height?: string;
  /** Idioma para exibir o conteúdo (pt ou en) */
  locale?: 'pt' | 'en';
}

/**
 * MacBrowser - Um componente que exibe navegador com projetos em modo desktop
 * Mantido para compatibilidade com código existente
 */
export default function MacBrowser({
  isDecorative = false,
  title = 'Meus Projetos',
  subtitle = 'Confira alguns dos meus trabalhos mais recentes',
  width = '1200px', // Tamanho fixo para melhor visualização
  height = '600px', // Tamanho fixo para melhor visualização
  locale = 'pt',
}: MacBrowserProps) {
  // Estado para controlar abas ativas e pesquisa
  const [activeTabId, setActiveTabId] = useState<string | undefined>('home-tab');
  const [searchQuery, setSearchQuery] = useState('');
  // Ref para acessar funções do Browser, como focar na barra de URL
  const browserRef = useRef<BrowserRefType | null>(null);

  /**
   * Função para manejar o foco na pesquisa
   * Quando chamada, foca na barra de URL do Browser
   */
  const handleSearchFocus = () => {
    if (browserRef.current) {
      browserRef.current.focusUrlBar();
    }
  };

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
  /*
   * Criando a aba Home - Esta é a aba especial que mostrará
   * todos os projetos e permitirá que o usuário escolha
   * qual projeto abrir em uma nova aba. O conteúdo desta aba
   * é o mesmo que o CustomHomeScreen fornece.
   */
  const homeTab: BrowserTab = {
    id: 'home-tab',
    title: locale === 'pt' ? 'Início' : 'Home',
    url: 'https://lucashdo.com/projects',
    content: null, // O conteúdo será atualizado dinamicamente mais tarde
    icon: <Home size={14} />, // Usando o ícone de casa da biblioteca lucide-react
    data: {
      isHome: true,
    },
  };

  const projectTabs: BrowserTab[] = [
    homeTab, // Adicionando a aba Home como primeira aba
    ...featuredProjects.map(project => {
      return {
        id: project.id,
        title: project.title,
        url: project.repoUrl || `https://lucashdo.com/projects/${project.id}`,
        content: generateProjectContent(project),
        icon: project.image || project.title.charAt(0).toUpperCase(),
        data: {
          featured: true,
          tags: project.tags,
          description: project.description[locale],
        },
      };
    }),
  ];

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
  }); // Componente para a tela inicial personalizada
  const CustomHomeScreen = () => {
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
    }; // Manipular clique em um projeto

    const handleProjectClick = (projectId: string) => {
      // Atualiza a aba ativa para o projeto selecionado
      setActiveTabId(projectId);

      const projectTab = document.querySelector(`[data-tab-id="${projectId}"]`);
      if (projectTab) {
        projectTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }
    };

    return (
      <div className="mac-browser-home">
        {/* Cabeçalho da página inicial */}
        <div className="mac-browser-home-header">
          <h1 className="mac-browser-home-title">{title}</h1>
          <p className="mac-browser-home-subtitle">{subtitle}</p>{' '}
          {/* Barra de pesquisa de projetos */}{' '}
          <div className="mac-browser-search" onClick={handleSearchFocus}>
            <Search className="mac-browser-search-icon" size={18} />{' '}
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="mac-browser-search-input"
              placeholder={locale === 'pt' ? 'Pesquisar projetos...' : 'Search projects...'}
              onClick={e => {
                // Impedir propagação para que não interfira no onClick do div pai
                e.stopPropagation();
                handleSearchFocus();
              }}
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
  // Handler para alteração de aba
  const handleTabChange = (tabId: string) => {
    setActiveTabId(tabId);
  };
  // Handler para novas abas
  const handleNewTab = () => {
    // Define que a aba ativa será a Home e limpa a pesquisa
    setActiveTabId('home-tab');
    setSearchQuery('');

    // Adiciona uma classe visual para indicar quando a aba Home foi selecionada
    setTimeout(() => {
      const homeTabElement = document.querySelector('[data-tab-id="home-tab"]');
      if (homeTabElement) {
        homeTabElement.classList.add('tab-highlight');
        setTimeout(() => {
          homeTabElement.classList.remove('tab-highlight');
        }, 600);
      }
    }, 100);
  };

  // Atualiza o conteúdo da aba Home
  const updatedTabs = projectTabs.map(tab => {
    if (tab.id === 'home-tab') {
      return {
        ...tab,
        content: <CustomHomeScreen />, // Sempre use o CustomHomeScreen para a aba Home
      };
    }
    return tab;
  });

  // Função para pegar o conteúdo correto da aba
  const getTabContent = (tabId: string) => {
    if (tabId === 'home-tab') {
      return <CustomHomeScreen />;
    }

    const project = projects.find(p => p.id === tabId);
    if (project) {
      return generateProjectContent(project);
    }

    return null;
  };

  // Agora atualize todas as abas com o conteúdo correto
  const finalTabs = updatedTabs.map(tab => ({
    ...tab,
    content: getTabContent(tab.id),
  }));
  return (
    <Browser
      isDecorative={isDecorative}
      tabs={finalTabs}
      availableTabs={allProjectTabs}
      activeTabId={activeTabId}
      onTabChange={handleTabChange}
      onNewTab={handleNewTab}
      width={width}
      height={height}
      title={title}
      subtitle={subtitle}
      showWindowControls={true}
      CustomHomeScreen={<CustomHomeScreen />}
      searchQuery={searchQuery}
      onSearchChange={(query: string) => setSearchQuery(query)}
      ref={browserRef}
    />
  );
}

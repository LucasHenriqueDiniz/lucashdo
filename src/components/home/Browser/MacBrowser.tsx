'use client';

import { projects } from '@/constants/projects';
import { ExternalLink, Github } from 'lucide-react';
import Browser, { BrowserTab } from './Browser';
import './Browser.css';

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
  url = 'https://lucashdo.com/projects',
  tabName = 'Projetos',
  width = '900px', // Tamanho fixo para melhor visualização
  height = '600px', // Tamanho fixo para melhor visualização
  locale = 'pt',
}: MacBrowserProps) {
  // Função para gerar o conteúdo de um projeto
  const generateProjectContent = (project: (typeof projects)[0]) => {
    return (
      <div className="project-browser-content">
        <div className="project-header">
          <div className="project-cover-image" style={{ backgroundImage: `url(${project.image})` }}>
            <div className="project-overlay">
              <h1 className="project-title">{project.title}</h1>
            </div>
          </div>
        </div>

        <div className="project-details">
          <div className="project-description">
            <p>{locale === 'pt' ? project.description.pt : project.description.en}</p>
          </div>

          <div className="project-tags">
            {project.tags.map(tag => (
              <span key={tag} className="project-tag">
                {tag}
              </span>
            ))}
          </div>

          <div className="project-links">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link repo-link"
              >
                <Github size={16} />
                <span>GitHub</span>
              </a>
            )}

            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link demo-link"
              >
                <ExternalLink size={16} />
                <span>Demo</span>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }; // Converter projetos para abas do navegador
  // Apenas os projetos destacados (featured) são abertos como abas para não sobrecarregar
  // O restante ficará disponível na homescreen
  const featuredProjects = projects.filter(project => project.featured).slice(0, 4); // Aumentando para 4 projetos em destaque

  const projectTabs: BrowserTab[] = featuredProjects.map(project => {
    // Retornar a BrowserTab para este projeto usando a função de geração de conteúdo
    return {
      id: project.id,
      title: project.title,
      url: project.repoUrl || `https://lucashdo.com/projects/${project.id}`,
      content: generateProjectContent(project),
      // Usar imagem do projeto como ícone, com fallback para a inicial do título
      icon: project.image || project.title.charAt(0).toUpperCase(),
      // Adicionar os dados do projeto para uso posterior, incluindo featured e tags
      data: {
        featured: true, // Este é um projeto destacado
        tags: project.tags,
        description: project.description[locale],
      },
    };
  }); // Todos os projetos (featured e não-featured) para disponibilizar no showcase
  // Adicionamos classe extra para projetos featured para destacá-los no showcase
  const allProjectTabs: BrowserTab[] = projects.map(project => {
    // Criar conteúdo para cada projeto
    return {
      id: project.id,
      title: project.title,
      url: project.repoUrl || `https://lucashdo.com/projects/${project.id}`,
      content: generateProjectContent(project), // Gerar conteúdo para cada projeto
      // Usar imagem do projeto como ícone com fallback para iniciais
      icon: project.image || project.title.charAt(0).toUpperCase(),
      // Propriedades extras para melhorar a exibição no Browser
      data: {
        featured: project.featured,
        tags: project.tags,
        description: project.description[locale],
        demoUrl: project.demoUrl,
        repoUrl: project.repoUrl,
      },
    };
  });
  const tabs = [...projectTabs];
  return (
    <Browser
      isDecorative={isDecorative}
      tabs={tabs}
      availableTabs={allProjectTabs}
      activeTabId={undefined} // Não seleciona nenhuma aba para mostrar a home screen
      width={width} // Usando o tamanho fixo definido nos parâmetros
      height={height} // Usando o tamanho fixo definido nos parâmetros
      title={title}
      subtitle={subtitle}
      showWindowControls={true} // Mostrando os controles da janela (que estão à esquerda agora)
    />
  );
}

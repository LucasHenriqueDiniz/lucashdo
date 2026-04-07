'use client';

import { projects } from '@/constants/projects';
import { useLanguageStore } from '@/store/languageStore';
import Browser from '../Browser/Browser';
import { BrowserTab } from '../Browser/types/BrowserTab';
import HeroBrowserMobile from './HeroBrowserMobile';
import { ProjectGrid } from '@/components/projects';
import { ArrowDown, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProjectTabContent from './ProjectTabContent';
import './HeroBrowser.css';

/**
 * HeroBrowser - Versão componentizada do Browser para a seção de projetos
 */

export default function HeroBrowser({ 
  onMaximizeChange, 
  isMaximized = false 
}: { 
  onMaximizeChange?: (maximized: boolean) => void;
  isMaximized?: boolean;
}) {
  const locale = useLanguageStore(state => state.lang);
  const router = useRouter();

  // Criar abas para projetos destacados
  const featuredProjects = projects.filter(project => project.featured).slice(0, 4);

  // Todos os projetos para o showcase
  const allProjectTabs: BrowserTab[] = projects.map(project => {
    return {
      id: project.id,
      title: project.title,
      url: project.repoUrl || `https://lucashdo.com/projects/${project.id}`,
      content: <ProjectTabContent project={project} locale={locale} />,
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

  const projectCardTranslations = {
    featured: locale === 'pt' ? 'Destaque' : 'Featured',
    viewProject: locale === 'pt' ? 'Ver projeto' : 'View project',
    viewCode: locale === 'pt' ? 'Ver código' : 'View code',
    viewDemo: locale === 'pt' ? 'Ver demo' : 'View demo',
  };

  // Section titles
  const sectionTitles = {
    featuredProjects: locale === 'pt' ? 'Projetos em Destaque' : 'Featured Projects',
    allProjects: locale === 'pt' ? 'Todos os Projetos' : 'All Projects',
  };

  // Handler para maximizar e redirecionar
  const handleMaximize = () => {
    router.push('/projects');
  };

  // Scroll suave para os projetos
  const scrollToProjects = () => {
    const projectsSection = document.querySelector('.mac-browser-section');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Componente para a tela inicial personalizada
  const CustomHomeScreen = ({ onTabOpen }: { onTabOpen?: (tabId: string) => void }) => {
    return (
      <div className="mac-browser-home">
        {/* Simple Hero Section */}
        <div className="mac-browser-simple-hero">
          <h1 className="mac-browser-simple-hero-title">
            {locale === 'pt' ? 'Meus Projetos' : 'My Projects'}
          </h1>
          <p className="mac-browser-simple-hero-subtitle">
            {locale === 'pt'
              ? 'Explore uma coleção de projetos desenvolvidos com tecnologias modernas'
              : 'Explore a collection of projects built with modern technologies'}
          </p>
          <div className="mac-browser-simple-hero-actions">
            <button 
              onClick={scrollToProjects}
              className="mac-browser-simple-hero-btn mac-browser-simple-hero-btn-primary"
            >
              <ArrowDown size={18} />
              {locale === 'pt' ? 'Ver Projetos' : 'View Projects'}
            </button>
            <button 
              onClick={() => router.push('/projects')}
              className="mac-browser-simple-hero-btn mac-browser-simple-hero-btn-secondary"
            >
              <ExternalLink size={18} />
              {locale === 'pt' ? 'Página Completa' : 'Full Page'}
            </button>
          </div>
        </div>

        {/* Featured Projects Section */}
        <div className="mac-browser-section">
          <h2 className="mac-browser-section-title">
            {sectionTitles.featuredProjects}
          </h2>
          <ProjectGrid
            projects={featuredProjects}
            locale={locale}
            translations={projectCardTranslations}
            columns={2}
            onProjectClick={onTabOpen}
          />
        </div>

        {/* All Projects Section */}
        <div className="mac-browser-section">
          <h2 className="mac-browser-section-title">
            {sectionTitles.allProjects}
          </h2>
          <ProjectGrid
            projects={projects}
            locale={locale}
            translations={projectCardTranslations}
            columns={3}
            onProjectClick={onTabOpen}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Desktop Browser */}
      <div className="hidden md:block w-full h-full">
        <Browser
          tabs={allProjectTabs}
          homeContent={<CustomHomeScreen />}
          width="100%"
          height="100%"
          isInteractive={true}
          showWindowControls={true}
          onMaximize={handleMaximize}
          externalIsMaximized={isMaximized}
        />
      </div>

      {/* Mobile Simplified Version */}
      <div className="md:hidden">
        <HeroBrowserMobile />
      </div>
    </>
  );
}

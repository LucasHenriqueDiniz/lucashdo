/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Code,
  ExternalLink,
  MousePointer,
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { MdFeaturedPlayList } from 'react-icons/md';
import { useLanguageStore } from '@/lib/i18n/languageStore';
import { Project, projects } from '@/constants/projects';
import HomeSectionTitle from '@/components/ui/HomeSectionTitle';
import Browser from '../home/Browser/Browser';
import './FeaturedProjects.css';
import ProjectBrowserTab from './ProjectBrowserTab';

const ProjectsShowcase = () => {
  const [activeTabId, setActiveTabId] = useState<string>('');
  const [activeProjectIndex, setActiveProjectIndex] = useState<number>(0);
  const [ShowMouseInfo, setShowMouseInfo] = useState<boolean>(true);
  const lang = useLanguageStore(state => state.lang);

  // Sort projects to get featured ones first
  const featuredProjects = projects.filter(project => project.featured);
  const topFeaturedProjects = featuredProjects; // Show all featured projects

  // Initialize active tab ONLY ONCE when component mounts
  useEffect(() => {
    if (topFeaturedProjects.length > 0) {
      // Ensure Windows XP Online project is initially selected if it exists
      const windowsXPProject = topFeaturedProjects.find(
        project => project.id === 'windows-xp-online'
      );

      if (windowsXPProject) {
        // Define o índice e o ID da aba ao mesmo tempo
        const windowsXPIndex = topFeaturedProjects.findIndex(p => p.id === 'windows-xp-online');
        setActiveProjectIndex(windowsXPIndex);
        setActiveTabId('windows-xp-online');
      } else {
        setActiveProjectIndex(0);
        setActiveTabId(topFeaturedProjects[0].id);
      }
    }
  }, []);

  // Handle tab change
  const handleTabChange = useCallback(
    (tabId: string | null) => {
      if (!tabId) return;

      // Verificar se é o mesmo ID de aba que já está ativo
      if (tabId === activeTabId) {
        return;
      }

      setShowMouseInfo(false); // Hide mouse info on tab change
      // Encontre o índice do projeto para atualizar activeProjectIndex
      const newIndex = topFeaturedProjects.findIndex(project => project.id === tabId);

      if (newIndex >= 0) {
        // Atualize os estados de forma direta e síncrona
        setActiveProjectIndex(newIndex);
        setActiveTabId(tabId);
      }
    },
    [activeTabId, topFeaturedProjects]
  );

  // Handle external tab request (for opening projects in new tabs)
  const handleExternalTabRequest = useCallback(
    (tabId: string) => {
      const project = topFeaturedProjects.find(p => p.id === tabId);
      if (project && project.demoUrl) {
        window.open(project.demoUrl, '_blank');
      }
    },
    [topFeaturedProjects]
  );

  // Update active tab when navigation buttons are clicked
  const navigateToProject = useCallback(
    (newIndex: number) => {
      if (newIndex >= 0 && newIndex < topFeaturedProjects.length) {
        const newId = topFeaturedProjects[newIndex].id;

        // Update states first
        setActiveTabId(newId);
        setActiveProjectIndex(newIndex);

        // Then notify browser - but browser should just change tab, not recreate
        setTimeout(() => {
          handleTabChange(newId);
        }, 0);
      }
    },
    [topFeaturedProjects, handleTabChange]
  );

  // Get current active project based on activeTabId
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useEffect(() => {
    // Sempre usar o ID da aba ativa primeiro, depois o índice, depois o primeiro projeto
    const project =
      topFeaturedProjects.find(project => project.id === activeTabId) ||
      topFeaturedProjects[activeProjectIndex] ||
      topFeaturedProjects[0];

    setActiveProject(project);
  }, [activeTabId, activeProjectIndex, topFeaturedProjects]);

  return (
    <section className="w-full max-w-7xl mx-auto my-24 px-4 sm:px-6">
      <HomeSectionTitle
        subTitle={
          lang === 'pt'
            ? 'Veja alguns dos meus projetos em destaque'
            : 'Check out some of my featured projects'
        }
        titleWhitePart={lang === 'pt' ? 'Projetos em' : 'Projects'}
        titleBluePart={lang === 'pt' ? 'Destaque' : 'Featured'}
        icon={
          <motion.div
            key={1}
            className="w-10 h-10 mr-3 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, rotate: 360 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            <MdFeaturedPlayList className="w-6 h-6 text-[var(--primary)]" />
          </motion.div>
        }
      />

      {/* Featured projects in browser */}
      {topFeaturedProjects.length > 0 && (
        <motion.div
          className="featured-projects-section mb-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h3 className="text-2xl font-bold mb-4 md:mb-0">
              <span className="text-blue-400">Featured</span> Projects
            </h3>

            {/* Project navigation arrows */}
            <div className="project-navigation">
              <motion.button
                onClick={() => {
                  const newIndex =
                    activeProjectIndex === 0
                      ? topFeaturedProjects.length - 1
                      : activeProjectIndex - 1;
                  navigateToProject(newIndex);
                }}
                className="project-nav-button group"
                aria-label="Previous project"
                whileHover={{ x: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <ChevronLeft
                  size={20}
                  className="text-slate-400 group-hover:text-white transition-colors duration-200"
                />
              </motion.button>
              <span className="text-slate-500 text-sm">
                {activeProjectIndex + 1} / {topFeaturedProjects.length}
              </span>
              <motion.button
                onClick={() => {
                  const newIndex =
                    activeProjectIndex === topFeaturedProjects.length - 1
                      ? 0
                      : activeProjectIndex + 1;
                  navigateToProject(newIndex);
                }}
                className="project-nav-button group"
                aria-label="Next project"
                whileHover={{ x: 1 }}
                whileTap={{ scale: 0.98 }}
              >
                <ChevronRight
                  size={20}
                  className="text-slate-400 group-hover:text-white transition-colors duration-200"
                />
              </motion.button>
            </div>
          </div>

          <div className="featured-projects-grid">
            <div className="md:col-span-1">
              {/* Animated Background Elements */}
              <div className="animated-background">
                <motion.div
                  className="animated-orb orb-1"
                  animate={{
                    x: [0, 15, -15, 0],
                    y: [0, -20, 8, 0],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
                <motion.div
                  className="animated-orb orb-2"
                  animate={{
                    x: [0, -20, 15, 0],
                    y: [0, 25, -15, 0],
                  }}
                  transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              </div>

              {/* Browser with project showcase */}
              <div className="relative h-full">
                {/* Mouse click instructional icon */}
                {ShowMouseInfo && (
                  <motion.div
                    className="floating-mouse-instruction"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1, duration: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="relative">
                      <motion.div
                        className="relative z-10"
                        animate={{
                          scale: [1, 0.9, 1],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 2,
                          ease: 'easeInOut',
                        }}
                      >
                        <MousePointer size={16} className="text-blue-400" />
                      </motion.div>

                      {/* Simplified ripple effect */}
                      <motion.div
                        className="absolute inset-0 rounded-full bg-blue-400/20"
                        animate={{
                          scale: [1, 1.8],
                          opacity: [0.5, 0],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 2,
                          ease: 'easeOut',
                        }}
                      />
                    </div>
                    <span className="text-sm text-slate-300 whitespace-nowrap hidden md:inline">
                      Click tabs to explore
                    </span>
                  </motion.div>
                )}
                <Browser
                  key="featured-browser" // Static key to prevent re-creation
                  height="100%"
                  tabs={topFeaturedProjects.map(project => ({
                    id: project.id,
                    title: project.title,
                    url: `/projects/${project.id}`,
                    icon: project.image,
                    content: (
                      <ProjectBrowserTab
                        project={project}
                        onClick={() => handleTabChange(project.id)}
                        isActive={activeTabId === project.id}
                      />
                    ),
                  }))}
                  initialActiveTab={activeTabId}
                  initialOpenTabs={topFeaturedProjects.map(project => project.id)}
                  externalActiveTabId={activeTabId}
                  onTabChange={handleTabChange}
                  onExternalTabRequest={handleExternalTabRequest}
                  width="600px"
                  showWindowControls={true}
                  hideNewTabButton={true}
                  isInteractive={false}
                />
              </div>
            </div>

            {/* Project details - updates when tab changes */}
            <div className="flex flex-col justify-center  h-full">
              <AnimatePresence mode="wait">
                {activeProject && (
                  <motion.div
                    key={activeProject.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="relative  h-full bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl p-6 rounded-xl shadow-2xl border border-slate-700/50 overflow-hidden z-10"
                  >
                    {/* Glass effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>

                    {/* Decorative elements */}
                    <div className="absolute -top-16 -right-16 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-indigo-500/15 rounded-full blur-3xl"></div>
                    <motion.div
                      className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
                      initial={{ scaleX: 0, transformOrigin: 'left' }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.2, duration: 0.8 }}
                    />

                    {/* Project created date */}
                    <motion.div
                      className="flex items-center gap-1.5 mb-3 text-xs font-medium text-slate-400"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Calendar size={14} />
                      <span>Created {new Date().getUTCFullYear()}</span>
                    </motion.div>

                    {/* Title with animated underline */}
                    <div className="relative z-10">
                      <motion.h4
                        className="text-2xl font-bold mb-2 text-white inline-block"
                        initial={{ backgroundSize: '0% 2px' }}
                        animate={{ backgroundSize: '100% 2px' }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        style={{
                          backgroundImage: 'linear-gradient(90deg, #60a5fa, #a78bfa)',
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: '0 100%',
                        }}
                      >
                        {activeProject.title}
                      </motion.h4>
                    </div>

                    {/* Tags with animated appearance */}
                    <motion.div
                      className="flex flex-wrap gap-2 mb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    >
                      {activeProject.tags.map((tag, index) => (
                        <motion.span
                          key={`${activeProject.id}-${tag}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + index * 0.05, duration: 0.2 }}
                          className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 text-blue-200 text-xs px-3 py-1 rounded-full border border-blue-800/40 shadow-sm shadow-blue-900/20"
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </motion.div>

                    {/* Description with animated fade */}
                    <motion.p
                      className="text-slate-300 mb-6 leading-relaxed text-sm md:text-base max-h-[165px] overflow-hidden text-ellipsis"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                    >
                      {lang === 'pt' ? activeProject.description.pt : activeProject.description.en}
                    </motion.p>

                    {/* Action buttons with hover effects and icons */}
                    <motion.div
                      className="flex flex-wrap gap-3 mt-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.3 }}
                    >
                      <Link
                        href={activeProject.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 transition-all duration-300 text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-md shadow-blue-900/20 hover:shadow-lg hover:shadow-blue-900/30"
                      >
                        <Code
                          size={16}
                          className="transition-transform group-hover:-translate-y-0.5 group-hover:rotate-3"
                        />
                        <span>View Code</span>
                      </Link>
                      {activeProject.demoUrl && (
                        <Link
                          href={activeProject.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-2 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 transition-all duration-300 text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-md shadow-black/20 hover:shadow-lg hover:shadow-black/30"
                        >
                          <ExternalLink
                            size={16}
                            className="transition-transform group-hover:-translate-y-0.5 group-hover:rotate-3"
                          />
                          <span>Live Demo</span>
                        </Link>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}

      {/* View all projects link */}
      <div className="flex justify-center mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <Link
            href="/projects"
            className="group relative overflow-hidden bg-gradient-to-r from-blue-600/90 to-blue-700/90 hover:from-blue-500/90 hover:to-blue-600/90 text-white font-medium py-3 px-7 rounded-lg shadow-md shadow-blue-900/20 hover:shadow-lg hover:shadow-blue-900/30 transition-all duration-300 flex items-center gap-3"
          >
            <span className="z-10 relative">View all projects</span>
            <motion.span
              className="inline-block z-10 relative"
              animate={{ x: [0, 2, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <ArrowRight size={18} />
            </motion.span>

            {/* Moving gradient background */}
            <div
              className="absolute inset-0 bg-[length:400%_400%] z-0"
              style={{
                backgroundImage:
                  'linear-gradient(45deg, rgba(59,130,246,0.7), rgba(79,70,229,0.8), rgba(147,51,234,0.7), rgba(59,130,246,0.7))',
                animation: 'gradient-shift 8s ease infinite',
              }}
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsShowcase;

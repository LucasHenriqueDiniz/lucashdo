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
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { type Locale } from '@/lib/i18n/config';
import { Project, projects } from '@/constants/projects';
import Browser from '../home/Browser/Browser';
import ProjectBrowserTab from './ProjectBrowserTab';
import './ProjectsShowcase.css';

const ProjectsShowcase2 = () => {
  const locale = useLocale() as Locale;
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTabId, setActiveTabId] = useState<string>('');
  const [activeProjectIndex, setActiveProjectIndex] = useState<number>(0);

  // Sort projects to get featured ones first
  const featuredProjects = projects.filter(project => project.featured);
  const topFeaturedProjects = featuredProjects.slice(0, 4);

  // Initialize active tab ONLY ONCE when component mounts
  useEffect(() => {
    if (topFeaturedProjects.length > 0) {
      // Ensure Windows XP Online project is initially selected if it exists
      const windowsXPProject = topFeaturedProjects.find(
        project => project.id === 'windows-xp-online'
      );

      if (windowsXPProject) {
        console.log(
          'Found Windows XP Online project! Setting as initial active tab:',
          windowsXPProject.id
        );
        // Define o índice e o ID da aba ao mesmo tempo
        const windowsXPIndex = topFeaturedProjects.findIndex(p => p.id === 'windows-xp-online');
        setActiveProjectIndex(windowsXPIndex);
        setActiveTabId('windows-xp-online');
      } else {
        console.log(
          'Windows XP Online not found, defaulting to first project:',
          topFeaturedProjects[0].id
        );
        setActiveProjectIndex(0);
        setActiveTabId(topFeaturedProjects[0].id);
      }
    }
  }, []);

  // Close modal when pressing escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // Lock scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]); // Handle tab change

  const handleTabChange = (tabId: string) => {
    console.log('ProjectsShowcase2: Tab mudou para:', tabId);

    // Verificar se é o mesmo ID de aba que já está ativo
    if (tabId === activeTabId) {
      console.log('ProjectsShowcase2: Tab já está ativa, ignorando:', tabId);
      return;
    }

    // Encontre o índice do projeto para atualizar activeProjectIndex
    const newIndex = topFeaturedProjects.findIndex(project => project.id === tabId);
    console.log('New project index:', newIndex, 'for tab ID:', tabId);

    if (newIndex >= 0) {
      // Atualize os estados de forma direta e síncrona
      setActiveProjectIndex(newIndex);
      setActiveTabId(tabId);
    } else {
      console.error('Tab ID not found in topFeaturedProjects:', tabId);
    }
  }; // Get current active project based on activeTabId  // Usando useEffect para garantir que o activeProject será atualizado quando activeTabId mudar
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useEffect(() => {
    // Sempre usar o ID da aba ativa primeiro, depois o índice, depois o primeiro projeto
    const project =
      topFeaturedProjects.find(project => project.id === activeTabId) ||
      topFeaturedProjects[activeProjectIndex] ||
      topFeaturedProjects[0];

    console.log('Updating active project to:', project?.title, 'based on tabId:', activeTabId);
    setActiveProject(project);
  }, [activeTabId, activeProjectIndex, topFeaturedProjects]);

  return (
    <section className="w-full max-w-7xl mx-auto my-24 px-4 sm:px-6">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.span
          className="text-muted-foreground block text-lg font-normal mb-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Check out my work
        </motion.span>
        <motion.h2
          className="text-3xl md:text-4xl font-bold"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, delay: 0.7 }}
        >
          <span className="font-extrabold text-white">My </span>
          <span className="text-blue-400">Projects</span>
        </motion.h2>
      </motion.div>

      {/* Featured projects in browser */}
      {topFeaturedProjects.length > 0 && (
        <motion.div
          className="mb-24"
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
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => {
                  const newIndex =
                    activeProjectIndex === 0
                      ? topFeaturedProjects.length - 1
                      : activeProjectIndex - 1;
                  const newId = topFeaturedProjects[newIndex].id;
                  setActiveTabId(newId);
                  setActiveProjectIndex(newIndex);
                }}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 hover:border-slate-600 group"
                aria-label="Previous project"
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft
                  size={20}
                  className="text-slate-400 group-hover:text-white transition-colors"
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
                  const newId = topFeaturedProjects[newIndex].id;
                  setActiveTabId(newId);
                  setActiveProjectIndex(newIndex);
                }}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700 hover:border-slate-600 group"
                aria-label="Next project"
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight
                  size={20}
                  className="text-slate-400 group-hover:text-white transition-colors"
                />
              </motion.button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {/* Animated Background Elements */}
              <div className="animated-background">
                <motion.div
                  className="animated-orb orb-1"
                  animate={{
                    x: [0, 20, -20, 0],
                    y: [0, -30, 10, 0],
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut',
                  }}
                />
                <motion.div
                  className="animated-orb orb-2"
                  animate={{
                    x: [0, -30, 20, 0],
                    y: [0, 40, -20, 0],
                  }}
                  transition={{
                    duration: 25,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut',
                  }}
                />
                <motion.div
                  className="animated-orb orb-3"
                  animate={{
                    x: [0, 40, -10, 0],
                    y: [0, -10, 30, 0],
                  }}
                  transition={{
                    duration: 18,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut',
                  }}
                />
              </div>

              {/* Browser with project showcase */}
              <div className="project-browser-wrapper relative">
                {/* Mouse click instructional icon */}
                <motion.div
                  className="floating-mouse-instruction -right-4 top-16"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
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
                        duration: 1.2,
                        repeatDelay: 0.8,
                        ease: 'easeInOut',
                      }}
                    >
                      <MousePointer size={16} className="text-blue-400" />
                    </motion.div>

                    {/* Click ripple effect */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-blue-400/30"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{
                        scale: [0.5, 1.5, 2],
                        opacity: [0, 0.8, 0],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        repeatDelay: 0.5,
                        ease: 'easeOut',
                      }}
                    />

                    {/* Sparkle effects */}
                    <motion.div
                      className="absolute -top-1 -right-1 w-1 h-1 rounded-full bg-blue-300"
                      animate={{
                        y: [0, -8],
                        x: [0, 5],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.8,
                        repeatDelay: 0.9,
                      }}
                    />
                    <motion.div
                      className="absolute -bottom-1 -left-1 w-1 h-1 rounded-full bg-blue-300"
                      animate={{
                        y: [0, 8],
                        x: [0, -5],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.8,
                        repeatDelay: 0.9,
                        delay: 0.1,
                      }}
                    />
                    <motion.div
                      className="absolute -top-1 -left-2 w-1.5 h-1.5 rounded-full bg-blue-200"
                      animate={{
                        y: [0, -6],
                        x: [0, -6],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.7,
                        repeatDelay: 0.9,
                        delay: 0.2,
                      }}
                    />
                  </div>
                  <span className="text-sm text-slate-300 whitespace-nowrap">
                    Click tabs to see projects
                  </span>
                </motion.div>{' '}
                <Browser
                  allowToCloseTabs={false}
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
                  activeTabId={activeTabId}
                  onTabChange={handleTabChange}
                  width="100%"
                  height="500px"
                  showWindowControls={true}
                  hideNewTabButton={true}
                />
              </div>
            </div>

            {/* Project details - updates when tab changes */}
            <div className="md:col-span-1 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {activeProject && (
                  <motion.div
                    key={activeProject.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl p-6 rounded-xl shadow-2xl border border-slate-700/50 overflow-hidden z-10"
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
                      <span>Created {new Date().getFullYear()}</span>
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
                      transition={{ delay: 0.3, duration: 0.4 }}
                    >
                      {activeProject.tags.map((tag, index) => (
                        <motion.span
                          key={`${activeProject.id}-${tag}`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.3 + index * 0.1, duration: 0.3 }}
                          className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 text-blue-200 text-xs px-3 py-1 rounded-full border border-blue-800/40 shadow-sm shadow-blue-900/20"
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </motion.div>

                    {/* Description with animated fade */}
                    <motion.p
                      className="text-slate-300 mb-6 leading-relaxed text-sm md:text-base"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      {locale === 'pt'
                        ? activeProject.description.pt
                        : activeProject.description.en}
                    </motion.p>

                    {/* Action buttons with hover effects and icons */}
                    <motion.div
                      className="flex flex-wrap gap-3 mt-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.4 }}
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
              animate={{ x: [0, 3, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'reverse',
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

export default ProjectsShowcase2;

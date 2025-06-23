'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { Project } from '@/constants/projects';

interface ProjectBrowserTabProps {
  project: Project;
  onClick: () => void;
  isActive?: boolean;
}

const ProjectBrowserTab = ({ project, onClick, isActive = false }: ProjectBrowserTabProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className={`browser-tab-container p-6 w-full h-full overflow-hidden flex flex-col`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.2,
          ease: 'easeInOut',
        }}
        onClick={onClick}
        key={project.id}
      >
        <motion.div
          className="relative w-full flex-grow overflow-hidden rounded-lg group h-72 md:h-80"
          whileHover={{ scale: 1.02 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
        >
          <motion.div
            className="browser-tab-image w-full h-full bg-center bg-cover bg-no-repeat rounded-lg transition-all"
            style={{ backgroundImage: `url(${project.image})` }}
            initial={{ scale: 1.1, filter: 'brightness(0.8)' }}
            animate={{
              scale: 1,
              filter: 'brightness(1)',
              transition: { duration: 0.7, ease: 'easeOut' },
            }}
            whileHover={{ scale: 1.05 }}
          >
            {/* Overlay gradiente com animação suave */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 flex items-end p-6"
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h2
                className="text-2xl font-bold text-white m-0 drop-shadow-lg"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                {project.title}
              </motion.h2>
            </motion.div>
          </motion.div>

          {/* Efeito de brilho nas bordas quando ativo */}
          {isActive && (
            <motion.div
              className="browser-tab-highlight absolute inset-0 rounded-lg pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              style={{
                boxShadow: '0 0 20px 2px rgba(59, 130, 246, 0.5)',
                zIndex: 5,
              }}
            />
          )}
        </motion.div>

        <motion.div
          className="mt-6 space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className="flex flex-wrap gap-4 mt-6 justify-center sm:justify-start">
            {project.repoUrl && (
              <motion.a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="browser-tab-button inline-flex items-center gap-2 px-5 py-2.5 bg-sidebar/80 hover:bg-sidebar rounded-lg text-sm font-medium backdrop-blur-sm border border-sidebar-border shadow-lg shadow-black/20"
                whileHover={{
                  scale: 1.03,
                  boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
                  y: -2,
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
                aria-label={`View GitHub repository of ${project.title}`}
              >
                <motion.span
                  className="flex items-center gap-2"
                  whileHover={{ gap: 4 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <Github size={16} />
                  Repository
                </motion.span>
              </motion.a>
            )}

            {project.demoUrl && (
              <motion.a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="browser-tab-button inline-flex items-center gap-2 px-5 py-2.5 bg-accent/10 hover:bg-accent/20 rounded-lg text-sm font-medium backdrop-blur-sm border border-accent/20 text-accent-foreground shadow-lg shadow-accent/10"
                whileHover={{
                  scale: 1.03,
                  boxShadow: '0 8px 20px rgba(137, 61, 246, 0.15)',
                  y: -2,
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                aria-label={`View live demo of ${project.title}`}
              >
                <motion.span
                  className="flex items-center gap-2"
                  whileHover={{ gap: 4 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <ExternalLink size={16} />
                  Live Demo
                </motion.span>
              </motion.a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProjectBrowserTab;

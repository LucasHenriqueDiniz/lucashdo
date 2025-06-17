'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Github, ExternalLink, X, ArrowDown10, LucideRefreshCcw } from 'lucide-react';
import { Project } from '@/constants/projects';
import { type Locale } from '@/lib/i18n/config';
import { BsInfo, BsInfoCircleFill } from 'react-icons/bs';

interface FeaturedProjectCardProps {
  project: Project;
  locale: Locale;
  onSelect: (project: Project) => void;
}

const FeaturedProjectCard = ({ project, locale, onSelect }: FeaturedProjectCardProps) => {
  // Handle selection
  const handleCardClick = () => {
    onSelect(project);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(project);
    }
  };

  return (
    <div className="relative">
      {/* Animated squares in background - positioned behind the browser window, overlapping with each other */}
      <div className="absolute lg:w-1/2 " style={{ zIndex: -10, width: '600x', height: '100%' }}>
        {/* Square with primary background */}
        <motion.div
          className="absolute inset-0 bg-[var(--primary)] rounded-lg"
          animate={{
            rotate: 360,
            opacity: [0.1, 0.2, 0.1],
          }}
          initial={{ rotate: 180 }}
          transition={{
            duration: 20,
            ease: 'linear',
            repeat: Infinity,
          }}
        />

        {/* Square with primary border */}
        <motion.div
          className="absolute inset-0 border-2 border-[var(--primary)] rounded-lg"
          animate={{
            rotate: 360,
            opacity: [0.2, 0.3, 0.2],
          }}
          initial={{ rotate: 0 }}
          transition={{
            duration: 20,
            ease: 'linear',
            repeat: Infinity,
          }}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mt-12 relative z-10">
        {/* Browser window with project image */}
        <div className="lg:w-1/2 flex-shrink-0">
          <div className="w-full bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
            {/* Browser header with tab at the start and Mac dots on right */}
            <div className="bg-[#252525] px-4 pt-2 flex items-center">
              {/* Tab at start position */}
              <div className="flex items-center">
                <div className="rounded-t-lg pl-3 pr-2 py-1.5 flex items-center gap-2 max-w-[200px] truncate bg-[var(--secondary)]">
                  {project.icon ? (
                    <project.icon className="w-4 h-4 rounded-full" />
                  ) : (
                    <div className="w-2 h-2 bg-[var(--primary)] rounded-full"></div>
                  )}
                  <span className="text-xs text-white truncate font-medium">{project.title}</span>
                  <div className="ml-2 p-0.5 hover:bg-white/10 rounded">
                    <X size={12} className="text-white/70" />
                  </div>
                </div>
              </div>

              {/* Spacer */}
              <div className="flex-1"></div>

              {/* Mac dots on right */}
              <div className="flex space-x-2">
                <span className="w-3 h-3 rounded-full bg-[#ff605c]"></span>
                <span className="w-3 h-3 rounded-full bg-[#ffbd44]"></span>
                <span className="w-3 h-3 rounded-full bg-[#00ca4e]"></span>
              </div>
            </div>
            <div className="px-4 py-3 gap-1 flex text-xs text-[var(--muted-foreground)] bg-[var(--secondary)] font-mono">
              <LucideRefreshCcw size={14} className="inline mr-2" />
              <BsInfoCircleFill size={14} className="inline mr-2" />
              {project.demoUrl === ''
                ? 'https://www.lucashdo.com/projects/' + project.id
                : project.demoUrl}
            </div>

            {/* Browser content (image) */}
            <div className="relative aspect-video w-full">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Content section */}
        <div className="lg:w-1/2 flex flex-col justify-center">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <motion.span
              className="bg-primary/15 text-primary font-medium text-xs px-3 py-1.5 rounded-full border border-primary/20"
              whileHover={{ scale: 1.05, backgroundColor: 'var(--primary-20)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              Featured Project
            </motion.span>

            {project.tags.slice(0, 3).map(tag => (
              <motion.span
                key={tag}
                className="text-xs px-3 py-1.5 bg-secondary/40 text-foreground/90 rounded-full border border-secondary/30"
                whileHover={{ scale: 1.05, backgroundColor: 'var(--secondary)' }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                {tag}
              </motion.span>
            ))}

            {project.tags.length > 3 && (
              <motion.span
                className="text-xs px-3 py-1.5 bg-muted/60 text-foreground/80 rounded-full border border-border/40"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                +{project.tags.length - 3}
              </motion.span>
            )}
          </div>

          <h2 className="text-3xl font-bold mb-5 text-foreground/95">{project.title}</h2>

          <p className="text-muted-foreground text-base mb-6 leading-relaxed">
            {project.description[locale]}
          </p>

          <div className="flex flex-wrap gap-4 mt-auto">
            <motion.button
              onClick={e => {
                e.stopPropagation();
                onSelect(project);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-[var(--primary-foreground)] bg-[var(--primary)] rounded-lg text-sm font-medium shadow-lg"
              whileHover={{
                scale: 1.03,
                boxShadow: '0 4px 20px var(--primary)',
                backgroundColor: 'var(--secondary)',
              }}
              whileTap={{ scale: 0.98 }}
            >
              View details
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{
                  repeat: Infinity,
                  repeatType: 'reverse',
                  duration: 1.5,
                  ease: 'easeInOut',
                }}
              >
                <ArrowRight size={16} />
              </motion.span>
            </motion.button>

            {project.repoUrl && (
              <motion.a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-sidebar/80 hover:bg-sidebar rounded-lg text-sm font-medium backdrop-blur-sm border border-sidebar-border shadow-lg shadow-black/20"
                whileHover={{ scale: 1.03, boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)' }}
                whileTap={{ scale: 0.98 }}
                aria-label={`View GitHub repository of ${project.title}`}
              >
                <Github size={16} />
                Repository
              </motion.a>
            )}

            {project.demoUrl && (
              <motion.a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent/10 hover:bg-accent/20 rounded-lg text-sm font-medium backdrop-blur-sm border border-accent/20 text-accent-foreground shadow-lg shadow-accent/10"
                whileHover={{ scale: 1.03, boxShadow: '0 8px 20px rgba(137, 61, 246, 0.15)' }}
                whileTap={{ scale: 0.98 }}
                aria-label={`View live demo of ${project.title}`}
              >
                <ExternalLink size={16} />
                Live Demo
              </motion.a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProjectCard;

/**
 * ProjectsHero Component
 * 
 * Hero section for the projects page featuring:
 * - Gradient text effect on title
 * - Fade in + slide up animations with framer-motion
 * - Integrated ProjectStats component with hero variant
 * - Gradient overlay for improved readability
 * - Responsive design (300px mobile, 400px desktop min-height)
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 9.2
 */
'use client';

import { motion } from 'framer-motion';
import { ProjectStats } from './ProjectStats';
import { Project, ProjectStatsTranslations } from './types';

interface ProjectsHeroProps {
  projects: Project[];
  translations: {
    title: string;
    subtitle: string;
    stats: ProjectStatsTranslations;
  };
}

export function ProjectsHero({ projects, translations }: ProjectsHeroProps) {
  return (
    <section className="relative min-h-[300px] md:min-h-[400px] flex items-center justify-center overflow-hidden">
      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-6 md:px-8 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="flex flex-col items-center text-center gap-8 md:gap-12"
        >
          {/* Title */}
          <div className="space-y-4 max-w-4xl">
            <h1 
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fbff 32%, #d9e4ef 68%, #b8c7d8 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
                textShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
              }}
            >
              {translations.title}
            </h1>
            
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {translations.subtitle}
            </p>
          </div>
          
          {/* Stats Display */}
          <ProjectStats 
            projects={projects} 
            translations={translations.stats}
            variant="hero"
          />
        </motion.div>
      </div>
    </section>
  );
}

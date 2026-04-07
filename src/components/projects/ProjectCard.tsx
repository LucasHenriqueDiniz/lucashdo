'use client';

import { motion, useInView } from 'framer-motion';
import { Code2, Eye, ExternalLink, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { Project, ProjectCardTranslations } from './types';

interface ProjectCardProps {
  project: Project;
  index: number;
  locale: 'pt' | 'en';
  translations: ProjectCardTranslations;
  priority?: boolean;
  onProjectClick?: (projectId: string) => void;
}

export function ProjectCard({ 
  project, 
  index, 
  locale, 
  translations,
  priority = false,
  onProjectClick 
}: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-5%' });

  const handleCardClick = (e: React.MouseEvent) => {
    // Se tem onProjectClick (está no browser), usar ele
    if (onProjectClick) {
      e.preventDefault();
      onProjectClick(project.id);
    }
    // Senão, deixa o Link funcionar normalmente
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      className="group relative h-full"
      onClick={handleCardClick}
      style={{ cursor: onProjectClick ? 'pointer' : 'default' }}
    >
      <div 
        className="
          relative h-full 
          bg-white/10 backdrop-blur-xl
          rounded-3xl overflow-hidden 
          border border-white/20
          transition-all duration-[400ms] ease-out
          hover:-translate-y-2
          hover:border-blue-500/40
        "
        style={{
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* Hover Glow Effect */}
        <div 
          className="
            absolute inset-0 rounded-3xl opacity-0 
            group-hover:opacity-100 
            transition-opacity duration-[400ms] 
            pointer-events-none
          "
          style={{
            boxShadow: '0 0 60px rgba(1, 132, 252, 0.4), 0 20px 40px rgba(1, 132, 252, 0.2)',
          }}
        />
        
        {/* Image */}
        <div className="relative aspect-video overflow-hidden bg-gray-900/50">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          
          {/* Enhanced Gradient overlay */}
          <div 
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.8) 100%)',
            }}
          />
          
          {/* Featured badge with glassmorphism */}
          {project.featured && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="
                absolute top-4 right-4 
                flex items-center gap-2 
                px-4 py-2 
                bg-white/15 backdrop-blur-md 
                border border-white/30 
                rounded-full 
                text-white text-sm font-bold
                shadow-lg
              "
            >
              <Star className="w-4 h-4 fill-current" />
              {translations.featured}
            </motion.div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Title */}
          <h3 className="
            text-xl font-bold text-white 
            group-hover:text-blue-400 
            transition-colors duration-300 
            line-clamp-1
          ">
            {project.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
            {project.description[locale]}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {project.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="
                  px-3 py-1.5 
                  text-xs font-medium 
                  bg-blue-500/15 text-blue-300 
                  border border-blue-500/30 
                  rounded-lg
                  transition-all duration-300
                  hover:bg-blue-500/25 hover:scale-105
                "
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="
                px-3 py-1.5 
                text-xs font-medium 
                bg-gray-500/15 text-gray-400 
                border border-gray-500/30 
                rounded-lg
              ">
                +{project.tags.length - 3}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <Link
              href={`/projects/${project.id}`}
              className="
                flex items-center gap-2 
                text-sm font-bold text-blue-400 
                hover:text-blue-300 
                transition-colors 
                group/link
              "
            >
              <span>{translations.viewProject}</span>
              <ExternalLink className="
                w-4 h-4 
                transition-transform 
                group-hover/link:translate-x-1 
                group-hover/link:-translate-y-1
              " />
            </Link>

            <div className="flex items-center gap-2">
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    p-2.5 
                    bg-white/5 hover:bg-white/15 
                    border border-white/10 hover:border-white/30 
                    rounded-lg 
                    text-gray-300 hover:text-white 
                    transition-all duration-300
                    hover:scale-110
                  "
                  title={translations.viewCode}
                >
                  <Code2 className="w-4 h-4" />
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    p-2.5 
                    bg-white/5 hover:bg-white/15 
                    border border-white/10 hover:border-white/30 
                    rounded-lg 
                    text-gray-300 hover:text-white 
                    transition-all duration-300
                    hover:scale-110
                  "
                  title={translations.viewDemo}
                >
                  <Eye className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

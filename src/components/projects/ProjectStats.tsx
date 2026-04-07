'use client';

import { motion } from 'framer-motion';
import { Code, Layers, Star } from 'lucide-react';
import { Project, ProjectStatsTranslations } from './types';

interface ProjectStatsProps {
  projects: Project[];
  translations: ProjectStatsTranslations;
  variant?: 'hero' | 'page';
}

export function ProjectStats({ projects, translations, variant = 'hero' }: ProjectStatsProps) {
  const totalProjects = projects.length;
  const featuredProjects = projects.filter(p => p.featured).length;
  const uniqueTechnologies = Array.from(new Set(projects.flatMap(p => p.tags))).length;

  const stats = [
    {
      icon: Layers,
      value: totalProjects,
      label: translations.projects,
      color: 'from-blue-500 to-cyan-500',
      shadowColor: 'rgba(1, 132, 252, 0.3)'
    },
    {
      icon: Star,
      value: featuredProjects,
      label: translations.featured,
      color: 'from-purple-500 to-pink-500',
      shadowColor: 'rgba(168, 85, 247, 0.3)'
    },
    {
      icon: Code,
      value: uniqueTechnologies,
      label: translations.technologies,
      color: 'from-orange-500 to-red-500',
      shadowColor: 'rgba(249, 115, 22, 0.3)'
    }
  ];

  const isHero = variant === 'hero';

  return (
    <div className={`flex justify-center gap-4 md:gap-6 lg:gap-8 ${isHero ? 'flex-wrap' : ''}`}>
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1, ease: 'easeOut' }}
          whileHover={{ 
            y: -8, 
            scale: 1.05,
            transition: { duration: 0.3, ease: 'easeOut' }
          }}
          className={`
            group relative flex flex-col items-center gap-3
            ${isHero 
              ? 'px-8 py-6 min-w-[140px] md:min-w-[160px]' 
              : 'px-6 py-5 min-w-[120px]'
            }
            bg-white/10 backdrop-blur-md 
            border border-white/20 
            rounded-2xl
            transition-all duration-300
            hover:border-blue-500/40
            cursor-default
          `}
          style={{
            boxShadow: `0 10px 30px ${stat.shadowColor}`,
          }}
        >
          {/* Icon with Gradient Background */}
          <div 
            className={`
              p-3 rounded-xl bg-gradient-to-br ${stat.color}
              ${isHero ? 'opacity-90' : 'opacity-85'}
              group-hover:opacity-100 
              transition-opacity duration-300
              shadow-lg
            `}
          >
            <stat.icon className={`${isHero ? 'w-6 h-6' : 'w-5 h-5'} text-white`} />
          </div>

          {/* Value */}
          <div 
            className={`
              ${isHero ? 'text-4xl md:text-5xl' : 'text-3xl md:text-4xl'} 
              font-black text-white leading-none
              group-hover:scale-110 transition-transform duration-300
            `}
          >
            {stat.value}
          </div>

          {/* Label */}
          <div 
            className={`
              ${isHero ? 'text-sm' : 'text-xs'} 
              font-semibold text-gray-300 uppercase tracking-wider
            `}
          >
            {stat.label}
          </div>
          
          {/* Hover Glow Effect */}
          <div 
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              boxShadow: `0 0 40px ${stat.shadowColor}, inset 0 0 20px ${stat.shadowColor}`,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}

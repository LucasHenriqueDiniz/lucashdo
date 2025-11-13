'use client';

import { motion } from 'framer-motion';
import { Code, ExternalLink, Github, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useMemo } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { projects } from '@/constants/projects';
import { useLanguageStore } from '@/store/languageStore';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function HeroBrowserMobile() {
  const locale = useLanguageStore(state => state.lang);

  const featuredProjects = useMemo(
    () => projects.filter(project => project.featured),
    []
  );

  const getStatusText = (status: string) => {
    const statusMap = {
      workInProgress: locale === 'pt' ? 'Em desenvolvimento' : 'Work in Progress',
      discontinued: locale === 'pt' ? 'Descontinuado' : 'Discontinued',
      experimental: locale === 'pt' ? 'Experimental' : 'Experimental',
      completed: locale === 'pt' ? 'Concluído' : 'Completed',
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      workInProgress: '#3b82f6',
      discontinued: '#ef4444',
      experimental: '#f59e0b',
      completed: '#10b981',
    };
    return colorMap[status as keyof typeof colorMap] || '#6b7280';
  };

  const plugins = useMemo(
    () => [Autoplay({ delay: 5000, stopOnInteraction: false })],
    []
  );

  if (featuredProjects.length === 0) return null;

  return (
    <section className="w-full max-w-[100vw] overflow-x-hidden px-4 py-12 md:hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-full"
      >
        {/* Header */}
        <div className="mb-6 text-center">
          <motion.h2
            className="text-2xl font-bold mb-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <span className="text-[var(--foreground)]">
              {locale === 'pt' ? 'Projetos em ' : 'Featured '}
            </span>
            <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--cyan)] bg-clip-text text-transparent">
              {locale === 'pt' ? 'Destaque' : 'Projects'}
            </span>
          </motion.h2>
          <motion.p
            className="text-sm text-[var(--muted-foreground)]"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {locale === 'pt'
              ? 'Explore alguns dos meus projetos favoritos'
              : 'Explore some of my favorite projects'}
          </motion.p>
        </div>

        {/* Projects Carousel */}
        <div className="relative w-full max-w-sm mx-auto px-4">
          <Carousel
            orientation="horizontal"
            opts={{ align: 'start', loop: true }}
            plugins={plugins}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {featuredProjects.map((project, index) => (
                <CarouselItem key={project.id} className="pl-2 md:pl-4 basis-full">
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
              <div className="relative group bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
                {/* Background gradient effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 via-transparent to-[var(--cyan)]/5 pointer-events-none" />

                {/* Project Image */}
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 85vw, 400px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-2">
                    <div className="flex gap-2 flex-wrap">
                      {project.featured && (
                        <motion.div
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--primary)]/20 backdrop-blur-sm border border-[var(--primary)]/30"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.15 + 0.2, type: 'spring' }}
                        >
                          <Star size={12} className="text-[var(--primary)]" />
                          <span className="text-xs font-medium text-[var(--primary)]">
                            {locale === 'pt' ? 'Destaque' : 'Featured'}
                          </span>
                        </motion.div>
                      )}
                      {project.status && (
                        <motion.div
                          className="px-2.5 py-1 rounded-full backdrop-blur-sm border text-xs font-medium"
                          style={{
                            backgroundColor: `${getStatusColor(project.status)}20`,
                            borderColor: `${getStatusColor(project.status)}40`,
                            color: getStatusColor(project.status),
                          }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.15 + 0.25, type: 'spring' }}
                        >
                          {getStatusText(project.status)}
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Title overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-2 drop-shadow-lg">
                      {project.title}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  {/* Description */}
                  <p className="text-sm text-[var(--muted-foreground)] line-clamp-3 leading-relaxed">
                    {locale === 'pt' ? project.description.pt : project.description.en}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-xs font-medium text-[var(--primary)]"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="px-2 py-0.5 rounded-lg bg-slate-700/50 text-xs text-[var(--muted-foreground)]">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <Link
                      href={`/projects/${project.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/80 hover:from-[var(--primary)]/90 hover:to-[var(--primary)]/70 text-white font-medium text-sm transition-all shadow-lg shadow-[var(--primary)]/20 hover:shadow-[var(--primary)]/30"
                    >
                      <ExternalLink size={16} />
                      <span>{locale === 'pt' ? 'Ver mais' : 'Learn more'}</span>
                    </Link>
                    {project.repoUrl && (
                      <Link
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-white transition-colors"
                        aria-label="View source code"
                      >
                        <Github size={16} />
                      </Link>
                    )}
                    {project.demoUrl && (
                      <Link
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-white transition-colors"
                        aria-label="View live demo"
                      >
                        <Code size={16} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 md:left-4 size-8" />
            <CarouselNext className="right-2 md:right-4 size-8" />
          </Carousel>
        </div>

        {/* View All Button */}
        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--primary)]/10 to-[var(--cyan)]/10 border border-[var(--primary)]/20 hover:border-[var(--primary)]/40 text-[var(--primary)] font-medium text-sm transition-all hover:shadow-lg hover:shadow-[var(--primary)]/20"
          >
            <span>{locale === 'pt' ? 'Ver todos os projetos' : 'View all projects'}</span>
            <ExternalLink size={16} />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}


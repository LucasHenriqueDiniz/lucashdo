'use client';

import { AnimatePresence, motion, useInView, Variants } from 'framer-motion';
import { Code2, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { Locale } from '@/lib/i18n/config';
import { Project } from '@/constants';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ProjectCardProps {
  project: Project;
  index: number;
  locale: Locale;
  translations: {
    featured: string;
    viewProject: string;
  };
}

// Variantes de animação para os cartões de projeto
const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.215, 0.61, 0.355, 1], // easeOutCubic
    },
  }),
  hover: {
    y: -8,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

// Variantes para a borda gradiente
const borderVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  hover: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
    },
  },
};

// Variantes para o overlay da imagem
const overlayVariants: Variants = {
  initial: {
    opacity: 0,
  },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
};

// Variantes para a imagem
const imageVariants: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.1,
    transition: {
      duration: 0.7,
      ease: [0.33, 1, 0.68, 1], // easeOutCubic
    },
  },
};

// Variantes para o ícone de seta
const arrowVariants: Variants = {
  initial: {
    x: 0,
  },
  hover: {
    x: 5,
    transition: {
      repeat: Infinity,
      repeatType: 'reverse',
      duration: 0.7,
    },
  },
};

export const ProjectCard = ({ project, index, locale, translations }: ProjectCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15%' });

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      whileHover="hover"
      custom={index}
      className="group relative bg-white/80 dark:bg-gray-800/50 backdrop-blur-md rounded-xl overflow-hidden shadow-lg transition-all border border-gray-100/40 dark:border-gray-700/30"
      layoutId={`project-card-${project.id}`}
    >
      {/* Animated gradient border on hover */}
      <motion.div
        variants={borderVariants}
        initial="initial"
        animate="initial"
        whileHover="hover"
        className="absolute -inset-0.5 bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--blue)] rounded-xl blur-sm"
      />

      <div className="relative rounded-xl overflow-hidden z-10 bg-white/90 dark:bg-gray-800/90 h-full flex flex-col">
        {/* Image container with hover animation */}
        <div className="aspect-video bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
          <motion.div variants={imageVariants} className="w-full h-full">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              priority={index < 6}
            />
          </motion.div>

          {project.featured && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
              className="absolute top-3 right-3 bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--blue)] text-white font-medium text-xs px-3 py-1 rounded-full shadow-md"
            >
              {translations.featured}
            </motion.div>
          )}

          {/* Overlay gradient */}
          <motion.div
            variants={overlayVariants}
            className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
          />
        </div>

        <div className="p-6 space-y-4 flex-grow flex flex-col">
          <motion.h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 group-hover:text-[color:var(--primary)] transition-colors duration-300">
            {project.title}
          </motion.h3>

          <motion.p className="text-gray-600 dark:text-gray-300 line-clamp-2">
            {project.description[locale]}
          </motion.p>

          <motion.div className="flex flex-wrap gap-2 pt-2">
            {project.tags.map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * i + 0.3, duration: 0.3 }}
                className="text-xs px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-full font-medium text-gray-700 dark:text-gray-300"
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>

          <div className="pt-3 flex justify-between items-center mt-auto">
            <Link
              href={`/projects/${project.id}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--primary)] hover:underline group/link"
            >
              <span>{translations.viewProject}</span>
              <motion.svg
                variants={arrowVariants}
                initial="initial"
                whileHover="hover"
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </motion.svg>
            </Link>

            <div className="flex gap-2">
              <Tooltip>
                <TooltipContent>
                  <p>Ver código</p>
                </TooltipContent>
                <TooltipTrigger asChild>
                  <motion.a
                    whileHover={{ scale: 1.2, rotate: -5 }}
                    whileTap={{ scale: 0.9 }}
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-[color:var(--primary)] rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Code2 className="w-4 h-4" />
                  </motion.a>
                </TooltipTrigger>
              </Tooltip>

              {project.demoUrl && (
                <Tooltip>
                  <TooltipContent>
                    <p>Ver demo</p>
                  </TooltipContent>
                  <TooltipTrigger asChild>
                    <motion.a
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-[color:var(--primary)] rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.a>
                  </TooltipTrigger>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Variantes para o container que faz stagger dos projetos
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const ProjectsGrid = ({
  projects,
  locale,
  translations,
}: {
  projects: Project[];
  locale: Locale;
  translations: {
    featured: string;
    viewProject: string;
  };
}) => {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            locale={locale}
            translations={translations}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

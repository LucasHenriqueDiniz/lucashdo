'use client';

import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Globe } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useLanguageStore } from '@/lib/i18n/languageStore';
import { Project } from '@/constants';
import { GitHubStarsButton } from '@/components/animate-ui/buttons/github-stars';
import { AnimatedProjectsLayout } from '../AnimatedProjects';

// Enhanced animations
const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.7 } },
};

const slideUp: Variants = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const fadeInFromRight: Variants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

const tagVariants: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: index => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.3 + index * 0.07,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
  hover: {
    scale: 1.05,
    backgroundColor: 'var(--primary)',
    color: 'white',
    transition: { duration: 0.2 },
  },
};

interface ProjectDetailProps {
  project: Project;
}

export const ProjectDetail = ({ project }: ProjectDetailProps) => {
  const [imageLoading, setImageLoading] = useState(true);
  const t = useTranslations('Projects');
  const locale = useLanguageStore(state => state.lang);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="max-w-7xl mx-auto px-4 py-12 md:py-16 mt-[150px]"
    >
      {/* Back button with enhanced animation */}
      <motion.div variants={fadeIn} className="mb-8">
        <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-[color:var(--primary)] hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
          >
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: [0, -4, 0] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                repeatType: 'loop',
                repeatDelay: 2,
              }}
            >
              <ArrowLeft size={18} />
            </motion.div>
            <span className="text-sm font-medium">Voltar para projetos</span>
          </Link>
        </motion.div>
      </motion.div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column - Image and links */}
        <div className="space-y-6">
          {/* Project Image with enhanced animation */}
          <motion.div
            variants={fadeIn}
            className="relative aspect-video overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 shadow-lg group"
          >
            {/* Animated gradient overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1.2 }}
              className="absolute inset-0 bg-gradient-to-br from-[color:var(--primary)]/10 to-[color:var(--blue)]/5 z-0"
            />

            {/* Image with loading animation */}
            <Image
              src={project.image}
              alt={project.title}
              fill
              className={`object-cover transition-all duration-700 group-hover:scale-105 ${
                imageLoading ? 'opacity-0 blur-lg' : 'opacity-100 blur-0'
              }`}
              onLoadingComplete={() => setImageLoading(false)}
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            />

            {/* Overlay with buttons on hover  */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6">
              <motion.a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-black p-3 rounded-full hover:scale-110 transition-transform"
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                whileTap={{ scale: 0.95 }}
              >
                <Github size={24} />
              </motion.a>
              {project.demoUrl && (
                <motion.a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-black p-3 rounded-full hover:scale-110 transition-transform"
                  whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Globe size={24} />
                </motion.a>
              )}
            </div>
          </motion.div>

          {/* Links and buttons with enhanced animations */}
          <motion.div variants={slideUp} className="flex flex-wrap gap-4">
            <motion.a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 bg-[color:var(--primary)] text-white rounded-full hover:bg-[color:var(--primary-hover)] transition-colors"
              whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
              whileTap={{ scale: 0.97 }}
            >
              <Github size={18} />
              {t('viewSource')}
            </motion.a>
            {project.demoUrl && (
              <motion.a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.05, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                whileTap={{ scale: 0.97 }}
              >
                <ExternalLink size={18} />
                {t('viewDemo')}
              </motion.a>
            )}

            <GitHubStarsButton
              username={project.repoUrl.split('/')[3] || 'LucasHenriqueDiniz'}
              repo={project.repoUrl.split('/')[4] || 'lucashdo'}
            />
          </motion.div>
        </div>

        {/* Right Column - Content with enhanced animations and styling */}
        <motion.div variants={fadeInFromRight} className="space-y-8">
          {/* Project title with animated line */}
          <div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '70px' }}
              transition={{ duration: 0.9, ease: 'easeInOut', delay: 0.2 }}
              className="h-1 bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--blue)] mb-4"
            />
            <motion.h1
              variants={slideUp}
              className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300"
            >
              {project.title}
            </motion.h1>
          </div>

          {/* Project description with enhanced animation */}
          <motion.p
            variants={fadeIn}
            className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed"
          >
            {project.description[locale]}
          </motion.p>

          {/* Tech stack with new staggered animations */}
          <motion.div variants={slideUp} className="space-y-4">
            <h3 className="text-xl font-semibold">{t('techStack')}</h3>
            <div className="flex flex-wrap gap-3">
              {project.tags.map((tag, index) => (
                <motion.span
                  key={tag}
                  custom={index}
                  variants={tagVariants}
                  whileHover="hover"
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium cursor-default"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Additional project info with fade-in animation */}
          <motion.div
            variants={fadeIn}
            className="border-t border-gray-200 dark:border-gray-800 pt-6 mt-8"
          >
            <div className="grid grid-cols-2 gap-4 text-gray-500 dark:text-gray-400 text-sm">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.7 }}
              >
                <p className="mb-2">
                  <strong className="text-gray-700 dark:text-gray-300">Project ID:</strong>
                  <br />
                  {project.id}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.7 }}
              >
                <p>
                  <strong className="text-gray-700 dark:text-gray-300">Status:</strong>
                  <br />
                  <span
                    className={`capitalize ${project.featured ? 'text-green-500' : 'text-amber-500'}`}
                  >
                    {project.status}
                  </span>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Main component that wraps ProjectDetail with AnimatedProjectsLayout
export default function ProjectDetailClient({ project }: { project: Project }) {
  return (
    <AnimatedProjectsLayout>
      <ProjectDetail project={project} />
    </AnimatedProjectsLayout>
  );
}

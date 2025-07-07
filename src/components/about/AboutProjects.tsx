'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { LuArrowRight, LuExternalLink, LuGithub } from 'react-icons/lu';
import { useTranslations } from 'next-intl';
import { projects } from '@/constants/projects';

export default function AboutProjects() {
  const t = useTranslations('About.projects');

  // Select featured projects
  const featuredProjects = projects
    .filter(project => project.featured)
    .slice(0, 3)
    .map(project => ({
      ...project,
      highlight: project.id === 'windows-xp-online' ? t('featured') : null,
    }));

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            className="bg-white dark:bg-[color:var(--card)]/50 rounded-xl overflow-hidden shadow-sm group relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + index * 0.1 }}
            whileHover={{
              y: -8,
              transition: { duration: 0.2 },
              boxShadow: '0 10px 30px -15px rgba(0,0,0,0.2)',
            }}
          >
            {project.highlight && (
              <div className="absolute top-3 right-3 z-20">
                <span className="bg-[color:var(--amber)] text-black text-xs font-bold px-2 py-1 rounded-full">
                  {project.highlight}
                </span>
              </div>
            )}

            <div className="relative h-48 overflow-hidden">
              <Image
                src={project.image || '/logo.png'}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

              <div className="absolute bottom-0 left-0 p-4 text-white z-10">
                <h3 className="font-bold text-xl">{project.title}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.tags?.slice(0, 3).map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {project.description.pt}
              </p>
              <div className="mt-4 flex justify-between items-center">
                <div className="flex gap-2">
                  <Link
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-[color:var(--primary)] transition-colors"
                  >
                    <LuGithub size={18} />
                  </Link>
                  {project.demoUrl && (
                    <Link
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-[color:var(--primary)] transition-colors"
                    >
                      <LuExternalLink size={18} />
                    </Link>
                  )}
                </div>
                <Link
                  href={`/projects/${project.id}`}
                  className="text-sm text-[color:var(--primary)] hover:underline flex items-center gap-1 group/link"
                >
                  {t('viewDetails')}
                  <LuArrowRight
                    size={14}
                    className="group-hover/link:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="flex justify-center mt-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.05 }}
      >
        <Link
          href="/projects"
          className="bg-[color:var(--primary)] text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-[color:var(--primary)]/90 transition-all shadow-lg hover:shadow-[color:var(--primary)]/20 hover:shadow-xl"
        >
          {t('viewAll')} <LuArrowRight />
        </Link>
      </motion.div>
    </div>
  );
}

'use client';

import { AnimatePresence, motion, useInView, useScroll, useSpring } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';
import {
  LuBadgeCheck,
  LuBriefcase,
  LuCalendarDays,
  LuChevronDown,
  LuClock,
  LuExternalLink,
  LuGraduationCap,
  LuMapPin,
} from 'react-icons/lu';
import { ExperienceProps } from '@/types/experience.types';

interface ExperienceTimelineProps {
  experiences: ExperienceProps[];
  className?: string;
  type?: 'job' | 'academic';
}

export default function ExperienceTimeline({
  experiences,
  className = '',
  type = 'job',
}: ExperienceTimelineProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Filter experiences that should appear in timeline with improved sorting
  const timelineExperiences = experiences
    .filter(exp => exp.showInTimeline)
    .sort((a, b) => {
      // Extract end year from date string with more robust parsing
      const extractEndYear = (dateString: string): number => {
        const matches = dateString.match(/\b(20\d{2}|19\d{2})\b/g);
        if (!matches || matches.length === 0) return 0;
        return parseInt(matches[matches.length - 1], 10);
      };

      const yearA = extractEndYear(b.date);
      const yearB = extractEndYear(a.date);

      // Current position/education should appear first
      const isCurrentA =
        b.date.toLowerCase().includes('presente') || b.date.toLowerCase().includes('atual');
      const isCurrentB =
        a.date.toLowerCase().includes('presente') || a.date.toLowerCase().includes('atual');

      if (isCurrentA && !isCurrentB) return 1;
      if (!isCurrentA && isCurrentB) return -1;

      return yearA - yearB;
    });

  // Custom toggle handler with optional auto-collapse for other items
  const toggleExpanded = useCallback((id: string) => {
    setExpandedId(prevId => (prevId === id ? null : id));
  }, []);

  // Enhanced colors for timeline based on type
  const timelineColor =
    type === 'job'
      ? 'bg-gradient-to-b from-blue-500 via-blue-600 to-[color:var(--primary)]'
      : 'bg-gradient-to-b from-amber-500 via-amber-600 to-orange-600';

  const iconBgColor =
    type === 'job' ? 'bg-blue-500 dark:bg-blue-600' : 'bg-amber-500 dark:bg-amber-600';

  // Improved scroll animation for timeline drawing with smoother progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Adicione o componente filho para cada item da timeline
  function TimelineItem({
    experience,
    index,
    toggleExpanded,
    type,
    isExpanded,
  }: {
    experience: ExperienceProps;
    index: number;
    toggleExpanded: (id: string) => void;
    type: 'job' | 'academic';
    isExpanded: boolean;
  }) {
    const expItemRef = useRef(null);
    const isInView = useInView(expItemRef, {
      once: true,
      amount: 0.2,
      margin: '-10% 0px -10% 0px',
    });
    // Determine if this is a current/active experience
    const isCurrent =
      experience.date.toLowerCase().includes('presente') ||
      experience.date.toLowerCase().includes('atual');

    return (
      <motion.div
        key={experience.id}
        ref={expItemRef}
        className="mb-12 relative experience-card"
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{
          delay: index * 0.1,
          duration: 0.5,
          type: 'spring',
          stiffness: 100,
          damping: 20,
        }}
      >
        {/* Enhanced timeline dot with icon and animations */}
        <motion.div
          className={`absolute -left-[0.6rem] top-6 w-12 h-12 rounded-full z-10 flex items-center justify-center shadow-lg
            ${
              isExpanded
                ? `${type === 'job' ? 'bg-blue-600' : 'bg-amber-600'} text-white shadow-${type === 'job' ? 'blue' : 'amber'}-500/30`
                : `bg-white dark:bg-gray-800 text-${type === 'job' ? 'blue' : 'amber'}-500 dark:text-${type === 'job' ? 'blue' : 'amber'}-400 border border-gray-100 dark:border-gray-700`
            }
            ${isCurrent ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 ring-' + (type === 'job' ? 'blue' : 'amber') + '-400' : ''}
          `}
          initial={{ scale: 0, rotate: -30 }}
          animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0 }}
          transition={{ delay: index * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
          whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
        >
          {type === 'job' ? <LuBriefcase size={20} /> : <LuGraduationCap size={20} />}

          {/* Current indicator dot */}
          {isCurrent && (
            <motion.div
              className={`absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500`}
              animate={{
                boxShadow: ['0 0 0 0 rgba(34, 197, 94, 0.4)', '0 0 0 8px rgba(34, 197, 94, 0)'],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
              }}
            />
          )}
        </motion.div>

        {/* Experience card with improved visual design */}
        <div className="ml-16 relative">
          <motion.div
            layout
            className={`bg-white dark:bg-gray-800/70 rounded-xl overflow-hidden shadow-sm
              hover:shadow-md transition-all border border-gray-200 dark:border-gray-700
              ${isExpanded ? `ring-2 ring-${type === 'job' ? 'blue' : 'amber'}-400/30` : ''}
            `}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="relative">
              {/* Category indicator bar with animation */}
              <motion.div
                className={`absolute top-0 left-0 h-1 
                  ${
                    type === 'job'
                      ? 'bg-gradient-to-r from-blue-500 to-[color:var(--primary)]'
                      : 'bg-gradient-to-r from-amber-500 to-orange-600'
                  }`}
                initial={{ width: '0%' }}
                animate={isInView ? { width: '100%' } : { width: '0%' }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
              />

              <div className="p-5">
                {/* Top tags with improved display */}
                {experience.topTags && experience.topTags.length > 0 && (
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {experience.topTags.slice(0, 3).map((tag, tagIndex) => (
                      <motion.span
                        key={tagIndex}
                        className={`text-xs px-2 py-1 rounded-full font-medium transition-all
                          ${
                            type === 'job'
                              ? 'bg-blue-100/80 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                              : 'bg-amber-100/80 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                          }`}
                        initial={{ opacity: 0, y: -10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: index * 0.1 + 0.3 + tagIndex * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        {tag.labels.pt}
                      </motion.span>
                    ))}
                    {experience.topTags.length > 3 && (
                      <motion.span
                        className="text-xs px-2 py-1 rounded-full font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ delay: index * 0.1 + 0.6 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        +{experience.topTags.length - 3}
                      </motion.span>
                    )}
                  </div>
                )}

                {/* Header with title and toggle */}
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    {/* Date with icon */}
                    <motion.div
                      className="flex items-center text-gray-500 dark:text-gray-400 mb-2 text-sm"
                      initial={{ opacity: 0 }}
                      animate={isInView ? { opacity: 1 } : {}}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      {isCurrent ? (
                        <LuClock className="mr-1.5 text-green-500" />
                      ) : (
                        <LuCalendarDays className="mr-1.5" />
                      )}
                      <span
                        className={
                          isCurrent ? 'text-green-600 dark:text-green-400 font-medium' : ''
                        }
                      >
                        {experience.date}
                      </span>

                      {isCurrent && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-2 py-0.5 rounded-full flex items-center">
                          <LuBadgeCheck size={12} className="mr-1" />
                          Atual
                        </span>
                      )}
                    </motion.div>

                    {/* Main content with improved layout */}
                    <div className="flex gap-4 items-start">
                      {experience.image && (
                        <motion.div
                          className="flex-shrink-0 rounded-lg overflow-hidden shadow-sm"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={isInView ? { opacity: 1, scale: 1 } : {}}
                          transition={{ delay: index * 0.1 + 0.4, type: 'spring' }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <Image
                            src={experience.image}
                            alt={experience.institution}
                            width={56}
                            height={56}
                            className="rounded-md"
                          />
                        </motion.div>
                      )}

                      <div className="flex-grow">
                        <motion.h3
                          className="text-xl font-bold tracking-tight"
                          initial={{ opacity: 0, y: 10 }}
                          animate={isInView ? { opacity: 1, y: 0 } : {}}
                          transition={{ delay: index * 0.1 + 0.3 }}
                        >
                          {experience.title}
                        </motion.h3>
                        <motion.div
                          className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 mb-3"
                          initial={{ opacity: 0 }}
                          animate={isInView ? { opacity: 1 } : {}}
                          transition={{ delay: index * 0.1 + 0.4 }}
                        >
                          <LuMapPin
                            className={`text-${type === 'job' ? 'blue' : 'amber'}-500 flex-shrink-0`}
                            size={14}
                          />
                          <p>{experience.institution}</p>
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced toggle button */}
                  <motion.button
                    className={`p-2.5 rounded-full transition-all
                      ${
                        isExpanded
                          ? `bg-${type === 'job' ? 'blue' : 'amber'}-100 dark:bg-${type === 'job' ? 'blue' : 'amber'}-900/30
                             text-${type === 'job' ? 'blue' : 'amber'}-600 dark:text-${type === 'job' ? 'blue' : 'amber'}-400`
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }
                    `}
                    onClick={() => toggleExpanded(experience.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={isExpanded ? 'Fechar detalhes' : 'Ver detalhes'}
                    aria-expanded={isExpanded}
                  >
                    <LuChevronDown
                      className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </motion.button>
                </div>

                {/* Expanded content with improved animations */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <motion.div
                        className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                      >
                        {/* Description with smooth reveal */}
                        {experience.description && (
                          <motion.div
                            className="mb-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <p className="text-gray-600 dark:text-gray-300">
                              {experience.description.pt}
                            </p>
                          </motion.div>
                        )}

                        {/* Technologies or Subjects with staggered animation */}
                        {experience.tags && experience.tags.length > 0 && (
                          <motion.div
                            className="mb-3"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <h4
                              className={`font-medium mb-2 text-sm uppercase text-${type === 'job' ? 'blue' : 'amber'}-500 dark:text-${type === 'job' ? 'blue' : 'amber'}-400`}
                            >
                              {type === 'job' ? 'Tecnologias' : 'Disciplinas'}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {experience.tags.map((tag, i) => (
                                <motion.span
                                  key={i}
                                  className={`text-xs px-2 py-1 rounded-full 
                                    ${
                                      type === 'job'
                                        ? 'bg-blue-100/80 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                        : 'bg-amber-100/80 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                                    }`}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.3 + i * 0.03 }}
                                  whileHover={{ scale: 1.05 }}
                                >
                                  {tag.labels.pt}
                                </motion.span>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {/* Link to project or institution */}
                        {experience.url && (
                          <motion.div
                            className="mt-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            <Link
                              href={experience.url}
                              target="_blank"
                              className={`text-${type === 'job' ? 'blue' : 'amber'}-600 dark:text-${type === 'job' ? 'blue' : 'amber'}-400 hover:underline inline-flex items-center gap-1.5 text-sm font-medium group`}
                            >
                              {type === 'job' ? 'Ver Empresa' : 'Ver Instituição'}
                              <LuExternalLink
                                size={14}
                                className="group-hover:rotate-12 transition-transform"
                              />
                            </Link>
                          </motion.div>
                        )}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className={`experience-timeline relative ${className}`} ref={containerRef}>
      {/* Enhanced animated timeline path with pulse effect */}
      <div
        ref={timelineRef}
        className="absolute left-4 top-10 bottom-12 w-1.5 bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded-full overflow-hidden"
      >
        <motion.div
          className={`absolute top-0 left-0 w-full ${timelineColor} rounded-full`}
          style={{
            originY: 0,
            scaleY,
          }}
        />

        {/* Animated pulse effect at the end of active timeline */}
        <motion.div
          className={`absolute w-2.5 h-2.5 -left-[2px] rounded-full ${iconBgColor} shadow-lg shadow-blue-500/20`}
          style={{
            top: `calc(${scrollYProgress.get() * 100}% - 5px)`,
            opacity: scrollYProgress.get() > 0.98 ? 0 : 1,
          }}
          animate={{
            scale: [1, 1.4, 1],
          }}
          transition={{
            repeat: Infinity,
            repeatType: 'reverse',
            duration: 2,
          }}
        />
      </div>

      {timelineExperiences.map((experience, index) => (
        <TimelineItem
          key={experience.id}
          experience={experience}
          index={index}
          toggleExpanded={toggleExpanded}
          type={type}
          isExpanded={expandedId === experience.id}
        />
      ))}

      {/* End marker for timeline */}
      <motion.div
        className={`absolute -left-1.5 bottom-0 w-7 h-7 rounded-full z-10 
          ${type === 'job' ? 'bg-blue-500' : 'bg-amber-500'} flex items-center justify-center shadow-lg`}
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, type: 'spring' }}
      >
        <span className="text-white text-xs font-bold">{timelineExperiences.length}</span>
      </motion.div>
    </div>
  );
}

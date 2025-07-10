'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { LuCode, LuBrain, LuHeart, LuMail } from 'react-icons/lu';

interface ProfileHeaderProps {
  name: string;
  title: string;
  imageUrl: string;
  keywords?: string[];
  className?: string;
}

export default function ProfileHeader({
  name,
  title,
  imageUrl,
  keywords = [
    'React',
    'Next.js',
    'Node.js',
    'TypeScript',
    'Python',
    'Docker',
    'UX/UI Design',
    'Projetos de Destaque',
  ],
  className = '',
}: ProfileHeaderProps) {
  const [activeKeywords, setActiveKeywords] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });

  // Cycle through keywords for the animated display
  useEffect(() => {
    if (!keywords.length) return;

    // Initialize with static keywords to avoid constant changes
    setActiveKeywords(keywords.slice(0, Math.min(4, keywords.length)));

    // Removed auto-cycling animation to fix flickering
    // Instead, keep keywords static for better performance
  }, [keywords]);

  // Enhanced keyword categorization with better visual indicators
  const keywordCategories = [
    {
      name: 'Tech',
      icon: <LuCode className="text-blue-500" />,
      bgClass: 'bg-blue-100/80 dark:bg-blue-900/30',
      textClass: 'text-blue-700 dark:text-blue-300',
    },
    {
      name: 'Interests',
      icon: <LuHeart className="text-pink-500" />,
      bgClass: 'bg-pink-100/80 dark:bg-pink-900/30',
      textClass: 'text-pink-700 dark:text-pink-300',
    },
    {
      name: 'Skills',
      icon: <LuBrain className="text-purple-500" />,
      bgClass: 'bg-purple-100/80 dark:bg-purple-900/30',
      textClass: 'text-purple-700 dark:text-purple-300',
    },
  ];

  // Get a category for keywords with consistent assignment
  const getKeywordCategory = (keyword: string) => {
    // Create deterministic but varied category assignment
    const stringHash = keyword.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return keywordCategories[stringHash % keywordCategories.length];
  };

  return (
    <div ref={containerRef} className={`profile-header ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        {/* Enhanced profile image with animation and loading state */}
        <div className="relative">
          <motion.div
            className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden shadow-lg border-2 border-white dark:border-gray-800 flex-shrink-0 mx-auto md:mx-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
          >
            <Image
              src={imageUrl}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 96px, 128px"
              priority
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/20"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2 }}
            />
          </motion.div>

          {/* Decorative circular element */}
          <motion.div
            className="absolute -z-10 w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-[color:var(--primary)]/30 to-[color:var(--blue)]/30 blur-md"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 0.6, scale: 1.1 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
          />
        </div>

        {/* Profile content with improved layout */}
        <div className="flex-grow text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, type: 'spring' }}
          >
            <h1 className="text-3xl font-bold mb-1">{name}</h1>
            <p className="text-[color:var(--primary)] font-medium">{title}</p>
          </motion.div>

          {/* Animated available status with improved design */}
          <motion.div
            className="mt-2 inline-block"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            <Link href="/contact" className="group">
              <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20 text-green-700 dark:text-green-300 text-xs px-3 py-1.5 rounded-full shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="group-hover:underline font-medium transition-all">
                  Disponível para projetos
                </span>
                <motion.span
                  initial={{ x: -5, opacity: 0 }}
                  whileHover={{ x: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                >
                  <LuMail className="ml-1" size={14} />
                </motion.span>
              </span>
            </Link>
          </motion.div>

          {/* Enhanced animated keywords - Fixed flickering issue */}
          {keywords.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
              {/* Simplified animation without AnimatePresence to prevent flickering */}
              {activeKeywords.map((keyword: string, index: number) => {
                const category = getKeywordCategory(keyword);
                return (
                  <motion.span
                    key={keyword}
                    className={`text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap ${category.bgClass} ${category.textClass} shadow-sm`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.1,
                      ease: 'easeOut',
                    }}
                    whileHover={{
                      scale: 1.05,
                      transition: { duration: 0.2 },
                    }}
                  >
                    {category.icon}
                    <span className="font-medium">{keyword}</span>
                  </motion.span>
                );
              })}

              {keywords.length > 4 && (
                <motion.div
                  className="text-xs px-2 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 shadow-sm hover:shadow-md cursor-pointer transition-all"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  title="Ver todos os interesses"
                >
                  +{keywords.length - 4}
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

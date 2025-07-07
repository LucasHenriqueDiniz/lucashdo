'use client';

import { motion, Variants } from 'framer-motion';
import Link from 'next/link';

const fadeInUpVariants: Variants = {
  initial: {
    opacity: 0,
    y: 30,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const staggerChildrenVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const buttonHoverVariants: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
  tap: {
    scale: 0.97,
  },
};

interface ProjectsHeaderProps {
  title: string;
  description: string;
  githubLabel: string;
  contactLabel: string;
}

export const ProjectsHeader = ({
  title,
  description,
  githubLabel,
  contactLabel,
}: ProjectsHeaderProps) => {
  return (
    <motion.div
      className="relative my-16 pt-[150px]"
      initial="initial"
      animate="animate"
      variants={staggerChildrenVariants}
    >
      <div className="text-center z-10 relative">
        <motion.h1
          className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[color:var(--primary)] via-[color:var(--blue)] to-[color:var(--primary)] bg-clip-text text-transparent"
          variants={fadeInUpVariants}
        >
          {title}
        </motion.h1>

        <motion.div
          className="h-1 w-24 bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--blue)] mx-auto rounded-full mb-8"
          variants={fadeInUpVariants}
        />

        <motion.p
          className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          variants={fadeInUpVariants}
        >
          {description}
        </motion.p>

        <motion.div
          className="mt-8 flex flex-wrap justify-center gap-4"
          variants={fadeInUpVariants}
        >
          <motion.a
            href="https://github.com/LucasHDO"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--blue)] text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            variants={buttonHoverVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"
              />
            </svg>
            {githubLabel}
          </motion.a>

          <motion.div variants={buttonHoverVariants} whileHover="hover" whileTap="tap">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-full shadow hover:shadow-md transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              {contactLabel}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

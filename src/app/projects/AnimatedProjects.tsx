'use client';

import { ReactNode } from 'react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ScrollToTopButton } from './ScrollToTopButton';

interface AnimatedProjectsLayoutProps {
  children: ReactNode;
}

/**
 * Provides shared layout animations between projects listing and detail pages
 * This component wraps both pages to enable smooth transitions between them
 */
export function AnimatedProjectsLayout({ children }: AnimatedProjectsLayoutProps) {
  const pathname = usePathname();

  const variants: Variants = {
    hidden: { opacity: 0 },
    enter: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial="hidden"
          animate="enter"
          exit="exit"
          variants={variants}
          className="w-full"
        >
          {children}
        </motion.div>
      </AnimatePresence>
      <ScrollToTopButton />
    </>
  );
}

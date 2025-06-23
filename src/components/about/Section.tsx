'use client';

import { motion, useInView } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface SectionProps {
  title: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  id?: string;
}

export default function Section({ title, children, className = '', icon, id }: SectionProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <motion.section
      id={id}
      ref={sectionRef}
      className={`mb-20 scroll-mt-16 ${className}`}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="flex items-center mb-8 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {icon && (
          <motion.div
            className="mr-4 p-3 rounded-xl bg-[color:var(--primary)]/10 text-[color:var(--primary)]"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            whileHover={{ rotate: [0, -5, 5, -5, 0], transition: { duration: 0.5 } }}
          >
            {icon}
          </motion.div>
        )}

        <div className="relative">
          <h2 className="text-3xl font-bold">{title}</h2>

          <motion.div
            className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-[color:var(--primary)]/20 via-[color:var(--primary)] to-[color:var(--primary)]/20 rounded-full"
            initial={{ width: '0%', opacity: 0 }}
            animate={isInView ? { width: '100%', opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.8 }}
          />
        </div>

        {/* Decorative element */}
        <motion.div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-40 h-px bg-gradient-to-r from-gray-200 dark:from-gray-700 to-transparent opacity-50"
          initial={{ width: 0, opacity: 0 }}
          animate={isInView ? { width: 160, opacity: 0.5 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {children}
      </motion.div>
    </motion.section>
  );
}

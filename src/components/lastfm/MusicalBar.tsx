'use client';

import { motion } from 'framer-motion';

interface MusicalBarProps {
  delay: number;
  height?: 'normal' | 'small';
  color?: string;
}

export default function MusicalBar({
  delay,
  height = 'normal',
  color = 'bg-green-500',
}: MusicalBarProps) {
  return (
    <motion.div
      className={`w-1 ${height === 'small' ? 'h-4' : 'h-6'} ${color} rounded-full`}
      animate={{
        height: [
          height === 'small' ? '8px' : '16px',
          height === 'small' ? '16px' : '24px',
          height === 'small' ? '8px' : '16px',
        ],
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        delay: delay,
        ease: 'easeInOut',
      }}
    />
  );
}

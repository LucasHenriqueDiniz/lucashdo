'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GradientCardProps {
  children: ReactNode;
  gradientClasses: string;
  glowColor?: string;
  className?: string;
  delay?: number;
  index?: number;
}

export function GradientCard({
  children,
  gradientClasses,
  glowColor = '0 0 40px rgba(59, 130, 246, 0.3)',
  className = '',
  delay = 0,
  index = 0,
}: GradientCardProps) {
  return (
    <motion.div
      className={`bg-gradient-to-br ${gradientClasses} p-8 rounded-2xl shadow-lg border dark:border-opacity-50 backdrop-blur-md relative overflow-hidden group ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: delay + index * 0.1,
        type: 'spring',
        stiffness: 100,
        damping: 14,
      }}
      whileHover={{
        y: -10,
        scale: 1.03,
        boxShadow: `0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 15px -5px rgba(0, 0, 0, 0.08), ${glowColor}`,
      }}
    >
      {/* Subtle noise texture */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
      {children}
    </motion.div>
  );
}

export function GradientCardWithPattern({
  children,
  patternFill,
  gradientClasses,
  glowColor = '0 0 40px rgba(59, 130, 246, 0.3)',
  className = '',
  delay = 0,
  index = 0,
}: GradientCardProps & { patternFill: string }) {
  return (
    <GradientCard
      gradientClasses={gradientClasses}
      glowColor={glowColor}
      className={className}
      delay={delay}
      index={index}
    >
      {/* Animated pattern background with improved blob */}
      <motion.div
        className="absolute top-0 right-0 w-44 h-44 opacity-20 group-hover:opacity-30 transition-opacity duration-700"
        initial={{ rotate: 0 }}
        animate={{
          rotate: [0, 5, 0, -5, 0],
          scale: [1, 1.03, 1, 0.97, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
        }}
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                result="goo"
              />
            </filter>
          </defs>
          <g filter="url(#goo)">
            <path
              fill={patternFill}
              d="M37,-65.1C46.3,-58.8,51.3,-45,58.7,-31.7C66.1,-18.4,75.9,-5.6,77.7,8.6C79.5,22.9,73.3,38.5,63,49.8C52.7,61.1,38.2,68,23.1,73.5C8,79.1,-7.8,83.2,-22.3,79.9C-36.8,76.6,-50,65.8,-59.5,52.4C-69.1,39,-75,23,-79.6,4.7C-84.2,-13.6,-87.5,-34.2,-79.9,-49.1C-72.4,-64,-54.1,-73.2,-36.9,-75.5C-19.8,-77.9,-3.7,-73.4,10.5,-68.5C24.8,-63.6,27.7,-71.4,37,-65.1Z"
              transform="translate(100 100)"
            />
          </g>
        </svg>
      </motion.div>

      {/* Second blob with different animation for more dynamic look */}
      <motion.div
        className="absolute bottom-0 left-0 w-32 h-32 opacity-10 group-hover:opacity-20 transition-opacity duration-700"
        initial={{ rotate: 0 }}
        animate={{
          rotate: [0, -8, 0, 8, 0],
          scale: [0.8, 0.85, 0.8, 0.75, 0.8],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: 'loop',
          ease: 'easeInOut',
          delay: 1.2,
        }}
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
          <path
            fill={patternFill}
            d="M42.3,-73.3C52.9,-65.2,58.5,-49.3,65.2,-34.4C71.9,-19.5,79.7,-5.8,78.3,6.9C77,19.5,66.5,30.9,55.9,39.8C45.3,48.7,34.6,55.1,22.7,59.6C10.8,64.1,-2.3,66.9,-14.9,65C-27.4,63.2,-39.2,56.9,-52.2,48C-65.1,39.2,-79.1,28,-84,13.6C-89,-0.7,-85,-18.2,-76.2,-31.8C-67.5,-45.5,-54,-55.3,-40.3,-62.5C-26.6,-69.7,-12.5,-74.1,2.1,-77.4C16.7,-80.7,31.7,-81.4,42.3,-73.3Z"
            transform="translate(100 100)"
          />
        </svg>
      </motion.div>

      {children}

      {/* Enhanced interactive hover effects - subtle floating particles */}
      <ParticleEffect patternFill={patternFill} />
    </GradientCard>
  );
}

function ParticleEffect({ patternFill }: { patternFill: string }) {
  return (
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className={`absolute w-1.5 h-1.5 rounded-full bg-${patternFill}`}
          initial={{
            x: 20 + Math.random() * 120,
            y: 20 + Math.random() * 120,
            opacity: 0,
            scale: 0.4 + Math.random() * 0.6,
          }}
          animate={{
            x: [20 + Math.random() * 120, 10 + Math.random() * 150, 20 + Math.random() * 120],
            y: [20 + Math.random() * 120, 10 + Math.random() * 150, 20 + Math.random() * 120],
            opacity: [0, 0.8, 0],
            scale: [
              0.4 + Math.random() * 0.6,
              0.6 + Math.random() * 0.8,
              0.4 + Math.random() * 0.6,
            ],
          }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  );
}

'use client';
import React, { useState, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { skillsData, SkillDataType } from '@/constants';
import './ExpGraph.css';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export interface ExpGraphProps {
  className?: string;
}

// Simplified skill icon component for the grid
const SkillIcon = memo(
  ({
    skill,
    isHovered,
    onHover,
  }: {
    skill: SkillDataType;
    isHovered: boolean;
    onHover: (name: string | null) => void;
  }) => {
    // Get the React Icon component
    const IconComponent = skill.icon;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              className={`w-full aspect-square rounded-xl flex items-center justify-center cursor-pointer skill-icon-card ${
                isHovered ? 'active' : ''
              }`}
              style={{
                backgroundColor: isHovered ? 'var(--secondary)' : 'var(--primary)',
                border: isHovered
                  ? `1px solid rgba(255, 255, 255, 0.25)`
                  : '1px solid rgba(75, 75, 75, 0.2)',
              }}
              animate={{
                scale: isHovered ? 1.03 : 1,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 15,
                duration: 0.15,
              }}
              onMouseEnter={() => onHover(skill.name)}
              onMouseLeave={() => onHover(null)}
              whileTap={{ scale: 0.98 }}
              role="button"
              aria-label={`${skill.name}: ${skill.proexp + skill.exp} years of experience`}
            >
              <IconComponent size={30} color="white" />
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="top" align="center" className="tooltip-enhanced">
            <div className="p-1">
              <div className="font-semibold">{skill.name}</div>
              <div className="text-xs flex gap-2">
                <span>Pro: {skill.proexp}y</span>
                <span>Total: {skill.proexp + skill.exp}y</span>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
);

const ExpGraph = ({ className }: ExpGraphProps) => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const [showAllSkills, setShowAllSkills] = useState(false);

  // Sort skills by order for display
  const orderedSkills = [...skillsData].sort((a, b) => (a.order || 999) - (b.order || 999));

  // Skills to display based on showAllSkills state
  const displayedSkills = showAllSkills ? orderedSkills : orderedSkills.slice(0, 6);

  // Animate rotating icon in the header
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSkillIndex(prev => (prev + 1) % skillsData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Handle skill hover
  const handleSkillHover = useCallback(
    (skillName: string | null) => {
      if (skillName === hoveredSkill) return;

      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(() => {
          setHoveredSkill(skillName);
        });
      } else {
        setHoveredSkill(skillName);
      }
    },
    [hoveredSkill]
  );
  // Animated vertical grid line with label
  const VerticalLine = useCallback(({ position, year }: { position: string; year: number }) => {
    return (
      <g>
        <line
          x1={position}
          y1="24"
          x2={position}
          y2="100%"
          strokeWidth="1"
          className="grid-line"
          style={{
            animationDelay: `${0.3 * year}s`,
          }}
        />
        <text
          x={position}
          y="16"
          className="year-label"
          fill="currentColor"
          style={{
            animationDelay: `${0.5 + 0.3 * year}s`,
          }}
        >
          {year === 1 ? '1 ano' : year > 3 ? `${year}+ anos` : `${year} anos`}
        </text>
      </g>
    );
  }, []);

  return (
    <section className={`w-full max-w-7xl mx-auto my-24 px-4 sm:px-6 ${className}`}>
      <div className="w-full rounded-2xl overflow-hidden bg-[rgb(12,12,12)] shadow-2xl relative">
        <div className="flex flex-col lg:flex-row">
          {/* CHART SECTION */}
          <div
            className="flex-1 p-4 sm:p-8 border-b lg:border-b-0 lg:border-r border-[#333]"
            role="region"
            aria-label="Skills experience chart"
          >
            {/* SVG Chart - using CSS variables for dimensions */}
            <div className="chart-section mt-8">
              <svg
                width="100%"
                height={displayedSkills.length * 70 + 40}
                className="overflow-visible"
                role="img"
                aria-label="Experience chart showing professional and total years of experience"
                preserveAspectRatio="xMinYMin meet"
              >
                {/* Animated grid lines */}
                <VerticalLine position="25%" year={1} />
                <VerticalLine position="50%" year={2} />
                <VerticalLine position="75%" year={3} />
                {/* Experience bars with titles above */}
                {displayedSkills.map((skill, index) => {
                  const y = 50 + index * 70; // Increased spacing between bars
                  const isHovered = hoveredSkill === skill.name;
                  const isFavorite = skill.featured;

                  return (
                    <g key={skill.name}>
                      {/* Skill name above bar */}
                      <text
                        x="0"
                        y={y - 12}
                        textAnchor="start"
                        style={{
                          fontSize: '1rem',
                          fontWeight: '600',
                          fill: 'white',
                        }}
                      >
                        {skill.name}
                      </text>
                      {/* Experience years (always present, but only visible on hover) */}
                      <text
                        x="85%"
                        y={y - 12}
                        textAnchor="end"
                        className="exp-year-label"
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: '700',
                          color: isFavorite ? 'var(--cyan)' : 'var(--primary)',
                        }}
                      >
                        {`Pro: ${skill.proexp}y / Total: ${skill.proexp + skill.exp}y`}
                      </text>
                      {/* Total experience background bar */}
                      <motion.rect
                        x="0"
                        y={y}
                        width={`${Math.min((skill.proexp + skill.exp) / 4, 1) * 100}%`}
                        height="35"
                        fill={'var(--popover)'}
                        fillOpacity={isFavorite ? 0.3 : 1}
                        rx="8"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min((skill.proexp + skill.exp) / 4, 1) * 100}%`,
                          filter: isHovered ? 'brightness(1.1)' : 'brightness(1)',
                        }}
                        transition={{
                          width: {
                            duration: 0.8,
                            delay: index * 0.08,
                            ease: 'easeOut',
                          },
                          filter: { duration: 0.1 },
                        }}
                        onMouseEnter={() => handleSkillHover(skill.name)}
                        onMouseLeave={() => handleSkillHover(null)}
                        className="cursor-pointer"
                        role="button"
                        aria-label={`${skill.name} total experience: ${skill.proexp + skill.exp} years`}
                      />
                      {/* Pro experience foreground bar */}
                      {skill.proexp > 0 && (
                        <motion.rect
                          x="0"
                          y={y}
                          width={`${Math.min(skill.proexp / 4, 1) * 100}%`}
                          height="35"
                          fill={isFavorite ? 'var(--cyan)' : 'var(--primary)'}
                          rx="8"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.min(skill.proexp / 4, 1) * 100}%`,
                            filter: isHovered ? 'brightness(1.1)' : 'brightness(1)',
                          }}
                          transition={{
                            width: {
                              duration: 0.8,
                              delay: index * 0.08 + 0.2,
                              ease: 'easeOut',
                            },
                            filter: { duration: 0.1 },
                          }}
                          onMouseEnter={() => handleSkillHover(skill.name)}
                          onMouseLeave={() => handleSkillHover(null)}
                          className="cursor-pointer"
                          role="button"
                          aria-label={`${skill.name} professional experience: ${skill.proexp} years`}
                        />
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Show more/less button */}
              {orderedSkills.length > 6 && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => setShowAllSkills(!showAllSkills)}
                    className="px-4 py-1.5 text-xs rounded-full bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-chart-2)] hover:text-white 
                    transition-all duration-300 border border-[var(--color-border)] flex items-center gap-2"
                  >
                    <span>
                      {showAllSkills
                        ? 'Mostrar Menos'
                        : `Mostrar Todos ${orderedSkills.length} Skills`}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-transform duration-300 ${showAllSkills ? 'rotate-180' : ''}`}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                </div>
              )}
            </div>
            {/* Legend */}
            <div className="flex justify-end  mt-6 gap-x-8">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: 'var(--primary)' }}
                ></div>
                <span className="text-xs text-gray-400">Trabalhando</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: 'var(--popover)' }}
                ></div>
                <span className="text-xs text-gray-400">Total</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--cyan)' }}></div>
                <span className="text-xs text-gray-400">Favorito</span>
              </div>
            </div>
          </div>
          {/* SKILLS SECTION */}
          <div className="w-full lg:w-96 p-8 relative overflow-hidden bg-[rgb(12,12,12)]">
            {/* Single large background icon */}
            <AnimatePresence>
              <motion.div
                key={currentSkillIndex}
                className="absolute w-64 h-64"
                style={{
                  top: '50%',
                  left: '50%',
                  zIndex: 0,
                }}
                initial={{
                  opacity: 0,
                  scale: 0.8,
                  rotate: -15,
                  x: '-50%',
                  y: '-50%',
                }}
                animate={{
                  opacity: 0.04,
                  scale: 1,
                  rotate: 0,
                  x: '-50%',
                  y: '-50%',
                  y: ['-50%', '-52%', '-50%'], // Floating animation
                }}
                exit={{
                  opacity: 0,
                  scale: 1.1,
                  rotate: 15,
                  x: '-50%',
                  y: '-50%',
                }}
                transition={{
                  opacity: { duration: 0.8, ease: 'easeInOut' },
                  scale: { duration: 0.8, ease: 'backOut' },
                  rotate: { duration: 0.8, ease: 'easeInOut' },
                  y: {
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.5, // Delay para começar o float após a entrada
                  },
                }}
              >
                {React.createElement(skillsData[currentSkillIndex].icon, {
                  size: '100%',
                  color: 'white',
                })}
              </motion.div>
            </AnimatePresence>
            <div className="relative z-10">
              {' '}
              <div className="mb-10 items-start flex flex-col">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h3 className="text-lg text-[var(--muted-foreground)] mb-2">Onde sou bom</h3>
                </motion.div>

                <div className="flex items-center">
                  {/* Animated icon */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSkillIndex}
                      className="w-10 h-10 mr-3 flex items-center justify-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1, rotate: 360 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.5 }}
                    >
                      {React.createElement(skillsData[currentSkillIndex].icon, {
                        size: 32,
                        color: 'var(--primary)',
                      })}
                    </motion.div>
                  </AnimatePresence>
                  {/* Title text */}
                  <div className="text-4xl font-bold flex gap-3">
                    <motion.span
                      className="text-[var(--color-foreground)]"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      Minhas
                    </motion.span>
                    <motion.span
                      className="text-[var(--primary)]"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.5,
                        delay: 1.2,
                        type: 'spring',
                        stiffness: 200,
                      }}
                    >
                      skills
                    </motion.span>
                  </div>
                </div>
              </div>
              {/* Technology icons grid */}
              <div className="grid grid-cols-4 gap-4">
                {orderedSkills.slice(0, 9).map((skill, index) => {
                  const isHovered = hoveredSkill === skill.name;

                  return (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <SkillIcon skill={skill} isHovered={isHovered} onHover={handleSkillHover} />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExpGraph;

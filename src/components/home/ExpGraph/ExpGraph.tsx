'use client';
import { flip, arrow as floatingArrow, offset, shift, useFloating } from '@floating-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { SkillDataType, skillsData } from '@/constants';
import HomeSectionTitle from '@/components/ui/HomeSectionTitle';
import { useLanguageStore } from '@/lib/i18n/languageStore';
import './ExpGraph.css';

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
      <div
        style={{ position: 'relative' }}
        onMouseEnter={() => onHover(skill.name)}
        onMouseLeave={() => onHover(null)}
      >
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
          whileTap={{ scale: 0.98 }}
          role="button"
          aria-label={`${skill.name}: ${skill.proexp + skill.exp} years of experience`}
        >
          <IconComponent size={30} color="white" />
        </motion.div>
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="expgraph-tooltip"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
            >
              <div className="font-semibold">{skill.name}</div>
              <div className="text-xs flex gap-2">
                <span>Pro: {skill.proexp}y</span>
                <span>Total: {skill.proexp + skill.exp}y</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

SkillIcon.displayName = 'ExperienceGraphSkillIcon';

// Componente da barra de experiência
const ExperienceBar = ({
  skill,
  y,
  isHovered,
  isFavorite,
  onHover,
  index,
}: {
  skill: SkillDataType;
  y: number;
  isHovered: boolean;
  isFavorite: boolean;
  onHover: (name: string | null) => void;
  index: number;
}) => {
  // Floating UI para tooltip
  const [open, setOpen] = useState(false);
  const arrowRef = useRef(null);
  const {
    x,
    y: tooltipY,
    refs,
    strategy,
    middlewareData,
    placement,
  } = useFloating({
    open: isHovered,
    onOpenChange: setOpen,
    placement: 'top',
    middleware: [offset(10), flip(), shift(), floatingArrow({ element: arrowRef })],
  });

  // Garantir que tooltip só aparece quando hover
  useEffect(() => {
    setOpen(isHovered);
  }, [isHovered]);

  return (
    <g>
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
      {/* Tooltip da barra usando Floating UI */}
      <foreignObject x="0" y={y - 54} width="100%" height="60" style={{ pointerEvents: 'none' }}>
        <div
          ref={refs.reference as React.Ref<HTMLDivElement>}
          className="expgraph-bar-ref"
          style={{ position: 'absolute', left: '50%', width: '100%' }}
        />
        <AnimatePresence>
          {open && (
            <motion.div
              ref={refs.floating as React.Ref<HTMLDivElement>}
              className="expgraph-bar-tooltip"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
              style={{
                position: strategy,
                top: tooltipY ?? 0,
                left: x ?? 0,
                width: 180,
                minWidth: 120,
                maxWidth: 220,
                margin: '0 auto',
                zIndex: 30,
              }}
            >
              <div className="font-semibold">{skill.name}</div>
              <div className="text-xs flex gap-2">
                <span>Pro: {skill.proexp}y</span>
                <span>Total: {skill.proexp + skill.exp}y</span>
              </div>
              <div
                ref={arrowRef}
                className="expgraph-bar-tooltip-arrow"
                style={{
                  position: 'absolute',
                  left: middlewareData.arrow?.x != null ? `${middlewareData.arrow.x}px` : undefined,
                  top: middlewareData.arrow?.y != null ? `${middlewareData.arrow.y}px` : undefined,
                  [placement.startsWith('top') ? 'bottom' : 'top']: '-7px',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </foreignObject>
      {/* Total experience background bar */}
      <motion.rect
        x="0"
        y={y}
        width={`${Math.min((skill.proexp + skill.exp) / 6, 1) * 100}%`}
        height="35"
        fill={'var(--popover)'}
        fillOpacity={isFavorite ? 0.3 : 1}
        rx="8"
        initial={{ width: 0 }}
        animate={{
          width: `${Math.min((skill.proexp + skill.exp) / 6, 1) * 100}%`,
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
        onMouseEnter={() => onHover(skill.name)}
        onMouseLeave={() => onHover(null)}
        className="cursor-pointer"
        role="button"
        aria-label={`${skill.name} total experience: ${skill.proexp + skill.exp} years`}
      />
      {/* Pro experience foreground bar */}
      {skill.proexp > 0 && (
        <motion.rect
          x="0"
          y={y}
          width={`${Math.min(skill.proexp / 6, 1) * 100}%`}
          height="35"
          fill={isFavorite ? 'var(--cyan)' : 'var(--primary)'}
          rx="8"
          initial={{ width: 0 }}
          animate={{
            width: `${Math.min(skill.proexp / 6, 1) * 100}%`,
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
          onMouseEnter={() => onHover(skill.name)}
          onMouseLeave={() => onHover(null)}
          className="cursor-pointer"
          role="button"
          aria-label={`${skill.name} professional experience: ${skill.proexp} years`}
        />
      )}
    </g>
  );
};

const ExpGraph = () => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const lang = useLanguageStore(state => state.lang);

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

  // Handle skill hover (agora centralizado)
  const handleSkillHover = useCallback((skillName: string | null) => {
    setHoveredSkill(skillName);
  }, []);

  // Animated vertical grid line with label
  const VerticalLine = useCallback(
    ({ position, year, label }: { position: string; year: number; label: string }) => {
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
            {label}
          </text>
        </g>
      );
    },
    []
  );

  return (
    <section className="w-full max-w-7xl mx-auto my-24 px-4 sm:px-6" id="skills-section">
      <div className="w-full rounded-2xl bg-[rgb(12,12,12)] shadow-2xl relative">
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
                {/* Animated grid lines - now 1, 3, 6+ anos */}
                <VerticalLine position="20%" year={1} label="1 ano" />
                <VerticalLine position="50%" year={3} label="3 anos" />
                <VerticalLine position="85%" year={6} label="6+ anos" />
                {/* Experience bars with titles above */}
                {displayedSkills.map((skill, index) => {
                  const y = 50 + index * 70;
                  const isHovered = hoveredSkill === skill.name;
                  const isFavorite = !!skill.featured;

                  return (
                    <ExperienceBar
                      key={skill.name}
                      skill={skill}
                      y={y}
                      isHovered={isHovered}
                      isFavorite={isFavorite}
                      onHover={handleSkillHover}
                      index={index}
                    />
                  );
                })}
              </svg>

              {/* Show more/less button */}
              {orderedSkills.length > 6 && (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => {
                      if (showAllSkills) {
                        // Scroll para o topo da seção ao fechar
                        const section = document.getElementById('skills-section');
                        if (section) {
                          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }
                      setShowAllSkills(!showAllSkills);
                    }}
                    className="px-4 py-1.5 text-xs rounded-full bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-chart-2)] hover:text-white 
                    transition-all duration-300 border border-[var(--color-border)] flex items-center gap-2"
                  >
                    <span>
                      {showAllSkills
                        ? lang === 'pt'
                          ? 'Mostrar Menos'
                          : 'Show Less'
                        : lang === 'pt'
                          ? `Mostrar Todos ${orderedSkills.length} Skills`
                          : `Show All ${orderedSkills.length} Skills`}
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
                <span className="text-xs text-gray-400">
                  {lang === 'pt' ? 'Trabalhando' : 'Working'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: 'var(--popover)' }}
                ></div>
                <span className="text-xs text-gray-400">{lang === 'pt' ? 'Total' : 'Total'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--cyan)' }}></div>
                <span className="text-xs text-gray-400">
                  {lang === 'pt' ? 'Favorito' : 'Favorite'}
                </span>
              </div>
            </div>
          </div>
          {/* SKILLS SECTION */}
          <div className="w-full lg:w-96 p-8 relative bg-[rgb(12,12,12)]">
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
                }}
              >
                {React.createElement(skillsData[currentSkillIndex].icon, {
                  size: '100%',
                  color: 'white',
                })}
              </motion.div>
            </AnimatePresence>
            <div className="relative z-10">
              <HomeSectionTitle
                subTitle={lang === 'pt' ? 'Onde sou bom' : 'Where I excel'}
                titleWhitePart={lang === 'pt' ? 'Minhas' : 'My'}
                titleBluePart={lang === 'pt' ? 'Skills' : 'Skills'}
                icon={
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
                }
              />
              {/* Technology icons grid */}
              <div className="grid grid-cols-5 gap-4">
                {orderedSkills.map((skill, index) => {
                  const isHovered = hoveredSkill === skill.name;

                  return (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                      onMouseEnter={() => handleSkillHover(skill.name)}
                      onMouseLeave={() => handleSkillHover(null)}
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

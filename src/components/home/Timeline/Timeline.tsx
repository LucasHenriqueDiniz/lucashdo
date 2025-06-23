'use client';
import { motion, useScroll } from 'framer-motion';
import { useEffect, useState, useCallback, useMemo, memo, useLayoutEffect, useRef } from 'react';
import { BriefcaseBusiness, GraduationCap, LucideIcon } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { academicExperiences } from '@/constants/academicExperiences';
import { jobExperiences } from '@/constants/jobExperiences';
import { ExperienceProps, TimelineTagProps, TranslatedField } from '@/types/experience.types';
import { Pill } from '@/components/ui/Pill';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import './Timeline.css';
import HomeSectionTitle from '@/components/ui/HomeSectionTitle';

const TimelineArrow = memo(({ side }: { side: 'left' | 'right' }) => {
  return (
    <div className="size-full flex items-center justify-center z-10">
      <div className={`timeline-arrows-container ${side}`}>
        <div className={`timeline-arrows-group ${side}`}>
          <div className={`timeline-arrow ${side}`}></div>
          <div className={`timeline-arrow ${side} secondary`}></div>
          <div className={`timeline-arrow ${side} tertiary`}></div>
        </div>
      </div>
    </div>
  );
});

TimelineArrow.displayName = 'TimelineArrow';

const DatePill = memo(({ date, side }: { date: string; side: 'left' | 'right' }) => {
  return (
    <div
      className={`size-full flex items-center justify-${side === 'left' ? 'start' : 'end'} z-10`}
    >
      <Pill size="sm" className="w-fit">
        {date.replace('/today/', 'Now')}
      </Pill>
    </div>
  );
});

DatePill.displayName = 'DatePill';

const ExperienceCardSkillsIcon = memo(
  ({
    icon,
    title,
    index = 0,
  }: {
    icon: LucideIcon | string;
    title?: TranslatedField;
    index?: number;
  }) => {
    // Função para renderizar o ícone correto com useCallback
    const getIcon = useCallback(
      (iconProp: string | LucideIcon) => {
        if (typeof iconProp === 'string') {
          // Se for uma string, assume que é um caminho de ícone SVG
          return (
            <Image
              src={iconProp}
              alt={title?.pt || title?.en || 'Skill'}
              width={28}
              height={28}
              className="object-contain"
            />
          );
        } else {
          // Se for um componente LucideIcon, renderiza diretamente
          const IconComponent = iconProp as LucideIcon;
          return <IconComponent size={28} className="stroke-2" />;
        }
      },
      [title]
    );

    // Memoize o delay de animação para evitar recálculos
    const animationDelay = useMemo(() => Math.min(index * 0.07, 0.8), [index]);

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className="timeline-tags-icon flex items-center justify-center size-12 rounded-lg bg-[var(--primary)]/10 backdrop-blur-sm border border-[var(--primary)]/20 shadow-sm text-[var(--accent)] hover:border-[var(--accent)]/40"
            variants={{
              hidden: { opacity: 0, scale: 0.5, y: 10 },
              visible: {
                opacity: 1,
                scale: 1,
                y: 0,
                transition: {
                  duration: 0.25,
                  delay: animationDelay,
                },
              },
            }}
            whileHover={{
              scale: 1.15,
              backgroundColor: 'rgba(var(--accent-rgb), 0.15)',
              transition: { duration: 0.2 },
            }}
          >
            {getIcon(icon)}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">{title ? title.pt || title.en : 'No title'}</p>
        </TooltipContent>
      </Tooltip>
    );
  }
);

ExperienceCardSkillsIcon.displayName = 'ExperienceCardSkillsIcon';

const ExperienceCard = memo(
  ({
    item,
    side,
    isAcademic = false,
    lang,
  }: {
    item: ExperienceProps;
    side: 'left' | 'right';
    isAcademic?: boolean;
    lang: 'pt' | 'en';
  }) => {
    return (
      <div className="card-container mx-2 p-5 h-full rounded-xl transition-colors shadow-sm hover:shadow-md">
        <motion.div
          className={`top-tags ${side}`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.12,
              },
            },
          }}
        >
          <motion.div
            className="top-tag-pill"
            variants={{
              hidden: { opacity: 0, x: side === 'left' ? -30 : 30 },
              visible: {
                opacity: 1,
                x: 0,
                transition: {
                  type: 'spring',
                  stiffness: 100,
                  damping: 15,
                },
              },
            }}
          >
            {isAcademic ? 'Education' : 'Job'}
          </motion.div>
          <motion.div
            className="top-tag-pill institution"
            variants={{
              hidden: { opacity: 0, x: side === 'left' ? -20 : 20 },
              visible: {
                opacity: 1,
                x: 0,
                transition: {
                  type: 'spring',
                  stiffness: 90,
                  damping: 15,
                },
              },
            }}
          >
            {item.institution}
          </motion.div>
        </motion.div>

        <h2 className="text-lg font-bold mb-4 text-[var(--foreground)]">{item.title}</h2>

        <motion.div
          className="flex flex-wrap gap-2 mb-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.03,
                delayChildren: 0.2,
              },
            },
          }}
        >
          {item.tags?.map((tag: TimelineTagProps, index: number) => (
            <ExperienceCardSkillsIcon
              key={index}
              icon={tag.icon}
              title={tag.labels}
              index={index}
            />
          ))}
        </motion.div>

        <div className="text-sm leading-relaxed text-[var(--foreground)]/80">
          <p>
            {typeof item.description === 'object'
              ? item.description[lang] || item.description.en || item.description.pt
              : item.description}
          </p>
        </div>
      </div>
    );
  }
);

ExperienceCard.displayName = 'ExperienceCard';

const Blank = memo(() => {
  return <div className="size-full" />;
});

Blank.displayName = 'Blank';

function BallContainer({
  index,
  scrollY,
  containerHeight,
  ballSpacing,
  centerY,
  item,
  side,
  sectionTop = 0,
}: {
  index: number;
  scrollY: { get: () => number; onChange: (callback: (value: number) => void) => () => void };
  containerHeight: number;
  ballSpacing: number;
  centerY: number;
  item: ExperienceProps;
  side: 'left' | 'right';
  sectionTop?: number;
}) {
  // Estados para controlar animações
  const [topPosition, setTopPosition] = useState<number | null>(0);
  const [bottomPosition, setBottomPosition] = useState<number | null>(null);

  // Otimizado: useMemo para cálculos que não dependem do scroll
  const isAcademic = useMemo(
    () => jobExperiences.findIndex(exp => exp.id === item.id) === -1,
    [item.id]
  );
  const TypeIcon = isAcademic ? GraduationCap : BriefcaseBusiness;
  const containerTop = useMemo(() => index * ballSpacing, [index, ballSpacing]);

  const updatePositionState = useCallback(
    (scroll: number) => {
      const adjustedScroll = scroll - sectionTop;
      const scrollCenter = adjustedScroll + centerY;
      const containerBottom = containerTop + containerHeight;
      const topMargin = 64;
      const bottomMargin = 64;
      if (scrollCenter >= containerTop && scrollCenter <= containerBottom) {
        let relativePosition = scrollCenter - containerTop;
        relativePosition = Math.max(topMargin, relativePosition);
        relativePosition = Math.min(relativePosition, containerHeight - bottomMargin);
        setTopPosition(relativePosition);
        setBottomPosition(null);
      } else if (scrollCenter < containerTop) {
        setTopPosition(topMargin);
        setBottomPosition(null);
      } else {
        setTopPosition(null);
        setBottomPosition(bottomMargin);
      }
    },
    [centerY, containerHeight, containerTop, sectionTop]
  );
  useLayoutEffect(() => {
    const initialScroll = scrollY.get();
    setTimeout(() => {
      updatePositionState(initialScroll);
    }, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    let lastTime = 0;
    const throttleTime = 16;
    let lastScrollPosition = 0;
    const unsubscribe = scrollY.onChange((scroll: number) => {
      const now = performance.now();
      if (now - lastTime < throttleTime) return;
      if (Math.abs(lastScrollPosition - scroll) < 2) return;
      lastTime = now;
      lastScrollPosition = scroll;
      updatePositionState(scroll);
    });
    return () => unsubscribe();
  }, [scrollY, updatePositionState]);
  const containerStyle = useMemo(
    () => ({
      height: `${containerHeight}px`,
      top: `${containerTop}px`,
      left: 0,
      gridTemplateColumns: '1fr auto 1fr',
      gridTemplateAreas: "'left center right'",
    }),
    [containerHeight, containerTop]
  );
  return (
    <div
      className="absolute w-full gap-4 md:gap-8 lg:gap-12 items-center justify-center z-10 grid"
      style={containerStyle}
    >
      {/* Card Esquerda */}
      <div className="size-full py-4 pr-8 md:pr-12 pl-2 md:pl-4" style={{ gridArea: 'left' }}>
        {side === 'left' ? (
          <ExperienceCard item={item} side={side} isAcademic={isAcademic} lang="en" />
        ) : (
          <Blank />
        )}
      </div>
      {/* Area central que segue o scroll */}
      <motion.div
        className="absolute left-1/2 grid h-16 rounded-full transform -translate-x-1/2 z-20 items-center justify-center"
        style={{
          gridTemplateColumns: 'repeat(5, 1fr)',
          gridTemplateRows: '1fr',
          width: 'min(600px, 95%)',
        }}
        animate={{
          top: topPosition !== null ? topPosition : 'auto',
          bottom: bottomPosition !== null ? bottomPosition : 'auto',
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 28,
          mass: 0.8,
          restDelta: 0.001,
        }}
      >
        <Blank />
        {side === 'left' ? (
          <div className="relative size-full">
            <TimelineArrow side={side} />
          </div>
        ) : (
          <DatePill date={item.years} side={side} />
        )}
        <div className="size-full flex items-center justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-center size-12 bg-[var(--primary)] rounded-full shadow-lg hover:scale-110 transition-transform hover-bg-[var(--primary-hover)]">
                <TypeIcon className="w-8 h-8 text-white" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex flex-col gap-1">
                <p className="font-bold">{item.title}</p>
                <p className="text-xs opacity-90">{item.institution}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-[var(--accent)]"></span>
                  <span className="text-xs">{item.years.replace('/today/', 'Now')}</span>
                </div>
                {item.description && (
                  <p className="text-xs opacity-80 mt-1 line-clamp-2">
                    {typeof item.description === 'object'
                      ? item.description.pt || item.description.en
                      : ''}
                  </p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </div>
        {side === 'left' ? (
          <DatePill date={item.years} side={side} />
        ) : (
          <div className="relative size-full">
            <TimelineArrow side={side} />
          </div>
        )}
        <Blank />
      </motion.div>{' '}
      {/* Card Direita */}
      <div className="size-full py-4 pl-8 md:pl-12 pr-2 md:pr-4" style={{ gridArea: 'right' }}>
        {side === 'right' ? (
          <ExperienceCard item={item} side={side} isAcademic={isAcademic} lang="en" />
        ) : (
          <Blank />
        )}
      </div>
    </div>
  );
}

const MemoBallContainer = memo(BallContainer);

const Timeline = () => {
  const [windowHeight, setWindowHeight] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Vamos usar o scroll padrão do window para ter o comportamento esperado em todas as páginas
  const { scrollY } = useScroll();
  // Estado para rastrear a posição do componente na viewport
  const [sectionTop, setSectionTop] = useState(0);

  useLayoutEffect(() => {
    setWindowHeight(window.innerHeight);

    // Função para calcular a posição do elemento na viewport
    const updatePosition = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setSectionTop(rect.top + window.scrollY);
      }
    };

    // Atualizamos a posição inicial
    updatePosition();

    // Otimizado: throttling para o evento resize
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setWindowHeight(window.innerHeight);
        updatePosition();
      }, 100);
    };

    // Também atualizamos a posição quando o scroll acontece
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updatePosition, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(resizeTimeout);
      clearTimeout(scrollTimeout);
    };
  }, []);

  const timelineItems = useMemo(
    () =>
      [
        ...academicExperiences.filter(e => e.showInTimeline),
        ...jobExperiences.filter(e => e.showInTimeline),
      ].sort((a, b) => (a.date > b.date ? -1 : 1)),
    []
  ); // Use a smaller spacing for mobile and standard for desktop
  const ballSpacing = useMemo(() => {
    return typeof window !== 'undefined' && window.innerWidth < 768 ? 240 : 300;
  }, []);

  const ballCount = useMemo(() => timelineItems.length, [timelineItems]);
  const containerHeight = ballSpacing;

  // Usando metade da altura da janela como ponto de referência para o centro da tela
  // Isso faz com que o scroll fique sincronizado com o centro da viewport
  const centerY = useMemo(() => windowHeight / 2, [windowHeight]);
  const totalHeight = useMemo(
    () => `${ballCount * ballSpacing}px`, // Usando a altura da janela para garantir espaço adequado no final
    [ballCount, ballSpacing]
  );
  return (
    <section ref={sectionRef} className="w-full flex flex-col items-center justify-center">
      <HomeSectionTitle
        subTitle="A timeline of my journey"
        titleWhitePart="My"
        titleBluePart="Career"
      />

      <div
        ref={timelineRef}
        className="relative w-full max-w-[1400px] mx-auto px-4 md:px-8 timeline-container"
        style={{ height: totalHeight }}
      >
        {/* Linha vertical no fundo */}
        <div
          className="absolute left-1/2 top-0 w-1 bg-gray-900 transform -translate-x-1/2 z-0"
          style={{ height: '100%' }}
        />
        {/* Containers das bolas - Renderização condicional baseada na visibilidade */}{' '}
        {timelineItems.map((item, index) => {
          const side: 'left' | 'right' = index % 2 === 0 ? 'left' : 'right';
          return (
            <MemoBallContainer
              key={item.id || index}
              index={index}
              scrollY={scrollY}
              containerHeight={containerHeight}
              ballSpacing={ballSpacing}
              centerY={centerY}
              item={item}
              side={side}
              sectionTop={sectionTop}
            />
          );
        })}
      </div>
    </section>
  );
};

export default Timeline;

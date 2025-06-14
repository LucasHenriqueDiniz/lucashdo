'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation, useInView, useScroll, useTransform } from 'framer-motion';
import { academicExperiences } from '@/constants/academicExperiences';
import { jobExperiences } from '@/constants/jobExperiences';
import Image from 'next/image';
import { BriefcaseBusiness, GraduationCap, LucideIcon } from 'lucide-react';
import './Timeline.css';
import { Tooltip, TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip';
import { ExperienceProps, TimelineTagProps, TranslatedField } from '@/types/experience.types';

// Helper para pegar idioma do navegador
function getLang() {
  if (typeof window === 'undefined') {
    return 'en'; // Default to English on server
  }
  return navigator.language.startsWith('pt') ? 'pt' : 'en';
}

const timelineItems = [
  ...academicExperiences.filter(e => e.showInTimeline),
  ...jobExperiences.filter(e => e.showInTimeline),
].sort((a, b) => (a.date > b.date ? -1 : 1)); // mais recente primeiro

export default function Timeline() {
  const lang = getLang();
  return (
    <section className="w-full flex flex-col items-center py-24 bg-slate">
      <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">
        <span className="text-muted-foreground block text-lg font-normal mb-2">
          First things first
        </span>
        <span className="inline-block align-middle">
          <span className="inline-block mr-2 align-middle text-blue-400">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="2" y="2" width="12" height="12" rx="2" fill="#0ea5e9" />
              <rect x="18" y="2" width="12" height="12" rx="2" fill="#0ea5e9" />
              <rect x="2" y="18" width="12" height="12" rx="2" fill="#0ea5e9" />
            </svg>
          </span>
          <span className="font-extrabold text-white">
            My <span className="text-cyan-400">career</span>
          </span>
        </span>
      </h2>
      <div className="relative w-full max-w-7xl flex flex-col min-h-[700px]">
        {timelineItems.map((item, idx) => (
          <TimelineItem
            key={item.id}
            item={item}
            side={idx % 2 === 0 ? 'left' : 'right'}
            lang={lang}
          />
        ))}
      </div>
    </section>
  );
}

const TimelineCardIcon = ({
  icon,
  title,
}: {
  icon: LucideIcon | string;
  title?: TranslatedField;
}) => {
  function getIcon(icon: string | LucideIcon) {
    if (typeof icon === 'string') {
      // Se for uma string, assume que é um caminho de ícone SVG
      return <Image src={icon} alt="A" width={24} height={24} />;
    } else {
      // Se for um componente LucideIcon, renderiza diretamente
      const IconComponent = icon as LucideIcon;
      return <IconComponent size={24} />;
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        <div className="timeline-tags-icon">{getIcon(icon)}</div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{getLang() === 'pt' ? title?.pt : title?.en}</p>
      </TooltipContent>
    </Tooltip>
  );
};

function TimelineItem({
  item,
  side,
  lang,
}: {
  item: ExperienceProps;
  side: 'left' | 'right';
  lang: 'pt' | 'en';
}) {
  const ref = useRef(null);
  const itemRef = useRef(null);
  const leftTagsRef = useRef(null);
  const rightTagsRef = useRef(null);

  // useInView hooks para diferentes elementos
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const leftTagsInView = useInView(leftTagsRef, { once: false, margin: '-50px' });
  const rightTagsInView = useInView(rightTagsRef, { once: false, margin: '-50px' });

  const controls = useAnimation();
  const leftTagsControls = useAnimation();
  const rightTagsControls = useAnimation();

  // Framer Motion scroll animation com offset ajustado
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ['start end', 'end start'],
  });

  // Nova abordagem: Transformar o scrollYProgress para criar efeito sticky centralizado na tela
  // Quando o elemento está no meio da tela: centerProgress = 0.5
  // Quando o elemento está entrando na tela por baixo: centerProgress próximo de 0
  // Quando o elemento está saindo da tela por cima: centerProgress próximo de 1
  const centerProgress = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.8, 1], // breakpoints no scroll
    [0, 0, 0.5, 1, 1] // valores mapeados para criar o efeito sticky
  );

  // Posição Y do elemento calculada para ficar sticky no centro enquanto o card estiver visível
  const centerY = useTransform(
    centerProgress,
    [0, 0.5, 1], // progress do centro
    ['50vh', '50vh', '50vh'] // sempre no centro vertical
  );

  useEffect(() => {
    if (inView) controls.start('visible');
    if (leftTagsInView) leftTagsControls.start('visible');
    if (rightTagsInView) rightTagsControls.start('visible');
  }, [inView, leftTagsInView, rightTagsInView, controls, leftTagsControls, rightTagsControls]);

  // Determinar o tipo de experiência para escolher o ícone
  const isAcademic = jobExperiences.findIndex(exp => exp.id === item.id) === -1;
  const TypeIcon = isAcademic ? GraduationCap : BriefcaseBusiness;

  return (
    <motion.div
      ref={ref}
      className={`relative flex w-full min-h-[240px]`}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, type: 'spring' } },
      }}
    >
      <div ref={itemRef} className="timeline-container">
        {' '}
        {/* Card do lado esquerdo (ou placeholder) */}
        {side === 'left' ? (
          <div className="timeline-card left">
            <motion.div
              ref={leftTagsRef}
              className="top-tags"
              initial="hidden"
              animate={leftTagsControls}
              variants={{
                hidden: { x: -50, opacity: 0 },
                visible: {
                  x: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.5,
                    type: 'spring',
                    stiffness: 100,
                  },
                },
              }}
            >
              <div className="top-tag">{isAcademic ? 'Education' : 'Job'}</div>
              <div className="top-tag tag-title">{item.institution}</div>
            </motion.div>
            <h2 className="timeline-card-title">{item.title}</h2>
            <div className="timeline-card-tags">
              {item.tags?.map((tag: TimelineTagProps, index: number) => (
                <TimelineCardIcon key={index} icon={tag.icon} title={tag.labels} />
              ))}
            </div>
            <div className="timeline-card-description">
              <p>{item.description[lang]}</p>
            </div>
          </div>
        ) : (
          <div className="timeline-card-blank"></div>
        )}{' '}
        {/* Centro da timeline com linha, ícone e data */}{' '}
        <div className="timeline-center">
          <div className="timeline-marker"></div>
          {/* Container único para ícone, data e setas - sticky */}
          <motion.div
            className={`timeline-sticky-wrapper ${side}`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'none',
            }}
          >
            <motion.div
              className="timeline-center-content"
              style={{
                position: 'sticky',
                top: centerY,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '50px',
                marginTop: '35px', // Centraliza verticalmente
              }}
            >
              {/* Seta esquerda */}
              {side === 'left' && (
                <div className="timeline-arrows-container left">
                  <div className="timeline-arrows-group left">
                    <div className="timeline-arrow left"></div>
                    <div className="timeline-arrow left secondary"></div>
                    <div className="timeline-arrow left tertiary"></div>
                  </div>
                </div>
              )}

              {/* Ícone central */}
              <div className="timeline-icon">
                <TypeIcon />
              </div>
              <div className={`date-pill ${side}`}>{item.date}</div>

              {/* Seta direita */}
              {side === 'right' && (
                <div className="timeline-arrows-container right">
                  <div className="timeline-arrows-group right">
                    <div className="timeline-arrow right"></div>
                    <div className="timeline-arrow right secondary"></div>
                    <div className="timeline-arrow right tertiary"></div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
        {/* Card do lado direito (ou placeholder) */}
        {side === 'right' ? (
          <div className="timeline-card right">
            <motion.div
              ref={rightTagsRef}
              className="top-tags"
              initial="hidden"
              animate={rightTagsControls}
              variants={{
                hidden: { x: 50, opacity: 0 },
                visible: {
                  x: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.5,
                    type: 'spring',
                    stiffness: 100,
                  },
                },
              }}
            >
              <div className="top-tag">{isAcademic ? 'Education' : 'Job'}</div>
              <div className="top-tag tag-title">{item.institution}</div>
            </motion.div>
            <h2 className="timeline-card-title">{item.title}</h2>
            <div className="timeline-card-tags">
              {item.tags?.map((tag: TimelineTagProps, index: number) => (
                <TimelineCardIcon key={index} icon={tag.icon} title={tag.labels} />
              ))}
            </div>
            <div className="timeline-card-description">
              <p>{item.description[lang]}</p>
            </div>
          </div>
        ) : (
          <div className="timeline-card-blank right"></div>
        )}
      </div>
    </motion.div>
  );
}

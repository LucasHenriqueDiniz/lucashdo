'use client';
import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
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
        <motion.span
          className="text-muted-foreground block text-lg font-normal mb-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          First things first
        </motion.span>
        <motion.span
          className="inline-block align-middle"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 1.0, delay: 0.7 }}
        >
          <motion.span
            className="inline-block mr-2 align-middle text-blue-400"
            initial={{ rotate: -180, scale: 0.3 }}
            whileInView={{ rotate: 0, scale: 1 }}
            viewport={{ once: false }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
              delay: 1.0,
            }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <motion.rect
                x="2"
                y="2"
                width="12"
                height="12"
                rx="2"
                fill="#0ea5e9"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: 1.2 }}
              />
              <motion.rect
                x="18"
                y="2"
                width="12"
                height="12"
                rx="2"
                fill="#0ea5e9"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: 1.4 }}
              />
              <motion.rect
                x="2"
                y="18"
                width="12"
                height="12"
                rx="2"
                fill="#0ea5e9"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: 1.6 }}
              />
            </svg>
          </motion.span>
          <motion.span
            className="font-extrabold text-white"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.7, delay: 1.0 }}
          >
            My{' '}
            <motion.span
              className="text-cyan-400"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: 1.4 }}
            >
              career
            </motion.span>
          </motion.span>
        </motion.span>
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
  index = 0,
}: {
  icon: LucideIcon | string;
  title?: TranslatedField;
  index?: number;
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
        <motion.div
          className="timeline-tags-icon"
          variants={{
            hidden: { opacity: 0, scale: 0.2 },
            visible: {
              opacity: 1,
              scale: 1,
              transition: {
                duration: 0.4,
                type: 'spring',
                stiffness: 300,
                damping: 15,
              },
            },
          }}
          whileHover={{
            scale: 1.15,
            transition: { duration: 0.1 },
          }}
        >
          {getIcon(icon)}
        </motion.div>
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

  // Determinar o tipo de experiência para escolher o ícone
  const isAcademic = jobExperiences.findIndex(exp => exp.id === item.id) === -1;
  const TypeIcon = isAcademic ? GraduationCap : BriefcaseBusiness;
  return (
    <motion.div
      ref={ref}
      className={`relative flex w-full min-h-[240px]`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: '-100px' }}
      variants={{
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.8,
            type: 'spring',
            stiffness: 100,
            damping: 12,
          },
        },
      }}
    >
      <div ref={itemRef} className="timeline-container">
        {' '}
        {/* Card do lado esquerdo */}
        {side === 'left' ? (
          <motion.div
            className="timeline-card left"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            whileHover={{
              boxShadow: '0 10px 25px rgba(14, 165, 233, 0.2)',
              outlineColor: 'var(--text-cyan)',
            }}
            variants={{
              hidden: { scale: 0.97 },
              visible: {
                scale: 1,
                opacity: 1,
                transition: {
                  duration: 0.5,
                  type: 'spring',
                  stiffness: 100,
                  damping: 12,
                  staggerChildren: 0.15,
                  delayChildren: 0.1,
                },
              },
            }}
          >
            <motion.div
              className="top-tags"
              variants={{
                hidden: { x: -30, opacity: 0, scale: 0.8 },
                visible: {
                  x: 0,
                  opacity: 1,
                  scale: 1,
                  transition: {
                    duration: 0.6,
                    type: 'spring',
                    stiffness: 120,
                    damping: 9,
                  },
                },
              }}
            >
              <div className="top-tag">{isAcademic ? 'Education' : 'Job'}</div>
              <div className="top-tag tag-title">{item.institution}</div>
            </motion.div>
            <motion.h2
              className="timeline-card-title"
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: {
                    duration: 0.5,
                    ease: [0.25, 0.1, 0.25, 1.0],
                  },
                },
              }}
            >
              {item.title}
            </motion.h2>
            <motion.div
              className="timeline-card-tags"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {item.tags?.map((tag: TimelineTagProps, index: number) => (
                <TimelineCardIcon key={index} icon={tag.icon} title={tag.labels} index={index} />
              ))}
            </motion.div>
            <motion.div
              className="timeline-card-description"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.7,
                    ease: [0.25, 0.1, 0.25, 1.0],
                  },
                },
              }}
            >
              <p>{item.description[lang]}</p>
            </motion.div>
          </motion.div>
        ) : (
          <div className="timeline-card-blank"></div>
        )}
        <div className="timeline-center">
          <motion.div
            className="timeline-marker"
            initial={{ height: 0 }}
            whileInView={{ height: '100%' }}
            viewport={{ once: false }}
            transition={{
              duration: 1.0,
              ease: 'easeInOut',
            }}
          ></motion.div>
          {/* ícone, data e setas*/}
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
              <motion.div
                className="timeline-icon"
                whileInView={{
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 0 0 0 rgba(1, 132, 252, 0)',
                    '0 0 0 8px rgba(1, 132, 252, 0.3)',
                    '0 0 0 0 rgba(1, 132, 252, 0)',
                  ],
                }}
                viewport={{ once: false }}
                transition={{
                  duration: 2,
                  ease: 'easeInOut',
                  times: [0, 0.5, 1],
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                <TypeIcon />
              </motion.div>
              <motion.div
                className={`date-pill ${side}`}
                initial={{ opacity: 0, x: side === 'left' ? 20 : -20, y: 0 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: false }}
                transition={{
                  delay: 0.2,
                  duration: 0.3,
                  type: 'spring',
                  stiffness: 120,
                  damping: 9,
                }}
              >
                {item.date}
              </motion.div>

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
          <motion.div
            className="timeline-card right"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false }}
            variants={{
              hidden: { opacity: 1, x: 0, scale: 0.97 },
              visible: {
                opacity: 1,
                x: 0,
                scale: 1,
                transition: {
                  duration: 0.5,
                  type: 'spring',
                  stiffness: 100,
                  damping: 12,
                  staggerChildren: 0.15,
                  delayChildren: 0.1,
                },
              },
            }}
          >
            <motion.div
              className="top-tags"
              variants={{
                hidden: { x: 30, opacity: 0, scale: 0.8 },
                visible: {
                  x: 0,
                  opacity: 1,
                  scale: 1,
                  transition: {
                    duration: 0.6,
                    type: 'spring',
                    stiffness: 120,
                    damping: 9,
                  },
                },
              }}
            >
              <div className="top-tag">{isAcademic ? 'Education' : 'Job'}</div>
              <div className="top-tag tag-title">{item.institution}</div>
            </motion.div>
            <motion.h2
              className="timeline-card-title"
              variants={{
                hidden: { opacity: 0, x: 20 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: {
                    duration: 0.5,
                    ease: [0.25, 0.1, 0.25, 1.0],
                  },
                },
              }}
            >
              {item.title}
            </motion.h2>
            <motion.div
              className="timeline-card-tags"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {item.tags?.map((tag: TimelineTagProps, index: number) => (
                <TimelineCardIcon key={index} icon={tag.icon} title={tag.labels} index={index} />
              ))}
            </motion.div>
            <motion.div
              className="timeline-card-description"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.7,
                    ease: [0.25, 0.1, 0.25, 1.0],
                  },
                },
              }}
            >
              <p>{item.description[lang]}</p>
            </motion.div>
          </motion.div>
        ) : (
          <div className="timeline-card-blank right"></div>
        )}
      </div>
    </motion.div>
  );
}

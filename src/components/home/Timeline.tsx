'use client';
import { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { academicExperiences } from '@/constants/academicExperiences';
import { jobExperiences } from '@/constants/jobExperiences';
import Image from 'next/image';
import { Braces, BriefcaseBusiness, LucideIcon } from 'lucide-react';
import './Timeline.css';
import { Tooltip, TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip';
import { ExperienceProps, TimelineTagProps, TranslatedField } from '@/types/experience.types';

// Helper para pegar idioma do navegador
function getLang() {
  if (typeof window !== 'undefined') {
    return navigator.language.startsWith('pt') ? 'pt' : 'en';
  }
  return 'en';
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
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) controls.start('visible');
  }, [inView, controls]);

  return (
    <motion.div
      ref={ref}
      className={`relative flex w-full min-h-[250px]`}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, type: 'spring' } },
      }}
    >
      <div className="container start">
        <div className="blank" />
        <div className="period"></div>
        <div className="marker" />
        <div className="period">
          <span className="date"></span>
          <div className="timeline-icon">
            <BriefcaseBusiness />
          </div>
          <div className="sticky-arrow left">
            <div className="sticky-arrow left inside" />
            <div className="sticky-arrow left outline" />
          </div>
          <div className="sticky-arrow right">
            <div className="sticky-arrow right inside" />
            <div className="sticky-arrow right outline" />
          </div>
        </div>
        <div className="timeline-card">
          <div className="top-tags">
            <div className="top-tag">Job</div>
            <div className="top-tag tag-title">ModalGR</div>
          </div>
          <h2 className="timeline-card-title">Junior ReactJS</h2>
          <div className="timeline-card-tags">
            {item.tags.map((tag: TimelineTagProps, index: number) => (
              <TimelineCardIcon key={index} icon={tag.icon} title={tag.labels} />
            ))}
          </div>
          <div className="timeline-card-description">
            <p>{item.description[lang]}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

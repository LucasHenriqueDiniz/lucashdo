'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useCallback, useMemo, useState, type CSSProperties } from 'react';
import { LuExternalLink, LuMail, LuFileText } from 'react-icons/lu';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { TypingText } from '@/components/animate-ui/text/typing';
import { StaticGradient } from '@/components/effects/StaticGradient';
import { Button } from '@/components/ui/button';
import { skillsData } from '@/constants/skillsData';
import { useLanguageStore } from '@/store/languageStore';
import AnimatedRole from './AnimatedRole';

const HeroLaserFlow = dynamic(
  () =>
    import('@/components/effects/LaserFlow').then((module) => ({
      default: module.LaserFlowWithFallback,
    })),
  {
    ssr: false,
    loading: () => <StaticGradient className="hero-background-layer" />,
  }
);

type PointerPosition = {
  x: number;
  y: number;
};

const INITIAL_POINTER: PointerPosition = {
  x: 180,
  y: 180,
};

export default function HeroMobile() {
  const t = useTranslations();
  const mobile = useTranslations('Home.mobile');
  const router = useRouter();
  const lang = useLanguageStore((state) => state.lang);
  const [pointerPosition, setPointerPosition] = useState(INITIAL_POINTER);
  const [isRevealActive, setIsRevealActive] = useState(false);

  const featuredSkills = useMemo(
    () =>
      skillsData
        .filter((skill) => skill.featured)
        .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
        .map((skill) => skill.name),
    []
  );

  const highlightedSkills = useMemo(() => featuredSkills.slice(0, 3), [featuredSkills]);

  const stats = useMemo(
    () => [
      {
        value: mobile('stats.experience.value'),
        label: mobile('stats.experience.label'),
        caption: mobile('stats.experience.caption'),
      },
      {
        value: mobile('stats.projects.value'),
        label: mobile('stats.projects.label'),
        caption: mobile('stats.projects.caption'),
      },
    ],
    [mobile]
  );

  const revealStyles = {
    '--mouse-x': `${pointerPosition.x}px`,
    '--mouse-y': `${pointerPosition.y}px`,
    '--reveal-size': '300px',
    opacity: isRevealActive ? 0.95 : 0.35,
  } as CSSProperties;

  const handleTouchMove = useCallback((event: React.TouchEvent<HTMLElement>) => {
    const touch = event.touches[0];

    if (!touch) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    setPointerPosition({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    });
    setIsRevealActive(true);
  }, []);

  const handleContactClick = useCallback(() => {
    router.push('/contact');
  }, [router]);

  const handleProjectsClick = useCallback(() => {
    router.push('/projects');
  }, [router]);

  const handleCVClick = useCallback(() => {
    router.push('/cv');
  }, [router]);

  return (
    <section
      aria-label="Mobile hero section with interactive background"
      className="hero-shell relative w-full overflow-hidden rounded-[1.75rem] border border-white/10 px-4 py-6 md:hidden"
      onTouchMove={handleTouchMove}
      onTouchStart={() => setIsRevealActive(true)}
      onTouchEnd={() => setIsRevealActive(false)}
    >
      <HeroLaserFlow
        className="hero-background-layer"
        color="#0184FC"
        wispDensity={0.3}
        flowSpeed={0.92}
        fogIntensity={0}
        pixelRatioCap={1.15}
      />

      <div className="hero-reveal-layer" aria-hidden="true" style={revealStyles} />
      <div className="hero-gradient-overlay" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex max-w-md flex-col items-center gap-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="hero-availability"
        >
          <motion.span
            className="hero-availability-dot"
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          {mobile('availability')}
        </motion.div>

        <motion.div
          className="space-y-3 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="hero-title text-4xl">
            {t('Home.greeting')}{' '}
            <span className="hero-title-highlight">
              Lucas HDO
              <span className="hero-title-glow" aria-hidden="true" />
            </span>
          </h1>

          <div className="flex flex-col items-center gap-2">
            <TypingText
              className="hero-skill-loop text-xs"
              text={featuredSkills}
              cursor
              cursorClassName="hero-skill-cursor"
              holdDelay={1200}
              loop
            />
            <AnimatedRole lang={lang} />
          </div>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {highlightedSkills.map((skill, index) => (
            <motion.span
              key={skill}
              className="rounded-full border border-[var(--primary)]/25 bg-[var(--primary)]/12 px-3 py-1.5 text-xs font-medium text-[var(--primary)]"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              {skill}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          className="grid w-full grid-cols-2 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-slate-950/45 p-4 backdrop-blur-xl"
            >
              <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[var(--cyan)]/75">
                {stat.label}
              </p>
              <p className="mb-1 text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-slate-300/75">{stat.caption}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="flex w-full flex-col gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button
            onClick={handleProjectsClick}
            className="hero-primary-cta min-h-12 w-full"
            size="lg"
          >
            <LuExternalLink className="mr-1 h-4 w-4" aria-hidden="true" />
            {t('Navigation.projects')}
          </Button>

          <Button
            onClick={handleContactClick}
            variant="outline"
            className="hero-secondary-cta min-h-12 w-full"
            size="lg"
          >
            <LuMail className="mr-1 h-4 w-4" aria-hidden="true" />
            {t('Navigation.contact')}
          </Button>

          <Button
            onClick={handleCVClick}
            variant="outline"
            className="hero-secondary-cta hero-secondary-cyan min-h-12 w-full"
            size="lg"
          >
            <LuFileText className="mr-1 h-4 w-4" aria-hidden="true" />
            {t('Navigation.viewCV')}
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

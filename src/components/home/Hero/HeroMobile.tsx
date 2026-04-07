'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useCallback, useMemo, useState, type CSSProperties } from 'react';
import { LuExternalLink, LuMail, LuFileText } from 'react-icons/lu';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { StaticGradient } from '@/components/effects/StaticGradient';
import RotatingText from '@/components/RotatingText';
import { Button } from '@/components/ui/button';
import { useLanguageStore } from '@/store/languageStore';

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
  const router = useRouter();
  const lang = useLanguageStore((state) => state.lang);
  const [pointerPosition, setPointerPosition] = useState(INITIAL_POINTER);
  const [isRevealActive, setIsRevealActive] = useState(false);

  const rotatingRoles = useMemo(
    () =>
      lang === 'pt'
        ? [
            'front-end pleno',
            'f\u00e3 de back-end',
            'entusiasta de UI/UX',
            'full-stack',
            'gamer nas horas vagas',
            'eterno aprendiz',
            'cat\u00f3lico',
            'estudante de \u65e5\u672c\u8a9e',
            'que ama m\u00fasica',
            'rato de academia',
            'que j\u00e1 chorou vendo Shigatsu wa Kimi no Uso',
          ]
        : [
            'mid-level front-end developer',
            'back-end enthusiast',
            'full-stack developer',
            'UI/UX enthusiast',
            'gamer in their free time',
            'eternal learner',
            'Catholic',
            '\u65e5\u672c\u8a9e language student',
            'who loves music',
            'gym rat',
            'who cried watching Shigatsu wa Kimi no Uso',
          ],
    [lang]
  );

  const stats = useMemo(
    () => [
      {
        value: t('Home.mobile.stats.experience.value'),
        label: t('Home.mobile.stats.experience.label'),
        caption: t('Home.mobile.stats.experience.caption'),
      },
      {
        value: t('Home.mobile.stats.projects.value'),
        label: t('Home.mobile.stats.projects.label'),
        caption: t('Home.mobile.stats.projects.caption'),
      },
    ],
    [t]
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
      className="relative w-full overflow-hidden px-4 py-6 md:hidden"
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

          <div className="flex flex-col items-center gap-3">
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-[rgba(237,248,255,0.92)]">
              <span className="text-[rgba(222,236,248,0.92)]">{t('Hero.developerPrefix')}</span>
              <RotatingText
                texts={rotatingRoles}
                rotationInterval={2800}
                staggerDuration={0.012}
                splitBy="characters"
                mainClassName="inline-flex w-fit justify-center overflow-hidden whitespace-nowrap rounded-lg border border-[#6bbcff]/25 bg-[#0184FC] px-2.5 py-1 text-white shadow-[0_10px_30px_rgba(1,132,252,0.28)]"
                splitLevelClassName="justify-center whitespace-nowrap"
                elementLevelClassName="font-bold text-white"
              />
            </div>
          </div>
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
            className="min-h-12 w-full border border-sky-300/30 bg-[linear-gradient(135deg,#0d7ff2_0%,#0867cb_100%)] text-white shadow-[0_0_32px_rgba(8,103,203,0.28)] hover:brightness-110"
            size="lg"
          >
            <LuExternalLink className="mr-1 h-4 w-4" aria-hidden="true" />
            {t('Home.browseProjects')}
          </Button>

          <Button
            onClick={handleContactClick}
            variant="outline"
            className="min-h-12 w-full border-slate-200/10 bg-slate-950/45 text-slate-100 shadow-[0_10px_26px_rgba(2,8,20,0.18)] backdrop-blur-md hover:border-sky-300/25 hover:bg-slate-900/72"
            size="lg"
          >
            <LuMail className="mr-1 h-4 w-4" aria-hidden="true" />
            {t('Navigation.contact')}
          </Button>

          <Button
            onClick={handleCVClick}
            variant="outline"
            className="min-h-12 w-full border-slate-200/10 bg-slate-950/45 text-slate-100 shadow-[0_10px_26px_rgba(2,8,20,0.18)] backdrop-blur-md hover:border-sky-300/25 hover:bg-slate-900/72"
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

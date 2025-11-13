'use client';

import type { Container, ISourceOptions } from '@tsparticles/engine';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { HiOutlineArrowNarrowDown } from 'react-icons/hi';
import { LuExternalLink, LuFileText, LuMail } from 'react-icons/lu';
import { MdOutlineMouse } from 'react-icons/md';
import { useLanguageStore } from '@/store/languageStore';
import { skillsData } from '@/constants/skillsData';
import { Button } from '@/components/ui/button';
import { TypingText } from '@/components/animate-ui/text/typing';
import AnimatedRole from './AnimatedRole';
import './Hero.css';

export const networkPreset: ISourceOptions = {
  background: {
    color: {
      value: 'transparent',
    },
  },
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: 'push',
      },
      onHover: {
        enable: true,
        mode: 'repulse',
      },
    },
    modes: {
      push: {
        quantity: 2,
      },
      repulse: {
        distance: 100,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: ['#60A5FA', '#22D3EE', '#3B82F6'],
    },
    links: {
      color: '#60A5FA',
      distance: 150,
      enable: true,
      opacity: 0.3,
      width: 1,
    },
    move: {
      direction: 'none',
      enable: true,
      outModes: {
        default: 'out',
      },
      random: false,
      speed: 1,
      straight: false,
    },
    number: {
      density: {
        enable: true,
      },
      value: 40,
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: 'circle',
    },
    size: {
      value: { min: 1, max: 3 },
    },
  },
  detectRetina: true,
};

const MemoizedParticles = React.memo(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ({ options, particlesLoaded }: { options: any; particlesLoaded: any }) => (
    <Particles
      id="tsparticles"
      particlesLoaded={particlesLoaded}
      options={options}
      className="absolute inset-0 -z-10"
    />
  )
);
MemoizedParticles.displayName = 'MemoizedParticles';

function HeroComponent() {
  // State for typing effect
  const [init, setInit] = useState(false);
  const lang = useLanguageStore(state => state.lang);
  const router = useRouter();
  const t = useTranslations();

  // Initialize tsParticles
  useEffect(() => {
    initParticlesEngine(async engine => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = useCallback(async (_container?: Container): Promise<void> => {
    // Particle system loaded
  }, []);

  // Get featured skills for the typing effect - memoized
  const featuredSkills = useMemo(
    () =>
      skillsData
        .filter(skill => skill.featured)
        .sort((a, b) => (a.order || 99) - (b.order || 99))
        .map(skill => skill.name),
    []
  );

  // Memoized event handlers
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
      className="hidden md:flex min-h-[60vh] w-full max-w-4xl mx-auto px-2 relative flex-col justify-center items-center"
      style={{ justifyContent: 'center' }}
    >
      {/* Badge de Disponibilidade */}
      <motion.div 
        className="absolute top-6 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 rounded-full blur opacity-40 group-hover:opacity-60 transition duration-300"></div>
          <div className="relative px-5 py-2 bg-background rounded-full border border-green-500/30 text-green-500 text-xs sm:text-sm font-medium flex items-center gap-2 shadow-lg">
            <motion.span 
              className="w-2 h-2 rounded-full bg-green-500"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            {t('Home.availableForHire')}
          </div>
        </div>
      </motion.div>

      {/* tsParticles Background */}
      {init && (
        <Particles
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          options={networkPreset}
          className="absolute inset-0 -z-10 hidden md:block"
        />
      )}

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 -z-5 bg-gradient-to-b from-transparent via-background/20 to-background/80" />

      <div className="flex flex-col items-center gap-4 w-full">
        {/* Typing effect for skills */}
        <motion.div
          className="mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TypingText
            className="text-lg font-bold text-[color:var(--primary)]"
            text={featuredSkills}
            cursor
            cursorClassName="h-6 w-1 mx-1 bg-[var(--primary)] dark:bg-[var(--primary)]"
            loop
            holdDelay={1200}
          />
        </motion.div>

        {/* Main heading */}
        <motion.h1
          className="text-5xl md:text-6xl font-bold text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {t('Home.greeting')}{' '}
          <span className="relative bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent font-extrabold">
            Lucas HDO
            <motion.div
              className="absolute inset-0 bg-blue-400/15 blur-lg -z-10"
              animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
        </motion.h1>

        {/* Subtitle with changing roles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AnimatedRole lang={lang} />
        </motion.div>

        {/* Call to action buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-3 mt-4 justify-center w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Contact button */}
          <motion.div
            className="w-full sm:w-auto"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <Button
              onClick={handleContactClick}
              size="lg"
              variant="outline"
              className="relative overflow-hidden border-2 border-[color:var(--blue)] hover:text-white px-6 py-2.5 rounded-xl text-base font-semibold w-full transition-all duration-300 bg-background hover:shadow-xl hover:shadow-blue-500/20"
            >
              <span className="relative z-10 flex items-center gap-2">
                <LuMail className="w-5 h-5" />
                {t('Navigation.contact')}
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[color:var(--blue)] to-[color:var(--cyan)] -z-10"
                initial={{ x: '-100%' }}
                whileHover={{ x: '0%' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </Button>
          </motion.div>

          {/* CV button */}
          <motion.div
            className="w-full sm:w-auto"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <Button
              onClick={handleCVClick}
              size="lg"
              variant="outline"
              className="relative overflow-hidden border-2 border-[color:var(--cyan)] hover:text-white px-6 py-2.5 rounded-xl text-base font-semibold w-full transition-all duration-300 bg-background hover:shadow-xl hover:shadow-cyan-500/20"
            >
              <span className="relative z-10 flex items-center gap-2">
                <LuFileText className="w-5 h-5" />
                {t('Navigation.viewCV')}
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[color:var(--cyan)] to-[color:var(--blue)] -z-10"
                initial={{ x: '-100%' }}
                whileHover={{ x: '0%' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </Button>
          </motion.div>

          {/* Projects button */}
          <motion.div
            className="relative w-full sm:w-auto"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <Button
              onClick={handleProjectsClick}
              size="lg"
              className="relative bg-gradient-to-r from-[color:var(--blue)] to-[color:var(--cyan)] text-white hover:shadow-xl hover:shadow-cyan-500/30 px-6 py-2.5 rounded-xl text-base font-semibold w-full overflow-hidden transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                <LuExternalLink className="w-5 h-5" />
                {t('Navigation.projects')}
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* "See more projects" indicator  */}
      <motion.div
        className="absolute bottom-4 left-0 right-0 mx-auto w-fit hidden md:flex flex-col items-center gap-2 cursor-pointer"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        whileHover={{
          scale: 1.05,
          y: -2,
          transition: { type: 'spring', stiffness: 400, damping: 10 },
        }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-sm font-medium text-muted-foreground">
          {t('Home.browseProjects')}
        </span>

        <motion.div
          className="relative"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <MdOutlineMouse className="w-5 h-5 text-[color:var(--cyan)]" />
        </motion.div>

        <div className="flex flex-col items-center relative">
          <HiOutlineArrowNarrowDown className="w-5 h-5 text-[color:var(--cyan)] opacity-70" />

          <motion.div
            className="absolute -inset-2 rounded-full bg-[color:var(--cyan)] opacity-[0.025] blur-md"
            animate={{ scale: [1, 1.1, 1], opacity: [0.02, 0.04, 0.02] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  );
}

export default React.memo(HeroComponent);

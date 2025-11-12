'use client';

import AboutHeroNav from '@/components/about/AboutHeroNav';
import Character from '@/components/character/Character';
import FloatingBubbles from '@/components/character/FloatingBubbles';
import Waves from '@/components/character/Waves';
import '@/components/character/character.css';
import { useAboutSectionController } from '@/providers/AboutSectionController';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

export default function AboutHero() {
  const t = useTranslations('Navigation');
  const tHero = useTranslations('About.hero');
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isSectionActive } = useAboutSectionController();
  const isHeroActive = isSectionActive('hero');

  // Monitor scroll da página inteira para animar header
  const { scrollYProgress } = useScroll({
    offset: ['start start', 'end start'],
  });

  useEffect(() => {
    const checkScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const viewportHeight = window.innerHeight;
      setIsScrolled(scrollY > viewportHeight * 0.5);
    };

    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Check initial state

    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  // Opacity para corner badge - desaparece quando sai da primeira seção
  const cornerBadgeOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/about', label: t('about') },
    { href: '/projects', label: t('projects') },
    { href: '/contact', label: t('contact') },
  ];

  return (
    <div className="absolute inset-0 bg-[var(--frame-color)] p-6" ref={containerRef}>
      <div className="relative h-[calc(100vh-3rem)] w-full overflow-hidden rounded-[24px] ring-1 ring-inset ring-white/10 avatar-background">
        <div className="hidden md:block">
          <AboutHeroNav links={navLinks} isScrolled={isScrolled} />
        </div>
        <div className="md:hidden">
          <AboutHeroNav links={navLinks} isScrolled={false} position="bottom" />
        </div>

        {/* Mobile gradient layers */}
        <div className="absolute inset-0 md:hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,rgba(34,211,238,0.18),transparent_55%),radial-gradient(circle_at_80%_-10%,rgba(168,85,247,0.2),transparent_55%),linear-gradient(180deg,rgba(11,16,32,0.95)_0%,rgba(11,16,32,0.85)_60%,rgba(4,6,10,0.92)_100%)]" />
          <div className="absolute -bottom-28 -left-12 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute -top-24 -right-10 h-60 w-60 rounded-full bg-purple-500/15 blur-[110px]" />
        </div>

        <div className="hidden md:block">
          <Waves layer="back" />
        </div>

        {/* Intro text */}
        <div className="intro-text">
          <span className="small">{tHero('greeting')}</span>
          <span className="big">LUCAS</span>
        </div>

        <FloatingBubbles />

        <div className="absolute inset-0 z-10 flex w-full items-center justify-center">
          <Character
            heroRef={containerRef as React.RefObject<HTMLDivElement>}
            isActive={isHeroActive}
          />
        </div>

        <div className="hidden md:block">
          <Waves layer="front" />
        </div>

        {/* Corner badge - desaparece COMPLETAMENTE ao scrollar */}

        <AnimatePresence>
          {!isScrolled && (
            <motion.div
              style={{ opacity: cornerBadgeOpacity }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="pointer-events-none absolute bottom-16 right-8 z-30 hidden md:flex md:bottom-24 md:right-12 md:z-40"
            >
              <div className="flex flex-col items-end gap-1 text-right text-white">
                <div className="text-3xl font-bold tracking-[0.12em]">{tHero('name')}</div>

                <div className="text-lg font-semibold tracking-[0.18em] text-cyan-200/80">
                  {tHero('locationAndRole')}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
          <motion.div
            className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center"
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <motion.div
              className="w-1 h-3 bg-white/60 rounded-full mt-2"
              animate={{
                y: [0, 3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

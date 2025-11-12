'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { LuBriefcase, LuCode, LuHeart, LuMail, LuSparkles, LuUser } from 'react-icons/lu';
import AboutCTAVariants from '@/components/about/AboutCTAVariants';
import AboutHero from '@/components/about/AboutHero';
import AboutProfileShowcase from '@/components/about/AboutProfileShowcase';
import AboutSkillsVariants from '@/components/about/AboutSkillsVariants';
import JornadaTimeline from '@/components/about/JornadaTimeline';
import InterestsCards from '@/components/interests-cards/InterestsCards';
import { skillsData } from '@/constants/skillsData';
import { AboutSectionControllerProvider } from '@/providers/AboutSectionController';

type SectionId = 'hero' | 'profile' | 'journey' | 'skills' | 'interests' | 'cta';

export default function AboutClient() {
  const t = useTranslations('About.sectionNav');
  const tSkills = useTranslations('About.skillsHighlight');
  const tProfile = useTranslations('About.profile');
  const tCTA = useTranslations('About.cta');
  const heroRef = useRef<HTMLElement>(null);
  const profileRef = useRef<HTMLElement>(null);
  const journeyRef = useRef<HTMLElement>(null);
  const skillsSectionRef = useRef<HTMLElement>(null);
  const interestsRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const [showIndicator, setShowIndicator] = useState(false);

  const sortedSkills = [...skillsData]
    .sort(
      (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (a.order || 999) - (b.order || 999)
    )
    .slice(0, 12);

  useEffect(() => {
    const sections = [
      { id: 'hero', ref: heroRef },
      { id: 'profile', ref: profileRef },
      { id: 'journey', ref: journeyRef },
      { id: 'skills', ref: skillsSectionRef },
      { id: 'interests', ref: interestsRef },
      { id: 'cta', ref: ctaRef },
    ];

    const getContainer = () => containerRef.current;

    const checkActiveSection = () => {
      const container = getContainer();
      if (!container) return;

      const scrollPosition = container.scrollTop + container.clientHeight / 2;

      for (const section of sections) {
        const element = section.ref.current;
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;

          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section.id as SectionId);
            setShowIndicator(section.id !== 'hero');
            return;
          }
        }
      }
    };

    const container = getContainer();
    if (!container) return;

    const handleScroll = () => requestAnimationFrame(checkActiveSection);

    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', checkActiveSection);
    checkActiveSection();

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkActiveSection);
    };
  }, []);

  const sections: Array<{ id: SectionId; icon: any; label: string }> = [
    { id: 'hero', icon: LuSparkles, label: t('hero') },
    { id: 'profile', icon: LuUser, label: t('profile') },
    { id: 'journey', icon: LuBriefcase, label: t('journey') },
    { id: 'skills', icon: LuCode, label: t('skills') },
    { id: 'interests', icon: LuHeart, label: t('interests') },
    { id: 'cta', icon: LuMail, label: t('cta') },
  ];

  const scrollToSection = (sectionId: SectionId) => {
    const container = containerRef.current;
    const refs: Record<SectionId, React.RefObject<HTMLElement | null>> = {
      hero: heroRef,
      profile: profileRef,
      journey: journeyRef,
      skills: skillsSectionRef,
      interests: interestsRef,
      cta: ctaRef,
    };

    const ref = refs[sectionId]?.current;
    if (container && ref) {
      const top = ref.offsetTop - container.clientHeight / 2 + ref.clientHeight / 2;
      container.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <AboutSectionControllerProvider activeSection={activeSection}>
      <div
        ref={containerRef}
        className="h-screen overflow-y-auto snap-y snap-mandatory w-full relative"
      >
        <AnimatePresence>
          {showIndicator && (
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
              className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3"
            >
              {/* container do indicador com layout compartilhado */}
              <motion.ul className="flex flex-col gap-2.5" initial={false}>
                {/* highlight móvel (anel + glow) que reaproveita DOM via layoutId */}
                <AnimatePresence>
                  <motion.div
                    key={activeSection} // move junto do ativo
                    layoutId="indicator-focus"
                    className="absolute right-0 h-11 w-11 rounded-full pointer-events-none"
                    transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.6 }}
                    style={{ translateZ: 0 }}
                  >
                    {/* anel sem serrilhado */}
                    <span className="block h-full w-full rounded-full ring-2 ring-cyan-400/50 shadow-[0_0_24px_rgba(34,211,238,0.35)]" />
                  </motion.div>
                </AnimatePresence>

                {sections.map((section, index) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;

                  return (
                    <motion.li
                      key={section.id}
                      className="relative flex items-center justify-end gap-2.5"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03, duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                    >
                      {/* label (entra/sai com fade+slide) */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.span
                            key="label"
                            initial={{ opacity: 0, x: 8, scale: 0.96 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 8, scale: 0.96 }}
                            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                            className="px-3 py-1.5 rounded-full bg-gray-900/90 backdrop-blur-sm outline outline-1 outline-white/10 text-xs text-white uppercase tracking-wide font-medium whitespace-nowrap shadow-lg"
                          >
                            {section.label}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* botão */}
                      <motion.button
                        onClick={() => scrollToSection(section.id)}
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.94 }}
                        className="relative"
                      >
                        <motion.div
                          // evite border durante escala → use ring/outline
                          className={[
                            'h-11 w-11 rounded-full flex items-center justify-center transition-colors duration-200 transform-gpu will-change-transform',
                            isActive
                              ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl shadow-blue-500/25'
                              : 'bg-gray-800/70 backdrop-blur-sm text-gray-400 hover:text-white hover:bg-gray-700/60 ring-1 ring-gray-700/40',
                          ].join(' ')}
                          animate={{ scale: isActive ? 1.08 : 1 }}
                          transition={{ type: 'spring', stiffness: 420, damping: 28, mass: 0.5 }}
                        >
                          <Icon className="h-5 w-5" />
                        </motion.div>

                        {/* glow sutil independente da borda */}
                        <motion.span
                          aria-hidden
                          className="pointer-events-none absolute inset-0 rounded-full"
                          initial={false}
                          animate={{ opacity: isActive ? 1 : 0 }}
                          transition={{ duration: 0.18 }}
                          style={{
                            boxShadow: '0 0 32px rgba(99,102,241,0.35)', // roxo sutil
                          }}
                        />
                      </motion.button>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.section
          ref={heroRef}
          className="snap-start snap-always min-h-screen w-full relative"
        >
          <AboutHero />
        </motion.section>

        <motion.section
          ref={profileRef}
          className="relative flex min-h-screen w-full snap-always snap-start items-stretch overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-6 md:px-12 md:py-12"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none" />
          <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col gap-6 md:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="shrink-0"
            >
              <h2 className="text-3xl font-bold md:text-5xl md:mb-2">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {tProfile('title')}
                </span>
              </h2>
              <div className="hidden h-1 w-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 md:block" />
            </motion.div>
            <div className="flex flex-1 min-h-0">
              <AboutProfileShowcase />
            </div>
          </div>
        </motion.section>

        <motion.section
          ref={journeyRef}
          className="snap-start snap-always min-h-screen w-full relative"
        >
          <JornadaTimeline />
        </motion.section>

        <motion.section
          ref={skillsSectionRef}
          className="snap-start snap-always min-h-screen flex items-center w-full px-6 md:px-12 py-16 relative overflow-hidden bg-gradient-to-br from-zinc-950 via-neutral-950 to-zinc-900"
        >
          <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(6,182,212,0.08)_0%,_transparent_55%,_rgba(34,211,238,0.08)_100%)] pointer-events-none" />
          <div className="w-full max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row gap-10 lg:gap-16 items-start">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="md:w-1/3 space-y-5"
              >
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-xs uppercase tracking-[0.2em]">
                  <LuCode className="w-3 h-3" /> {tSkills('badge')}
                </span>
                <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-br from-white via-cyan-200 to-cyan-500 bg-clip-text text-transparent leading-tight">
                  {tSkills('title')}
                </h2>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {tSkills('description')}
                </p>
                <div className="h-px w-24 bg-gradient-to-r from-cyan-500 to-purple-500" />
              </motion.div>
              <div className="flex-1 w-full">
                <AboutSkillsVariants />
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          ref={interestsRef}
          className="snap-start snap-always w-full px-4 sm:px-6 md:px-12 py-10 md:py-0 relative overflow-hidden bg-gray-900 md:h-screen md:flex md:items-center"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8 md:gap-12 md:h-full md:justify-center">
            <InterestsCards />
          </div>
        </motion.section>

        <motion.section
          ref={ctaRef}
          className="snap-start snap-always min-h-screen flex items-center w-full px-6 md:px-12 py-12 relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-600/20 via-transparent to-pink-600/20 pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(45deg,_transparent_48%,_rgba(139,92,246,0.03)_50%,_transparent_52%)] bg-[length:60px_60px] opacity-50" />
          <div className="w-full max-w-5xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h2 className="text-5xl md:text-6xl font-black mb-4">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                  {tCTA('title')}
                </span>
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                {tCTA('description')}
              </p>
            </motion.div>
            <AboutCTAVariants />
          </div>
        </motion.section>
      </div>
    </AboutSectionControllerProvider>
  );
}

'use client';

import { motion } from 'framer-motion';
import { useCallback, useMemo } from 'react';
import { LuExternalLink, LuMail, LuFileText } from 'react-icons/lu';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { TypingText } from '@/components/animate-ui/text/typing';
import { Button } from '@/components/ui/button';
import { skillsData } from '@/constants/skillsData';
import { useLanguageStore } from '@/store/languageStore';
import AnimatedRole from './AnimatedRole';

export default function HeroMobile() {
  const t = useTranslations();
  const mobile = useTranslations('Home.mobile');
  const router = useRouter();
  const lang = useLanguageStore(state => state.lang);

  const featuredSkills = useMemo(
    () =>
      skillsData
        .filter(skill => skill.featured)
        .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
        .map(skill => skill.name),
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
    <section className="relative w-full max-w-[100vw] overflow-x-hidden px-4 py-6 md:py-12 md:hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(384px,100vw)] h-96 bg-[var(--primary)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[min(320px,100vw)] h-80 bg-[var(--cyan)]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-md mx-auto flex flex-col items-center gap-6">
        {/* Availability Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--cyan)]/10 border border-[var(--cyan)]/30 backdrop-blur-sm">
            <motion.span
              className="w-2 h-2 rounded-full bg-[var(--cyan)]"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span className="text-xs font-medium text-[var(--cyan)] uppercase tracking-wider">
              {mobile('availability')}
            </span>
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.div
          className="text-center space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="text-4xl font-bold leading-tight">
            {t('Home.greeting')}{' '}
            <span className="bg-gradient-to-r from-[var(--primary)] via-[var(--cyan)] to-[var(--primary)] bg-clip-text text-transparent">
              Lucas HDO
            </span>
          </h1>

          {/* Typing Skills */}
          <div className="flex flex-col items-center gap-2">
            <TypingText
              className="text-xs font-semibold uppercase tracking-wider text-[var(--cyan)]"
              text={featuredSkills}
              cursor
              cursorClassName="h-4 w-[2px] bg-[var(--cyan)]"
              holdDelay={1200}
              loop
            />
            <AnimatedRole lang={lang} />
          </div>
        </motion.div>

        {/* Skills Tags */}
        <motion.div
          className="flex flex-wrap justify-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {highlightedSkills.map((skill, index) => (
            <motion.span
              key={skill}
              className="px-3 py-1.5 rounded-lg bg-[var(--primary)]/10 border border-[var(--primary)]/20 text-xs font-medium text-[var(--primary)]"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + index * 0.1, type: 'spring', stiffness: 200 }}
            >
              {skill}
            </motion.span>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 gap-3 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="relative p-4 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-[var(--primary)]/10 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1, type: 'spring' }}
              whileHover={{ scale: 1.02, borderColor: 'var(--primary)' }}
            >
              <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-[var(--cyan)]/70 mb-1">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className="text-xs text-[var(--muted-foreground)]">{stat.caption}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col gap-3 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button
            onClick={handleProjectsClick}
            className="w-full bg-gradient-to-r from-[var(--primary)] to-[var(--cyan)] text-white hover:shadow-lg hover:shadow-[var(--primary)]/30 transition-all"
            size="lg"
          >
            <LuExternalLink className="h-4 w-4 mr-2" />
            {t('Navigation.projects')}
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleContactClick}
              variant="outline"
              className="border-[var(--primary)]/30 text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-all"
              size="lg"
            >
              <LuMail className="h-4 w-4 mr-2" />
              {t('Navigation.contact')}
            </Button>

            <Button
              onClick={handleCVClick}
              variant="outline"
              className="border-[var(--cyan)]/30 text-[var(--cyan)] hover:bg-[var(--cyan)] hover:text-white transition-all"
              size="lg"
            >
              <LuFileText className="h-4 w-4 mr-2" />
              {t('Navigation.viewCV')}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}


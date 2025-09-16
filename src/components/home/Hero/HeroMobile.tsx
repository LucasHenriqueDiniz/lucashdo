'use client';

import { motion } from 'framer-motion';
import { useCallback, useMemo } from 'react';
import { LuExternalLink, LuMail } from 'react-icons/lu';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { TypingText } from '@/components/animate-ui/text/typing';
import { Button } from '@/components/ui/button';
import { skillsData } from '@/constants/skillsData';
import { useLanguageStore } from '@/lib/i18n/languageStore';
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

  const highlightedSkills = useMemo(() => featuredSkills.slice(0, 4), [featuredSkills]);

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

  return (
    <section className="relative w-full overflow-hidden px-4 pb-16 pt-16 md:hidden sm:px-6 sm:pt-20">
      <div
        className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-20 top-8 h-40 w-40 rounded-full bg-[color:var(--blue)]/30 blur-3xl sm:-left-24 sm:h-48 sm:w-48"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-[-120px] right-[-80px] h-56 w-56 rounded-full bg-[color:var(--cyan)]/25 blur-[100px] sm:bottom-[-140px] sm:right-[-60px] sm:h-64 sm:w-64"
        aria-hidden="true"
      />
      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center gap-6 rounded-[28px] border border-[color:var(--blue)]/15 bg-background/85 p-6 text-center shadow-[0_20px_70px_-45px_rgba(56,189,248,0.7)] backdrop-blur sm:max-w-xl sm:gap-8 sm:rounded-[32px] sm:p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <motion.span
          className="inline-flex items-center gap-2 rounded-full border border-[color:var(--cyan)]/30 bg-[color:var(--cyan)]/10 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-[color:var(--cyan)] sm:px-4 sm:text-xs"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <span className="h-2 w-2 rounded-full bg-[color:var(--cyan)] shadow-[0_0_0_4px_rgba(56,189,248,0.15)] animate-pulse" />
          {mobile('availability')}
        </motion.span>

        <div className="flex w-full flex-col gap-3 sm:gap-4">
          <motion.h1
            className="text-3xl font-bold leading-tight text-foreground sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {t('Home.greeting')}{' '}
            <span className="bg-gradient-to-r from-[color:var(--blue)] via-[color:var(--cyan)] to-[color:var(--blue)] bg-clip-text text-transparent">
              Lucas HDO
            </span>
          </motion.h1>

          <motion.p
            className="text-sm text-muted-foreground sm:text-base"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
          >
            {mobile('subtitle')}
          </motion.p>
        </div>

        <motion.div
          className="flex w-full flex-col items-center gap-2 sm:gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <TypingText
            className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--cyan)] sm:text-sm"
            text={featuredSkills}
            cursor
            cursorClassName="h-4 w-[2px] bg-[color:var(--cyan)] sm:h-5"
            holdDelay={1200}
            loop
          />
          <AnimatedRole lang={lang} />
        </motion.div>

        <motion.p
          className="text-left text-sm leading-relaxed text-muted-foreground sm:max-w-md sm:text-center sm:text-base"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
        >
          {mobile('description')}
        </motion.p>

        <motion.div
          className="flex w-full flex-wrap justify-center gap-2"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {highlightedSkills.map(skill => (
            <span
              key={skill}
              className="rounded-full border border-[color:var(--blue)]/25 bg-[color:var(--blue)]/10 px-3 py-1 text-[0.7rem] font-medium text-[color:var(--blue)] sm:text-xs"
            >
              {skill}
            </span>
          ))}
        </motion.div>

        <motion.div
          className="grid w-full grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
        >
          {stats.map(stat => (
            <div
              key={stat.label}
              className="rounded-2xl border border-[color:var(--blue)]/15 bg-background/85 p-4 text-left shadow-[0_18px_50px_-40px_rgba(56,189,248,0.6)] sm:p-5"
            >
              <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-[color:var(--cyan)]/80 sm:text-xs">
                {stat.label}
              </p>
              <p className="mt-1 text-2xl font-bold text-foreground sm:mt-2 sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.caption}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="flex w-full flex-col gap-3 pt-1 sm:pt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Button
            onClick={handleContactClick}
            variant="outline"
            className="flex w-full items-center justify-center gap-2 border-[1.5px] border-[color:var(--blue)] text-sm text-[color:var(--blue)] hover:bg-[color:var(--blue)] hover:text-white sm:text-base"
            size="lg"
          >
            <LuMail className="h-5 w-5" />
            {t('Navigation.contact')}
          </Button>

          <Button
            onClick={handleProjectsClick}
            className="flex w-full items-center justify-center gap-2 bg-[color:var(--blue)] text-sm text-white hover:bg-[color:var(--blue)]/90 sm:text-base"
            size="lg"
          >
            <LuExternalLink className="h-5 w-5" />
            {t('Navigation.projects')}
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}

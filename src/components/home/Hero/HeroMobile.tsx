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
    <section className="relative w-full overflow-hidden px-6 pb-16 pt-20 md:hidden">
      <div
        className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-24 top-6 h-48 w-48 rounded-full bg-[color:var(--blue)]/30 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-[-120px] right-[-60px] h-64 w-64 rounded-full bg-[color:var(--cyan)]/25 blur-[100px]"
        aria-hidden="true"
      />
      <motion.div
        className="relative z-10 mx-auto flex max-w-xl flex-col items-center gap-8 rounded-[32px] border border-[color:var(--blue)]/15 bg-background/80 p-8 text-center shadow-[0_25px_80px_-40px_rgba(56,189,248,0.55)] backdrop-blur"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <motion.span
          className="inline-flex items-center gap-2 rounded-full border border-[color:var(--cyan)]/30 bg-[color:var(--cyan)]/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--cyan)]"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <span className="h-2 w-2 rounded-full bg-[color:var(--cyan)] shadow-[0_0_0_4px_rgba(56,189,248,0.15)] animate-pulse" />
          {mobile('availability')}
        </motion.span>

        <div className="flex flex-col gap-4">
          <motion.h1
            className="text-4xl font-bold leading-tight text-foreground"
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
            className="text-base text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
          >
            {mobile('subtitle')}
          </motion.p>
        </div>

        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <TypingText
            className="text-sm font-semibold uppercase tracking-[0.3em] text-[color:var(--cyan)]"
            text={featuredSkills}
            cursor
            cursorClassName="h-5 w-[2px] bg-[color:var(--cyan)]"
            holdDelay={1200}
            loop
          />
          <AnimatedRole lang={lang} />
        </motion.div>

        <motion.p
          className="max-w-md text-sm leading-relaxed text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
        >
          {mobile('description')}
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-2"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {highlightedSkills.map(skill => (
            <span
              key={skill}
              className="rounded-full border border-[color:var(--blue)]/30 bg-[color:var(--blue)]/10 px-3 py-1 text-xs font-medium text-[color:var(--blue)]"
            >
              {skill}
            </span>
          ))}
        </motion.div>

        <motion.div
          className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
        >
          {stats.map(stat => (
            <div
              key={stat.label}
              className="rounded-2xl border border-[color:var(--blue)]/15 bg-background/80 p-5 text-left shadow-[0_18px_50px_-35px_rgba(56,189,248,0.65)]"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-[color:var(--cyan)]/80">
                {stat.label}
              </p>
              <p className="mt-2 text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.caption}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="flex w-full flex-col gap-3 pt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Button
            onClick={handleContactClick}
            variant="outline"
            className="flex w-full items-center justify-center gap-2 border-2 border-[color:var(--blue)] text-[color:var(--blue)] hover:bg-[color:var(--blue)] hover:text-white"
            size="lg"
          >
            <LuMail className="h-5 w-5" />
            {t('Navigation.contact')}
          </Button>

          <Button
            onClick={handleProjectsClick}
            className="flex w-full items-center justify-center gap-2 bg-[color:var(--blue)] text-white hover:bg-[color:var(--blue)]/90"
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

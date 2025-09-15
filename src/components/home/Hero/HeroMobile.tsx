'use client';

import { motion } from 'framer-motion';
import { LuExternalLink, LuMail } from 'react-icons/lu';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useLanguageStore } from '@/lib/i18n/languageStore';
import { Button } from '@/components/ui/button';
import AnimatedRole from './AnimatedRole';

export default function HeroMobile() {
  const t = useTranslations();
  const router = useRouter();
  const lang = useLanguageStore(state => state.lang);

  const handleContactClick = () => {
    router.push('/contact');
  };

  const handleProjectsClick = () => {
    router.push('/projects');
  };

  return (
    <section className="md:hidden w-full max-w-md mx-auto py-16 flex flex-col items-center text-center gap-4">
      <motion.h1
        className="text-4xl font-bold"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {t('Home.greeting')} <span className="text-[color:var(--blue)]">Lucas HDO</span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <AnimatedRole lang={lang} />
      </motion.div>

      <motion.div
        className="flex flex-col gap-4 w-full mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Button
          onClick={handleContactClick}
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
        >
          <LuMail className="w-5 h-5" />
          {t('Navigation.contact')}
        </Button>
        <Button
          onClick={handleProjectsClick}
          className="w-full bg-[color:var(--blue)] hover:bg-[color:var(--blue)]/90 text-white flex items-center justify-center gap-2"
        >
          <LuExternalLink className="w-5 h-5" />
          {t('Navigation.projects')}
        </Button>
      </motion.div>
    </section>
  );
}

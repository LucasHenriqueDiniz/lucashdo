'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

export function Hero() {
  const t = useTranslations('home');

  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 max-w-3xl"
      >
        <h1 className="text-4xl md:text-6xl font-bold">
          {t('greeting')}{' '}
          <span className="text-primary relative">
            lucashdo
            <motion.div
              className="absolute inset-0 bg-primary/20 blur-xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground">{t('description')}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="relative overflow-hidden group">
            <span className="relative z-10">{t('contact')}</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </Button>

          <Button size="lg" variant="outline" className="relative overflow-hidden">
            <span className="relative z-10">{t('support')}</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </Button>
        </div>
      </motion.div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-primary/5 to-background/0" />
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

function CTAButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[color:var(--primary)] text-white font-semibold shadow-lg hover:shadow-xl transition-all"
    >
      {label}
    </Link>
  );
}

export default function AboutCTAVariants() {
  const t = useTranslations('About.cta.card');
  
  return (
    <motion.div
      className="rounded-2xl p-8 border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm"
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
        <div className="flex-1">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">{t('title')}</h3>
          <p className="text-gray-700 dark:text-gray-300">
            {t('description')}
          </p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <CTAButton href="/contact" label={t('button')} />
          <span className="text-xs text-gray-500">{t('responseTime')}</span>
        </div>
      </div>
    </motion.div>
  );
}

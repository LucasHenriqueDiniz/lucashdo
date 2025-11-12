'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';

type NavLink = {
  href: string;
  label: string;
};

interface AboutHeroNavProps {
  links: NavLink[];
  isScrolled: boolean;
  position?: 'top' | 'bottom';
}

export default function AboutHeroNav({ links, isScrolled, position = 'top' }: AboutHeroNavProps) {
  const t = useTranslations('About.hero');
  const tNav = useTranslations('Navigation');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isTop = position === 'top';

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  return (
    <>
      <motion.header
        initial={false}
        animate={
          isTop
            ? {
                position: isScrolled ? 'fixed' : 'absolute',
                top: '24px',
              }
            : {
                position: 'absolute',
                bottom: '24px',
              }
        }
        style={{
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 60,
          width: 'min(100%, 960px)',
          pointerEvents: 'auto',
        }}
      >
        <motion.nav
          className="flex items-center justify-between gap-4 rounded-full border border-white/10 bg-slate-900/70 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-white/80 shadow-lg backdrop-blur-lg transition-all md:gap-6 md:px-6 md:py-4 md:text-xs"
          animate={{
            opacity: isScrolled ? 0.95 : 1,
            scale: isScrolled ? 0.98 : 1,
            letterSpacing: isScrolled ? '0.28em' : '0.32em',
          }}
          transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
        >
          <Link
            href="/"
            aria-label={tNav('home')}
            className="flex items-center gap-2 text-sm tracking-[0.2em] text-white transition-colors hover:text-white md:gap-3"
          >
            <Image
              src="/logo.webp"
              alt={`${t('name')} Logo`}
              width={36}
              height={36}
              className="h-8 w-8 rounded-md border border-white/15 bg-white/5 object-cover md:h-9 md:w-9"
              priority
            />
            <span className="font-bold text-white md:text-base">{t('name')}</span>
          </Link>

          <div className="hidden flex-1 items-center justify-center gap-6 text-white/70 md:flex">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="relative transition-colors hover:text-white"
              >
                {link.label}
                <span className="absolute inset-x-0 -bottom-2 h-0.5 origin-center scale-x-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 transition-transform duration-200 ease-out hover:scale-x-100" />
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/contact"
              className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-5 py-2 text-white shadow-lg shadow-blue-500/20 transition-transform hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30"
            >
              {t('contact')}
            </Link>
          </div>

          <button
            type="button"
            aria-label={isDrawerOpen ? t('closeMenu') : t('openMenu')}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 md:hidden"
            onClick={() => setIsDrawerOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </motion.nav>
      </motion.header>

      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            className="fixed inset-0 z-[70] bg-slate-950/90 backdrop-blur-2xl md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="flex h-full flex-col justify-between px-6 pb-10 pt-8"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="flex items-center justify-between">
                <Link
                  href="/"
                  onClick={() => setIsDrawerOpen(false)}
                  className="flex items-center gap-2 text-sm tracking-[0.2em] text-white"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-md border border-white/15 bg-white/5 text-sm font-bold text-cyan-300">
                    LH
                  </span>
                  <span className="font-bold text-white">LUCAS HDO</span>
                </Link>
                <button
                  type="button"
                  aria-label={t('closeMenu')}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition hover:bg-white/20"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-1 flex-col justify-center gap-6">
                {links.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsDrawerOpen(false)}
                      className="flex flex-col gap-1 text-white"
                    >
                      <span className="text-xs uppercase tracking-[0.4em] text-white/50">
                        /0{index + 1}
                      </span>
                      <span className="text-3xl font-semibold">{link.label}</span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <motion.div
                className="flex flex-col gap-3"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Link
                  href="/contact"
                  onClick={() => setIsDrawerOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-3 text-lg font-semibold text-white shadow-xl shadow-blue-500/30"
                >
                  {t('contact')}
                </Link>
                <p className="text-center text-xs text-white/60">
                  {t('tagline')}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

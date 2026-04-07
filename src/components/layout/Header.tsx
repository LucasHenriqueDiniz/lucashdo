'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import {
  HiOutlineFolder,
  HiFolder,
  HiOutlineUser,
  HiUser,
  HiOutlineMail,
  HiMail,
  HiOutlineHome,
  HiHome,
} from 'react-icons/hi';
import { Menu } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { LanguageSwitcher } from '../language-switcher';
import { cn } from '@/lib/utils';
import './header.css';
import { logo } from '../../../public';

export default function Header() {
  const t = useTranslations('Navigation');
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const headerTranslateY = useTransform(scrollY, [0, 40], ['0px', '0px']);
  const headerBgOpacity = useTransform(scrollY, [0, 50], [0.4, 0.85]);
  const logoScale = useTransform(scrollY, [0, 50], [1, 0.92]);
  const headerBlur = useTransform(scrollY, [0, 50], [12, 20]);
  const borderGlowOpacity = useTransform(scrollY, [0, 30], [0, 0.8]);

  useEffect(() => {
    const checkActiveSection = () => {
      const sections = ['career', 'skills', 'projects', 'about', 'contact'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;

          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            return;
          }
        }
      }
      setActiveSection(null);
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      checkActiveSection();
    };

    let ticking = false;
    const scrollHandler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollHandler);
    return () => window.removeEventListener('scroll', scrollHandler);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-full z-50 will-change-transform"
      style={{ y: headerTranslateY }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    >
      <motion.header
        ref={headerRef}
        className="w-full will-change-transform relative"
        style={{
          height: isScrolled ? 'var(--header-height-scrolled)' : 'var(--header-height-top)',
          transition: 'height 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <motion.div
          className="absolute inset-0 -z-10 overflow-hidden"
          style={{
            backdropFilter: `blur(${headerBlur}px)`,
            WebkitBackdropFilter: `blur(${headerBlur}px)`,
            backgroundColor: isScrolled
              ? `rgba(20, 20, 24, ${headerBgOpacity})`
              : `rgba(12, 12, 12, ${headerBgOpacity})`,
            boxShadow: isScrolled
              ? '0 12px 38px rgba(0, 0, 0, 0.34), 0 0 28px rgba(1, 132, 252, 0.12)'
              : '0 0 0 rgba(0, 0, 0, 0)',
            transition:
              'box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${isScrolled ? 16 : 8}px)`,
              WebkitBackdropFilter: `blur(${isScrolled ? 16 : 8}px)`,
              background: isScrolled ? 'rgba(20, 20, 24, 0.52)' : 'rgba(12, 12, 12, 0.28)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />

          <div
            className="absolute inset-0"
            style={{
              background: isScrolled
                ? 'linear-gradient(125deg, rgba(1, 132, 252, 0.16) 0%, rgba(0, 0, 0, 0) 38%, rgba(73, 186, 214, 0.14) 90%)'
                : 'linear-gradient(125deg, rgba(1, 132, 252, 0.1) 0%, rgba(0, 0, 0, 0) 58%, rgba(73, 186, 214, 0.08) 90%)',
              opacity: isScrolled ? 0.9 : 0.6,
              transition: 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />

          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[1px]"
            style={{
              background: isScrolled
                ? 'linear-gradient(90deg, transparent, rgba(1, 132, 252, 0.7), rgba(73, 186, 214, 0.7), transparent)'
                : 'linear-gradient(90deg, transparent, rgba(1, 132, 252, 0.3), rgba(73, 186, 214, 0.3), transparent)',
              opacity: borderGlowOpacity,
            }}
          />
        </motion.div>

        <div className="container mx-auto px-4 h-full flex justify-between items-center">
          <motion.div
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            style={{ scale: logoScale }}
          >
            <Link href="/" className="flex items-center gap-3 group py-2">
              <div className="relative">
                <motion.div
                  animate={{
                    rotate: isHovering ? [0, -5, 5, -3, 3, 0] : 0,
                    scale: isHovering ? [1, 1.1, 1] : 1,
                  }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                  className="relative z-10"
                >
                  <Image
                    src={logo}
                    alt="LHDO Logo"
                    width={42}
                    height={42}
                    priority
                    className="rounded-lg shadow-lg border border-[rgba(255,255,255,0.06)]"
                  />

                  <motion.div
                    className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[color:var(--cyan)]"
                    animate={{
                      opacity: [0.5, 1, 0.5],
                      scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </motion.div>

                <motion.div
                  className="absolute -inset-1 rounded-xl z-0 opacity-0 group-hover:opacity-100"
                  style={{
                    background:
                      'radial-gradient(circle, var(--primary) 0%, var(--cyan) 50%, transparent 80%)',
                    filter: 'blur(10px)',
                  }}
                  animate={{
                    scale: isHovering ? [0.8, 1.2, 0.9] : 0.8,
                    opacity: isHovering ? [0.5, 0.8, 0.5] : 0,
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: isHovering ? Infinity : 0,
                    repeatType: 'reverse',
                  }}
                />
              </div>

              <motion.div className="overflow-hidden">
                <motion.span
                  className="font-bold text-xl hidden sm:block"
                  animate={{ y: isHovering ? [0, -2, 0] : 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ color: isHovering ? 'var(--primary)' : 'var(--foreground)' }}
                >
                  LHDO
                </motion.span>
              </motion.div>
            </Link>
          </motion.div>

          <nav
            className="hidden md:flex flex-1 justify-center overflow-x-auto hide-scrollbar"
            aria-label="Main"
          >
            <ul className="flex gap-2 md:gap-4 lg:gap-6">
              <NavItem
                href="/projects"
                label={t('projects') || 'Projetos'}
                isActive={activeSection === 'projects'}
                icon={<HiOutlineFolder className="icon" />}
                activeIcon={<HiFolder className="icon" />}
              />
              <NavItem
                href="/about"
                label={t('about') || 'Sobre'}
                isActive={activeSection === 'about'}
                icon={<HiOutlineUser className="icon" />}
                activeIcon={<HiUser className="icon" />}
              />
              <NavItem
                href="/contact"
                label={t('contact') || 'Contato'}
                isActive={activeSection === 'contact'}
                icon={<HiOutlineMail className="icon" />}
                activeIcon={<HiMail className="icon" />}
              />
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <motion.div
              className="hidden md:flex items-center gap-3 relative"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              <motion.div
                className="absolute -inset-2 rounded-lg opacity-0 hover:opacity-10"
                style={{
                  background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
                  filter: 'blur(4px)',
                }}
                transition={{ duration: 0.3 }}
              />
              <LanguageSwitcher />
            </motion.div>
            {/* Mobile Drawer */}
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
              <DrawerTrigger asChild>
                <button
                  className="md:hidden p-2 rounded-md hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
                  aria-label="Open menu"
                  type="button"
                  aria-expanded={drawerOpen}
                >
                  <Menu className="h-6 w-6" />
                </button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                        className="relative"
                      >
                        <Image
                          src={logo}
                          alt="LHDO Logo"
                          width={40}
                          height={40}
                          className="rounded-lg shadow-lg border-2 border-[var(--border)]"
                        />
                        <motion.div
                          className="absolute -inset-1 rounded-lg bg-gradient-to-r from-[var(--primary)]/30 to-[var(--cyan)]/30 blur-md -z-10"
                          animate={{
                            opacity: [0.5, 0.8, 0.5],
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        />
                      </motion.div>
                      <div>
                        <DrawerTitle>Menu</DrawerTitle>
                        <DrawerDescription className="text-sm text-[var(--muted-foreground)] mt-1">
                          Navegação
                        </DrawerDescription>
                      </div>
                    </div>
                    <DrawerClose asChild>
                      <motion.button
                        className="p-2 rounded-lg hover:bg-[var(--primary)]/10 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Close menu"
                      >
                        <svg
                          className="w-6 h-6 text-[var(--foreground)]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </motion.button>
                    </DrawerClose>
                  </div>
                </DrawerHeader>
                
                <div className="flex flex-col gap-3 px-6 py-6">
                  {/* Home Link */}
                  <DrawerClose asChild>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 }}
                      onClick={() => setDrawerOpen(false)}
                    >
                      <Link
                        href="/"
                        className={cn(
                          'group flex items-center gap-4 p-4 rounded-xl transition-all duration-300',
                          'border border-[var(--border)]',
                          !activeSection || activeSection === 'home'
                            ? 'bg-gradient-to-r from-[var(--primary)]/20 to-[var(--primary)]/10 text-[var(--primary)] shadow-lg shadow-[var(--primary)]/20'
                            : 'hover:bg-[var(--primary)]/10 hover:border-[var(--primary)]/30 hover:shadow-md'
                        )}
                        aria-current={!activeSection || activeSection === 'home' ? 'page' : undefined}
                      >
                        <motion.div
                          className={cn(
                            'p-3 rounded-lg',
                            !activeSection || activeSection === 'home'
                              ? 'bg-[var(--primary)]/20'
                              : 'bg-[var(--primary)]/10 group-hover:bg-[var(--primary)]/20'
                          )}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          {!activeSection || activeSection === 'home' ? (
                            <HiHome className="h-6 w-6 text-[var(--primary)]" />
                          ) : (
                            <HiOutlineHome className="h-6 w-6 text-[var(--muted-foreground)] group-hover:text-[var(--primary)]" />
                          )}
                        </motion.div>
                        <div className="flex-1">
                          <span className="font-semibold text-lg block">
                            {t('home') || 'Home'}
                          </span>
                          <span className="text-sm text-[var(--muted-foreground)]">
                            Voltar ao início
                          </span>
                        </div>
                        <motion.div
                          initial={{ x: -10, opacity: 0 }}
                          whileHover={{ x: 0, opacity: 1 }}
                          className="text-[var(--primary)]"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </motion.div>
                      </Link>
                    </motion.div>
                  </DrawerClose>

                  {/* Projects Link */}
                  <DrawerClose asChild>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      onClick={() => setDrawerOpen(false)}
                    >
                      <Link
                        href="/projects"
                        className={cn(
                          'group flex items-center gap-4 p-4 rounded-xl transition-all duration-300',
                          'border border-[var(--border)]',
                          activeSection === 'projects'
                            ? 'bg-gradient-to-r from-[var(--primary)]/20 to-[var(--primary)]/10 text-[var(--primary)] shadow-lg shadow-[var(--primary)]/20'
                            : 'hover:bg-[var(--primary)]/10 hover:border-[var(--primary)]/30 hover:shadow-md'
                        )}
                        aria-current={activeSection === 'projects' ? 'page' : undefined}
                      >
                        <motion.div
                          className={cn(
                            'p-3 rounded-lg',
                            activeSection === 'projects'
                              ? 'bg-[var(--primary)]/20'
                              : 'bg-[var(--primary)]/10 group-hover:bg-[var(--primary)]/20'
                          )}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          {activeSection === 'projects' ? (
                            <HiFolder className="h-6 w-6 text-[var(--primary)]" />
                          ) : (
                            <HiOutlineFolder className="h-6 w-6 text-[var(--muted-foreground)] group-hover:text-[var(--primary)]" />
                          )}
                        </motion.div>
                        <div className="flex-1">
                          <span className="font-semibold text-lg block">
                            {t('projects') || 'Projetos'}
                          </span>
                          <span className="text-sm text-[var(--muted-foreground)]">
                            Veja meus projetos
                          </span>
                        </div>
                        <motion.div
                          initial={{ x: -10, opacity: 0 }}
                          whileHover={{ x: 0, opacity: 1 }}
                          className="text-[var(--primary)]"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </motion.div>
                      </Link>
                    </motion.div>
                  </DrawerClose>

                  <DrawerClose asChild>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 }}
                      onClick={() => setDrawerOpen(false)}
                    >
                      <Link
                        href="/about"
                        className={cn(
                          'group flex items-center gap-4 p-4 rounded-xl transition-all duration-300',
                          'border border-[var(--border)]',
                          activeSection === 'about'
                            ? 'bg-gradient-to-r from-[var(--primary)]/20 to-[var(--primary)]/10 text-[var(--primary)] shadow-lg shadow-[var(--primary)]/20'
                            : 'hover:bg-[var(--primary)]/10 hover:border-[var(--primary)]/30 hover:shadow-md'
                        )}
                        aria-current={activeSection === 'about' ? 'page' : undefined}
                      >
                        <motion.div
                          className={cn(
                            'p-3 rounded-lg',
                            activeSection === 'about'
                              ? 'bg-[var(--primary)]/20'
                              : 'bg-[var(--primary)]/10 group-hover:bg-[var(--primary)]/20'
                          )}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          {activeSection === 'about' ? (
                            <HiUser className="h-6 w-6 text-[var(--primary)]" />
                          ) : (
                            <HiOutlineUser className="h-6 w-6 text-[var(--muted-foreground)] group-hover:text-[var(--primary)]" />
                          )}
                        </motion.div>
                        <div className="flex-1">
                          <span className="font-semibold text-lg block">
                            {t('about') || 'Sobre'}
                          </span>
                          <span className="text-sm text-[var(--muted-foreground)]">
                            Conheça minha história
                          </span>
                        </div>
                        <motion.div
                          initial={{ x: -10, opacity: 0 }}
                          whileHover={{ x: 0, opacity: 1 }}
                          className="text-[var(--primary)]"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </motion.div>
                      </Link>
                    </motion.div>
                  </DrawerClose>

                  <DrawerClose asChild>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      onClick={() => setDrawerOpen(false)}
                    >
                      <Link
                        href="/contact"
                        className={cn(
                          'group flex items-center gap-4 p-4 rounded-xl transition-all duration-300',
                          'border border-[var(--border)]',
                          activeSection === 'contact'
                            ? 'bg-gradient-to-r from-[var(--primary)]/20 to-[var(--primary)]/10 text-[var(--primary)] shadow-lg shadow-[var(--primary)]/20'
                            : 'hover:bg-[var(--primary)]/10 hover:border-[var(--primary)]/30 hover:shadow-md'
                        )}
                        aria-current={activeSection === 'contact' ? 'page' : undefined}
                      >
                        <motion.div
                          className={cn(
                            'p-3 rounded-lg',
                            activeSection === 'contact'
                              ? 'bg-[var(--primary)]/20'
                              : 'bg-[var(--primary)]/10 group-hover:bg-[var(--primary)]/20'
                          )}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          {activeSection === 'contact' ? (
                            <HiMail className="h-6 w-6 text-[var(--primary)]" />
                          ) : (
                            <HiOutlineMail className="h-6 w-6 text-[var(--muted-foreground)] group-hover:text-[var(--primary)]" />
                          )}
                        </motion.div>
                        <div className="flex-1">
                          <span className="font-semibold text-lg block">
                            {t('contact') || 'Contato'}
                          </span>
                          <span className="text-sm text-[var(--muted-foreground)]">
                            Entre em contato
                          </span>
                        </div>
                        <motion.div
                          initial={{ x: -10, opacity: 0 }}
                          whileHover={{ x: 0, opacity: 1 }}
                          className="text-[var(--primary)]"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </motion.div>
                      </Link>
                    </motion.div>
                  </DrawerClose>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 pt-6 border-t border-[var(--border)]"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent" />
                      <span className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
                        Idioma
                      </span>
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent" />
                    </div>
                    <LanguageSwitcher />
                  </motion.div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden"
          style={{ opacity: isScrolled ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="h-full"
            style={{
              background:
                'linear-gradient(90deg, transparent, var(--primary), var(--cyan), transparent)',
              width: '200%',
            }}
            animate={{ x: ['-100%', '0%'] }}
            transition={{
              duration: 2,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        </motion.div>
      </motion.header>
    </motion.div>
  );
}

interface NavItemProps {
  href: string;
  label: string;
  isActive?: boolean;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
}

function NavItem({ href, label, isActive = false, icon, activeIcon }: NavItemProps) {
  const [isHovering, setIsHovering] = useState(false);
  const isHighlighted = isHovering || isActive;

  const foreground = 'rgb(247, 247, 247)';
  const cyan = 'rgb(0, 200, 255)';
  const navBgInactive = 'rgba(0,0,0,0)';
  const navBgActive = 'rgba(1, 132, 252, 0.15)';

  return (
    <li>
      <Link href={href} passHref aria-current={isActive ? 'page' : undefined}>
        <motion.div
          className="header-nav-button"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          style={{ position: 'relative' }}
        >
          <motion.div className="relative flex items-center justify-center w-6 h-6">
            <motion.div
              animate={{
                opacity: isHighlighted ? 0 : 1,
                scale: isHighlighted ? 0.8 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              {icon}
            </motion.div>

            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                opacity: isHighlighted ? 1 : 0,
                scale: isHighlighted ? 1 : 0.8,
              }}
              transition={{ duration: 0.2 }}
              style={{
                color: isHighlighted ? cyan : foreground,
                transition: 'color 0.2s',
              }}
            >
              {activeIcon}
            </motion.div>
          </motion.div>

          <motion.span
            className="relative z-10 font-medium"
            animate={{
              textShadow: isHighlighted ? '0 0 8px rgba(0, 200, 255, 0.5)' : 'none',
            }}
            transition={{ duration: 0.2 }}
            style={{
              color: isHighlighted ? cyan : foreground,
              transition: 'color 0.2s',
            }}
          >
            {label}
          </motion.span>

          <motion.div
            className="absolute inset-0 rounded-md -z-10"
            initial={false}
            animate={{ opacity: isHighlighted ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            style={{
              backgroundColor: isHighlighted ? navBgActive : navBgInactive,
              transition: 'background-color 0.2s',
            }}
          />

          <motion.div
            className="absolute inset-0 -z-20 rounded-md"
            style={{
              background: isActive
                ? 'radial-gradient(circle, var(--primary) 0%, var(--cyan) 50%, transparent 80%)'
                : 'radial-gradient(circle, var(--cyan) 0%, transparent 70%)',
              filter: 'blur(6px)',
              transition: 'background 0.3s',
            }}
            initial={false}
            animate={{
              opacity: isHighlighted ? 0.4 : 0,
              scale: isHighlighted ? 1 : 0.8,
            }}
            transition={{ duration: 0.3 }}
          />

          {isActive && (
            <motion.div
              className="absolute -top-1 left-1/2 w-1.5 h-1.5 rounded-full bg-[color:var(--cyan)]"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              layoutId="activeNavDot"
            />
          )}
        </motion.div>
      </Link>
    </li>
  );
}

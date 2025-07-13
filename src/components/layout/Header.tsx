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
} from 'react-icons/hi';
import { LanguageSwitcher } from '../language-switcher';
import './header.css';

export default function Header() {
  const t = useTranslations('Navigation');
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const headerTranslateY = useTransform(scrollY, [0, 40], ['0px', '0px']);
  const headerBgOpacity = useTransform(scrollY, [0, 50], [0.4, 0.85]);
  const logoScale = useTransform(scrollY, [0, 50], [1, 0.92]);
  const headerBlur = useTransform(scrollY, [0, 50], [8, 16]);
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
      style={{ transform: `translateY(${headerTranslateY})` }}
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
            boxShadow: isScrolled ? '0 4px 30px rgba(0, 0, 0, 0.4)' : 'none',
            transition:
              'box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${isScrolled ? 16 : 8}px)`,
              WebkitBackdropFilter: `blur(${isScrolled ? 16 : 8}px)`,
              background: isScrolled ? 'rgba(20, 20, 24, 0.45)' : 'rgba(12, 12, 12, 0.25)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />

          <div
            className="absolute inset-0"
            style={{
              background: isScrolled
                ? 'linear-gradient(125deg, rgba(1, 132, 252, 0.12) 0%, rgba(0, 0, 0, 0) 40%, rgba(73, 186, 214, 0.1) 90%)'
                : 'linear-gradient(125deg, rgba(1, 132, 252, 0.08) 0%, rgba(0, 0, 0, 0) 60%, rgba(73, 186, 214, 0.06) 90%)',
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
                    src="/logo.png"
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

          <nav className="flex-1 flex justify-center overflow-x-auto hide-scrollbar">
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

          <motion.div
            className="flex items-center gap-3 relative"
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
      <Link href={href} passHref>
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

'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { LanguageSwitcher } from '../language-switcher';
import { motion, useScroll, useTransform, AnimatePresence, MotionValue } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

export default function Header() {
  const t = useTranslations('Navigation');
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Enhanced transformations based on scroll position
  const headerOpacity = useTransform(scrollY, [0, 50], [0.6, 1]);
  const headerHeight = useTransform(scrollY, [0, 50], ['5rem', '4rem']);
  const logoScale = useTransform(scrollY, [0, 50], [1, 0.95]);
  const headerBlur = useTransform(scrollY, [0, 50], ['blur(8px)', 'blur(20px)']);
  const borderGlowOpacity = useTransform(scrollY, [0, 30], [0, 0.7]);

  // Monitor sections for active state
  useEffect(() => {
    // Function to check which section is in view
    const checkActiveSection = () => {
      const sections = ['career', 'skills', 'projects', 'about', 'contact'];
      const scrollPosition = window.scrollY + 100; // Add offset for header

      // Find the section that's currently in view
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

      // If no section is active
      setActiveSection(null);
    };

    // Check scroll position for header background
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      checkActiveSection();
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      ref={headerRef}
      className="fixed top-0 w-full z-50"
      style={{
        height: headerHeight,
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Animated glow effect that follows cursor near header */}
      <motion.div
        className="absolute -bottom-[40px] w-[200px] h-[60px] rounded-full blur-[60px] pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(circle, var(--cyan) 0%, transparent 70%)',
          display: isScrolled ? 'none' : 'block',
        }}
        animate={{
          x: isHovering ? [-100, 100, -100] : 0,
          opacity: isScrolled ? 0 : [0.1, 0.2, 0.1],
        }}
        transition={{
          x: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
          opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        }}
      />

      {/* Enhanced backdrop with blur effect */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{
          backdropFilter: headerBlur,
          backgroundColor: isScrolled
            ? 'color-mix(in srgb, var(--card) 95%, transparent)'
            : 'color-mix(in srgb, rgb(12, 12, 12) 60%, transparent)',
          boxShadow: isScrolled ? '0 4px 30px rgba(0, 0, 0, 0.4)' : 'none',
        }}
      >
        {/* Additional gradient overlay */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              'linear-gradient(90deg, var(--primary) 0%, transparent 20%, var(--cyan) 70%, transparent 100%)',
            opacity: borderGlowOpacity,
          }}
        />

        {/* Animated border-bottom */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[1px]"
          style={{
            background:
              'linear-gradient(90deg, transparent, var(--primary), var(--cyan), transparent)',
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
              {/* Logo with enhanced glow effect on hover */}
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
                  className="rounded-lg shadow-lg border border-[rgba(255,255,255,0.06)]"
                />

                {/* Glowing dot animation */}
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

              {/* Enhanced glow effect under logo */}
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
                animate={{
                  y: isHovering ? [0, -2, 0] : 0,
                  color: isHovering ? 'var(--primary)' : 'var(--foreground)',
                }}
                transition={{ duration: 0.4 }}
              >
                LHDO
              </motion.span>
            </motion.div>
          </Link>
        </motion.div>

        {/* Enhanced Navigation Links */}
        <nav className="flex-1 flex justify-center overflow-x-auto hide-scrollbar">
          <ul className="flex gap-1 md:gap-3 lg:gap-6">
            <NavItem
              href="/#career"
              label={t('career') || 'Carreira'}
              isActive={activeSection === 'career'}
            />
            <NavItem
              href="/#skills"
              label={t('skills') || 'Skills'}
              isActive={activeSection === 'skills'}
            />
            <NavItem
              href="/projects"
              label={t('projects') || 'Projetos'}
              isActive={activeSection === 'projects'}
            />
            <NavItem
              href="/about"
              label={t('about') || 'Sobre'}
              isActive={activeSection === 'about'}
            />
            <NavItem
              href="/#contact"
              label={t('contact') || 'Contato'}
              isActive={activeSection === 'contact'}
            />
          </ul>
        </nav>

        {/* Language Switcher with enhanced effects */}
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

      {/* Enhanced animated accent line at bottom of header */}
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
          animate={{
            x: ['-100%', '0%'],
          }}
          transition={{
            duration: 2,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      </motion.div>
    </motion.header>
  );
}

interface NavItemProps {
  href: string;
  label: string;
  isActive?: boolean;
}

function NavItem({ href, label, isActive = false }: NavItemProps) {
  const [isHovering, setIsHovering] = useState(false);

  // Combined state for effects (either hovering or active)
  const isHighlighted = isHovering || isActive;

  return (
    <li>
      <Link href={href} passHref>
        <motion.span
          className="px-4 py-2 rounded-md inline-block relative cursor-pointer text-sm md:text-base overflow-hidden"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
        >
          {/* Dot indicator for active state */}
          {isActive && (
            <motion.div
              className="absolute -top-1 left-1/2 w-1.5 h-1.5 rounded-full bg-[color:var(--cyan)]"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              layoutId="activeNavDot"
            />
          )}

          {/* Label text with enhanced hover/active effect */}
          <motion.span
            className="relative z-10 font-medium"
            animate={{
              color: isHighlighted ? 'var(--cyan)' : 'var(--foreground)',
              textShadow: isHighlighted ? '0 0 8px rgba(0, 200, 255, 0.5)' : 'none',
            }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.span>

          {/* Enhanced animated underline with pulse effect */}
          <motion.span
            className="absolute bottom-0 left-0 right-0 h-[2px]"
            style={{
              background: 'linear-gradient(90deg, transparent, var(--cyan), transparent)',
            }}
            initial={{ width: '0%', left: '50%', x: '-50%', opacity: 0 }}
            animate={{
              width: isHighlighted ? '80%' : '0%',
              opacity: isHighlighted ? [0.5, 1, 0.5] : 0,
            }}
            transition={{
              width: { type: 'spring', stiffness: 400, damping: 30 },
              opacity: { duration: 2, repeat: isHighlighted ? Infinity : 0 },
            }}
          />

          {/* Enhanced glowing background effect */}
          <motion.div
            className="absolute inset-0 -z-10 rounded-md"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: isHighlighted ? 0.15 : 0,
              scale: isHighlighted ? 1 : 0.8,
            }}
            style={{
              background: isActive
                ? 'radial-gradient(circle, var(--primary) 0%, var(--cyan) 50%, transparent 80%)'
                : 'radial-gradient(circle, var(--cyan) 0%, transparent 70%)',
              filter: 'blur(6px)',
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.span>
      </Link>
    </li>
  );
}

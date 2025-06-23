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
  HiX,
} from 'react-icons/hi';
import { LanguageSwitcher } from '../language-switcher';

export default function Header() {
  const t = useTranslations('Navigation');
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const headerRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Transformações para animação baseada em scroll
  const headerTranslateY = useTransform(scrollY, [0, 40], ['0px', showBanner ? '-36px' : '0px']);
  const bannerOpacity = useTransform(scrollY, [0, 40], [1, 0]);
  const headerBgOpacity = useTransform(scrollY, [0, 50], [0.4, 0.85]);
  const logoScale = useTransform(scrollY, [0, 50], [1, 0.92]);
  const headerBlur = useTransform(scrollY, [0, 50], [8, 16]);
  const borderGlowOpacity = useTransform(scrollY, [0, 30], [0, 0.8]);

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

    // Check scroll position for header background and update scrolled state
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Only update banner visibility on extreme scroll changes
      // to prevent performance issues from frequent state changes
      if (window.scrollY > 60 && showBanner && !localStorage.getItem('hideBanner')) {
        setShowBanner(false);
      } else if (window.scrollY < 10 && !showBanner && !localStorage.getItem('hideBanner')) {
        setShowBanner(true);
      }

      checkActiveSection();
    };

    // Throttled scroll handler for better performance
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

    // Apply CSS class to body when banner is shown
    document.body.classList.toggle('has-banner', showBanner);

    return () => {
      window.removeEventListener('scroll', scrollHandler);
      document.body.classList.remove('has-banner');
    };
  }, [showBanner]);

  const closeBanner = () => {
    setShowBanner(false);
    // Save to localStorage to persist the choice
    localStorage.setItem('hideBanner', 'true');
  };

  // Check localStorage for banner preference on component mount
  useEffect(() => {
    const isBannerHidden = localStorage.getItem('hideBanner') === 'true';
    if (isBannerHidden) {
      setShowBanner(false);
    }
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-full z-50 will-change-transform"
      style={{
        transform: `translateY(${headerTranslateY})`,
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
    >
      {/* Construction Banner */}
      {showBanner && (
        <motion.div
          className="construction-banner w-full h-9 overflow-hidden"
          style={{
            opacity: bannerOpacity,
            willChange: 'opacity',
          }}
        >
          <div className="flex items-center justify-center h-full">
            <motion.div
              className="flex items-center px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="mr-2">✨</span>
              <span>Site em construção! Início: 20/06/2025</span>
              <motion.button
                onClick={closeBanner}
                className="ml-4 p-1 rounded-full hover:bg-white hover:bg-opacity-20 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <HiX size={16} />
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <motion.header
        ref={headerRef}
        className="w-full will-change-transform relative"
        style={{
          height: isScrolled ? 'var(--header-height-scrolled)' : 'var(--header-height-top)',
          transition: 'height 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Enhanced blur background effect */}
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
          {/* Frosted glass effect with improved blur */}
          <div
            className="absolute inset-0"
            style={{
              backdropFilter: `blur(${isScrolled ? 16 : 8}px)`,
              WebkitBackdropFilter: `blur(${isScrolled ? 16 : 8}px)`,
              background: isScrolled ? 'rgba(20, 20, 24, 0.45)' : 'rgba(12, 12, 12, 0.25)',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />

          {/* Subtle noise pattern for texture */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'url(/noise.png)',
              backgroundSize: '200px',
            }}
          />

          {/* Improved gradient background */}
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

          {/* Subtle moving gradient - simplified */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundSize: '200% 200%',
              backgroundPosition: '0% 0%',
              backgroundImage:
                'radial-gradient(circle at 30% 20%, rgba(1, 132, 252, 0.1), transparent 50%), radial-gradient(circle at 70% 60%, rgba(73, 186, 214, 0.05), transparent 50%)',
              animation: 'gradientMove 15s ease-in-out infinite alternate',
            }}
          />

          {/* Animated border-bottom with improved appearance */}
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
          {/* Logo section */}
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

  // Combined state for effects (either hovering or active)
  const isHighlighted = isHovering || isActive;

  return (
    <li>
      <Link href={href} passHref>
        <motion.div
          className="nav-button"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Icon container with transition effect */}
          <motion.div className="relative flex items-center justify-center w-6 h-6">
            {/* Default icon */}
            <motion.div
              animate={{
                opacity: isHighlighted ? 0 : 1,
                scale: isHighlighted ? 0.8 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              {icon}
            </motion.div>

            {/* Active/hover icon */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                opacity: isHighlighted ? 1 : 0,
                scale: isHighlighted ? 1 : 0.8,
                color: 'var(--cyan)',
              }}
              transition={{ duration: 0.2 }}
            >
              {activeIcon}
            </motion.div>
          </motion.div>

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

          {/* Background fill animation */}
          <motion.div
            className="absolute inset-0 rounded-md -z-10"
            initial={{ opacity: 0 }}
            animate={{
              opacity: isHighlighted ? 0.15 : 0,
              backgroundColor: isHighlighted ? 'var(--primary)' : 'transparent',
            }}
            transition={{ duration: 0.2 }}
          />

          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 -z-20 rounded-md"
            style={{
              background: isActive
                ? 'radial-gradient(circle, var(--primary) 0%, var(--cyan) 50%, transparent 80%)'
                : 'radial-gradient(circle, var(--cyan) 0%, transparent 70%)',
              filter: 'blur(6px)',
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: isHighlighted ? 0.4 : 0,
              scale: isHighlighted ? 1 : 0.8,
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Active indicator dot */}
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

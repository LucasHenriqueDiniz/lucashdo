'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  RiArrowRightUpLine,
  RiDiscordFill,
  RiGithubFill,
  RiLinkedinFill,
  RiMailLine,
  RiMessage2Line,
} from 'react-icons/ri';
import { Project, projects } from '@/constants/projects';
import { ContactLinks, ContactNames } from '@/constants/contacts';

const ContactButton = memo(() => {
  const [isHovered, setIsHovered] = useState(false);
  const t = useTranslations('Footer');

  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push('/contact');
  }, [router]);

  return (
    <motion.button
      className="relative w-full md:w-auto py-3 px-6 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--cyan)] text-white font-medium shadow-lg hover:shadow-xl transition-shadow duration-300 text-sm md:text-base"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <span className="flex items-center justify-center gap-2">
        <motion.span
          animate={{ x: isHovered ? -2 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <RiArrowRightUpLine size={18} />
        </motion.span>
        <span>{t('makeContact')}</span>
      </span>
    </motion.button>
  );
});

ContactButton.displayName = 'ContactButton';

const SocialLink = memo(
  ({
    href,
    icon: Icon,
    label,
    hoverColor = 'var(--primary)',
    isHovered,
    setHovered,
  }: {
    href: string;
    icon: React.ElementType;
    label: string;
    hoverColor?: string;
    isHovered: boolean;
    setHovered: (name: string | null) => void;
  }) => {
    const handleMouseEnter = useCallback(() => {
      setHovered(label);
    }, [label, setHovered]);

    const handleMouseLeave = useCallback(() => {
      setHovered(null);
    }, [setHovered]);

    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center gap-2 group"
        whileHover={{ scale: 1.02, x: 2 }}
        whileTap={{ scale: 0.98 }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative">
          <motion.div
            className="p-2 rounded-full relative z-10"
            style={{
              backgroundColor: isHovered
                ? `color-mix(in srgb, ${hoverColor} 20%, transparent)`
                : 'transparent',
              transition: 'background-color 0.2s',
            }}
          >
            <Icon className="w-6 h-6 transition-all duration-300" />
          </motion.div>
        </div>

        <div className="relative overflow-hidden">
          <motion.span
            className="text-muted-foreground"
            style={{
              color: isHovered ? hoverColor : 'var(--muted-foreground)',
              transition: 'color 0.2s',
            }}
          >
            {label}
          </motion.span>

          <motion.div
            className="absolute bottom-0 left-0 h-[1px] w-full"
            style={{ background: hoverColor }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </motion.a>
    );
  }
);

SocialLink.displayName = 'SocialLink';

const FooterLink = memo(({ href, label }: { href: string; label: string }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <li>
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ x: 2 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      >
        <Link href={href} className="relative flex items-center gap-3 group">
          <motion.span
            className="w-2 h-2 rounded-full"
            animate={{ scale: isHovered ? 1.2 : 1 }}
            style={{
              backgroundColor: isHovered ? 'var(--primary)' : 'var(--muted-foreground)',
              transition: 'background-color 0.2s',
            }}
            transition={{ duration: 0.2 }}
          />

          <motion.span
            style={{
              color: isHovered ? 'var(--primary)' : 'var(--muted-foreground)',
              transition: 'color 0.2s',
            }}
          >
            {label}
          </motion.span>

          <motion.div
            className="text-[var(--primary)]"
            initial={{ opacity: 0, x: -3 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -3 }}
          >
            <RiArrowRightUpLine size={14} />
          </motion.div>
        </Link>
      </motion.div>
    </li>
  );
});

FooterLink.displayName = 'FooterLink';

const Footer = memo(() => {
  const t = useTranslations('Footer');
  const currentYear = new Date().getUTCFullYear();
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  useEffect(() => {
    const featured = projects.filter(project => project.featured).slice(0, 4);
    setFeaturedProjects(featured);
  }, []);

  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ['0 1', '1 1'],
  });

  const patternOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 0.08]);

  const handleSetHoveredIcon = useCallback((name: string | null) => {
    setHoveredIcon(name);
  }, []);

  const socialLinks = useMemo(
    () => [
      {
        href: ContactLinks.github,
        icon: RiGithubFill,
        label: ContactNames.github,
        hoverColor: 'var(--primary)',
      },
      {
        href: ContactLinks.linkedin,
        icon: RiLinkedinFill,
        label: ContactNames.linkedin,
        hoverColor: 'var(--blue)',
      },
      {
        href: `https://discord.com/users/${ContactLinks.discord}`,
        icon: RiDiscordFill,
        label: ContactNames.discord,
        hoverColor: 'var(--cyan)',
      },
      {
        href: `mailto:${ContactLinks.email}`,
        icon: RiMailLine,
        label: ContactNames.email,
        hoverColor: 'var(--green)',
      },
    ],
    []
  );

  return (
    <motion.footer
      ref={footerRef}
      className="relative pt-12 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, var(--cyan) 50%, transparent 100%)',
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 0.5 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
      />

      <div className="absolute inset-0 -z-10 bg-[rgb(12,12,12)]">
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25px 25px, var(--cyan) 1%, transparent 0%), radial-gradient(circle at 75px 75px, var(--primary) 1%, transparent 0%)',
            backgroundSize: '100px 100px',
            opacity: patternOpacity,
          }}
        />

        <motion.div
          className="absolute inset-0 blur-3xl"
          style={{
            background:
              'radial-gradient(circle at 20% 80%, rgba(0, 153, 255, 0.05) 0%, transparent 30%), radial-gradient(circle at 80% 10%, rgba(0, 200, 255, 0.05) 0%, transparent 30%)',
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            onMouseEnter={() => setHoveredSection('projects')}
            onMouseLeave={() => setHoveredSection(null)}
            className="backdrop-blur-sm bg-[rgba(25,25,30,0.4)] p-4 md:p-6 rounded-xl border border-[rgba(255,255,255,0.08)] hover:border-[rgba(1,132,252,0.3)] transition-all duration-300 relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
            />
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 relative inline-block z-10">
              {t('projectsTitle') || 'Projetos em destaque'}
              <motion.span
                className="absolute -bottom-1 left-0 h-[3px] bg-gradient-to-r from-[var(--primary)] to-[var(--cyan)] rounded-full"
                initial={{ scaleX: 0, transformOrigin: 'left' }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </h3>
            <ul className="space-y-2 md:space-y-3 relative z-10">
              {featuredProjects.map(project => (
                <FooterLink
                  key={project.id}
                  href={`/projects/${project.id}`}
                  label={project.title}
                />
              ))}
              <FooterLink href="/projects" label="Ver todos →" />
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
            onMouseEnter={() => setHoveredSection('links')}
            onMouseLeave={() => setHoveredSection(null)}
            className="backdrop-blur-sm bg-[rgba(25,25,30,0.4)] p-4 md:p-6 rounded-xl border border-[rgba(255,255,255,0.08)] hover:border-[rgba(1,132,252,0.3)] transition-all duration-300 relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-[var(--cyan)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
            />
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 relative inline-block z-10">
              {t('links')}
              <motion.span
                className="absolute -bottom-1 left-0 h-[3px] bg-gradient-to-r from-[var(--primary)] to-[var(--cyan)] rounded-full"
                initial={{ scaleX: 0, transformOrigin: 'left' }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
              />
            </h3>
            <ul className="space-y-2 md:space-y-4 relative z-10">
              <FooterLink href="/" label={t('home')} />
              <FooterLink href="/about" label={t('about')} />
              <FooterLink href="/projects" label={t('projects')} />
              <FooterLink href="/blog" label={t('blog')} />
              <FooterLink href="/contact" label={t('contact')} />
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
            onMouseEnter={() => setHoveredSection('connect')}
            onMouseLeave={() => setHoveredSection(null)}
            className="backdrop-blur-sm bg-[rgba(25,25,30,0.4)] p-4 md:p-6 rounded-xl border border-[rgba(255,255,255,0.08)] hover:border-[rgba(1,132,252,0.3)] transition-all duration-300 relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={false}
            />
            <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 relative inline-block z-10">
              {t('connect')}
              <motion.span
                className="absolute -bottom-1 left-0 h-[3px] bg-gradient-to-r from-[var(--primary)] to-[var(--cyan)] rounded-full"
                initial={{ scaleX: 0, transformOrigin: 'left' }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
              />
            </h3>
            <div className="flex flex-col space-y-2 md:space-y-4 relative z-10">
              {socialLinks.map(link => (
                <SocialLink
                  key={link.label}
                  href={link.href}
                  icon={link.icon}
                  label={link.label}
                  hoverColor={link.hoverColor}
                  isHovered={hoveredIcon === link.label}
                  setHovered={handleSetHoveredIcon}
                />
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          className="mt-8 md:mt-12 relative backdrop-blur-sm bg-[rgba(30,30,40,0.5)] p-4 md:p-8 rounded-2xl border border-[rgba(255,255,255,0.1)] overflow-hidden group"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          whileHover={{ scale: 1.01 }}
        >
          <motion.div
            className="absolute -inset-[2px] -z-10 rounded-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"
            style={{
              background:
                'linear-gradient(120deg, var(--primary), var(--cyan), var(--accent), var(--primary))',
              backgroundSize: '200% 200%',
            }}
            animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
            }}
          />

          <motion.div
            className="absolute top-0 left-0 w-full h-full opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, var(--primary) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          <div className="flex flex-col md:flex-row items-center md:justify-between gap-4 md:gap-8 relative">
            <div className="flex items-center gap-4 md:gap-6 z-10">
              <div className="relative flex items-center justify-center w-10 h-10 md:w-14 md:h-14">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] to-[var(--cyan)] rounded-full opacity-20 blur-xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <motion.div
                  className="relative z-20"
                  animate={{ rotate: [0, 2, -2, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <RiMessage2Line size={24} className="md:w-8 md:h-8 text-[var(--cyan)]" />
                </motion.div>
              </div>

              <div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-center md:text-left">
                  {t('contactTitle')}
                </h3>
                <p className="text-sm text-[var(--muted-foreground)] mt-1 hidden md:block">
                  Vamos criar algo incrível juntos
                </p>
              </div>
            </div>

            <div className="relative w-full md:w-auto">
              <ContactButton />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="relative mt-8 md:mt-12 pt-6 md:pt-8 text-center text-xs md:text-sm text-muted-foreground overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.div
            className="absolute top-0 left-0 w-full h-px"
            style={{
              background:
                'linear-gradient(90deg, transparent, var(--primary), var(--cyan), transparent)',
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 0.5 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />

          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 py-4 md:py-6">
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <span className="font-medium text-[var(--foreground)]">
                Lucas Henrique Diniz Ostroski
              </span>
              <motion.span
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
                className="inline-flex"
              ></motion.span>
            </motion.div>

            <div className="hidden md:block w-px h-4 bg-[var(--border)]" />

            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <span className="text-[var(--muted-foreground)]">
                {currentYear} • Desenvolvedor Full Stack
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;

'use client';

import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  RiArrowRightUpLine,
  RiChat2Line,
  RiChatSettingsLine,
  RiChatSmile3Line,
  RiDiscussLine,
  RiGithubFill,
  RiHeartFill,
  RiLinkedinFill,
  RiMailLine,
  RiMessage2Line,
  RiMessage3Line,
  RiMoreLine,
  RiTwitterXFill,
} from 'react-icons/ri';
import { Project, projects } from '@/constants/projects';

// Contact button component with expanding icon animation
const ContactButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  // Handle click to navigate to contact page
  const handleClick = () => {
    router.push('/#contact');
  };

  return (
    <motion.div
      className="relative flex justify-center items-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main button */}
      <motion.button
        className="relative py-3 px-6 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--cyan)] text-white font-medium z-20"
        onClick={handleClick}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.2 }}
      >
        {/* Pulsing button animation */}
        <motion.div
          className="absolute inset-0 rounded-xl -z-10"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isHovered ? [0.4, 0.2, 0.4] : 0,
            scale: isHovered ? [1, 1.08, 1] : 1,
          }}
          style={{
            background: 'linear-gradient(120deg, var(--primary), var(--cyan))',
            filter: 'blur(12px)',
          }}
          transition={{
            opacity: { repeat: Infinity, duration: 2, ease: 'easeInOut' },
            scale: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' },
          }}
        />

        <motion.span className="flex items-center gap-2">
          <span>Entrar em contato</span>
          <motion.span
            animate={{
              x: isHovered ? 3 : 0,
              rotate: isHovered ? 30 : 0,
            }}
            transition={{ type: 'spring', stiffness: 250, damping: 20 }}
          >
            <RiArrowRightUpLine size={18} />
          </motion.span>
        </motion.span>
      </motion.button>

      {/* Multiple expanding icons animation - appears when hovering */}
      <AnimatePresence>
        {isHovered && (
          <>
            {/* Main large expanding icon */}
            <motion.div
              className="absolute pointer-events-none z-0"
              initial={{ opacity: 0, scale: 0.2, right: 0, top: 0 }}
              animate={{
                opacity: 0.15,
                scale: 6,
                right: '-80%',
                top: '-150%',
                rotate: [0, 15],
              }}
              exit={{ opacity: 0, scale: 0.2 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <RiChat2Line size={64} className="text-[var(--cyan)]" />
            </motion.div>

            {/* Second smaller icon expanding in different direction */}
            <motion.div
              className="absolute pointer-events-none z-0"
              initial={{ opacity: 0, scale: 0.2, right: 0, top: 0 }}
              animate={{
                opacity: 0.1,
                scale: 3,
                left: '-100%',
                top: '10%',
                rotate: [-10, 5],
              }}
              exit={{ opacity: 0, scale: 0.2 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            >
              <RiChatSmile3Line size={48} className="text-[var(--primary)]" />
            </motion.div>

            {/* Third smaller expanding icon */}
            <motion.div
              className="absolute pointer-events-none z-0"
              initial={{ opacity: 0, scale: 0.2, right: 0, top: 0 }}
              animate={{
                opacity: 0.07,
                scale: 4.5,
                right: '20%',
                bottom: '-120%',
                rotate: [10, -5],
              }}
              exit={{ opacity: 0, scale: 0.2 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
            >
              <RiMessage3Line size={32} className="text-[var(--accent)]" />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Social link component with enhanced animations
const SocialLink = ({
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
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative flex items-center gap-2 group"
      whileHover={{ scale: 1.03, x: 3 }}
      whileTap={{ scale: 0.98 }}
      onMouseEnter={() => setHovered(label)}
      onMouseLeave={() => setHovered(null)}
    >
      {/* Icon container with shine effect */}
      <div className="relative">
        <motion.div
          className="p-2 rounded-full relative z-10"
          animate={{
            backgroundColor: isHovered
              ? `color-mix(in srgb, ${hoverColor} 20%, transparent)`
              : 'transparent',
          }}
        >
          <Icon className="w-6 h-6 transition-all duration-500" />
        </motion.div>

        {/* Animated glow effect */}
        <motion.div
          className="absolute -inset-1 rounded-full blur-md z-0"
          animate={{
            opacity: isHovered ? 0.5 : 0,
            scale: isHovered ? [1, 1.15, 1] : 1,
          }}
          style={{
            background: `radial-gradient(circle, ${hoverColor} 0%, transparent 70%)`,
          }}
          transition={{
            opacity: { duration: 0.2 },
            scale: {
              repeat: isHovered ? Infinity : 0,
              duration: 1.5,
              ease: 'easeInOut',
            },
          }}
        />
      </div>

      {/* Label with animated underline */}
      <div className="relative overflow-hidden">
        <motion.span
          className="text-muted-foreground"
          animate={{
            color: isHovered ? hoverColor : 'var(--muted-foreground)',
          }}
        >
          {label}
        </motion.span>

        <motion.div
          className="absolute bottom-0 left-0 h-[1px] w-full"
          style={{ background: hoverColor }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.a>
  );
};

export default function Footer() {
  const t = useTranslations('Footer');
  const currentYear = new Date().getFullYear();
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);

  // Get featured projects from projects.ts
  useEffect(() => {
    const featured = projects.filter(project => project.featured).slice(0, 4);
    setFeaturedProjects(featured);
  }, []);

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ['0 1', '1 1'],
  });

  // Transform values based on scroll
  const patternOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 0.1]);

  return (
    <motion.footer
      ref={footerRef}
      className="relative mt-24 pt-12 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Animated entrance line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, var(--cyan) 50%, transparent 100%)',
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 0.7 }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
      />

      {/* Background with enhanced gradients and patterns */}
      <div className="absolute inset-0 -z-10 bg-[rgb(12,12,12)]">
        {/* Animated grid pattern */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 25px 25px, var(--cyan) 2%, transparent 0%), radial-gradient(circle at 75px 75px, var(--primary) 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            opacity: patternOpacity,
          }}
          animate={{ backgroundPosition: ['0px 0px', '100px 100px'] }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: 'linear',
            repeatDelay: 0,
          }}
        />

        {/* Animated glow spots */}
        <motion.div
          className="absolute inset-0 blur-3xl"
          style={{
            background:
              'radial-gradient(circle at 20% 80%, rgba(0, 153, 255, 0.08) 0%, transparent 30%), radial-gradient(circle at 80% 10%, rgba(0, 200, 255, 0.08) 0%, transparent 30%)',
          }}
          animate={{
            opacity: [0.4, 0.7, 0.4],
            backgroundPosition: ['0% 0%', '5% 5%', '0% 0%'],
          }}
          transition={{
            opacity: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
            backgroundPosition: { duration: 12, repeat: Infinity, ease: 'easeInOut' },
          }}
        />

        {/* Horizontal divider line with animation */}
        <motion.div
          className="absolute top-0 inset-x-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, var(--cyan) 50%, transparent 100%)',
          }}
          animate={{
            opacity: [0.2, 0.5, 0.2],
            scaleX: [0.95, 1, 0.95],
          }}
          transition={{
            opacity: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
            scaleX: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="backdrop-blur-sm bg-[rgba(25,25,30,0.3)] p-6 rounded-xl border border-[rgba(255,255,255,0.06)]"
          >
            <h3 className="text-xl font-semibold mb-4 relative inline-block">
              {t('projectsTitle') || 'Projetos em destaque'}
              <motion.span
                className="absolute -bottom-1 left-0 h-[3px] bg-gradient-to-r from-[var(--primary)] to-[var(--cyan)]"
                initial={{ scaleX: 0, transformOrigin: 'left' }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              ></motion.span>
            </h3>
            <ul className="space-y-3">
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
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="backdrop-blur-sm bg-[rgba(25,25,30,0.3)] p-6 rounded-xl border border-[rgba(255,255,255,0.06)]"
          >
            <h3 className="text-xl font-semibold mb-4 relative inline-block">
              {t('links')}
              <motion.span
                className="absolute -bottom-1 left-0 h-[3px] bg-gradient-to-r from-[var(--primary)] to-[var(--cyan)]"
                initial={{ scaleX: 0, transformOrigin: 'left' }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
              ></motion.span>
            </h3>
            <ul className="space-y-4">
              <FooterLink href="/" label={t('home')} />
              <FooterLink href="/about" label={t('about')} />
              <FooterLink href="/projects" label={t('projects')} />
              <FooterLink href="/blog" label={t('blog')} />
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
            className="backdrop-blur-sm bg-[rgba(25,25,30,0.3)] p-6 rounded-xl border border-[rgba(255,255,255,0.06)]"
          >
            <h3 className="text-xl font-semibold mb-4 relative inline-block">
              {t('connect')}
              <motion.span
                className="absolute -bottom-1 left-0 h-[3px] bg-gradient-to-r from-[var(--primary)] to-[var(--cyan)]"
                initial={{ scaleX: 0, transformOrigin: 'left' }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
              ></motion.span>
            </h3>
            <div className="flex flex-col space-y-4">
              <SocialLink
                href="https://github.com/yourusername"
                icon={RiGithubFill}
                label="GitHub"
                hoverColor="var(--primary)"
                isHovered={hoveredIcon === 'GitHub'}
                setHovered={setHoveredIcon}
              />

              <SocialLink
                href="https://linkedin.com/in/yourusername"
                icon={RiLinkedinFill}
                label="LinkedIn"
                hoverColor="var(--blue)"
                isHovered={hoveredIcon === 'LinkedIn'}
                setHovered={setHoveredIcon}
              />

              <SocialLink
                href="https://twitter.com/yourusername"
                icon={RiTwitterXFill}
                label="Twitter"
                hoverColor="var(--cyan)"
                isHovered={hoveredIcon === 'Twitter'}
                setHovered={setHoveredIcon}
              />

              <SocialLink
                href="mailto:your.email@example.com"
                icon={RiMailLine}
                label="Email"
                hoverColor="var(--green)"
                isHovered={hoveredIcon === 'Email'}
                setHovered={setHoveredIcon}
              />
            </div>
          </motion.div>
        </div>

        {/* Enhanced contact call to action section */}
        <motion.div
          className="mt-12 relative backdrop-blur-sm bg-[rgba(30,30,40,0.4)] p-8 rounded-2xl border border-[rgba(255,255,255,0.08)] overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          whileHover="hovered"
        >
          {/* "Etc" icon decorative element with rotation and pulse */}
          <motion.div
            className="absolute top-4 right-4 opacity-20 pointer-events-none"
            variants={{
              normal: { rotate: 0, scale: 1 },
              hovered: { rotate: 90, scale: [1, 1.2, 1] },
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <RiMoreLine size={28} className="text-[var(--cyan)]" />
          </motion.div>

          {/* Additional chat icons in background */}
          <motion.div
            className="absolute top-6 left-[75%] opacity-10 pointer-events-none"
            variants={{
              normal: { rotate: 0, y: 0, opacity: 0.05 },
              hovered: { rotate: [-10, 10, -5], y: [0, -8, 0], opacity: 0.15 },
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <RiChatSettingsLine size={24} className="text-[var(--primary)]" />
          </motion.div>

          <motion.div
            className="absolute bottom-8 left-[60%] opacity-10 pointer-events-none"
            variants={{
              normal: { rotate: 0, opacity: 0.05 },
              hovered: { rotate: [5, -5, 5], opacity: 0.2 },
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <RiDiscussLine size={20} className="text-[var(--accent)]" />
          </motion.div>

          {/* Background gradient animation */}
          <motion.div
            className="absolute -inset-[1px] -z-10 rounded-2xl opacity-30"
            style={{
              background:
                'linear-gradient(120deg, var(--primary), var(--cyan), var(--accent), var(--primary))',
              backgroundSize: '200% 200%',
            }}
            animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
            }}
          />

          {/* Particle effect on hover - multiple small dots */}
          <motion.div
            className="absolute inset-0 -z-5 overflow-hidden rounded-2xl pointer-events-none"
            variants={{
              normal: { opacity: 0 },
              hovered: { opacity: 1 },
            }}
          >
            {/* Creating 5 particle elements */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-[var(--cyan)] opacity-30"
                initial={{
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                  scale: 0,
                }}
                variants={{
                  normal: { scale: 0, opacity: 0 },
                  hovered: {
                    scale: [0, 0.8, 0],
                    opacity: [0, 0.7, 0],
                    x: [`${20 + Math.random() * 60}%`, `${20 + Math.random() * 60}%`],
                    y: [`${20 + Math.random() * 60}%`, `${20 + Math.random() * 60}%`],
                  },
                }}
                transition={{
                  duration: 2 + i,
                  repeat: Infinity,
                  delay: i * 0.6,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>

          <div className="flex items-center justify-between gap-8 relative">
            <div className="flex items-center gap-6 z-10">
              {/* Elegante container de ícone com animações fluidas */}
              <div className="relative flex items-center justify-center w-14 h-14">
                {/* Base glow ring animado */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, var(--cyan) 0%, transparent 70%)',
                    filter: 'blur(8px)',
                  }}
                  variants={{
                    normal: { opacity: 0.2, scale: 1 },
                    hovered: { opacity: [0.2, 0.5, 0.2], scale: [1, 1.08, 1] },
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />

                {/* Ícone principal com animação de pulso */}
                <motion.div
                  className="relative z-20"
                  variants={{
                    normal: { rotate: 0 },
                    hovered: { rotate: [0, 4, -4, 0] },
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <RiMessage2Line size={32} className="text-[var(--cyan)]" />
                </motion.div>

                {/* Círculos concêntricos animados */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-[var(--cyan)] z-10"
                  style={{ opacity: 0.5 }}
                  variants={{
                    normal: { scale: 0.8, opacity: 0 },
                    hovered: { scale: [0.8, 1.15, 0.8], opacity: [0, 0.4, 0] },
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />

                {/* Partículas que surgem do ícone */}
                <AnimatePresence>
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={`particle-${i}`}
                      className="absolute w-2 h-2 rounded-full bg-[var(--cyan)]"
                      variants={{
                        normal: { opacity: 0 },
                        hovered: { opacity: 0.7 },
                      }}
                      initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                      animate={{
                        x: [0, (i % 2 === 0 ? 15 : -15) * (i + 1)],
                        y: [0, -12 * (i + 1)],
                        scale: [0, 0.8, 0],
                        opacity: [0, 0.6, 0],
                      }}
                      transition={{
                        duration: 1.2 + i * 0.4,
                        repeat: Infinity,
                        delay: i * 0.8,
                        repeatDelay: i * 0.4,
                      }}
                    />
                  ))}
                </AnimatePresence>

                {/* Ícone fantasma que se duplica na animação */}
                <motion.div
                  className="absolute z-10"
                  initial={{ opacity: 0, scale: 1 }}
                  variants={{
                    normal: { opacity: 0, scale: 1, x: 0, y: 0 },
                    hovered: {
                      opacity: [0, 0.25, 0],
                      scale: [1, 1.3, 1],
                      x: [0, 8, 0],
                      y: [0, -8, 0],
                    },
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    repeatDelay: 2,
                    ease: 'easeInOut',
                  }}
                >
                  <RiMessage2Line size={32} className="text-[var(--primary)]" />
                </motion.div>
              </div>

              {/* Título central - agora com animação mais sutil */}
              <motion.h3
                className="text-xl md:text-2xl font-semibold"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: 0.5,
                  y: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
                }}
                variants={{
                  normal: { y: 0 },
                  hovered: { y: [0, -2, 0] },
                }}
              >
                {t('contactTitle') || 'Vamos trabalhar juntos?'}
              </motion.h3>
            </div>

            {/* Contact button com glow aprimorado */}
            <div className="relative">
              <motion.div
                className="absolute -inset-1 rounded-xl opacity-0"
                variants={{
                  normal: { opacity: 0, scale: 1 },
                  hovered: { opacity: [0.4, 0.7, 0.4], scale: [1, 1.05, 1] },
                }}
                transition={{
                  opacity: { duration: 1.5, repeat: Infinity },
                  scale: { duration: 2, repeat: Infinity },
                }}
                style={{
                  background: 'linear-gradient(120deg, var(--cyan), var(--primary))',
                  filter: 'blur(4px)',
                }}
              />
              <div className="relative z-10">
                <ContactButton />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced copyright section with animations */}
        <motion.div
          className="relative mt-12 pt-8 text-center text-sm text-muted-foreground overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Animated separator line */}
          <motion.div
            className="absolute top-0 left-0 w-full h-px"
            style={{
              background:
                'linear-gradient(90deg, transparent, var(--primary), var(--cyan), transparent)',
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 0.7 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />

          <div className="flex items-center justify-center gap-2 py-4">
            <span>&copy; {currentYear} Lucas</span>
            <motion.span
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.15, 1],
              }}
              transition={{
                rotate: { repeat: Infinity, duration: 1.5, repeatDelay: 3 },
                scale: { repeat: Infinity, duration: 0.8, repeatDelay: 3 },
              }}
              className="inline-flex"
            >
              <RiHeartFill className="text-red-500" />
            </motion.span>
            <span>{t('rightsReserved')}</span>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}

// Helper component for footer links with hover animation
function FooterLink({ href, label }: { href: string; label: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <li>
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ x: 3 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      >
        <Link href={href} className="relative flex items-center gap-3 group">
          {/* Animated indicator dot */}
          <motion.span
            className="w-2 h-2 rounded-full"
            animate={{
              backgroundColor: isHovered ? 'var(--primary)' : 'var(--muted-foreground)',
              scale: isHovered ? [1, 1.3, 1] : 1,
            }}
            transition={{
              scale: { duration: 0.4, ease: 'easeOut' },
              backgroundColor: { duration: 0.2 },
            }}
          />

          {/* Label with color transition */}
          <motion.span
            animate={{
              color: isHovered ? 'var(--primary)' : 'var(--muted-foreground)',
            }}
          >
            {label}
          </motion.span>

          {/* Subtle arrow that appears on hover */}
          <motion.div
            className="text-[var(--primary)]"
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -5 }}
          >
            <RiArrowRightUpLine size={14} />
          </motion.div>
        </Link>
      </motion.div>
    </li>
  );
}

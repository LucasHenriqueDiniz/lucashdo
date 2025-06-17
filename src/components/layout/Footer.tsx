'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  RiGithubFill,
  RiLinkedinFill,
  RiTwitterXFill,
  RiMailLine,
  RiArrowRightUpLine,
  RiHeartFill,
  RiSendPlaneFill,
} from 'react-icons/ri';
import { useState, useRef } from 'react';

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
      whileHover={{ scale: 1.05, x: 5 }}
      whileTap={{ scale: 0.97 }}
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
            opacity: isHovered ? 0.6 : 0,
            scale: isHovered ? [1, 1.2, 1] : 1,
          }}
          style={{
            background: `radial-gradient(circle, ${hoverColor} 0%, transparent 70%)`,
          }}
          transition={{
            scale: {
              repeat: isHovered ? Infinity : 0,
              duration: 2,
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
          initial={{ scaleX: 0, originX: 0 }}
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
  const [emailInputFocus, setEmailInputFocus] = useState(false);
  const footerRef = useRef<HTMLDivElement>(null);

  // Scroll animations
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ['0 1', '1 1'],
  });

  // Transform values based on scroll
  const patternOpacity = useTransform(scrollYProgress, [0, 0.5], [0, 0.1]);
  const lineWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <motion.footer
      ref={footerRef}
      className="relative mt-24 pt-12 overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated entrance line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, var(--cyan) 50%, transparent 100%)',
          width: lineWidth,
        }}
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
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        />

        {/* Animated glow spots */}
        <motion.div
          className="absolute inset-0 blur-3xl"
          style={{
            background:
              'radial-gradient(circle at 20% 80%, rgba(0, 153, 255, 0.08) 0%, transparent 30%), radial-gradient(circle at 80% 10%, rgba(0, 200, 255, 0.08) 0%, transparent 30%)',
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
            backgroundPosition: ['0% 0%', '10% 10%', '0% 0%'],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Horizontal divider line with animation */}
        <motion.div
          className="absolute top-0 inset-x-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, var(--cyan) 50%, transparent 100%)',
          }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="backdrop-blur-sm bg-[rgba(25,25,30,0.3)] p-6 rounded-xl border border-[rgba(255,255,255,0.06)]"
          >
            <h3 className="text-xl font-semibold mb-4 relative inline-block">
              {t('aboutTitle')}
              <motion.span
                className="absolute -bottom-1 left-0 h-[3px] bg-gradient-to-r from-[var(--primary)] to-[var(--cyan)]"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.8 }}
              ></motion.span>
            </h3>
            <p className="text-muted-foreground leading-relaxed">{t('aboutText')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="backdrop-blur-sm bg-[rgba(25,25,30,0.3)] p-6 rounded-xl border border-[rgba(255,255,255,0.06)]"
          >
            <h3 className="text-xl font-semibold mb-4 relative inline-block">
              {t('links')}
              <motion.span
                className="absolute -bottom-1 left-0 h-[3px] bg-gradient-to-r from-[var(--primary)] to-[var(--cyan)]"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8 }}
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
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="backdrop-blur-sm bg-[rgba(25,25,30,0.3)] p-6 rounded-xl border border-[rgba(255,255,255,0.06)]"
          >
            <h3 className="text-xl font-semibold mb-4 relative inline-block">
              {t('connect')}
              <motion.span
                className="absolute -bottom-1 left-0 h-[3px] bg-gradient-to-r from-[var(--primary)] to-[var(--cyan)]"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8 }}
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

        {/* Newsletter subscription - New section */}
        <motion.div
          className="mt-12 relative backdrop-blur-sm bg-[rgba(30,30,40,0.4)] p-8 rounded-2xl border border-[rgba(255,255,255,0.08)]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.div
            className="absolute -inset-[1px] -z-10 rounded-2xl opacity-30"
            style={{
              background:
                'linear-gradient(120deg, var(--primary), var(--cyan), var(--accent), var(--primary))',
              backgroundSize: '200% 200%',
            }}
            animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
            transition={{ duration: 10, repeat: Infinity, repeatType: 'mirror' }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <motion.h3
                className="text-xl md:text-2xl font-semibold mb-2"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {t('newsletterTitle') || 'Subscribe to my newsletter'}
              </motion.h3>
              <motion.p
                className="text-muted-foreground"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                {t('newsletterText') || 'Get updates on my latest projects and tech articles.'}
              </motion.p>
            </div>

            <div>
              <div className="relative">
                <motion.input
                  type="email"
                  placeholder={t('emailPlaceholder') || 'Your email address'}
                  className="w-full px-4 py-3 bg-[rgba(0,0,0,0.2)] border border-[rgba(255,255,255,0.1)] rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all"
                  whileFocus={{ scale: 1.01 }}
                  onFocus={() => setEmailInputFocus(true)}
                  onBlur={() => setEmailInputFocus(false)}
                />

                <motion.button
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-md -z-10"
                    animate={{
                      backgroundColor: emailInputFocus
                        ? 'rgba(0, 132, 255, 0.2)'
                        : 'rgba(0, 132, 255, 0)',
                    }}
                  />
                  <RiSendPlaneFill className="text-[var(--primary)]" />
                </motion.button>

                <motion.div
                  className="absolute -inset-[1px] rounded-lg -z-10"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: emailInputFocus ? 0.7 : 0,
                  }}
                  style={{
                    background: 'linear-gradient(120deg, var(--primary), var(--cyan))',
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced copyright section with animations */}
        <motion.div
          className="relative mt-12 pt-8 text-center text-sm text-muted-foreground overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          {/* Animated separator line */}
          <motion.div
            className="absolute top-0 left-0 w-full h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, var(--primary), transparent)',
            }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
          />

          <p className="flex items-center justify-center gap-2 py-4">
            &copy; {currentYear} Lucas
            <motion.div
              animate={{
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: { repeat: Infinity, duration: 2, repeatDelay: 6 },
                scale: { repeat: Infinity, duration: 0.6, repeatDelay: 6 },
              }}
            >
              <RiHeartFill className="text-red-500" />
            </motion.div>
            {t('rightsReserved')}
          </p>
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
        whileHover={{ x: 5 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        <Link href={href} className="relative flex items-center gap-3 group">
          {/* Animated indicator dot */}
          <motion.span
            className="w-2 h-2 rounded-full"
            animate={{
              backgroundColor: isHovered ? 'var(--primary)' : 'var(--muted-foreground)',
              scale: isHovered ? [1, 1.5, 1] : 1,
            }}
            transition={{ scale: { duration: 0.5 } }}
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

'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  LuBadgeCheck,
  LuGlobe,
  LuGithub,
  LuLinkedin,
  LuMail,
  LuMapPin,
  LuRocket,
  LuZap,
} from 'react-icons/lu';
import { ContactLinks } from '@/constants/contacts';
import { projects } from '@/constants/projects';
import { academicExperiences } from '@/constants/academicExperiences';

const projectAggregates = (() => {
  const counts = {
    total: projects.length,
    featured: 0,
    withDemo: 0,
    inProgress: 0,
  };
  const technologies = new Set<string>();

  projects.forEach(project => {
    if (project.featured) counts.featured += 1;
    if (project.demoUrl) counts.withDemo += 1;
    if (project.status === 'workInProgress') counts.inProgress += 1;
    project.tags.forEach(tag => technologies.add(tag));
  });

  return {
    ...counts,
    technologies: technologies.size,
  };
})();

// Calculate years since starting to code (based on academic experiences)
const calculateYearsCoding = (): number => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  // Find the earliest programming-related academic experience
  const programmingStart = academicExperiences.find(exp => 
    exp.id === 'uergs' || exp.id === 'unicv'
  );

  if (!programmingStart) return 2; // Fallback

  const [startYear, startMonth] = programmingStart.startDate.split('-').map(Number);
  
  // Calculate months since start
  const monthsSinceStart = (currentYear - startYear) * 12 + (currentMonth - startMonth);
  
  // Convert to years (rounded down, minimum 1)
  const years = Math.floor(monthsSinceStart / 12);
  return Math.max(1, years) + 1;
};

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  delay?: number;
  className?: string;
  valueClassName?: string;
  suffixClassName?: string;
  formatter?: (value: number) => string;
}

function AnimatedCounter({
  value,
  suffix,
  prefix,
  delay = 0,
  className,
  valueClassName,
  suffixClassName,
  formatter,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    setDisplayValue(0);

    let animationFrame: number;
    let delayTimeout: number | undefined;
    let startTime: number | null = null;
    const duration = 1200;

    const easing = (progress: number) => 1 - Math.pow(1 - progress, 3);

    const step = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp;
      }

      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing(progress);
      const currentValue = Math.round(easedProgress * value);
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    const startAnimation = () => {
      startTime = null;
      animationFrame = requestAnimationFrame(step);
    };

    if (delay > 0) {
      delayTimeout = window.setTimeout(startAnimation, delay * 1000);
    } else {
      startAnimation();
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      if (delayTimeout) {
        clearTimeout(delayTimeout);
      }
    };
  }, [delay, isInView, value]);

  const containerClasses = ['inline-flex items-baseline gap-1', className]
    .filter(Boolean)
    .join(' ');
  const valueClasses = ['leading-none', valueClassName].filter(Boolean).join(' ');
  const suffixClasses = ['leading-none text-sm text-gray-300', suffixClassName]
    .filter(Boolean)
    .join(' ');
  const formattedValue = formatter ? formatter(displayValue) : displayValue.toString();

  return (
    <span ref={ref} className={containerClasses}>
      {prefix && <span className="leading-none">{prefix}</span>}
      <span className={valueClasses}>{formattedValue}</span>
      {suffix && <span className={suffixClasses}>{suffix}</span>}
    </span>
  );
}

export default function AboutProfileShowcase() {
  const t = useTranslations('About.profile');
  const course = t('education');
  const skills = ['React', 'Next.js', 'Node.js', 'TypeScript', 'Python', 'Docker'].join(', ');
  const tSocial = useTranslations('About.profile.social');

  const yearsCoding = calculateYearsCoding();

  const stats = [
    {
      icon: LuBadgeCheck,
      label: t('stats.yearsCoding'),
      value: yearsCoding,
      suffix: '+',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: LuRocket,
      label: t('stats.featuredProjects'),
      value: projectAggregates.featured,
      suffix: '+',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: LuGlobe,
      label: t('stats.projectsOnline'),
      value: projectAggregates.withDemo,
      suffix: '+',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: LuZap,
      label: t('stats.techsUsed'),
      value: projectAggregates.technologies,
      suffix: '+',
      color: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden md:h-auto">
      <div className="flex-1 min-h-0 space-y-6 overflow-y-auto md:space-y-8 md:overflow-visible">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 md:p-8"
        >
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-2xl font-bold md:text-3xl">{t('name') || 'Lucas Diniz'}</h3>
              <p className="text-base text-blue-400 md:text-lg">{t('role')}</p>
            </div>
            <p className="text-sm leading-relaxed text-gray-300 md:text-base">
              {t('bio.summary', { course, skills })}
            </p>
            <div className="grid grid-cols-3 gap-3 md:flex md:flex-wrap md:gap-3">
              <Link
                href={ContactLinks.github}
                target="_blank"
                className="flex items-center justify-center rounded-lg bg-gray-900 p-3 text-white transition-colors hover:bg-gray-800 md:px-4 md:py-3"
                aria-label={tSocial('github')}
              >
                <LuGithub className="h-5 w-5" />
              </Link>
              <Link
                href={ContactLinks.linkedin}
                target="_blank"
                className="flex items-center justify-center rounded-lg bg-blue-600 p-3 text-white transition-colors hover:bg-blue-700 md:px-4 md:py-3"
                aria-label={tSocial('linkedin')}
              >
                <LuLinkedin className="h-5 w-5" />
              </Link>
              <Link
                href={`mailto:${ContactLinks.email}`}
                className="flex items-center justify-center rounded-lg bg-purple-600 p-3 text-white transition-colors hover:bg-purple-700 md:px-4 md:py-3"
                aria-label={tSocial('email')}
              >
                <LuMail className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            const delay = i * 0.12;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay }}
                className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-all hover:border-white/20 md:p-6"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color}`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="mb-1">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    delay={delay}
                    className="text-2xl font-bold md:text-3xl"
                    valueClassName="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent"
                    suffixClassName="text-sm text-gray-300 md:text-base"
                  />
                </div>
                <div className="text-xs text-gray-400 md:text-sm">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Location & Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm md:p-6"
        >
          <div className="flex items-center gap-3 text-gray-300">
            <LuMapPin className="h-5 w-5 text-blue-400" />
            <span>Porto Alegre, Brasil</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

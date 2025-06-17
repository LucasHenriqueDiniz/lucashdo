'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Hero.css';
import { Button } from '@/components/ui/button';
import { skillsData } from '@/constants/skillsData';
import { LuExternalLink, LuMail, LuChevronDown } from 'react-icons/lu';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

interface DeveloperCompletion {
  role: { pt: string; en: string };
  emoji: string;
}

const developerCompletions: DeveloperCompletion[] = [
  { role: { pt: 'front-end pleno', en: 'mid-level front-end' }, emoji: '💻' },
  { role: { pt: 'fã de back-end', en: 'back-end enthusiast' }, emoji: '🔨' },
  { role: { pt: 'entusiasta de UI/UX', en: 'UI/UX enthusiast' }, emoji: '🎨' },
  { role: { pt: 'desenvolvedor full-stack', en: 'full-stack developer' }, emoji: '🌐' },
  { role: { pt: 'mago do TypeScript', en: 'TypeScript wizard' }, emoji: '🪄' },
  { role: { pt: 'gamer nas horas vagas', en: 'gamer in my free time' }, emoji: '🎮' },
  { role: { pt: 'eterno aprendiz', en: 'eternal learner' }, emoji: '🚀' },
  { role: { pt: 'cátolico', en: 'Catholic' }, emoji: '✝️' },
  { role: { pt: 'estudante de 日本語', en: '日本語 language student' }, emoji: '🇯🇵' },
  {
    role: {
      pt: 'que já chorou vendo Shigatsu wa Kimi no Uso',
      en: 'that cried watching Shigatsu wa Kimi no Uso',
    },
    emoji: '😭',
  },
];

export default function Hero() {
  // State for typing effect
  const [skillIndex, setSkillIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const locale = useLocale() || 'pt';
  const router = useRouter();

  // Get featured skills for the typing effect
  const featuredSkills = skillsData
    .filter(skill => skill.featured)
    .sort((a, b) => (a.order || 99) - (b.order || 99))
    .map(skill => skill.name);

  useEffect(() => {
    const currentSkill = featuredSkills[skillIndex % featuredSkills.length];
    // Variable speed based on typing vs deleting, with randomization for natural effect
    const getTypingSpeed = () => {
      const baseSpeed = isDeleting ? 40 : 100;
      // Add slight randomness for more natural typing feel
      return baseSpeed + Math.floor(Math.random() * 40);
    };

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(currentSkill.substring(0, displayText.length + 1));

        if (displayText.length === currentSkill.length) {
          // Wait a bit before starting to delete
          setTimeout(() => {
            setIsDeleting(true);
          }, 1500); // Increased from 1000 to 1500 for better readability
        }
      } else {
        setDisplayText(currentSkill.substring(0, displayText.length - 1));

        // Add a short pause between skills when we reach the end of deletion
        if (displayText.length === 0) {
          setIsDeleting(false);
          // Short pause before starting the next word
          setTimeout(() => {
            setSkillIndex(skillIndex + 1);
          }, 300);
          return;
        }
      }
    }, getTypingSpeed());

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, skillIndex, featuredSkills]);

  // Effect for changing roles
  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex(prev => (prev + 1 < developerCompletions.length ? prev + 1 : 0));
    }, 5000); // Increase time to 5000ms (5 seconds) to make transitions less frequent and more readable

    return () => clearInterval(interval);
  }, []);

  // Handle button clicks
  const handleContactClick = () => {
    router.push('/contact');
  };

  const handleProjectsClick = () => {
    router.push('/projects');
  };

  return (
    <section
      className="flex flex-col  items-center min-h-[60vh] text-center gap-6 p-4 relative"
      style={{
        justifyContent: 'flex-end',
      }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-background to-background"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {/* Typing effect for skills */}
      <motion.div
        className="text-lg text-[color:var(--blue)] font-mono flex items-center justify-center h-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="min-w-[1rem] min-h-[1.5rem]">{displayText}</span>
        <span className="inline-block w-2 h-5 ml-1 bg-[color:var(--blue)] cursor"></span>
      </motion.div>
      {/* Main heading */}
      <motion.h1
        className="text-5xl md:text-6xl font-bold"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Hi, I&apos;m{' '}
        <span className="text-cyan-400 relative group">
          Lucas HDO
          <motion.div
            className="absolute inset-0 bg-cyan-400/20 blur-xl -z-10"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </span>
      </motion.h1>
      {/* Subtitle with changing roles */}
      <motion.h2
        className="text-2xl font-medium flex flex-wrap items-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <span>Um desenvolvedor </span>
        <span className="inline-flex items-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={roleIndex}
              className="text-[color:var(--cyan)] underline underline-offset-4 whitespace-nowrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {developerCompletions[roleIndex].role[locale === 'pt' ? 'pt' : 'en']}
            </motion.span>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.span
              key={roleIndex}
              role="img"
              aria-label="developer icon"
              className="inline-block ml-2"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -5, 0],
              }}
              exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
              transition={{
                duration: 0.4, // Increased from 0.3 to 0.4 for smoother animation
                y: {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }}
            >
              {developerCompletions[roleIndex].emoji}
            </motion.span>
          </AnimatePresence>
        </span>
      </motion.h2>
      {/* Call to action buttons */}{' '}
      <motion.div
        className="flex flex-col sm:flex-row gap-4 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {/* Contact button - with clean outline effect */}{' '}
        <motion.div
          className="contact-button-wrapper relative group"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <Button
            onClick={handleContactClick}
            size="lg"
            variant="outline"
            className="relative overflow-hidden border-2 border-[color:var(--blue)] hover:text-white px-8 py-3 rounded-xl text-lg font-semibold w-full transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-2 justify-center group-hover:gap-3 transition-all duration-300">
              <LuMail className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              Contact
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[color:var(--blue)] via-[color:var(--cyan)] to-[color:var(--blue)] -z-10"
              initial={{ x: '-100%', opacity: 0.5 }}
              whileHover={{ x: '0%', opacity: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </Button>
        </motion.div>{' '}
        {/* Projects button - with animated glowing border effect */}
        <motion.div
          className="projects-button-wrapper relative group"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          {' '}
          {/* Animated border that glows around the button - only visible on hover */}
          <div className="absolute -inset-[6px] rounded-xl border-2 border-[color:var(--cyan)] z-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="animated-border-glow"></div>
          </div>
          {/* Circular glow effects that rotate around the Projects button */}
          <div className="absolute -inset-[8px] rounded-xl z-0 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="glow-circle-clockwise"></div>
            <div className="glow-circle-counterclockwise"></div>
          </div>
          <Button
            onClick={handleProjectsClick}
            size="lg"
            className="bg-[color:var(--cyan)] hover:bg-[color:var(--cyan)/80] text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg relative overflow-hidden w-full group"
          >
            <span className="relative z-10 flex items-center gap-2 justify-center group-hover:gap-3 transition-all duration-300">
              Projects
              <LuExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </span>

            {/* Clean glowing border effect */}
            <div className="absolute inset-0 overflow-hidden rounded-xl">
              <div className="glowing-border absolute inset-0 rounded-xl"></div>
            </div>
          </Button>
        </motion.div>
      </motion.div>
      {/* "See more projects" indicator */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 mx-auto w-fit flex flex-col items-center gap-2 cursor-pointer"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
        whileHover={{ scale: 1.1 }}
      >
        {' '}
        <motion.p
          className="text-sm font-medium text-[color:var(--cyan)]"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Veja mais projetos
        </motion.p>
        <motion.div
          className="text-[color:var(--cyan)] flex flex-col items-center"
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Dotted line */}
          <div className="h-12 border-l-2 border-dashed border-[color:var(--cyan)/50] relative">
            <motion.div
              className="absolute w-2 h-2 rounded-full bg-[color:var(--cyan)] left-1/2 transform -translate-x-1/2"
              animate={{
                y: [0, 36, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'loop',
              }}
            />
          </div>

          <motion.div
            animate={{
              y: [0, 4, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <LuChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

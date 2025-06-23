'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Hero.css';
import { LuExternalLink, LuMail, LuChevronDown } from 'react-icons/lu';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { skillsData } from '@/constants/skillsData';
import { Button } from '@/components/ui/button';

interface DeveloperCompletion {
  role: { pt: string; en: string };
  emoji: string;
}

const developerCompletions: DeveloperCompletion[] = [
  { role: { pt: 'front-end pleno', en: 'mid-level front-end' }, emoji: '💻' },
  { role: { pt: 'fã de back-end', en: 'back-end enthusiast' }, emoji: '🔨' },
  { role: { pt: 'entusiasta de UI/UX', en: 'UI/UX enthusiast' }, emoji: '🎨' },
  { role: { pt: 'full-stack', en: 'full-stack' }, emoji: '🌐' },
  { role: { pt: 'mago do TypeScript', en: 'TypeScript wizard' }, emoji: '🧙‍♂️' },
  { role: { pt: 'gamer nas horas vagas', en: 'gamer in my free time' }, emoji: '🎮' },
  { role: { pt: 'eterno aprendiz', en: 'eternal learner' }, emoji: '🚀' },
  { role: { pt: 'cátolico', en: 'Catholic' }, emoji: '✝️' },
  { role: { pt: 'estudante de 日本語', en: '日本語 language student' }, emoji: '🍙' },
  { role: { pt: 'que ama música', en: 'that loves music' }, emoji: '🎶' },
  { role: { pt: 'rato de academia', en: 'gym rat' }, emoji: '🏋️‍♂️' },
  {
    role: {
      pt: 'que já chorou vendo Shigatsu wa Kimi no Uso',
      en: 'that cried watching Shigatsu wa Kimi no Uso',
    },
    emoji: '😭',
  },
];

function HeroComponent() {
  // State for typing effect
  const [displayText, setDisplayText] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const locale = useLocale() || 'pt';
  const router = useRouter();

  // Refs para controlar o estado da animação de digitação
  const skillIndexRef = useRef(0);
  const isDeletingRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get featured skills for the typing effect - memoized
  const featuredSkills = useMemo(
    () =>
      skillsData
        .filter(skill => skill.featured)
        .sort((a, b) => (a.order || 99) - (b.order || 99))
        .map(skill => skill.name),
    []
  );

  // Current developer role - memoized
  const currentRole = useMemo(() => {
    const role = developerCompletions[roleIndex];
    return {
      text: role.role[locale as 'pt' | 'en'] || role.role.pt,
      emoji: role.emoji,
    };
  }, [roleIndex, locale]);

  // Função para controlar o efeito de digitação
  const handleTypingEffect = useCallback(() => {
    if (featuredSkills.length === 0) return;

    const currentSkill = featuredSkills[skillIndexRef.current % featuredSkills.length];
    const isDeleting = isDeletingRef.current;

    // Velocidade de digitação com randomização
    const getTypingSpeed = () => {
      const baseSpeed = isDeleting ? 40 : 100;
      return baseSpeed + Math.floor(Math.random() * 40);
    };

    if (!isDeleting) {
      // Digitando
      setDisplayText(prev => {
        const nextText = currentSkill.substring(0, prev.length + 1);

        // Se completou a palavra, aguarda e depois começa a deletar
        if (nextText.length === currentSkill.length) {
          timeoutRef.current = setTimeout(() => {
            isDeletingRef.current = true;
            handleTypingEffect();
          }, 1500);
          return nextText;
        }

        // Continua digitando
        timeoutRef.current = setTimeout(handleTypingEffect, getTypingSpeed());
        return nextText;
      });
    } else {
      // Deletando
      setDisplayText(prev => {
        const nextText = currentSkill.substring(0, prev.length - 1);

        // Se terminou de deletar, passa para próxima skill
        if (nextText.length === 0) {
          isDeletingRef.current = false;
          skillIndexRef.current = (skillIndexRef.current + 1) % featuredSkills.length;

          timeoutRef.current = setTimeout(handleTypingEffect, 300);
          return nextText;
        }

        // Continua deletando
        timeoutRef.current = setTimeout(handleTypingEffect, getTypingSpeed());
        return nextText;
      });
    }
  }, [featuredSkills]);

  // Inicializa o efeito de digitação
  useEffect(() => {
    if (featuredSkills.length > 0) {
      handleTypingEffect();
    }

    // Cleanup ao desmontar
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [featuredSkills, handleTypingEffect]);

  // Effect para changing roles
  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex(prev => (prev + 1 < developerCompletions.length ? prev + 1 : 0));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Memoized event handlers
  const handleContactClick = useCallback(() => {
    router.push('/contact');
  }, [router]);

  const handleProjectsClick = useCallback(() => {
    router.push('/projects');
  }, [router]);

  const handleScrollToProjects = useCallback(() => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <section
      className="min-h-[60vh] w-full max-w-4xl mx-auto px-4"
      style={{
        justifyContent: 'center',
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

      <div className="flex flex-col items-center gap-4 w-full">
        {/* Typing effect for skills */}
        <motion.div
          className="text-lg text-[color:var(--blue)] font-mono flex items-center justify-center h-8 mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="min-w-[1rem] min-h-[1.5rem]">{displayText}</span>
          <span className="inline-block w-2 h-5 ml-1 bg-[color:var(--blue)] cursor"></span>
        </motion.div>

        {/* Main heading - centered */}
        <motion.h1
          className="text-5xl md:text-6xl font-bold text-center"
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

        {/* Subtitle with changing roles - properly aligned */}
        <motion.h2
          className="text-2xl font-medium flex flex-wrap items-center justify-center gap-2 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span>{locale === 'pt' ? 'Um desenvolvedor ' : 'A developer '}</span>
          <span className="inline-flex items-center role-container">
            <span className="role-text-wrapper">
              <AnimatePresence mode="wait">
                <motion.span
                  key={roleIndex}
                  className="text-[color:var(--cyan)] underline underline-offset-4 whitespace-nowrap"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentRole.text}
                </motion.span>
              </AnimatePresence>
            </span>
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
                  duration: 0.4,
                  y: {
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                }}
              >
                {currentRole.emoji}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.h2>

        {/* Call to action buttons - horizontally centered */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mt-6 justify-center w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Contact button - with clean outline effect */}
          <motion.div
            className="contact-button-wrapper relative group w-full sm:w-auto"
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
              <span className="flex items-center gap-2">
                <LuMail className="w-5 h-5" />
                {locale === 'pt' ? 'Contato' : 'Contact'}
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[color:var(--blue)] via-[color:var(--cyan)] to-[color:var(--blue)] -z-10"
                initial={{ x: '-100%', opacity: 0.5 }}
                whileHover={{ x: '0%', opacity: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </Button>
          </motion.div>

          {/* Projects button - with animated glowing border effect */}
          <motion.div
            className="projects-button-wrapper relative group w-full sm:w-auto"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <div className="absolute -inset-[6px] rounded-xl border-2 border-[color:var(--cyan)] z-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="animated-border-glow"></div>
            </div>
            <Button
              onClick={handleProjectsClick}
              size="lg"
              className="bg-[color:var(--blue)] text-white hover:bg-[color:var(--blue)]/90 px-8 py-3 rounded-xl text-lg font-semibold w-full relative z-10 shine-effect hero-focus-ring"
            >
              <span className="flex items-center gap-2">
                <LuExternalLink className="w-5 h-5" />
                {locale === 'pt' ? 'Projetos' : 'Projects'}
              </span>
            </Button>
            <div className="absolute -inset-[8px] rounded-xl z-0 overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="glow-circle-clockwise"></div>
              <div className="glow-circle-counterclockwise"></div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* "See more projects" indicator - fixed at bottom */}
      <motion.div
        className="absolute bottom-8 left-0 right-0 mx-auto w-fit flex flex-col items-center gap-2 cursor-pointer"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        onClick={handleScrollToProjects}
        whileHover={{
          scale: 1.05,
          y: -2,
          transition: { type: 'spring', stiffness: 400, damping: 10 },
        }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-sm font-medium text-muted-foreground">
          {locale === 'pt' ? 'Ver mais' : 'See more'}
        </span>

        <motion.div
          className="relative"
          animate={{ y: [0, -2, 0] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <LuChevronDown className="w-5 h-5 text-[color:var(--cyan)]" />

          <motion.div
            className="h-[1px] bg-gradient-to-r from-transparent via-[color:var(--cyan)] to-transparent absolute -bottom-1 left-0 right-0"
            style={{ width: '100%' }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        <div className="flex flex-col items-center relative">
          <LuChevronDown className="w-5 h-5 text-[color:var(--cyan)] opacity-70" />

          <motion.div
            className="absolute -inset-2 rounded-full bg-[color:var(--cyan)] opacity-[0.025] blur-md"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.02, 0.04, 0.02],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  );
}

export default React.memo(HeroComponent);

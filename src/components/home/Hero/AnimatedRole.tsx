import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { TranslatedField } from '@/types/experience.types';

interface DeveloperCompletion {
  text: TranslatedField;
  emoji: string;
}

interface AnimatedRoleProps {
  lang: 'pt' | 'en';
}

const AnimatedRole: React.FC<AnimatedRoleProps> = React.memo(({ lang }) => {
  const [roleIndex, setRoleIndex] = useState(0);
  const t = useTranslations('Hero');

  const roles: DeveloperCompletion[] = [
    { text: { pt: 'front-end pleno', en: 'mid-level front-end developer' }, emoji: '💻' },
    { text: { pt: 'fã de back-end', en: 'back-end enthusiast' }, emoji: '🔨' },
    { text: { pt: 'entusiasta de UI/UX', en: 'UI/UX enthusiast' }, emoji: '🎨' },
    { text: { pt: 'full-stack', en: 'full-stack developer' }, emoji: '🌐' },
    { text: { pt: 'gamer nas horas vagas', en: 'gamer in their free time' }, emoji: '🎮' },
    { text: { pt: 'eterno aprendiz', en: 'eternal learner' }, emoji: '🚀' },
    { text: { pt: 'católico', en: 'Catholic' }, emoji: '✝️' },
    { text: { pt: 'estudante de 日本語', en: '日本語 language student' }, emoji: '🍙' },
    { text: { pt: 'que ama música', en: 'who loves music' }, emoji: '🎶' },
    { text: { pt: 'rato de academia', en: 'gym rat' }, emoji: '🏋️‍♂️' },
    {
      text: {
        pt: 'que já chorou vendo Shigatsu wa Kimi no Uso',
        en: 'who cried watching Shigatsu wa Kimi no Uso',
      },
      emoji: '😭',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex(prev => (prev + 1 < roles.length ? prev + 1 : 0));
    }, 3000);
    return () => clearInterval(interval);
  }, [roles.length]);

  const prefix = t('developerPrefix');
  const currentRole = roles[roleIndex];
  const roleText = currentRole.text[lang];

  return (
    <div className="w-full flex justify-center items-center">
      <div className="relative flex flex-col items-center" style={{ minHeight: 48 }}>
        <div className="flex items-end justify-center gap-2 relative">
          <span className="font-medium text-2xl whitespace-nowrap mb-[0.35rem]">{prefix}</span>
          <div className="relative flex flex-col items-center">
            <AnimatePresence mode="wait">
              <motion.span
                key={roleText}
                className="font-semibold text-2xl whitespace-nowrap relative"
                style={{ color: 'var(--cyan)' }}
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.5 }}
              >
                {roleText}
              </motion.span>
            </AnimatePresence>
            {/* Underline */}
            <motion.div
              key={roleText + '-underline'}
              initial={{ width: 0 }}
              animate={{ width: 75 }}
              transition={{ delay: 0.4, duration: 0.5, ease: 'easeInOut' }}
              className="h-0.5 mt-1 rounded-full"
              style={{
                background: 'linear-gradient(90deg, #38bdf8 0%, #2563eb 100%)',
                width: 75,
                minHeight: 2,
                maxWidth: '100%',
                alignSelf: 'flex-end',
              }}
            />
          </div>
          <AnimatePresence mode="wait">
            <motion.span
              key={currentRole.emoji}
              role="img"
              aria-label="developer icon"
              className="inline-block ml-2 text-2xl"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
              exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
              transition={{
                duration: 0.4,
                y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
              }}
            >
              {currentRole.emoji}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
});
AnimatedRole.displayName = 'AnimatedRole';

export default AnimatedRole;

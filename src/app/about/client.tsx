'use client';

import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRef } from 'react';
import {
  LuChevronDown,
  LuCode,
  LuGraduationCap,
  LuHeartHandshake,
  LuStar,
  LuUser,
} from 'react-icons/lu';
import { Section, SkillsGrid } from '@/components/about';
import AboutCTA from '@/components/about/AboutCTA';
import AboutHero from '@/components/about/AboutHero';
import AboutJourney from '@/components/about/AboutJourney';
import AboutProfile from '@/components/about/AboutProfile';
import AboutProjects from '@/components/about/AboutProjects';
import AboutStats from '@/components/about/AboutStats';
import AboutValues from '@/components/about/AboutValues';
import InterestsTabs from '@/components/interests/InterestsTabs';
import { skillsData } from '@/constants/skillsData';

export default function AboutClient() {
  const t = useTranslations('About');
  const skillsRef = useRef(null);

  // Skills section animations
  const isSkillsInView = useInView(skillsRef, { once: true, amount: 0.2 });

  // Sort skills for better display
  const sortedSkills = [...skillsData].sort(
    (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (a.order || 999) - (b.order || 999)
  );

  return (
    <>
      {/* Hero Banner */}
      <AboutHero />

      <div className="py-8 max-w-4xl mx-auto px-4">
        {/* Profile Section */}
        <Section id="profile" title={t('profile.title')} icon={<LuUser size={24} />}>
          <AboutProfile />
        </Section>

        {/* Stats Section */}
        <Section id="stats" title="Estatísticas" icon={<LuStar size={24} />}>
          <AboutStats />
        </Section>

        {/* Journey Section */}
        <Section id="journey" title="Minha Jornada" icon={<LuGraduationCap size={24} />}>
          <AboutJourney />
        </Section>

        {/* Values Section */}
        <Section id="values" title="Valores & Princípios" icon={<LuHeartHandshake size={24} />}>
          <AboutValues />
        </Section>

        {/* Projects Preview Section */}
        <Section id="projects" title={t('projects.title')} icon={<LuStar size={24} />}>
          <AboutProjects />
        </Section>

        {/* Skills Section */}
        <Section id="skills" title={t('skills.title')} icon={<LuCode size={24} />}>
          <div ref={skillsRef}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={isSkillsInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <SkillsGrid skills={sortedSkills} />
            </motion.div>
          </div>
        </Section>

        {/* Interests Section */}
        <Section id="interests" title={t('interests.title')} icon={<LuHeartHandshake size={24} />}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <InterestsTabs />
          </motion.div>
        </Section>

        {/* Call to Action */}
        <AboutCTA />
      </div>

      {/* Enhanced Scroll to top button */}
      <motion.button
        className="fixed bottom-8 right-8 p-3 bg-[color:var(--primary)] rounded-full shadow-lg z-20 text-white hover:bg-[color:var(--primary)]/90"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        whileHover={{ scale: 1.1, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <LuChevronDown className="rotate-180" />
      </motion.button>
    </>
  );
}

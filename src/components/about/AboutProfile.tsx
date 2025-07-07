'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { LuGithub, LuLinkedin, LuMail } from 'react-icons/lu';
import AboutTestimonials from './AboutTestimonials';
import ProfileHeader from './ProfileHeader';

const interests = [
  'Desenvolvimento Web',
  'UX/UI Design',
  'Sistemas Embarcados',
  'Automação',
  'Música',
  'Jogos',
  'Academia',
];

export default function AboutProfile() {
  const t = useTranslations('About.profile');

  return (
    <div className="space-y-8">
      {/* Profile header with image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <ProfileHeader
          name="Lucas HDO"
          title={t('role')}
          imageUrl="/selfie.webp"
          keywords={interests}
        />
      </motion.div>

      {/* Bio text */}
      <motion.div
        className="text-lg text-gray-600 dark:text-gray-300 space-y-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <p>
          {t('bio.part1')}
          <span className="text-[color:var(--primary)] font-medium">React</span>,
          <span className="text-[color:var(--primary)] font-medium">Next.js</span>,
          <span className="text-[color:var(--primary)] font-medium">Node.js</span>
          {t('bio.part2')}
        </p>
        <p>
          {t('bio.part3')}
          <span className="text-[color:var(--primary)] font-medium">{t('education')}</span>
          {t('bio.part4')}
        </p>
      </motion.div>

      {/* Social links */}
      <motion.div
        className="flex flex-wrap gap-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
      >
        <Link
          href="https://github.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white dark:bg-gray-800 hover:bg-[color:var(--primary)]/10 shadow-sm hover:shadow-md transition-all px-5 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-[color:var(--primary)] flex items-center gap-2"
        >
          <LuGithub size={20} /> {t('social.github')}
        </Link>
        <Link
          href="https://linkedin.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white dark:bg-gray-800 hover:bg-[color:var(--primary)]/10 shadow-sm hover:shadow-md transition-all px-5 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-[color:var(--primary)] flex items-center gap-2"
        >
          <LuLinkedin size={20} /> {t('social.linkedin')}
        </Link>
        <Link
          href="mailto:contact@example.com"
          className="bg-white dark:bg-gray-800 hover:bg-[color:var(--primary)]/10 shadow-sm hover:shadow-md transition-all px-5 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-[color:var(--primary)] flex items-center gap-2"
        >
          <LuMail size={20} /> {t('social.email')}
        </Link>
      </motion.div>

      {/* Testimonials Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <AboutTestimonials />
      </motion.div>
    </div>
  );
}

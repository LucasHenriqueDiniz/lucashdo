'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { LuQuote, LuStar, LuExternalLink } from 'react-icons/lu';
import { aboutTestimonials } from '@/constants/aboutTestimonials';
import { placeholderAvatar } from '../../../public';

export default function AboutTestimonials() {
  const t = useTranslations('About.testimonials');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % aboutTestimonials.length);
    }, 8000); // Rotate every 8 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('title')}</h3>
        <p className="text-gray-600 dark:text-gray-300">{t('subtitle')}</p>
      </div>

      {/* Testimonial carousel */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTestimonial}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
          >
            {/* Quote icon */}
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <LuQuote className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>

            {/* Testimonial content */}
            <div className="text-center mb-8">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed italic">
                &ldquo;{aboutTestimonials[currentTestimonial].content.pt}&rdquo;
              </p>
            </div>

            {/* Rating */}
            <div className="flex justify-center mb-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <LuStar key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>

            {/* Author info */}
            <div className="flex items-center justify-center gap-4">
              <div className="relative">
                <Image
                  src={aboutTestimonials[currentTestimonial].image ?? placeholderAvatar}
                  alt={aboutTestimonials[currentTestimonial].name}
                  width={64}
                  height={64}
                  className="rounded-full shadow-md border-4 border-white dark:border-gray-700"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-700 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="text-center">
                <Link
                  href={aboutTestimonials[currentTestimonial].link || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                      {aboutTestimonials[currentTestimonial].name}
                    </h4>
                    <LuExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                </Link>
                <p className="text-gray-600 dark:text-gray-400">
                  {aboutTestimonials[currentTestimonial].role.pt}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center gap-3">
        {aboutTestimonials.map((_, index) => (
          <button
            key={index}
            aria-label={`Ver testimonial de ${aboutTestimonials[index].name}`}
            className="group transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-full"
            onClick={() => setCurrentTestimonial(index)}
          >
            <div
              className={`w-3 h-3 rounded-full transition-all group-hover:scale-125 
                ${
                  currentTestimonial === index
                    ? 'bg-blue-500 shadow-md'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
            />
          </button>
        ))}
      </div>

      {/* Auto-slide indicator */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600 dark:text-gray-400">{t('autoSlide')}</span>
        </div>
      </div>
    </div>
  );
}

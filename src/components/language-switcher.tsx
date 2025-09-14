'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Languages } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLanguageStore } from '@/lib/i18n/languageStore';

type Locale = 'pt' | 'en';

export function LanguageSwitcher() {
  const lang = useLanguageStore(state => state.lang);
  const setLang = useLanguageStore(state => state.setLang);
  const [isHovered, setIsHovered] = useState(false);
  const [previewLanguage, setPreviewLanguage] = useState<Locale | null>(null);
  const t = useTranslations('Language');

  const languageNames: Record<Locale, string> = {
    pt: t('portuguese'),
    en: t('english'),
  };

  const handleLanguageChange = (newLanguage: Locale) => {
    setLang(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const handleMouseEnter = (language: Locale) => {
    setIsHovered(true);
    setPreviewLanguage(language);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPreviewLanguage(null);
  };

  const otherLanguage = lang === 'pt' ? 'en' : 'pt';

  return (
    <div className="relative">
      <motion.div
        className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        onMouseEnter={() => handleMouseEnter(otherLanguage)}
        onMouseLeave={handleMouseLeave}
        onClick={() => handleLanguageChange(otherLanguage)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Languages className="h-5 w-5 text-gray-600 dark:text-gray-400" />

        <div className="relative overflow-hidden w-20">
          <AnimatePresence mode="wait">
            {isHovered && previewLanguage ? (
              <motion.div
                key="preview"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="flex items-center"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {languageNames[previewLanguage]}
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="current"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="flex items-center"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {languageNames[lang]}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

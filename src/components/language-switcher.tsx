'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages } from 'lucide-react';

// Configuração de idiomas
const languages = {
  pt: { name: 'Português' },
  en: { name: 'English' },
};

type Locale = 'pt' | 'en';

// Contexto para gerenciar o idioma globalmente
interface LanguageContextType {
  currentLanguage: Locale;
  setLanguage: (lang: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Locale>('pt');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Locale;
    if (savedLanguage && (savedLanguage === 'pt' || savedLanguage === 'en')) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Locale) => {
    setCurrentLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export function LanguageSwitcher() {
  const { currentLanguage, setLanguage } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const [previewLanguage, setPreviewLanguage] = useState<Locale | null>(null);

  const handleLanguageChange = (newLanguage: Locale) => {
    setLanguage(newLanguage);
  };

  const handleMouseEnter = (language: Locale) => {
    setIsHovered(true);
    setPreviewLanguage(language);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPreviewLanguage(null);
  };

  const otherLanguage = currentLanguage === 'pt' ? 'en' : 'pt';

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
                  {languages[previewLanguage].name}
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
                  {languages[currentLanguage].name}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

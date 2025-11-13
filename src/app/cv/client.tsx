'use client';

import { useLanguageStore } from '@/store/languageStore';
import CVLayout from '@/components/cv/CVLayout';
import { LuPrinter, LuLanguages, LuSparkles, LuList, LuShare2, LuArrowUp, LuX, LuCopy, LuCheck, LuMenu } from 'react-icons/lu';
import { useCallback, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Home, User, Briefcase, GraduationCap, Code, Languages, Award, MessageCircle, Linkedin, Mail, X, Copy, Check, MessageSquare, Sparkles, ArrowRight, Phone } from 'lucide-react';
import { ContactLinks } from '@/constants/contacts';

const actions = [
  {
    id: 'show-all',
    icon: LuList,
    activeIcon: LuSparkles,
    label: { pt: 'Mostrar Tudo', en: 'Show All' },
    activeLabel: { pt: 'Apenas Highlights', en: 'Highlights Only' },
  },
  {
    id: 'share',
    icon: LuShare2,
    label: { pt: 'Compartilhar', en: 'Share' },
  },
  {
    id: 'contact',
    icon: MessageSquare,
    label: { pt: 'Contato', en: 'Contact' },
    isLink: true,
    getHref: () => `mailto:${ContactLinks.email}`,
  },
  {
    id: 'print',
    icon: LuPrinter,
    label: { pt: 'Imprimir PDF', en: 'Print PDF' },
  },
  {
    id: 'language',
    icon: LuLanguages,
    label: { pt: 'Mudar Idioma', en: 'Change Language' },
  },
];

export default function CVClient() {
  const lang = useLanguageStore(state => state.lang);
  const setLang = useLanguageStore(state => state.setLang);
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showTopIndicator, setShowTopIndicator] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Scroll to top handler
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowScrollTop(scrollY > 300);
      setShowTopIndicator(scrollY > 100); // Show indicator after scrolling 100px
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Section indicator - Simple detection
  useEffect(() => {
    const sections = ['cv-about', 'cv-experience', 'cv-education', 'cv-skills', 'cv-languages', 'cv-certificates'];
    
    const updateActiveSection = () => {
      const scrollY = window.scrollY + 200; // Offset for detection
      let currentSection: string | null = null;
      let minDistance = Infinity;

      sections.forEach(sectionId => {
        const element = document.getElementById(sectionId);
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const elementTop = window.scrollY + rect.top;
        const distance = Math.abs(elementTop - scrollY);

        if (distance < minDistance) {
          minDistance = distance;
          currentSection = sectionId;
        }
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    return () => window.removeEventListener('scroll', updateActiveSection);
  }, [showAll]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const toggleLanguage = useCallback(() => {
    setLang(lang === 'pt' ? 'en' : 'pt');
  }, [lang, setLang]);

  const toggleShowAll = useCallback(() => {
    setShowAll(prev => !prev);
  }, []);

  const handleShare = useCallback(() => {
    setShowShareModal(true);
  }, []);

  const handleCopyLink = useCallback(async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  const getShareOptions = useCallback(() => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const text = lang === 'pt' ? 'Confira meu currículo' : 'Check out my resume';
    const subject = lang === 'pt' ? 'Currículo - Lucas Hdo' : 'Resume - Lucas Hdo';
    const emailBody = lang === 'pt' 
      ? `Olá,\n\nConfira meu currículo: ${url}`
      : `Hello,\n\nCheck out my resume: ${url}`;
    
    return [
      {
        name: 'WhatsApp',
        url: `https://wa.me/?text=${encodeURIComponent(`${text}: ${url}`)}`,
        icon: MessageCircle,
        color: 'text-green-500',
        bgColor: 'bg-green-50 dark:bg-green-900/20',
        hoverBg: 'hover:bg-green-100 dark:hover:bg-green-900/30',
        external: true,
      },
      {
        name: 'LinkedIn',
        url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        icon: Linkedin,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        hoverBg: 'hover:bg-blue-100 dark:hover:bg-blue-900/30',
        external: true,
      },
      {
        name: 'Email',
        url: `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`,
        icon: Mail,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50 dark:bg-gray-800',
        hoverBg: 'hover:bg-gray-100 dark:hover:bg-gray-700',
        external: false,
      },
    ];
  }, [lang]);

  const handleScrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleAction = useCallback(
    (actionId: string) => {
      if (actionId === 'show-all') {
        toggleShowAll();
      } else if (actionId === 'print') {
        handlePrint();
      } else if (actionId === 'language') {
        toggleLanguage();
      } else if (actionId === 'share') {
        handleShare();
      }
      // contact is handled by link href, no action needed
    },
    [toggleShowAll, handlePrint, toggleLanguage, handleShare]
  );

  const sectionLabels = {
    'cv-about': { pt: 'Sobre', en: 'About' },
    'cv-experience': { pt: 'Experiência', en: 'Experience' },
    'cv-education': { pt: 'Educação', en: 'Education' },
    'cv-skills': { pt: 'Habilidades', en: 'Skills' },
    'cv-languages': { pt: 'Idiomas', en: 'Languages' },
    'cv-certificates': { pt: 'Certificados', en: 'Certificates' },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 print:bg-white max-w-[100vw] overflow-x-hidden">
      {/* Floating Section Indicator - Top */}
      <AnimatePresence>
        {activeSection && showTopIndicator && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-2 md:top-4 left-0 right-0 z-40 print:hidden pointer-events-none"
          >
            <div className="max-w-4xl mx-auto px-3 md:px-8">
              <motion.div
                className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-2xl md:rounded-xl shadow-lg md:shadow-xl px-4 py-2.5 md:px-4 md:py-2.5"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
              >
                <div className="flex items-center gap-2 text-xs md:text-sm">
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                    <span className="text-gray-500 dark:text-gray-400 font-medium flex-shrink-0">
                      {lang === 'pt' ? 'Seção:' : 'Section:'}
                    </span>
                    <span className="text-gray-900 dark:text-gray-100 font-semibold truncate">
                      {sectionLabels[activeSection as keyof typeof sectionLabels]?.[lang]}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShareModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] print:hidden"
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-md mx-4 print:hidden"
            >
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <LuShare2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {lang === 'pt' ? 'Compartilhar Currículo' : 'Share Resume'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Copy Link */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {lang === 'pt' ? 'Link do currículo' : 'Resume link'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={typeof window !== 'undefined' ? window.location.href : ''}
                        className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <motion.button
                        onClick={handleCopyLink}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 font-medium ${
                          copied
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4" />
                            {lang === 'pt' ? 'Copiado!' : 'Copied!'}
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            {lang === 'pt' ? 'Copiar' : 'Copy'}
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>

                  {/* Social Share Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      {lang === 'pt' ? 'Compartilhar em' : 'Share on'}
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      {getShareOptions().map((option) => {
                        const Icon = option.icon;
                        return (
                          <motion.a
                            key={option.name}
                            href={option.url}
                            target={option.external ? '_blank' : '_self'}
                            rel={option.external ? 'noopener noreferrer' : undefined}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-3 p-4 ${option.bgColor} ${option.hoverBg} border border-gray-200 dark:border-gray-700 rounded-xl transition-all duration-200 group`}
                          >
                            <div className={`p-2 rounded-lg ${option.bgColor} group-hover:scale-110 transition-transform`}>
                              <Icon className={`w-5 h-5 ${option.color}`} />
                            </div>
                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex-1">
                              {option.name}
                            </span>
                            <LuArrowUp className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 rotate-45 transition-colors" />
                          </motion.a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Section Indicator - Left Side */}
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-2 print:hidden">
        <motion.ul className="flex flex-col gap-2" initial={false}>
          {[
            { id: 'cv-about', label: { pt: 'Sobre', en: 'About' }, icon: User },
            { id: 'cv-experience', label: { pt: 'Experiência', en: 'Experience' }, icon: Briefcase },
            { id: 'cv-education', label: { pt: 'Educação', en: 'Education' }, icon: GraduationCap },
            { id: 'cv-skills', label: { pt: 'Skills', en: 'Skills' }, icon: Code },
            { id: 'cv-languages', label: { pt: 'Idiomas', en: 'Languages' }, icon: Languages },
            { id: 'cv-certificates', label: { pt: 'Certificados', en: 'Certificates' }, icon: Award },
          ].map((section, index) => {
            const isActive = activeSection === section.id;
            const Icon = section.icon;
            return (
              <motion.li
                key={section.id}
                className="relative"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03, duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                onHoverStart={() => setActiveAction(section.id)}
                onHoverEnd={() => setActiveAction(null)}
              >
                {/* Dot Indicator with Icon */}
                <motion.button
                  onClick={() => {
                    const element = document.getElementById(section.id);
                    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200 group/btn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-500 shadow-lg shadow-blue-500/50 text-white'
                        : 'bg-gray-400 hover:bg-gray-500 text-gray-700'
                    }`}
                    animate={{ scale: isActive ? 1.05 : 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <Icon size={14} className={isActive ? 'text-white' : 'text-gray-800'} />
                  </motion.div>
                </motion.button>

                {/* Label - Positioned absolutely, properly aligned */}
                <AnimatePresence>
                  {(isActive || activeAction === section.id) && (
                    <motion.div
                      key="label"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                      className="absolute left-10 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-gray-900/95 backdrop-blur-sm text-xs text-white font-medium whitespace-nowrap shadow-xl pointer-events-none flex items-center gap-1.5"
                    >
                      <Icon size={12} />
                      <span>{lang === 'pt' ? section.label.pt : section.label.en}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>

      {/* Home and Scroll to Top Buttons - Right Side Bottom */}
      <div className="fixed right-6 bottom-6 z-50 hidden md:flex flex-col gap-2.5 print:hidden">
        {/* Home Button */}
        <motion.div
          className="relative group"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.button
            onClick={() => router.push('/')}
            className="h-11 w-11 rounded-full bg-gray-800/70 backdrop-blur-sm text-gray-400 hover:text-white hover:bg-gray-700/60 ring-1 ring-gray-700/40 flex items-center justify-center transition-all shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Home size={20} />
          </motion.button>
          {/* Tooltip */}
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-gray-900/90 backdrop-blur-sm text-xs text-white whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {lang === 'pt' ? 'Voltar para home' : 'Back to home'}
            <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900/90" />
          </div>
        </motion.div>

        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.button
                onClick={handleScrollToTop}
                className="h-11 w-11 rounded-full bg-gray-800/70 backdrop-blur-sm text-gray-400 hover:text-white hover:bg-gray-700/60 ring-1 ring-gray-700/40 flex items-center justify-center transition-all shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <LuArrowUp className="h-5 w-5" />
              </motion.button>
              {/* Tooltip */}
              <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-gray-900/90 backdrop-blur-sm text-xs text-white whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {lang === 'pt' ? 'Voltar ao topo' : 'Scroll to top'}
                <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-gray-900/90" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action Buttons - Right Side (organized) */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-2.5 print:hidden">
        <motion.ul className="flex flex-col gap-2.5" initial={false}>
          {/* Highlight móvel */}
          <AnimatePresence>
            {(activeAction || showAll) && (
              <motion.div
                key={activeAction || 'show-all'}
                layoutId="cv-action-focus"
                className="absolute right-0 h-11 w-11 rounded-full pointer-events-none"
                transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.6 }}
                style={{ translateZ: 0 }}
              >
                <span className="block h-full w-full rounded-full ring-2 ring-cyan-400/50 shadow-[0_0_24px_rgba(34,211,238,0.35)]" />
              </motion.div>
            )}
          </AnimatePresence>

          {actions.map((action, index) => {
            const Icon = action.id === 'show-all' && showAll && action.activeIcon ? action.activeIcon : action.icon;
            const isActive = activeAction === action.id;
            const isHighlighted = action.id === 'show-all' && showAll;
            const label = action.id === 'show-all' && showAll && action.activeLabel ? action.activeLabel : action.label;

            if (!Icon) return null;

            return (
              <motion.li
                key={action.id}
                className="relative flex items-center justify-end gap-2.5"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03, duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                onHoverStart={() => setActiveAction(action.id)}
                onHoverEnd={() => setActiveAction(null)}
              >
                {/* Label */}
                <AnimatePresence>
                  {(isActive || isHighlighted) && label && (
                    <motion.span
                      key="label"
                      initial={{ opacity: 0, x: 8, scale: 0.96 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 8, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                      className="px-3 py-1.5 rounded-full bg-gray-900/90 backdrop-blur-sm outline outline-1 outline-white/10 text-xs text-white uppercase tracking-wide font-medium whitespace-nowrap shadow-lg"
                    >
                      {lang === 'pt' ? label.pt : label.en}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Botão */}
                {action.isLink ? (
                  <motion.a
                    href={action.getHref ? action.getHref() : '#'}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    className="relative"
                  >
                    <motion.div
                      className={[
                        'h-11 w-11 rounded-full flex items-center justify-center transition-colors duration-200 transform-gpu will-change-transform',
                        action.id === 'contact'
                          ? 'bg-green-500 hover:bg-green-600 text-white shadow-xl shadow-green-500/25'
                          : 'bg-gray-800/70 backdrop-blur-sm text-gray-400 hover:text-white hover:bg-gray-700/60 ring-1 ring-gray-700/40',
                      ].join(' ')}
                      animate={{ scale: isActive ? 1.08 : 1 }}
                      transition={{ type: 'spring', stiffness: 420, damping: 28, mass: 0.5 }}
                    >
                      <Icon className="h-5 w-5" />
                    </motion.div>
                  </motion.a>
                ) : (
                  <motion.button
                    onClick={() => handleAction(action.id)}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    className="relative"
                  >
                    <motion.div
                      className={[
                        'h-11 w-11 rounded-full flex items-center justify-center transition-colors duration-200 transform-gpu will-change-transform',
                        isActive || isHighlighted
                          ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl shadow-blue-500/25'
                          : 'bg-gray-800/70 backdrop-blur-sm text-gray-400 hover:text-white hover:bg-gray-700/60 ring-1 ring-gray-700/40',
                      ].join(' ')}
                      animate={{ scale: isActive || isHighlighted ? 1.08 : 1 }}
                      transition={{ type: 'spring', stiffness: 420, damping: 28, mass: 0.5 }}
                    >
                      <Icon className="h-5 w-5" />
                    </motion.div>

                    {/* Glow - only for non-link buttons */}
                    {!action.isLink && (
                      <motion.span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 rounded-full"
                        initial={false}
                        animate={{ opacity: isActive || isHighlighted ? 1 : 0 }}
                        transition={{ duration: 0.18 }}
                        style={{
                          boxShadow: '0 0 32px rgba(99,102,241,0.35)',
                        }}
                      />
                    )}
                  </motion.button>
                )}
              </motion.li>
            );
          })}
        </motion.ul>
      </div>

      {/* Mobile Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden print:hidden">
        <AnimatePresence>
          {showMobileMenu && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMobileMenu(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              />
              {/* Menu Items */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="absolute bottom-20 right-0 flex flex-col gap-3 mb-2 z-50"
              >
                {actions.map((action, index) => {
                  const Icon = action.id === 'show-all' && showAll && action.activeIcon ? action.activeIcon : action.icon;
                  const label = action.id === 'show-all' && showAll && action.activeLabel ? action.activeLabel : action.label;
                  const isHighlighted = action.id === 'show-all' && showAll;

                  if (!Icon) return null;

                  return (
                    <motion.div
                      key={action.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {action.isLink ? (
                        <motion.a
                          href={action.getHref ? action.getHref() : '#'}
                          onClick={() => setShowMobileMenu(false)}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 min-w-[180px]"
                        >
                          <div className={`p-2 rounded-lg ${
                            action.id === 'contact'
                              ? 'bg-green-100 dark:bg-green-900/30'
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}>
                            <Icon className={`h-5 w-5 ${
                              action.id === 'contact'
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-gray-700 dark:text-gray-300'
                            }`} />
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {lang === 'pt' ? label.pt : label.en}
                          </span>
                        </motion.a>
                      ) : (
                        <motion.button
                          onClick={() => {
                            handleAction(action.id);
                            setShowMobileMenu(false);
                          }}
                          whileTap={{ scale: 0.95 }}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border min-w-[180px] ${
                            isHighlighted
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-transparent'
                              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                          }`}
                        >
                          <div className={`p-2 rounded-lg ${
                            isHighlighted
                              ? 'bg-white/20'
                              : 'bg-gray-100 dark:bg-gray-700'
                          }`}>
                            <Icon className={`h-5 w-5 ${
                              isHighlighted
                                ? 'text-white'
                                : 'text-gray-700 dark:text-gray-300'
                            }`} />
                          </div>
                          <span className={`text-sm font-medium ${
                            isHighlighted
                              ? 'text-white'
                              : 'text-gray-900 dark:text-gray-100'
                          }`}>
                            {lang === 'pt' ? label.pt : label.en}
                          </span>
                        </motion.button>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            </>
          )}
        </AnimatePresence>
        {/* Main Floating Button */}
        <motion.button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-all ${
            showMobileMenu
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
              : 'bg-gray-800 dark:bg-gray-700 text-white'
          }`}
        >
          <motion.div
            animate={{ rotate: showMobileMenu ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {showMobileMenu ? (
              <LuX className="h-6 w-6" />
            ) : (
              <LuMenu className="h-6 w-6" />
            )}
          </motion.div>
        </motion.button>
      </div>

      {/* Mobile Home and Scroll to Top Buttons */}
      <div className="fixed bottom-6 left-6 z-50 md:hidden print:hidden flex flex-col gap-3">
        {/* Home Button */}
        <motion.button
          onClick={() => router.push('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="h-12 w-12 rounded-full bg-gray-800/90 dark:bg-gray-700/90 backdrop-blur-sm text-white shadow-lg flex items-center justify-center"
        >
          <Home size={20} />
        </motion.button>
        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleScrollToTop}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="h-12 w-12 rounded-full bg-gray-800/90 dark:bg-gray-700/90 backdrop-blur-sm text-white shadow-lg flex items-center justify-center"
            >
              <LuArrowUp className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* CV Content */}
      <div className="max-w-4xl mx-auto p-4 md:p-8 print:p-0 print:max-w-full">
        <CVLayout lang={lang} showAll={showAll} />
      </div>

      {/* CTA Section - Outside CV, Web Only */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-12 md:pb-12 print:hidden">
        <motion.section
          className="cv-cta-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="cv-cta-content">
            <motion.div
              className="cv-cta-icon-wrapper"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
            >
              <Sparkles className="cv-cta-icon" />
            </motion.div>
            <h2 className="cv-cta-title">
              {lang === 'pt' ? 'Vamos trabalhar juntos?' : 'Let\'s work together?'}
            </h2>
            <p className="cv-cta-text">
              {lang === 'pt'
                ? 'Estou sempre aberto a discutir novos projetos e oportunidades. Vamos criar algo incrível?'
                : 'I\'m always open to discussing new projects and opportunities. Let\'s create something amazing?'}
            </p>
            <div className="cv-cta-buttons">
              <motion.a
                href={`mailto:${ContactLinks.email}`}
                className="cv-cta-button cv-cta-button-primary"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <Mail className="cv-cta-button-icon" />
                {lang === 'pt' ? 'Entrar em Contato' : 'Get in Touch'}
                <ArrowRight className="cv-cta-button-icon" />
              </motion.a>
              <motion.a
                href={ContactLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="cv-cta-button cv-cta-button-secondary"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 0 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35 }}
              >
                <Phone className="cv-cta-button-icon" />
                WhatsApp
                <ArrowRight className="cv-cta-button-icon" />
              </motion.a>
              <motion.a
                href={ContactLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="cv-cta-button cv-cta-button-secondary"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <Linkedin className="cv-cta-button-icon" />
                LinkedIn
                <ArrowRight className="cv-cta-button-icon" />
              </motion.a>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}


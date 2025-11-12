'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  LuBriefcase,
  LuCalendar,
  LuCode,
  LuExternalLink,
  LuGraduationCap,
  LuPlus,
  LuRocket,
  LuSearch,
  LuSparkles,
  LuStar,
  LuX,
} from 'react-icons/lu';
import { formatExperienceDates, getFilteredAndSortedExperiences } from '@/utils/experienceUtils';
import { projects, type Project } from '@/constants/projects';
import { jobExperiences } from '@/constants/jobExperiences';
import { academicExperiences } from '@/constants/academicExperiences';
import { useAboutSectionController } from '@/providers/AboutSectionController';
import { useLanguageStore } from '@/store/languageStore';

const getStatusLabel = (status?: Project['status'], locale: 'pt' | 'en' = 'pt') => {
  if (!status) return '';
  const map: Record<NonNullable<Project['status']>, { pt: string; en: string }> = {
    workInProgress: { pt: 'Em desenvolvimento', en: 'Work in progress' },
    discontinued: { pt: 'Descontinuado', en: 'Discontinued' },
    experimental: { pt: 'Experimental', en: 'Experimental' },
    completed: { pt: 'Concluído', en: 'Completed' },
  };
  return map[status]?.[locale] || status;
};

const MAX_PLANETS_PER_ORBIT = 2;
const RING_ROTATION_STEP = Math.PI / 6;
const ORBIT_ANGLES = [-Math.PI / 2, Math.PI / 2];
const SUN_GRADIENT =
  'radial-gradient(circle at 30% 30%, rgba(255,214,94,0.95), rgba(251,191,36,0.85), rgba(134,65,25,0.9))';

export default function JornadaTimeline() {
  const t = useTranslations('About.journey');
  const locale = useLanguageStore(state => state.lang);
  const { isSectionActive } = useAboutSectionController();
  const isActive = isSectionActive('journey');
  const [activeTab, setActiveTab] = useState<'professional' | 'academic' | 'projects' | 'all'>(
    'all'
  );
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [projectsSearch, setProjectsSearch] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) {
        const { width, height } = entry.contentRect;
        setContainerSize({ width, height });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!selectedItem?.isMore) {
      setProjectsSearch('');
    }
  }, [selectedItem]);

  const getFilteredExperiences = (type: 'academic' | 'professional') => {
    const experiences = type === 'academic' ? academicExperiences : jobExperiences;
    const list = getFilteredAndSortedExperiences(experiences, true);
    return list.sort((a: any, b: any) => (b.endDate ? 0 : 1) - (a.endDate ? 0 : 1));
  };

  const projectPalette = ['#f97316', '#3b82f6', '#a855f7', '#38bdf8'];
  const highlightedProjectIds = ['quizhub', 'windows-xp-online', 'weeb-profile'];

  const getHighlightedProjects = (locale: 'pt' | 'en') => {
    const highlighted = projects.filter(project => highlightedProjectIds.includes(project.id));
    const defaultProjectImage = highlighted[0]?.image ?? projects[0]?.image ?? '';

    const moreProjects = {
      id: 'more-projects',
      title: locale === 'en' ? 'Explore More Projects' : 'Explorar Outros Projetos',
      description: {
        pt: 'Mais de 20 projetos públicos entre produtos SaaS, automações e protótipos experimentais. Vamos conversar e eu conto o resto.',
        en: 'Over 20 public projects spanning SaaS products, automations, and experimental prototypes. Let’s talk and I’ll walk you through them.',
      },
      image: defaultProjectImage,
      tags: ['Open-source', 'SaaS', 'Automations', 'UX', 'Infra'],
      repoUrl: '/projects',
      featured: false,
      status: 'completed' as const,
      isMore: true,
    };

    const mappedHighlight = highlighted.map((proj, index) => ({
      ...proj,
      type: 'projects' as const,
      color: projectPalette[index] || '#3b82f6',
      size: index === 0 ? ('large' as const) : ('medium' as const),
      orbit: 3 + index,
      company: t('personalProject'),
      period: new Date().getFullYear().toString(),
      isMore: false,
    }));

    return [
      ...mappedHighlight,
      {
        ...moreProjects,
        type: 'projects' as const,
        color: projectPalette[mappedHighlight.length] || '#38bdf8',
        size: 'xlarge' as const,
        orbit: 6,
        company: locale === 'en' ? 'Portfolio' : 'Portfólio',
        period: '∞',
      } as any,
    ];
  };

  const allExperiences = [
    ...getFilteredExperiences('professional').map((exp: any) => ({
      ...exp,
      type: 'professional' as const,
      color: '#00d2d2',
      size: exp.endDate ? ('medium' as const) : ('large' as const),
      orbit: 1,
    })),
    ...getFilteredExperiences('academic').map((exp: any) => ({
      ...exp,
      type: 'academic' as const,
      color: '#a855f7',
      size: exp.endDate ? ('medium' as const) : ('large' as const),
      orbit: 2,
    })),
    ...getHighlightedProjects(locale),
  ];

  const filteredExperiences =
    activeTab === 'all' ? allExperiences : allExperiences.filter(exp => exp.type === activeTab);

  const planetPairs = useMemo(() => {
    const buckets: any[][] = [];
    filteredExperiences.forEach((item, idx) => {
      const ringIndex = Math.floor(idx / MAX_PLANETS_PER_ORBIT);
      if (!buckets[ringIndex]) buckets[ringIndex] = [];
      buckets[ringIndex].push(item);
    });
    return buckets;
  }, [filteredExperiences]);

  const planets = useMemo(() => {
    const result: Array<{
      item: any;
      angle: number;
      ring: number;
      index: number;
      count: number;
    }> = [];

    planetPairs.forEach((group, ringIdx) => {
      const count = group.length;
      const baseRotation = ringIdx * RING_ROTATION_STEP;

      group.forEach((item, itemIdx) => {
        const angle = baseRotation + (ORBIT_ANGLES[itemIdx] ?? -Math.PI / 2);
        result.push({ item, angle, ring: ringIdx, index: itemIdx, count });
      });
    });

    return result;
  }, [planetPairs]);

  const orbitRadiusMap = useMemo(() => {
    const { width, height } = containerSize;
    const maxDimension = Math.min(width || window.innerWidth, height || window.innerHeight);
    const baseRadius = Math.max(160, maxDimension / 2 - 80);

    return new Map<number, number>(
      planetPairs.map((_, idx) => {
        const spacing = 70;
        const radius = baseRadius + idx * spacing + idx * 20;
        return [idx, radius];
      })
    );
  }, [containerSize, planetPairs]);

  const getPlanetSizeForRing = (ringIdx: number, defaultSize: string) => {
    if (ringIdx === 0) return defaultSize;
    if (ringIdx === 1) return 'medium';
    return 'small';
  };

  const planetContainerStyle = useMemo(
    () => ({ height: '90vh', maxHeight: '90vh', width: '100vw', maxWidth: '100vw' }),
    []
  );

  // Estrelas de fundo animadas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrame: number;
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    const createStar = () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.2 + 0.3,
      velocity: Math.random() * 0.08 + 0.02,
    });

    const renderBackground = (ctx: CanvasRenderingContext2D) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height)
      );
      gradient.addColorStop(0, '#0a0e27');
      gradient.addColorStop(1, '#000000');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    };

    let stars = Array.from({ length: 120 }, createStar);

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      stars = Array.from({ length: 120 }, createStar);
    };

    resizeCanvas();

    if (!isActive) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        renderBackground(ctx);
      }
      return;
    }

    const animate = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      renderBackground(ctx);

      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        ctx.fill();

        star.y += star.velocity;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isActive]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'professional':
        return LuBriefcase;
      case 'academic':
        return LuGraduationCap;
      case 'projects':
        return LuCode;
      default:
        return LuStar;
    }
  };

  const getSizeClass = (size: string) => {
    switch (size) {
      case 'xlarge':
        return 'w-20 h-20 md:w-28 md:h-28';
      case 'large':
        return 'w-18 h-18 md:w-24 md:h-24';
      case 'medium':
        return 'w-14 h-14 md:w-18 md:h-18';
      case 'small':
        return 'w-11 h-11 md:w-14 md:h-14';
      default:
        return 'w-16 h-16';
    }
  };

  const TabButton = ({
    active,
    onClick,
    icon: Icon,
    children,
  }: {
    active: boolean;
    onClick: () => void;
    icon: React.ComponentType<{ className?: string }>;
    children: React.ReactNode;
  }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md transition-all text-sm font-semibold ${
        active
          ? 'bg-gradient-to-r from-cyan-500/30 to-purple-500/30 border-2 border-cyan-400/50 text-white'
          : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{children}</span>
    </motion.button>
  );

  const orbitRings = useMemo(() => planetPairs.map((_, idx) => idx), [planetPairs]);

  return (
    <div className="relative w-full h-screen flex flex-col overflow-hidden bg-black">
      {/* Canvas de fundo com estrelas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Header */}
      <div className="relative z-10 flex justify-center pt-4 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-900/30 to-blue-900/30 backdrop-blur-xl rounded-full border border-purple-500/30"
        >
          <LuRocket className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {t('title') || 'Jornada Galáctica'}
          </h2>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="relative z-10 flex justify-center gap-2 mb-4 flex-wrap px-4">
        <TabButton
          active={activeTab === 'all'}
          onClick={() => setActiveTab('all')}
          icon={LuSparkles}
        >
          Todos
        </TabButton>
        <TabButton
          active={activeTab === 'professional'}
          onClick={() => setActiveTab('professional')}
          icon={LuBriefcase}
        >
          {t('professional')}
        </TabButton>
        <TabButton
          active={activeTab === 'academic'}
          onClick={() => setActiveTab('academic')}
          icon={LuGraduationCap}
        >
          {t('academic')}
        </TabButton>
        <TabButton
          active={activeTab === 'projects'}
          onClick={() => setActiveTab('projects')}
          icon={LuCode}
        >
          {t('projects') || 'Projetos'}
        </TabButton>
      </div>

      {/* Sistema Solar Central */}
      <div
        ref={containerRef}
        className="relative z-10 flex-1 flex items-center justify-center"
        style={planetContainerStyle}
      >
        {/* Eixos decorativos */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/15 to-transparent" />
          <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        </div>

        {/* Órbitas */}
        <div className="absolute inset-0 pointer-events-none">
          {orbitRings.map(ringIdx => {
            const radius = orbitRadiusMap.get(ringIdx) ?? 150 + ringIdx * 100;
            return (
              <motion.div
                key={ringIdx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 0.25, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, delay: ringIdx * 0.05 }}
                className="absolute rounded-full border border-dashed border-white/20"
                style={{
                  width: radius * 2,
                  height: radius * 2,
                  left: '50%',
                  top: '50%',
                  marginLeft: -radius,
                  marginTop: -radius,
                }}
              />
            );
          })}
        </div>

        {/* Sol Central */}
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ duration: 1.6, rotate: { duration: 20, repeat: Infinity, ease: 'linear' } }}
          className="absolute w-22 h-22 md:w-32 md:h-32 rounded-full shadow-[0_0_80px_rgba(252,211,77,0.55)]"
          style={{ background: SUN_GRADIENT }}
        >
          <div className="absolute inset-0 rounded-full bg-white/15 blur-xl mix-blend-screen" />
          <div className="absolute inset-0 rounded-full border border-yellow-200/40 opacity-70" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-9 h-9 md:w-12 md:h-12 rounded-full bg-white/12 backdrop-blur-sm flex items-center justify-center">
              <LuStar className="w-5 h-5 md:w-7 md:h-7 text-white opacity-80" />
            </div>
          </div>
        </motion.div>

        {/* Órbitas e Planetas */}
        <AnimatePresence>
          {planets.map(({ item: exp, angle, ring, index }) => {
            const Icon = exp.isMore ? LuSparkles : getIcon(exp.type);
            const orbitRadius = orbitRadiusMap.get(ring) ?? 120;
            const x = Math.cos(angle) * orbitRadius;
            const y = Math.sin(angle) * orbitRadius;
            const isCurrent = !exp.endDate && exp.type !== 'projects';
            const isLowerHemisphere = y > 0;

            return (
              <motion.div
                key={`${exp.id}-${ring}-${index}`}
                className="absolute"
                style={{ left: '50%', top: '50%' }}
                initial={{ opacity: 0, scale: 0.95, x: 0, y: 0 }}
                animate={{ opacity: 1, scale: 1, x, y }}
                exit={{ opacity: 0, scale: 0.6, x: 0, y: 0 }}
                transition={{
                  duration: 0.6,
                  type: 'spring',
                  damping: 18,
                  stiffness: 140,
                  delay: (ring * MAX_PLANETS_PER_ORBIT + index) * 0.05,
                }}
              >
                <motion.button
                  type="button"
                  aria-label={exp.title}
                  style={{
                    left: '50%',
                    top: '50%',
                    translateX: '-50%',
                    translateY: '-50%',
                  }}
                  whileHover={{ scale: 1.15, zIndex: 50 }}
                  onHoverStart={() => setHoveredPlanet(exp.id)}
                  onHoverEnd={() => setHoveredPlanet(null)}
                  onClick={() => {
                    setSelectedItem(exp);
                    if (exp.isMore) setProjectsSearch('');
                  }}
                  className={`absolute ${getSizeClass(getPlanetSizeForRing(ring, exp.size))} cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-black`}
                >
                  <div
                    className={`absolute inset-0 rounded-full blur-lg transition-opacity ${
                      exp.isMore
                        ? 'opacity-85 group-hover:opacity-100'
                        : 'opacity-45 group-hover:opacity-80'
                    }`}
                    style={{
                      background: exp.isMore
                        ? 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), rgba(192,132,252,0.55))'
                        : exp.color,
                    }}
                  />

                  <div
                    className={`relative w-full h-full rounded-full border-4 flex items-center justify-center overflow-hidden shadow-2xl ${
                      exp.isMore
                        ? 'border-white/60 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500'
                        : 'border-white/20'
                    }`}
                    style={
                      exp.isMore
                        ? undefined
                        : {
                            background: `radial-gradient(circle at 30% 30%, ${exp.color}, ${exp.color}dd)`,
                          }
                    }
                  >
                    {exp.isMore ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 22, ease: 'linear' }}
                          className="absolute inset-[18%] rounded-full border border-white/30"
                        />
                        <div className="relative z-10 w-7 h-7 md:w-9 md:h-9 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center shadow-lg">
                          <LuPlus className="w-4 h-4 md:w-6 md:h-6 text-white" />
                        </div>
                      </div>
                    ) : (
                      <>
                        <Icon className="w-5 h-5 md:w-7 md:h-7 text-white z-10" />
                        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent" />
                        {exp.size === 'large' || exp.size === 'xlarge' ? (
                          <div
                            className="absolute inset-0 rounded-full"
                            style={{
                              boxShadow: `0 0 0 6px ${exp.color}33, 0 0 0 10px ${exp.color}1a`,
                            }}
                          />
                        ) : null}
                      </>
                    )}
                    {isCurrent && !exp.isMore && (
                      <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-emerald-500 animate-pulse border border-white" />
                    )}
                  </div>

                  <AnimatePresence>
                    {hoveredPlanet === exp.id && (
                      <motion.div
                        key="tooltip"
                        initial={{ opacity: 0, y: isLowerHemisphere ? -8 : 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: isLowerHemisphere ? -8 : 8 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute left-1/2 -translate-x-1/2 px-4 py-2 bg-black/90 backdrop-blur-md rounded-lg border border-white/20 whitespace-nowrap z-50 ${
                          isLowerHemisphere
                            ? 'bottom-full mb-3 origin-bottom'
                            : 'top-full mt-3 origin-top'
                        }`}
                      >
                        <p className="text-white font-semibold text-xs md:text-sm">{exp.title}</p>
                        <p className="text-gray-400 text-[10px] md:text-xs">
                          {exp.institution || exp.company}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Modal de Detalhes */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.8, rotateY: 90 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0.8, rotateY: -90 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative max-w-2xl w-full bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 rounded-3xl border border-purple-500/30 shadow-[0_0_100px_rgba(168,85,247,0.4)] overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
            >
              <div
                className="relative p-6 md:p-8 border-b border-white/10 flex items-start gap-4"
                style={{
                  background: selectedItem.isMore
                    ? 'linear-gradient(135deg, rgba(59,130,246,0.2), transparent)'
                    : `linear-gradient(135deg, ${selectedItem.color}30, transparent)`,
                }}
              >
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <LuX className="w-5 h-5 text-white" />
                </button>

                {!selectedItem.isMore && (
                  <div className="flex gap-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center border-2 border-white/20 shrink-0"
                      style={{ backgroundColor: selectedItem.color }}
                    >
                      {React.createElement(getIcon(selectedItem.type), {
                        className: 'w-7 h-7 text-white',
                      })}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl font-bold text-white mb-2">{selectedItem.title}</h2>
                      <div className="text-cyan-300 font-semibold text-sm mb-2">
                        {selectedItem.institution || selectedItem.company}
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-xs">
                        <LuCalendar className="w-4 h-4" />
                        <span>
                          {selectedItem.type === 'projects'
                            ? selectedItem.period
                            : formatExperienceDates(
                                selectedItem.startDate,
                                selectedItem.endDate,
                                locale
                              )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedItem.isMore && (
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/40">
                      <LuSparkles className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedItem.title}</h2>
                      <p className="text-sm text-white/70">
                        {selectedItem.description[locale] || selectedItem.description.pt}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 md:p-8" style={{ maxHeight: '60vh' }}>
                <div className="custom-scroll space-y-6 overflow-y-auto pr-2">
                  {selectedItem.isMore ? (
                    <MoreProjectsGallery
                      locale={locale}
                      search={projectsSearch}
                      onSearchChange={setProjectsSearch}
                    />
                  ) : (
                    <>
                      {selectedItem.type === 'projects' && selectedItem.image && (
                        <div className="relative w-full h-48 rounded-xl overflow-hidden border border-gray-700/50">
                          <Image
                            src={selectedItem.image}
                            alt={selectedItem.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}

                      <div>
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                          {t('description') || 'Descrição'}
                        </h3>
                        <p className="text-gray-200 leading-relaxed">
                          {selectedItem.type === 'projects'
                            ? selectedItem.description[locale] || selectedItem.description.pt
                            : selectedItem.description[locale] || selectedItem.description.pt}
                        </p>
                      </div>

                      {(selectedItem.tags || selectedItem.skills) && (
                        <div>
                          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                            {t('technologies') || 'Tecnologias'}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {(selectedItem.tags || selectedItem.skills || [])
                              .slice(0, 10)
                              .map((tag: any) => {
                                const label =
                                  typeof tag === 'string'
                                    ? tag
                                    : (tag?.labels?.[locale] ?? tag?.labels?.pt ?? '');
                                if (!label) return null;
                                return (
                                  <span
                                    key={label}
                                    className="px-4 py-2 rounded-full text-sm font-medium text-white border"
                                    style={{
                                      backgroundColor: `${selectedItem.color}20`,
                                      borderColor: `${selectedItem.color}50`,
                                    }}
                                  >
                                    {label}
                                  </span>
                                );
                              })}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-3 pt-4">
                        {selectedItem.url && selectedItem.type !== 'projects' && (
                          <a
                            href={selectedItem.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105"
                            style={{
                              background: `linear-gradient(135deg, ${selectedItem.color}, ${selectedItem.color}cc)`,
                            }}
                          >
                            <LuExternalLink className="w-5 h-5" />
                            {t('visit') || 'Visitar Site'}
                          </a>
                        )}
                        {selectedItem.type === 'projects' && (
                          <>
                            {selectedItem.demoUrl && (
                              <a
                                href={selectedItem.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105"
                                style={{
                                  background: `linear-gradient(135deg, ${selectedItem.color}, ${selectedItem.color}cc)`,
                                }}
                              >
                                <LuExternalLink className="w-5 h-5" />
                                {t('demo') || 'Ver Demo'}
                              </a>
                            )}
                            <a
                              href={selectedItem.repoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-6 py-3 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50 text-white rounded-xl font-semibold transition-all"
                            >
                              <LuExternalLink className="w-5 h-5" />
                              {t('repo') || 'Ver Repositório'}
                            </a>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Efeito de brilho */}
              <div
                className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
                style={{ backgroundColor: selectedItem.color }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instruções */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 md:px-6 md:py-3 bg-black/50 backdrop-blur-md rounded-full border border-white/10 z-10"
      >
        <p className="text-gray-400 text-xs md:text-sm flex items-center gap-2">
          <LuSparkles className="w-4 h-4 text-cyan-400" />
          Clique nos planetas para explorar a jornada
        </p>
      </motion.div>
    </div>
  );
}

function MoreProjectsGallery({
  locale,
  search,
  onSearchChange,
}: {
  locale: 'pt' | 'en';
  search: string;
  onSearchChange: (value: string) => void;
}) {
  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return projects.filter(project => {
      const title = project.title.toLowerCase();
      const desc = (project.description[locale] || project.description.pt).toLowerCase();
      const tags = project.tags.map(tag => tag.toLowerCase()).join(' ');
      return [title, desc, tags].some(text => text.includes(term));
    });
  }, [search, locale]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            value={search}
            onChange={event => onSearchChange(event.target.value)}
            placeholder={locale === 'en' ? 'Search projects…' : 'Buscar projetos…'}
            className="w-full bg-[#0b1524] border border-white/10 rounded-lg py-2 pl-10 pr-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>
        <span className="text-xs text-gray-400 uppercase tracking-widest">
          {filtered.length} {locale === 'en' ? 'results' : 'resultados'}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map(project => (
          <motion.div
            key={project.id}
            whileHover={{ translateY: -4 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="text-white font-semibold text-base">{project.title}</h4>
                <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                  {project.description[locale] || project.description.pt}
                </p>
              </div>
              {project.status && (
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  {getStatusLabel(project.status, locale)}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {project.tags.slice(0, 6).map(tag => (
                <span
                  key={`${project.id}-${tag}`}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-[#0b1524] border border-white/10 text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center text-xs font-semibold text-white py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 transition-colors"
                >
                  Demo
                </a>
              )}
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center text-xs font-semibold text-white py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 transition-colors"
              >
                Repo
              </a>
            </div>
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-gray-500 text-sm py-10">
            {locale === 'en'
              ? 'No projects match your search.'
              : 'Nenhum projeto encontrado para sua busca.'}
          </div>
        )}
      </div>
    </div>
  );
}

<style jsx>{`
  .custom-scroll::-webkit-scrollbar {
    width: 8px;
  }
  .custom-scroll::-webkit-scrollbar-track {
    background: rgba(148, 163, 184, 0.12);
    border-radius: 99px;
  }
  .custom-scroll::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, rgba(56, 189, 248, 0.6), rgba(168, 85, 247, 0.6));
    border-radius: 99px;
  }
  .custom-scroll::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, rgba(6, 182, 212, 0.8), rgba(168, 85, 247, 0.8));
  }
`}</style>;

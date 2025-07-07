'use client';

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  LuArrowRight,
  LuBraces,
  LuBriefcase,
  LuChevronDown,
  LuCode,
  LuExternalLink,
  LuGithub,
  LuGraduationCap,
  LuHeartHandshake,
  LuLinkedin,
  LuMail,
  LuStar,
  LuUser,
} from 'react-icons/lu';
import { ExperienceTimeline, ProfileHeader, Section, SkillsGrid } from '@/components/about';
import InterestsTabs from '@/components/interests/InterestsTabs';
import { GradientCardWithPattern } from '@/components/ui/GradientCard';
import { aboutTestimonials } from '@/constants/aboutTestimonials';
import { academicExperiences } from '@/constants/academicExperiences';
import { jobExperiences } from '@/constants/jobExperiences';
import { projects } from '@/constants/projects';
import { skillsData } from '@/constants/skillsData';

const interests = [
  'Desenvolvimento Web',
  'UX/UI Design',
  'Sistemas Embarcados',
  'Automação',
  'Música',
  'Jogos',
  'Academia',
];

const achievements = [
  {
    title: '🌐 Fã de Open Source',
    description:
      'Contribuições ativas para projetos da comunidade e compartilhamento de conhecimento',
    icon: <LuGithub className="text-blue-500 dark:text-blue-400 text-2xl" />,
    stat: 'Ativo',
    statLabel: 'Colaborador',
  },
  {
    title: '🛠️ Stack Técnico',
    description: 'React · Next.js · Node.js · TypeScript · SQL · Python',
    icon: <LuBraces className="text-emerald-500 dark:text-emerald-400 text-2xl" />,
    stat: 'Full-stack',
    statLabel: 'Developer',
  },
];

export default function AboutClient() {
  const profileRef = useRef(null);
  const skillsRef = useRef(null);
  const projectsRef = useRef(null);
  const experienceRef = useRef(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Profile section animations
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isProfileInView = useInView(profileRef, { once: true, amount: 0.3 });
  const isSkillsInView = useInView(skillsRef, { once: true, amount: 0.2 });
  const isProjectsInView = useInView(projectsRef, { once: true, amount: 0.2 });
  const isExperienceInView = useInView(experienceRef, { once: true, amount: 0.2 });

  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % aboutTestimonials.length);
    }, 8000); // Rotate every 8 seconds

    return () => clearInterval(interval);
  }, []);

  // Sort skills for better display
  const sortedSkills = [...skillsData].sort(
    (a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (a.order || 999) - (b.order || 999)
  );

  // Select featured projects
  const featuredProjects = projects
    .filter(project => project.featured)
    .slice(0, 3)
    .map(project => ({
      ...project,
      highlight: project.id === 'windows-xp-online' ? 'Projeto Destaque' : null,
    }));

  return (
    <>
      {/* Simplified Hero Banner */}
      <motion.div className="relative w-full h-[50vh] mb-12 bg-gradient-to-br from-[color:var(--primary)]/90 to-[color:var(--blue)]/90 overflow-hidden">
        {/* Simplified background */}
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10 bg-repeat"></div>
        <div className="max-w-4xl mx-auto px-4 h-full flex flex-col justify-center items-center text-white text-center relative z-10">
          {/* Simplified heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg"
          >
            <span className="inline-block">Olá, eu sou </span>
            <span className="inline-block text-[color:var(--amber)]">Lucas HDO</span>
          </motion.div>

          <motion.p
            className="text-xl md:text-2xl max-w-3xl leading-relaxed mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Transformando ideias em experiências digitais impactantes
          </motion.p>

          {/* Simplified buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Link
                href="#projects"
                className="bg-white text-[color:var(--primary)] px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-white/90 transition-all hover:shadow-lg group"
              >
                Ver Projetos
                <LuArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <Link
                href="/contact"
                className="border-2 border-white/60 px-6 py-[10px] rounded-full font-medium hover:bg-white/10 transition-all hover:shadow-lg flex items-center gap-2 group"
              >
                Entre em Contato
                <LuMail className="group-hover:scale-110 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="py-8 max-w-4xl mx-auto px-4">
        {/* Profile Section - Reorganized */}
        <Section id="profile" title="Quem Sou Eu" icon={<LuUser size={24} />}>
          <div ref={profileRef} className="space-y-8">
            {/* Profile header with image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <ProfileHeader
                name="Lucas HDO"
                title="Desenvolvedor Full-stack"
                imageUrl="https://images.unsplash.com/photo-1529421308418-eab98863cee4?q=80&w=1976&auto=format&fit=crop"
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
                Desenvolvedor apaixonado por criar soluções tecnológicas que impactam positivamente
                as pessoas. Com experiência em
                <span className="text-[color:var(--primary)] font-medium">React</span>,
                <span className="text-[color:var(--primary)] font-medium">Next.js</span>,
                <span className="text-[color:var(--primary)] font-medium">Node.js</span> e design de
                interfaces, combino habilidades técnicas e criativas para desenvolver aplicações web
                modernas e intuitivas.
              </p>
              <p>
                Estudante de
                <span className="text-[color:var(--primary)] font-medium">
                  Engenharia de Computação
                </span>
                , estou constantemente buscando aprender novas tecnologias e aprimorar minhas
                habilidades. Acredito que o bom código é aquele que resolve problemas reais de forma
                elegante e eficiente.
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
                <LuGithub size={20} /> GitHub
              </Link>
              <Link
                href="https://linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white dark:bg-gray-800 hover:bg-[color:var(--primary)]/10 shadow-sm hover:shadow-md transition-all px-5 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-[color:var(--primary)] flex items-center gap-2"
              >
                <LuLinkedin size={20} /> LinkedIn
              </Link>
              <Link
                href="mailto:contact@example.com"
                className="bg-white dark:bg-gray-800 hover:bg-[color:var(--primary)]/10 shadow-sm hover:shadow-md transition-all px-5 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-[color:var(--primary)] flex items-center gap-2"
              >
                <LuMail size={20} /> Email
              </Link>
            </motion.div>
            {/* Achievements Section */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                delay: 0.3,
                duration: 0.7,
                type: 'spring',
                stiffness: 80,
                damping: 15,
              }}
            >
              {' '}
              {achievements.map((achievement, index) => {
                // Definindo estilos para cada card
                const cardStyles = [
                  'from-blue-600/25 via-indigo-500/20 to-blue-400/25 border-blue-400/50 hover:border-blue-400/80 dark:from-blue-800/30 dark:to-indigo-900/30',
                  'from-amber-500/25 via-orange-400/20 to-amber-300/25 border-amber-400/50 hover:border-amber-400/80 dark:from-amber-800/30 dark:to-orange-900/30',
                  'from-emerald-600/25 via-teal-500/20 to-emerald-400/25 border-emerald-400/50 hover:border-emerald-400/80 dark:from-emerald-800/30 dark:to-teal-900/30',
                ];

                // Cores para cada tipo de card
                const colors = {
                  text:
                    index === 0
                      ? 'text-blue-600 dark:text-blue-400'
                      : index === 1
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-emerald-600 dark:text-emerald-400',
                  bg: index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-amber-500' : 'bg-emerald-500',
                  ring:
                    index === 0
                      ? 'ring-2 ring-blue-500/60 dark:ring-blue-400/60'
                      : index === 1
                        ? 'ring-2 ring-amber-500/60 dark:ring-amber-400/60'
                        : 'ring-2 ring-emerald-500/60 dark:ring-emerald-400/60',
                  badge:
                    index === 0
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : index === 1
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
                  shadow:
                    index === 0
                      ? '0 0 10px rgba(59, 130, 246, 0.5)'
                      : index === 1
                        ? '0 0 10px rgba(245, 158, 11, 0.5)'
                        : '0 0 10px rgba(16, 185, 129, 0.5)',
                  glow:
                    index === 0
                      ? '0 0 40px rgba(59, 130, 246, 0.3)'
                      : index === 1
                        ? '0 0 40px rgba(245, 158, 11, 0.3)'
                        : '0 0 40px rgba(16, 185, 129, 0.3)',
                  fill: index === 0 ? '#4F46E5' : index === 1 ? '#F59E0B' : '#10B981',
                  underline:
                    index === 0
                      ? 'bg-blue-500/50'
                      : index === 1
                        ? 'bg-amber-500/50'
                        : 'bg-emerald-500/50',
                };

                return (
                  <GradientCardWithPattern
                    key={index}
                    gradientClasses={cardStyles[index]}
                    glowColor={colors.glow}
                    patternFill={colors.fill}
                    delay={0.6}
                    index={index}
                  >
                    <div className="flex gap-5 relative z-10">
                      <div
                        className={`flex-shrink-0 w-16 h-16 bg-white/90 dark:bg-gray-800/70 backdrop-blur-md rounded-xl shadow-lg flex items-center justify-center relative overflow-hidden ${colors.ring} group-hover:shadow-md transition-all duration-300`}
                      >
                        {/* Enhanced inner glow */}
                        <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-white/60 via-transparent to-white/30 group-hover:opacity-50 transition-opacity"></div>

                        {/* Pulse effect on hover */}
                        <div
                          className={`absolute inset-[-1px] rounded-xl scale-0 group-hover:scale-110 opacity-0 group-hover:opacity-40 transition-all duration-700 ${colors.bg}`}
                        ></div>

                        <motion.div
                          animate={{ scale: [1, 1.15, 1], rotate: [0, 3, 0] }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            repeatType: 'reverse',
                            ease: 'easeInOut',
                          }}
                          className={`relative z-10 ${colors.text}`}
                        >
                          {achievement.icon}
                        </motion.div>
                      </div>

                      <div className="flex-grow">
                        <motion.h4
                          className={`font-bold text-xl text-gray-800 dark:text-gray-100 group-hover:translate-y-[-2px] transition-all duration-300`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                        >
                          {achievement.title}

                          {/* Underline effect on hover */}
                          <div
                            className={`h-0.5 w-0 group-hover:w-1/2 transition-all duration-300 mt-0.5 rounded-full ${colors.underline}`}
                          ></div>
                        </motion.h4>

                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 leading-relaxed tracking-wide">
                          {achievement.description}
                        </p>

                        <div className="mt-5 flex items-center">
                          <motion.span
                            className={`text-2xl font-extrabold ${colors.text} relative`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              delay: 1 + index * 0.15,
                              type: 'spring',
                              stiffness: 150,
                            }}
                            whileHover={{
                              scale: 1.08,
                              textShadow: colors.shadow,
                            }}
                          >
                            {achievement.stat}

                            {/* Subtle dot decoration */}
                            <span
                              className={`absolute -right-3 -top-1 h-2 w-2 rounded-full ${colors.bg}`}
                            ></span>
                          </motion.span>

                          <motion.span
                            className={`text-xs ml-4 font-semibold py-1.5 px-4 rounded-full shadow-sm ${colors.badge} group-hover:shadow transition-all duration-300`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.2 + index * 0.15 }}
                            whileHover={{
                              scale: 1.05,
                              x: 3,
                            }}
                          >
                            {achievement.statLabel}
                          </motion.span>
                        </div>
                      </div>
                    </div>
                  </GradientCardWithPattern>
                );
              })}
            </motion.div>
            {/* Simplified testimonial carousel */}
            <div className="relative h-[190px] overflow-hidden">
              <div className="absolute top-0 left-0 w-full">
                <p className="text-gray-600 dark:text-gray-300 italic mb-5 relative pl-2">
                  <span className="text-[color:var(--primary)]/80 text-lg font-serif absolute -left-1">
                    ❝
                  </span>
                  {aboutTestimonials[currentTestimonial].content.pt}
                  <span className="text-[color:var(--primary)]/80 text-lg font-serif">❞</span>
                </p>

                <div className="flex items-center gap-3 mt-4">
                  <div className="relative">
                    <Image
                      src={
                        aboutTestimonials[currentTestimonial].image ?? './placeholder_avatar.png'
                      }
                      alt={aboutTestimonials[currentTestimonial].name}
                      width={48}
                      height={48}
                      className="rounded-full shadow-sm border border-white dark:border-gray-700"
                    />
                  </div>
                  <Link
                    href={aboutTestimonials[currentTestimonial].link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <p className="font-medium">{aboutTestimonials[currentTestimonial].name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {aboutTestimonials[currentTestimonial].role.pt}
                    </p>
                  </Link>
                </div>
              </div>
            </div>

            {/* Simplified navigation dots */}
            <div className="flex justify-center gap-2 mt-4">
              {aboutTestimonials.map((_, index) => (
                <button
                  key={index}
                  aria-label={`Ver testimonial de ${aboutTestimonials[index].name}`}
                  className="group transition-all focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/50 rounded-full"
                  onClick={() => setCurrentTestimonial(index)}
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full transition-all group-hover:scale-125 
                      ${
                        currentTestimonial === index
                          ? 'bg-[color:var(--primary)] shadow-sm'
                          : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                      }`}
                  />
                </button>
              ))}
            </div>

            {/* Automatic toggle indicator */}
            <div className="mt-3 text-center text-xs text-gray-400 dark:text-gray-500">
              Deslizando automaticamente a cada 8s
            </div>
          </div>
        </Section>

        {/* Projects Preview Section */}
        <Section id="projects" title="Projetos Destacados" icon={<LuStar size={24} />}>
          <div ref={projectsRef}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  className="bg-white dark:bg-[color:var(--card)]/50 rounded-xl overflow-hidden shadow-sm group relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{
                    y: -8,
                    transition: { duration: 0.2 },
                    boxShadow: '0 10px 30px -15px rgba(0,0,0,0.2)',
                  }}
                >
                  {project.highlight && (
                    <div className="absolute top-3 right-3 z-20">
                      <span className="bg-[color:var(--amber)] text-black text-xs font-bold px-2 py-1 rounded-full">
                        {project.highlight}
                      </span>
                    </div>
                  )}

                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={project.image || '/logo.png'}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

                    <div className="absolute bottom-0 left-0 p-4 text-white z-10">
                      <h3 className="font-bold text-xl">{project.title}</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.tags?.slice(0, 3).map((tech, i) => (
                          <span
                            key={i}
                            className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {project.description.pt}
                    </p>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex gap-2">
                        <Link
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-[color:var(--primary)] transition-colors"
                        >
                          <LuGithub size={18} />
                        </Link>
                        {project.demoUrl && (
                          <Link
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-[color:var(--primary)] transition-colors"
                          >
                            <LuExternalLink size={18} />
                          </Link>
                        )}
                      </div>
                      <Link
                        href={`/projects/${project.id}`}
                        className="text-sm text-[color:var(--primary)] hover:underline flex items-center gap-1 group/link"
                      >
                        Ver Detalhes
                        <LuArrowRight
                          size={14}
                          className="group-hover/link:translate-x-1 transition-transform"
                        />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="flex justify-center mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={isProjectsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link
                href="/projects"
                className="bg-[color:var(--primary)] text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-[color:var(--primary)]/90 transition-all shadow-lg hover:shadow-[color:var(--primary)]/20 hover:shadow-xl"
              >
                Ver Todos os Projetos <LuArrowRight />
              </Link>
            </motion.div>
          </div>
        </Section>

        {/* Skills Section - Simplified */}
        <Section id="skills" title="Habilidades" icon={<LuCode size={24} />}>
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

        {/* Experience Sections */}
        <Section id="experience" title="Experiência Profissional" icon={<LuBriefcase size={24} />}>
          <div ref={experienceRef}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isExperienceInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <ExperienceTimeline experiences={jobExperiences} type="job" />
            </motion.div>
          </div>
        </Section>

        <Section id="education" title="Formação Acadêmica" icon={<LuGraduationCap size={24} />}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isExperienceInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ExperienceTimeline experiences={academicExperiences} type="academic" />
          </motion.div>
        </Section>

        {/* Interests Section */}
        <Section id="interests" title="Interesses" icon={<LuHeartHandshake size={24} />}>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-300 mb-6"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Apaixonado por tecnologia, também cultivo diversos interesses que me inspiram e me
            ajudam a manter uma perspectiva ampla:
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <InterestsTabs />
          </motion.div>
        </Section>

        {/* Simplified Call to Action */}
        <motion.div
          className="my-16 p-8 rounded-2xl bg-gradient-to-br from-[color:var(--blue)]/90 to-[color:var(--primary)]/90 text-white relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10 bg-repeat"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
            <div className="md:max-w-2xl mb-8 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 relative">
                Vamos trabalhar juntos?
                <motion.span
                  className="absolute -bottom-2 left-0 h-1 bg-white/70 rounded"
                  initial={{ width: 0 }}
                  whileInView={{ width: '100px' }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  viewport={{ once: true }}
                />
              </h2>
              <p className="text-lg mb-6">
                Estou sempre aberto a novos projetos desafiadores e oportunidades para aplicar
                minhas habilidades.
              </p>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <Link
                href="/contact"
                className="bg-white text-[color:var(--primary)] px-8 py-4 rounded-xl font-medium hover:bg-white/90 transition-colors shadow-lg hover:shadow-xl relative z-10 flex items-center gap-2 group"
              >
                Entre em contato
                <LuArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
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

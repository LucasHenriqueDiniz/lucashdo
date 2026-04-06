'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuExternalLink } from 'react-icons/lu';
import { academicExperiences, certificates } from '@/constants/academicExperiences';
import { jobExperiences } from '@/constants/jobExperiences';
import { skillsData } from '@/constants/skillsData';
import { languages } from '@/constants/languages';
import { ContactLinks } from '@/constants/contacts';
import { formatExperienceDates, sortExperiences } from '@/utils/experienceUtils';
import { ExperienceProps } from '@/types/experience.types';
import './CVLayout.css';

// Helper function to calculate duration
function calculateDuration(startDate: string, endDate: string | null | undefined, lang: 'pt' | 'en' = 'pt'): string | null {
  const start = new Date(startDate + '-01');
  const end = endDate ? new Date(endDate + '-01') : new Date();
  
  const years = end.getFullYear() - start.getFullYear();
  const months = end.getMonth() - start.getMonth();
  
  let totalMonths = years * 12 + months;
  if (totalMonths < 0) totalMonths = 0;
  
  if (totalMonths < 12) {
    if (totalMonths === 0) return null;
    if (lang === 'en') {
      return `${totalMonths} ${totalMonths === 1 ? 'month' : 'months'}`;
    }
    return `${totalMonths} ${totalMonths === 1 ? 'mês' : 'meses'}`;
  }
  
  const finalYears = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;
  
  if (remainingMonths === 0) {
    if (lang === 'en') {
      return `${finalYears} ${finalYears === 1 ? 'year' : 'years'}`;
    }
    return `${finalYears} ${finalYears === 1 ? 'ano' : 'anos'}`;
  }
  
  if (lang === 'en') {
    return `${finalYears} ${finalYears === 1 ? 'year' : 'years'} and ${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`;
  }
  return `${finalYears} ${finalYears === 1 ? 'ano' : 'anos'} e ${remainingMonths} ${remainingMonths === 1 ? 'mês' : 'meses'}`;
}

interface CVLayoutProps {
  lang: 'pt' | 'en';
  showAll?: boolean;
}

export default function CVLayout({ lang, showAll = false }: CVLayoutProps) {
  // Filter and sort experiences - ordenar corretamente por data
  // Se showAll é true, mostra tudo; caso contrário, apenas os highlights (showInTimeline !== false)
  const filteredJobs = showAll
    ? jobExperiences
    : jobExperiences.filter(exp => exp.showInTimeline !== false);
  const sortedJobs = sortExperiences([...filteredJobs]);
  
  const filteredAcademic = showAll
    ? academicExperiences
    : academicExperiences.filter(exp => exp.showInTimeline !== false);
  const sortedAcademic = sortExperiences([...filteredAcademic]);

  // Get translated field helper
  const getTranslated = (field: { pt: string; en: string } | string | undefined): string => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    return lang === 'pt' ? field.pt : field.en;
  };

  // Group skills by category, but merge categories with only 1 item into "other"
  const skillsByCategory = skillsData.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<string, typeof skillsData>
  );

  // Merge categories with only 1 item into "other"
  const optimizedSkillsByCategory: Record<string, typeof skillsData> = {};
  const otherSkills: typeof skillsData = [];

  Object.entries(skillsByCategory).forEach(([category, skills]) => {
    if (skills.length === 1 && category !== 'other') {
      otherSkills.push(...skills);
    } else {
      optimizedSkillsByCategory[category] = skills;
    }
  });

  // Add merged "other" skills if any
  if (otherSkills.length > 0) {
    // If "other" already exists, merge; otherwise create it
    if (optimizedSkillsByCategory.other) {
      optimizedSkillsByCategory.other = [...optimizedSkillsByCategory.other, ...otherSkills];
    } else {
      optimizedSkillsByCategory.other = otherSkills;
    }
  }

  // Sort categories to put "other" last
  const sortedCategories = Object.keys(optimizedSkillsByCategory).sort((a, b) => {
    if (a === 'other') return 1;
    if (b === 'other') return -1;
    return 0;
  });

  const categoryLabels = {
    pt: {
      frontend: 'Frontend',
      backend: 'Backend',
      integration: 'Integrações',
      automation: 'Automação',
      ai: 'IA & LLM',
      database: 'Banco de Dados',
      devops: 'DevOps',
      design: 'Design & SEO',
      other: 'Outros',
    },
    en: {
      frontend: 'Frontend',
      backend: 'Backend',
      integration: 'Integration',
      automation: 'Automation',
      ai: 'AI & LLM',
      database: 'Database',
      devops: 'DevOps',
      design: 'Design & SEO',
      other: 'Other',
    },
  };

  return (
    <div className="cv-container">
      {/* Header */}
      <header className="cv-header">
        <div className="cv-header-content">
          <div className="cv-header-top">
            <div className="cv-header-text">
              <h1 className="cv-name">Lucas Henrique Diniz Ostroski</h1>
              <p className="cv-title">
                {lang === 'pt' ? 'Desenvolvedor Full Stack • Especialista em Integrações e Automação' : 'Full Stack Developer • Integration & Automation Specialist'}
              </p>
            </div>
            <div className="cv-photo-wrapper">
              <img src="/selfie.webp" alt="Lucas Hdo" className="cv-photo" />
            </div>
          </div>
          <div className="cv-contact">
            <a href={`mailto:${ContactLinks.email}`} className="cv-contact-link">
              {ContactLinks.email}
            </a>
            <span className="cv-contact-separator">•</span>
            <a href={ContactLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="cv-contact-link">
              WhatsApp
            </a>
            <span className="cv-contact-separator">•</span>
            <a href={ContactLinks.linkedin} target="_blank" rel="noopener noreferrer" className="cv-contact-link">
              LinkedIn
            </a>
            <span className="cv-contact-separator">•</span>
            <a href={ContactLinks.github} target="_blank" rel="noopener noreferrer" className="cv-contact-link">
              GitHub
            </a>
            <span className="cv-contact-separator">•</span>
            <a href={ContactLinks.website} target="_blank" rel="noopener noreferrer" className="cv-contact-link">
              {ContactLinks.website}
            </a>
          </div>
        </div>
      </header>

      {/* Summary */}
      <section className="cv-section" id="cv-about">
        <h2 className="cv-section-title">
          {lang === 'pt' ? 'Sobre' : 'About'}
        </h2>
        <p className="cv-text cv-summary">
          {lang === 'pt'
            ? 'Desenvolvedor Full Stack apaixonado por criar experiências digitais que realmente importam. Com mais de 3 anos de experiência, transformo ideias em produtos funcionais usando React, Next.js e TypeScript. Minha jornada começou no design gráfico, o que me deu uma visão única: não apenas escrevo código que funciona, mas também penso em como as pessoas vão interagir com ele. Trabalho bem tanto sozinho quanto em equipe, sempre buscando entregar valor real e código limpo.'
            : 'Full Stack Developer passionate about creating digital experiences that truly matter. With over 3 years of experience, I turn ideas into functional products using React, Next.js, and TypeScript. My journey started in graphic design, which gave me a unique perspective: I don\'t just write code that works, I also think about how people will interact with it. I work well both independently and in teams, always seeking to deliver real value and clean code.'}
        </p>
      </section>

      {/* Experience */}
      <section className="cv-section" id="cv-experience">
        <h2 className="cv-section-title">
          {lang === 'pt' ? 'Experiência Profissional' : 'Professional Experience'}
        </h2>

        <AnimatePresence>
          {sortedJobs.map((exp: ExperienceProps) => {
            const isHighlight = exp.showInTimeline !== false;
            const duration = calculateDuration(exp.startDate, exp.endDate, lang);
            
            return (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`cv-item ${!isHighlight ? 'cv-item-secondary' : ''}`}
            >
            <div className="cv-item-header">
              <div className="cv-item-title-row">
                <div className="cv-item-title-group">
                  <h3 className="cv-item-title">{getTranslated(exp.title)}</h3>
                  {duration && (
                    <span className="cv-item-duration">
                      {duration}
                    </span>
                  )}
                </div>
                <span className="cv-item-date">
                  {formatExperienceDates(exp.startDate, exp.endDate, lang)}
                </span>
              </div>
              <p className="cv-item-company">{exp.institution}</p>
            </div>
            {exp.description && (
              <p className="cv-item-description">{getTranslated(exp.description)}</p>
            )}
            {exp.tags && exp.tags.length > 0 && (
              <div className="cv-item-tags">
                {exp.tags.slice(0, 6).map((tag, idx) => (
                  <span key={idx} className="cv-tag">
                    {getTranslated(tag.labels)}
                  </span>
                ))}
              </div>
            )}
            </motion.div>
            );
          })}
        </AnimatePresence>
      </section>

      {/* Education */}
      <section className="cv-section" id="cv-education">
        <h2 className="cv-section-title">{lang === 'pt' ? 'Formação Acadêmica' : 'Education'}</h2>
        <AnimatePresence>
          {sortedAcademic.map((exp: ExperienceProps) => {
            const isHighlight = exp.showInTimeline !== false;
            const duration = calculateDuration(exp.startDate, exp.endDate, lang);
            
            return (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`cv-item ${!isHighlight ? 'cv-item-secondary' : ''}`}
            >
            <div className="cv-item-header">
              <div className="cv-item-title-row">
                <div className="cv-item-title-group">
                  <h3 className="cv-item-title">{getTranslated(exp.title)}</h3>
                  {duration && (
                    <span className="cv-item-duration">
                      {duration}
                    </span>
                  )}
                </div>
                <span className="cv-item-date">
                  {formatExperienceDates(exp.startDate, exp.endDate, lang)}
                </span>
              </div>
              <p className="cv-item-company">{exp.institution}</p>
            </div>
            {exp.description && (
              <p className="cv-item-description">{getTranslated(exp.description)}</p>
            )}
            {exp.tags && exp.tags.length > 0 && (
              <div className="cv-item-tags">
                {exp.tags.slice(0, 6).map((tag, idx) => (
                  <span key={idx} className="cv-tag">
                    {getTranslated(tag.labels)}
                  </span>
                ))}
              </div>
            )}
            </motion.div>
            );
          })}
        </AnimatePresence>
      </section>

      {/* Skills */}
      <section className="cv-section" id="cv-skills">
        <h2 className="cv-section-title">{lang === 'pt' ? 'Habilidades Técnicas' : 'Technical Skills'}</h2>
        {sortedCategories.map((category) => {
          const skills = optimizedSkillsByCategory[category];
          return (
          <div key={category} className="cv-skills-group">
            <h3 className="cv-skills-category">
              {categoryLabels[lang][category as keyof typeof categoryLabels.pt] || category}
            </h3>
            <div className="cv-skills-grid">
              {skills.map((skill, idx) => {
                const Icon = skill.icon;
                const hasWorkExp = skill.proexp > 0;
                const hasHobbyExp = skill.proexp === 0 && skill.exp > 0;
                const hobbyYears = skill.proexp === 0 ? Math.round(skill.exp) : 0;
                
                return (
                  <div key={idx} className="cv-skill-item-with-icon">
                    <Icon className="cv-skill-icon" />
                    <span className="cv-skill-name">{skill.name}</span>
                    {(hasWorkExp || hasHobbyExp) && (
                      <span className="cv-skill-exp-text">
                        {hasWorkExp && (
                          <span className="cv-skill-exp-work" title={lang === 'pt' ? `${skill.proexp} ${skill.proexp === 1 ? 'ano' : 'anos'} profissional` : `${skill.proexp} ${skill.proexp === 1 ? 'year' : 'years'} professional`}>
                            {skill.proexp}{lang === 'pt' ? 'a' : 'y'}
                          </span>
                        )}
                        {hasHobbyExp && (
                          <span className="cv-skill-exp-hobby" title={lang === 'pt' ? `${hobbyYears} ${hobbyYears === 1 ? 'ano' : 'anos'} hobby` : `${hobbyYears} ${hobbyYears === 1 ? 'year' : 'years'} hobby`}>
                            {hobbyYears}{lang === 'pt' ? 'a' : 'y'}
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          );
        })}
      </section>

      {/* Languages */}
      <section className="cv-section" id="cv-languages">
        <h2 className="cv-section-title">{lang === 'pt' ? 'Idiomas' : 'Languages'}</h2>
        <div className="cv-languages-list">
          {languages.map((language, idx) => (
            <div key={idx} className="cv-language-item">
              <span className="cv-language-name">{language.name}</span>
              <span className="cv-language-level">{language.levelLabel[lang]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="cv-section" id="cv-projects">
        <h2 className="cv-section-title">{lang === 'pt' ? 'Projetos em Destaque' : 'Featured Projects'}</h2>
        <div className="cv-projects-list">
          <div className="cv-project-item">
            <h3 className="cv-project-title">Heartopia Guide</h3>
            <p className="cv-project-description">
              {lang === 'pt' 
                ? 'Plataforma de conteúdo production-grade construída com Next.js, com roteamento dinâmico, ingestão estruturada de dados, caching e arquitetura focada em SEO.'
                : 'Production-grade content platform built with Next.js, featuring dynamic routing, structured data ingestion, caching and SEO-focused architecture.'}
            </p>
            <a href="https://heartopia.guide" target="_blank" rel="noopener noreferrer" className="cv-project-link">
              <LuExternalLink className="cv-project-link-icon" />
              heartopia.guide
            </a>
          </div>
          
          <div className="cv-project-item">
            <h3 className="cv-project-title">Clearcut</h3>
            <p className="cv-project-description">
              {lang === 'pt'
                ? 'Aplicação desktop para processamento em massa de imagens, automatizando workflows repetitivos usando Electron.'
                : 'Desktop application for bulk image processing, automating repetitive workflows using Electron.'}
            </p>
            <a href="https://github.com/LucasHenriqueDiniz/clearcut" target="_blank" rel="noopener noreferrer" className="cv-project-link">
              <LuExternalLink className="cv-project-link-icon" />
              github.com/LucasHenriqueDiniz/clearcut
            </a>
          </div>
        </div>
        
        <p className="cv-projects-footer">
          {lang === 'pt' ? '+ outros projetos disponíveis em: ' : '+ other projects available at: '}
          <a href="https://lucashdo.com" target="_blank" rel="noopener noreferrer" className="cv-footer-link cv-project-link">
            <LuExternalLink className="cv-project-link-icon" />
            lucashdo.com
          </a>
        </p>
      </section>

      {/* Certificates */}
      {certificates.length > 0 && (
        <section className="cv-section cv-section-compact" id="cv-certificates">
          <h2 className="cv-section-title">
            {lang === 'pt' ? 'Certificações' : 'Certifications'}
          </h2>
          <div className="cv-certificates-grid">
            {certificates.map((cert, idx) => (
              <div key={idx} className="cv-cert-item">
                {cert.url ? (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cv-cert-link-inline"
                  >
                    {cert.title}
                    <LuExternalLink className="cv-cert-icon-small" />
                  </a>
                ) : (
                  <span className="cv-cert-title">{cert.title}</span>
                )}
                <span className="cv-cert-meta">{cert.issuer} • {cert.issueDate}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="cv-footer">
        <p className="cv-footer-text">
          {lang === 'pt'
            ? 'Este currículo foi gerado automaticamente a partir do portfólio em'
            : 'This resume was automatically generated from the portfolio at'}{' '}
          <a href={ContactLinks.website} className="cv-footer-link">
            {ContactLinks.website}
          </a>
        </p>
      </footer>
    </div>
  );
}


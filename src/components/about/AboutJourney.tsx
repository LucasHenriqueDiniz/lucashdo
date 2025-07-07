'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { LuGraduationCap, LuBriefcase, LuCalendar, LuMapPin, LuExternalLink } from 'react-icons/lu';
import { useTranslations } from 'next-intl';

interface JourneyItem {
  id: string;
  title: string;
  organization: string;
  period: string;
  location: string;
  description: string;
  tags: string[];
  link?: string;
  type: 'academic' | 'professional';
}

export default function AboutJourney() {
  const t = useTranslations('About.journey');
  const [activeTab, setActiveTab] = useState<'academic' | 'professional'>('professional');

  const journeyItems: JourneyItem[] = [
    {
      id: '1',
      title: 'Desenvolvedor Full-stack',
      organization: 'Freelancer',
      period: '2022 - Presente',
      location: 'Remoto',
      description:
        'Desenvolvimento de aplicações web completas, desde o design até a implementação e deploy.',
      tags: ['React', 'Next.js', 'Node.js', 'TypeScript'],
      type: 'professional',
    },
    {
      id: '2',
      title: 'Estagiário de Desenvolvimento',
      organization: 'Empresa Tech',
      period: '2021 - 2022',
      location: 'São Paulo, SP',
      description:
        'Desenvolvimento de features para aplicações web, trabalho em equipe e metodologias ágeis.',
      tags: ['JavaScript', 'React', 'Git', 'Agile'],
      type: 'professional',
    },
    {
      id: '3',
      title: 'Engenharia de Computação',
      organization: 'Universidade Federal',
      period: '2020 - Presente',
      location: 'São Paulo, SP',
      description: 'Formação em engenharia com foco em desenvolvimento de software e sistemas.',
      tags: ['Algoritmos', 'Estruturas de Dados', 'Banco de Dados', 'Redes'],
      type: 'academic',
    },
    {
      id: '4',
      title: 'Curso de Desenvolvimento Web',
      organization: 'Plataforma Online',
      period: '2021',
      location: 'Online',
      description: 'Curso completo de desenvolvimento web moderno com as melhores práticas.',
      tags: ['HTML', 'CSS', 'JavaScript', 'React'],
      type: 'academic',
    },
  ];

  const filteredItems = journeyItems.filter(item => item.type === activeTab);

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('professional')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              activeTab === 'professional'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <LuBriefcase className="w-4 h-4" />
              {t('professional')}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('academic')}
            className={`px-6 py-2 rounded-md font-medium transition-all ${
              activeTab === 'academic'
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <LuGraduationCap className="w-4 h-4" />
              {t('academic')}
            </div>
          </button>
        </div>
      </div>

      {/* Journey Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

        <div className="space-y-8">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="relative pl-16"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Timeline dot */}
              <div className="absolute left-6 top-4 w-4 h-4 bg-blue-500 rounded-full border-4 border-white dark:border-gray-900"></div>

              {/* Content card */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-2">
                      {item.organization}
                    </p>
                  </div>
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      <LuExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>

                {/* Period and Location */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <LuCalendar className="w-4 h-4" />
                    <span>{item.period}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <LuMapPin className="w-4 h-4" />
                    <span>{item.location}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  {item.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

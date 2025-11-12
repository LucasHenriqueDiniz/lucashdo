'use client';

import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import React from 'react';
import { useTranslations } from 'next-intl';
import { skillsData, currentlyLearning } from '@/constants';

export default function AboutSkillsVariants() {
  const t = useTranslations('About.skillsHighlight');
  const tExpGraph = useTranslations('ExpGraph');
  
  // Selecionar as melhores tecnologias: featured primeiro, depois por proexp, depois por exp
  const bestSkills = [...skillsData]
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      if ((a.proexp || 0) > (b.proexp || 0)) return -1;
      if ((a.proexp || 0) < (b.proexp || 0)) return 1;
      return (b.exp || 0) - (a.exp || 0);
    })
    .slice(0, 12); // Limitar a 12 skills

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {bestSkills.map((skill, idx) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-2xl blur-lg group-hover:blur-xl transition-all opacity-0 group-hover:opacity-100" />
            <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/30 transition-all text-center">
              <div className="text-5xl mb-3 flex justify-center">
                {React.createElement(skill.icon, {
                  size: 40,
                  color: '#60a5fa',
                })}
              </div>
              <h4 className="font-bold text-sm mb-1 text-white">{skill.name.split(' ')[0]}</h4>
              <p className="text-xs text-gray-500 capitalize">{skill.category}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Currently Learning Section */}
      {currentlyLearning.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20"
        >
          <div className="flex items-center gap-4 mb-4">
            <Lightbulb className="w-8 h-8 text-yellow-400 shrink-0" />
            <div>
              <h3 className="font-bold text-lg mb-1 text-white">{t('alwaysLearning')}</h3>
              <p className="text-gray-400 text-sm">
                {tExpGraph('currentlyLearning')}
              </p>
            </div>
          </div>
          
          {/* Currently Learning Skills Grid */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {currentlyLearning.map((skill, idx) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + idx * 0.1 }}
                className="group relative"
              >
                <div className="relative bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-yellow-400/30 transition-all text-center opacity-75 hover:opacity-100">
                  <div className="text-3xl mb-2 flex justify-center">
                    {React.createElement(skill.icon, {
                      size: 32,
                      color: '#fbbf24',
                    })}
                  </div>
                  <h4 className="font-semibold text-xs text-white">{skill.name}</h4>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

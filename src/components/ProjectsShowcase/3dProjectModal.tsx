'use client';

import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, useMotionTemplate } from 'framer-motion';
import { ExternalLink, Github, X, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/constants/projects';
import { Locale } from '@/lib/i18n/config';
import './3dProjectModal.css';

interface ProjectModalProps {
  project: Project;
  locale: Locale;
  onClose: () => void;
}

const SteamProjectModal = ({ project, locale, onClose }: ProjectModalProps) => {
  // Valores de posição do mouse
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);

  // Valores de rotação
  // Transformando as posições do mouse em valores de rotação
  const rotateX = useTransform(cardY, [-300, 300], [10, -10]); // Valores invertidos para rotação natural
  const rotateY = useTransform(cardX, [-300, 300], [-10, 10]); // Valores invertidos para rotação natural

  // Rotação mais pronunciada para o card
  const cardRotateX = useTransform(cardY, [-300, 300], [15, -15]);
  const cardRotateY = useTransform(cardX, [-300, 300], [-15, 15]);

  // Efeito de brilho/reflexo baseado na rotação
  const sheenX = useTransform(cardRotateY, [-15, 15], ['-100%', '200%']);
  const sheenOpacity = useTransform(cardRotateY, [-15, 0, 15], [0.15, 0.05, 0.15]);

  // Gradiente para o efeito de brilho
  const sheenGradient = useMotionTemplate`linear-gradient(
    55deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, ${sheenOpacity}) 25%,
    rgba(255, 255, 255, ${sheenOpacity}) 75%,
    rgba(255, 255, 255, 0) 100%
  )`;

  // Efeito de sombra que muda com a rotação
  const shadowX = useTransform(cardRotateY, [-15, 15], ['-15px', '15px']);
  const shadowY = useTransform(cardRotateX, [15, -15], ['15px', '-15px']);
  const shadowBlur = useMotionTemplate`${useTransform(cardRotateY, [-15, 0, 15], [10, 25, 10])}px`;

  // Manipuladores de eventos do mouse
  const handleMouseMove = (e: React.MouseEvent) => {
    // Calcula o deslocamento relativo ao centro da tela
    const offsetX = e.clientX - window.innerWidth / 2;
    const offsetY = e.clientY - window.innerHeight / 2;

    cardX.set(offsetX);
    cardY.set(offsetY);
  };

  const handleMouseLeave = () => {
    // Suavemente retorna o cartão à posição original
    cardX.set(0);
    cardY.set(0);
  };

  // Fecha o modal ao clicar fora do card
  const handleOutsideClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('project-modal-overlay')) {
      onClose();
    }
  };

  // Gerencia o scroll do corpo e tecla ESC
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [onClose]);

  return (
    <motion.div
      className="project-modal-overlay"
      onClick={handleOutsideClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Wrapper com perspectiva */}
      <motion.div
        className="project-modal-wrapper"
        style={{ rotateX, rotateY }}
        transition={{ velocity: 0 }}
      >
        {/* Container com rotação pronunciada */}
        <motion.div
          className="project-modal-container"
          style={{
            rotateX: cardRotateX,
            rotateY: cardRotateY,
          }}
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          transition={{ velocity: 0 }}
        >
          {/* Sombra que se move com a rotação */}
          <motion.div
            className="project-modal-shadow"
            style={{
              translateX: shadowX,
              translateY: shadowY,
              boxShadow: useMotionTemplate`0 ${shadowY} ${shadowBlur} rgba(0,0,0,0.6)`,
            }}
          />

          {/* Conteúdo do modal */}
          <motion.div className="project-modal-content">
            {/* Efeito de brilho/reflexo */}
            <motion.div
              className="project-modal-sheen"
              style={{ backgroundImage: sheenGradient, left: sheenX }}
            />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-black/40 backdrop-blur-md rounded-full p-2 hover:bg-black/60 z-10"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Project Content */}
            <div className="flex flex-col h-full p-6">
              {/* Image */}
              <div className="relative w-full h-48 md:h-72 mb-6 rounded-lg overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Project Info */}
              <div className="mb-6">
                {project.featured && (
                  <div className="bg-blue-500/20 text-blue-400 text-xs px-3 py-1 rounded-full inline-block mb-3 w-fit">
                    Featured
                  </div>
                )}

                <h2 className="text-3xl font-bold text-white mb-4">{project.title}</h2>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-black/40 backdrop-blur-md text-white/90 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="text-white/80 leading-relaxed">
                  {project.description[locale] || project.description['en']}
                </p>
              </div>

              {/* Project Links */}
              <div className="flex flex-wrap gap-4 mt-auto">
                <Link
                  href={`/projects/${project.id}`}
                  className="flex items-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                >
                  <span>View details</span>
                  <ArrowRight size={16} />
                </Link>

                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 py-2 px-4 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                  >
                    <Github size={18} />
                    <span>Repository</span>
                  </a>
                )}

                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 py-2 px-4 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
                  >
                    <ExternalLink size={18} />
                    <span>Live demo</span>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default SteamProjectModal;

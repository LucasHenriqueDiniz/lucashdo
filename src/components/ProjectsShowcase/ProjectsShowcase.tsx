'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { useLocale } from 'next-intl';
import { projects, Project } from '@/constants/projects';
import { ArrowRight, Maximize } from 'lucide-react';
import './ProjectsShowcase.css';
import { type Locale } from '@/lib/i18n/config';
import ProjectModal from './3dProjectModal';
import FeaturedProjectCard from './FeaturedProjectCard';

export interface ProjectsShowcaseProps {
  className?: string;
}

const ProjectsShowcase = ({ className = '' }: ProjectsShowcaseProps) => {
  const locale = useLocale() as Locale;
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Debug the selected project
  useEffect(() => {
    console.log('Selected project:', selectedProject?.title);
  }, [selectedProject]);

  // Sort projects to get featured ones first
  const featuredProjects = projects.filter(project => project.featured);
  const regularProjects = projects.filter(project => !project.featured);

  // Get latest featured project
  const latestFeaturedProject = featuredProjects[0];

  // Get the remaining projects for the grid (limit to 8)
  const gridProjects = [...featuredProjects.slice(1, 4), ...regularProjects.slice(0, 5)].slice(
    0,
    8
  );

  // Close modal when pressing escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedProject(null);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // Lock scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  return (
    <section className={`w-full max-w-7xl mx-auto my-24 px-4 sm:px-6 ${className}`}>
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.span
          className="text-muted-foreground block text-lg font-normal mb-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Check out my work
        </motion.span>
        <motion.h2
          className="text-3xl md:text-4xl font-bold"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, delay: 0.7 }}
        >
          <span className="font-extrabold text-white">My </span>
          <span className="text-blue-400">Projects</span>
        </motion.h2>
      </motion.div>
      {/* Grid of projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {gridProjects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            locale={locale}
            isHovered={hoveredCard === project.id}
            onHover={id => setHoveredCard(id)}
            onSelect={setSelectedProject}
          />
        ))}
      </div>
      {/* View all projects link */}
      <div className="flex justify-center mt-12">
        <Link href="/projects" className="group flex items-center text-sm font-medium">
          View all projects
          <motion.span
            className="inline-block ml-1"
            initial={{ x: 0 }}
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowRight size={16} />
          </motion.span>
        </Link>
      </div>
      {/* Latest featured project */}
      {latestFeaturedProject && (
        <motion.div
          className="mt-24 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h3 className="text-2xl font-bold mb-4 md:mb-0">
              <span className="text-blue-400">Featured</span> Project
            </h3>
          </div>

          <FeaturedProjectCard
            project={latestFeaturedProject}
            locale={locale}
            onSelect={setSelectedProject}
          />
        </motion.div>
      )}{' '}
      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            locale={locale}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

// Project card component
const ProjectCard = ({
  project,
  index,
  locale,
  isHovered,
  onHover,
  onSelect,
}: {
  project: Project;
  index: number;
  locale: Locale;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onSelect: (project: Project) => void;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageLayerRef = useRef<HTMLDivElement>(null);
  const contentLayerRef = useRef<HTMLDivElement>(null);
  const [isMouseOver, setIsMouseOver] = useState(false);

  // Steam card style parallax effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || !imageLayerRef.current || !contentLayerRef.current) return;

    const { clientX, clientY } = e;
    const { width, height, left, top } = cardRef.current.getBoundingClientRect();

    // Calculate rotation based on mouse position
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    // Normalize coordinates from -1 to 1
    const normalizedX = (clientX - centerX) / (width / 2);
    const normalizedY = (clientY - centerY) / (height / 2);

    // Calculate rotation with stronger effect (up to 12 degrees)
    const rotateX = normalizedY * -12; // Inverted Y-axis for natural tilt
    const rotateY = normalizedX * 12;

    // Apply 3D rotation to the whole card - more Steam-like
    cardRef.current.style.transform = `
      perspective(1000px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg)
      translateZ(10px)
    `;

    // Move image in opposite direction for enhanced depth
    imageLayerRef.current.style.transform = `
      translateX(${rotateY * -1.2}px) 
      translateY(${rotateX * -1.2}px) 
      scale(1.15)
    `;

    // Move content layer forward with more pronounced effect
    contentLayerRef.current.style.transform = `
      translateX(${rotateY * 0.8}px) 
      translateY(${rotateX * 0.8}px)
      translateZ(50px)
    `;
  };

  // Touch support for mobile
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!cardRef.current || !imageLayerRef.current || !contentLayerRef.current) return;

    // Get the first touch
    const touch = e.touches[0];
    const { clientX, clientY } = touch;
    const { width, height, left, top } = cardRef.current.getBoundingClientRect();

    // Calculate rotation based on touch position
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const rotateX = ((clientY - centerY) / (height / 2)) * -3; // Reduced effect for touch
    const rotateY = ((clientX - centerX) / (width / 2)) * 3;

    // Apply 3D rotation to the whole card
    cardRef.current.style.transform = `
      perspective(1000px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg)
    `;

    // Move image in opposite direction for depth
    imageLayerRef.current.style.transform = `
      translateX(${rotateY * 0.8}px) 
      translateY(${rotateX * 0.8}px) 
      scale(1.05)
    `;

    // Move content layer in same direction but less
    contentLayerRef.current.style.transform = `
      translateX(${rotateY * 0.2}px) 
      translateY(${rotateX * 0.2}px)
    `;

    // Prevent default behavior (scrolling)
    e.preventDefault();
  };

  // Reset effects when mouse/touch leaves
  const handleMouseLeave = () => {
    if (!cardRef.current || !imageLayerRef.current || !contentLayerRef.current) return;

    // Smoothly reset all transforms with a more natural transition
    cardRef.current.style.transition = 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
    imageLayerRef.current.style.transition = 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
    contentLayerRef.current.style.transition = 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)';

    cardRef.current.style.transform = `
      perspective(1000px) 
      rotateX(0deg) 
      rotateY(0deg)
      translateZ(0)
    `;

    imageLayerRef.current.style.transform = 'translateX(0) translateY(0) scale(1)';
    contentLayerRef.current.style.transform = 'translateX(0) translateY(0) translateZ(0)';

    // Reset the transition after animation completes
    setTimeout(() => {
      if (cardRef.current) {
        cardRef.current.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      }
      if (imageLayerRef.current) {
        imageLayerRef.current.style.transition =
          'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      }
      if (contentLayerRef.current) {
        contentLayerRef.current.style.transition =
          'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      }
    }, 800);

    onHover(null);
    setIsMouseOver(false);
  };

  const handleMouseEnter = () => {
    onHover(project.id);
    setIsMouseOver(true);
  };

  // Handle touch start - similar to mouse enter
  const handleTouchStart = () => {
    onHover(project.id);
    setIsMouseOver(true);
  };

  // Handle touch end - similar to mouse leave
  const handleTouchEnd = () => {
    // Small delay for better UX
    setTimeout(() => {
      handleMouseLeave();
    }, 100);
  };

  // Handle keyboard events for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(project);
    }
  };

  return (
    <motion.div
      className="project-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: 0.1 * Math.min(index, 5),
        ease: 'easeOut',
      }}
    >
      {' '}
      <div
        ref={cardRef}
        className={`project-card-container ${isMouseOver ? 'mouse-over' : ''}`}
        onClick={() => {
          console.log('Project card clicked:', project.title);
          onSelect(project);
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`View project: ${project.title}`}
      >
        {/* Background image layer */}
        <div ref={imageLayerRef} className="project-card-image-layer">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="project-card-image"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="project-card-overlay" />
        </div>

        {/* Content layer */}
        <div ref={contentLayerRef} className="project-card-content-layer">
          <div className="project-card-top">
            <h3 className="project-card-title">{project.title}</h3>
            <div className="project-card-tags">
              {project.tags.slice(0, 2).map(tag => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 bg-black/40 backdrop-blur-md text-white/90 rounded-full"
                >
                  {tag}
                </span>
              ))}
              {project.tags.length > 2 && (
                <span className="text-xs px-2 py-0.5 bg-black/40 backdrop-blur-md text-white/90 rounded-full">
                  +{project.tags.length - 2}
                </span>
              )}
            </div>
          </div>

          <div className="project-card-expand">
            <Maximize />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// No additional component definition needed as we're using the imported FeaturedProjectCard

export default ProjectsShowcase;

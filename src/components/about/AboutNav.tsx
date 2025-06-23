'use client';

import React, { useEffect, useState } from 'react';
import { LuUser, LuBriefcase, LuGraduationCap, LuCode, LuHeartHandshake } from 'react-icons/lu';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

function NavItem({ icon, label, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        active ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
      }`}
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </button>
  );
}

export default function AboutNav() {
  const [activeSection, setActiveSection] = useState('profile');

  // Update active section based on scroll position
  useEffect(() => {
    const sections = [
      { id: 'profile', element: document.getElementById('profile') },
      { id: 'skills', element: document.getElementById('skills') },
      { id: 'experience', element: document.getElementById('experience') },
      { id: 'education', element: document.getElementById('education') },
      { id: 'interests', element: document.getElementById('interests') },
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.element && section.element.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth',
      });
      setActiveSection(id);
    }
  };

  return (
    <nav className="sticky top-[--navbar-height] z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm py-2 border-b border-gray-200 dark:border-gray-800 mb-8">
      <div className="max-w-4xl mx-auto flex justify-between px-4">
        <div className="flex gap-2">
          <NavItem
            icon={<LuUser />}
            label="Perfil"
            active={activeSection === 'profile'}
            onClick={() => scrollToSection('profile')}
          />
          <NavItem
            icon={<LuCode />}
            label="Habilidades"
            active={activeSection === 'skills'}
            onClick={() => scrollToSection('skills')}
          />
          <NavItem
            icon={<LuBriefcase />}
            label="Experiência"
            active={activeSection === 'experience'}
            onClick={() => scrollToSection('experience')}
          />
          <NavItem
            icon={<LuGraduationCap />}
            label="Formação"
            active={activeSection === 'education'}
            onClick={() => scrollToSection('education')}
          />
          <NavItem
            icon={<LuHeartHandshake />}
            label="Interesses"
            active={activeSection === 'interests'}
            onClick={() => scrollToSection('interests')}
          />
        </div>
      </div>
    </nav>
  );
}

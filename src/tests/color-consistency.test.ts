/**
 * Color Consistency Verification Test
 * Task 5.2: Verify color consistency across both pages
 * 
 * This test verifies that the color scheme is consistent across:
 * - HeroBrowser (homepage)
 * - Projects Page (/projects)
 * - Shared components (ProjectCard, ProjectGrid, ProjectStats, ProjectFilters)
 * 
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

// Define the expected color palette
const EXPECTED_COLORS = {
  primary: '#0184FC',
  secondary: '#00D4FF',
  dark: '#001F3F',
  glassBg: 'white/10',
  glassBorder: 'white/20',
  hoverShadow: 'blue-500/20',
  hoverBorder: 'blue-500/40',
};

// Files to check for color consistency
const FILES_TO_CHECK = [
  'src/components/home/HeroBrowser/HeroBrowser.tsx',
  'src/components/home/HeroBrowser/HeroBrowser.css',
  'src/components/projects/ProjectCard.tsx',
  'src/components/projects/ProjectGrid.tsx',
  'src/components/projects/ProjectStats.tsx',
  'src/components/projects/ProjectFilters.tsx',
  'src/app/projects/client.tsx',
];

describe('Color Consistency Verification', () => {
  describe('Requirement 11.1: Primary color (#0184FC) for interactive elements', () => {
    it('should use #0184FC in HeroBrowser Grainient', () => {
      const content = readFileSync(join(process.cwd(), 'src/components/home/HeroBrowser/HeroBrowser.tsx'), 'utf-8');
      expect(content).toContain('color1="#0184FC"');
    });

    it('should define --primary: #0184FC in CSS custom properties', () => {
      const content = readFileSync(join(process.cwd(), 'src/components/home/HeroBrowser/HeroBrowser.css'), 'utf-8');
      expect(content).toContain('--primary: #0184FC');
    });

    it('should use blue-500 for active states in ProjectFilters', () => {
      const content = readFileSync(join(process.cwd(), 'src/components/projects/ProjectFilters.tsx'), 'utf-8');
      expect(content).toContain('bg-blue-500');
    });

    it('should use blue-400 for hover text in ProjectCard', () => {
      const content = readFileSync(join(process.cwd(), 'src/components/projects/ProjectCard.tsx'), 'utf-8');
      expect(content).toContain('group-hover:text-blue-400');
    });
  });

  describe('Requirement 11.2: Secondary color (#00D4FF) for accents', () => {
    it('should use #00D4FF in HeroBrowser Grainient', () => {
      const content = readFileSync(join(process.cwd(), 'src/components/home/HeroBrowser/HeroBrowser.tsx'), 'utf-8');
      expect(content).toContain('color2="#00D4FF"');
    });

    it('should define --secondary: #00D4FF in CSS custom properties', () => {
      const content = readFileSync(join(process.cwd(), 'src/components/home/HeroBrowser/HeroBrowser.css'), 'utf-8');
      expect(content).toContain('--secondary: #00D4FF');
    });
  });

  describe('Requirement 11.3: Dark color (#001F3F) for backgrounds', () => {
    it('should use #001F3F in HeroBrowser Grainient', () => {
      const content = readFileSync(join(process.cwd(), 'src/components/home/HeroBrowser/HeroBrowser.tsx'), 'utf-8');
      expect(content).toContain('color3="#001F3F"');
    });

    it('should define --dark: #001F3F in CSS custom properties', () => {
      const content = readFileSync(join(process.cwd(), 'src/components/home/HeroBrowser/HeroBrowser.css'), 'utf-8');
      expect(content).toContain('--dark: #001F3F');
    });
  });

  describe('Requirement 11.4: Glassmorphism white/10 for card backgrounds', () => {
    it('should use white/10 in ProjectCard background', () => {
      const content = readFileSync(join(process.cwd(), 'src/components/projects/ProjectCard.tsx'), 'utf-8');
      expect(content).toContain('bg-white/10');
    });

    it('should use backdrop-blur-md in ProjectCard', () => {
      const content = readFileSync(join(process.cwd(), 'src/components/projects/ProjectCard.tsx'), 'utf-8');
      expect(content).toContain('backdrop-blur-md');
    });

    it('should define --glass-bg in CSS custom properties', () => {
      const content = readFileSync(join(process.cwd(), 'src/components/home/HeroBrowser/HeroBrowser.css'), 'utf-8');
      expect(content).toContain('--glass-bg: rgba(255, 255, 255, 0.1)');
    });
  });

  describe('Requirement 11.5: Glassmorphism white/20 for card borders', () => {
    it('should use white/20 in ProjectCard border', () => {
      const content = readFileSync(join(process.cwd(), 'src/components/projects/ProjectCard.tsx'), 'utf-8');
      expect(content).toContain('border-white/20');
    });

    it('should define --glass-border in CSS custom properties', () => {
      const content = readFileSync(join(process.cwd(), 'src/components/home/HeroBrowser/HeroBrowser.css'), 'utf-8');
      expect(content).toContain('--glass-border: rgba(255, 255, 255, 0.2)');
    });
  });

  describe('Requirement 11.6: Blue-500/20 for hover shadow effects', () => {
    it('should use shadow-blue-500/20 in ProjectCard hover', () => {
      const content = readFileSync(join(process.cwd(), 'src/components/projects/ProjectCard.tsx'), 'utf-8');
      expect(content).toContain('shadow-blue-500/20');
    });

    it('should use shadow-blue-500/20 in ProjectStats hover', () => {
      const content = readFileSync(join(process.cwd(), 'src/components/projects/ProjectStats.tsx'), 'utf-8');
      expect(content).toContain('shadow-blue-500/20');
    });
  });

  describe('Requirement 11.7: Blue-500/40 for hover border effects', () => {
    it('should use border-blue-500/40 in ProjectCard hover', () => {
      const content = readFileSync(join(process.cwd(), 'src/components/projects/ProjectCard.tsx'), 'utf-8');
      expect(content).toContain('border-blue-500/40');
    });

    it('should use border-blue-500/40 in ProjectStats hover', () => {
      const content = readFileSync(join(process.cwd(), 'src/components/projects/ProjectStats.tsx'), 'utf-8');
      expect(content).toContain('border-blue-500/40');
    });
  });

  describe('Cross-component color consistency', () => {
    it('should use consistent blue shades across all components', () => {
      const projectCard = readFileSync(join(process.cwd(), 'src/components/projects/ProjectCard.tsx'), 'utf-8');
      const projectFilters = readFileSync(join(process.cwd(), 'src/components/projects/ProjectFilters.tsx'), 'utf-8');
      const projectStats = readFileSync(join(process.cwd(), 'src/components/projects/ProjectStats.tsx'), 'utf-8');

      // All should use blue-500 for primary interactive elements
      expect(projectFilters).toContain('bg-blue-500');
      
      // All should use blue-400 for hover states
      expect(projectCard).toContain('text-blue-400');
      expect(projectFilters).toContain('text-blue-400');
      
      // All should use blue-300 for secondary text
      expect(projectCard).toContain('text-blue-300');
    });

    it('should use consistent glassmorphism across all card components', () => {
      const projectCard = readFileSync(join(process.cwd(), 'src/components/projects/ProjectCard.tsx'), 'utf-8');
      const projectStats = readFileSync(join(process.cwd(), 'src/components/projects/ProjectStats.tsx'), 'utf-8');

      // Both should use white/10 background
      expect(projectCard).toContain('bg-white/10');
      expect(projectStats).toContain('from-white/5 to-white/10');
      
      // Both should use backdrop-blur
      expect(projectCard).toContain('backdrop-blur-md');
      expect(projectStats).toContain('backdrop-blur-md');
      
      // Both should use white/20 border
      expect(projectCard).toContain('border-white/20');
      expect(projectStats).toContain('border-white/20');
    });

    it('should use consistent hover effects across interactive elements', () => {
      const projectCard = readFileSync(join(process.cwd(), 'src/components/projects/ProjectCard.tsx'), 'utf-8');
      const projectStats = readFileSync(join(process.cwd(), 'src/components/projects/ProjectStats.tsx'), 'utf-8');

      // Both should use shadow-blue-500/20 on hover
      expect(projectCard).toContain('shadow-blue-500/20');
      expect(projectStats).toContain('shadow-blue-500/20');
      
      // Both should use border-blue-500/40 on hover
      expect(projectCard).toContain('border-blue-500/40');
      expect(projectStats).toContain('border-blue-500/40');
    });
  });

  describe('HeroBrowser and Projects Page consistency', () => {
    it('should use same Grainient colors in HeroBrowser', () => {
      const heroBrowser = readFileSync(join(process.cwd(), 'src/components/home/HeroBrowser/HeroBrowser.tsx'), 'utf-8');
      
      expect(heroBrowser).toContain('color1="#0184FC"');
      expect(heroBrowser).toContain('color2="#00D4FF"');
      expect(heroBrowser).toContain('color3="#001F3F"');
    });

    it('should use shared ProjectCard component in both pages', () => {
      const heroBrowser = readFileSync(join(process.cwd(), 'src/components/home/HeroBrowser/HeroBrowser.tsx'), 'utf-8');
      const projectsPage = readFileSync(join(process.cwd(), 'src/app/projects/client.tsx'), 'utf-8');
      
      // Both should import from shared components
      expect(heroBrowser).toContain("from '@/components/projects'");
      expect(projectsPage).toContain("from '@/components/projects'");
      
      // Both should use ProjectGrid
      expect(heroBrowser).toContain('<ProjectGrid');
      expect(projectsPage).toContain('<ProjectGrid');
    });

    it('should use consistent tag styling across both pages', () => {
      const projectCard = readFileSync(join(process.cwd(), 'src/components/projects/ProjectCard.tsx'), 'utf-8');
      
      // Tags should use blue-500/10 background and blue-300 text
      expect(projectCard).toContain('bg-blue-500/10');
      expect(projectCard).toContain('text-blue-300');
      expect(projectCard).toContain('border-blue-500/20');
    });
  });

  describe('CSS custom properties consistency', () => {
    it('should define all required CSS custom properties', () => {
      const css = readFileSync(join(process.cwd(), 'src/components/home/HeroBrowser/HeroBrowser.css'), 'utf-8');
      
      expect(css).toContain('--primary: #0184FC');
      expect(css).toContain('--secondary: #00D4FF');
      expect(css).toContain('--dark: #001F3F');
      expect(css).toContain('--glass-bg: rgba(255, 255, 255, 0.1)');
      expect(css).toContain('--glass-border: rgba(255, 255, 255, 0.2)');
    });
  });
});

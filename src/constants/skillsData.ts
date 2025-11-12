import { BsAndroid2 } from 'react-icons/bs';
import {
  SiAdobeillustrator,
  SiAdobephotoshop,
  SiDocker,
  SiElectron,
  SiFigma,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRedis,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVitest,
  SiFramer,
  SiRust,
  SiGo,
  SiSelenium,
} from 'react-icons/si';
import { LuBrain } from 'react-icons/lu';

type category =
  | 'frontend'
  | 'backend'
  | 'mobile'
  | 'desktop'
  | 'devops'
  | 'database'
  | 'tools'
  | 'design'
  | 'other';

export interface SkillDataType {
  name: string;
  exp: number;      // proficiency (0–5)
  proexp: number;   // years in production (0 | 1 | 1.5 | 2)
  icon: React.ElementType;
  category: category;
  featured?: boolean;
  order?: number;
}

export const skillsData: SkillDataType[] = [
  // — Core Frontend
  { name: 'TypeScript',    exp: 3.5, proexp: 2,   icon: SiTypescript,  category: 'frontend', featured: true, order: 1 },
  { name: 'React',         exp: 3.5, proexp: 2,   icon: SiReact,       category: 'frontend', featured: true, order: 2 },
  { name: 'Next.js',       exp: 3.5, proexp: 1.5, icon: SiNextdotjs,   category: 'frontend', featured: true, order: 3 },
  { name: 'Tailwind CSS',  exp: 3.5, proexp: 1.5, icon: SiTailwindcss, category: 'frontend', order: 4 },
  { name: 'Framer Motion', exp: 3.0, proexp: 1,   icon: SiFramer,      category: 'frontend', order: 5 },
  { name: 'Zustand',       exp: 3.0, proexp: 1,   icon: LuBrain,       category: 'frontend', order: 6 },

  // — Backend / Runtime
  { name: 'Node.js',       exp: 3.0, proexp: 2,   icon: SiNodedotjs,   category: 'backend', featured: true, order: 7 },
  { name: 'Python',        exp: 2.0, proexp: 2.5, icon: SiPython,      category: 'backend', order: 8 },

  // — Data & Storage
  { name: 'PostgreSQL',    exp: 1.5, proexp: 2.5, icon: SiPostgresql,  category: 'database', featured: true, order: 9 },
  { name: 'Supabase',      exp: 2.5, proexp: 0,   icon: SiSupabase,    category: 'database', order: 11 },
  { name: 'Redis',         exp: 2.0, proexp: 0,   icon: SiRedis,       category: 'database', order: 12 },

  // — DevOps / Deploy
  { name: 'Docker',        exp: 0, proexp: 2,   icon: SiDocker,      category: 'devops', order: 13 },
  { name: 'Vercel',        exp: 3, proexp:2,   icon: SiVercel,      category: 'devops', order: 14 },

  // — QA / DX
    { name: 'Vitest',        exp: 1.0, proexp: 1,   icon: SiVitest,      category: 'tools', order: 15 },
  { name: 'Selenium',      exp: 1.0, proexp: 0,   icon: SiSelenium,    category: 'other', order: 16 },
  

  // — Mobile & Desktop & Design
  { name: 'React Native',  exp: 2.5, proexp: 1,   icon: BsAndroid2,    category: 'mobile',  order: 17 },
  { name: 'Electron',      exp: 2.5, proexp: 1,   icon: SiElectron,    category: 'desktop', order: 18 },
  { name: 'Figma',         exp: 1.0, proexp: 2,   icon: SiFigma,       category: 'design',  order: 19 },
  { name: 'Photoshop',     exp: 4.0, proexp: 2,   icon: SiAdobephotoshop, category: 'design', order: 20 },
  { name: 'Illustrator',   exp: 3.5, proexp: 1,   icon: SiAdobeillustrator, category: 'design', order: 21 },
];

// — Máx. 3 — só o que você quer evoluir agora.
export const currentlyLearning: SkillDataType[] = [
  { name: 'Go',    exp: 1, proexp: 0, icon: SiGo,    category: 'backend', order: 1 },
  { name: 'Rust',  exp: 1, proexp: 0, icon: SiRust,  category: 'backend', order: 2 },
  { name: 'Animation', exp: 1, proexp: 0, icon: SiFramer, category: 'other', order: 3 },
];

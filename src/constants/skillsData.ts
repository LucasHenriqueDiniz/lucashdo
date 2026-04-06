import { BsAndroid2 } from 'react-icons/bs';
import {
  SiDocker,
  SiElectron,
  SiFigma,
  SiGithubactions,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenai,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiReact,
  SiRedis,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVite,
  SiFramer,
  SiRust,
  SiGo,
} from 'react-icons/si';
import { TbApi, TbWebhook, TbSeo, TbBrowserCheck } from 'react-icons/tb';
import { LuBrain, LuWorkflow } from 'react-icons/lu';

type category =
  | 'frontend'
  | 'backend'
  | 'integration'
  | 'automation'
  | 'ai'
  | 'mobile'
  | 'desktop'
  | 'devops'
  | 'database'
  | 'design'
  | 'tools'
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
  // Frontend (max 4)
  { name: 'TypeScript',    exp: 3.5, proexp: 2.5, icon: SiTypescript,  category: 'frontend', featured: true, order: 1 },
  { name: 'React',         exp: 3.5, proexp: 2.5, icon: SiReact,       category: 'frontend', featured: true, order: 2 },
  { name: 'Next.js',       exp: 3.5, proexp: 2,   icon: SiNextdotjs,   category: 'frontend', featured: true, order: 3 },
  { name: 'Tailwind CSS',  exp: 3.5, proexp: 2,   icon: SiTailwindcss, category: 'frontend', order: 4 },

  // Backend (max 4)
  { name: 'Node.js',       exp: 3.5, proexp: 2.5, icon: SiNodedotjs,   category: 'backend',  featured: true, order: 5 },
  { name: 'Python',        exp: 3.0, proexp: 2,   icon: SiPython,      category: 'backend',  order: 6 },
  { name: 'Prisma',        exp: 3.0, proexp: 1.5, icon: SiPrisma,      category: 'backend',  order: 7 },

  // Integration (max 4)
  { name: 'REST APIs',     exp: 3.5, proexp: 2.5, icon: TbApi,         category: 'integration', featured: true, order: 8 },
  { name: 'Webhooks',      exp: 3.0, proexp: 1.5, icon: TbWebhook,     category: 'integration', order: 9 },

  // Automation (max 4)
  { name: 'GitHub Actions', exp: 3.0, proexp: 1.5, icon: SiGithubactions, category: 'automation', featured: true, order: 10 },
  { name: 'Workflow Automation', exp: 3.5, proexp: 2, icon: LuWorkflow, category: 'automation', order: 11 },
  { name: 'Playwright',    exp: 2.5, proexp: 1,   icon: TbBrowserCheck,  category: 'automation', order: 12 },

  // AI & LLM (max 4)
  { name: 'LLM Integration', exp: 2.5, proexp: 0.5, icon: SiOpenai,    category: 'ai', featured: true, order: 13 },
  { name: 'Ollama',        exp: 2.0, proexp: 0,   icon: LuBrain,       category: 'ai', order: 14 },

  // Database (max 4)
  { name: 'PostgreSQL',    exp: 3.5, proexp: 2,   icon: SiPostgresql,  category: 'database', featured: true, order: 15 },
  { name: 'Supabase',      exp: 3.0, proexp: 1.5, icon: SiSupabase,    category: 'database', order: 16 },
  { name: 'Redis',         exp: 2.5, proexp: 1,   icon: SiRedis,       category: 'database', order: 17 },

  // DevOps (max 4)
  { name: 'Vercel',        exp: 3.5, proexp: 2.5, icon: SiVercel,      category: 'devops',   order: 18 },
  { name: 'Docker',        exp: 2.0, proexp: 1,   icon: SiDocker,      category: 'devops',   order: 19 },
  { name: 'Vite',          exp: 3.0, proexp: 2,   icon: SiVite,        category: 'devops',   order: 20 },

  // Design (max 4)
  { name: 'Figma',         exp: 3.0, proexp: 2.5, icon: SiFigma,       category: 'design',  order: 21 },
  { name: 'SEO',           exp: 3.0, proexp: 1.5, icon: TbSeo,         category: 'design',  order: 22 },

  // Other (max 4)
  { name: 'Electron',      exp: 2.5, proexp: 1,   icon: SiElectron,    category: 'other', order: 23 },
  { name: 'React Native',  exp: 2.5, proexp: 1,   icon: BsAndroid2,    category: 'other', order: 24 },
];

export const currentlyLearning: SkillDataType[] = [
  { name: 'Go',    exp: 1, proexp: 0, icon: SiGo,     category: 'backend', order: 1 },
  { name: 'Rust',  exp: 1, proexp: 0, icon: SiRust,   category: 'backend', order: 2 },
  { name: 'Framer Motion', exp: 2, proexp: 0, icon: SiFramer, category: 'frontend', order: 3 },
];

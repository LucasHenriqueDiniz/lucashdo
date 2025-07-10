import { BsAndroid2 } from 'react-icons/bs';
import { FaAws } from 'react-icons/fa';
import { IoLogoElectron, IoLogoFirebase } from 'react-icons/io5';
import {
  SiAdobeaftereffects,
  SiAdobeillustrator,
  SiAdobephotoshop,
  SiC,
  SiCss3,
  SiDocker,
  SiEslint,
  SiEspressif,
  SiExpo,
  SiFigma,
  SiGit,
  SiGooglecloudstorage,
  SiHtml5,
  SiI18Next,
  SiJavascript,
  SiLinux,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPhp,
  SiPrettier,
  SiPrisma,
  SiPython,
  SiReact,
  SiReactos,
  SiRedux,
  SiSupabase,
  SiTailwindcss,
  SiTauri,
  SiTypescript,
  SiVite,
} from 'react-icons/si';
import { TbDeviceHeartMonitor } from 'react-icons/tb';
import ZustandIcon from '@/components/zustandIcon/ZustandIcon';

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
  exp: number;
  proexp: number;
  icon: React.ElementType;
  category: category;
  featured?: boolean;
  order?: number;
}

export const skillsData: SkillDataType[] = [
  // Top 7 Destaque
  {
    name: 'JavaScript',
    exp: 5,
    proexp: 4,
    icon: SiJavascript,
    category: 'frontend',
    featured: true,
    order: 1,
  },
  {
    name: 'HTML',
    exp: 5,
    proexp: 4,
    icon: SiHtml5,
    category: 'frontend',
    featured: true,
    order: 2,
  },
  { name: 'CSS', exp: 5, proexp: 4, icon: SiCss3, category: 'frontend', order: 3 },
  {
    name: 'TypeScript',
    exp: 3,
    proexp: 2,
    icon: SiTypescript,
    category: 'frontend',
    featured: true,
    order: 4,
  },
  {
    name: 'Python',
    exp: 2,
    proexp: 2,
    icon: SiPython,
    category: 'backend',
    featured: true,
    order: 5,
  },
  { name: 'PHP', exp: 1, proexp: 0, icon: SiPhp, category: 'backend', order: 6 },
  {
    name: 'Next.js',
    exp: 2,
    proexp: 2,
    icon: SiNextdotjs,
    category: 'frontend',
    featured: true,
    order: 7,
  },
  {
    name: 'React',
    exp: 4,
    proexp: 3,
    icon: SiReact,
    category: 'frontend',
    featured: true,
    order: 8,
  },
  {
    name: 'Node.js',
    exp: 3,
    proexp: 2,
    icon: SiNodedotjs,
    category: 'backend',
    featured: true,
    order: 9,
  },

  // Mobile
  {
    name: 'React Native',
    exp: 2,
    proexp: 1,
    icon: BsAndroid2,
    category: 'mobile',
    featured: true,
    order: 10,
  },
  { name: 'Expo', exp: 1, proexp: 1, icon: SiExpo, category: 'mobile', order: 11 },

  // DevOps
  {
    name: 'Docker',
    exp: 1,
    proexp: 1,
    icon: SiDocker,
    category: 'devops',
    featured: true,
    order: 12,
  },
  { name: 'AWS', exp: 1, proexp: 1, icon: FaAws, category: 'devops', order: 13 },

  // Database
  { name: 'Prisma', exp: 1, proexp: 1, icon: SiPrisma, category: 'database', order: 14 },
  { name: 'MongoDB', exp: 1, proexp: 0.5, icon: SiMongodb, category: 'database', order: 15 },
  { name: 'Supabase', exp: 1, proexp: 0, icon: SiSupabase, category: 'database', order: 16 },
  { name: 'Firebase', exp: 1, proexp: 0, icon: IoLogoFirebase, category: 'database', order: 17 },
  { name: 'MySQL', exp: 1, proexp: 1, icon: SiMysql, category: 'database', order: 18 },
  { name: 'C', exp: 1, proexp: 0.5, icon: SiC, category: 'backend', order: 19 },

  // Frontend extras
  { name: 'ViteJS', exp: 1, proexp: 0.5, icon: SiVite, category: 'frontend', order: 20 },
  { name: 'Redux', exp: 1, proexp: 1, icon: SiRedux, category: 'frontend', order: 21 },
  { name: 'Tailwind CSS', exp: 1, proexp: 1, icon: SiTailwindcss, category: 'frontend', order: 22 },
  { name: 'Zustand', exp: 1, proexp: 0, icon: ZustandIcon, category: 'frontend', order: 23 },
  { name: 'React Flow', exp: 1, proexp: 0, icon: SiReactos, category: 'frontend', order: 24 },

  // Tools & CI/CD
  { name: 'Git', exp: 1, proexp: 2, icon: SiGit, category: 'tools', order: 25 },
  { name: 'ESLint', exp: 2, proexp: 1, icon: SiEslint, category: 'tools', order: 26 },
  { name: 'Prettier', exp: 2, proexp: 1, icon: SiPrettier, category: 'tools', order: 27 },
  { name: 'Linux', exp: 2, proexp: 1, icon: SiLinux, category: 'tools', order: 28 },
  { name: 'i18n', exp: 1, proexp: 1, icon: SiI18Next, category: 'tools', order: 29 },
  { name: 'esptool.js', exp: 1, proexp: 0, icon: SiEspressif, category: 'tools', order: 30 },

  // CI/CD category highlight (exemplo pra GitHub Actions)
  { name: 'CI/CD (GitHub Actions)', exp: 2, proexp: 1, icon: SiGit, category: 'tools', order: 31 },

  // Desktop
  { name: 'Tauri', exp: 1, proexp: 0, icon: SiTauri, category: 'desktop', order: 32 },
  { name: 'Electron', exp: 2, proexp: 0, icon: IoLogoElectron, category: 'desktop', order: 33 },

  // Design
  { name: 'Figma', exp: 2, proexp: 0.5, icon: SiFigma, category: 'design', order: 34 },
  { name: 'Photoshop', exp: 2, proexp: 1, icon: SiAdobephotoshop, category: 'design', order: 35 },
  {
    name: 'Illustrator',
    exp: 2,
    proexp: 1,
    icon: SiAdobeillustrator,
    category: 'design',
    order: 36,
  },
  {
    name: 'After Effects',
    exp: 1,
    proexp: 0.5,
    icon: SiAdobeaftereffects,
    category: 'design',
    order: 37,
  },

  // Other
  {
    name: 'Microcontroladores',
    exp: 1,
    proexp: 1,
    icon: TbDeviceHeartMonitor,
    category: 'other',
    order: 38,
  },
  {
    name: 'WebSocket',
    exp: 1,
    proexp: 0,
    icon: SiGooglecloudstorage,
    category: 'backend',
    order: 39,
  },
];

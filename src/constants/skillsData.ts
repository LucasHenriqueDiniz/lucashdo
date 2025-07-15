import { BsAndroid2 } from 'react-icons/bs';
import { FaAws } from 'react-icons/fa';
import { IoLogoElectron } from 'react-icons/io5';
import {
  SiAdobeillustrator,
  SiAdobephotoshop,
  SiCss3,
  SiDocker,
  SiFigma,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiLinux,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPhp,
  SiPrisma,
  SiPython,
  SiReact,
  SiRedux,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVite,
} from 'react-icons/si';

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
  {
    name: 'JavaScript',
    exp: 3,
    proexp: 3,
    icon: SiJavascript,
    category: 'frontend',
    order: 1,
  },
  {
    name: 'HTML5',
    exp: 3,
    proexp: 3,
    icon: SiHtml5,
    category: 'frontend',
    order: 2,
  },
  {
    name: 'CSS3',
    exp: 3,
    proexp: 3,
    icon: SiCss3,
    category: 'frontend',
    order: 3,
  },
  {
    name: 'TypeScript',
    exp: 2,
    proexp: 3,
    icon: SiTypescript,
    category: 'frontend',
    featured: true,
    order: 4,
  },
  {
    name: 'React',
    exp: 2,
    proexp: 3,
    icon: SiReact,
    category: 'frontend',
    featured: true,
    order: 5,
  },
  {
    name: 'Next.js',
    exp: 1,
    proexp: 2,
    icon: SiNextdotjs,
    category: 'frontend',
    featured: true,
    order: 6,
  },
  {
    name: 'Node.js',
    exp: 2,
    proexp: 2,
    icon: SiNodedotjs,
    category: 'backend',
    featured: true,
    order: 7,
  },
  {
    name: 'Python',
    exp: 1,
    proexp: 2,
    icon: SiPython,
    category: 'backend',
    featured: true,
    order: 8,
  },
  {
    name: 'AWS',
    exp: 0,
    proexp: 1,
    icon: FaAws,
    category: 'devops',
    order: 9,
  },
  {
    name: 'Redux',
    exp: 1,
    proexp: 1,
    icon: SiRedux,
    category: 'frontend',
    order: 10,
  },
  {
    name: 'Tailwind CSS',
    exp: 2,
    proexp: 1,
    icon: SiTailwindcss,
    category: 'frontend',
    order: 11,
  },
  {
    name: 'ViteJS',
    exp: 1,
    proexp: 1,
    icon: SiVite,
    category: 'frontend',
    order: 12,
  },
  {
    name: 'Prisma',
    exp: 0,
    proexp: 1,
    icon: SiPrisma,
    category: 'database',
    order: 13,
  },
  {
    name: 'MongoDB',
    exp: 2,
    proexp: 0,
    icon: SiMongodb,
    category: 'database',
    order: 14,
  },
  {
    name: 'MySQL',
    exp: 1,
    proexp: 2,
    icon: SiMysql,
    category: 'database',
    order: 15,
  },
  {
    name: 'React Native',
    exp: 1,
    proexp: 1,
    icon: BsAndroid2,
    category: 'mobile',
    order: 16,
  },
  {
    name: 'Electron',
    exp: 2,
    proexp: 0,
    icon: IoLogoElectron,
    category: 'desktop',
    order: 17,
  },
  {
    name: 'Docker',
    exp: 1,
    proexp: 1,
    icon: SiDocker,
    category: 'devops',
    order: 18,
  },
  {
    name: 'Git',
    exp: 2,
    proexp: 3,
    icon: SiGit,
    category: 'tools',
    order: 19,
  },
  {
    name: 'PHP',
    exp: 2,
    proexp: 0,
    icon: SiPhp,
    category: 'frontend',
    order: 20,
  },
  {
    name: 'Supabase',
    exp: 1,
    proexp: 1,
    icon: SiSupabase,
    category: 'database',
    order: 21,
  },
  {
    name: 'Linux',
    exp: 2,
    proexp: 1,
    icon: SiLinux,
    category: 'tools',
    order: 22,
  },
  {
    name: 'Figma',
    exp: 1,
    proexp: 2,
    icon: SiFigma,
    category: 'design',
    order: 23,
  },
  {
    name: 'Photoshop',
    exp: 5,
    proexp: 1,
    icon: SiAdobephotoshop,
    category: 'design',
    order: 24,
    featured: true,
  },
  {
    name: 'Illustrator',
    exp: 3,
    proexp: 1,
    icon: SiAdobeillustrator,
    category: 'design',
    order: 25,
  },
];

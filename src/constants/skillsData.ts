import { BsAndroid2 } from 'react-icons/bs';
import { IconType } from 'react-icons/lib';
import {
  SiDocker,
  SiFigma,
  SiGit,
  SiJavascript,
  SiNextdotjs,
  SiNodedotjs,
  SiPrisma,
  SiReact,
  SiRedux,
  SiTailwindcss,
  SiTypescript,
  SiWordpress,
} from 'react-icons/si';

export interface SkillDataType {
  name: string;
  proexp: number;
  exp: number;
  icon: IconType;
  category: 'frontend' | 'backend' | 'mobile' | 'design' | 'devops' | 'other';
  featured?: boolean;
  order?: number;
}

export const skillsData: SkillDataType[] = [
  {
    name: 'React',
    proexp: 2,
    exp: 2,
    icon: SiReact,
    category: 'frontend',
    featured: true,
    order: 1,
  },
  {
    name: 'React Native',
    proexp: 1,
    exp: 1,
    icon: BsAndroid2,
    category: 'mobile',
    featured: true,
    order: 2,
  },
  {
    name: 'Next.js',
    proexp: 1,
    exp: 4,
    icon: SiNextdotjs,
    category: 'frontend',
    featured: true,
    order: 3,
  },
  {
    name: 'TypeScript',
    proexp: 1,
    exp: 1,
    icon: SiTypescript,
    category: 'frontend',
    featured: true,
    order: 4,
  },
  {
    name: 'JavaScript',
    proexp: 2,
    exp: 2,
    icon: SiJavascript,
    category: 'frontend',
    featured: true,
    order: 5,
  },
  { name: 'WordPress', proexp: 0.5, exp: 0, icon: SiWordpress, category: 'frontend', order: 6 },
  {
    name: 'Tailwind CSS',
    proexp: 1.5,
    exp: 0.5,
    icon: SiTailwindcss,
    category: 'frontend',
    order: 7,
  },
  { name: 'Redux', proexp: 1, exp: 1, icon: SiRedux, category: 'frontend', order: 8 },
  { name: 'Node.js', proexp: 1, exp: 2, icon: SiNodedotjs, category: 'backend', order: 9 },
  { name: 'Prisma', proexp: 0, exp: 1, icon: SiPrisma, category: 'backend', order: 10 },
  { name: 'Docker', proexp: 0, exp: 1, icon: SiDocker, category: 'devops', order: 11 },
  { name: 'Git', proexp: 2, exp: 1, icon: SiGit, category: 'devops', order: 12 },
  { name: 'Figma', proexp: 0, exp: 2, icon: SiFigma, category: 'design', order: 13 },
];

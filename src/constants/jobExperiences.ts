import { ExperienceProps } from '@/types/experience.types';
import { Box, CircuitBoard, Database, FileCode, PackageCheck, PenTool } from 'lucide-react';

export const jobExperiences: ExperienceProps[] = [
  {
    id: 'eng-futuro',
    topTags: [
      { labels: { pt: 'Trabalho', en: 'Job' } },
      { labels: { pt: 'Engenharia do Futuro', en: 'Engenharia do Futuro' } },
    ],
    title: 'Desenvolvedor Full Stack',
    institution: 'Engenharia do Futuro',
    url: 'https://engenhariadofuturo.com/',
    date: 'mar 2025 - atual',
    showInTimeline: true,
    tags: [
      { labels: { pt: 'React', en: 'React' }, icon: '/icons/react.svg' },
      { labels: { pt: 'Typescript', en: 'Typescript' }, icon: '/icons/typescript.svg' },
      { labels: { pt: 'Python', en: 'Python' }, icon: '/icons/python.svg' },
    ],
    description: {
      pt: 'Desenvolvedor full stack React, Typescript e Python. Desenvolvimento de soluções web e integração com microcontroladores.',
      en: 'Full stack developer (React, Typescript, Python). Web solutions and microcontroller integration.',
    },
  },
  {
    id: 'bots-channel',
    topTags: [
      { labels: { pt: 'Trabalho', en: 'Job' } },
      { labels: { pt: 'Bots Channel', en: 'Bots Channel' } },
    ],
    title: 'CTO & Co-Founder - Fullstack Developer',
    institution: 'Bots Channel',
    url: 'https://botschannel.com/',
    date: 'fev 2024 - jul 2024',
    showInTimeline: true,
    tags: [
      { labels: { pt: 'React', en: 'React' }, icon: '/icons/react.svg' },
      { labels: { pt: 'Node.js', en: 'Node.js' }, icon: '/icons/nodejs.svg' },
      { labels: { pt: 'AWS', en: 'AWS' }, icon: '/icons/aws.svg' },
      { labels: { pt: 'Prisma', en: 'Prisma' }, icon: '/icons/prisma.svg' },
      { labels: { pt: 'Zustand', en: 'Zustand' }, icon: '/icons/zustand.png' },
      { labels: { pt: 'Typescript', en: 'Typescript' }, icon: '/icons/typescript.svg' },
    ],
    description: {
      pt: 'Liderança técnica e desenvolvimento de sistemas completos com React, Node.js, AWS, Prisma, Zustand e Typescript.',
      en: 'Technical leadership and fullstack development with React, Node.js, AWS, Prisma, Zustand, and Typescript.',
    },
  },
  {
    id: 'eng-futuro-vol',
    topTags: [
      { labels: { pt: 'Trabalho', en: 'Job' } },
      { labels: { pt: 'Engenharia do Futuro', en: 'Engenharia do Futuro' } },
    ],
    title: 'Developer Volunteer',
    institution: 'Engenharia do Futuro',
    url: 'https://engenhariadofuturo.com/',
    date: 'mai 2023 - fev 2024',
    showInTimeline: true,
    tags: [
      { labels: { pt: 'React', en: 'React' }, icon: '/icons/react.svg' },
      { labels: { pt: 'Node.js', en: 'Node.js' }, icon: '/icons/nodejs.svg' },
      { labels: { pt: 'Microcontroladores', en: 'Microcontrollers' }, icon: CircuitBoard },
      { labels: { pt: 'TypeScript', en: 'TypeScript' }, icon: '/icons/typescript.svg' },
      { labels: { pt: 'Python', en: 'Python' }, icon: '/icons/python.svg' },
      { labels: { pt: 'SQL', en: 'SQL' }, icon: Database },
      { labels: { pt: 'C', en: 'C' }, icon: '/icons/c.svg' },
      { labels: { pt: 'ViteJS', en: 'ViteJS' }, icon: '/icons/vite.svg' },
    ],
    description: {
      pt: 'Desenvolvedor voluntário FullStack, integração de sites com microcontroladores, workshop de front-end.',
      en: 'FullStack volunteer developer, microcontroller integration, front-end workshop.',
    },
  },
  {
    id: 'freelance-design',
    topTags: [
      { labels: { pt: 'Trabalho', en: 'Job' } },
      { labels: { pt: 'Freelance', en: 'Freelance' } },
    ],
    title: 'Freelancer - Design',
    institution: 'Freelance',
    url: '',
    date: '2019 - 2020',
    showInTimeline: true,
    tags: [
      { labels: { pt: 'Photoshop', en: 'Photoshop' }, icon: '/icons/photoshop.svg' },
      { labels: { pt: 'Illustrator', en: 'Illustrator' }, icon: '/icons/illustrator.svg' },
      { labels: { pt: 'After Effects', en: 'After Effects' }, icon: '/icons/aftereffects.svg' },
      { labels: { pt: 'Design Gráfico', en: 'Graphic Design' }, icon: PenTool },
    ],
    description: {
      pt: 'Atuei como freelancer de design, utilizando Photoshop, Illustrator e outras ferramentas para criar soluções criativas e profissionais.',
      en: 'Worked as a freelance designer using Photoshop, Illustrator, and other tools to deliver creative and professional solutions.',
    },
  },
  {
    id: 'vix-logistica',
    title: 'Auxiliar administrativo',
    institution: 'Vix Logistica',
    image: '/images/vix-logistica.png',
    url: '',
    date: 'fev 2017 - fev 2019',
    showInTimeline: false,
    topTags: [
      { labels: { pt: 'Trabalho', en: 'Job' } },
      { labels: { pt: 'Vix Logistica', en: 'Vix Logistica' } },
    ],
    tags: [
      { labels: { pt: 'Almoxarifado', en: 'Warehouse' }, icon: Box },
      { labels: { pt: 'Planilhas de Dados', en: 'Data Sheets' }, icon: FileCode },
      {
        labels: { pt: 'Gerenciamento de Estoque', en: 'Inventory Management' },
        icon: PackageCheck,
      },
    ],
    description: {
      pt: 'Atividades administrativas e controle de almoxarifado.',
      en: 'Administrative activities and warehouse control.',
    },
  },
];

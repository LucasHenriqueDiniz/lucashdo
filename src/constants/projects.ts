import { IconType } from 'react-icons/lib';

export interface Project {
  icon?: IconType;
  id: string;
  title: string;
  description: {
    pt: string;
    en: string;
  };
  image: string;
  tags: string[];
  repoUrl: string;
  demoUrl?: string;
  featured: boolean;
}

export type ProjectId = string;

export const projects: Project[] = [
  {
    id: 'windows-xp-online',
    title: 'Windows XP Online',
    description: {
      pt: 'Recriação do Windows XP com React em um servidor em tempo real para várias pessoas usarem simultaneamente.',
      en: 'Windows XP recreation with React in a real-time server for multiple users to use simultaneously.',
    },
    image: 'https://placeholdr.ai/3b68acdd-7a6e-4ee5-a793-db5efbacff51/600/400',
    tags: ['React', 'Real-time', 'Socket.io', 'Node.js'],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/windowx-xp-online',
    demoUrl: '', // To be added later
    featured: true,
  },
  {
    id: 'weeb-profile',
    title: 'Weeb Profile',
    description: {
      pt: 'Criador cron de SVGs pegando informações de diferentes locais para criar SVGs e mostrar em perfis como GitHub para levar customização a um novo nível.',
      en: 'Cron SVG creator fetching information from different places to create SVGs and show them in profiles like GitHub to take customization to the next level.',
    },
    image: 'https://images.unsplash.com/photo-1541560052-5e137f229371?q=80&w=800',
    tags: ['SVG', 'Node.js', 'Cron', 'API Integration'],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/WeebProfile',
    demoUrl: 'https://weeb-profile-web-client.vercel.app/',
    featured: true,
  },
  {
    id: 'mannco-store-enhancer-extension',
    title: 'Mannco.Store Enhancer Extension',
    description: {
      pt: 'Uma extensão para navegador projetada para melhorar a navegação no site Mannco Store. Nova versão das scripts Tampermonkey anteriores.',
      en: 'A browser extension designed to enhance navigation on the Mannco Store website. New version of previous Tampermonkey scripts.',
    },
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800',
    tags: ['Browser Extension', 'React', 'Manifest V3', 'JavaScript'],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/mannco.store-enhancer-extension',
    featured: true,
  },
  {
    id: 'mannco-store-enhancer',
    title: 'Mannco.Store Enhancer',
    description: {
      pt: 'Projeto descontinuado: extensão para navegador projetada para melhorar a navegação no site Mannco Store usando scripts Tampermonkey.',
      en: 'Deprecated project: browser extension designed to enhance navigation on the Mannco Store website using Tampermonkey scripts.',
    },
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800',
    tags: ['Tampermonkey', 'JavaScript', 'Browser Scripting'],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/Mannco.Store-Enhancer',
    featured: false,
  },
  {
    id: 'fornite-afk-pass',
    title: 'Fortnite AFK Pass',
    description: {
      pt: 'Programa simples em Python para programar movimentos em intervalos de tempo em uma janela específica para farmar pontos de passe.',
      en: 'Simple Python program to schedule movements at time intervals in a specific window to farm pass points.',
    },
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=800',
    tags: ['Python', 'Automation', 'Game Enhancement'],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/fornite-afk-pass',
    featured: false,
  },
  {
    id: 'backpack-tf-ws-service',
    title: 'Backpack.tf WS Service',
    description: {
      pt: 'Este projeto é um fork do backpack.tf-ws-service original, com foco em ser leve no MongoDB (para uso em tier gratuito) e com melhor estrutura de código e logging.',
      en: 'This project is a fork of the original backpack.tf-ws-service, with the focus on being lightweight in MongoDB (so it can be used in free tier) and with a better code structure and logging.',
    },
    image: 'https://images.unsplash.com/photo-1523800503107-5bc3ba2a6f81?q=80&w=800',
    tags: ['Python', 'MongoDB', 'WebSocket', 'API Integration'],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/backpack.tf-ws-service',
    featured: false,
  },
  {
    id: 'skoob-autojoin',
    title: 'Skoob Autojoin',
    description: {
      pt: 'Extensão para Skoob usando Tampermonkey para entrar automaticamente em sorteios de livros.',
      en: 'Extension for Skoob using Tampermonkey to automatically join book giveaways.',
    },
    image: 'https://images.unsplash.com/photo-1476231682828-37e571bc172f?q=80&w=800',
    tags: ['JavaScript', 'Tampermonkey', 'Automation'],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/skoob-autojoin',
    featured: false,
  },
  {
    id: 'include-gurias',
    title: 'Include Gurias',
    description: {
      pt: 'Projeto de bolsa na faculdade: website completo para o projeto Include Gurias de inclusão de mulheres na programação, incluindo design no Figma e desenvolvimento completo.',
      en: 'University scholarship project: complete website for the Include Gurias project focused on including more women in programming, including Figma design and full development.',
    },
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800',
    tags: ['UI/UX Design', 'Figma', 'Web Development', 'Inclusion'],
    repoUrl: '', // To be added later
    featured: true,
  },
  {
    id: 'hypixel-auto-skip-daily',
    title: 'Hypixel Auto Skip Daily',
    description: {
      pt: 'Extensão básica para pular o vídeo das recompensas diárias do site do Hypixel, usando Tampermonkey.',
      en: 'Basic extension to skip the daily rewards video on the Hypixel website, using Tampermonkey.',
    },
    image: 'https://images.unsplash.com/photo-1488554378835-f7acf46e6c98?q=80&w=800',
    tags: ['JavaScript', 'Tampermonkey', 'Browser Scripting'],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/HypixelAutoSkipDaily',
    featured: false,
  },
  {
    id: 'basicao-fullstack',
    title: 'Basicão Fullstack',
    description: {
      pt: 'Repositório para o Workshop Básico de Fullstack hospedado pela Engenharia do Futuro. Backend desenvolvido por Lucas Silva Ennes e frontend por Lucas Henrique Diniz Ostroski.',
      en: 'Repository for the Fullstack Basic Workshop hosted by Engenharia do Futuro. Backend developed by Lucas Silva Ennes and frontend by Lucas Henrique Diniz Ostroski.',
    },
    image: 'https://images.unsplash.com/photo-1504274066651-8d31a536b11a?q=80&w=800',
    tags: ['Fullstack', 'Workshop', 'Educational'],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/BasicaoFullstack-End',
    featured: false,
  },
];

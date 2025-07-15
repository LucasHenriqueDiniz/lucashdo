import { IconType } from 'react-icons/lib';
import {
  autowabba,
  backpackTfWsService,
  basicaoWorkshop,
  botschannelPlatform,
  botschannelWeb,
  extensionsChrome,
  forniteAfkPass,
  hypixelAutoSkipDaily,
  includeGurias,
  rsResgate,
  siotFlashInstaller,
  skoobAutojoin,
  weebprofile,
  windowsxponline,
} from '../../public';

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
  status?: 'workInProgress' | 'discontinued' | 'experimental' | 'completed';
}

export type ProjectId = string;

export const projects: Project[] = [
  {
    id: 'windows-xp-online',
    title: 'Windows XP Online',
    description: {
      pt: 'Recriação fiel do Windows XP no navegador, com multitarefa, janelas arrastáveis, temas, sons clássicos e até jogos. Tudo em tempo real para múltiplos usuários, usando WebSockets e React. Projeto viral no Twitter e destaque em comunidades de front-end.',
      en: 'A faithful Windows XP recreation in the browser, featuring multitasking, draggable windows, classic themes, sounds, and even games. Real-time for multiple users via WebSockets and React. Went viral on Twitter and featured in frontend communities.',
    },
    image: windowsxponline.src,
    tags: ['React', 'WebSocket', 'Node.js', 'Real-time', 'Frontend', 'OS Simulation', 'TypeScript'],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/windowx-xp-online',
    demoUrl: 'https://w-xp-online.web.app/',
    featured: true,
    status: 'experimental',
  },
  {
    id: 'weeb-profile',
    title: 'Weeb Profile',
    description: {
      pt: 'Gere SVGs dinâmicos para perfis do GitHub exibindo dados de anime, música e contribuições de código. Personalize e automatize via GitHub Actions, com scrapping de dados dos seus perfils como Last.fm e MyAnimeList.',
      en: 'Generate dynamic SVGs for GitHub profiles displaying anime, music, and code contributions data. Customize and automate via GitHub Actions, scraping data from your Last.fm and MyAnimeList profiles.',
    },
    image: weebprofile.src,
    tags: [
      'SVG',
      'Node.js',
      'GitHub Actions',
      'API Integration',
      'Automation',
      'Profile Generator',
    ],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/WeebProfile',
    demoUrl: 'https://weeb-profile-web-client.vercel.app/',
    featured: true,
    status: 'workInProgress',
  },
  {
    id: 'mannco-store-enhancer-extension',
    title: 'Mannco.Store Enhancer Extension',
    description: {
      pt: 'Boilerplate avançado para extensões Chrome/Firefox com React, TypeScript, Vite e Turborepo. Suporte a i18n, HMR, testes E2E, Manifest V3 e integração contínua. Base para projetos profissionais de browser extension.',
      en: 'Advanced boilerplate for Chrome/Firefox extensions with React, TypeScript, Vite, and Turborepo. Features i18n, HMR, E2E tests, Manifest V3, and CI integration. A solid base for professional browser extension projects.',
    },
    image: extensionsChrome.src,
    tags: [
      'React',
      'TypeScript',
      'TailwindCSS',
      'Vite',
      'Turborepo',
      'Browser Extension',
      'Manifest V3',
      'i18n',
      'HMR',
      'WebdriverIO',
      'CI/CD',
    ],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/mannco.store-enhancer-extension',
    featured: true,
    status: 'experimental',
  },
  {
    id: 'mannco-store-enhancer',
    title: 'Mannco.Store Enhancer',
    description: {
      pt: 'Projeto descontinuado: extensão para navegador projetada para melhorar a navegação no site Mannco Store usando scripts Tampermonkey.',
      en: 'Deprecated project: browser extension designed to enhance navigation on the Mannco Store website using Tampermonkey scripts.',
    },
    image: extensionsChrome.src,
    tags: ['Tampermonkey', 'JavaScript', 'Browser Scripting'],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/Mannco.Store-Enhancer',
    featured: false,
    status: 'discontinued',
  },
  {
    id: 'fornite-afk-pass',
    title: 'Fortnite AFK Pass',
    description: {
      pt: 'Bot em Python para automatizar ações no Fortnite e farmar o Passe de Batalha AFK. Interface gráfica com Tkinter, usa pyautogui e pywinauto.',
      en: 'Python bot to automate actions in Fortnite for AFK Battle Pass farming. GUI with Tkinter, uses pyautogui and pywinauto.',
    },
    image: forniteAfkPass.src,
    tags: ['Python', 'Tkinter', 'pyautogui', 'pywinauto', 'Automation', 'Game Enhancement'],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/fornite-afk-pass',
    featured: false,
    status: 'discontinued',
  },
  {
    id: 'backpack-tf-ws-service',
    title: 'Backpack.tf WS Service',
    description: {
      pt: 'Serviço para conectar ao websocket do backpack.tf, coletar dados de listagens e armazenar no MongoDB. Inclui snapshots e itens priorizados.',
      en: 'Service to connect to backpack.tf websocket, gather listing data, and store it in MongoDB. Includes snapshot updates and prioritized items.',
    },
    image: backpackTfWsService.src,
    tags: ['Python', 'MongoDB', 'WebSocket', 'API Integration', 'Async', 'Logging'],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/backpack.tf-ws-service',
    featured: false,
    status: 'completed',
  },
  {
    id: 'skoob-autojoin',
    title: 'Skoob Autojoin',
    description: {
      pt: 'Userscript Tampermonkey para entrar automaticamente em todos os sorteios populares do Skoob.',
      en: 'Tampermonkey userscript to automatically join all giveaways on Skoob&#39;s popular giveaways page.',
    },
    image: skoobAutojoin.src,
    tags: ['JavaScript', 'Tampermonkey', 'Automation', 'Skoob'],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/skoob-autojoin',
    featured: false,
    status: 'completed',
  },
  {
    id: 'include-gurias',
    title: 'Include Gurias',
    description: {
      pt: 'Plataforma completa para empoderamento feminino em STEM. Site institucional, área de eventos, equipe, materiais e integração com Supabase e Prisma. Design responsivo, acessível e premiado em hackathons.',
      en: 'Comprehensive platform for empowering women in STEM. Institutional site, events, team, materials, and Supabase/Prisma integration. Responsive, accessible design, awarded in hackathons.',
    },
    image: includeGurias.src,
    tags: [
      'Next.js',
      'React',
      'TypeScript',
      'TailwindCSS',
      'Chakra UI',
      'Supabase',
      'Prisma',
      'Zustand',
      'UI/UX Design',
      'Inclusion',
    ],
    repoUrl: 'https://github.com/include-gurias/includegurias-website',
    demoUrl: 'https://www.includegurias.com.br',
    featured: true,
    status: 'completed',
  },
  {
    id: 'hypixel-auto-skip-daily',
    title: 'Hypixel Auto Skip Daily',
    description: {
      pt: 'Userscript Tampermonkey para pular automaticamente o vídeo das recompensas diárias no site do Hypixel.',
      en: 'Tampermonkey userscript to auto-skip the daily rewards video on the Hypixel website.',
    },
    image: hypixelAutoSkipDaily.src,
    tags: ['JavaScript', 'Tampermonkey', 'jQuery', 'Browser Scripting', 'Automation'],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/HypixelAutoSkipDaily',
    featured: false,
    status: 'completed',
  },
  {
    id: 'basicao-fullstack',
    title: 'Basicão Fullstack',
    description: {
      pt: 'Projeto fullstack com backend Flask e frontend React+Vite. Backend gerencia livros, frontend exibe e adiciona livros.',
      en: 'Fullstack project with Flask backend and React+Vite frontend. Backend manages books, frontend displays and adds books.',
    },
    image: basicaoWorkshop.src,
    tags: [
      'Python',
      'Flask',
      'SQLAlchemy',
      'Alembic',
      'React',
      'TypeScript',
      'Vite',
      'Ant Design',
      'Axios',
      'Fullstack',
      'Workshop',
      'Educational',
    ],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/BasicaoFullstack-End',
    featured: false,
    status: 'completed',
  },
  {
    id: 'botschannel-platform',
    title: 'BotsChannel Platform',
    description: {
      pt: 'Plataforma para criação, gerenciamento e publicação de bots para múltiplas plataformas. Empresa parou de operar, mas o projeto segue open source.',
      en: 'Platform for creating, managing, and publishing bots for multiple platforms. Company is no longer operating, but the project remains open source.',
    },
    image: botschannelPlatform.src,
    tags: ['Bots', 'Platform', 'Node.js', 'TypeScript', 'Microservices', 'SaaS', 'Serverless'],
    repoUrl: 'https://github.com/BotsChannel',
    demoUrl: 'https://platform.botschannel.com/en',
    featured: false,
    status: 'discontinued',
  },
  {
    id: 'botschannel-landing',
    title: 'BotsChannel Landing Page',
    description: {
      pt: 'Landing page institucional da BotsChannel. Empresa parou de operar, mas o site segue disponível.',
      en: 'Institutional landing page for BotsChannel. Company is no longer operating, but the site remains available.',
    },
    image: botschannelWeb.src,
    tags: ['Landing Page', 'Next.js', 'React', 'TypeScript', 'Marketing'],
    repoUrl: 'https://github.com/BotsChannel',
    demoUrl: 'https://botschannel.com/',
    featured: false,
    status: 'discontinued',
  },
  {
    id: 'siot-web-flasher',
    title: 'SIOT Web Flasher',
    description: {
      pt: 'Flasheie firmwares e monitore serial de ESP32/ESP8266 direto do navegador. Suporte a Web Serial API, interface moderna e integração com Electron para desktop. Ferramenta essencial para makers e IoT.',
      en: 'Flash firmware and monitor serial of ESP32/ESP8266 directly from the browser. Supports Web Serial API, modern UI, and Electron desktop integration. Essential tool for makers and IoT.',
    },
    image: siotFlashInstaller.src,
    tags: ['ESP32', 'ESP8266', 'Web Serial', 'Firmware', 'TypeScript', 'IoT', 'Electron'],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/siot-web-flasher',
    featured: true,
  },
  {
    id: 'resgate-rs',
    title: 'Resgate RS',
    description: {
      pt: 'Plataforma criada em resposta à tragédia do RS para cadastro e busca de pessoas desaparecidas. Utiliza Next.js, Supabase e PostgreSQL. Código aberto por respeito às vítimas.',
      en: 'Platform created in response to the RS tragedy for registering and searching missing people. Uses Next.js, Supabase, and PostgreSQL. Open source out of respect for the victims.',
    },
    image: rsResgate.src,
    tags: [
      'Next.js',
      'React',
      'TypeScript',
      'Supabase',
      'Serverless',
      'Disaster Management',
      'PostgreSQL',
    ],
    repoUrl: 'https://github.com/BotsChannel/resgate-rs',
    featured: true,
    status: 'completed',
  },
  {
    id: 'autowabba',
    title: 'AutoWabba',
    description: {
      pt: 'Automatize downloads de modlists do Wabbajack no Nexus Mods com um app Electron que simula cliques e interage com o navegador via Playwright. Ideal para power users de modding.',
      en: 'Automate Wabbajack modlist downloads from Nexus Mods with an Electron app that simulates clicks and interacts with the browser via Playwright. Perfect for modding power users.',
    },
    image: autowabba.src,
    tags: ['Electron', 'Node.js', 'Playwright', 'Automation', 'Nexus Mods', 'Windows'],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/AutoWabba',
    featured: true,
    status: 'completed',
  },
];

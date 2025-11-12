import { IconType } from 'react-icons/lib';
import {
  autowabba,
  backpackTfWsService,
  basicaoWorkshop,
  botschannelPlatform,
  botschannelWeb,
  comunicamulher,
  contexttools,
  extensionsChrome,
  forniteAfkPass,
  hypixelAutoSkipDaily,
  includeGurias,
  itemmarketcap,
  quizhubThumbnail,
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
      pt: 'Recriação fiel do Windows XP no navegador, com multitarefa, janelas arrastáveis, temas, sons clássicos e até jogos. Tudo em tempo real para múltiplos usuários, usando WebSockets e React.',
      en: 'A faithful Windows XP recreation in the browser, featuring multitasking, draggable windows, classic themes, sounds, and even games. Real-time for multiple users via WebSockets and React.',
    },
    image: windowsxponline.src,
    tags: ['React', 'TypeScript', 'WebSockets'],
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
    tags: ['Node.js', 'TypeScript', 'Automation'],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/WeebProfile',
    demoUrl: 'https://weeb-profile-web-client.vercel.app/',
    featured: true,
    status: 'workInProgress',
  },
  {
    id: 'context-tools',
    title: 'Context Tools',
    description: {
      pt: 'Extensão para VS Code que copia arquivos, seleção, árvore do projeto e problemas em blocos formatados, otimizados para compartilhar com LLMs e issues.',
      en: 'VS Code extension that copies files, selections, project tree, and diagnostics into tidy fenced blocks optimized for sharing with LLMs and issue trackers.',
    },
    image: contexttools.src,
    tags: ['TypeScript', 'VS Code', 'Extension'],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/vscode-context-tools',
    demoUrl:
      'https://marketplace.visualstudio.com/items?itemName=lucashenriquediniz.vscode-context-tools',
    featured: false,
    status: 'completed',
  },
  {
    id: 'mannco-store-enhancer-extension',
    title: 'Mannco.Store Enhancer Extension',
    description: {
      pt: 'Boilerplate avançado para extensões Chrome/Firefox com React, TypeScript, Vite e Turborepo. Suporte a i18n, HMR, testes E2E, Manifest V3 e integração contínua. Base para projetos profissionais de browser extension.',
      en: 'Advanced boilerplate for Chrome/Firefox extensions with React, TypeScript, Vite, and Turborepo. Features i18n, HMR, E2E tests, Manifest V3, and CI integration. A solid base for professional browser extension projects.',
    },
    image: extensionsChrome.src,
    tags: ['React', 'TypeScript', 'Vite'],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/mannco.store-enhancer-extension',
    featured: false,
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
    tags: ['Tampermonkey', 'JavaScript'],
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
    tags: ['Python', 'Tkinter', 'Automation'],
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
    tags: ['Python', 'MongoDB', 'WebSockets'],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/backpack.tf-ws-service',
    featured: false,
    status: 'completed',
  },
  {
    id: 'skoob-autojoin',
    title: 'Skoob Autojoin',
    description: {
      pt: 'Userscript Tampermonkey para entrar automaticamente em todos os sorteios populares do Skoob.',
      en: "Tampermonkey userscript to automatically join all giveaways on Skoob's popular giveaways page.",
    },
    image: skoobAutojoin.src,
    tags: ['JavaScript', 'Tampermonkey'],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/skoob-autojoin',
    featured: false,
    status: 'completed',
  },
  {
    id: 'include-gurias',
    title: 'Include Gurias',
    description: {
      pt: 'Plataforma institucional para empoderamento feminino em STEM. Inclui páginas para eventos, equipe e materiais, com design responsivo e acessível. Possui área de administração construída sobre Supabase + Prisma, permitindo gerenciar todo o conteúdo diretamente no painel.',
      en: 'Institutional platform empowering women in STEM. Includes event, team, and resources sections, with responsive, accessible design. Equipped with an admin area powered by Supabase + Prisma, enabling full content management from the dashboard.',
    },
    image: includeGurias.src,
    tags: ['Next.js', 'TypeScript', 'Supabase'],
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
    tags: ['JavaScript', 'Tampermonkey'],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/HypixelAutoSkipDaily',
    featured: false,
    status: 'completed',
  },
  {
    id: 'basicao-fullstack',
    title: 'Basicão Fullstack',
    description: {
      pt: 'Aplicação fullstack desenvolvida para o workshop Basicão Fullstack promovido pela Engenharia do Futuro. O backend, feito com Flask e SQLAlchemy, gerencia um catálogo de livros com API RESTful. O frontend, construído com React, Vite e Ant Design, permite visualizar e adicionar livros à base. Projeto educativo com foco prático em integração frontend-backend.',
      en: 'Fullstack application developed for the Basic Fullstack workshop hosted by Engenharia do Futuro. The backend (Flask + SQLAlchemy) provides a RESTful API to manage a book catalog. The frontend (React + Vite + Ant Design) enables users to view and add books. Educational project focused on hands-on fullstack integration.',
    },
    image: basicaoWorkshop.src,
    tags: ['Python', 'Flask', 'React'],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/BasicaoFullstack-End',
    featured: false,
    status: 'completed',
  },
  {
    id: 'botschannel-platform',
    title: 'BotsChannel Platform',
    description: {
      pt: 'Plataforma SaaS serverless para criação e gerenciamento de chatbots em múltiplos canais (WhatsApp, Telegram, Instagram). Contava com sistema próprio de autenticação, painel de controle para gestão de equipes, e suporte a bots dinâmicos via JSON. Possui arquitetura baseada em microsserviços com AWS Lambda, PostgreSQL e CI/CD. Apesar do encerramento da empresa, o projeto segue open source.',
      en: 'Serverless SaaS platform for creating and managing chatbots across multiple channels (WhatsApp, Telegram, Instagram). Included custom auth, team management dashboard, and dynamic JSON-based bot building. Built with microservices architecture using AWS Lambda, PostgreSQL, and CI/CD. The company has ceased operations, but the project remains open source.',
    },
    image: botschannelPlatform.src,
    tags: ['Node.js', 'TypeScript', 'AWS'],
    repoUrl: 'https://github.com/BotsChannel',
    demoUrl: 'https://platform.botschannel.com/en',
    featured: true,
    status: 'discontinued',
  },
  {
    id: 'botschannel-landing',
    title: 'BotsChannel Landing Page',
    description: {
      pt: 'Landing page institucional da BotsChannel com foco em marketing digital e conversão. Desenvolvida com Next.js e design limpo e responsivo. Continua online como vitrine do antigo serviço.',
      en: 'Institutional landing page for BotsChannel, focused on digital marketing and lead conversion. Built with Next.js and a clean, responsive design. Still online as a showcase of the former service.',
    },
    image: botschannelWeb.src,
    tags: ['Next.js', 'TypeScript'],
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
    tags: ['TypeScript', 'Electron', 'Web Serial'],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/siot-web-flasher',
    demoUrl: 'https://siot-web-flasher.vercel.app/',
    featured: false,
  },
  {
    id: 'resgate-rs',
    title: 'Resgate RS',
    description: {
      pt: 'Plataforma criada em resposta à tragédia do RS para cadastro e busca de pessoas desaparecidas. Utiliza Next.js, Supabase e PostgreSQL. Código aberto por respeito às vítimas.',
      en: 'Platform created in response to the RS tragedy for registering and searching missing people. Uses Next.js, Supabase, and PostgreSQL. Open source out of respect for the victims.',
    },
    image: rsResgate.src,
    tags: ['Next.js', 'TypeScript', 'Supabase'],
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
    tags: ['Electron', 'Node.js', 'Playwright'],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/AutoWabba',
    featured: true,
    status: 'completed',
  },
  {
    id: 'itemmarketcap',
    title: 'ItemMarketCap',
    description: {
      pt: 'Plataforma de analytics profissional para traders da Steam, com acompanhamento em tempo real de preços, volumes e capitalização de itens de CS2, Dota 2 e TF2, além de watchlists e visão comparativa.',
      en: 'Professional Steam trading analytics platform featuring real-time pricing, volumes, and market cap tracking for CS2, Dota 2, and TF2 items, plus watchlists and comparative views.',
    },
    image: itemmarketcap.src,
    tags: ['Next.js', 'TypeScript', 'TailwindCSS'],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/item-marketcap',
    demoUrl: 'https://item-marketcap.vercel.app/',
    featured: true,
    status: 'workInProgress',
  },
  {
    id: 'comunica-mulher',
    title: 'ComunicaMulher',
    description: {
      pt: 'Plataforma que conecta mulheres impactadas por obras de infraestrutura a empresas e órgãos responsáveis, facilitando diálogo, acompanhamento de reclamações e produção de conteúdo educativo.',
      en: 'Platform that connects women affected by infrastructure projects with the responsible companies and agencies, enabling dialogue, complaint tracking, and educational content.',
    },
    image: comunicamulher.src,
    tags: ['Next.js', 'TypeScript', 'Supabase'],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/reclame-mulher',
    demoUrl: 'https://reclame-mulher.vercel.app/',
    featured: true,
    status: 'workInProgress',
  },
  {
    id: 'quizhub',
    title: 'QuizHub',
    description: {
      pt: 'Plataforma interativa de quizzes com ranking em tempo real, editor colaborativo e dashboards de progresso para equipes e comunidades.',
      en: 'Interactive quiz platform featuring real-time leaderboards, collaborative authoring, and progress dashboards for teams and communities.',
    },
    image: quizhubThumbnail.src,
    tags: ['Next.js', 'TypeScript', 'Supabase'],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/quizhub',
    demoUrl: 'https://quizhub.com.br/',
    featured: true,
    status: 'workInProgress',
  },
];

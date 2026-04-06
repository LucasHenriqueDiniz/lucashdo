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
      pt: 'Sistema de geração de SVGs dinâmicos para GitHub com integração de múltiplas APIs (Last.fm, MyAnimeList, GitHub). Pipeline automatizado via GitHub Actions para coleta, processamento e renderização de dados em tempo real. Arquitetura modular com cache inteligente e otimização de performance.',
      en: 'Dynamic SVG generation system for GitHub with multi-API integration (Last.fm, MyAnimeList, GitHub). Automated pipeline via GitHub Actions for real-time data collection, processing, and rendering. Modular architecture with intelligent caching and performance optimization.',
    },
    image: weebprofile.src,
    tags: ['Node.js', 'TypeScript', 'API Integration', 'Automation'],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/WeebProfile',
    demoUrl: 'https://weeb-profile-web-client.vercel.app/',
    featured: true,
    status: 'workInProgress',
  },
  {
    id: 'clearcut',
    title: 'Clearcut',
    description: {
      pt: 'Aplicação desktop para processamento em massa de imagens, permitindo automação de workflows de edição repetitivos e manipulação eficiente de grandes volumes de assets usando Electron.',
      en: 'Desktop application for bulk image processing, enabling automation of repetitive editing workflows and efficient handling of large volumes of assets using Electron.',
    },
    image: contexttools.src,
    tags: ['Electron', 'TypeScript', 'Image Processing', 'Automation'],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/clearcut',
    featured: false,
    status: 'completed',
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
    id: 'heartopia-guide',
    title: 'Heartopia Guide',
    description: {
      pt: 'Plataforma de conteúdo production-grade usando Next.js (App Router) com roteamento dinâmico e páginas data-driven. Implementei ingestão estruturada de conteúdo, estratégias de caching e arquitetura focada em SEO.',
      en: 'Production-grade content platform using Next.js (App Router) with dynamic routing and data-driven pages. Implemented structured content ingestion, caching strategies and SEO-focused architecture.',
    },
    image: quizhubThumbnail.src,
    tags: ['Next.js', 'TypeScript', 'SEO', 'App Router'],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/heartopia-guide',
    demoUrl: 'https://heartopia.guide/en',
    featured: true,
    status: 'completed',
  },
  {
    id: 'include-gurias',
    title: 'Include Gurias',
    description: {
      pt: 'Plataforma institucional fullstack com CMS headless customizado. Implementei sistema de autenticação, painel administrativo com CRUD completo, e pipeline de conteúdo com validações. Arquitetura baseada em Supabase RLS policies, otimização de queries e cache estratégico para performance.',
      en: 'Fullstack institutional platform with custom headless CMS. Implemented authentication system, admin dashboard with full CRUD, and content pipeline with validations. Architecture based on Supabase RLS policies, query optimization, and strategic caching for performance.',
    },
    image: includeGurias.src,
    tags: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL'],
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
      pt: 'Plataforma SaaS serverless para automação multi-canal de chatbots. Arquitetura de microsserviços com AWS Lambda, processamento assíncrono de mensagens, e integração com APIs de WhatsApp, Telegram e Instagram. Sistema de autenticação JWT, engine de fluxos JSON-based, e infraestrutura CI/CD completa. Projeto open source.',
      en: 'Serverless SaaS platform for multi-channel chatbot automation. Microservices architecture with AWS Lambda, asynchronous message processing, and integration with WhatsApp, Telegram, and Instagram APIs. JWT authentication system, JSON-based flow engine, and complete CI/CD infrastructure. Open source project.',
    },
    image: botschannelPlatform.src,
    tags: ['Node.js', 'TypeScript', 'AWS Lambda', 'PostgreSQL', 'API Integration'],
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
      pt: 'Aplicação desktop de automação para download em massa via Playwright. Implementa browser automation, gerenciamento de estado, e processamento paralelo de requisições. Arquitetura Electron com IPC para comunicação entre processos e sistema de retry inteligente.',
      en: 'Desktop automation application for bulk downloads via Playwright. Implements browser automation, state management, and parallel request processing. Electron architecture with IPC for inter-process communication and intelligent retry system.',
    },
    image: autowabba.src,
    tags: ['Electron', 'Node.js', 'Playwright', 'Automation'],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/AutoWabba',
    featured: true,
    status: 'completed',
  },
  {
    id: 'itemmarketcap',
    title: 'ItemMarketCap',
    description: {
      pt: 'Plataforma de analytics em tempo real com integração de múltiplas APIs da Steam. Pipeline de coleta e normalização de dados de mercado, sistema de cache com Redis, e processamento de métricas agregadas. Interface com visualizações comparativas e watchlists personalizadas.',
      en: 'Real-time analytics platform with multi-API Steam integration. Market data collection and normalization pipeline, Redis caching system, and aggregated metrics processing. Interface with comparative visualizations and custom watchlists.',
    },
    image: itemmarketcap.src,
    tags: ['Next.js', 'TypeScript', 'API Integration', 'Redis', 'Data Processing'],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/item-marketcap',
    demoUrl: 'https://item-marketcap.vercel.app/',
    featured: true,
    status: 'workInProgress',
  },
  {
    id: 'comunica-mulher',
    title: 'ComunicaMulher',
    description: {
      pt: 'Sistema de gestão de reclamações com workflow de moderação e validações. Implementei pipeline de intake com sanitização de dados, painel administrativo com filtros avançados, e políticas RLS granulares no Supabase. Arquitetura focada em segurança e auditoria de ações.',
      en: 'Complaint management system with moderation workflow and validations. Implemented intake pipeline with data sanitization, admin dashboard with advanced filters, and granular RLS policies in Supabase. Security-focused architecture with action auditing.',
    },
    image: comunicamulher.src,
    tags: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL'],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/reclame-mulher',
    demoUrl: 'https://reclame-mulher.vercel.app/',
    featured: true,
    status: 'workInProgress',
  },
  {
    id: 'quizhub',
    title: 'QuizHub',
    description: {
      pt: 'Plataforma de quizzes com sistema de ranking em tempo real e editor colaborativo. Pipeline de ingestão de questões com LLM-assisted processing para normalização e categorização. Modelagem de dados relacional complexa com PostgreSQL e sistema de métricas agregadas.',
      en: 'Quiz platform with real-time ranking system and collaborative editor. Question ingestion pipeline with LLM-assisted processing for normalization and categorization. Complex relational data modeling with PostgreSQL and aggregated metrics system.',
    },
    image: quizhubThumbnail.src,
    tags: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'LLM Integration'],
    repoUrl: 'https://github.com/LucasHenriqueDiniz/quizhub',
    demoUrl: 'https://quizhub.com.br/',
    featured: true,
    status: 'workInProgress',
  },
];

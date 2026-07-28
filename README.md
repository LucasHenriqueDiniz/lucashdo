# Portfolio Website

Um site de portfolio moderno e interativo construído com Next.js 16, React 19, TypeScript, e Tailwind CSS 4, hospedado no **Cloudflare Workers**.

> A modern and interactive portfolio website built with Next.js 16, React 19, TypeScript, and Tailwind CSS 4, hosted on **Cloudflare Workers**.

---

## 📋 Índice / Table of Contents

- [Recursos / Features](#-recursos--features)
- [Tecnologias / Technologies](#️-tecnologias--technologies)
- [Pré-requisitos / Prerequisites](#-pré-requisitos--prerequisites)
- [Instalação / Installation](#-instalação--installation)
- [Configuração de Variáveis de Ambiente / Environment Variables Setup](#-configuração-de-variáveis-de-ambiente--environment-variables-setup)
- [Executando o Projeto / Running the Project](#-executando-o-projeto--running-the-project)
- [Build para Produção / Production Build](#-build-para-produção--production-build)
- [Deploy](#-deploy)
- [Scripts Disponíveis / Available Scripts](#-scripts-disponíveis--available-scripts)
- [Estrutura do Projeto / Project Structure](#-estrutura-do-projeto--project-structure)
- [Troubleshooting](#-troubleshooting)
- [Licença / License](#-licença--license)
- [Autor / Author](#-autor--author)

---

## 🚀 Recursos / Features

- ⚡ **Next.js 16** - Framework React com renderização híbrida, otimização de imagens, e roteamento avançado / React framework with hybrid rendering, image optimization, and advanced routing
- 🎭 **React 19** - Biblioteca para construção de interfaces de usuário / Library for building user interfaces
- 💙 **TypeScript** - Tipagem estática para JavaScript / Static typing for JavaScript
- 🎨 **Tailwind CSS 4** - Framework CSS utilitário para estilização rápida / Utility-first CSS framework for rapid styling
- 🌍 **Internacionalização (i18n)** - Suporte multi-idioma (Português/Inglês) com next-intl / Multi-language support (Portuguese/English) with next-intl
- 🖼️ **Framer Motion** - Animações fluidas e interativas / Smooth and interactive animations
- 📱 **Design Responsivo** - Interface adaptável para todos os dispositivos / Responsive interface for all devices
- 🔍 **SEO Otimizado** - Metadados, sitemap, e robots.txt configurados / Optimized metadata, sitemap, and robots.txt
- ☁️ **Cloudflare Workers** - Hospedagem serverless com baixa latência / Serverless hosting with low latency
- 🎮 **Integrações de APIs** - Discord, Last.fm, Steam, MyAnimeList, GitHub, Lyfta / API integrations

---

## 🛠️ Tecnologias / Technologies

- **Frontend:** React 19, Next.js 16, TypeScript, Tailwind CSS 4
- **Animações / Animations:** Framer Motion, GSAP, Three.js
- **Hospedagem / Hosting:** Cloudflare Workers (via OpenNext Cloudflare)
- **Banco de Dados / Database:** Upstash Redis (KV storage para guestbook / for guestbook)
- **Qualidade de Código / Code Quality:** ESLint, Prettier, TypeScript
- **Internacionalização / i18n:** next-intl
- **Gerenciador de Pacotes / Package Manager:** pnpm

---

## 📋 Pré-requisitos / Prerequisites

Antes de começar, certifique-se de ter instalado:

> Before starting, make sure you have installed:

- **Node.js 18+** (recomendado 20+) - [Download](https://nodejs.org/)
- **pnpm** - Gerenciador de pacotes / Package manager
  ```bash
  npm install -g pnpm
  ```

---

## 📦 Instalação / Installation

### 1. Clone o repositório / Clone the repository

```bash
git clone https://github.com/LucasHenriqueDiniz/portifolio-website.git
cd portifolio-website
```

### 2. Instale as dependências / Install dependencies

```bash
pnpm install
```

Este comando instalará todas as dependências necessárias listadas no `package.json`.

> This command will install all necessary dependencies listed in `package.json`.

---

## 🔐 Configuração de Variáveis de Ambiente / Environment Variables Setup

### 1. Copie o arquivo de exemplo / Copy the example file

```bash
cp .env.example .env
```

### 2. Preencha as variáveis de ambiente / Fill in the environment variables

Abra o arquivo `.env` e preencha com suas credenciais:

> Open the `.env` file and fill in with your credentials:

```env
# Discord Integration
DISCORD_ID=seu_discord_user_id_aqui
DISCORD_WEBHOOK_URL=sua_discord_webhook_url_aqui
NEXT_PUBLIC_DISCORD_ID=seu_discord_user_id_aqui

# MyAnimeList Integration
MAL_USERNAME=seu_mal_username_aqui
NEXT_PUBLIC_MAL_USERNAME=seu_mal_username_aqui

# Lyfta Integration
LYFTA_API_KEY=sua_lyfta_api_key_aqui

# Steam Integration
STEAM_API_KEY=sua_steam_api_key_aqui
STEAM_ID=seu_steam_id_aqui

# Last.fm Integration
LASTFM_API_KEY=sua_lastfm_api_key_aqui
LASTFM_USERNAME=seu_lastfm_username_aqui

# GitHub Integration
GITHUB_USERNAME=seu_github_username_aqui
GITHUB_PAT=seu_github_personal_access_token_aqui

# Cloudflare Turnstile (Captcha)
TURNSTILE_SECRET_KEY=sua_turnstile_secret_key_aqui
NEXT_PUBLIC_TURNSTILE_SITE_KEY=sua_turnstile_site_key_aqui
```

### 3. Onde obter as credenciais / Where to get credentials

| Serviço / Service | Como obter / How to get | Documentação / Documentation |
|-------------------|-------------------------|------------------------------|
| **Discord ID** | Ative o modo desenvolvedor no Discord e copie seu ID de usuário / Enable developer mode in Discord and copy your user ID | [Discord Developer Portal](https://discord.com/developers/docs/intro) |
| **Discord Webhook** | Crie um webhook em um canal do Discord / Create a webhook in a Discord channel | [Webhooks Guide](https://support.discord.com/hc/en-us/articles/228383668) |
| **Last.fm API** | Crie uma conta e registre uma aplicação / Create an account and register an application | [Last.fm API](https://www.last.fm/api/account/create) |
| **Steam API** | Obtenha uma chave de API do Steam / Get a Steam API key | [Steam Web API](https://steamcommunity.com/dev/apikey) |
| **GitHub PAT** | Crie um Personal Access Token nas configurações / Create a Personal Access Token in settings | [GitHub Tokens](https://github.com/settings/tokens) |
| **Turnstile** | Crie um site no Cloudflare Turnstile / Create a site in Cloudflare Turnstile | [Turnstile Docs](https://developers.cloudflare.com/turnstile/) |

**⚠️ Importante / Important:**
- Nunca commite o arquivo `.env` no Git / Never commit the `.env` file to Git
- O arquivo `.env` já está incluído no `.gitignore` / The `.env` file is already included in `.gitignore`
- Variáveis com `NEXT_PUBLIC_` são expostas no navegador (client-side) / Variables with `NEXT_PUBLIC_` are exposed in the browser (client-side)
- Variáveis sem prefixo são apenas server-side (seguras) / Variables without prefix are server-side only (secure)

---

## 🚀 Executando o Projeto / Running the Project

### Modo de Desenvolvimento / Development Mode

```bash
pnpm dev
```

O servidor de desenvolvimento será iniciado em [http://localhost:3000](http://localhost:3000).

> The development server will start at [http://localhost:3000](http://localhost:3000).

A página atualiza automaticamente conforme você edita os arquivos.

> The page updates automatically as you edit the files.

---

## 🏗️ Build para Produção / Production Build

### Build Local / Local Build

Para criar uma build de produção do Next.js:

> To create a production build of Next.js:

```bash
pnpm build
```

### Build para Cloudflare Workers

Para criar uma build otimizada para Cloudflare Workers:

> To create an optimized build for Cloudflare Workers:

```bash
pnpm pages:build
```

**Nota:** Este comando detecta automaticamente se você está no Windows e executa o build no WSL se necessário.

> **Note:** This command automatically detects if you're on Windows and runs the build in WSL if needed.

### Testar Build Localmente / Test Build Locally

```bash
pnpm start
```

---

## ☁️ Deploy

Este projeto está configurado para deploy no **Cloudflare Workers** usando **OpenNext Cloudflare**.

> This project is configured for deployment on **Cloudflare Workers** using **OpenNext Cloudflare**.

### Deploy Rápido / Quick Deploy

```bash
pnpm deploy
```

### Deploy com Validações / Deploy with Validations

```bash
pnpm deploy:production
```

Este comando executa:
1. Type checking (`pnpm type-check`)
2. Linting (`pnpm lint`)
3. Build (`pnpm pages:build`)
4. Deploy (`pnpm wrangler deploy`)

> This command runs: type checking, linting, build, and deploy.

### Primeira vez? Login no Cloudflare / First time? Login to Cloudflare

```bash
pnpm cf:login
```

### Configurar Variáveis de Ambiente no Cloudflare

**⚠️ Importante:** Você precisa configurar as mesmas variáveis de ambiente do `.env` no Cloudflare Dashboard.

> **⚠️ Important:** You need to configure the same environment variables from `.env` in the Cloudflare Dashboard.

1. Acesse: https://dash.cloudflare.com
2. Workers & Pages > `seu-worker` > Settings > **Variables and Secrets**
3. Adicione TODAS as variáveis do `.env`

Para mais detalhes sobre deploy, consulte o arquivo `AGENTS.md`.

> For more details about deployment, check the `AGENTS.md` file.

---

## 📝 Scripts Disponíveis / Available Scripts

### Desenvolvimento / Development

| Script | Descrição / Description |
|--------|-------------------------|
| `pnpm dev` | Inicia o servidor de desenvolvimento com Turbopack / Starts development server with Turbopack |
| `pnpm build` | Cria build de produção do Next.js / Creates Next.js production build |
| `pnpm start` | Inicia o servidor de produção / Starts production server |

### Qualidade de Código / Code Quality

| Script | Descrição / Description |
|--------|-------------------------|
| `pnpm lint` | Executa o linter para verificar problemas / Runs linter to check issues |
| `pnpm lint:fix` | Corrige automaticamente problemas de linting / Automatically fixes linting issues |
| `pnpm format` | Formata código com Prettier / Formats code with Prettier |
| `pnpm format:check` | Verifica formatação sem modificar / Checks formatting without modifying |
| `pnpm type-check` | Executa verificação de tipos TypeScript / Runs TypeScript type checking |

### Cloudflare / Deploy

| Script | Descrição / Description |
|--------|-------------------------|
| `pnpm pages:build` | Build para Cloudflare Workers (detecta WSL automaticamente) / Build for Cloudflare Workers (auto-detects WSL) |
| `pnpm deploy` | Build + deploy rápido / Quick build + deploy |
| `pnpm deploy:production` | Build + deploy com validações / Build + deploy with validations |
| `pnpm cf:login` | Login no Cloudflare / Login to Cloudflare |

### Utilitários / Utilities

| Script | Descrição / Description |
|--------|-------------------------|
| `pnpm i18n:unused` | Verifica traduções não usadas / Checks unused translations |
| `pnpm guestbook` | Gerencia mensagens do guestbook / Manages guestbook messages |

---

## 📁 Estrutura do Projeto / Project Structure

```
portifolio-website/
├── public/                      # Arquivos estáticos (imagens, ícones, etc.) / Static files
├── src/
│   ├── app/                     # Rotas do Next.js App Router / Next.js App Router routes
│   │   ├── about/               # Página "Sobre" / About page
│   │   ├── api/                 # API Routes (endpoints do backend) / API Routes
│   │   ├── contact/             # Página de contato / Contact page
│   │   ├── cv/                  # Página de currículo / CV page
│   │   ├── gallery/             # Galeria de projetos / Projects gallery
│   │   ├── projects/            # Página de projetos / Projects page
│   │   ├── layout.tsx           # Layout principal / Main layout
│   │   └── page.tsx             # Página inicial / Home page
│   │
│   ├── components/              # Componentes React reutilizáveis / Reusable React components
│   │   ├── about/               # Componentes da página "Sobre" / About page components
│   │   ├── cv/                  # Componentes do currículo / CV components
│   │   ├── home/                # Componentes da página inicial / Home page components
│   │   ├── layout/              # Componentes de layout (Header, Footer) / Layout components
│   │   ├── projects/            # Componentes de projetos / Project components
│   │   ├── ui/                  # Componentes de UI reutilizáveis / Reusable UI components
│   │   └── ...                  # Outros componentes / Other components
│   │
│   ├── constants/               # Constantes e dados estáticos / Constants and static data
│   │   ├── academicExperiences.ts  # Experiências acadêmicas / Academic experiences
│   │   ├── jobExperiences.ts       # Experiências profissionais / Job experiences
│   │   ├── projects.ts             # Dados dos projetos / Projects data
│   │   ├── skillsData.ts           # Dados de habilidades / Skills data
│   │   └── ...                     # Outras constantes / Other constants
│   │
│   ├── hooks/                   # Custom React Hooks
│   │   ├── useLastFm.ts         # Hook para integração Last.fm / Last.fm integration hook
│   │   ├── useSteamStats.ts     # Hook para integração Steam / Steam integration hook
│   │   ├── useMyAnimeList.ts    # Hook para integração MAL / MAL integration hook
│   │   └── ...                  # Outros hooks / Other hooks
│   │
│   ├── lib/                     # Bibliotecas e utilitários / Libraries and utilities
│   │   ├── auth/                # Autenticação / Authentication
│   │   ├── i18n/                # Configuração de internacionalização / i18n configuration
│   │   ├── cloudflare-kv.ts     # Cliente Upstash Redis / Upstash Redis client
│   │   └── utils.ts             # Funções utilitárias / Utility functions
│   │
│   ├── messages/                # Arquivos de tradução i18n / i18n translation files
│   │   ├── en.json              # Traduções em inglês / English translations
│   │   └── pt.json              # Traduções em português / Portuguese translations
│   │
│   ├── providers/               # React Context Providers
│   │
│   ├── services/                # Serviços de integração com APIs externas / External API integration services
│   │   ├── github.ts            # Serviço GitHub API / GitHub API service
│   │   ├── lastfm.ts            # Serviço Last.fm API / Last.fm API service
│   │   ├── steam.ts             # Serviço Steam API / Steam API service
│   │   ├── myanimelist.ts       # Serviço MyAnimeList API / MyAnimeList API service
│   │   └── lyfta.ts             # Serviço Lyfta API / Lyfta API service
│   │
│   ├── store/                   # Gerenciamento de estado (Zustand) / State management (Zustand)
│   │   ├── guestbookStore.ts    # Store do guestbook / Guestbook store
│   │   └── languageStore.ts     # Store de idioma / Language store
│   │
│   ├── types/                   # Definições de tipos TypeScript / TypeScript type definitions
│   │   ├── env.d.ts             # Tipos de variáveis de ambiente / Environment variables types
│   │   ├── guestbook.types.ts   # Tipos do guestbook / Guestbook types
│   │   └── ...                  # Outros tipos / Other types
│   │
│   └── utils/                   # Funções utilitárias / Utility functions
│       ├── experienceUtils.ts   # Utilitários de experiência / Experience utilities
│       └── rateLimiter.ts       # Rate limiting / Rate limiting
│
├── scripts/                     # Scripts utilitários / Utility scripts
│   ├── build-wsl.js             # Script de build para WSL / WSL build script
│   ├── check-i18n.ts            # Verificador de traduções / Translation checker
│   └── guestbook-cloudflare.js  # Gerenciador de guestbook / Guestbook manager
│
├── .env                         # Variáveis de ambiente (não versionado) / Environment variables (not versioned)
├── .env.example                 # Template de variáveis de ambiente / Environment variables template
├── .gitignore                   # Arquivos ignorados pelo Git / Files ignored by Git
├── AGENTS.md                    # Guia de deploy e arquitetura / Deploy and architecture guide
├── eslint.config.mjs            # Configuração do ESLint / ESLint configuration
├── next.config.ts               # Configuração do Next.js / Next.js configuration
├── next-intl.config.ts          # Configuração do next-intl / next-intl configuration
├── open-next.config.ts          # Configuração do OpenNext / OpenNext configuration
├── package.json                 # Dependências e scripts / Dependencies and scripts
├── pnpm-lock.yaml               # Lock file do pnpm / pnpm lock file
├── tailwind.config.js           # Configuração do Tailwind CSS / Tailwind CSS configuration
├── tsconfig.json                # Configuração do TypeScript / TypeScript configuration
├── wrangler.toml                # Configuração do Cloudflare Workers / Cloudflare Workers configuration
└── README.md                    # Este arquivo / This file
```

### Descrição dos Diretórios Principais / Main Directories Description

| Diretório / Directory | Propósito / Purpose |
|-----------------------|---------------------|
| `src/app/` | Rotas e páginas do Next.js App Router. Cada pasta representa uma rota. / Next.js App Router routes and pages. Each folder represents a route. |
| `src/components/` | Componentes React reutilizáveis organizados por funcionalidade. / Reusable React components organized by functionality. |
| `src/constants/` | Dados estáticos como experiências, projetos, habilidades. / Static data like experiences, projects, skills. |
| `src/hooks/` | Custom React Hooks para lógica reutilizável. / Custom React Hooks for reusable logic. |
| `src/lib/` | Bibliotecas, utilitários e configurações. / Libraries, utilities, and configurations. |
| `src/messages/` | Arquivos de tradução para internacionalização (pt/en). / Translation files for internationalization (pt/en). |
| `src/services/` | Serviços de integração com APIs externas (GitHub, Steam, etc.). / External API integration services (GitHub, Steam, etc.). |
| `src/store/` | Gerenciamento de estado global com Zustand. / Global state management with Zustand. |
| `src/types/` | Definições de tipos TypeScript. / TypeScript type definitions. |
| `scripts/` | Scripts utilitários para build, deploy, e manutenção. / Utility scripts for build, deploy, and maintenance. |

---

## 🐛 Troubleshooting

### Problema: Variáveis de ambiente não carregam / Environment variables not loading

**Solução / Solution:**
1. Verifique se o arquivo `.env` existe na raiz do projeto / Check if `.env` file exists in project root
2. Certifique-se de que as variáveis estão no formato correto: `CHAVE=valor` / Make sure variables are in correct format: `KEY=value`
3. Reinicie o servidor de desenvolvimento após modificar `.env` / Restart development server after modifying `.env`
4. Variáveis com `NEXT_PUBLIC_` devem ser definidas em tempo de build / Variables with `NEXT_PUBLIC_` must be defined at build time

### Problema: Erro "Cannot find module" / "Cannot find module" error

**Solução / Solution:**
```bash
# Limpe node_modules e reinstale / Clean node_modules and reinstall
rm -rf node_modules
pnpm install
```

### Problema: Porta 3000 já está em uso / Port 3000 already in use

**Solução / Solution:**
```bash
# Use uma porta diferente / Use a different port
PORT=3001 pnpm dev
```

Ou mate o processo usando a porta 3000:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Problema: Erro de build no Windows / Build error on Windows

**Solução / Solution:**

O script `pnpm pages:build` detecta automaticamente Windows e executa no WSL. Certifique-se de que:
1. WSL está instalado: `wsl --version`
2. pnpm está instalado no WSL: `wsl bash -c "pnpm --version"`

> The `pnpm pages:build` script automatically detects Windows and runs in WSL. Make sure:
> 1. WSL is installed: `wsl --version`
> 2. pnpm is installed in WSL: `wsl bash -c "pnpm --version"`

### Problema: APIs externas não funcionam / External APIs not working

**Solução / Solution:**
1. Verifique se as credenciais no `.env` estão corretas / Check if credentials in `.env` are correct
2. Verifique se as APIs estão online e acessíveis / Check if APIs are online and accessible
3. Verifique os logs do console do navegador para erros específicos / Check browser console logs for specific errors
4. Algumas APIs têm rate limits - aguarde alguns minutos / Some APIs have rate limits - wait a few minutes

### Problema: Erro de TypeScript / TypeScript error

**Solução / Solution:**
```bash
# Execute type checking para ver todos os erros / Run type checking to see all errors
pnpm type-check

# Limpe o cache do TypeScript / Clean TypeScript cache
rm -rf .next
rm tsconfig.tsbuildinfo
pnpm dev
```

### Problema: Deploy falha no Cloudflare / Deploy fails on Cloudflare

**Solução / Solution:**
1. Verifique se está logado: `pnpm cf:login` / Check if logged in
2. Verifique se as variáveis de ambiente estão configuradas no Cloudflare Dashboard / Check if environment variables are configured in Cloudflare Dashboard
3. Verifique os logs: `npx wrangler tail` / Check logs
4. Consulte o arquivo `AGENTS.md` para troubleshooting detalhado / Check `AGENTS.md` file for detailed troubleshooting

---

## 📚 Documentação Adicional / Additional Documentation

- **AGENTS.md** - Guia completo de deploy e arquitetura do Cloudflare Workers / Complete guide for Cloudflare Workers deployment and architecture
- **Next.js Docs** - https://nextjs.org/docs
- **Tailwind CSS Docs** - https://tailwindcss.com/docs
- **Cloudflare Workers Docs** - https://developers.cloudflare.com/workers
- **OpenNext Cloudflare** - https://opennext.js.org/cloudflare

---

## 📄 Licença / License

Este projeto está licenciado sob a MIT License.

> This project is licensed under the MIT License.

---

## 👤 Autor / Author

**Lucas Henrique Diniz**

- GitHub: [@LucasHenriqueDiniz](https://github.com/LucasHenriqueDiniz)
- Portfolio: [lucashdo.com](https://lucashdo.com)

---

## 🤝 Contribuindo / Contributing

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

> Contributions are welcome! Feel free to open issues or pull requests.

---

**Última atualização / Last updated:** Janeiro 2025 / January 2025

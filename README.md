# Portfolio Website

Um site de portfolio moderno e interativo construído com Next.js 15, React 19, TypeScript, e Tailwind CSS 4.

## 🚀 Recursos

- ⚡ **Next.js 15** - Framework React com renderização híbrida, otimização de imagens, e roteamento avançado
- 🎭 **React 19** - Biblioteca para construção de interfaces de usuário
- 💙 **TypeScript** - Tipagem estática para JavaScript
- 🎨 **Tailwind CSS 4** - Framework CSS utilitário para estilização rápida
- 🌍 **Internacionalização** - Suporte multi-idioma com next-intl
- 🖼️ **Framer Motion** - Animações fluidas e interativas
- 📱 **Design Responsivo** - Interface adaptável para todos os dispositivos
- 🔍 **SEO Otimizado** - Metadados, sitemap, e robots.txt configurados

## 🛠️ Tecnologias

- **Frontend:** React, Next.js, TypeScript, Tailwind CSS
- **Animações:** Framer Motion
- **Qualidade de Código:** ESLint, Prettier, Husky
- **i18n:** next-intl

## 📋 Pré-requisitos

- Node.js 20 ou superior
- npm ou yarn

## 🚀 Início Rápido

First, run the development server:

```bash
npm run dev
# ou
yarn dev
```

Acesse [http://localhost:3000](http://localhost:3000) para visualizar o site.

Você pode começar a editar o site modificando os arquivos em `src/app/`. A página atualiza automaticamente conforme você edita os arquivos.

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento com Turbopack
- `npm run build` - Cria build otimizada para produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter para verificar problemas
- `npm run lint:fix` - Corrige automaticamente problemas de linting
- `npm run type-check` - Executa o verificador de tipos TypeScript

## 📁 Estrutura do Projeto

```
.
├── public/             # Arquivos estáticos
├── src/
│   ├── app/            # Rotas do Next.js App Router
│   ├── components/     # Componentes React reutilizáveis
│   ├── lib/            # Bibliotecas e utilitários
│   └── messages/       # Arquivos de tradução i18n
├── scripts/            # Scripts utilitários
├── eslint.config.mjs   # Configuração do ESLint
├── next.config.ts      # Configuração do Next.js
├── package.json        # Dependências e scripts
└── tailwind.config.js  # Configuração do Tailwind CSS
```

## 🌐 Implantação

Este site está configurado para ser facilmente implantado em plataformas como Vercel, Netlify ou GitHub Pages.

## 📄 Licença

Este projeto está licenciado sob a MIT License.

## 👤 Autor

- **Lucas** - [GitHub](https://github.com/LucasHenriqueDiniz)

## 🛠️ Como funciona a arquitetura de dados

- Os hooks customizados do client (ex: `useLastFmTracks`, `useSteamStats`, `useLyftaStats`) **não acessam diretamente APIs externas nem variáveis de ambiente sensíveis**.
- Eles consomem **rotas internas de API** (`/api/lastfm/tracks`, `/api/steam/stats`, etc), que são executadas no backend (server-side).
- Essas rotas de API usam os services (ex: `getTopArtists`, `getRecentTracks`) e **acessam as variáveis de ambiente seguras** (ex: `LASTFM_API_KEY`, `LASTFM_USERNAME`) que nunca vão para o client.
- Assim, **nenhuma chave de API ou username sensível fica exposta no client/browser**.
- O cache inteligente (Supabase, memória, SWR) é feito no backend e no client, garantindo performance e segurança.

## 🔒 Segurança das variáveis de ambiente

- **NUNCA** coloque chaves de API ou usernames sensíveis como `NEXT_PUBLIC_...` se não for necessário no client.
- Agora, todas as variáveis sensíveis (ex: `LASTFM_API_KEY`, `LASTFM_USERNAME`, `LYFTA_API_KEY`, `STEAM_API_KEY`) ficam apenas no backend/API.
- O client só consome dados já processados e seguros pelas rotas internas.

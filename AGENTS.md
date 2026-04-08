# 🤖 Guia de Deploy e Arquitetura - Portfolio Website

## 📋 Índice
- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Deploy](#deploy)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Comandos Úteis](#comandos-úteis)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

Este é um portfolio Next.js 16 hospedado no **Cloudflare Workers** usando **OpenNext Cloudflare**.

**Stack:**
- Next.js 16.2.2 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Cloudflare Workers (hosting)
- Upstash Redis (KV storage para guestbook)

---

## 🏗️ Arquitetura

### Hosting: Cloudflare Workers (não Pages!)

**Por que Workers e não Pages?**
- OpenNext Cloudflare é projetado para Workers
- Deploy via CLI (`wrangler deploy`)
- Não tem integração automática com GitHub
- Cada deploy é manual

### Estrutura de Deploy

```
.open-next/
├── worker.js          # Worker principal (entry point)
├── assets/            # Assets estáticos (imagens, CSS, JS)
└── server-functions/  # Funções server-side do Next.js
```

### Serviços Externos

1. **Upstash Redis (KV Storage)**
   - Usado para: Guestbook, rate limiting
   - Acesso via: `@vercel/kv` client
   - Variáveis: `KV_URL`, `KV_REST_API_*`

2. **Last.fm API**
   - Usado para: Estatísticas de música
   - Variáveis: `LASTFM_API_KEY`, `LASTFM_USERNAME`

3. **Steam API**
   - Usado para: Perfil de jogos
   - Variáveis: `STEAM_API_KEY`, `STEAM_ID`

4. **Lyfta API**
   - Usado para: Integração Lyfta
   - Variável: `LYFTA_API_KEY`

5. **Cloudflare Turnstile**
   - Usado para: Proteção anti-bot no formulário de contato
   - Variáveis: `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`

6. **Discord Webhook**
   - Usado para: Notificações de contato
   - Variável: `DISCORD_WEBHOOK_URL`

---

## 🚀 Deploy

### Pré-requisitos

1. **Node.js 20+** instalado
2. **pnpm** instalado (`npm install -g pnpm`)
3. **Conta Cloudflare** com Workers habilitado
4. **Wrangler CLI** (instalado via `pnpm install`)

### Deploy Rápido

```bash
# Deploy simples (build + deploy)
pnpm deploy

# Deploy com validações (type-check + lint + build + deploy)
pnpm deploy:production
```

### Deploy Manual (passo a passo)

```bash
# 1. Build do Next.js + OpenNext (detecta automaticamente Windows/WSL)
pnpm pages:build

# 2. Deploy para Cloudflare Workers
pnpm wrangler deploy
```

### Build Automático no WSL

O comando `pnpm pages:build` agora detecta automaticamente se você está no Windows e executa o build no WSL. Você não precisa mais se preocupar com isso!

**Como funciona:**
- No Windows: Automaticamente executa via WSL
- No Linux/Mac: Executa nativamente

**Requisitos no Windows:**
- WSL instalado e configurado
- pnpm instalado no WSL
- Projeto acessível no WSL (ex: `/mnt/e/Repositories/portifolio-website`)

### Primeira vez? Login no Cloudflare

```bash
pnpm cf:login
# ou
npx wrangler login
```

---

## 🔐 Variáveis de Ambiente

### Desenvolvimento Local (`.env.local`)

Todas as variáveis ficam em `.env.local` (não commitado no git).

```env
# Upstash Redis (KV Storage)
KV_URL="rediss://..."
KV_REST_API_URL="https://..."
KV_REST_API_TOKEN="..."
KV_REST_API_READ_ONLY_TOKEN="..."

# APIs Externas
LASTFM_API_KEY=...
LASTFM_USERNAME=...
LASTFM_USER_AGENT=...
STEAM_API_KEY=...
STEAM_ID=...
LYFTA_API_KEY=...

# Cloudflare Turnstile
TURNSTILE_SECRET_KEY=...
NEXT_PUBLIC_TURNSTILE_SITE_KEY=...

# Discord
DISCORD_WEBHOOK_URL=...
```

### Produção (Cloudflare Dashboard)

**Onde configurar:**
1. Acesse: https://dash.cloudflare.com
2. Workers & Pages > `lucashdo` > Settings > **Variables and Secrets**
3. Adicione TODAS as variáveis do `.env.local`

**⚠️ Importante:**
- Variáveis com `NEXT_PUBLIC_` são expostas no navegador
- Variáveis sem prefixo são apenas server-side (seguras)
- Sempre adicione variáveis novas no Cloudflare Dashboard após adicionar no `.env.local`

### Diferença entre NEXT_PUBLIC_ e variáveis normais

```typescript
// ✅ NEXT_PUBLIC_TURNSTILE_SITE_KEY
// - Usada no navegador (client-side)
// - Pode ser vista por qualquer um no código fonte
// - Necessária para widgets que rodam no browser

// ✅ TURNSTILE_SECRET_KEY
// - Usada apenas no servidor (server-side)
// - Nunca exposta ao navegador
// - Segura para secrets e API keys
```

---

## 🛠️ Comandos Úteis

### Desenvolvimento

```bash
# Servidor de desenvolvimento local
pnpm dev

# Build local (Next.js apenas)
pnpm build

# Type checking
pnpm type-check

# Linting
pnpm lint
pnpm lint:fix

# Formatação
pnpm format
pnpm format:check

# Testes
pnpm test
pnpm test:watch
```

### Cloudflare

```bash
# Login no Cloudflare
pnpm cf:login

# Build para Cloudflare
pnpm pages:build

# Deploy
pnpm wrangler deploy

# Ver logs em tempo real
npx wrangler tail

# Listar deployments
npx wrangler deployments list

# Rollback para versão anterior
npx wrangler rollback [VERSION_ID]
```

### Utilitários

```bash
# Verificar traduções não usadas
pnpm i18n:unused

# Gerenciar guestbook
pnpm guestbook list              # Lista todas as mensagens
pnpm guestbook view <id>         # Visualiza detalhes de uma mensagem
pnpm guestbook add               # Adiciona uma nova mensagem (interativo)
pntml guestbook edit <id>         # Edita uma mensagem (interativo)
pnpm guestbook remove <id>       # Remove uma mensagem
pnpm guestbook help              # Mostra ajuda
```

---

## 🐛 Troubleshooting

### Erro: "Cannot find native binding" no WSL

**Problema:** `@ast-grep/napi` não encontra bindings nativos do Linux.

**Solução:**
```bash
rm -rf node_modules
pnpm install
```

### Erro: "Export [IconName] doesn't exist in target module"

**Problema:** Ícone do `react-icons` não existe na versão instalada.

**Solução:**
1. Verifique a versão: `pnpm list react-icons`
2. Procure o ícone correto em: https://react-icons.github.io/react-icons
3. Use ícones customizados em `public/icons/` se necessário

### Erro: "EPERM: operation not permitted, symlink" no Windows

**Problema:** OpenNext tenta criar symlinks no Windows.

**Solução:** O script `pnpm pages:build` agora detecta automaticamente e roda no WSL. Se ainda assim der erro:

```bash
# Certifique-se de que WSL está instalado
wsl --version

# Instale pnpm no WSL se necessário
wsl bash -c "npm install -g pnpm"

# Tente novamente
pnpm pages:build
```

### Erro: "Could not resolve 'async_hooks'" ou módulos Node.js

**Problema:** `compatibility_date` muito antiga ou `nodejs_compat` não habilitado.

**Solução:** Verifique `wrangler.toml`:
```toml
compatibility_date = "2026-04-07"  # Data atual ou recente
compatibility_flags = ["nodejs_compat"]
```

### Site não carrega após deploy

**Checklist:**
1. ✅ Todas as variáveis de ambiente estão no Cloudflare Dashboard?
2. ✅ Domínio customizado configurado em "Domains & Routes"?
3. ✅ DNS está apontando corretamente?
4. ✅ Logs mostram algum erro? (`npx wrangler tail`)

### Formulário de contato não funciona

**Checklist:**
1. ✅ `DISCORD_WEBHOOK_URL` configurada?
2. ✅ `TURNSTILE_SECRET_KEY` e `NEXT_PUBLIC_TURNSTILE_SITE_KEY` configuradas?
3. ✅ Webhook do Discord está ativo?
4. ✅ Verifique logs: `npx wrangler tail`

---

## 📊 Monitoramento

### Logs e Traces

Configurado em `wrangler.toml`:
```toml
[observability]
enabled = true

[observability.logs]
enabled = true
head_sampling_rate = 1  # 100% dos logs

[observability.traces]
enabled = true
head_sampling_rate = 0.1  # 10% das traces
```

**Ver logs em tempo real:**
```bash
npx wrangler tail
```

**Ver no Dashboard:**
1. Workers & Pages > `lucashdo` > **Observability**
2. Logs, Traces, Metrics disponíveis

### Métricas

**Dashboard Cloudflare:**
- Workers & Pages > `lucashdo` > **Metrics**
- Requests, Errors, CPU time, Duration

---

## 🔄 Workflow de Deploy

### Deploy Normal (desenvolvimento)

```bash
# 1. Faça suas alterações no código
# 2. Teste localmente
pnpm dev

# 3. Build e deploy
pnpm deploy
```

### Deploy Produção (com validações)

```bash
# 1. Valida tipos, lint, build e deploy
pnpm deploy:production

# 2. Verifique se está tudo ok
# Acesse: https://lucashdo.com
# Ou: https://lucashdo.lucas-hdo.workers.dev
```

### Rollback (se algo der errado)

```bash
# 1. Liste deployments
npx wrangler deployments list

# 2. Faça rollback para versão anterior
npx wrangler rollback [VERSION_ID]
```

---

## 📝 Notas Importantes

1. **Não há integração com GitHub** - Deploy é sempre manual via CLI
2. **Build automático no WSL** - Script detecta Windows e roda no WSL automaticamente
3. **Variáveis de ambiente** - Sempre configure no Cloudflare Dashboard
4. **Cache** - Cloudflare cacheia assets automaticamente
5. **Logs** - Sempre ative observability para debug
6. **Custos** - Plano Free tem limites (100k requests/dia)
7. **Imagens** - `unoptimized: true` no next.config.ts (Cloudflare Workers não suporta otimização nativa)

---

## 🔗 Links Úteis

- **Dashboard Cloudflare:** https://dash.cloudflare.com
- **Worker:** https://dash.cloudflare.com/workers/lucashdo
- **DNS:** https://dash.cloudflare.com/lucashdo.com/dns
- **Docs OpenNext:** https://opennext.js.org/cloudflare
- **Docs Cloudflare Workers:** https://developers.cloudflare.com/workers
- **Docs Wrangler:** https://developers.cloudflare.com/workers/wrangler

---

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs: `npx wrangler tail`
2. Consulte este documento
3. Verifique a documentação oficial
4. Verifique issues no GitHub do OpenNext Cloudflare

---

**Última atualização:** 07/04/2026
**Versão:** 1.0.0

# 🛠️ Scripts Utilitários

## 📚 Guestbook Manager (guestbook-manager-simple.js)

Ferramenta CLI completa para gerenciar o guestbook do portfolio.

**Características:**
- ✅ Sem dependências externas (usa apenas Node.js built-ins)
- ✅ Funciona nativamente no Windows, Linux e Mac
- ✅ Interface colorida e interativa
- ✅ Suporte a IDs parciais
- ✅ CRUD completo

### Comandos Disponíveis

#### 📋 Listar mensagens
```bash
pnpm guestbook list
# ou
pnpm guestbook ls
```

Mostra todas as mensagens do guestbook com:
- Número sequencial
- ID (primeiros 8 caracteres)
- Nome do autor
- Preview da mensagem
- Data de criação

#### 👁️ Visualizar detalhes
```bash
pnpm guestbook view <id>
# ou
pnpm guestbook show <id>
```

Mostra todos os detalhes de uma mensagem específica:
- ID completo
- Nome
- Email
- Data completa
- Mensagem completa

**Dica:** Você pode usar apenas os primeiros caracteres do ID!

```bash
# Ao invés de:
pnpm guestbook view 550e8400-e29b-41d4-a716-446655440000

# Pode usar:
pnpm guestbook view 550e8400
```

#### ➕ Adicionar mensagem
```bash
pnpm guestbook add
# ou
pnpm guestbook create
# ou
pnpm guestbook new
```

Modo interativo que solicita:
1. Nome
2. Email
3. Mensagem

A mensagem é adicionada no topo da lista.

#### ✏️ Editar mensagem
```bash
pnpm guestbook edit <id>
# ou
pnpm guestbook update <id>
```

Modo interativo que permite editar:
- Nome
- Email
- Mensagem

**Dica:** Deixe em branco para manter o valor atual.

#### 🗑️ Remover mensagem
```bash
pnpm guestbook remove <id>
# ou
pnpm guestbook delete <id>
# ou
pnpm guestbook rm <id>
```

Remove uma mensagem após confirmação.

#### ❓ Ajuda
```bash
pnpm guestbook help
# ou
pnpm guestbook --help
# ou
pnpm guestbook -h
# ou apenas
pnpm guestbook
```

---

## 🔧 Build WSL (build-wsl.js)

Script que detecta automaticamente o sistema operacional e executa o build no ambiente correto.

### Como funciona

**No Windows:**
- Detecta automaticamente que está no Windows
- Converte o caminho do Windows para WSL (`C:\...` → `/mnt/c/...`)
- Executa o build no WSL via `wsl bash -c`

**No Linux/Mac:**
- Executa o build nativamente

### Uso

```bash
# Chamado automaticamente por:
pnpm pages:build
pnpm deploy
pnpm deploy:production
```

### Requisitos (Windows)

- WSL instalado e configurado
- Node.js e pnpm instalados no WSL
- Projeto acessível no WSL

---

## 🌐 Check i18n (check-i18n.ts)

Verifica traduções não utilizadas no projeto.

### Uso

```bash
pnpm i18n:unused
```

Analisa os arquivos de tradução e identifica chaves que não estão sendo usadas no código.

---

## 📝 Notas

### Variáveis de Ambiente

Todos os scripts que interagem com o KV (Guestbook Manager) requerem:

```env
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
```

Defina-as no `.env.local`.

### Permissões

No Linux/Mac, você pode precisar dar permissão de execução:

```bash
chmod +x scripts/*.js
chmod +x scripts/*.ts
```

---

## 🆘 Troubleshooting

### "Cannot find module 'dotenv'"

```bash
pnpm install
```

### "KV_REST_API_URL não encontrada"

Certifique-se de que o `.env.local` existe e contém as variáveis necessárias.

### Build falha no Windows

O script `build-wsl.js` deve resolver automaticamente. Se não funcionar:

1. Verifique se WSL está instalado: `wsl --version`
2. Verifique se pnpm está instalado no WSL: `wsl bash -c "pnpm --version"`
3. Tente manualmente: `wsl bash -c "cd /mnt/e/Repositories/portifolio-website && pnpm install"`

---

**Última atualização:** 07/04/2026

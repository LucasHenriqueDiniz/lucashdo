#!/usr/bin/env node

/**
 * Guestbook Manager - Cloudflare KV Edition
 * 
 * Gerencia mensagens do guestbook usando Cloudflare KV via Wrangler CLI
 * 
 * Comandos:
 *   pnpm guestbook list              - Lista todas as mensagens
 *   pnpm guestbook view <id>         - Visualiza detalhes de uma mensagem
 *   pnpm guestbook remove <id>       - Remove uma mensagem
 * 
 * Nota: Requer wrangler CLI instalado e autenticado
 */

const { execSync } = require('child_process');

const KV_KEY = 'guestbook_entries';

// Helpers de formatação
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = '') {
  console.log(`${color}${message}${colors.reset}`);
}

function error(message) {
  log(`❌ ${message}`, colors.red);
}

function success(message) {
  log(`✅ ${message}`, colors.green);
}

function info(message) {
  log(`ℹ️  ${message}`, colors.cyan);
}

function warn(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

// Executa comando wrangler
function runWrangler(command) {
  try {
    const output = execSync(`pnpm wrangler ${command}`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return output;
  } catch (err) {
    throw new Error(`Wrangler command failed: ${err.message}`);
  }
}

// Busca dados do KV
async function getGuestbookEntries() {
  try {
    info('Buscando mensagens do Cloudflare KV...');
    const output = runWrangler(`kv key get "${KV_KEY}" --namespace-id=d0e7895ea27843449e19a3e3d876478f`);
    
    if (!output || output.trim() === '') {
      return [];
    }
    
    return JSON.parse(output);
  } catch (err) {
    if (err.message.includes('not found')) {
      return [];
    }
    throw err;
  }
}

// Salva dados no KV
async function saveGuestbookEntries(entries) {
  const json = JSON.stringify(entries);
  const escapedJson = json.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  runWrangler(`kv key put "${KV_KEY}" "${escapedJson}" --namespace-id=d0e7895ea27843449e19a3e3d876478f`);
}

// Lista todas as mensagens
async function listEntries() {
  const entries = await getGuestbookEntries();

  if (entries.length === 0) {
    warn('Nenhuma mensagem encontrada no guestbook.');
    return;
  }

  log(`\n📋 ${colors.bright}Mensagens do Guestbook (${entries.length})${colors.reset}\n`);

  entries.forEach((entry, index) => {
    const date = new Date(entry.created_at).toLocaleString('pt-BR');
    const type = entry.is_developer ? '👨‍💻 Dev' : '👤 Visitante';
    
    log(`${colors.bright}#${index + 1}${colors.reset} ${colors.cyan}${entry.id}${colors.reset}`);
    log(`   ${type} | ${entry.name}${entry.username ? ` (@${entry.username})` : ''}`);
    log(`   ${entry.emoji} ${colors.dim}${entry.message}${colors.reset}`);
    log(`   ${colors.dim}${date}${colors.reset}\n`);
  });
}

// Visualiza detalhes de uma mensagem
async function viewEntry(id) {
  const entries = await getGuestbookEntries();
  const entry = entries.find(e => e.id === id);

  if (!entry) {
    error(`Mensagem com ID ${id} não encontrada.`);
    return;
  }

  const date = new Date(entry.created_at).toLocaleString('pt-BR');
  const type = entry.is_developer ? '👨‍💻 Desenvolvedor' : '👤 Visitante';

  log(`\n${colors.bright}📝 Detalhes da Mensagem${colors.reset}\n`);
  log(`${colors.cyan}ID:${colors.reset}         ${entry.id}`);
  log(`${colors.cyan}Nome:${colors.reset}       ${entry.name}`);
  log(`${colors.cyan}Username:${colors.reset}   ${entry.username || 'N/A'}`);
  log(`${colors.cyan}Tipo:${colors.reset}       ${type}`);
  log(`${colors.cyan}Emoji:${colors.reset}      ${entry.emoji}`);
  log(`${colors.cyan}Mensagem:${colors.reset}   ${entry.message}`);
  log(`${colors.cyan}Avatar:${colors.reset}     ${entry.avatar_url || 'N/A'}`);
  log(`${colors.cyan}Data:${colors.reset}       ${date}\n`);
}

// Remove uma mensagem
async function removeEntry(id) {
  const entries = await getGuestbookEntries();
  const filtered = entries.filter(e => e.id !== id);

  if (filtered.length === entries.length) {
    error(`Mensagem com ID ${id} não encontrada.`);
    return;
  }

  await saveGuestbookEntries(filtered);
  success(`Mensagem ${id} removida com sucesso!`);
  info(`Total de mensagens: ${filtered.length}`);
}

// Mostra ajuda
function showHelp() {
  log(`
${colors.bright}📚 Guestbook Manager - Cloudflare KV${colors.reset}

${colors.cyan}Comandos disponíveis:${colors.reset}

  ${colors.bright}list${colors.reset}              Lista todas as mensagens
  ${colors.bright}view <id>${colors.reset}         Visualiza detalhes de uma mensagem
  ${colors.bright}remove <id>${colors.reset}       Remove uma mensagem
  ${colors.bright}help${colors.reset}              Mostra esta ajuda

${colors.cyan}Exemplos:${colors.reset}

  pnpm guestbook list
  pnpm guestbook view abc-123-def
  pnpm guestbook remove abc-123-def

${colors.dim}Nota: Requer wrangler CLI instalado e autenticado${colors.reset}
`);
}

// Main
async function main() {
  const [command, ...args] = process.argv.slice(2);

  try {
    switch (command) {
      case 'list':
        await listEntries();
        break;

      case 'view':
        if (!args[0]) {
          error('Informe o ID da mensagem: pnpm guestbook view <id>');
          process.exit(1);
        }
        await viewEntry(args[0]);
        break;

      case 'remove':
      case 'rm':
      case 'delete':
        if (!args[0]) {
          error('Informe o ID da mensagem: pnpm guestbook remove <id>');
          process.exit(1);
        }
        await removeEntry(args[0]);
        break;

      case 'help':
      case '--help':
      case '-h':
        showHelp();
        break;

      default:
        error(`Comando desconhecido: ${command || '(vazio)'}`);
        showHelp();
        process.exit(1);
    }
  } catch (err) {
    error(`Erro: ${err.message}`);
    process.exit(1);
  }
}

main();

#!/usr/bin/env node

/**
 * Popula Cloudflare KV com mensagens do guestbook
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const KV_NAMESPACE_ID = 'd0e7895ea27843449e19a3e3d876478f';
const KV_KEY = 'guestbook_entries';

const seedFile = path.join(__dirname, 'seed-guestbook.json');

console.log('📥 Carregando mensagens do seed...');
const entries = JSON.parse(fs.readFileSync(seedFile, 'utf-8'));

console.log(`💾 Salvando ${entries.length} mensagens no Cloudflare KV...`);

try {
  // Windows PowerShell precisa do caminho completo
  const wranglerCmd = process.platform === 'win32' 
    ? 'node_modules\\.bin\\wrangler.cmd'
    : 'npx wrangler';
    
  execSync(
    `${wranglerCmd} kv key put ${KV_KEY} --path="${seedFile}" --namespace-id=${KV_NAMESPACE_ID}`,
    { stdio: 'inherit', shell: 'powershell.exe' }
  );
  
  console.log('✅ Guestbook populado com sucesso!');
  console.log('\n📝 Próximos passos:');
  console.log('   1. Teste: pnpm guestbook list');
  console.log('   2. Limpe localStorage do navegador para ver as novas mensagens');
  console.log('   3. Acesse o site e veja o guestbook atualizado');
  
} catch (error) {
  console.error('❌ Erro:', error.message);
  process.exit(1);
}

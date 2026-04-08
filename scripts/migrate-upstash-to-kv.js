#!/usr/bin/env node

/**
 * Migração: Upstash Redis → Cloudflare KV
 * 
 * Busca mensagens do Upstash e salva no Cloudflare KV
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Carrega .env.local manualmente
function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) {
    return;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      process.env[key] = value;
    }
  });
}

loadEnv();

const KV_NAMESPACE_ID = 'd0e7895ea27843449e19a3e3d876478f';
const KV_KEY = 'guestbook_entries';

// Busca dados do Upstash via REST API
async function fetchFromUpstash() {
  const url = `${process.env.KV_REST_API_URL}/lrange/guestbook_entries/0/49`;
  
  console.log('📥 Buscando mensagens do Upstash...');
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${process.env.KV_REST_API_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Upstash request failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.result || [];
}

// Salva no Cloudflare KV via Wrangler
function saveToCloudflareKV(entries) {
  console.log(`💾 Salvando ${entries.length} mensagens no Cloudflare KV...`);
  
  // Salva em arquivo temporário
  const tempFile = path.join(__dirname, 'temp-guestbook.json');
  fs.writeFileSync(tempFile, JSON.stringify(entries));
  
  try {
    execSync(
      `pnpm wrangler kv key put ${KV_KEY} --path="${tempFile}" --namespace-id=${KV_NAMESPACE_ID}`,
      { stdio: 'inherit' }
    );
    
    // Remove arquivo temporário
    fs.unlinkSync(tempFile);
  } catch (error) {
    // Remove arquivo temporário mesmo em caso de erro
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }
    throw error;
  }
}

// Main
async function migrate() {
  try {
    // Valida env vars do Upstash
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      console.error('❌ Variáveis KV_REST_API_URL e KV_REST_API_TOKEN são necessárias');
      console.error('   Adicione-as temporariamente no .env.local para migração');
      process.exit(1);
    }

    // Busca do Upstash
    const entries = await fetchFromUpstash();
    
    if (entries.length === 0) {
      console.log('⚠️  Nenhuma mensagem encontrada no Upstash');
      return;
    }

    console.log(`✅ ${entries.length} mensagens encontradas no Upstash`);
    
    // Salva no Cloudflare KV
    saveToCloudflareKV(entries);
    
    console.log('✅ Migração concluída com sucesso!');
    console.log('\n📝 Próximos passos:');
    console.log('   1. Teste: pnpm guestbook list');
    console.log('   2. Remova as variáveis KV_REST_API_* do .env.local');
    console.log('   3. Remova as variáveis do Cloudflare Dashboard');
    
  } catch (error) {
    console.error('❌ Erro na migração:', error.message);
    process.exit(1);
  }
}

migrate();

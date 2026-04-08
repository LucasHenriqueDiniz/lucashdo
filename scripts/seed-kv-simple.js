#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ACCOUNT_ID = 'SEU_ACCOUNT_ID'; // Você precisa pegar isso
const NAMESPACE_ID = 'd0e7895ea27843449e19a3e3d876478f';
const API_TOKEN = 'SEU_API_TOKEN'; // Você precisa criar um token

const seedFile = path.join(__dirname, 'seed-guestbook.json');
const entries = JSON.parse(fs.readFileSync(seedFile, 'utf-8'));

console.log(`💾 Salvando ${entries.length} mensagens...`);

fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}/values/guestbook_entries`, {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(entries),
})
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      console.log('✅ Sucesso!');
    } else {
      console.error('❌ Erro:', data.errors);
    }
  })
  .catch(err => console.error('❌ Erro:', err.message));

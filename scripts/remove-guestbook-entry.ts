import { config } from 'dotenv';
import type { GuestbookEntry } from '@/types/guestbook.types';

const ENV_FILES = ['.env.local', '.env.development.local', '.env.development', '.env'] as const;

for (const file of ENV_FILES) {
  config({ path: file, override: true });
}

async function removeGuestbookEntry() {
  const args = process.argv.slice(2).filter(arg => arg !== '--');
  const idArg = args[0];

  if (!idArg) {
    throw new Error('Informe o ID da mensagem: pnpm guestbook:remove -- <id>');
  }

  const requiredEnv = ['KV_REST_API_URL', 'KV_REST_API_TOKEN'] as const;
  const missing = requiredEnv.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `As variáveis ${missing.join(', ')} são obrigatórias. Defina-as no ambiente ou arquivo .env.local.`
    );
  }

  const { kv, KV_KEYS } = await import('@/lib/kv');

  const entries = (await kv.lrange<GuestbookEntry>(KV_KEYS.guestbook, 0, -1)) ?? [];

  if (entries.length === 0) {
    console.log('Nenhuma mensagem encontrada no guestbook.');
    return;
  }

  const filtered = entries.filter(entry => entry.id !== idArg);

  if (filtered.length === entries.length) {
    console.warn(`Nenhuma mensagem encontrada com o ID ${idArg}.`);
    return;
  }

  await kv.del(KV_KEYS.guestbook);
  if (filtered.length > 0) {
    await kv.rpush(KV_KEYS.guestbook, ...filtered);
  }

  console.log(`Mensagem ${idArg} removida com sucesso. Total atual: ${filtered.length}.`);
}

removeGuestbookEntry()
  .then(() => {
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

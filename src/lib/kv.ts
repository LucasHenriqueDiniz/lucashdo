import { kv as client } from '@vercel/kv';

const REQUIRED_ENV_VARS = ['KV_REST_API_URL', 'KV_REST_API_TOKEN'] as const;

const missingEnv = REQUIRED_ENV_VARS.filter(key => !process.env[key]);

if (missingEnv.length > 0) {
  throw new Error(
    `Missing Upstash/Vercel KV environment variables: ${missingEnv.join(', ')}. ` +
      'Make sure they are defined in your environment or `.env.local` file.'
  );
}

export const kv = client;
export const KV_KEYS = {
  guestbook: 'guestbook_entries',
  cache: (key: string) => `cache:${key}`,
};

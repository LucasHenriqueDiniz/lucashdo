declare namespace NodeJS {
  interface ProcessEnv {
    TURNSTILE_SECRET_KEY?: string;
    NEXT_PUBLIC_TURNSTILE_SITE_KEY?: string;
    NEXT_PUBLIC_STEAM_ID?: string;
    SMTP_HOST?: string;
    SMTP_PORT?: string;
    SMTP_USER?: string;
    SMTP_PASS?: string;
    SMTP_FROM?: string;
    SMTP_TO?: string;
    SMTP_SECURE?: string;
    DISCORD_WEBHOOK_URL?: string;
    RESEND_API_KEY?: string;
    KV_REST_API_URL?: string;
    KV_REST_API_TOKEN?: string;
    KV_REST_API_READ_ONLY_TOKEN?: string;
    KV_URL?: string;
    KV_REST_API_NAME?: string;
    REDIS_URL?: string;
    POSTGRES_URL?: string;
    POSTGRES_USER?: string;
    POSTGRES_HOST?: string;
    POSTGRES_PRISMA_URL?: string;
    POSTGRES_PASSWORD?: string;
    POSTGRES_DATABASE?: string;
    POSTGRES_URL_NON_POOLING?: string;
    SUPABASE_URL?: string;
    SUPABASE_JWT_SECRET?: string;
    SUPABASE_ANON_KEY?: string;
    SUPABASE_SERVICE_ROLE_KEY?: string;
    LASTFM_API_KEY?: string;
    LASTFM_USERNAME?: string;
    LASTFM_USER_AGENT?: string;
    STEAM_API_KEY?: string;
    STEAM_ID?: string;
    LYFTA_API_KEY?: string;
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    // Cloudflare Turnstile (anti-bot)
    TURNSTILE_SECRET_KEY?: string;
    NEXT_PUBLIC_TURNSTILE_SITE_KEY?: string;

    // Discord Webhook (notificações de contato)
    DISCORD_WEBHOOK_URL?: string;

    // Last.fm API (estatísticas de música)
    LASTFM_API_KEY?: string;
    LASTFM_USERNAME?: string;
    LASTFM_USER_AGENT?: string;

    // Steam API (perfil de jogos)
    STEAM_API_KEY?: string;
    STEAM_ID?: string;

    // Lyfta API
    LYFTA_API_KEY?: string;
  }
}

// Cloudflare bindings (via OpenNext)
interface CloudflareEnv {
  KV: KVNamespace;
}

// Rate limiter para controlar posts por IP
interface RateLimitEntry {
  count: number;
  resetTime: number;
  lastPost: number;
}

class RateLimiter {
  private storage = new Map<string, RateLimitEntry>();
  private readonly maxRequests: number;
  private readonly windowMs: number;
  private readonly cooldownMs: number;

  constructor(
    maxRequests: number = 3, // 3 posts por janela de tempo
    windowMs: number = 15 * 60 * 1000, // 15 minutos
    cooldownMs: number = 2 * 60 * 1000 // 2 minutos entre posts
  ) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.cooldownMs = cooldownMs;
  }

  check(ip: string): { allowed: boolean; message?: string; retryAfter?: number } {
    const now = Date.now();
    const entry = this.storage.get(ip);

    // Limpar entradas expiradas periodicamente
    this.cleanup();

    if (!entry) {
      // Primeira requisição do IP
      this.storage.set(ip, {
        count: 1,
        resetTime: now + this.windowMs,
        lastPost: now,
      });
      return { allowed: true };
    }

    // Verificar se a janela de tempo expirou
    if (now > entry.resetTime) {
      this.storage.set(ip, {
        count: 1,
        resetTime: now + this.windowMs,
        lastPost: now,
      });
      return { allowed: true };
    }

    // Verificar cooldown entre posts
    if (now - entry.lastPost < this.cooldownMs) {
      const retryAfter = Math.ceil((this.cooldownMs - (now - entry.lastPost)) / 1000);
      return {
        allowed: false,
        message: `Aguarde ${retryAfter} segundos antes de postar novamente.`,
        retryAfter,
      };
    }

    // Verificar limite de posts na janela de tempo
    if (entry.count >= this.maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      return {
        allowed: false,
        message: `Muitos posts. Tente novamente em ${Math.ceil(retryAfter / 60)} minutos.`,
        retryAfter,
      };
    }

    // Permitir e incrementar contador
    this.storage.set(ip, {
      ...entry,
      count: entry.count + 1,
      lastPost: now,
    });

    return { allowed: true };
  }

  private cleanup() {
    const now = Date.now();
    for (const [ip, entry] of this.storage.entries()) {
      if (now > entry.resetTime + this.windowMs) {
        this.storage.delete(ip);
      }
    }
  }

  // Método para obter estatísticas (útil para debugging)
  getStats(ip: string) {
    const entry = this.storage.get(ip);
    if (!entry) return null;

    const now = Date.now();
    return {
      count: entry.count,
      remaining: Math.max(0, this.maxRequests - entry.count),
      resetTime: entry.resetTime,
      secondsUntilReset: Math.max(0, Math.ceil((entry.resetTime - now) / 1000)),
      lastPost: entry.lastPost,
      cooldownRemaining: Math.max(0, Math.ceil((entry.lastPost + this.cooldownMs - now) / 1000)),
    };
  }
}

// Instância global do rate limiter
export const rateLimiter = new RateLimiter();

// Função auxiliar para obter o IP real do cliente
export function getClientIP(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');

  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  if (realIP) {
    return realIP.trim();
  }

  if (cfConnectingIP) {
    return cfConnectingIP.trim();
  }

  // Fallback para desenvolvimento local
  return '127.0.0.1';
}

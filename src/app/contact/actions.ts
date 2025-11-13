'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { logger } from '@/lib/logger';
import { localeNames, locales, defaultLocale } from '@/lib/i18n/config';
import { ConfirmationEmail } from '@/components/emails/ConfirmationEmail';
import { OwnerEmail } from '@/components/emails/OwnerEmail';

const isSupportedLocale = (value: string): value is (typeof locales)[number] =>
  (locales as readonly string[]).includes(value as (typeof locales)[number]);

const describeLanguage = (value?: string | null) => {
  if (!value) return 'indefinido';
  const normalized = value.split('-')[0]?.toLowerCase();
  if (normalized && isSupportedLocale(normalized)) {
    return `${localeNames[normalized]} (${normalized})`;
  }
  return normalized || 'indefinido';
};

const normalizeToLocale = (value?: string | null): LocaleCode => {
  const normalized = value?.split('-')[0]?.toLowerCase();
  return normalized && isSupportedLocale(normalized) ? normalized : defaultLocale;
};

const ContactSchema = z.object({
  name: z.string().trim().min(2, 'Informe pelo menos 2 caracteres').max(120, 'Nome muito longo'),
  email: z.string().trim().toLowerCase().email('Email inválido').max(160, 'Email muito longo'),
  intent: z.enum(['hire', 'project', 'consult', 'partner', 'press'], {
    required_error: 'Selecione um motivo para o contato',
  }),
  message: z
    .string()
    .trim()
    .min(10, 'Sua mensagem está muito curta')
    .max(4000, 'Sua mensagem ultrapassou o limite de 4000 caracteres'),
  preferredMethod: z.enum(['email', 'telefone', 'discord', 'linkedin', 'outro'], {
    required_error: 'Informe como prefere receber o retorno',
  }),
  preferredValue: z
    .string()
    .trim()
    .min(3, 'Detalhe de contato muito curto')
    .max(180, 'Use até 180 caracteres'),
  honeypot: z.string().optional(),
  turnstileToken: z.string().optional(),
  language: z.string().trim().min(2).max(5).optional(),
});

type ContactFormData = z.infer<typeof ContactSchema>;
type IntentValue = ContactFormData['intent'];
type MethodValue = ContactFormData['preferredMethod'];
type LocaleCode = (typeof locales)[number];

type ContactFormState = {
  status: 'idle' | 'success' | 'invalid' | 'rate_limited' | 'error';
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

type RateLimiterEntry = { count: number; ts: number };
const memoryBucket = new Map<string, RateLimiterEntry>();

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;
const IS_DEV = process.env.NODE_ENV !== 'production';

function rateLimit(key: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const item = memoryBucket.get(key) ?? { count: 0, ts: now };

  if (now - item.ts > windowMs) {
    item.count = 0;
    item.ts = now;
  }

  item.count += 1;
  memoryBucket.set(key, item);

  if (item.count > limit) {
    const error = new Error('rate_limited');
    error.name = 'RateLimitError';
    throw error;
  }
}

function escapeHTML(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const INTENT_LABELS: Record<LocaleCode, Record<IntentValue, string>> = {
  pt: {
    hire: 'Contratação full-time',
    project: 'Projeto sob demanda',
    consult: 'Consultoria técnica',
    partner: 'Parcerias estratégicas',
    press: 'Imprensa & palestras',
  },
  en: {
    hire: 'Full-time hiring',
    project: 'Project engagement',
    consult: 'Technical consulting',
    partner: 'Strategic partnership',
    press: 'Press & speaking',
  },
};

const METHOD_LABELS: Record<LocaleCode, Record<MethodValue, string>> = {
  pt: {
    email: 'Email',
    telefone: 'Telefone / WhatsApp',
    discord: 'Discord',
    linkedin: 'LinkedIn',
    outro: 'Outro canal',
  },
  en: {
    email: 'Email',
    telefone: 'Phone / WhatsApp',
    discord: 'Discord',
    linkedin: 'LinkedIn',
    outro: 'Other channel',
  },
};

const DISCORD_LABELS: Record<
  LocaleCode,
  {
    title: string;
    fields: {
      name: string;
      email: string;
      intent: string;
      method: string;
      detail: string;
      language: string;
      ip: string;
      userAgent: string;
      score: string;
    };
  }
> = {
  pt: {
    title: 'Nova mensagem recebida',
    fields: {
      name: 'Nome',
      email: 'Email',
      intent: 'Motivo',
      method: 'Canal preferido',
      detail: 'Detalhe preferencial',
      language: 'Idioma (UI)',
      ip: 'IP',
      userAgent: 'User-Agent',
      score: 'Score Turnstile',
    },
  },
  en: {
    title: 'New message received',
    fields: {
      name: 'Name',
      email: 'Email',
      intent: 'Topic',
      method: 'Preferred channel',
      detail: 'Preferred detail',
      language: 'Language (UI)',
      ip: 'IP',
      userAgent: 'User-Agent',
      score: 'Turnstile score',
    },
  },
};

const OWNER_COPY: Record<
  LocaleCode,
  {
    heading: string;
    subjectPrefix: string;
    labels: {
      name: string;
      email: string;
      intent: string;
      preference: string;
      language: string;
      ip: string;
      userAgent: string;
    };
  }
> = {
  pt: {
    heading: 'Contato recebido',
    subjectPrefix: 'Novo contato',
    labels: {
      name: 'Nome',
      email: 'Email',
      intent: 'Motivo',
      preference: 'Preferência',
      language: 'Idioma (interface)',
      ip: 'IP',
      userAgent: 'User-Agent',
    },
  },
  en: {
    heading: 'New inquiry',
    subjectPrefix: 'New inquiry',
    labels: {
      name: 'Name',
      email: 'Email',
      intent: 'Topic',
      preference: 'Preference',
      language: 'Interface language',
      ip: 'IP',
      userAgent: 'User-Agent',
    },
  },
};

type EmailTemplateParams = {
  name: string;
  intent: string;
  method: string;
  detail: string;
  languageLabel: string;
  safeMessageHtml: string;
  plainMessage: string;
};

const EMAIL_TEMPLATES: Record<
  LocaleCode,
  {
    successMessage: string;
    confirmationSubject: string;
    confirmationHtml: (params: EmailTemplateParams) => string;
    confirmationText: (params: EmailTemplateParams) => string;
  }
> = {
  pt: {
    successMessage:
      'Recebi sua mensagem e vou retornar pelo canal indicado. Obrigado pela confiança!',
    confirmationSubject: 'Recebi sua mensagem ✅',
    confirmationHtml: ({ name, intent, method, detail, languageLabel, safeMessageHtml }) => `
      <p>Olá ${escapeHTML(name)},</p>
      <p>Recebi sua mensagem sobre <strong>${escapeHTML(intent)}</strong> e vou responder o quanto antes.</p>
      <p>Seu método de contato preferencial é <strong>${escapeHTML(method)}</strong> em <strong>${escapeHTML(detail)}</strong>.</p>
      <p>Você estava usando a interface em <strong>${escapeHTML(languageLabel)}</strong>.</p>
      <p>Resumo do que você enviou:</p>
      <blockquote style="border-left:4px solid #6366f1;padding-left:12px;color:#475569;">
        ${safeMessageHtml}
      </blockquote>
      <p>Caso precise complementar algo, basta responder este email. 📬</p>
      <p>— Lucas</p>
    `,
    confirmationText: ({
      name,
      intent,
      method,
      detail,
      languageLabel,
      plainMessage,
    }) => `Olá ${name},

Recebi sua mensagem sobre ${intent} e vou responder o quanto antes.

Seu método de contato preferencial é ${method} em ${detail}.
Você estava usando a interface em ${languageLabel}.

Resumo do que você enviou:
${plainMessage}

Caso precise complementar algo, basta responder este email.

— Lucas`,
  },
  en: {
    successMessage: "Thanks for reaching out! I'll follow up via your preferred channel shortly.",
    confirmationSubject: 'Got your message ✅',
    confirmationHtml: ({ name, intent, method, detail, languageLabel, safeMessageHtml }) => `
      <p>Hi ${escapeHTML(name)},</p>
      <p>Thanks for reaching out about <strong>${escapeHTML(intent)}</strong>. I'll reply as soon as possible.</p>
      <p>Your preferred channel is <strong>${escapeHTML(method)}</strong> at <strong>${escapeHTML(detail)}</strong>.</p>
      <p>You were using the <strong>${escapeHTML(languageLabel)}</strong> interface.</p>
      <p>Here’s a quick summary:</p>
      <blockquote style="border-left:4px solid #6366f1;padding-left:12px;color:#475569;">
        ${safeMessageHtml}
      </blockquote>
      <p>If you need to add anything else, just reply to this email. 📬</p>
      <p>— Lucas</p>
    `,
    confirmationText: ({
      name,
      intent,
      method,
      detail,
      languageLabel,
      plainMessage,
    }) => `Hi ${name},

Thanks for reaching out about ${intent}. I'll get back to you shortly.

Your preferred channel is ${method} at ${detail}.
You were using the ${languageLabel} interface.

Here’s what you sent:
${plainMessage}

If you need to add anything else, just reply to this email.

— Lucas`,
  },
};

async function verifyTurnstile(token: string, remoteIp: string | null) {
  if (!TURNSTILE_SECRET_KEY) {
    logger.error('TURNSTILE_SECRET_KEY não configurada.');
    return { success: false };
  }

  const params = new URLSearchParams();
  params.append('secret', TURNSTILE_SECRET_KEY);
  params.append('response', token);
  if (remoteIp) {
    params.append('remoteip', remoteIp);
  }

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: params,
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      cache: 'no-store',
    });

    if (!res.ok) {
      logger.error('Falha ao verificar Turnstile', res.statusText);
      return { success: false };
    }

    return (await res.json()) as { success: boolean; score?: number; errorCodes?: string[] };
  } catch (error) {
    logger.error('Erro ao verificar Turnstile', error);
    return { success: false };
  }
}

function getClientIp(headerList: Headers): string | null {
  const direct = headerList.get('x-real-ip') ?? headerList.get('x-client-ip');
  if (direct) return direct;

  const forwardedFor = headerList.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() ?? null;
  }

  const cfIp = headerList.get('cf-connecting-ip');
  if (cfIp) return cfIp;

  return null;
}

function ensureResendConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.SMTP_FROM;
  const to = process.env.SMTP_TO;

  if (!apiKey || !from || !to) {
    if (IS_DEV) {
      logger.info(
        'Resend configuration incompleta em ambiente de desenvolvimento. Emails serão ignorados.'
      );
      return null;
    }

    throw new Error(
      'Resend configuration is incomplete. Please set RESEND_API_KEY, SMTP_FROM and SMTP_TO.'
    );
  }

  return {
    apiKey,
    from,
    to,
  };
}

export async function submitContact(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const raw = Object.fromEntries(formData.entries());
  const rawLanguage = typeof raw.language === 'string' ? raw.language : undefined;
  const normalizedLanguageForMessages = normalizeToLocale(rawLanguage);

  const invalidMessage =
    normalizedLanguageForMessages === 'en'
      ? 'Please fix the highlighted fields.'
      : 'Por favor, corrija os campos destacados.';
  const rateLimitMessage =
    normalizedLanguageForMessages === 'en'
      ? 'Too many attempts in a row. Please wait a moment and try again.'
      : 'Muitas tentativas seguidas. Aguarde alguns minutos e tente novamente.';
  const genericErrorMessage =
    normalizedLanguageForMessages === 'en'
      ? 'We could not send your message right now. Please try again later.'
      : 'Não foi possível enviar sua mensagem agora. Tente novamente mais tarde.';
  const turnstileValidationMessage =
    normalizedLanguageForMessages === 'en'
      ? 'We could not validate your request. Refresh the page and try again.'
      : 'Não foi possível validar sua solicitação. Recarregue a página e tente novamente.';

  const parsed = ContactSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      status: 'invalid',
      message: invalidMessage,
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;
  const normalizedLanguage = normalizeToLocale(data.language);
  const emailTemplate = EMAIL_TEMPLATES[normalizedLanguage];
  const successMessage = emailTemplate.successMessage;
  const preferredLanguageLabel = describeLanguage(data.language);
  const intentLabel = INTENT_LABELS[normalizedLanguage][data.intent];
  const methodLabel = METHOD_LABELS[normalizedLanguage][data.preferredMethod];

  if (data.honeypot && data.honeypot.trim().length > 0) {
    return {
      status: 'success',
      message: successMessage,
    };
  }

  const headerList = (await headers()) as Headers;
  const ipAddress = getClientIp(headerList) ?? 'unknown';
  const userAgent = headerList.get('user-agent') ?? 'N/A';

  try {
    rateLimit(`ip:${ipAddress}`, 5, 60_000);
    rateLimit(`ip-daily:${ipAddress}`, 20, 86_400_000);
    rateLimit(`mail:${data.email}`, 5, 86_400_000);
    rateLimit(`pref:${data.preferredValue}`, 5, 86_400_000);
  } catch (error) {
    if ((error as Error).name === 'RateLimitError') {
      logger.info('Rate limit triggered for contact form', {
        ipAddress,
        email: data.email,
        preferred: data.preferredValue,
      });
      return {
        status: 'rate_limited',
        message: rateLimitMessage,
      };
    }

    logger.error('Erro no rate limit', error);
    return {
      status: 'error',
      message: genericErrorMessage,
    };
  }

  let turnstileScore: number | null = null;

  if (data.turnstileToken && data.turnstileToken !== 'dev-bypass') {
    const turnstileResult = await verifyTurnstile(data.turnstileToken, ipAddress);

    if (!turnstileResult.success) {
      logger.info('Turnstile falhou para contato', {
        ipAddress,
        email: data.email,
        score: turnstileResult.score,
        errorCodes: turnstileResult.errorCodes,
      });
      if (!IS_DEV) {
        return {
          status: 'error',
          message: turnstileValidationMessage,
        };
      }
    }

    turnstileScore = turnstileResult.score ?? null;
  } else if (!IS_DEV) {
    if (!data.turnstileToken) {
      return {
        status: 'error',
        message: turnstileValidationMessage,
      };
    }
  }

  const discordCopy = DISCORD_LABELS[normalizedLanguage];
  const safePreferredValue = escapeHTML(data.preferredValue);

  if (DISCORD_WEBHOOK_URL) {
    try {
      const truncatedMessage = data.message.slice(0, 1800);
      await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          username: 'Novo contato via site',
          embeds: [
            {
              title: `${discordCopy.title} (${intentLabel}) — ${data.name}`,
              description: truncatedMessage,
              color: 5814783,
              fields: [
                { name: discordCopy.fields.name, value: data.name, inline: true },
                { name: discordCopy.fields.email, value: data.email, inline: true },
                { name: discordCopy.fields.intent, value: intentLabel, inline: true },
                { name: discordCopy.fields.method, value: methodLabel, inline: true },
                { name: discordCopy.fields.detail, value: data.preferredValue, inline: true },
                { name: discordCopy.fields.language, value: preferredLanguageLabel, inline: true },
                { name: discordCopy.fields.ip, value: ipAddress, inline: true },
                { name: discordCopy.fields.userAgent, value: userAgent, inline: false },
                {
                  name: discordCopy.fields.score,
                  value: String(turnstileScore ?? 'N/A'),
                  inline: true,
                },
              ],
              timestamp: new Date().toISOString(),
            },
          ],
        }),
      });
    } catch (error) {
      logger.error('Falha ao enviar webhook para Discord', error);
    }
  } else {
    logger.error('DISCORD_WEBHOOK_URL não configurada. Pulei envio do webhook.');
  }

  const resendConfig = ensureResendConfig();
  const ownerCopy = OWNER_COPY[normalizedLanguage];
  const contactPreferenceText = `${methodLabel} • ${data.preferredValue}`;
  const firstName = data.name.split(' ')[0] ?? data.name;

  const subject = `${ownerCopy.subjectPrefix} (${intentLabel}) — ${data.name}`;
  const confirmationSubject = emailTemplate.confirmationSubject;

  if (resendConfig) {
    const resend = new Resend(resendConfig.apiKey);

    try {
      const ownerEmailHtml = await render(
        OwnerEmail({
          name: data.name,
          email: data.email,
          intent: intentLabel,
          preference: contactPreferenceText,
          languageLabel: preferredLanguageLabel,
          ip: ipAddress,
          userAgent: userAgent,
          message: data.message,
          locale: normalizedLanguage,
        })
      );

      const confirmationEmailHtml = await render(
        ConfirmationEmail({
          firstName,
          intent: intentLabel,
          method: methodLabel,
          detail: data.preferredValue,
          languageLabel: preferredLanguageLabel,
          message: data.message,
          locale: normalizedLanguage,
        })
      );

      const confirmationEmailText = emailTemplate.confirmationText({
        name: firstName,
        intent: intentLabel,
        method: methodLabel,
        detail: data.preferredValue,
        languageLabel: preferredLanguageLabel,
        safeMessageHtml: escapeHTML(data.message).replace(/\n/g, '<br />'),
        plainMessage: data.message,
      });

      const ownerEmailText = `${ownerCopy.heading}\n\n${ownerCopy.labels.name}: ${data.name}\n${ownerCopy.labels.email}: ${data.email}\n${ownerCopy.labels.intent}: ${intentLabel}\n${ownerCopy.labels.preference}: ${contactPreferenceText}\n${ownerCopy.labels.language}: ${preferredLanguageLabel}\n${ownerCopy.labels.ip}: ${ipAddress}\n\n${data.message}`;

      const [ownerResult, confirmationResult] = await Promise.all([
        resend.emails.send({
          from: resendConfig.from,
          to: resendConfig.to,
          replyTo: data.email,
          subject,
          html: ownerEmailHtml,
          text: ownerEmailText,
          headers: {
            'X-Contact-IP': ipAddress,
            ...(turnstileScore !== null ? { 'X-Turnstile-Score': String(turnstileScore) } : {}),
          },
        }),
        resend.emails.send({
          from: resendConfig.from,
          to: data.email,
          subject: confirmationSubject,
          html: confirmationEmailHtml,
          text: confirmationEmailText,
        }),
      ]);

      if (ownerResult.error) {
        logger.error('Erro ao enviar email para o proprietário', ownerResult.error);
        throw ownerResult.error;
      }

      if (confirmationResult.error) {
        logger.error('Erro ao enviar email de confirmação', confirmationResult.error);
        throw confirmationResult.error;
      }

      logger.info('Emails enviados com sucesso via Resend', {
        ownerEmailId: ownerResult.data?.id,
        confirmationEmailId: confirmationResult.data?.id,
      });
    } catch (error) {
      logger.error('Erro ao enviar email de contato', error);
      return {
        status: 'error',
        message:
          normalizedLanguage === 'en'
            ? "I received your message but couldn't send the confirmation email right now. I'll look into it as soon as possible."
            : 'Sua mensagem foi recebida, mas não consegui enviar a confirmação agora. Vou verificar o quanto antes.',
      };
    }
  } else {
    logger.info('Ignorando envio de emails (Resend não configurado).');
  }

  return {
    status: 'success',
    message: successMessage,
  };
}

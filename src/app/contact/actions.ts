'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import { logger } from '@/lib/logger';
import { localeNames, locales, defaultLocale } from '@/lib/i18n/config';

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

function ensureMailEnv() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ?? '587';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.SMTP_FROM;
  const to = process.env.SMTP_TO;

  if (!host || !user || !pass || !from || !to) {
    if (IS_DEV) {
      logger.info(
        'SMTP configuration incompleta em ambiente de desenvolvimento. Emails serão ignorados.'
      );
      return null;
    }

    throw new Error(
      'SMTP configuration is incomplete. Please set SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_FROM and SMTP_TO.'
    );
  }

  return {
    host,
    port: Number(port),
    user,
    pass,
    from,
    to,
    secure: process.env.SMTP_SECURE === 'true' || Number(port) === 465,
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

  if (!IS_DEV) {
    if (!data.turnstileToken) {
      return {
        status: 'error',
        message: turnstileValidationMessage,
      };
    }

    const turnstileResult = await verifyTurnstile(data.turnstileToken, ipAddress);

    if (
      !turnstileResult.success ||
      (typeof turnstileResult.score === 'number' && turnstileResult.score < 0.5)
    ) {
      logger.info('Turnstile falhou para contato', {
        ipAddress,
        email: data.email,
        score: turnstileResult.score,
        errorCodes: turnstileResult.errorCodes,
      });
      return {
        status: 'error',
        message: turnstileValidationMessage,
      };
    }

    turnstileScore = turnstileResult.score ?? null;
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

  const mailEnv = ensureMailEnv();
  const ownerCopy = OWNER_COPY[normalizedLanguage];
  const safeName = escapeHTML(data.name);
  const safeEmail = escapeHTML(data.email);
  const safeIntentLabel = escapeHTML(intentLabel);
  const safeMethodLabel = escapeHTML(methodLabel);
  const safePreferredLanguage = escapeHTML(preferredLanguageLabel);
  const safeMessageHtml = escapeHTML(data.message).replace(/\n/g, '<br />');
  const contactPreferenceHtml = `${safeMethodLabel} • ${safePreferredValue}`;
  const contactPreferenceText = `${methodLabel} • ${data.preferredValue}`;
  const firstName = data.name.split(' ')[0] ?? data.name;

  const ownerHtml = `
    <h2>${ownerCopy.heading}</h2>
    <p><strong>${ownerCopy.labels.name}:</strong> ${safeName}</p>
    <p><strong>${ownerCopy.labels.email}:</strong> ${safeEmail}</p>
    <p><strong>${ownerCopy.labels.intent}:</strong> ${safeIntentLabel}</p>
    <p><strong>${ownerCopy.labels.preference}:</strong> ${contactPreferenceHtml}</p>
    <p><strong>${ownerCopy.labels.language}:</strong> ${safePreferredLanguage}</p>
    <p><strong>${ownerCopy.labels.ip}:</strong> ${escapeHTML(ipAddress)}</p>
    <p><strong>${ownerCopy.labels.userAgent}:</strong> ${escapeHTML(userAgent)}</p>
    <hr />
    <pre style="white-space:pre-wrap;font-family:'Inter','Segoe UI',sans-serif;">${safeMessageHtml}</pre>
  `;

  const ownerText = `${ownerCopy.heading}\n\n${ownerCopy.labels.name}: ${data.name}\n${ownerCopy.labels.email}: ${data.email}\n${ownerCopy.labels.intent}: ${intentLabel}\n${ownerCopy.labels.preference}: ${contactPreferenceText}\n${ownerCopy.labels.language}: ${preferredLanguageLabel}\n${ownerCopy.labels.ip}: ${ipAddress}\n\n${data.message}`;

  const emailParams: EmailTemplateParams = {
    name: firstName,
    intent: intentLabel,
    method: methodLabel,
    detail: data.preferredValue,
    languageLabel: preferredLanguageLabel,
    safeMessageHtml,
    plainMessage: data.message,
  };

  const confirmationSubject = emailTemplate.confirmationSubject;
  const confirmationHtml = emailTemplate.confirmationHtml(emailParams);
  const confirmationText = emailTemplate.confirmationText(emailParams);

  const subject = `${ownerCopy.subjectPrefix} (${intentLabel}) — ${data.name}`;

  if (mailEnv) {
    const transporter = nodemailer.createTransport({
      host: mailEnv.host,
      port: mailEnv.port,
      secure: mailEnv.secure,
      auth: {
        user: mailEnv.user,
        pass: mailEnv.pass,
      },
    });

    try {
      await Promise.all([
        transporter.sendMail({
          from: `Contato <${mailEnv.from}>`,
          to: mailEnv.to,
          replyTo: data.email,
          subject,
          html: ownerHtml,
          text: ownerText,
          headers: {
            'X-Contact-IP': ipAddress,
            ...(turnstileScore !== null ? { 'X-Turnstile-Score': String(turnstileScore) } : {}),
          },
        }),
        transporter.sendMail({
          from: `Lucas Hdo <${mailEnv.from}>`,
          to: data.email,
          subject: confirmationSubject,
          html: confirmationHtml,
          text: confirmationText,
        }),
      ]);
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
    logger.info('Ignorando envio de emails (SMTP não configurado).');
  }

  return {
    status: 'success',
    message: successMessage,
  };
}

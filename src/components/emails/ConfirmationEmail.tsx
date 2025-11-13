import * as React from 'react';

interface ConfirmationEmailProps {
  firstName: string;
  intent: string;
  method: string;
  detail: string;
  languageLabel: string;
  message: string;
  locale: 'pt' | 'en';
}

export function ConfirmationEmail({
  firstName,
  intent,
  method,
  detail,
  languageLabel,
  message,
  locale,
}: ConfirmationEmailProps) {
  const isPt = locale === 'pt';

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', lineHeight: '1.6', color: '#1e293b' }}>
      <p>{isPt ? `Olá ${firstName},` : `Hi ${firstName},`}</p>
      <p>
        {isPt
          ? `Recebi sua mensagem sobre ${intent} e vou responder o quanto antes.`
          : `Thanks for reaching out about ${intent}. I'll reply as soon as possible.`}
      </p>
      <p>
        {isPt
          ? `Seu método de contato preferencial é ${method} em ${detail}.`
          : `Your preferred channel is ${method} at ${detail}.`}
      </p>
      <p>
        {isPt
          ? `Você estava usando a interface em ${languageLabel}.`
          : `You were using the ${languageLabel} interface.`}
      </p>
      <p>{isPt ? 'Resumo do que você enviou:' : "Here's a quick summary:"}</p>
      <blockquote
        style={{
          borderLeft: '4px solid #6366f1',
          paddingLeft: '12px',
          color: '#475569',
          margin: '16px 0',
        }}
      >
        <div style={{ whiteSpace: 'pre-wrap' }}>{message}</div>
      </blockquote>
      <p>{isPt ? 'Caso precise complementar algo, basta responder este email. 📬' : 'If you need to add anything else, just reply to this email. 📬'}</p>
      <p>— Lucas</p>
    </div>
  );
}


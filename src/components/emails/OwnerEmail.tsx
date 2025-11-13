import * as React from 'react';

interface OwnerEmailProps {
  name: string;
  email: string;
  intent: string;
  preference: string;
  languageLabel: string;
  ip: string;
  userAgent: string;
  message: string;
  locale: 'pt' | 'en';
}

export function OwnerEmail({
  name,
  email,
  intent,
  preference,
  languageLabel,
  ip,
  userAgent,
  message,
  locale,
}: OwnerEmailProps) {
  const isPt = locale === 'pt';

  const labels = {
    heading: isPt ? 'Contato recebido' : 'New inquiry',
    name: isPt ? 'Nome' : 'Name',
    email: isPt ? 'Email' : 'Email',
    intent: isPt ? 'Motivo' : 'Topic',
    preference: isPt ? 'Preferência' : 'Preference',
    language: isPt ? 'Idioma (interface)' : 'Interface language',
    ip: isPt ? 'IP' : 'IP',
    userAgent: isPt ? 'User-Agent' : 'User-Agent',
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', lineHeight: '1.6', color: '#1e293b' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>{labels.heading}</h2>
      <p>
        <strong>{labels.name}:</strong> {name}
      </p>
      <p>
        <strong>{labels.email}:</strong> {email}
      </p>
      <p>
        <strong>{labels.intent}:</strong> {intent}
      </p>
      <p>
        <strong>{labels.preference}:</strong> {preference}
      </p>
      <p>
        <strong>{labels.language}:</strong> {languageLabel}
      </p>
      <p>
        <strong>{labels.ip}:</strong> {ip}
      </p>
      <p>
        <strong>{labels.userAgent}:</strong> {userAgent}
      </p>
      <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '24px 0' }} />
      <pre
        style={{
          whiteSpace: 'pre-wrap',
          fontFamily: "'Inter', 'Segoe UI', sans-serif",
          fontSize: '14px',
          lineHeight: '1.6',
        }}
      >
        {message}
      </pre>
    </div>
  );
}


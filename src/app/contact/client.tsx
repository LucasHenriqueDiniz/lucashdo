'use client';

import { memo, useActionState, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguageStore } from '@/store/languageStore';
import { submitContact } from './actions';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
          theme?: 'light' | 'dark' | 'auto';
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove?: (widgetId: string) => void;
    };
  }
}

type ContactIntentValue = 'hire' | 'project' | 'consult' | 'partner' | 'press';
type ContactMethodValue = 'email' | 'telefone' | 'discord' | 'linkedin' | 'outro';

type ContactFormValues = {
  name: string;
  email: string;
  intent: ContactIntentValue;
  message: string;
  preferredMethod: ContactMethodValue;
  preferredValue: string;
};

type ContactFormState = {
  status: 'idle' | 'success' | 'invalid' | 'rate_limited' | 'error';
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

const INTENT_VALUES: ContactIntentValue[] = ['hire', 'project', 'consult', 'partner', 'press'];
const METHOD_VALUES: ContactMethodValue[] = ['email', 'telefone', 'discord', 'linkedin', 'outro'];

const initialValues: ContactFormValues = {
  name: '',
  email: '',
  intent: 'project',
  message: '',
  preferredMethod: 'email',
  preferredValue: '',
};

const initialFormState: ContactFormState = {
  status: 'idle',
};

const ContactForm = memo(() => {
  const language = useLanguageStore(state => state.lang);
  const t = useTranslations('Contact');

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '';
  const isTurnstileEnabled = process.env.NODE_ENV === 'production' && Boolean(turnstileSiteKey);

  const intentOptions = useMemo(
    () => INTENT_VALUES.map(value => ({ value, label: t(`form.intentOptions.${value}`) })),
    [t]
  );

  const methodOptions = useMemo(
    () =>
      METHOD_VALUES.map(value => ({
        value,
        label: t(`form.methodOptions.${value}.label`),
        placeholder: t(`form.methodOptions.${value}.placeholder`),
        helper: t(`form.methodOptions.${value}.helper`),
      })),
    [t]
  );

  const [formValues, setFormValues] = useState(initialValues);
  const [honeypotValue, setHoneypotValue] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileReady, setTurnstileReady] = useState(false);
  const [clientMessage, setClientMessage] = useState<string | null>(null);

  const [state, formAction] = useActionState(submitContact, initialFormState);

  const formRef = useRef<HTMLFormElement | null>(null);
  const turnstileRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      setFormValues(prev => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleIntentChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormValues(prev => ({ ...prev, intent: event.target.value as ContactIntentValue }));
  }, []);

  const handleMethodChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormValues(prev => ({
      ...prev,
      preferredMethod: event.target.value as ContactMethodValue,
    }));
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      if (!isTurnstileEnabled) {
        setClientMessage(null);
        return;
      }

      if (!turnstileToken) {
        event.preventDefault();
        setClientMessage(t('form.messages.turnstileRequired'));
      } else {
        setClientMessage(null);
      }
    },
    [isTurnstileEnabled, turnstileToken, t]
  );

  useEffect(() => {
    if (!isTurnstileEnabled) return;
    if (window.turnstile) {
      setTurnstileReady(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = () => setTurnstileReady(true);
    script.onerror = () => setClientMessage(t('form.messages.turnstileUnavailable'));
    document.head.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [isTurnstileEnabled, t]);

  useEffect(() => {
    if (!isTurnstileEnabled || !turnstileReady || !turnstileRef.current || !window.turnstile)
      return;

    if (widgetIdRef.current) {
      window.turnstile.reset(widgetIdRef.current);
      return;
    }

    widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
      sitekey: turnstileSiteKey,
      theme: 'auto',
      callback: (token: string) => {
        setTurnstileToken(token);
        setClientMessage(null);
      },
      'expired-callback': () => {
        setTurnstileToken(null);
        setClientMessage(t('form.messages.turnstileExpired'));
      },
      'error-callback': () => {
        setTurnstileToken(null);
        setClientMessage(t('form.messages.turnstileError'));
      },
    });
  }, [isTurnstileEnabled, turnstileReady, turnstileSiteKey, t]);

  useEffect(() => {
    if (state.status === 'success') {
      setFormValues(initialValues);
      setHoneypotValue('');
      setTurnstileToken(null);
      setClientMessage(null);
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
      formRef.current?.reset();
    }
  }, [state.status]);

  const fieldErrors = state.fieldErrors ?? {};
  const fallbackMessage = !isTurnstileEnabled ? t('form.messages.turnstileDisabled') : null;
  const combinedMessage = clientMessage ?? state.message ?? fallbackMessage;
  const showSuccess =
    state.status === 'success' && state.message !== undefined && clientMessage === null;
  const showFeedback = Boolean(combinedMessage);

  const selectedMethod =
    methodOptions.find(option => option.value === formValues.preferredMethod) ?? methodOptions[0];

  function SubmitButton() {
    const { pending } = useFormStatus();
    const isDisabled = pending || (isTurnstileEnabled && !turnstileToken);

    return (
      <Button
        type="submit"
        disabled={isDisabled}
        className={cn(
          'group relative inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-3.5 text-base font-medium text-white shadow-lg shadow-indigo-500/30 transition-all hover:from-indigo-600 hover:to-indigo-700 hover:shadow-xl hover:shadow-indigo-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60 disabled:opacity-50 disabled:cursor-not-allowed',
          pending && 'opacity-70'
        )}
      >
        {pending ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/80 border-t-transparent" />
            {t('form.button.pending')}
          </>
        ) : showSuccess ? (
          <>
            <CheckCircle className="h-5 w-5" />
            {t('form.button.success')}
          </>
        ) : (
          <>
            {t('form.button.default')}
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </Button>
    );
  }

  if (showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="mx-auto w-full max-w-2xl"
      >
        <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-slate-900/80 to-slate-900/80 p-12 shadow-2xl shadow-emerald-500/20 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20"
            >
              <CheckCircle className="h-12 w-12 text-emerald-400" />
            </motion.div>
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-white">{t('form.success.title')}</h2>
              <p className="text-lg text-slate-300">{t('form.success.message')}</p>
              <p className="text-sm text-emerald-400/80">{t('form.success.subtitle')}</p>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-4"
            >
              <Mail className="h-8 w-8 text-emerald-400/50" />
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto w-full max-w-2xl"
    >
      <div className="rounded-3xl border border-slate-800/50 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-900/80 p-8 shadow-2xl shadow-slate-900/50 backdrop-blur-sm">
        <div className="space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-semibold text-white">{t('form.title')}</h2>
            <p className="text-sm text-slate-400">{t('form.subtitle')}</p>
          </div>

          <form ref={formRef} action={formAction} onSubmit={handleSubmit} className="space-y-5">
            <input
              type="hidden"
              name="turnstileToken"
              value={isTurnstileEnabled ? (turnstileToken ?? '') : 'dev-bypass'}
            />
            <input type="hidden" name="language" value={language} />

            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="contact-website" className="hidden">
                Website
              </label>
              <input
                id="contact-website"
                tabIndex={-1}
                autoComplete="off"
                name="honeypot"
                value={honeypotValue}
                onChange={event => setHoneypotValue(event.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-slate-200">
                  {t('form.fields.name.label')}
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder={t('form.fields.name.placeholder')}
                  value={formValues.name}
                  onChange={handleInputChange}
                  required
                  autoComplete="name"
                  aria-invalid={Boolean(fieldErrors.name?.length)}
                  className="h-12 rounded-xl border-slate-700/50 bg-slate-800/40 text-white placeholder:text-slate-500 transition-all focus:border-indigo-500/50 focus:bg-slate-800/60"
                />
                {fieldErrors.name?.length ? (
                  <p className="text-xs text-red-400">{fieldErrors.name[0]}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-200">
                  {t('form.fields.email.label')}
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={t('form.fields.email.placeholder')}
                  value={formValues.email}
                  onChange={handleInputChange}
                  required
                  autoComplete="email"
                  aria-invalid={Boolean(fieldErrors.email?.length)}
                  className="h-12 rounded-xl border-slate-700/50 bg-slate-800/40 text-white placeholder:text-slate-500 transition-all focus:border-indigo-500/50 focus:bg-slate-800/60"
                />
                {fieldErrors.email?.length ? (
                  <p className="text-xs text-red-400">{fieldErrors.email[0]}</p>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="intent" className="text-sm font-medium text-slate-200">
                {t('form.fields.intent.label')}
              </label>
              <select
                id="intent"
                name="intent"
                value={formValues.intent}
                onChange={handleIntentChange}
                aria-invalid={Boolean(fieldErrors.intent?.length)}
                className="h-12 w-full rounded-xl border border-slate-700/50 bg-slate-800/40 px-4 text-white transition-all focus:border-indigo-500/50 focus:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                {intentOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-slate-900">
                    {option.label}
                  </option>
                ))}
              </select>
              {fieldErrors.intent?.length ? (
                <p className="text-xs text-red-400">{fieldErrors.intent[0]}</p>
              ) : null}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="preferredMethod" className="text-sm font-medium text-slate-200">
                  {t('form.fields.preferredMethod.label')}
                </label>
                <select
                  id="preferredMethod"
                  name="preferredMethod"
                  value={formValues.preferredMethod}
                  onChange={handleMethodChange}
                  aria-invalid={Boolean(fieldErrors.preferredMethod?.length)}
                  className="h-12 w-full rounded-xl border border-slate-700/50 bg-slate-800/40 px-4 text-white transition-all focus:border-indigo-500/50 focus:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {methodOptions.map(option => (
                    <option key={option.value} value={option.value} className="bg-slate-900">
                      {option.label}
                    </option>
                  ))}
                </select>
                {fieldErrors.preferredMethod?.length ? (
                  <p className="text-xs text-red-400">{fieldErrors.preferredMethod[0]}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label htmlFor="preferredValue" className="text-sm font-medium text-slate-200">
                  {t('form.fields.preferredValue.label')}
                </label>
                <Input
                  id="preferredValue"
                  name="preferredValue"
                  placeholder={selectedMethod?.placeholder ?? ''}
                  value={formValues.preferredValue}
                  onChange={handleInputChange}
                  required
                  aria-invalid={Boolean(fieldErrors.preferredValue?.length)}
                  className="h-12 rounded-xl border-slate-700/50 bg-slate-800/40 text-white placeholder:text-slate-500 transition-all focus:border-indigo-500/50 focus:bg-slate-800/60"
                />
                {selectedMethod?.helper ? (
                  <p className="text-xs text-slate-500">{selectedMethod.helper}</p>
                ) : null}
                {fieldErrors.preferredValue?.length ? (
                  <p className="text-xs text-red-400">{fieldErrors.preferredValue[0]}</p>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-slate-200">
                {t('form.fields.message.label')}
              </label>
              <Textarea
                id="message"
                name="message"
                placeholder={t('form.fields.message.placeholder')}
                value={formValues.message}
                onChange={handleInputChange}
                required
                maxLength={4000}
                aria-invalid={Boolean(fieldErrors.message?.length)}
                className="min-h-[140px] rounded-xl border-slate-700/50 bg-slate-800/40 text-white placeholder:text-slate-500 transition-all focus:border-indigo-500/50 focus:bg-slate-800/60"
              />
              {fieldErrors.message?.length ? (
                <p className="text-xs text-red-400">{fieldErrors.message[0]}</p>
              ) : null}
            </div>

            {showFeedback && !showSuccess ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-amber-500/50 bg-amber-500/10 px-4 py-3 text-sm text-amber-300"
              >
                {combinedMessage}
              </motion.div>
            ) : null}

            <div className="space-y-4 pt-2">
              {isTurnstileEnabled ? (
                <div ref={turnstileRef} className="flex justify-center" />
              ) : null}
              <SubmitButton />
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
});

ContactForm.displayName = 'ContactForm';

export default function ContactClient() {
  const t = useTranslations('Contact');

  const highlights = useMemo(
    () => [t('hero.highlights.item1'), t('hero.highlights.item2'), t('hero.highlights.item3')],
    [t]
  );

  const contactEmail = t('hero.callout.email');

  return (
    <div className="relative min-h-screen bg-slate-950 px-6 pb-24 pt-[calc(var(--navbar-height,4rem)+2rem)] sm:px-10">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.15),_transparent_65%)]" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-12 lg:flex-row lg:items-start lg:gap-20">
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8 text-slate-300 lg:max-w-md lg:sticky lg:top-24"
        >
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.32em] text-indigo-400 font-medium">
              {t('hero.badge')}
            </p>
            <h1 className="text-4xl font-bold text-white leading-tight">{t('hero.title')}</h1>
            <p className="text-base text-slate-400 leading-relaxed">{t('hero.description')}</p>
          </div>

          <ul className="space-y-3 text-sm">
            {highlights.map((item, index) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
                className="flex items-start gap-3"
              >
                <span className="mt-1.5 h-2 w-2 rounded-full bg-indigo-400 flex-shrink-0" />
                <span className="text-slate-300">{item}</span>
              </motion.li>
            ))}
          </ul>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 p-5 backdrop-blur-sm"
          >
            <p className="text-xs uppercase tracking-[0.28em] text-indigo-300/80 font-medium mb-2">
              {t('hero.callout.title')}
            </p>
            <a
              href={`mailto:${contactEmail}`}
              className="inline-flex items-center gap-2 text-lg font-semibold text-white hover:text-indigo-200 transition-colors"
            >
              {contactEmail}
            </a>
            <p className="mt-2 text-xs text-indigo-200/70">{t('hero.callout.footnote')}</p>
          </motion.div>
        </motion.section>

        <div className="flex-1">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

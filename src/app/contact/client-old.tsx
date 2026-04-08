'use client';

import { memo, useActionState, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, Mail, Send, Sparkles } from 'lucide-react';
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
          'group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#0184FC] to-[#0867CB] px-6 py-3.5 text-base font-medium text-white shadow-lg shadow-[#0184FC]/30 transition-all hover:shadow-xl hover:shadow-[#0184FC]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0184FC]/60 disabled:opacity-50 disabled:cursor-not-allowed',
          pending && 'opacity-70'
        )}
      >
        {/* Animated shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        />
        
        <span className="relative z-10 flex items-center gap-2">
          {pending ? (
            <>
              <motion.div 
                className="h-4 w-4 rounded-full border-2 border-white/80 border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
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
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </span>
      </Button>
    );
  }

  if (showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto w-full max-w-2xl"
      >
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-slate-900/90 to-slate-900/90 p-12 shadow-2xl shadow-emerald-500/20 backdrop-blur-xl">
          {/* Animated background particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-1 w-1 rounded-full bg-emerald-400/30"
                initial={{ 
                  x: Math.random() * 100 + '%', 
                  y: Math.random() * 100 + '%',
                  scale: 0 
                }}
                animate={{ 
                  y: [null, '-100%'],
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>

          <div className="relative flex flex-col items-center justify-center space-y-6 text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
              className="relative flex h-24 w-24 items-center justify-center"
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-emerald-500/20"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400/30 to-emerald-600/30 backdrop-blur-sm">
                <CheckCircle className="h-12 w-12 text-emerald-400" />
              </div>
            </motion.div>
            
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-3xl font-bold text-white">{t('form.success.title')}</h2>
              <p className="text-lg text-slate-300">{t('form.success.message')}</p>
              <p className="text-sm text-emerald-400/80">{t('form.success.subtitle')}</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4 flex items-center gap-2 text-emerald-400/70"
            >
              <Mail className="h-6 w-6" />
              <Sparkles className="h-5 w-5" />
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
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto w-full max-w-2xl"
    >
      <div className="relative overflow-hidden rounded-3xl border border-[#0184FC]/20 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950/90 p-8 shadow-2xl shadow-[#0184FC]/10 backdrop-blur-xl">
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="h-full w-full"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(1, 132, 252, 0.3) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />
        </div>

        {/* Glow effect */}
        <motion.div
          className="absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-[#0184FC]/20 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        <div className="relative space-y-8">
          <motion.div 
            className="space-y-2 text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-center gap-2">
              <Send className="h-6 w-6 text-[#0184FC]" />
              <h2 className="text-2xl font-bold text-white">{t('form.title')}</h2>
            </div>
            <p className="text-sm text-slate-400">{t('form.subtitle')}</p>
          </motion.div>

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
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
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
                  className="h-12 rounded-xl border-slate-700/50 bg-slate-800/40 text-white placeholder:text-slate-500 transition-all focus:border-[#0184FC]/50 focus:bg-slate-800/60 focus:shadow-[0_0_20px_rgba(1,132,252,0.15)]"
                />
                <AnimatePresence>
                  {fieldErrors.name?.length ? (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-xs text-red-400"
                    >
                      {fieldErrors.name[0]}
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </motion.div>

              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
              >
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
                  className="h-12 rounded-xl border-slate-700/50 bg-slate-800/40 text-white placeholder:text-slate-500 transition-all focus:border-[#0184FC]/50 focus:bg-slate-800/60 focus:shadow-[0_0_20px_rgba(1,132,252,0.15)]"
                />
                <AnimatePresence>
                  {fieldErrors.email?.length ? (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-xs text-red-400"
                    >
                      {fieldErrors.email[0]}
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            </div>

            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label htmlFor="intent" className="text-sm font-medium text-slate-200">
                {t('form.fields.intent.label')}
              </label>
              <select
                id="intent"
                name="intent"
                value={formValues.intent}
                onChange={handleIntentChange}
                aria-invalid={Boolean(fieldErrors.intent?.length)}
                className="h-12 w-full rounded-xl border border-slate-700/50 bg-slate-800/40 px-4 text-white transition-all focus:border-[#0184FC]/50 focus:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-[#0184FC]/20 focus:shadow-[0_0_20px_rgba(1,132,252,0.15)]"
              >
                {intentOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-slate-900">
                    {option.label}
                  </option>
                ))}
              </select>
              <AnimatePresence>
                {fieldErrors.intent?.length ? (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-xs text-red-400"
                  >
                    {fieldErrors.intent[0]}
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </motion.div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
              >
                <label htmlFor="preferredMethod" className="text-sm font-medium text-slate-200">
                  {t('form.fields.preferredMethod.label')}
                </label>
                <select
                  id="preferredMethod"
                  name="preferredMethod"
                  value={formValues.preferredMethod}
                  onChange={handleMethodChange}
                  aria-invalid={Boolean(fieldErrors.preferredMethod?.length)}
                  className="h-12 w-full rounded-xl border border-slate-700/50 bg-slate-800/40 px-4 text-white transition-all focus:border-[#0184FC]/50 focus:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-[#0184FC]/20 focus:shadow-[0_0_20px_rgba(1,132,252,0.15)]"
                >
                  {methodOptions.map(option => (
                    <option key={option.value} value={option.value} className="bg-slate-900">
                      {option.label}
                    </option>
                  ))}
                </select>
                <AnimatePresence>
                  {fieldErrors.preferredMethod?.length ? (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-xs text-red-400"
                    >
                      {fieldErrors.preferredMethod[0]}
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </motion.div>

              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
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
                  className="h-12 rounded-xl border-slate-700/50 bg-slate-800/40 text-white placeholder:text-slate-500 transition-all focus:border-[#0184FC]/50 focus:bg-slate-800/60 focus:shadow-[0_0_20px_rgba(1,132,252,0.15)]"
                />
                {selectedMethod?.helper ? (
                  <p className="text-xs text-slate-500">{selectedMethod.helper}</p>
                ) : null}
                <AnimatePresence>
                  {fieldErrors.preferredValue?.length ? (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-xs text-red-400"
                    >
                      {fieldErrors.preferredValue[0]}
                    </motion.p>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            </div>

            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
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
                className="min-h-[140px] rounded-xl border-slate-700/50 bg-slate-800/40 text-white placeholder:text-slate-500 transition-all focus:border-[#0184FC]/50 focus:bg-slate-800/60 focus:shadow-[0_0_20px_rgba(1,132,252,0.15)]"
              />
              <AnimatePresence>
                {fieldErrors.message?.length ? (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-xs text-red-400"
                  >
                    {fieldErrors.message[0]}
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </motion.div>

            <AnimatePresence>
              {showFeedback && !showSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="rounded-xl border border-amber-500/50 bg-amber-500/10 px-4 py-3 text-sm text-amber-300"
                >
                  {combinedMessage}
                </motion.div>
              ) : null}
            </AnimatePresence>

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
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      
      {/* Radial gradient glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(1,132,252,0.15),_transparent_65%)]" />
      
      {/* Animated grid */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="h-full w-full"
          style={{
            backgroundImage: 'linear-gradient(rgba(1, 132, 252, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(1, 132, 252, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Floating orbs */}
      <motion.div
        className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-[#0184FC]/10 blur-3xl"
        animate={{ 
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl"
        animate={{ 
          x: [0, -50, 0],
          y: [0, -30, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-12 lg:flex-row lg:items-start lg:gap-20">
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8 text-slate-300 lg:max-w-md lg:sticky lg:top-24"
        >
          <div className="space-y-4">
            <motion.p 
              className="text-xs uppercase tracking-[0.32em] text-[#0184FC] font-medium"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {t('hero.badge')}
            </motion.p>
            <motion.h1 
              className="text-4xl font-bold text-white leading-tight"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {t('hero.title')}
            </motion.h1>
            <motion.p 
              className="text-base text-slate-400 leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {t('hero.description')}
            </motion.p>
          </div>

          <ul className="space-y-3 text-sm">
            {highlights.map((item, index) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + 0.1 * index, duration: 0.3 }}
                className="flex items-start gap-3"
              >
                <motion.span 
                  className="mt-1.5 h-2 w-2 rounded-full bg-[#0184FC] flex-shrink-0"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                />
                <span className="text-slate-300">{item}</span>
              </motion.li>
            ))}
          </ul>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="relative overflow-hidden rounded-2xl border border-[#0184FC]/20 bg-gradient-to-br from-[#0184FC]/10 to-[#0184FC]/5 p-5 backdrop-blur-sm"
          >
            {/* Animated border glow */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(1, 132, 252, 0.3), transparent)',
              }}
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
            />
            
            <div className="relative">
              <p className="text-xs uppercase tracking-[0.28em] text-[#0184FC]/80 font-medium mb-2">
                {t('hero.callout.title')}
              </p>
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-2 text-lg font-semibold text-white hover:text-[#0184FC] transition-colors"
              >
                {contactEmail}
              </a>
              <p className="mt-2 text-xs text-[#0184FC]/70">{t('hero.callout.footnote')}</p>
            </div>
          </motion.div>
        </motion.section>

        <div className="flex-1">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

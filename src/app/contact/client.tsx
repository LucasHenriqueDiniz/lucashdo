'use client';

import { memo, useActionState, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, Activity, ChevronDown, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguageStore } from '@/store/languageStore';
import DiscordCard from '@/components/DiscordCard/DiscordCard';
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
  const [isMethodDropdownOpen, setIsMethodDropdownOpen] = useState(false);

  const [state, formAction] = useActionState(submitContact, initialFormState);

  const formRef = useRef<HTMLFormElement | null>(null);
  const turnstileRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const methodDropdownRef = useRef<HTMLDivElement | null>(null);

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

  const handleMethodSelect = useCallback((value: ContactMethodValue) => {
    setFormValues(prev => ({
      ...prev,
      preferredMethod: value,
    }));
    setIsMethodDropdownOpen(false);
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (methodDropdownRef.current && !methodDropdownRef.current.contains(event.target as Node)) {
        setIsMethodDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          'group relative w-full h-14 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--cyan)] hover:from-[var(--primary)]/90 hover:to-[var(--cyan)]/90 text-white font-semibold text-base shadow-lg shadow-[var(--primary)]/25 hover:shadow-xl hover:shadow-[var(--primary)]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden',
          pending && 'opacity-70'
        )}
      >
        {/* Animated shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
          initial={{ x: '-100%' }}
          animate={{ x: pending ? '200%' : '-100%' }}
          transition={{ duration: 1.5, repeat: pending ? Infinity : 0, ease: "linear" }}
        />
        
        <span className="relative z-10 flex items-center justify-center gap-2.5">
          {pending ? (
            <>
              <motion.div 
                className="h-5 w-5 rounded-full border-2 border-white/80 border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
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
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-slate-900/90 to-slate-900/90 p-12 shadow-2xl backdrop-blur-xl">
          <div className="relative flex flex-col items-center justify-center space-y-6 text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
              className="relative flex h-24 w-24 items-center justify-center"
            >
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
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <form ref={formRef} action={formAction} onSubmit={handleSubmit} className="w-full space-y-6">
      <input
        type="hidden"
        name="turnstileToken"
        value={isTurnstileEnabled ? (turnstileToken ?? '') : 'dev-bypass'}
      />
      <input type="hidden" name="language" value={language} />

      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="contact-website" className="hidden">Website</label>
        <input
          id="contact-website"
          tabIndex={-1}
          autoComplete="off"
          name="honeypot"
          value={honeypotValue}
          onChange={event => setHoneypotValue(event.target.value)}
        />
      </div>

      {/* Name & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label htmlFor="name" className="text-sm font-medium text-slate-300">
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
            className="h-12 rounded-xl border-slate-700/50 bg-slate-800/40 text-white placeholder:text-slate-500 transition-all focus:border-[var(--primary)]/50 focus:bg-slate-800/60 focus:ring-2 focus:ring-[var(--primary)]/20"
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <label htmlFor="email" className="text-sm font-medium text-slate-300">
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
            className="h-12 rounded-xl border-slate-700/50 bg-slate-800/40 text-white placeholder:text-slate-500 transition-all focus:border-[var(--primary)]/50 focus:bg-slate-800/60 focus:ring-2 focus:ring-[var(--primary)]/20"
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

      {/* Intent */}
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <label htmlFor="intent" className="text-sm font-medium text-slate-300">
          {t('form.fields.intent.label')}
        </label>
        <div className="relative">
          <select
            id="intent"
            name="intent"
            value={formValues.intent}
            onChange={handleIntentChange}
            aria-invalid={Boolean(fieldErrors.intent?.length)}
            className="h-12 w-full rounded-xl border border-slate-700/50 bg-slate-800/40 px-4 pr-10 text-white appearance-none cursor-pointer transition-all hover:bg-slate-800/50 focus:border-[var(--primary)]/50 focus:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
          >
            {intentOptions.map(option => (
              <option key={option.value} value={option.value} className="bg-slate-900">
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
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

      {/* Preferred Method & Value */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <label htmlFor="preferredMethod" className="text-sm font-medium text-slate-300">
            {t('form.fields.preferredMethod.label')}
          </label>
          <div className="relative" ref={methodDropdownRef}>
            {/* Hidden select for form submission */}
            <select
              id="preferredMethod"
              name="preferredMethod"
              value={formValues.preferredMethod}
              onChange={handleMethodChange}
              aria-invalid={Boolean(fieldErrors.preferredMethod?.length)}
              className="sr-only"
              tabIndex={-1}
            >
              {methodOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* Custom dropdown button */}
            <button
              type="button"
              onClick={() => setIsMethodDropdownOpen(!isMethodDropdownOpen)}
              className="h-12 w-full rounded-xl border border-slate-700/50 bg-slate-800/40 px-4 pr-10 text-left text-white transition-all hover:bg-slate-800/50 focus:border-[var(--primary)]/50 focus:bg-slate-800/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            >
              {methodOptions.find(opt => opt.value === formValues.preferredMethod)?.label}
            </button>

            {/* Dropdown icon */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <motion.div
                animate={{ rotate: isMethodDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-5 h-5 text-slate-400" />
              </motion.div>
            </div>

            {/* Dropdown menu */}
            <AnimatePresence>
              {isMethodDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-50 mt-2 w-full rounded-xl border border-slate-700/50 bg-slate-900/95 backdrop-blur-xl shadow-2xl overflow-hidden"
                >
                  {methodOptions.map((option, index) => (
                    <motion.button
                      key={option.value}
                      type="button"
                      onClick={() => handleMethodSelect(option.value)}
                      className="w-full px-4 py-3 text-left text-sm text-slate-300 hover:bg-slate-800/60 transition-colors flex items-center justify-between group"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <span className="group-hover:text-white transition-colors">
                        {option.label}
                      </span>
                      {formValues.preferredMethod === option.value && (
                        <Check className="w-4 h-4 text-[var(--primary)]" />
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label htmlFor="preferredValue" className="text-sm font-medium text-slate-300">
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
            className="h-12 rounded-xl border-slate-700/50 bg-slate-800/40 text-white placeholder:text-slate-500 transition-all focus:border-[var(--primary)]/50 focus:bg-slate-800/60 focus:ring-2 focus:ring-[var(--primary)]/20"
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

      {/* Message */}
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <label htmlFor="message" className="text-sm font-medium text-slate-300">
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
          className="min-h-[140px] rounded-xl border-slate-700/50 bg-slate-800/40 text-white placeholder:text-slate-500 transition-all focus:border-[var(--primary)]/50 focus:bg-slate-800/60 focus:ring-2 focus:ring-[var(--primary)]/20 resize-none"
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
            className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3.5 text-sm text-amber-300 backdrop-blur-sm"
          >
            {combinedMessage}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div 
        className="space-y-4 pt-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {isTurnstileEnabled ? (
          <div ref={turnstileRef} className="flex justify-center" />
        ) : null}
        <SubmitButton />
      </motion.div>
    </form>
  );
});

ContactForm.displayName = 'ContactForm';

export default function ContactClient() {
  const t = useTranslations('Contact');

  return (
    <div className="relative min-h-screen bg-[var(--background)] px-4 pb-24 pt-[calc(var(--navbar-height,4rem)+5rem)] sm:px-6 lg:px-10">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-gradient-to-br from-[var(--primary)]/20 to-[var(--cyan)]/10 blur-3xl"
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-[var(--cyan)]/15 to-[var(--accent)]/10 blur-3xl"
          animate={{ 
            x: [0, -50, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div 
            className="h-full w-full"
            style={{
              backgroundImage: 'linear-gradient(rgba(1,132,252,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(1,132,252,0.5) 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10 lg:flex-row lg:gap-16">
        {/* Left Side - Info */}
        <motion.section
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="lg:w-[420px] lg:flex-shrink-0 space-y-8 lg:sticky lg:top-32"
        >
          {/* Header */}
          <div className="space-y-5">
            <motion.h1 
              className="text-5xl lg:text-6xl font-bold text-white leading-[1.1]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Vamos criar<br />
              <span className="bg-gradient-to-r from-[var(--primary)] via-[var(--cyan)] to-[var(--accent)] bg-clip-text text-transparent">
                algo incrível
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-base text-slate-400 leading-relaxed max-w-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Respondo em até 24h com próximos passos claros. Vamos transformar sua ideia em realidade.
            </motion.p>
          </div>

          {/* Discord Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full flex justify-center lg:justify-start"
          >
            <DiscordCard />
          </motion.div>
        </motion.section>

        {/* Right Side - Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="flex-1"
        >
          <div className="relative overflow-hidden rounded-3xl border border-slate-800/50 bg-gradient-to-br from-slate-900/60 via-slate-900/40 to-slate-900/60 backdrop-blur-2xl shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-[var(--primary)]/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-[var(--cyan)]/20 to-transparent rounded-full blur-3xl" />
            
            {/* Top accent line */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            
            <div className="relative p-8 sm:p-10 lg:p-12">
              <ContactForm />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

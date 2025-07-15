'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Github, InfoIcon, Send, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BsBookmarkFill } from 'react-icons/bs';
import Avatar from 'boring-avatars';
import HomeSectionTitle from '@/components/ui/HomeSectionTitle';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { GUESTBOOK_EMOJIS } from '@/constants/guestbookEmojis';
import { useLanguageStore } from '@/lib/i18n/languageStore';
import { useGuestbookStore } from '@/store/guestbookStore';
import { GuestbookEntry } from '@/types/guestbook.types';
import CarouselGuestbook from './CarouselGuestbook';
import styles from './GuestBook.module.css';

// Hook personalizado para debounce
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const GuestBook: React.FC = () => {
  const t = useTranslations('ModernGuestBook');
  const lang = useLanguageStore(state => state.lang);
  const { entries, isLoading, error, fetchEntries, addEntry } = useGuestbookStore();
  const [formData, setFormData] = useState({
    name: '',
    message: '',
    username: '',
    is_developer: true,
    emoji: GUESTBOOK_EMOJIS[0],
    avatar_url: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [avatarStatus, setAvatarStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  );

  // Constantes para validação
  const MAX_NAME_LENGTH = 50;
  const MAX_MESSAGE_LENGTH = 280;
  const MIN_MESSAGE_LENGTH = 5;

  // Debounce do username para evitar muitas requisições
  const debouncedUsername = useDebounce(formData.username, 800);

  // Buscar entradas quando o componente carrega
  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  // Carousel agora mostra todos os comentários
  const carouselEntries = entries;

  // Grid de avatares/comentários no fundo (mais entradas) - reutiliza se necessário
  const gridEntries = useMemo(() => {
    const totalSlots = 100; // Mais slots para preencher melhor
    if (entries.length === 0) return [];

    // Função para embaralhar array (Fisher-Yates shuffle)
    const shuffleArray = <T,>(array: T[]): T[] => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };

    if (entries.length >= totalSlots) {
      // Se temos entradas suficientes, embaralha e pega os primeiros totalSlots
      return shuffleArray(entries).slice(0, totalSlots);
    }

    // Reutiliza entradas embaralhadas para preencher todos os slots
    const repeated = [];
    const shuffledEntries = shuffleArray(entries);

    for (let i = 0; i < totalSlots; i++) {
      repeated.push(shuffledEntries[i % shuffledEntries.length]);
    }

    // Embaralha novamente o array final para distribuição ainda mais aleatória
    return shuffleArray(repeated);
  }, [entries]);

  // Buscar avatar do github automaticamente com debounce
  useEffect(() => {
    if (formData.is_developer && debouncedUsername.trim()) {
      setAvatarStatus('loading');

      const fetchAvatar = async () => {
        try {
          const res = await fetch(`https://api.github.com/users/${debouncedUsername.trim()}`);
          if (res.ok) {
            const data = await res.json();
            setFormData(prev => ({ ...prev, avatar_url: data.avatar_url || '' }));
            setAvatarStatus('success');
          } else {
            setAvatarStatus('error');
            setFormData(prev => ({ ...prev, avatar_url: '' }));
          }
        } catch {
          setAvatarStatus('error');
          setFormData(prev => ({ ...prev, avatar_url: '' }));
        }
      };

      fetchAvatar();
    } else if (!formData.is_developer || !debouncedUsername.trim()) {
      setAvatarStatus('idle');
      setFormData(prev => ({ ...prev, avatar_url: '' }));
    }
  }, [formData.is_developer, debouncedUsername]);

  const handleInputChange = useCallback((field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSubmitError(null);

    // Reset avatar status quando trocar tipo ou limpar username
    if (field === 'is_developer' || (field === 'username' && !value)) {
      setAvatarStatus('idle');
      if (field === 'is_developer' || !value) {
        setFormData(prev => ({ ...prev, avatar_url: '' }));
      }
    }
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validações melhoradas
      const trimmedName = formData.name.trim();
      const trimmedMessage = formData.message.trim();

      if (!trimmedName) {
        setSubmitError(t('nameRequired'));
        return;
      }

      if (trimmedName.length > MAX_NAME_LENGTH) {
        setSubmitError(t('nameTooLong', { max: MAX_NAME_LENGTH }));
        return;
      }

      if (!trimmedMessage) {
        setSubmitError(t('messageRequired'));
        return;
      }

      if (trimmedMessage.length < MIN_MESSAGE_LENGTH) {
        setSubmitError(t('messageTooShort', { min: MIN_MESSAGE_LENGTH }));
        return;
      }

      if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
        setSubmitError(t('messageTooLong', { max: MAX_MESSAGE_LENGTH }));
        return;
      }

      if (!formData.emoji) {
        setSubmitError(t('selectEmoji'));
        return;
      }

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        await addEntry({
          name: trimmedName,
          message: trimmedMessage,
          username: formData.username.trim() || null,
          is_developer: formData.is_developer,
          emoji: formData.emoji,
        });

        setFormData({
          name: '',
          message: '',
          username: '',
          is_developer: false,
          emoji: GUESTBOOK_EMOJIS[0],
          avatar_url: '',
        });
        setAvatarStatus('idle');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 4000);
      } catch (err) {
        console.error('Error submitting guestbook entry:', err);

        // Tratar diferentes tipos de erro
        if (err instanceof Error) {
          const errorMessage = err.message;

          // Verificar se é erro de rate limiting
          if (errorMessage.includes('Aguarde') || errorMessage.includes('Muitos posts')) {
            setSubmitError(t('rateLimitError', { message: errorMessage }));
          }
          // Verificar se é erro de validação
          else if (errorMessage.includes('muito longo') || errorMessage.includes('obrigatório')) {
            setSubmitError(t('validationError', { message: errorMessage }));
          }
          // Verificar se é erro de spam
          else if (errorMessage.includes('não permitido')) {
            setSubmitError(t('spamError'));
          }
          // Erro genérico
          else {
            setSubmitError(t('genericError'));
          }
        } else {
          setSubmitError(t('unexpectedError'));
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, addEntry, t]
  );

  // Função para scroll horizontal do emoji selector
  const handleEmojiWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const container = e.currentTarget;
    const { scrollWidth, clientWidth } = container;
    if (scrollWidth > clientWidth) {
      container.scrollLeft += e.deltaY;
    }
  };

  return (
    <div className={styles.guestbookContainer}>
      {/* Grid de fundo - avatares flutuantes */}
      <div className={styles.backgroundGrid}>
        {gridEntries.map((entry: GuestbookEntry, index: number) => (
          <motion.div
            key={`${entry.id}-${index}`}
            className={styles.gridItem}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.3, scale: 1 }}
            transition={{ delay: index * 0.01, duration: 0.8 }}
            whileHover={{ opacity: 0.5, scale: 1.05 }}
          >
            {entry.avatar_url ? (
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <Image
                  src={entry.avatar_url}
                  alt={entry.name}
                  fill
                  className={styles.gridItemImage}
                  sizes="(max-width: 768px) 8vw, 4vw"
                />
              </div>
            ) : (
              <div
                style={{ width: '100%', height: '100%', borderRadius: '8px', overflow: 'hidden' }}
              >
                <Avatar
                  size="100%"
                  name={entry.name}
                  variant="marble"
                  colors={['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444']}
                  square={true}
                />
              </div>
            )}
            {entry.emoji && <div className={styles.gridItemEmoji}>{entry.emoji}</div>}
          </motion.div>
        ))}
      </div>

      {/* Conteúdo principal */}
      <div className="relative z-10">
        <div className="flex justify-center mb-6 w-full">
          <HomeSectionTitle
            subTitle={lang === 'pt' ? 'Deixe sua marca aqui!' : 'Leave your mark here!'}
            titleWhitePart={lang === 'pt' ? 'Livro de' : 'Guest'}
            titleBluePart={lang === 'pt' ? 'Visitas' : 'Book'}
            icon={
              <motion.div
                key={1}
                className="w-10 h-10 mr-3 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, rotate: 360 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
              >
                <BsBookmarkFill className="w-6 h-6 text-[var(--primary)]" />
              </motion.div>
            }
          />
        </div>

        {/* Carrossel de comentários extraído */}
        <CarouselGuestbook entries={carouselEntries} />

        {/* Formulário melhorado */}
        <motion.div
          className={styles.formContainer}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <form onSubmit={handleSubmit} className={styles.form}>
            <motion.div className="flex items-center justify-center gap-2 mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-white text-center">
                {t('leaveCommentTitle')}
              </h3>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    tabIndex={0}
                    aria-label={t('rulesTitle')}
                    className="cursor-pointer transition-all text-blue-400 hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded-full p-1"
                  >
                    <span aria-hidden="true">
                      <InfoIcon />
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <ul className="text-xs space-y-1 text-blue-200/80">
                    <li>{t('rule1')}</li>
                    <li>{t('rule2')}</li>
                    <li>{t('rule3', { max: MAX_NAME_LENGTH })}</li>
                    <li>{t('rule4', { min: MIN_MESSAGE_LENGTH, max: MAX_MESSAGE_LENGTH })}</li>
                    <li>{t('rule5')}</li>
                  </ul>
                </TooltipContent>
              </Tooltip>
            </motion.div>

            {/* Success message */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  className="bg-green-500/20 border border-green-500/50 text-green-400 rounded-2xl p-4 mb-6 text-center font-medium"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {t('commentSuccess')}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Segment de tipo */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <motion.button
                type="button"
                onClick={() => handleInputChange('is_developer', true)}
                className={`relative overflow-hidden rounded-2xl p-4 font-semibold transition-all duration-300 ${
                  formData.is_developer
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center gap-3">
                  <Github size={20} />
                  <span>{t('devOption')}</span>
                </div>
              </motion.button>

              <motion.button
                type="button"
                onClick={() => handleInputChange('is_developer', false)}
                className={`relative overflow-hidden rounded-2xl p-4 font-semibold transition-all duration-300 ${
                  !formData.is_developer
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center gap-3">
                  <User size={20} />
                  <span>{t('visitorOption')}</span>
                </div>
              </motion.button>
            </div>

            {/* Campos de input */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    {t('nameLabel')}
                  </label>
                  <span
                    className={`text-sm ${
                      formData.name.length > MAX_NAME_LENGTH
                        ? 'text-red-400'
                        : formData.name.length > MAX_NAME_LENGTH * 0.8
                          ? 'text-yellow-400'
                          : 'text-gray-400'
                    }`}
                  >
                    {formData.name.length}/{MAX_NAME_LENGTH}
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  placeholder={t('namePlaceholder')}
                  maxLength={MAX_NAME_LENGTH}
                  required
                  className={`w-full bg-gray-800/50 border rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/25 transition-all duration-200 ${
                    formData.name.length > MAX_NAME_LENGTH
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-600 focus:border-blue-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {formData.is_developer ? t('githubUsernameLabel') : t('instagramUsernameLabel')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.username}
                    onChange={e => handleInputChange('username', e.target.value)}
                    placeholder={
                      formData.is_developer
                        ? t('githubUsernamePlaceholder')
                        : t('instagramUsernamePlaceholder')
                    }
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 transition-all duration-200"
                  />
                  {formData.is_developer && formData.username && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {avatarStatus === 'loading' && (
                        <motion.div
                          className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      )}
                      {avatarStatus === 'success' && (
                        <motion.div
                          className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500 }}
                        >
                          <span className="text-white text-xs">✓</span>
                        </motion.div>
                      )}
                      {avatarStatus === 'error' && (
                        <motion.div
                          className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500 }}
                        >
                          <span className="text-white text-xs">✕</span>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
                {formData.is_developer && avatarStatus === 'success' && formData.avatar_url && (
                  <motion.div
                    className="flex items-center gap-2 mt-2 text-sm text-green-400"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div style={{ position: 'relative', width: 24, height: 24 }}>
                      <Image
                        src={formData.avatar_url}
                        alt="Avatar preview"
                        width={24}
                        height={24}
                        className="w-full h-full object-cover"
                        sizes="24px"
                      />
                    </div>
                    <span>{t('avatarFound')}</span>
                  </motion.div>
                )}
                {formData.is_developer && avatarStatus === 'error' && (
                  <motion.div
                    className="text-sm text-red-400 mt-2"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {t('githubUserNotFound')}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Selector de emoji com scroll horizontal (sem animações desnecessárias) */}
            <div className="mb-6">
              <Tooltip>
                <TooltipTrigger asChild>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    {t('chooseEmojiLabel')}
                  </label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('emojiRules')}</p>
                </TooltipContent>
              </Tooltip>
              <div className="relative">
                <div
                  className={styles.emojiSelector}
                  onWheelCapture={handleEmojiWheel}
                  style={{
                    pointerEvents: 'auto',
                    overflowX: 'auto',
                    whiteSpace: 'nowrap',
                    overscrollBehavior: 'contain',
                    touchAction: 'pan-x',
                  }}
                >
                  {GUESTBOOK_EMOJIS.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleInputChange('emoji', emoji)}
                      className={`${styles.emojiButton} ${
                        formData.emoji === emoji ? styles.emojiButtonSelected : ''
                      }`}
                    >
                      <span className="filter drop-shadow-sm">{emoji}</span>
                    </button>
                  ))}
                </div>
                {/* Gradient indicators for scroll */}
                <div className={styles.emojiGradientLeft} />
                <div className={styles.emojiGradientRight} />
              </div>
            </div>

            {/* Textarea para mensagem */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  {t('messageLabel')}
                </label>
                <span
                  className={`text-sm ${
                    formData.message.length > MAX_MESSAGE_LENGTH
                      ? 'text-red-400'
                      : formData.message.length > MAX_MESSAGE_LENGTH * 0.8
                        ? 'text-yellow-400'
                        : 'text-gray-400'
                  }`}
                >
                  {formData.message.length}/{MAX_MESSAGE_LENGTH}
                </span>
              </div>
              <textarea
                value={formData.message}
                onChange={e => handleInputChange('message', e.target.value)}
                placeholder={t('messagePlaceholder')}
                rows={4}
                maxLength={MAX_MESSAGE_LENGTH}
                required
                className={`w-full bg-gray-800/50 border rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/25 transition-all duration-200 resize-none ${
                  formData.message.length > MAX_MESSAGE_LENGTH
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-600 focus:border-blue-500'
                }`}
              />
              {formData.message.length < MIN_MESSAGE_LENGTH && formData.message.length > 0 && (
                <p className="text-yellow-400 text-xs mt-1">
                  {t('messageTooShortHint', {
                    min: MIN_MESSAGE_LENGTH,
                    current: MIN_MESSAGE_LENGTH - formData.message.length,
                  })}
                </p>
              )}
            </div>

            {/* Error message */}
            {submitError ||
              (error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-400 rounded-2xl p-4 mb-6 text-center font-medium">
                  {error}
                </div>
              ))}

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="relative w-full bg-gradient-to-r from-blue-500 via-purple-600 to-blue-500 bg-size-200 text-white font-bold py-5 px-8 rounded-2xl shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 overflow-hidden"
              style={{ backgroundSize: '200% 100%' }}
              whileHover={
                !isSubmitting
                  ? {
                      scale: 1.02,
                      boxShadow: '0 0 40px rgba(59, 130, 246, 0.6)',
                    }
                  : {}
              }
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              />
              <div className="relative flex items-center justify-center gap-3 cursor-pointer">
                <motion.div
                  animate={isSubmitting ? { rotate: 360 } : {}}
                  transition={{ duration: 1, repeat: isSubmitting ? Infinity : 0 }}
                >
                  <Send size={22} />
                </motion.div>
                <span className="text-lg">{isSubmitting ? t('sending') : t('sendComment')}</span>
              </div>
            </motion.button>
          </form>
        </motion.div>

        {/* Loading and Error States */}
        {isLoading && entries.length === 0 && (
          <motion.div
            className="text-center text-gray-400 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            {t('loadingComments')}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GuestBook;

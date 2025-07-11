'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Github, User, Send, MessageCircle, Quote, Calendar, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useGuestbook } from '@/hooks/useGuestbook';
import { useLanguageStore } from '@/lib/i18n/languageStore';
import HomeSectionTitle from '@/components/ui/HomeSectionTitle';
import './ModernGuestBook.css';

interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  username?: string | null;
  is_developer: boolean;
  avatar_url?: string | null;
  created_at: string;
}

// Avatar Card Component
const AvatarCard = React.memo(
  ({
    entry,
    index,
    isActive,
    onClick,
  }: {
    entry: GuestbookEntry;
    index: number;
    isActive: boolean;
    onClick: () => void;
  }) => {
    return (
      <motion.div
        className={`avatar-card ${isActive ? 'active' : ''}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isActive ? 1 : 0.6,
          scale: isActive ? 1.1 : 1,
          y: Math.sin(index * 0.8) * 8,
        }}
        transition={{
          delay: index * 0.05,
          duration: 0.4,
          y: { duration: 3, repeat: Infinity, repeatType: 'reverse' },
        }}
        onClick={onClick}
        whileHover={{ scale: 1.05, opacity: 1 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="avatar-wrapper">
          {entry.avatar_url ? (
            <Image
              src={entry.avatar_url}
              alt={entry.name}
              width={40}
              height={40}
              className="avatar-image"
            />
          ) : (
            <div className="avatar-fallback">{entry.name.charAt(0).toUpperCase()}</div>
          )}
          <div className="avatar-badge">
            {entry.is_developer ? <Github size={10} /> : <User size={10} />}
          </div>
        </div>

        <motion.div
          className="avatar-tooltip"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 5 }}
        >
          <div className="tooltip-name">{entry.name}</div>
          <div className="tooltip-type">{entry.is_developer ? 'Dev' : 'Visitor'}</div>
        </motion.div>
      </motion.div>
    );
  }
);

AvatarCard.displayName = 'AvatarCard';

// Featured Comment Component
const FeaturedComment = React.memo(({ entry }: { entry: GuestbookEntry }) => {
  const formatDate = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  return (
    <motion.div
      className="featured-comment"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
    >
      <div className="featured-background">
        <Quote size={80} className="quote-icon" />
      </div>

      <div className="featured-content">
        <blockquote className="featured-message">&ldquo;{entry.message}&rdquo;</blockquote>

        <div className="featured-author">
          <div className="author-avatar">
            {entry.avatar_url ? (
              <Image
                src={entry.avatar_url}
                alt={entry.name}
                width={48}
                height={48}
                className="avatar-image"
              />
            ) : (
              <div className="avatar-fallback">{entry.name.charAt(0).toUpperCase()}</div>
            )}
            <div className="author-badge">
              {entry.is_developer ? <Github size={12} /> : <User size={12} />}
            </div>
          </div>

          <div className="author-info">
            <div className="author-name">{entry.name}</div>
            <div className="author-date">
              <Calendar size={12} />
              {formatDate(entry.created_at)}
            </div>
            {entry.username && (
              <a
                href={
                  entry.is_developer
                    ? `https://github.com/${entry.username}`
                    : `https://instagram.com/${entry.username}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="author-link"
              >
                <ExternalLink size={12} /> @{entry.username}
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

FeaturedComment.displayName = 'FeaturedComment';

const ModernGuestBook: React.FC = () => {
  const { entries, isLoading, error, addEntry } = useGuestbook();
  const lang = useLanguageStore(state => state.lang);
  const t = useTranslations('ModernGuestBook');
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    message: '',
    username: '',
    is_developer: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Auto-rotate featured comments
  useEffect(() => {
    if (entries.length > 1) {
      const interval = setInterval(() => {
        setFeaturedIndex(prev => (prev + 1) % entries.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [entries.length]);

  const recentEntries = useMemo(() => entries.slice(0, 12), [entries]);
  const featuredEntry = useMemo(
    () => (entries.length > 0 ? entries[featuredIndex] : null),
    [entries, featuredIndex]
  );

  const handleInputChange = useCallback((field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSubmitError(null);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!formData.name.trim() || !formData.message.trim()) {
        setSubmitError(t('nameRequired'));
        return;
      }

      setIsSubmitting(true);
      setSubmitError(null);

      try {
        await addEntry({
          name: formData.name.trim(),
          message: formData.message.trim(),
          username: formData.username.trim() || null,
          is_developer: formData.is_developer,
        });

        setFormData({
          name: '',
          message: '',
          username: '',
          is_developer: false,
        });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : t('errorMessage'));
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, addEntry, t]
  );

  if (error) {
    return (
      <section className="modern-guestbook error">
        <div className="error-content">
          <MessageCircle size={48} />
          <h3>{t('errorLoading')}</h3>
          <p>{t('tryReload')}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="modern-guestbook" id="guestbook">
      <div className="guestbook-container">
        {/* Background Grid of Avatars */}
        <div className="background-grid">
          {recentEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              className="grid-item"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              style={{
                left: `${(index * 47) % 100}%`,
                top: `${Math.floor(index / 3) * 25}%`,
              }}
            >
              {entry.avatar_url && (
                <Image
                  src={entry.avatar_url}
                  alt={entry.name}
                  width={32}
                  height={32}
                  className="grid-avatar"
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Header */}
        <motion.div
          className="guestbook-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <HomeSectionTitle
            subTitle={t('subtitle')}
            titleWhitePart={lang === 'pt' ? 'Livro de' : 'Guest'}
            titleBluePart={lang === 'pt' ? 'Visitas' : 'Book'}
            icon={
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <MessageCircle size={32} color="var(--primary)" />
              </motion.div>
            }
          />
        </motion.div>

        <div className="guestbook-content">
          {/* Comments Section */}
          <motion.div
            className="comments-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Avatars Grid */}
            <div className="avatars-showcase">
              <h4 className="showcase-title">
                {lang === 'pt'
                  ? `Últimas ${recentEntries.length} mensagens`
                  : `Latest ${recentEntries.length} messages`}
              </h4>
              <div className="avatars-grid">
                {recentEntries.map((entry, index) => (
                  <AvatarCard
                    key={entry.id}
                    entry={entry}
                    index={index}
                    isActive={index === featuredIndex}
                    onClick={() => setFeaturedIndex(index)}
                  />
                ))}
              </div>
            </div>

            {/* Featured Comment */}
            {featuredEntry && (
              <div className="featured-section">
                <AnimatePresence mode="wait">
                  <FeaturedComment key={featuredEntry.id} entry={featuredEntry} />
                </AnimatePresence>
              </div>
            )}

            {/* Stats */}
            <motion.div
              className="comments-stats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="stat-item">
                <MessageCircle size={16} />
                <span>
                  {entries.length} {t('messages')}
                </span>
              </div>
              <div className="stat-item">
                <Github size={16} />
                <span>
                  {entries.filter(e => e.is_developer).length} {t('developers')}
                </span>
              </div>
            </motion.div>

            {/* Empty State */}
            {!isLoading && entries.length === 0 && (
              <div className="empty-state">
                <MessageCircle size={48} />
                <p>{t('firstMessage')}</p>
              </div>
            )}
          </motion.div>

          {/* Form Section */}
          <motion.div
            className="form-section"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <form onSubmit={handleSubmit} className="guestbook-form">
              <h3>{t('addMessage')}</h3>

              {showSuccess && (
                <motion.div
                  className="form-success"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  {t('successMessage')}
                </motion.div>
              )}

              <div className="type-selector">
                <motion.button
                  type="button"
                  className={`type-btn ${formData.is_developer ? 'active' : ''}`}
                  onClick={() => handleInputChange('is_developer', true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Github size={16} />
                  {t('developer')}
                </motion.button>
                <motion.button
                  type="button"
                  className={`type-btn ${!formData.is_developer ? 'active' : ''}`}
                  onClick={() => handleInputChange('is_developer', false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <User size={16} />
                  {t('visitor')}
                </motion.button>
              </div>

              <div className="form-row">
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => handleInputChange('name', e.target.value)}
                  placeholder={t('yourName')}
                  required
                />
                {formData.is_developer ? (
                  <input
                    type="text"
                    value={formData.username}
                    onChange={e => handleInputChange('username', e.target.value)}
                    placeholder={t('github')}
                  />
                ) : (
                  <input
                    type="text"
                    value={formData.username}
                    onChange={e => handleInputChange('username', e.target.value)}
                    placeholder={t('instagram')}
                  />
                )}
              </div>

              <textarea
                value={formData.message}
                onChange={e => handleInputChange('message', e.target.value)}
                placeholder={t('sharethoughts')}
                rows={4}
                required
              />

              {submitError && <div className="error">{submitError}</div>}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Send size={16} />
                {isSubmitting ? t('sending') : t('sendMessage')}
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <motion.div className="loading-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.div
              className="loading-spinner"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <MessageCircle size={32} />
            </motion.div>
            <p>{t('loadingMessages')}</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ModernGuestBook;

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Code,
  Github,
  Instagram,
  Link as LinkIcon,
  Quote,
  Send,
  SmilePlus,
  User,
  X,
} from 'lucide-react';
import Image from 'next/image';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './GuestBook.css';

// Types for our guest book entries
interface GuestBookEntry {
  id: string;
  name: string;
  message: string;
  timestamp: string;
  avatar?: string; // URL to user avatar
  emoji?: string; // User's chosen emoji
  socialLink?: string; // GitHub or Instagram link
  isDeveloper?: boolean; // Whether the user is a developer
}

// Popular emojis for quick selection
const popularEmojis = [
  '😊',
  '👍',
  '❤️',
  '🔥',
  '✨',
  '🚀',
  '💯',
  '👏',
  '🙌',
  '💻',
  '👨‍💻',
  '👩‍💻',
  '🎉',
  '🎨',
];

// Mock data - replace with actual database fetch
const mockEntries: GuestBookEntry[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    message:
      'Amazing portfolio! Your design skills are impressive and I love the attention to detail in every project.',
    emoji: '🔥',
    timestamp: '2025-06-10T14:23:00Z',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    socialLink: 'https://github.com/sarahjohnson',
    isDeveloper: true,
  },
  {
    id: '2',
    name: 'David Chen',
    message:
      'The interactive elements on your site are so engaging! What animation library are you using?',
    emoji: '✨',
    timestamp: '2025-06-09T08:15:00Z',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    socialLink: 'https://instagram.com/davidchen',
    isDeveloper: false,
  },
  {
    id: '3',
    name: 'Maya Patel',
    message:
      'Keep up the great work! Your projects showcase excellent technical skills combined with a strong design sense.',
    emoji: '👏',
    timestamp: '2025-06-05T19:42:00Z',
    avatar: 'https://randomuser.me/api/portraits/women/67.jpg',
    socialLink: 'https://github.com/mayap',
    isDeveloper: true,
  },
  {
    id: '4',
    name: 'Thomas Wright',
    message: 'Very inspiring portfolio! I especially liked your approach to responsive design.',
    emoji: '💯',
    timestamp: '2025-06-04T10:23:00Z',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    socialLink: 'https://instagram.com/thomaswright',
    isDeveloper: false,
  },
  {
    id: '5',
    name: 'Aisha Khan',
    message:
      'Such creative work. The UI/UX of your projects demonstrates exceptional skill and understanding of user needs.',
    emoji: '🎨',
    timestamp: '2025-06-03T15:40:00Z',
    avatar: 'https://randomuser.me/api/portraits/women/39.jpg',
    socialLink: 'https://github.com/aishakhan',
    isDeveloper: true,
  },
  {
    id: '6',
    name: 'Marcus Johnson',
    message:
      'Your portfolio shows great technical depth. Love the projects and the clean code architecture.',
    emoji: '💻',
    timestamp: '2025-06-02T11:20:00Z',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    socialLink: 'https://github.com/marcusj',
    isDeveloper: true,
  },
  {
    id: '7',
    name: 'Elena Rodriguez',
    message:
      'The animations throughout your site create such a delightful experience! Inspiring work!',
    emoji: '🎉',
    timestamp: '2025-05-30T09:15:00Z',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    socialLink: 'https://instagram.com/elenarodz',
    isDeveloper: false,
  },
  {
    id: '8',
    name: 'James Wilson',
    message:
      "As a fellow developer, I'm impressed by your implementation. Have you considered open-sourcing some of your components?",
    emoji: '👨‍💻',
    timestamp: '2025-05-28T16:45:00Z',
    avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
    socialLink: 'https://github.com/jameswilson',
    isDeveloper: true,
  },
];

const GuestBook = () => {
  // State variables
  const [entries, setEntries] = useState<GuestBookEntry[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [name, setName] = useState('');
  const [socialLink, setSocialLink] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeveloper, setIsDeveloper] = useState<boolean | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  // Load entries when component mounts
  useEffect(() => {
    // In a real app, fetch from your database instead
    setEntries(mockEntries);
  }, []);

  // Auto-rotate featured testimonial every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedIndex(prev => (prev + 1) % entries.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [entries.length]);

  // Format date based on locale
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
      return new Intl.DateTimeFormat('pt-BR', options).format(date);
    } catch (e) {
      return dateString;
    }
  };

  // Navigate featured testimonial
  const goToNextFeatured = useCallback(() => {
    setFeaturedIndex(prev => (prev + 1) % entries.length);
  }, [entries.length]);

  const goToPrevFeatured = useCallback(() => {
    setFeaturedIndex(prev => (prev - 1 + entries.length) % entries.length);
  }, [entries.length]);

  // Handle quick emoji selection
  const selectQuickEmoji = (emoji: string) => {
    setSelectedEmoji(emoji);
  };

  // Validate GitHub username
  const validateGithubUsername = (username: string) => {
    // Remove https://github.com/ if present
    const cleanUsername = username.replace(/^(https?:\/\/)?(github\.com\/)?/i, '');
    return cleanUsername.trim();
  };

  // Validate Instagram username
  const validateInstagramUsername = (username: string) => {
    // Remove https://instagram.com/ if present
    const cleanUsername = username.replace(/^(https?:\/\/)?(instagram\.com\/)?/i, '');
    return cleanUsername.trim();
  };

  // Handle submitting a new entry
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Por favor, digite seu nome');
      return;
    }

    if (!newMessage.trim()) {
      setError('Por favor, digite uma mensagem');
      return;
    }

    if (isDeveloper === null) {
      setError('Por favor, selecione se você é desenvolvedor ou não');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    let avatarUrl = '';
    let formattedSocialLink = '';

    // Format social link and get avatar based on selection
    if (isDeveloper) {
      const username = validateGithubUsername(socialLink);
      formattedSocialLink = username ? `https://github.com/${username}` : '';
      avatarUrl = username ? `https://github.com/${username}.png` : '';
    } else {
      const username = validateInstagramUsername(socialLink);
      formattedSocialLink = username ? `https://instagram.com/${username}` : '';
      // Use Boring Avatars API for non-GitHub users since we can't easily get Instagram photos
      avatarUrl = `https://source.boringavatars.com/beam/120/${encodeURIComponent(name)}?colors=264653,2a9d8f,e9c46a,f4a261,e76f51`;
    }

    // Simulating API call delay
    setTimeout(() => {
      const newEntry: GuestBookEntry = {
        id: Date.now().toString(),
        name,
        message: newMessage,
        emoji: selectedEmoji,
        timestamp: new Date().toISOString(),
        avatar:
          avatarUrl || `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(name)}`,
        socialLink: formattedSocialLink,
        isDeveloper,
      };

      setEntries(prev => [newEntry, ...prev]);
      setNewMessage('');
      setSelectedEmoji('');
      setSocialLink('');
      setIsDeveloper(null);
      setIsSubmitting(false);
    }, 800);
  };

  // Get the featured entry for the quote carousel
  const featuredEntry = useMemo(() => {
    if (entries.length === 0) return null;
    return entries[featuredIndex];
  }, [entries, featuredIndex]);
  // Generate background avatar grid
  const avatarBackgroundElements = useMemo(() => {
    // Duplicar entradas para preencher o grid se necessário
    const gridEntries = [...entries];
    while (gridEntries.length < 40) {
      gridEntries.push(...entries);
    }

    // Limitar a um número máximo para evitar problemas de desempenho
    const limitedEntries = gridEntries.slice(0, 50);

    // Embaralhar as entradas para distribuição aleatória no grid
    const shuffledEntries = [...limitedEntries].sort(() => Math.random() - 0.5);

    return shuffledEntries
      .map((entry, index) => {
        // Alguns avatares podem estar um pouco fora do grid por efeito estético
        const randomOffset = index % 3 === 0 ? Math.random() * 15 : 0;

        // Variar tamanho levemente
        const sizeVariation = 0.7 + Math.random() * 0.6;

        return entry.avatar ? (
          <div
            key={`${entry.id}-${index}`}
            className="avatar-bg-item"
            style={
              {
                transform: `scale(${sizeVariation})`,
                // Atraso diferente para cada avatar na animação
                '--delay': `${Math.random() * 10}s`,
                marginLeft: index % 5 === 0 ? `${randomOffset}px` : 0,
                marginTop: index % 7 === 0 ? `${randomOffset}px` : 0,
              } as React.CSSProperties
            }
          >
            <Image
              src={entry.avatar}
              alt=""
              fill
              className="object-cover"
              sizes="100px"
              priority={index < 10} // Carregar com prioridade os primeiros avatares
            />
          </div>
        ) : null;
      })
      .filter(Boolean);
  }, [entries]);

  return (
    <section className="w-full py-32 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 w-full h-full bg-[#050505] overflow-hidden">
        {/* Animated gradient backgrounds */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-[#050505] via-[rgba(5,5,5,0.7)] to-transparent"></div>

        {/* Avatar grid background */}
        <div className="avatar-grid absolute inset-0 w-full h-full">{avatarBackgroundElements}</div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-4">
            <motion.span
              className="text-muted-foreground block text-lg font-normal mb-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              'Deixe seu recado'
            </motion.span>
            <motion.span
              className="inline-block align-middle"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 1.0, delay: 0.7 }}
            >
              <motion.span
                className="font-extrabold text-white"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.7, delay: 1.0 }}
              >
                'Meu '
                <motion.span
                  className="text-cyan-400"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: 1.4 }}
                >
                  'Livro de Visitas'
                </motion.span>
              </motion.span>
            </motion.span>
          </h2>
          <motion.p
            className="text-muted-foreground max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {'Deixe uma mensagem, feedback ou apenas um olá! Adoraria saber que você esteve aqui.'}
          </motion.p>
        </motion.div>

        {/* Featured Quote Carousel */}
        {featuredEntry && (
          <div className="mb-24 relative z-20">
            <motion.div
              className="relative quote-container max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {/* Navigation buttons */}
              <button
                onClick={goToPrevFeatured}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={goToNextFeatured}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight size={24} />
              </button>

              <div className="p-8 sm:p-12 backdrop-blur-xl bg-[rgba(5,5,5,0.5)] shadow-2xl rounded-2xl border border-white/5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={featuredEntry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center"
                  >
                    {/* Quote icon */}
                    <div className="flex justify-center mb-8">
                      <Quote size={48} className="text-primary/60" strokeWidth={1} />
                    </div>

                    {/* Quote text */}
                    <div className="text-xl sm:text-2xl text-center text-white font-light italic mb-10 max-w-3xl leading-relaxed">
                      "{featuredEntry.message}"
                      {featuredEntry.emoji && (
                        <span className="inline-block ml-2 transform -rotate-12">
                          {featuredEntry.emoji}
                        </span>
                      )}
                    </div>

                    {/* Author info with avatar */}
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/30 featured-profile">
                          {featuredEntry.avatar ? (
                            <Image
                              src={featuredEntry.avatar}
                              alt={featuredEntry.name}
                              width={56}
                              height={56}
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center text-xl font-bold">
                              {featuredEntry.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>

                        {/* Social icon badge */}
                        {featuredEntry.isDeveloper !== undefined && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center bg-[#111] border border-[#333] shadow-lg">
                            {featuredEntry.isDeveloper ? (
                              <Github size={14} className="text-white" />
                            ) : (
                              <Instagram size={14} className="text-white" />
                            )}
                          </div>
                        )}
                      </div>

                      {/* Author info */}
                      <div>
                        <div className="font-medium text-white">{featuredEntry.name}</div>
                        <div className="text-sm text-gray-300">
                          {formatDate(featuredEntry.timestamp)}
                        </div>
                      </div>

                      {/* Social link */}
                      {featuredEntry.socialLink && (
                        <a
                          href={featuredEntry.socialLink}
                          className="ml-2 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Visit ${featuredEntry.name}'s profile`}
                        >
                          <ArrowUpRight size={16} className="text-primary" />
                        </a>
                      )}
                    </div>

                    {/* Navigation dots */}
                    <div className="flex gap-2 mt-8">
                      {entries.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full ${
                            index === featuredIndex ? 'bg-primary' : 'bg-gray-600'
                          }`}
                          onClick={() => setFeaturedIndex(index)}
                          aria-label={`Go to testimonial ${index + 1}`}
                        />
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}

        {/* Form container */}
        <motion.div
          className="max-w-2xl mx-auto bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="p-8">
            <h3 className="text-xl font-semibold mb-6 text-white">{'Adicionar uma mensagem'}</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Developer/Non-Developer selection - Simplified as Pills */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">{'Você é:'}</label>
                <div className="flex gap-3 p-1 bg-black/30 backdrop-blur-sm rounded-lg inline-flex">
                  <motion.button
                    type="button"
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium ${
                      isDeveloper === true
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-transparent text-gray-300 hover:bg-white/5'
                    }`}
                    onClick={() => setIsDeveloper(true)}
                    whileHover={isDeveloper !== true ? { scale: 1.02 } : {}}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Code size={16} />
                    <span>{'Desenvolvedor'}</span>
                  </motion.button>

                  <motion.button
                    type="button"
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium ${
                      isDeveloper === false
                        ? 'bg-primary text-white shadow-lg'
                        : 'bg-transparent text-gray-300 hover:bg-white/5'
                    }`}
                    onClick={() => setIsDeveloper(false)}
                    whileHover={isDeveloper !== false ? { scale: 1.02 } : {}}
                    whileTap={{ scale: 0.98 }}
                  >
                    <User size={16} />
                    <span>{'Não-Dev'}</span>
                  </motion.button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    {'Seu nome'}
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder={'Como devemos te chamar?'}
                  />
                </div>

                <div>
                  <label
                    htmlFor="socialLink"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    {isDeveloper === true
                      ? 'GitHub'
                      : isDeveloper === false
                        ? 'Instagram'
                        : 'Link Social'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {isDeveloper === true ? (
                        <Github size={16} className="text-gray-400" />
                      ) : isDeveloper === false ? (
                        <Instagram size={16} className="text-gray-400" />
                      ) : (
                        <LinkIcon size={16} className="text-gray-400" />
                      )}
                    </div>
                    <input
                      type="text"
                      id="socialLink"
                      value={socialLink}
                      onChange={e => setSocialLink(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="username"
                      disabled={isDeveloper === null}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{'Será usado para seu avatar'}</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                    {'Sua mensagem'}
                  </label>

                  <div className="flex items-center">
                    {selectedEmoji && <span className="mr-2 text-lg">{selectedEmoji}</span>}
                    <motion.button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-1.5 rounded-md hover:bg-white/10 text-gray-300 relative"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <SmilePlus size={16} />
                    </motion.button>
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    id="message"
                    rows={4}
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder={'Compartilhe seus pensamentos ou feedback...'}
                  />

                  {/* Emoji picker popup */}
                  <AnimatePresence>
                    {showEmojiPicker && (
                      <motion.div
                        className="absolute right-0 top-0 mt-8 z-50"
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="bg-[#141414] border border-white/10 p-4 rounded-lg shadow-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-300">{'Escolha um emoji'}</span>
                            <button
                              type="button"
                              onClick={() => setShowEmojiPicker(false)}
                              className="text-gray-400 hover:text-white"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <div className="grid grid-cols-7 gap-2 max-w-[266px]">
                            {popularEmojis.map(emoji => (
                              <motion.button
                                key={emoji}
                                type="button"
                                onClick={() => {
                                  setSelectedEmoji(emoji);
                                  setShowEmojiPicker(false);
                                }}
                                className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded"
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <span className="text-lg">{emoji}</span>
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <motion.div
                  className="text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.div>
              )}

              <div className="flex justify-end">
                <motion.button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg text-sm font-medium shadow-lg disabled:opacity-50 w-full sm:w-auto"
                  whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0, 200, 225, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {'Enviando...'}
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      {'Enviar mensagem'}
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GuestBook;

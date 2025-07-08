'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Code,
  Github,
  Instagram,
  Link as LinkIcon,
  Quote,
  SmilePlus,
  User,
  X,
} from 'lucide-react';
import Image from 'next/image';

// Types para as entradas do livro de visitas
interface GuestBookEntry {
  id: string;
  name: string;
  message: string;
  timestamp: string;
  avatar?: string;
  emoji?: string;
  socialLink?: string;
  isDeveloper?: boolean;
}

// Emojis populares para seleção rápida
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

// Mock data otimizado
const mockEntries: GuestBookEntry[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    message:
      'Amazing portfolio! Your design skills are impressive and I love the attention to detail in every project.',
    emoji: '🔥',
    timestamp: '2025-06-10T14:23:00Z',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=120&h=120&fit=crop&crop=face',
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
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=face',
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
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=face',
    socialLink: 'https://github.com/mayap',
    isDeveloper: true,
  },
  {
    id: '4',
    name: 'Thomas Wright',
    message: 'Very inspiring portfolio! I especially liked your approach to responsive design.',
    emoji: '💯',
    timestamp: '2025-06-04T10:23:00Z',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face',
    socialLink: 'https://instagram.com/thomaswright',
    isDeveloper: false,
  },
];

const GuestBook = () => {
  // Estados otimizados
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

  // Refs para otimização
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Carrega entradas apenas uma vez
  useEffect(() => {
    setEntries(mockEntries);
  }, []);

  // Auto-rotação do carrossel com cleanup adequado
  useEffect(() => {
    if (entries.length > 1) {
      intervalRef.current = setInterval(() => {
        setFeaturedIndex(prev => (prev + 1) % entries.length);
      }, 10000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [entries.length]);

  // Fechar emoji picker ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  // Formatar data de forma otimizada
  const formatDate = useCallback((dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(date);
    } catch {
      return dateString;
    }
  }, []);

  // Navegação do carrossel otimizada
  const goToNextFeatured = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setFeaturedIndex(prev => (prev + 1) % entries.length);
  }, [entries.length]);

  const goToPrevFeatured = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setFeaturedIndex(prev => (prev - 1 + entries.length) % entries.length);
  }, [entries.length]);

  // Validações otimizadas
  const validateUsername = useCallback((username: string, platform: 'github' | 'instagram') => {
    const patterns = {
      github: /^(https?:\/\/)?(github\.com\/)?/i,
      instagram: /^(https?:\/\/)?(instagram\.com\/)?/i,
    };
    return username.replace(patterns[platform], '').trim();
  }, []);

  // Submissão do formulário otimizada
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validações
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

      try {
        // Processar dados
        let avatarUrl = '';
        let formattedSocialLink = '';

        if (socialLink.trim()) {
          if (isDeveloper) {
            const username = validateUsername(socialLink, 'github');
            formattedSocialLink = `https://github.com/${username}`;
            avatarUrl = `https://github.com/${username}.png`;
          } else {
            const username = validateUsername(socialLink, 'instagram');
            formattedSocialLink = `https://instagram.com/${username}`;
          }
        }

        // Avatar padrão se não houver GitHub
        if (!avatarUrl) {
          avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0184fc&color=fff&size=120`;
        }

        // Simular delay da API
        await new Promise(resolve => setTimeout(resolve, 800));

        const newEntry: GuestBookEntry = {
          id: Date.now().toString(),
          name: name.trim(),
          message: newMessage.trim(),
          emoji: selectedEmoji,
          timestamp: new Date().toISOString(),
          avatar: avatarUrl,
          socialLink: formattedSocialLink,
          isDeveloper,
        };

        setEntries(prev => [newEntry, ...prev]);

        // Reset do formulário
        setNewMessage('');
        setName('');
        setSocialLink('');
        setSelectedEmoji('');
        setIsDeveloper(null);
      } catch (err) {
        console.error('Erro ao enviar mensagem:', err);
        setError('Erro ao enviar mensagem. Tente novamente.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [name, newMessage, isDeveloper, socialLink, selectedEmoji, validateUsername]
  );

  // Entry em destaque otimizada
  const featuredEntry = useMemo(() => {
    return entries.length > 0 ? entries[featuredIndex] : null;
  }, [entries, featuredIndex]);

  // Grid de avatares otimizado (limitado para performance)
  const avatarGrid = useMemo(() => {
    if (entries.length === 0) return [];

    // Limitar a 20 avatares para performance
    const limitedEntries = entries.slice(0, 20);

    return limitedEntries
      .map((entry, index) =>
        entry.avatar ? (
          <div
            key={`${entry.id}-${index}`}
            className="absolute w-12 h-12 rounded-lg overflow-hidden opacity-5 hover:opacity-10 transition-opacity duration-500 border border-white/5"
            style={{
              left: `${(index * 47) % 100}%`,
              top: `${Math.floor(index / 3) * 25}%`,
              animationDelay: `${index * 0.5}s`,
            }}
          >
            <Image
              src={entry.avatar}
              alt={entry.name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ) : null
      )
      .filter(Boolean);
  }, [entries]);

  return (
    <section
      className="w-full py-32 relative overflow-hidden min-h-screen"
      style={{ backgroundColor: '#0c0c0c' }}
    >
      {/* Background otimizado com cores globais */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #0c0c0c 0%, #181818 50%, #0c0c0c 100%)' }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(1, 244, 252, 0.03) 100%)',
          }}
        />

        {/* Grid de avatares otimizado */}
        <div className="absolute inset-0 overflow-hidden">{avatarGrid}</div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]">
          <h2 className="text-4xl font-bold mb-4" style={{ color: 'rgb(247, 247, 247)' }}>
            <span
              className="block text-lg font-normal mb-2"
              style={{ color: 'rgb(128, 128, 128)' }}
            >
              Deixe seu recado
            </span>
            Meu <span style={{ color: 'rgb(1, 244, 252)' }}>Livro de Visitas</span>
          </h2>
          <p className="max-w-xl mx-auto" style={{ color: 'rgb(128, 128, 128)' }}>
            Deixe uma mensagem, feedback ou apenas um olá! Adoraria saber que você esteve aqui.
          </p>
        </div>

        {/* Carrossel de destaques */}
        {featuredEntry && (
          <div className="mb-24 relative opacity-0 animate-[fadeIn_0.8s_ease-out_0.2s_forwards]">
            <div className="relative max-w-4xl mx-auto">
              {/* Botões de navegação */}
              {entries.length > 1 && (
                <>
                  <button
                    onClick={goToPrevFeatured}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-lg transition-colors"
                    style={{
                      backgroundColor: 'rgba(12, 12, 12, 0.8)',
                      color: 'rgb(247, 247, 247)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = 'rgba(1, 132, 252, 0.2)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = 'rgba(12, 12, 12, 0.8)';
                    }}
                    aria-label="Anterior"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  <button
                    onClick={goToNextFeatured}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-lg transition-colors"
                    style={{
                      backgroundColor: 'rgba(12, 12, 12, 0.8)',
                      color: 'rgb(247, 247, 247)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = 'rgba(1, 132, 252, 0.2)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = 'rgba(12, 12, 12, 0.8)';
                    }}
                    aria-label="Próximo"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              <div
                className="p-8 sm:p-12 rounded-2xl backdrop-blur-xl"
                style={{
                  backgroundColor: 'rgba(24, 24, 24, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                }}
              >
                <div
                  key={featuredEntry.id}
                  className="text-center opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]"
                >
                  <Quote
                    size={48}
                    className="mx-auto mb-8"
                    style={{ color: 'rgba(1, 244, 252, 0.6)' }}
                  />

                  <blockquote
                    className="text-xl sm:text-2xl font-light italic mb-8 max-w-3xl mx-auto"
                    style={{ color: 'rgb(247, 247, 247)' }}
                  >
                    &quot;{featuredEntry.message}&quot;
                    {featuredEntry.emoji && <span className="ml-2">{featuredEntry.emoji}</span>}
                  </blockquote>

                  <div className="flex items-center justify-center gap-4">
                    <div className="relative">
                      <div
                        className="w-14 h-14 rounded-lg overflow-hidden"
                        style={{ border: '2px solid rgba(1, 244, 252, 0.3)' }}
                      >
                        {featuredEntry.avatar ? (
                          <Image
                            src={featuredEntry.avatar}
                            alt={featuredEntry.name}
                            className="w-full h-full object-cover"
                            width={56}
                            height={56}
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center text-xl font-bold"
                            style={{
                              background:
                                'linear-gradient(45deg, rgb(1, 244, 252), rgb(1, 132, 252))',
                              color: 'rgb(247, 247, 247)',
                            }}
                          >
                            {featuredEntry.name.charAt(0)}
                          </div>
                        )}
                      </div>

                      {featuredEntry.isDeveloper !== undefined && (
                        <div
                          className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: 'rgb(64, 64, 64)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                          }}
                        >
                          {featuredEntry.isDeveloper ? (
                            <Github size={14} style={{ color: 'rgb(247, 247, 247)' }} />
                          ) : (
                            <Instagram size={14} style={{ color: 'rgb(247, 247, 247)' }} />
                          )}
                        </div>
                      )}
                    </div>

                    <div className="text-left">
                      <div className="font-medium" style={{ color: 'rgb(247, 247, 247)' }}>
                        {featuredEntry.name}
                      </div>
                      <div className="text-sm" style={{ color: 'rgb(128, 128, 128)' }}>
                        {formatDate(featuredEntry.timestamp)}
                      </div>
                    </div>

                    {featuredEntry.socialLink && (
                      <a
                        href={featuredEntry.socialLink}
                        className="p-2 rounded-lg transition-colors"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                        onMouseEnter={e => {
                          e.currentTarget.style.backgroundColor = 'rgba(1, 132, 252, 0.2)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ArrowUpRight size={16} style={{ color: 'rgb(1, 244, 252)' }} />
                      </a>
                    )}
                  </div>

                  {/* Indicadores de navegação */}
                  {entries.length > 1 && (
                    <div className="flex justify-center gap-2 mt-8">
                      {entries.map((_, index) => (
                        <button
                          key={index}
                          className="w-2 h-2 rounded-full transition-colors"
                          style={{
                            backgroundColor:
                              index === featuredIndex ? 'rgb(1, 244, 252)' : 'rgb(128, 128, 128)',
                          }}
                          onClick={() => setFeaturedIndex(index)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Formulário */}
        <div
          className="max-w-2xl mx-auto rounded-2xl overflow-hidden backdrop-blur-xl opacity-0 animate-[fadeIn_0.8s_ease-out_0.4s_forwards]"
          style={{
            backgroundColor: 'rgba(24, 24, 24, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          <div className="p-8">
            <h3 className="text-xl font-semibold mb-6" style={{ color: 'rgb(247, 247, 247)' }}>
              Adicionar uma mensagem
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Seleção de tipo de usuário */}
              <div>
                <label
                  className="block text-sm font-medium mb-3"
                  style={{ color: 'rgb(247, 247, 247)' }}
                >
                  Você é:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all"
                    style={{
                      backgroundColor:
                        isDeveloper === true ? 'rgb(1, 132, 252)' : 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${isDeveloper === true ? 'rgb(1, 132, 252)' : 'rgba(255, 255, 255, 0.15)'}`,
                      color: 'rgb(247, 247, 247)',
                    }}
                    onMouseEnter={e => {
                      if (isDeveloper !== true) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (isDeveloper !== true) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                      }
                    }}
                    onClick={() => setIsDeveloper(true)}
                  >
                    <Code size={16} />
                    Desenvolvedor
                  </button>

                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all"
                    style={{
                      backgroundColor:
                        isDeveloper === false ? 'rgb(1, 132, 252)' : 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${isDeveloper === false ? 'rgb(1, 132, 252)' : 'rgba(255, 255, 255, 0.15)'}`,
                      color: 'rgb(247, 247, 247)',
                    }}
                    onMouseEnter={e => {
                      if (isDeveloper !== false) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (isDeveloper !== false) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                      }
                    }}
                    onClick={() => setIsDeveloper(false)}
                  >
                    <User size={16} />
                    Não-Dev
                  </button>
                </div>
              </div>

              {/* Campos de entrada */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: 'rgb(247, 247, 247)' }}
                  >
                    Seu nome
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: 'rgb(247, 247, 247)',
                    }}
                    placeholder="Como devemos te chamar?"
                    maxLength={50}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: 'rgb(247, 247, 247)' }}
                  >
                    {isDeveloper === true
                      ? 'GitHub'
                      : isDeveloper === false
                        ? 'Instagram'
                        : 'Link Social'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                      {isDeveloper === true ? (
                        <Github size={16} style={{ color: 'rgb(128, 128, 128)' }} />
                      ) : isDeveloper === false ? (
                        <Instagram size={16} style={{ color: 'rgb(128, 128, 128)' }} />
                      ) : (
                        <LinkIcon size={16} style={{ color: 'rgb(128, 128, 128)' }} />
                      )}
                    </div>
                    <input
                      type="text"
                      value={socialLink}
                      onChange={e => setSocialLink(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all disabled:opacity-50"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: 'rgb(247, 247, 247)',
                      }}
                      placeholder="username"
                      disabled={isDeveloper === null}
                      maxLength={50}
                    />
                  </div>
                </div>
              </div>

              {/* Mensagem */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    className="block text-sm font-medium"
                    style={{ color: 'rgb(247, 247, 247)' }}
                  >
                    Sua mensagem
                  </label>
                  <div className="flex items-center gap-2">
                    {selectedEmoji && <span className="text-lg">{selectedEmoji}</span>}
                    <div className="relative" ref={emojiPickerRef}>
                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-2 rounded-lg transition-colors"
                        style={{ color: 'rgb(247, 247, 247)' }}
                        onMouseEnter={e => {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <SmilePlus size={16} />
                      </button>

                      {/* Emoji picker */}
                      {showEmojiPicker && (
                        <div
                          className="absolute right-0 top-full mt-2 z-50 rounded-lg p-4 shadow-xl opacity-0 animate-[fadeIn_0.2s_ease-out_forwards]"
                          style={{
                            backgroundColor: 'rgb(64, 64, 64)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                          }}
                        >
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm" style={{ color: 'rgb(247, 247, 247)' }}>
                              Escolha um emoji
                            </span>
                            <button
                              type="button"
                              onClick={() => setShowEmojiPicker(false)}
                              className="transition-colors"
                              style={{ color: 'rgb(128, 128, 128)' }}
                              onMouseEnter={e => {
                                e.currentTarget.style.color = 'rgb(247, 247, 247)';
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.color = 'rgb(128, 128, 128)';
                              }}
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <div className="grid grid-cols-7 gap-2 max-w-[280px]">
                            {popularEmojis.map(emoji => (
                              <button
                                key={emoji}
                                type="button"
                                onClick={() => {
                                  setSelectedEmoji(emoji);
                                  setShowEmojiPicker(false);
                                }}
                                className="w-8 h-8 flex items-center justify-center rounded transition-colors"
                                onMouseEnter={e => {
                                  e.currentTarget.style.backgroundColor =
                                    'rgba(255, 255, 255, 0.1)';
                                }}
                                onMouseLeave={e => {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                              >
                                <span className="text-lg">{emoji}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <textarea
                  rows={4}
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 resize-none transition-all"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: 'rgb(247, 247, 247)',
                  }}
                  placeholder="Compartilhe seus pensamentos ou feedback..."
                  maxLength={500}
                />
              </div>

              {/* Botão de envio */}
              <button
                type="button"
                onClick={handleSubmit}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Enviar
              </button>
              {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
              {isSubmitting && (
                <div className="text-blue-500 text-sm mt-2">Enviando sua mensagem...</div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GuestBook;

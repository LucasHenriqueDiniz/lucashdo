'use client';

import React, { useState, useEffect } from 'react';
import { Github, User, Send } from 'lucide-react';
import Image from 'next/image';

// Types simplificados
interface GuestBookEntry {
  id: string;
  name: string;
  message: string;
  timestamp: string;
  avatar?: string;
  githubUsername?: string;
  isDeveloper: boolean;
}

// Mock data simples
const mockEntries: GuestBookEntry[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    message: 'Amazing portfolio! Your design skills are impressive.',
    timestamp: '2025-06-10T14:23:00Z',
    avatar: 'https://github.com/github.png',
    githubUsername: 'sarahjohnson',
    isDeveloper: true,
  },
  {
    id: '2',
    name: 'David Chen',
    message: 'The interactive elements on your site are so engaging!',
    timestamp: '2025-06-09T08:15:00Z',
    githubUsername: 'davidchen',
    isDeveloper: true,
  },
];

const GuestBook = () => {
  const [entries, setEntries] = useState<GuestBookEntry[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [isDeveloper, setIsDeveloper] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carregar entradas
  useEffect(() => {
    setEntries(mockEntries);
  }, []);

  // Função para formatar data
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // Submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !message.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Criar nova entrada
      const newEntry: GuestBookEntry = {
        id: Date.now().toString(),
        name: name.trim(),
        message: message.trim(),
        timestamp: new Date().toISOString(),
        githubUsername: githubUsername.trim() || undefined,
        avatar: githubUsername.trim()
          ? `https://github.com/${githubUsername.trim()}.png`
          : undefined,
        isDeveloper,
      };

      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 500));

      setEntries(prev => [newEntry, ...prev]);

      // Reset form
      setName('');
      setMessage('');
      setGithubUsername('');
      setIsDeveloper(true);
    } catch (error) {
      console.error('Erro ao enviar:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full py-20 bg-zinc-950 min-h-screen">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-zinc-100">
            <span className="block text-lg font-normal mb-2 text-zinc-400">Deixe seu recado</span>
            Livro de <span className="text-cyan-400">Visitas</span>
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Deixe uma mensagem, feedback ou apenas um olá! Adoraria saber que você esteve aqui.
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-zinc-900 rounded-xl p-8 mb-12 border border-zinc-800">
          <h3 className="text-xl font-semibold mb-6 text-zinc-100">Adicionar mensagem</h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tipo de usuário */}
            <div>
              <label className="block text-sm font-medium mb-3 text-zinc-100">Você é:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsDeveloper(true)}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                    isDeveloper
                      ? 'bg-cyan-600 text-white'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  <Github size={16} />
                  Desenvolvedor
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeveloper(false)}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                    !isDeveloper
                      ? 'bg-cyan-600 text-white'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  <User size={16} />
                  Visitante
                </button>
              </div>
            </div>

            {/* Campos */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-100">Seu nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Como devemos te chamar?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-100">
                  GitHub (opcional)
                </label>
                <input
                  type="text"
                  value={githubUsername}
                  onChange={e => setGithubUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="seu-username"
                />
              </div>
            </div>

            {/* Mensagem */}
            <div>
              <label className="block text-sm font-medium mb-2 text-zinc-100">Sua mensagem</label>
              <textarea
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
                placeholder="Compartilhe seus pensamentos..."
                required
              />
            </div>

            {/* Botão */}
            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !message.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} />
              {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
            </button>
          </form>
        </div>

        {/* Lista de mensagens */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-zinc-100">Mensagens ({entries.length})</h3>

          {entries.map(entry => (
            <div key={entry.id} className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {entry.avatar ? (
                    <Image
                      src={entry.avatar}
                      alt={entry.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                      {entry.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Conteúdo */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-zinc-100">{entry.name}</h4>
                    {entry.isDeveloper && <Github size={14} className="text-zinc-400" />}
                    <span className="text-sm text-zinc-500">{formatDate(entry.timestamp)}</span>
                  </div>
                  <p className="text-zinc-300 leading-relaxed">{entry.message}</p>
                  {entry.githubUsername && (
                    <a
                      href={`https://github.com/${entry.githubUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      @{entry.githubUsername}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}

          {entries.length === 0 && (
            <div className="text-center py-12 text-zinc-500">
              Seja o primeiro a deixar uma mensagem!
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GuestBook;

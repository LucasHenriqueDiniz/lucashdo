'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { LuTerminal, LuX, LuMinus, LuMaximize2 } from 'react-icons/lu';

interface Command {
  input: string;
  output: string | JSX.Element;
  timestamp: Date;
}

const commands = {
  help: `Comandos disponíveis:
    whoami      - Informações pessoais
    skills      - Lista de habilidades
    projects    - Projetos destacados
    contact     - Informações de contato
    clear       - Limpar terminal
    history     - Histórico de comandos
    exit        - Fechar terminal`,

  whoami: `Lucas Diniz Ostroski
    Desenvolvedor Full-stack
    Estudante de Engenharia da Computação
    Localização: Brasil
    Status: Disponível para projetos`,

  skills: `Tecnologias principais:
    Frontend: React, Next.js, TypeScript, Tailwind CSS
    Backend: Node.js, Python, Express.js
    Database: PostgreSQL, MongoDB, Prisma
    DevOps: Docker, Git, GitHub Actions
    Design: Figma, Adobe Creative Suite`,

  projects: `Projetos destacados:
    • Portfolio Website - Next.js + TypeScript
    • E-commerce Platform - React + Node.js
    • Task Management App - MERN Stack
    • Chrome Extensions - JavaScript APIs
    
    Ver todos: https://lucasHDO.dev/projects`,

  contact: `Entre em contato:
    📧 Email: contato@lucasHDO.dev
    💼 LinkedIn: /in/lucas-diniz-ostroski
    🐱 GitHub: /LucasHenriqueDiniz
    📱 WhatsApp: Disponível via site`,

  history: 'Histórico será exibido aqui...',

  clear: '',

  exit: 'Terminal fechado. Obrigado! 👋',
};

export default function InteractiveTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Command[]>([
    {
      input: 'welcome',
      output: `Bem-vindo ao terminal de Lucas HDO! 
Digite 'help' para ver os comandos disponíveis.`,
      timestamp: new Date(),
    },
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  const processCommand = (cmd: string) => {
    const command = cmd.toLowerCase().trim();
    let output: string | JSX.Element = `Comando não encontrado: ${cmd}. Digite 'help' para ajuda.`;

    if (command in commands) {
      if (command === 'clear') {
        setHistory([]);
        return;
      }
      if (command === 'exit') {
        setIsOpen(false);
        return;
      }
      if (command === 'history') {
        output =
          commandHistory.length > 0
            ? commandHistory.map((cmd, i) => `${i + 1}. ${cmd}`).join('\n')
            : 'Nenhum comando no histórico.';
      } else {
        output = commands[command as keyof typeof commands];
      }
    }

    const newCommand: Command = {
      input: cmd,
      output,
      timestamp: new Date(),
    };

    setHistory(prev => [...prev, newCommand]);
    setCommandHistory(prev => [...prev, cmd]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      processCommand(input.trim());
      setInput('');
      setHistoryIndex(-1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <>
      {/* Floating Terminal Button */}
      <motion.button
        className="fixed bottom-20 right-8 p-3 bg-black text-green-400 rounded-full shadow-lg z-30 hover:bg-gray-900 transition-colors"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }}
      >
        <LuTerminal size={20} />
      </motion.button>

      {/* Terminal Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`fixed z-50 bg-black text-green-400 rounded-lg shadow-2xl border border-gray-700 font-mono text-sm ${
              isMinimized
                ? 'bottom-4 right-4 w-64 h-8'
                : 'bottom-4 right-4 w-96 h-96 md:w-[500px] md:h-[400px]'
            }`}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            {/* Terminal Header */}
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-t-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-gray-300 text-xs">lucas@portfolio:~</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-gray-700 rounded text-gray-400"
                >
                  {isMinimized ? <LuMaximize2 size={12} /> : <LuMinus size={12} />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-700 rounded text-gray-400"
                >
                  <LuX size={12} />
                </button>
              </div>
            </div>

            {/* Terminal Content */}
            {!isMinimized && (
              <div className="h-full flex flex-col">
                {/* Command History */}
                <div ref={terminalRef} className="flex-1 p-4 overflow-y-auto space-y-2">
                  {history.map((cmd, index) => (
                    <div key={index} className="space-y-1">
                      {cmd.input !== 'welcome' && (
                        <div className="flex items-center gap-2">
                          <span className="text-blue-400">$</span>
                          <span className="text-white">{cmd.input}</span>
                        </div>
                      )}
                      <div className="text-green-300 whitespace-pre-line pl-4">{cmd.output}</div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="border-t border-gray-700 p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400">$</span>
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1 bg-transparent text-white outline-none"
                      placeholder="Digite um comando..."
                    />
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

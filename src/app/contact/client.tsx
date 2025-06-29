'use client';

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState, memo, useCallback } from 'react';
import { FaDiscord, FaSteam } from 'react-icons/fa';
import {
  LuArrowRight,
  LuGithub,
  LuGlobe,
  LuLinkedin,
  LuMail,
  LuMapPin,
  LuSend,
  LuUser,
} from 'react-icons/lu';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ContactLinks } from '@/constants/contacts';

// Map of contact icons
const contactIcons = {
  email: <LuMail className="text-2xl" />,
  github: <LuGithub className="text-2xl" />,
  linkedin: <LuLinkedin className="text-2xl" />,
  website: <LuGlobe className="text-2xl" />,
  discord: <FaDiscord className="text-2xl" />,
  steam: <FaSteam className="text-2xl" />,
};

// Contact card info with custom colors and descriptions
const contactCards = [
  {
    type: 'linkedin' as const,
    title: 'LinkedIn',
    description: 'Conecte-se comigo para oportunidades profissionais e networking',
    colors: {
      primary: 'from-blue-600/25 via-blue-500/20 to-blue-400/25 border-blue-400/50',
      ring: 'ring-blue-500/60 dark:ring-blue-400/60',
      text: 'text-blue-600 dark:text-blue-400',
      hover: 'group-hover:bg-blue-500',
      accent: 'bg-blue-500',
      glow: '0 0 40px rgba(59, 130, 246, 0.3)',
    },
    action: 'Conectar',
    icon: contactIcons.linkedin,
  },
  {
    type: 'github' as const,
    title: 'GitHub',
    description: 'Explore meus projetos e contribuições open-source',
    colors: {
      primary: 'from-gray-600/25 via-gray-500/20 to-gray-400/25 border-gray-400/50',
      ring: 'ring-gray-500/60 dark:ring-gray-400/60',
      text: 'text-gray-700 dark:text-gray-300',
      hover: 'group-hover:bg-gray-700',
      accent: 'bg-gray-700',
      glow: '0 0 40px rgba(75, 85, 99, 0.3)',
    },
    action: 'Ver Código',
    icon: contactIcons.github,
  },
  {
    type: 'email' as const,
    title: 'Email',
    description: 'Envie-me uma mensagem diretamente para o meu email',
    colors: {
      primary: 'from-amber-500/25 via-orange-400/20 to-amber-300/25 border-amber-400/50',
      ring: 'ring-amber-500/60 dark:ring-amber-400/60',
      text: 'text-amber-600 dark:text-amber-400',
      hover: 'group-hover:bg-amber-500',
      accent: 'bg-amber-500',
      glow: '0 0 40px rgba(245, 158, 11, 0.3)',
    },
    action: 'Enviar Email',
    icon: contactIcons.email,
  },
  {
    type: 'discord' as const,
    title: 'Discord',
    description: 'Converse comigo em tempo real pelo Discord',
    colors: {
      primary: 'from-indigo-600/25 via-purple-500/20 to-indigo-400/25 border-indigo-400/50',
      ring: 'ring-indigo-500/60 dark:ring-indigo-400/60',
      text: 'text-indigo-600 dark:text-indigo-400',
      hover: 'group-hover:bg-indigo-500',
      accent: 'bg-indigo-500',
      glow: '0 0 40px rgba(99, 102, 241, 0.3)',
    },
    action: 'Adicionar',
    icon: contactIcons.discord,
  },
  {
    type: 'steam' as const,
    title: 'Steam',
    description: 'Veja meus jogos e me adicione na Steam',
    colors: {
      primary: 'from-cyan-600/25 via-blue-500/20 to-cyan-400/25 border-cyan-400/50',
      ring: 'ring-cyan-500/60 dark:ring-cyan-400/60',
      text: 'text-cyan-600 dark:text-cyan-400',
      hover: 'group-hover:bg-cyan-500',
      accent: 'bg-cyan-500',
      glow: '0 0 40px rgba(14, 165, 233, 0.3)',
    },
    action: 'Jogar',
    icon: contactIcons.steam,
  },
  {
    type: 'website' as const,
    title: 'Website',
    description: 'Visite meu site para conhecer mais sobre meu trabalho',
    colors: {
      primary: 'from-emerald-600/25 via-teal-500/20 to-emerald-400/25 border-emerald-400/50',
      ring: 'ring-emerald-500/60 dark:ring-emerald-400/60',
      text: 'text-emerald-600 dark:text-emerald-400',
      hover: 'group-hover:bg-emerald-500',
      accent: 'bg-emerald-500',
      glow: '0 0 40px rgba(16, 185, 129, 0.3)',
    },
    action: 'Visitar',
    icon: contactIcons.website,
  },
];

// Simplified Contact Card Component
const ContactCard = memo(({ card, index }: { card: (typeof contactCards)[0]; index: number }) => {
  return (
    <motion.div
      className={`bg-gradient-to-br ${card.colors.primary} p-6 rounded-xl shadow-lg border dark:border-opacity-50 backdrop-blur-md relative overflow-hidden group`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.1 + index * 0.1,
        duration: 0.4,
        ease: 'easeOut',
      }}
      whileHover={{
        y: -5,
        scale: 1.02,
        transition: { duration: 0.2 },
      }}
    >
      <div className="flex gap-4 relative z-10">
        {/* Icon container */}
        <div
          className={`flex-shrink-0 w-14 h-14 bg-white/90 dark:bg-gray-800/70 backdrop-blur-md rounded-lg shadow-md flex items-center justify-center relative overflow-hidden ${card.colors.ring} group-hover:shadow-lg transition-all duration-300`}
        >
          <div className={`relative z-10 ${card.colors.text}`}>{card.icon}</div>
        </div>

        <div className="flex-grow">
          <h3
            className={`font-bold text-lg text-gray-800 dark:text-gray-100 group-hover:translate-y-[-1px] transition-all duration-300`}
          >
            {card.title}
            <div
              className={`h-0.5 w-0 group-hover:w-1/2 transition-all duration-300 mt-0.5 rounded-full ${card.colors.accent}`}
            ></div>
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
            {card.description}
          </p>

          <div className="mt-4">
            <Link
              href={
                card.type === 'email' ? `mailto:${ContactLinks.email}` : ContactLinks[card.type]
              }
              target={card.type !== 'email' ? '_blank' : undefined}
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 text-sm font-medium ${card.colors.text} hover:underline group/link`}
            >
              {card.action}
              <LuArrowRight className="group-hover/link:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

ContactCard.displayName = 'ContactCard';

// Simplified Form Component
const ContactForm = memo(() => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const formRef = useRef(null);
  const isFormInView = useInView(formRef, { once: true, amount: 0.3 });

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormState(prev => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFormStatus('success');
      setFormState({ name: '', email: '', message: '' });

      setTimeout(() => {
        setFormStatus('idle');
      }, 3000);
    } catch (err) {
      console.error(err);
      setFormStatus('error');
      setTimeout(() => {
        setFormStatus('idle');
      }, 3000);
    }
  }, []);

  return (
    <motion.div
      id="contact-form"
      ref={formRef}
      className="max-w-3xl mx-auto pt-8 scroll-mt-24"
      initial={{ opacity: 0, y: 20 }}
      animate={isFormInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[color:var(--primary)] via-[color:var(--blue)] to-[color:var(--primary)] bg-clip-text text-transparent">
          Vamos Conversar
        </h2>
        <div className="h-1 w-16 bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--blue)] mx-auto rounded-full mb-4" />
        <p className="text-gray-600 dark:text-gray-300">
          Quer começar um novo projeto? Tem alguma ideia inovadora? Vamos trabalhar juntos!
        </p>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        className="relative bg-white/95 dark:bg-gray-800/90 backdrop-blur-md rounded-xl p-8 shadow-lg border border-gray-100/50 dark:border-gray-700/50"
        initial={{ opacity: 0, y: 20 }}
        animate={isFormInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="grid grid-cols-1 gap-6">
          <div className="relative">
            <label
              htmlFor="name"
              className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                focusedField === 'name'
                  ? 'text-[color:var(--primary)]'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <LuUser className="w-4 h-4" />
                Nome
              </span>
            </label>
            <Input
              id="name"
              name="name"
              placeholder="Seu nome"
              value={formState.name}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              required
              className={`transition-all duration-300 border-gray-300 dark:border-gray-600 ${
                focusedField === 'name'
                  ? 'ring-2 ring-[color:var(--primary)]/30 border-transparent'
                  : ''
              }`}
            />
          </div>

          <div className="relative">
            <label
              htmlFor="email"
              className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                focusedField === 'email'
                  ? 'text-[color:var(--primary)]'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <LuMail className="w-4 h-4" />
                Email
              </span>
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              value={formState.email}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              required
              className={`transition-all duration-300 border-gray-300 dark:border-gray-600 ${
                focusedField === 'email'
                  ? 'ring-2 ring-[color:var(--primary)]/30 border-transparent'
                  : ''
              }`}
            />
          </div>

          <div className="relative">
            <label
              htmlFor="message"
              className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                focusedField === 'message'
                  ? 'text-[color:var(--primary)]'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <span className="flex items-center gap-2">
                <LuSend className="w-4 h-4" />
                Mensagem
              </span>
            </label>
            <Textarea
              id="message"
              name="message"
              placeholder="Em que posso ajudar? Conte-me sobre seu projeto..."
              value={formState.message}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('message')}
              onBlur={() => setFocusedField(null)}
              required
              className={`min-h-32 transition-all duration-300 border-gray-300 dark:border-gray-600 ${
                focusedField === 'message'
                  ? 'ring-2 ring-[color:var(--primary)]/30 border-transparent'
                  : ''
              }`}
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400 dark:text-gray-500">
              {formState.message.length > 0 && <span>{formState.message.length} caracteres</span>}
            </div>
          </div>

          <Button
            type="submit"
            disabled={formStatus === 'submitting'}
            className={`w-full py-4 text-base relative overflow-hidden bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--blue)] hover:from-[color:var(--blue)] hover:to-[color:var(--primary)] transition-colors duration-500 ${
              formStatus === 'submitting' ? 'opacity-90' : ''
            }`}
          >
            {formStatus === 'submitting' ? (
              <span className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Enviando...
              </span>
            ) : formStatus === 'success' ? (
              <span className="flex items-center justify-center">
                <CheckCircle className="mr-2" />
                Mensagem Enviada!
              </span>
            ) : formStatus === 'error' ? (
              <span className="flex items-center justify-center">
                <AlertCircle className="mr-2" />
                Erro! Tente novamente.
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <LuSend className="mr-2" />
                Enviar Mensagem
              </span>
            )}
          </Button>
        </div>
      </motion.form>

      <div className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
        <p>
          Você também pode me enviar um email direto para{' '}
          <a
            href={`mailto:${ContactLinks.email}`}
            className="text-[color:var(--primary)] hover:underline"
          >
            {ContactLinks.email}
          </a>
        </p>
      </div>
    </motion.div>
  );
});

ContactForm.displayName = 'ContactForm';

export default function ContactClient() {
  return (
    <>
      {/* Simplified Contact Header */}
      <div className="relative my-16">
        <div className="text-center z-10 relative">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[color:var(--primary)] via-[color:var(--blue)] to-[color:var(--primary)] bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Entre em Contato
          </motion.h1>

          <motion.div
            className="h-1 w-20 bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--blue)] mx-auto rounded-full mb-6"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 80, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          />

          <motion.p
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Estou sempre aberto a novas oportunidades, colaborações e projetos inovadores. Escolha
            um canal de contato abaixo ou utilize o formulário para iniciarmos uma conversa.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-24">
        {/* Profile Information */}
        <motion.div
          className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-md rounded-xl p-6 mb-12 shadow-lg border border-gray-100/40 dark:border-gray-700/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden shadow-md">
                <Image
                  src="https://images.unsplash.com/photo-1529421308418-eab98863cee4?q=80&w=1976&auto=format&fit=crop"
                  alt="Lucas HDO"
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Lucas HDO</h2>
              <div className="flex items-center justify-center md:justify-start mb-4 text-gray-500 dark:text-gray-400">
                <LuMapPin className="mr-2" />
                <span>São Paulo, Brasil</span>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-xl">
                Desenvolvedor Full-stack apaixonado por criar experiências digitais impactantes.
                Especializado em React, Next.js e Node.js, com experiência em design de interfaces e
                desenvolvimento de aplicações web modernas.
              </p>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full text-sm">
                  <LuUser className="mr-2 text-[color:var(--primary)]" />
                  <span>Engenharia de Computação</span>
                </div>
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full text-sm">
                  <LuMapPin className="mr-2 text-[color:var(--primary)]" />
                  <span>Disponível para trabalho remoto</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Cards */}
        <div className="mb-16">
          <motion.h2
            className="text-2xl font-bold text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Como me encontrar
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {contactCards.map((card, index) => (
              <ContactCard key={card.type} card={card} index={index} />
            ))}
          </motion.div>
        </div>

        {/* Contact Form Section */}
        <ContactForm />
      </div>
    </>
  );
}

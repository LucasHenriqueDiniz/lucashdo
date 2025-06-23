'use client';

import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
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
import { GradientCardWithPattern } from '@/components/ui/GradientCard';
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

export default function ContactClient() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const formRef = useRef(null);
  const isFormInView = useInView(formRef, { once: true, amount: 0.3 });

  // Adicionando estados para controlar os efeitos de hover dos inputs
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');

    // Simulating form submission (you would replace this with actual API call)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setFormStatus('success');
      setFormState({ name: '', email: '', message: '' });

      // Reset form after a few seconds
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
  };

  return (
    <>
      {/* Simplified Contact Header */}
      <div className="relative my-24">
        <div className="text-center z-10 relative">
          <motion.h1
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[color:var(--primary)] via-[color:var(--blue)] to-[color:var(--primary)] bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Entre em Contato
          </motion.h1>

          <motion.div
            className="h-1 w-24 bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--blue)] mx-auto rounded-full mb-8"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 96, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          />

          <motion.p
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Estou sempre aberto a novas oportunidades, colaborações e projetos inovadores. Escolha
            um canal de contato abaixo ou utilize o formulário para iniciarmos uma conversa.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-8"
          >
            <a
              href="#contact-form"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--blue)] text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            >
              Vamos trabalhar juntos
              <svg
                className="w-5 h-5 group-hover:translate-y-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </a>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-24">
        {/* Profile Information */}
        <motion.div
          className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 mb-16 shadow-lg border border-gray-100/40 dark:border-gray-700/30"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="relative">
              <div className="w-36 h-36 md:w-48 md:h-48 rounded-2xl overflow-hidden shadow-md">
                <Image
                  src="https://images.unsplash.com/photo-1529421308418-eab98863cee4?q=80&w=1976&auto=format&fit=crop"
                  alt="Lucas HDO"
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>
              <motion.div
                className="absolute inset-0 rounded-2xl border-4 border-white/30 dark:border-gray-700/30 pointer-events-none"
                animate={{
                  boxShadow: [
                    '0 0 0 rgba(59, 130, 246, 0)',
                    '0 0 15px rgba(59, 130, 246, 0.3)',
                    '0 0 0 rgba(59, 130, 246, 0)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>

            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">Lucas HDO</h2>
              <div className="flex items-center justify-center md:justify-start mb-5 text-gray-500 dark:text-gray-400">
                <LuMapPin className="mr-2" />
                <span>São Paulo, Brasil</span>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-xl">
                Desenvolvedor Full-stack apaixonado por criar experiências digitais impactantes.
                Especializado em React, Next.js e Node.js, com experiência em design de interfaces e
                desenvolvimento de aplicações web modernas.
              </p>

              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
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
        <div className="mb-24">
          <motion.h2
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Como me encontrar
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            {contactCards.map((card, index) => (
              <GradientCardWithPattern
                key={card.type}
                gradientClasses={card.colors.primary}
                glowColor={card.colors.glow}
                patternFill={card.colors.text.replace('text-', '')}
                delay={0.6}
                index={index}
              >
                <div className="flex gap-5 relative z-10">
                  {/* Icon container */}
                  <div
                    className={`flex-shrink-0 w-16 h-16 bg-white/90 dark:bg-gray-800/70 backdrop-blur-md rounded-xl shadow-lg flex items-center justify-center relative overflow-hidden ${card.colors.ring} group-hover:shadow-md transition-all duration-300`}
                  >
                    {/* Enhanced inner glow */}
                    <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-white/60 via-transparent to-white/30 group-hover:opacity-50 transition-opacity"></div>

                    {/* Pulse effect on hover */}
                    <div
                      className={`absolute inset-[-1px] rounded-xl scale-0 group-hover:scale-110 opacity-0 group-hover:opacity-40 transition-all duration-700 ${card.colors.accent}`}
                    ></div>

                    <motion.div
                      animate={{ scale: [1, 1.15, 1], rotate: [0, 3, 0] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut',
                      }}
                      className={`relative z-10 ${card.colors.text}`}
                    >
                      {card.icon}
                    </motion.div>
                  </div>

                  <div className="flex-grow">
                    <motion.h3
                      className={`font-bold text-xl text-gray-800 dark:text-gray-100 group-hover:translate-y-[-2px] transition-all duration-300`}
                    >
                      {card.title}

                      {/* Underline effect on hover */}
                      <div
                        className={`h-0.5 w-0 group-hover:w-1/2 transition-all duration-300 mt-0.5 rounded-full ${card.colors.accent}`}
                      ></div>
                    </motion.h3>

                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 leading-relaxed tracking-wide">
                      {card.description}
                    </p>

                    <div className="mt-5">
                      <Link
                        href={
                          card.type === 'email'
                            ? `mailto:${ContactLinks.email}`
                            : ContactLinks[card.type]
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
              </GradientCardWithPattern>
            ))}
          </motion.div>
        </div>

        {/* Contact Form Section */}
        <motion.div
          id="contact-form"
          ref={formRef}
          className="max-w-3xl mx-auto pt-8 scroll-mt-24"
          initial={{ opacity: 0, y: 40 }}
          animate={isFormInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="text-center mb-10">
            <motion.h2
              className="text-5xl font-bold mb-4 bg-gradient-to-r from-[color:var(--primary)] via-[color:var(--blue)] to-[color:var(--primary)] bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={isFormInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Vamos Conversar
            </motion.h2>
            <motion.div
              className="h-1 w-20 bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--blue)] mx-auto rounded-full mb-5"
              initial={{ width: 0, opacity: 0 }}
              animate={isFormInView ? { width: 80, opacity: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
            <motion.p
              className="text-gray-600 dark:text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={isFormInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Quer começar um novo projeto? Tem alguma ideia inovadora? Vamos trabalhar juntos!
            </motion.p>
          </div>

          <motion.div
            className="relative mb-6 group"
            whileHover={{ scale: 1.01 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 20,
            }}
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-[color:var(--primary)] via-[color:var(--blue)] to-[color:var(--primary)] rounded-2xl blur-lg opacity-30 group-hover:opacity-40 transition duration-1000 animate-pulse"></div>
            <motion.div
              className="absolute -inset-2 bg-gradient-to-r from-[color:var(--blue)] via-[color:var(--primary)] to-[color:var(--blue)] rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition duration-1000"
              animate={{
                scale: [1, 1.02, 1],
                opacity: [0, 0.2, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: 'loop',
                ease: 'easeInOut',
              }}
            ></motion.div>
            <motion.form
              onSubmit={handleSubmit}
              className="relative bg-white/95 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl p-8 md:p-10 shadow-lg border border-gray-100/50 dark:border-gray-700/50"
              initial={{ opacity: 0, y: 30 }}
              animate={isFormInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {/* Subtle pattern background */}
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay rounded-2xl"></div>

              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-14 h-14 rounded-full bg-[color:var(--primary)]/5 dark:bg-[color:var(--primary)]/10"></div>
              <div className="absolute bottom-4 left-4 w-20 h-20 rounded-full bg-[color:var(--blue)]/5 dark:bg-[color:var(--blue)]/10"></div>

              <div className="grid grid-cols-1 gap-6 relative z-10">
                <div className="relative">
                  <label
                    htmlFor="name"
                    className={`block text-sm font-medium mb-1.5 transition-colors duration-200 ${
                      focusedField === 'name'
                        ? 'text-[color:var(--primary)] dark:text-[color:var(--primary)]'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        ></path>
                      </svg>
                      Nome
                    </span>
                  </label>
                  <div
                    className={`relative ${focusedField === 'name' ? 'scale-[1.01]' : ''} transition-all duration-200`}
                  >
                    <Input
                      id="name"
                      name="name"
                      placeholder="Seu nome"
                      value={formState.name}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className={`dark:bg-gray-800/50 transition-all duration-300 border-gray-300 dark:border-gray-600 ${
                        focusedField === 'name'
                          ? 'ring-2 ring-[color:var(--primary)]/30 border-transparent'
                          : ''
                      }`}
                    />
                    {focusedField === 'name' && (
                      <div className="absolute -inset-0.5 rounded-md bg-[color:var(--primary)]/10 -z-10 animate-pulse"></div>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <label
                    htmlFor="email"
                    className={`block text-sm font-medium mb-1.5 transition-colors duration-200 ${
                      focusedField === 'email'
                        ? 'text-[color:var(--primary)] dark:text-[color:var(--primary)]'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        ></path>
                      </svg>
                      Email
                    </span>
                  </label>
                  <div
                    className={`relative ${focusedField === 'email' ? 'scale-[1.01]' : ''} transition-all duration-200`}
                  >
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
                      className={`dark:bg-gray-800/50 transition-all duration-300 border-gray-300 dark:border-gray-600 ${
                        focusedField === 'email'
                          ? 'ring-2 ring-[color:var(--primary)]/30 border-transparent'
                          : ''
                      }`}
                    />
                    {focusedField === 'email' && (
                      <div className="absolute -inset-0.5 rounded-md bg-[color:var(--primary)]/10 -z-10 animate-pulse"></div>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <label
                    htmlFor="message"
                    className={`block text-sm font-medium mb-1.5 transition-colors duration-200 ${
                      focusedField === 'message'
                        ? 'text-[color:var(--primary)] dark:text-[color:var(--primary)]'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        ></path>
                      </svg>
                      Mensagem
                    </span>
                  </label>
                  <div
                    className={`relative ${focusedField === 'message' ? 'scale-[1.005]' : ''} transition-all duration-200`}
                  >
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Em que posso ajudar? Conte-me sobre seu projeto..."
                      value={formState.message}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className={`min-h-32 dark:bg-gray-800/50 transition-all duration-300 border-gray-300 dark:border-gray-600 ${
                        focusedField === 'message'
                          ? 'ring-2 ring-[color:var(--primary)]/30 border-transparent'
                          : ''
                      }`}
                    />
                    {focusedField === 'message' && (
                      <div className="absolute -inset-0.5 rounded-md bg-[color:var(--primary)]/10 -z-10 animate-pulse"></div>
                    )}
                  </div>

                  <div className="absolute bottom-3 right-3 text-xs text-gray-400 dark:text-gray-500">
                    {formState.message.length > 0 && (
                      <span>{formState.message.length} caracteres</span>
                    )}
                  </div>
                </div>

                <motion.div
                  className="relative mt-2"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-[color:var(--primary)]/50 to-[color:var(--blue)]/50 rounded-lg blur opacity-30 group-hover:opacity-60 transition duration-1000 animate-pulse"></div>
                  <Button
                    type="submit"
                    disabled={formStatus === 'submitting'}
                    className={`w-full py-6 text-base relative overflow-hidden group bg-gradient-to-r from-[color:var(--primary)] to-[color:var(--blue)] hover:from-[color:var(--blue)] hover:to-[color:var(--primary)] transition-colors duration-700 ${
                      formStatus === 'submitting' ? 'opacity-90' : ''
                    }`}
                  >
                    {/* Shine effect */}
                    <div
                      className="absolute inset-0 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent 
                      transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
                    ></div>

                    {/* Particle effects */}
                    <div className="absolute inset-0 w-full h-full overflow-hidden">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={`btn-particle-${i}`}
                          className="absolute w-1 h-1 bg-white rounded-full opacity-0"
                          initial={{
                            x: Math.random() * 100 + 50,
                            y: Math.random() * 40 + 10,
                            opacity: 0,
                          }}
                          animate={{
                            y: [null, -10 - Math.random() * 10],
                            opacity: [0, 0.4, 0],
                          }}
                          transition={{
                            duration: 1 + Math.random(),
                            repeat: Infinity,
                            repeatDelay: 3 + Math.random() * 3,
                          }}
                        />
                      ))}
                    </div>

                    {formStatus === 'submitting' ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Enviando...
                      </span>
                    ) : formStatus === 'success' ? (
                      <motion.span
                        className="flex items-center justify-center"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                      >
                        <CheckCircle className="mr-2" />
                        Mensagem Enviada!
                      </motion.span>
                    ) : formStatus === 'error' ? (
                      <motion.span
                        className="flex items-center justify-center"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                      >
                        <AlertCircle className="mr-2" />
                        Erro! Tente novamente.
                      </motion.span>
                    ) : (
                      <span className="flex items-center justify-center group-hover:scale-105 transition-transform relative z-10">
                        <LuSend className="mr-2 group-hover:translate-x-1 transition-all duration-300" />
                        Enviar Mensagem
                      </span>
                    )}
                  </Button>
                </motion.div>
              </div>
            </motion.form>
          </motion.div>

          <motion.div
            className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={isFormInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <p>
              Você também pode me enviar um email direto para{' '}
              <a
                href={`mailto:${ContactLinks.email}`}
                className="text-[color:var(--primary)] hover:underline"
              >
                {ContactLinks.email}
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}

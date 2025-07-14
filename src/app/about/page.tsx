import { Metadata } from 'next';
import { PersonStructuredData } from '@/components/SEO/StructuredData';
import { ContactLinks } from '@/constants/contacts';
import AboutClient from './client';

export const metadata: Metadata = {
  title: 'Sobre | Lucas Hdo - Desenvolvedor Full Stack',
  description:
    'Conheça mais sobre minha jornada como desenvolvedor Full Stack, habilidades técnicas, experiências profissionais e projetos realizados. Especialista em React, Next.js e TypeScript.',
  keywords: [
    'sobre lucas hdo',
    'desenvolvedor full stack',
    'experiência profissional',
    'habilidades técnicas',
    'react developer',
    'next.js developer',
    'typescript developer',
    'portfolio developer',
    'desenvolvimento web',
    'frontend developer',
    'backend developer',
    'brasil developer',
    'são paulo developer',
  ],
  openGraph: {
    title: 'Sobre | Lucas Hdo - Desenvolvedor Full Stack',
    description:
      'Conheça mais sobre minha jornada como desenvolvedor Full Stack, habilidades técnicas, experiências profissionais e projetos realizados.',
    url: 'https://lucashdo.com/about',
    siteName: 'Lucas Hdo - Portfolio',
    images: [
      {
        url: '/selfie.webp',
        width: 800,
        height: 600,
        alt: 'Lucas Hdo - Desenvolvedor Full Stack',
      },
    ],
    locale: 'pt_BR',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sobre | Lucas Hdo - Desenvolvedor Full Stack',
    description:
      'Conheça mais sobre minha jornada como desenvolvedor Full Stack, habilidades técnicas e experiências profissionais.',
    images: ['/selfie.webp'],
  },
  alternates: {
    canonical: 'https://lucashdo.com/about',
  },
};

export default function About() {
  return (
    <>
      <PersonStructuredData
        name="Lucas Hdo"
        jobTitle="Desenvolvedor Full Stack"
        description="Desenvolvedor Full Stack com experiência em React, Next.js, TypeScript e design criativo. Apaixonado por criar soluções web inovadoras e experiências digitais únicas."
        url="https://lucashdo.com"
        image="https://lucashdo.com/selfie.webp"
        sameAs={[ContactLinks.github, ContactLinks.linkedin, ContactLinks.steam]}
        knowsAbout={[
          'React',
          'Next.js',
          'TypeScript',
          'JavaScript',
          'Node.js',
          'Web Development',
          'Frontend Development',
          'Backend Development',
          'UI/UX Design',
          'Creative Coding',
          'Software Engineering',
          'Database Design',
          'API Development',
          'Performance Optimization',
        ]}
      />
      <AboutClient />
    </>
  );
}

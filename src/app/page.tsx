import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import ExpGraph from '@/components/home/ExpGraph';
import GuestBook from '@/components/home/GuestBook';
import Hero from '@/components/home/Hero';
import HeroBrowser from '@/components/home/HeroBrowser/HeroBrowser';
import Timeline from '@/components/home/Timeline/Timeline';
import ProjectsShowcase from '@/components/ProjectsShowcase/FeaturedProjects';
import {
  OrganizationStructuredData,
  PersonStructuredData,
  WebsiteStructuredData,
} from '@/components/SEO/StructuredData';
import { ContactLinks } from '@/constants/contacts';

export const metadata: Metadata = {
  title: 'Lucas Hdo - Desenvolvedor Full Stack & Designer',
  description:
    'Portfólio de Lucas Hdo - Desenvolvedor Full Stack especializado em React, Next.js, TypeScript e design criativo. Projetos inovadores e soluções web modernas.',
  keywords: [
    'desenvolvedor full stack',
    'react developer',
    'next.js',
    'typescript',
    'web development',
    'frontend developer',
    'backend developer',
    'portfolio',
    'lucas hdo',
    'brasil',
    'são paulo',
    'designer',
    'porto alegre',
    'porto alegre developer',
    'porto alegre designer',
    'porto alegre full stack',
    'porto alegre react',
    'porto alegre next.js',
    'porto alegre typescript',
    'porto alegre web development',
    'porto alegre frontend development',
    'porto alegre backend development',
    'porto alegre full stack development',
    'porto alegre react developer',
    'porto alegre next.js developer',
    'porto alegre typescript developer',
    'porto alegre web development developer',
    'porto alegre frontend development developer',
    'porto alegre backend development developer',
    'porto alegre full stack development developer',
    'programação web',
    'desenvolvimento web',
    'programação',
    'designer',
    'creative coding',
    'software engineering',
    'programador web',
    'programador frontend',
    'programador backend',
    'programador full stack',
    'programador react',
    'programador next.js',
    'programador typescript',
    'programador web development',
    'programador frontend development',
    'programador backend development',
    'programador full stack development',
    'programador react developer',
    'programador next.js developer',
    'programador typescript developer',
    'programador web development developer',
    'programador frontend development developer',
    'programador backend development developer',
  ],
  openGraph: {
    title: 'Lucas Hdo - Desenvolvedor Full Stack & Designer',
    description:
      'Portfólio de Lucas Hdo - Desenvolvedor Full Stack especializado em React, Next.js, TypeScript e design criativo. Projetos inovadores e soluções web modernas.',
    url: 'https://lucashdo.com',
    siteName: 'Lucas Hdo - Portfolio',
    images: [
      {
        url: '/logo.webp',
        width: 1200,
        height: 630,
        alt: 'Lucas Hdo - Desenvolvedor Full Stack & Designer',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lucas Hdo - Desenvolvedor Full Stack & Designer',
    description:
      'Portfólio de Lucas Hdo - Desenvolvedor Full Stack especializado em React, Next.js, TypeScript e design criativo.',
    images: ['/logo.webp'],
  },
  alternates: {
    canonical: 'https://lucashdo.com',
  },
  robots: {
    index: true,
    follow: true,
  },
  authors: [
    {
      name: 'Lucas Diniz <lucashdo@protonmail.com>',
      url: 'https://www.lucashdo.com',
    },
  ],
};

export default async function Home() {
  const t = await getTranslations('Home');
  return (
    <>
      <PersonStructuredData
        name="Lucas Hdo"
        jobTitle="Desenvolvedor Full Stack"
        description="Desenvolvedor Full Stack especializado em React, Next.js, TypeScript e design criativo. Criando soluções web inovadoras e experiências digitais únicas."
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
        ]}
      />
      <WebsiteStructuredData />
      <OrganizationStructuredData />

      <main className="min-h-screen w-full flex flex-col items-center mt-[--navbar-height] px-4">
        {/* HERO */}
        <Hero />

        {/* Desktop-only sections */}
        <div className="hidden md:flex flex-col items-center w-full">
          {/* Hero Browser */}
          <HeroBrowser />

          {/* EXPERIENCE GRAPH */}
          <ExpGraph />

          {/* TIMELINE */}
          <Timeline />

          {/* PROJECTS SHOWCASE */}
          <ProjectsShowcase />

          {/* GUESTBOOK */}
          <GuestBook />
        </div>

        {/* Mobile placeholder */}
        <div className="md:hidden w-full max-w-4xl mx-auto my-12 text-center text-muted-foreground">
          {t('mobilePlaceholder')}
        </div>
      </main>
    </>
  );
}

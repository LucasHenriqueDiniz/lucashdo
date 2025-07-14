import { Metadata } from 'next';
import MacBrowser from '@/components/home/HeroBrowser/HeroBrowser';
import ExpGraph from '@/components/home/ExpGraph';
import Hero from '@/components/home/Hero';
import Timeline from '@/components/home/Timeline/Timeline';
import ProjectsShowcase from '@/components/ProjectsShowcase/FeaturedProjects';
import ModernGuestBook from '@/components/home/ModernGuestBook';
import {
  PersonStructuredData,
  WebsiteStructuredData,
  OrganizationStructuredData,
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
    'desenvolvimento web',
    'programação',
    'designer',
    'creative coding',
    'software engineering',
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
};

export default function Home() {
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

      <main className="min-h-screen w-full flex flex-col items-center mt-[--navbar-height]">
        {/* HERO */}
        <Hero />
        {/* MAC BROWSER */}
        <MacBrowser />
        {/* EXPERIENCE GRAPH */}
        <ExpGraph />
        {/* TIMELINE */}
        <Timeline />
        {/* PROJECTS SHOWCASE */}
        <ProjectsShowcase />
        {/* GUESTBOOK */}
        <ModernGuestBook />
      </main>
    </>
  );
}

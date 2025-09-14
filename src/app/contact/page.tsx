import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const ContactClient = dynamic(() => import('./client'));

export const metadata: Metadata = {
  title: 'Contato | Lucas Hdo - Desenvolvedor Full Stack',
  description:
    'Entre em contato comigo para oportunidades de trabalho, colaborações em projetos, consultoria ou apenas para bater um papo sobre tecnologia e desenvolvimento.',
  keywords: [
    'contato lucas hdo',
    'desenvolvedor contato',
    'oportunidades trabalho',
    'freelance developer',
    'colaboração projetos',
    'consultoria desenvolvimento',
    'contratação desenvolvedor',
    'full stack developer',
    'react developer',
    'next.js developer',
    'typescript developer',
    'desenvolvimento web',
    'projetos web',
    'soluções digitais',
    'tecnologia',
  ],
  openGraph: {
    title: 'Contato | Lucas Hdo - Desenvolvedor Full Stack',
    description:
      'Entre em contato comigo para oportunidades de trabalho, colaborações em projetos, consultoria ou apenas para bater um papo sobre tecnologia.',
    url: 'https://lucashdo.com/contact',
    siteName: 'Lucas Hdo - Portfolio',
    images: [
      {
        url: '/logo.webp',
        width: 1200,
        height: 630,
        alt: 'Contato - Lucas Hdo Portfolio',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contato | Lucas Hdo - Desenvolvedor Full Stack',
    description:
      'Entre em contato comigo para oportunidades de trabalho, colaborações em projetos, consultoria ou apenas para bater um papo sobre tecnologia.',
    images: ['/logo.webp'],
  },
  alternates: {
    canonical: 'https://lucashdo.com/contact',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}

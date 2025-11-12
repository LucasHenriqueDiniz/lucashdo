import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const CVClient = dynamic(() => import('./client'));

export const metadata: Metadata = {
  title: 'Currículo | Lucas Hdo - Desenvolvedor Full Stack',
  description:
    'Currículo de Lucas Hdo - Desenvolvedor Full Stack especializado em React, Next.js, TypeScript e design criativo.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function CVPage() {
  return <CVClient />;
}


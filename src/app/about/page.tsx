import { Metadata } from 'next';
import AboutClient from './client';

export const metadata: Metadata = {
  title: 'Sobre | LHDO',
  description: 'Conheça mais sobre minha jornada, habilidades e experiências.',
};

export default function About() {
  return <AboutClient />;
}

import { Metadata } from 'next';
import ContactClient from './client';

export const metadata: Metadata = {
  title: 'Contato | Lucas HDO',
  description:
    'Entre em contato comigo para oportunidades, colaborações ou apenas para bater um papo.',
};

export default function ContactPage() {
  return <ContactClient />;
}

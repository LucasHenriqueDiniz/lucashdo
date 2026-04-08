import { PenTool } from 'lucide-react';
import { AiOutlineFile } from 'react-icons/ai';
import { BiBox } from 'react-icons/bi';
import { FaAws } from 'react-icons/fa';
import { MdInventory } from 'react-icons/md';
import {
  SiArduino,
  SiC,
  SiNodedotjs,
  SiPrisma,
  SiPython,
  SiReact,
  SiTypescript,
  SiVite,
} from 'react-icons/si';
import { ExperienceProps } from '@/types/experience.types';
import ZustandIcon from '@/components/zustandIcon/ZustandIcon';
import PhotoshopIcon from '@/components/adobeIcons/PhotoshopIcon';
import IllustratorIcon from '@/components/adobeIcons/IllustratorIcon';
import AfterEffectsIcon from '@/components/adobeIcons/AfterEffectsIcon';

export const jobExperiences: ExperienceProps[] = [
  {
    id: 'eng-futuro-vol',
    topTags: [
      { labels: { pt: 'Voluntário', en: 'Volunteer' } },
      { labels: { pt: 'Engenharia do Futuro', en: 'Engenharia do Futuro' } },
    ],
    title: 'Desenvolvedor Voluntário',
    institution: 'Engenharia do Futuro',
    url: 'https://engenhariadofuturo.com.br/',
    startDate: '2023-05',
    endDate: '2024-02',
    showInTimeline: true,
    tags: [
      { labels: { pt: 'React', en: 'React' }, icon: SiReact },
      { labels: { pt: 'Node.js', en: 'Node.js' }, icon: SiNodedotjs },
      { labels: { pt: 'Microcontroladores', en: 'Microcontrollers' }, icon: SiArduino },
      { labels: { pt: 'TypeScript', en: 'TypeScript' }, icon: SiTypescript },
      { labels: { pt: 'Python', en: 'Python' }, icon: SiPython },
      { labels: { pt: 'C', en: 'C' }, icon: SiC },
      { labels: { pt: 'ViteJS', en: 'ViteJS' }, icon: SiVite },
    ],
    description: {
      pt: 'Conduzi workshop técnico de Front-End para a equipe, cobrindo arquitetura e padrões de código. Desenvolvi firmware embarcado, interface web e API backend, integrando hardware com aplicação fullstack.',
      en: 'Led technical Front-End workshop covering architecture and code patterns. Developed embedded firmware, web interface, and backend API, integrating hardware with fullstack application.',
    },
  },
  {
    id: 'eng-futuro',
    topTags: [
      { labels: { pt: 'Trabalho', en: 'Job' } },
      { labels: { pt: 'Engenharia do Futuro', en: 'Engenharia do Futuro' } },
    ],
    title: 'Desenvolvedor Full Stack',
    institution: 'Engenharia do Futuro',
    url: 'https://engenhariadofuturo.com.br/',
    startDate: '2025-04',
    endDate: null,
    showInTimeline: true,
    tags: [
      { labels: { pt: 'React', en: 'React' }, icon: SiReact },
      { labels: { pt: 'TypeScript', en: 'TypeScript' }, icon: SiTypescript },
      { labels: { pt: 'Python', en: 'Python' }, icon: SiPython },
      { labels: { pt: 'Microcontroladores', en: 'Microcontrollers' }, icon: SiArduino },
    ],
    description: {
      pt: 'Arquitetei e implementei refatoração completa da plataforma e landing page, estabelecendo design system e guidelines. Desenvolvi sistema de instalação de firmware via Web Serial API, automatizando processo de flash e comunicação serial diretamente no navegador.',
      en: 'Architected and implemented complete platform and landing page refactor, establishing design system and guidelines. Built firmware installation system using Web Serial API, automating flash process and serial communication directly in browser.',
    },
  },
  {
    id: 'bots-channel',
    topTags: [
      { labels: { pt: 'Trabalho', en: 'Job' } },
      { labels: { pt: 'Bots Channel', en: 'Bots Channel' } },
    ],
    title: 'CTO & Co-Founder',
    institution: 'Bots Channel',
    url: 'https://botschannel.com/',
    startDate: '2024-01',
    endDate: '2024-12',
    showInTimeline: true,
    tags: [
      { labels: { pt: 'React', en: 'React' }, icon: SiReact },
      { labels: { pt: 'Node.js', en: 'Node.js' }, icon: SiNodedotjs },
      { labels: { pt: 'AWS', en: 'AWS' }, icon: FaAws },
      { labels: { pt: 'Prisma', en: 'Prisma' }, icon: SiPrisma },
      { labels: { pt: 'Zustand', en: 'Zustand' }, icon: ZustandIcon },
      { labels: { pt: 'TypeScript', en: 'TypeScript' }, icon: SiTypescript },
    ],
    description: {
      pt: 'Arquitetei plataforma SaaS serverless para automação de chatbots multi-canal (WhatsApp, Telegram, Instagram). Implementei sistema de autenticação customizado, engine de processamento de fluxos JSON-based, e infraestrutura AWS Lambda com PostgreSQL. Desenvolvi interface no-code para construção visual de automações.',
      en: 'Architected serverless SaaS platform for multi-channel chatbot automation (WhatsApp, Telegram, Instagram). Implemented custom authentication system, JSON-based flow processing engine, and AWS Lambda infrastructure with PostgreSQL. Built no-code interface for visual automation workflows.',
    },
  },
  {
    id: 'freelance-design',
    topTags: [
      { labels: { pt: 'Freelance', en: 'Freelance' } },
      { labels: { pt: 'Design Gráfico', en: 'Graphic Design' } },
    ],
    title: 'Designer Freelancer',
    institution: 'Autônomo',
    url: 'https://www.linkedin.com/in/lucas-diniz-ostroski/',
    startDate: '2019-01',
    endDate: '2020-12',
    showInTimeline: true,
    tags: [
      { labels: { pt: 'Photoshop', en: 'Photoshop' }, icon: PhotoshopIcon },
      { labels: { pt: 'Illustrator', en: 'Illustrator' }, icon: IllustratorIcon },
      { labels: { pt: 'After Effects', en: 'After Effects' }, icon: AfterEffectsIcon },
      { labels: { pt: 'Design Gráfico', en: 'Graphic Design' }, icon: PenTool },
    ],
    description: {
      pt: 'Gerenciei projetos de design end-to-end para múltiplos clientes, mantendo 98.7% de satisfação. Desenvolvi identidades visuais, materiais promocionais e motion graphics, coordenando entregas e comunicação com stakeholders.',
      en: 'Managed end-to-end design projects for multiple clients, maintaining 98.7% satisfaction rate. Developed visual identities, promotional materials, and motion graphics, coordinating deliveries and stakeholder communication.',
    },
  },
  {
    id: 'vix-logistica',
    title: 'Auxiliar Administrativo (Menor Aprendiz)',
    institution: 'Vix Logística',
    url: 'https://www.linkedin.com/company/vix-logistica/',
    startDate: '2017-02',
    endDate: '2019-02',
    showInTimeline: false,
    topTags: [
      { labels: { pt: 'Trabalho', en: 'Job' } },
      { labels: { pt: 'Vix Logística', en: 'Vix Logistics' } },
    ],
    tags: [
      { labels: { pt: 'Almoxarifado', en: 'Warehouse' }, icon: BiBox },
      { labels: { pt: 'Planilhas de Dados', en: 'Data Sheets' }, icon: AiOutlineFile },
    ],
    description: {
      pt: 'Exerci funções administrativas e de controle de almoxarifado, desenvolvendo planilhas de dados e gestão de estoque, demonstrando habilidades organizacionais e atenção a detalhes em ambiente corporativo.',
      en: 'Performed administrative and warehouse control duties, creating data spreadsheets and managing inventory, demonstrating organizational skills and attention to detail in a corporate setting.',
    },
  },
];

import { PenTool } from 'lucide-react';
import { AiOutlineFile } from 'react-icons/ai';
import { BiBox } from 'react-icons/bi';
import { FaAws } from 'react-icons/fa';
import { MdInventory } from 'react-icons/md';
import {
  SiAdobeaftereffects,
  SiAdobeillustrator,
  SiAdobephotoshop,
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

export const jobExperiences: ExperienceProps[] = [
  {
    id: 'eng-futuro-vol',
    topTags: [
      { labels: { pt: 'Voluntário', en: 'Volunteer' } },
      { labels: { pt: 'Engenharia do Futuro', en: 'Engineering of the Future' } },
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
      pt: 'Ministrei workshop completo de Front-End para toda a equipe, apresentei código e boas práticas e fui responsável pelo desenvolvimento do firmware, front-end e back-end, marcando meu primeiro contato profissional com código em empresa.',
      en: 'Led a comprehensive Front-End workshop for the entire team, demonstrating code best practices. Developed firmware, front-end and back-end features, marking my first professional coding experience in a corporate environment.',
    },
  },
  {
    id: 'eng-futuro',
    topTags: [
      { labels: { pt: 'Trabalho', en: 'Job' } },
      { labels: { pt: 'Engenharia do Futuro', en: 'Engineering of the Future' } },
    ],
    title: 'Desenvolvedor Full Stack',
    institution: 'Engenharia do Futuro',
    url: 'https://engenhariadofuturo.com.br/',
    startDate: '2025-03',
    endDate: null,
    showInTimeline: true,
    tags: [
      { labels: { pt: 'React', en: 'React' }, icon: SiReact },
      { labels: { pt: 'TypeScript', en: 'TypeScript' }, icon: SiTypescript },
      { labels: { pt: 'Python', en: 'Python' }, icon: SiPython },
      { labels: { pt: 'Microcontroladores', en: 'Microcontrollers' }, icon: SiArduino },
    ],
    description: {
      pt: 'Fui convidado para retornar pela qualidade do meu trabalho voluntário. Liderei o refactor completo da landing page e plataforma, ajustando brand guidelines e desenvolvendo protótipos no Figma. Implementei chamadas de API e sistemas Web Serial para instalação de firmware.',
      en: 'Rehired based on the success of my volunteer contributions. Led a full refactor of the landing page and platform, updating brand guidelines and crafting Figma prototypes. Implemented API integrations and Web Serial interfaces for firmware installation.',
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
    startDate: '2024-02',
    endDate: '2024-07',
    showInTimeline: true,
    tags: [
      { labels: { pt: 'React', en: 'React' }, icon: SiReact },
      { labels: { pt: 'Node.js', en: 'Node.js' }, icon: SiNodedotjs },
      { labels: { pt: 'AWS', en: 'AWS' }, icon: FaAws },
      { labels: { pt: 'Prisma', en: 'Prisma' }, icon: SiPrisma },
      { labels: { pt: 'Zustand', en: 'Zustand' }, icon: SiC },
      { labels: { pt: 'TypeScript', en: 'TypeScript' }, icon: SiTypescript },
    ],
    description: {
      pt: 'Desenvolvi toda identidade visual: logo, guidelines de marca e protótipos no Figma da plataforma e landing page. Implementei landing page e plataforma completa com login e sistema de desenvolvimento de chatbots usando interface baseada em cards sem código.',
      en: 'Created the entire visual identity: logo, brand guidelines and Figma prototypes for both the platform and landing page. Developed the landing page and full platform with authentication and a codeless, card-based chatbot development system.',
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
      { labels: { pt: 'Photoshop', en: 'Photoshop' }, icon: SiAdobephotoshop },
      { labels: { pt: 'Illustrator', en: 'Illustrator' }, icon: SiAdobeillustrator },
      { labels: { pt: 'After Effects', en: 'After Effects' }, icon: SiAdobeaftereffects },
      { labels: { pt: 'Design Gráfico', en: 'Graphic Design' }, icon: PenTool },
    ],
    description: {
      pt: 'Prestei serviços de design em dezenas de projetos, alcançando 98.7% de satisfação dos clientes. Criei identidades visuais, materiais promocionais e animações, garantindo entregas eficientes e comunicação direta com stakeholders.',
      en: 'Provided design services across dozens of projects, achieving 98.7% client satisfaction. Crafted visual identities, promotional materials, and animations, ensuring efficient deliveries and direct stakeholder collaboration.',
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
      { labels: { pt: 'Controle de Estoque', en: 'Inventory Management' }, icon: MdInventory },
    ],
    description: {
      pt: 'Exerci funções administrativas e de controle de almoxarifado, desenvolvendo planilhas de dados e gestão de estoque, demonstrando habilidades organizacionais e atenção a detalhes em ambiente corporativo.',
      en: 'Performed administrative and warehouse control duties, creating data spreadsheets and managing inventory, demonstrating organizational skills and attention to detail in a corporate setting.',
    },
  },
];

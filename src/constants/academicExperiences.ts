import { FaAws, FaDatabase, FaHeart, FaLinkedin, FaMicrosoft, FaRobot } from 'react-icons/fa';
import { GiSkeleton } from 'react-icons/gi';
import { MdDesignServices, MdLanguage } from 'react-icons/md';
import {
  SiArduino,
  SiAssemblyscript,
  SiC,
  SiFigma,
  SiGooglemeet,
  SiNextdotjs,
  SiOpenbadges,
  SiPython,
  SiSupabase,
  SiTypescript,
  SiUdemy,
} from 'react-icons/si';
import { TbWorldWww } from 'react-icons/tb';
import { ExperienceProps } from '@/types/experience.types';

export const academicExperiences: ExperienceProps[] = [
  {
    id: 'uergs',
    topTags: [
      { labels: { pt: 'Acadêmico', en: 'Academic' } },
      { labels: { pt: 'UERGS', en: 'UERGS' } },
    ],
    title: 'Engenharia da Computação',
    institution: 'UERGS - Universidade Estadual do Rio Grande do Sul',
    url: 'https://www.uergs.edu.br/',
    startDate: '2023-02',
    endDate: '2025-01',
    showInTimeline: true,
    tags: [
      { labels: { pt: 'C', en: 'C' }, icon: SiC },
      { labels: { pt: 'Python', en: 'Python' }, icon: SiPython },
      { labels: { pt: 'Microcontroladores', en: 'Microcontrollers' }, icon: SiArduino },
      { labels: { pt: 'Assembly', en: 'Assembly' }, icon: SiAssemblyscript },
    ],
    description: {
      pt: 'Participei de projetos acadêmicos focados em programação de baixo nível, desenvolvimento de algoritmos e sistemas embarcados. Experiência prática com microcontroladores e fundamentos de inteligência artificial.',
      en: 'Participated in academic projects focused on low-level programming, algorithm development, and embedded systems. Hands-on experience with microcontrollers and AI fundamentals.',
    },
  },

  {
    id: 'unicv',
    topTags: [
      { labels: { pt: 'Acadêmico', en: 'Academic' } },
      { labels: { pt: 'UNICV', en: 'UNICV' } },
    ],
    title: 'Engenharia de Software',
    institution: 'UNICV',
    url: 'https://www.unicv.edu.br/',
    startDate: '2025-02',
    endDate: null,
    showInTimeline: true,
    tags: [
      {
        labels: { pt: 'Engenharia de Software', en: 'Software Engineering' },
        icon: MdDesignServices,
      },
      { labels: { pt: 'Desenvolvimento Web', en: 'Web Development' }, icon: TbWorldWww },
      { labels: { pt: 'Métodos Agile', en: 'Agile Methods' }, icon: SiGooglemeet },
      { labels: { pt: 'Banco de Dados', en: 'Databases' }, icon: FaDatabase },
      {
        labels: { pt: 'Arquitetura de Software', en: 'Software Architecture' },
        icon: MdDesignServices,
      },
    ],
    description: {
      pt: 'Foco em arquitetura de sistemas robustos, desenvolvimento escalável e implementação de metodologias ágeis. Aprofundamento em padrões de design e engenharia de software moderna.',
      en: 'Focus on robust system architecture, scalable development, and agile methodology implementation. Deep dive into design patterns and modern software engineering.',
    },
  },
  {
    id: 'include-gurias-bolsa',
    topTags: [
      { labels: { pt: 'Bolsa de Estudos', en: 'Scholarship' } },
      { labels: { pt: 'Include Gurias', en: 'Include Gurias' } },
    ],
    title: 'Bolsa de Estudos - Include Gurias',
    institution: 'UERGS',
    url: 'https://www.uergs.edu.br/',
    startDate: '2023-06',
    endDate: '2024-01',
    showInTimeline: true,
    tags: [
      { labels: { pt: 'Inclusão', en: 'Inclusion' }, icon: FaHeart },
      { labels: { pt: 'Figma', en: 'Figma' }, icon: SiFigma },
      { labels: { pt: 'Desenvolvimento Web', en: 'Web-Development' }, icon: TbWorldWww },
      { labels: { pt: 'AWS', en: 'AWS' }, icon: FaAws },
    ],
    description: {
      pt: 'Arquitetei plataforma institucional fullstack com CMS headless customizado. Implementei sistema de autenticação, chatbot interativo, e painel administrativo com CRUD completo para gestão de conteúdo educativo e membros.',
      en: 'Architected fullstack institutional platform with custom headless CMS. Implemented authentication system, interactive chatbot, and admin dashboard with full CRUD for educational content and member management.',
    },
    
  },
  {
  id: 'comunica-mulher-bolsa',
  topTags: [
    { labels: { pt: 'Bolsa de Estudos', en: 'Scholarship' } },
    { labels: { pt: 'ComunicaMulher',   en: 'ComunicaMulher' } },
  ],
  title: 'Bolsa de Estudos - ComunicaMulher',
  institution: 'ComunicaMulher',
  url: 'https://reclame-mulher.vercel.app/',
  startDate: '2025-8',
  endDate: null,
  showInTimeline: true,
  tags: [
    { labels: { pt: 'Next.js',     en: 'Next.js' },     icon: SiNextdotjs },
    { labels: { pt: 'TypeScript',  en: 'TypeScript' },  icon: SiTypescript },
    { labels: { pt: 'Supabase',    en: 'Supabase' },    icon: SiSupabase },
    { labels: { pt: 'Banco de Dados', en: 'Databases' }, icon: FaDatabase },
    { labels: { pt: 'Impacto Social', en: 'Social Impact' }, icon: FaHeart },
  ],
  description: {
    pt: 'Desenvolvi sistema de gestão de reclamações com workflow de moderação completo. Implementei pipeline de intake com validações e sanitização, políticas RLS granulares no Supabase, e painel administrativo com filtros avançados. Arquitetura focada em segurança e auditoria.',
    en: 'Built complaint management system with complete moderation workflow. Implemented intake pipeline with validation and sanitization, granular Supabase RLS policies, and admin dashboard with advanced filters. Security-focused architecture with auditing.',
  },
},
  {
    id: 'belart-estetica',
    title: 'Ensino Técnico, Massoterapia',
    institution: 'Belart Escola de Estética',
    topTags: [
      { labels: { pt: 'Acadêmico', en: 'Academic' } },
      { labels: { pt: 'Técnico', en: 'Technical' } },
    ],
    url: '',
    startDate: '2021-01',
    endDate: '2022-12',
    showInTimeline: false,
    tags: [
      { labels: { pt: 'Massagem terapêutica', en: 'Therapeutic massage' }, icon: MdDesignServices },
      { labels: { pt: 'Relacionamento com clientes', en: 'Client relations' }, icon: MdDesignServices },
    ],
    description: {
      pt: 'Formação técnica em massoterapia com foco em técnicas terapêuticas e relacionamento com clientes.',
      en: 'Technical training in massage therapy focusing on therapeutic techniques and client relations.',
    },
  },
  {
    id: 'jovem-profissional-necropsia',
    title: 'Auxiliar Necropsia',
    institution: 'Escola Técnica e Faculdade Jovem Profissional Porto Alegre',
    topTags: [
      { labels: { pt: 'Acadêmico', en: 'Academic' } },
      { labels: { pt: 'Técnico', en: 'Technical' } },
    ],
    url: '',
    startDate: '2020-01',
    endDate: '2022-12',
    showInTimeline: false,
    tags: [
      { labels: { pt: 'Forense', en: 'Forensics' }, icon: GiSkeleton },
      { labels: { pt: 'Anatomia humana', en: 'Human anatomy' }, icon: GiSkeleton },
      { labels: { pt: 'Apresentações técnicas', en: 'Technical presentations' }, icon: MdDesignServices },
    ],
    description: {
      pt: 'Formação técnica em auxiliar de necropsia com conhecimentos em forense, anatomia humana e apresentações técnicas.',
      en: 'Technical training as necropsy assistant with knowledge in forensics, human anatomy, and technical presentations.',
    },
  },
  {
    id: 'uniritter',
    title: 'Medicina Veterinária',
    institution: 'UniRitter',
    topTags: [
      { labels: { pt: 'Acadêmico', en: 'Academic' } },
      { labels: { pt: 'UniRitter', en: 'UniRitter' } },
    ],
    image: '/images/uniritter.png',
    url: 'https://www.uniritter.edu.br/',
    startDate: '2020-02',
    endDate: '2023-12',
    showInTimeline: false,
    tags: [{ labels: { pt: 'Veterinária', en: 'Veterinary' }, icon: GiSkeleton }],
    description: {
      pt: 'Formação sólida em ciências biológicas e desenvolvimento de competências analíticas. Experiência que fortaleceu disciplina, resiliência e pensamento crítico aplicado à resolução de problemas.',
      en: 'Strong foundation in biological sciences and analytical skills development. Experience that strengthened discipline, resilience, and critical thinking applied to problem-solving.',
    },
  },
];

export const certificates = [
  {
    title: 'Career Essentials in Software Development by Microsoft and LinkedIn',
    issuer: 'Microsoft / LinkedIn Learning',
    issueDate: '2024-11',
    url: 'https://www.linkedin.com/learning/certificates/a12843799e16406ce15f775df2deb9c4bd3d4d8945e6fb1da9f3284d95587304?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_certifications_details%3BjbafyffeRIK7DYTpBc3v%2FA%3D%3D',
    skills: ['Software Development'],
    icon: FaMicrosoft,
  },
  {
    title: 'Vibe Coding L1: Bronze',
    issuer: 'Lovable',
    issueDate: '2026-02',
    url: 'https://www.linkedin.com/in/lucas-diniz-ostroski/details/certifications/',
    skills: ['AI-Assisted Development', 'Prompt Engineering'],
    icon: SiOpenbadges,
  },
  {
    title: 'Curso de Japonês (JLPT N5)',
    issuer: 'Tokyo Sakura Gaoka Institute',
    issueDate: '2026-02',
    url: '/documents/tokyo-sakura-gaoka.pdf',
    skills: ['Japonês'],
    icon: MdLanguage,
  },
  {
    title: 'EF SET English Certificate (C2 Proficiency)',
    issuer: 'EF SET',
    issueDate: '2024-11',
    url: 'https://cert.efset.org/pt/LfJe4z',
    skills: ['Inglês'],
    icon: SiOpenbadges,
  },
  {
    title: 'Programming Foundations: Beyond the Fundamentals',
    issuer: 'LinkedIn Learning',
    issueDate: '2024-11',
    url: 'https://www.linkedin.com/learning/certificates/8e7943eeaac7618d975c75a4d14cb1db48162719150fbd0b2cc3904257c862dc?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_certifications_details%3BjbafyffeRIK7DYTpBc3v%2FA%3D%3D',
    skills: ['Programming'],
    icon: FaLinkedin,
  },
  {
    title: 'The Complete 2023 Web Development Bootcamp',
    issuer: 'Udemy',
    issueDate: '2023-12',
    url: 'https://www.udemy.com/certificate/UC-da83b504-6441-4ffd-8968-91d25f25a19f/',
    skills: ['Web Development'],
    icon: SiUdemy,
  },
  {
    title: 'Digital Advertising Certification: Develop a Winning Online Advertising Strategy',
    issuer: 'HubSpot Academy',
    issueDate: '2025-01',
    url: 'https://app.hubspot.com/academy/achievements/cn50rk94/en/1/amayacrab-na/digital-advertising',
    skills: ['Digital Advertising', 'Marketing', 'Social Media Advertising', 'Google Ads'],
    icon: SiOpenbadges,
  },
];

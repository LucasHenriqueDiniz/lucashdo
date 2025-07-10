import { FaAws, FaDatabase, FaHeart, FaMicrosoft, FaRobot } from 'react-icons/fa';
import { GiSkeleton } from 'react-icons/gi';
import { MdDesignServices, MdLanguage } from 'react-icons/md';
import {
  SiArduino,
  SiAssemblyscript,
  SiC,
  SiFigma,
  SiGooglemeet,
  SiLinkedin,
  SiOpenbadges,
  SiPython,
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
    showInTimeline: false,
    tags: [
      { labels: { pt: 'C', en: 'C' }, icon: SiC },
      { labels: { pt: 'Python', en: 'Python' }, icon: SiPython },
      { labels: { pt: 'Microcontroladores', en: 'Microcontrollers' }, icon: SiArduino },
      { labels: { pt: 'Assembly', en: 'Assembly' }, icon: SiAssemblyscript },
      { labels: { pt: 'A.I', en: 'A.I' }, icon: FaRobot },
    ],
    description: {
      pt: 'Participei de projetos acadêmicos focados em programação de baixo nível, desenvolvimento de algoritmos e sistemas embarcados. Experiência prática com microcontroladores e fundamentos de inteligência artificial.',
      en: 'Participated in academic projects focused on low-level programming, algorithm development, and embedded systems. Hands-on experience with microcontrollers and AI fundamentals.',
    },
  },
  {
    id: 'nihongo-center',
    title: 'Curso de Japonês',
    institution: 'Nihongo Center Sakuragaoka',
    url: '',
    startDate: '2025-07',
    endDate: null,
    showInTimeline: false,
    topTags: [
      { labels: { pt: 'Idioma', en: 'Language' } },
      { labels: { pt: 'Japonês', en: 'Japanese' } },
    ],
    tags: [{ labels: { pt: 'Japonês', en: 'Japanese' }, icon: MdLanguage }],
    description: {
      pt: 'Curso ativo de língua japonesa com professores da Tokyo Sakuragaoka Gakuin. Aulas semanais com foco em leitura, conversação e cultura japonesa.',
      en: 'Ongoing Japanese language course taught by instructors from Tokyo Sakuragaoka Gakuin. Weekly classes focused on reading, conversation, and Japanese culture.',
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
    startDate: '2025-03',
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
    startDate: '2024-01',
    endDate: '2024-12',
    showInTimeline: true,
    tags: [
      { labels: { pt: 'Inclusão', en: 'Inclusion' }, icon: FaHeart },
      { labels: { pt: 'Figma', en: 'Figma' }, icon: SiFigma },
      { labels: { pt: 'Desenvolvimento Web', en: 'Web-Development' }, icon: TbWorldWww },
      { labels: { pt: 'AWS', en: 'AWS' }, icon: FaAws },
    ],
    description: {
      pt: 'Desenvolvimento completo da plataforma Include Gurias: prototipagem no Figma, chatbot interativo, site institucional com cards das integrantes e gibis educativos, além de painel administrativo no-code para gestão de conteúdo.',
      en: 'Complete development of the Include Gurias platform: Figma prototyping, interactive chatbot, institutional website with member cards and educational comics, plus a no-code admin dashboard for content management.',
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
    icon: SiLinkedin,
  },
  {
    title: 'The Complete 2023 Web Development Bootcamp',
    issuer: 'Udemy',
    issueDate: '2023-12',
    url: 'https://www.udemy.com/certificate/UC-da83b504-6441-4ffd-8968-91d25f25a19f/',
    skills: ['Web Development'],
    icon: SiUdemy,
  },
];

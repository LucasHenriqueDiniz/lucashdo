import { ExperienceProps } from '@/types/experience.types';
import {
  LucideIcon,
  Skull,
  Cpu,
  Code,
  Heart,
  FolderKanban,
  Stethoscope,
  Waves,
  GraduationCap,
  BookOpen,
  Laptop,
  Award,
  HandHelping,
  Dna,
  FlaskConical,
  Scissors,
  School,
} from 'lucide-react';

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
    date: '2023 - 2027',
    showInTimeline: true,
    tags: [
      { labels: { pt: 'C', en: 'C' }, icon: '/icons/c.svg' },
      { labels: { pt: 'Programação', en: 'Programming' }, icon: Code },
      {
        labels: { pt: 'Sistemas Digitais', en: 'Digital Systems' },
        icon: Cpu,
      },
    ],
    description: {
      pt: 'Atualmente cursando Engenharia de Computação na UERGS, instituição reconhecida pela excelência acadêmica. O curso foi classificado em 1º lugar entre 178 cursos avaliados no Brasil, com foco em projetos de pesquisa e formação prática em sistemas digitais, hardware, software e automação industrial.',
      en: 'Currently studying Computer Engineering at UERGS, a top-ranked institution in Brazil. The course is focused on research projects and practical training in digital systems, hardware, software, and industrial automation.',
    },
  },
  {
    id: 'unicv',
    topTags: [
      { labels: { pt: 'Acadêmico', en: 'Academic' } },
      { labels: { pt: 'UNICV', en: 'UNICV' } },
    ],
    title: 'Engenharia de Software',
    institution: 'UNICV - Centro Universitário Cidade Verde',
    url: 'https://www.unicv.edu.br/',
    date: '2025 - 2027',
    showInTimeline: true,
    tags: [
      {
        labels: { pt: 'Engenharia de Software', en: 'Software Engineering' },
        icon: Laptop,
      },
    ],
    description: {
      pt: 'Bacharelado em Engenharia de Software na UNICV.',
      en: "Bachelor's degree in Software Engineering at UNICV.",
    },
  },
  {
    id: 'include-gurias-bolsa',
    topTags: [
      { labels: { pt: 'Bolsa de Estudos', en: 'Scholarship' } },
      { labels: { pt: 'UERGS', en: 'UERGS' } },
    ],
    title: 'Bolsa de Estudos - Include Gurias',
    institution: 'UERGS',
    url: 'https://www.uergs.edu.br/',
    date: '2024',
    showInTimeline: true,
    tags: [
      { labels: { pt: 'Inclusão', en: 'Inclusion' }, icon: Heart },
      { labels: { pt: 'Projeto', en: 'Project' }, icon: FolderKanban },
    ],
    description: {
      pt: 'Bolsa de estudos pelo projeto Include Gurias, promovendo inclusão e representatividade feminina nas ciências exatas.',
      en: 'Scholarship for the Include Gurias project, promoting inclusion and female representation in STEM.',
    },
  },
  {
    id: 'uniritter',
    title: 'Medicina Veterinária (Trancado)',
    institution: 'UniRitter',
    topTags: [
      { labels: { pt: 'Acadêmico', en: 'Academic' } },
      { labels: { pt: 'UniRitter', en: 'UniRitter' } },
    ],
    image: '/images/uniritter.png',
    url: 'https://www.uniritter.edu.br/',
    date: '2020 - 2023',
    showInTimeline: false,
    tags: [{ labels: { pt: 'Veterinária', en: 'Veterinary' }, icon: Stethoscope }],
    description: {
      pt: 'Curso trancado.',
      en: 'Course dropped.',
    },
  },
  {
    id: 'belart',
    title: 'Massoterapia',
    topTags: [
      { labels: { pt: 'Técnico', en: 'Technical' } },
      { labels: { pt: 'Belart', en: 'Belart' } },
    ],
    institution: 'Belart Escola de Estética (RS)',
    image: '/images/belart.png',
    url: '',
    date: '2021 - 2022',
    showInTimeline: false,
    tags: [
      {
        labels: { pt: 'Massoterapia', en: 'Massage Therapy' },
        icon: HandHelping,
      },
    ],
    description: {
      pt: 'Curso técnico.',
      en: 'Technical course.',
    },
  },
  {
    id: 'jovem-profissional',
    title: 'Auxiliar Necropsia',
    institution: 'Faculdade Jovem Profissional Porto Alegre',
    image: '/images/jovem-profissional.png',
    url: '',
    date: '2020 - 2022',
    showInTimeline: false,
    topTags: [
      { labels: { pt: 'Técnico', en: 'Technical' } },
      { labels: { pt: 'Jovem Profissional', en: 'Jovem Profissional' } },
    ],
    tags: [{ labels: { pt: 'Necropsia', en: 'Necropsy' }, icon: Skull }],
    description: {
      pt: 'Curso técnico.',
      en: 'Technical course.',
    },
  },
];

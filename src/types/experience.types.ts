import { LucideIcon } from 'lucide-react';

export type TranslatedField = {
  pt: string;
  en: string;
};

export interface TimelineTopTagProps {
  labels: TranslatedField;
}

export interface TimelineTagProps {
  icon: LucideIcon | string;
  labels: TranslatedField;
}

export interface ExperienceProps {
  id: string;
  topTags: TimelineTopTagProps[];
  title: string;
  institution: string;
  url: string;
  date: string;
  sortDate?: string; // Data em formato YYYY-MM-DD para ordenação
  years: string; // Ex: "2023 - 2024"
  showInTimeline: boolean;
  tags: TimelineTagProps[];
  description: TranslatedField;
  image?: string;
}

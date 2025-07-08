import { LucideIcon } from 'lucide-react';
import { IconType } from 'react-icons/lib';

export type TranslatedField = {
  pt: string;
  en: string;
};

export interface TimelineTopTagProps {
  labels: TranslatedField;
}

export interface TimelineTagProps {
  icon: LucideIcon | string | IconType;
  labels: TranslatedField;
}

export interface ExperienceProps {
  id: string;
  topTags: TimelineTopTagProps[];
  title: string;
  institution: string;
  url: string;
  startDate: string;
  endDate?: string | null;
  showInTimeline: boolean;
  tags: TimelineTagProps[];
  description: TranslatedField;
  image?: string;
}

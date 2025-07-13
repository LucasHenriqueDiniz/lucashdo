export type TranslatedField = {
  pt: string;
  en: string;
};

export interface TimelineTopTagProps {
  labels: TranslatedField;
}

export interface TimelineTagProps {
  icon: React.ElementType;
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

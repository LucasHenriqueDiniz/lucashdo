import { ExperienceProps } from '@/types/experience.types';

/**
 * Formata as datas de experiência para exibição
 * @param startDate Data de início no formato YYYY-MM
 * @param endDate Data de fim no formato YYYY-MM, null ou undefined se atual
 * @param locale Idioma para formatação ('pt' | 'en')
 * @returns String formatada das datas
 */
export function formatExperienceDates(
  startDate: string,
  endDate: string | null | undefined,
  locale: 'pt' | 'en' = 'pt'
): string {
  const [startYear, startMonth] = startDate.split('-');

  if (!endDate) {
    return locale === 'pt'
      ? `${startMonth}/${startYear} - Atual`
      : `${startMonth}/${startYear} - Present`;
  }

  const [endYear, endMonth] = endDate.split('-');

  // Se mesmo ano, mostrar apenas mês/ano - mês/ano
  if (startYear === endYear) {
    return `${startMonth}/${startYear} - ${endMonth}/${endYear}`;
  }

  return `${startMonth}/${startYear} - ${endMonth}/${endYear}`;
}

/**
 * Ordena experiências priorizando as atuais (sem endDate) e depois por data de fim decrescente
 * @param experiences Array de experiências
 * @returns Array ordenado
 */
export function sortExperiences(experiences: ExperienceProps[]): ExperienceProps[] {
  return experiences.sort((a, b) => {
    // Colocar os atuais (sem endDate) primeiro
    if (!a.endDate && b.endDate) return -1;
    if (a.endDate && !b.endDate) return 1;

    // Se ambos são atuais, ordenar por startDate decrescente
    if (!a.endDate && !b.endDate) {
      return new Date(b.startDate + '-01').getTime() - new Date(a.startDate + '-01').getTime();
    }

    // Se ambos têm endDate, ordenar por endDate decrescente
    if (a.endDate && b.endDate) {
      return new Date(b.endDate + '-01').getTime() - new Date(a.endDate + '-01').getTime();
    }

    return 0;
  });
}

/**
 * Filtra e ordena experiências para exibição na timeline
 * @param experiences Array de experiências
 * @param showOnlyTimeline Se deve mostrar apenas as marcadas para timeline
 * @returns Array filtrado e ordenado
 */
export function getFilteredAndSortedExperiences(
  experiences: ExperienceProps[],
  showOnlyTimeline: boolean = true
): ExperienceProps[] {
  let filtered = experiences;

  if (showOnlyTimeline) {
    filtered = experiences.filter(exp => exp.showInTimeline);
  }

  return sortExperiences(filtered);
}

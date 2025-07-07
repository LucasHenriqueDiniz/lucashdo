/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from 'react';

export interface BrowserTab {
  /** ID único para a aba */
  id: string;
  /** Título da aba */
  title: string;
  /** URL para exibir na barra de endereço */
  url: string;
  /** Conteúdo da aba */
  content: ReactNode;
  /** Ícone opcional para a aba (ReactNode ou string para URL de imagem) */
  icon?: ReactNode | string;
  /** Indica se a aba está favoritada */
  isFavorited?: boolean;
  /** Indica se a aba está fixada (pinned) */
  isPinned?: boolean;
  /** Indica se a aba tem mudanças não salvas */
  hasUnsavedChanges?: boolean;
  /** Indica se a aba está desabilitada */
  isDisabled?: boolean;
  /** Dados adicionais opcionais que podem ser usados pelo componente */
  data?: Record<string, any>;
  /** Tipo da aba (home, project, external, etc.) */
  type?: 'home' | 'project' | 'external' | 'new';
  /** Timestamp de quando a aba foi criada */
  createdAt?: number;
  /** Timestamp da última atividade na aba */
  lastActivity?: number;
}

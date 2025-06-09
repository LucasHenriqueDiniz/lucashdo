import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const theme = {
  colors: {
    primary: {
      DEFAULT: '#7C3AED', // Vibrant purple
      foreground: '#FFFFFF',
    },
    secondary: {
      DEFAULT: '#10B981', // Emerald green
      foreground: '#FFFFFF',
    },
    accent: {
      DEFAULT: '#F59E0B', // Amber
      foreground: '#FFFFFF',
    },
    background: {
      DEFAULT: '#FFFFFF',
      dark: '#0F172A',
    },
    foreground: {
      DEFAULT: '#0F172A',
      dark: '#F8FAFC',
    },
    muted: {
      DEFAULT: '#F1F5F9',
      dark: '#1E293B',
    },
    card: {
      DEFAULT: '#FFFFFF',
      dark: '#1E293B',
    },
    border: {
      DEFAULT: '#E2E8F0',
      dark: '#334155',
    },
  },
  borderRadius: {
    DEFAULT: '0.5rem',
    sm: '0.25rem',
    lg: '0.75rem',
    full: '9999px',
  },
  fontFamily: {
    sans: ['var(--font-inter)'],
    mono: ['var(--font-roboto-mono)'],
  },
} as const;

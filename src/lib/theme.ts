import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Theme object - Used as reference but CSS variables from globals.css are the source of truth
// Dark mode only theme for portfolio
export const theme = {
  colors: {
    // Core UI colors
    primary: 'var(--primary)',
    'primary-foreground': 'var(--primary-foreground)',
    secondary: 'var(--secondary)',
    'secondary-foreground': 'var(--secondary-foreground)',
    accent: 'var(--accent)',
    'accent-foreground': 'var(--accent-foreground)',
    background: 'var(--background)',
    foreground: 'var(--foreground)',
    muted: 'var(--muted)',
    'muted-foreground': 'var(--muted-foreground)',
    card: 'var(--card)',
    'card-foreground': 'var(--card-foreground)',
    border: 'var(--border)',

    // Brand accent colors
    blue: 'var(--blue)',
    cyan: 'var(--cyan)',
    green: 'var(--green)',
    amber: 'var(--amber)',
    pink: 'var(--pink)',

    // Chart colors
    chart: {
      1: 'var(--chart-1)',
      2: 'var(--chart-2)',
      3: 'var(--chart-3)',
      4: 'var(--chart-4)',
      5: 'var(--chart-5)',
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

/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'framer-motion' {
  import type { FC, ReactNode } from 'react';

  export const motion: Record<string, FC<any>>;
  export const AnimatePresence: FC<{ children?: ReactNode; mode?: string }>;
  export interface Variants {
    [key: string]: any;
  }
  export function useInView(...args: any[]): any;
  export function useScroll(...args: any[]): any;
  export function useTransform(...args: any[]): any;
  export function useMotionValue(...args: any[]): any;
  export function useMotionTemplate(...args: any[]): any;
  export function useSpring(...args: any[]): any;
}

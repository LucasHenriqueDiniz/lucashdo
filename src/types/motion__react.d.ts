/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
declare module 'motion/react' {
  import type { FC, ReactNode } from 'react';

  export const motion: Record<string, FC<any>>;
  export const AnimatePresence: FC<{ children?: ReactNode; mode?: string }>;

  export interface HTMLMotionProps<_T = any> {
    [key: string]: any;
  }
  export interface SpringOptions {
    [key: string]: any;
  }
  export interface UseInViewOptions {
    [key: string]: any;
  }
  export interface MotionValue<T = any> {
    set: (v: T) => void;
    [key: string]: any;
  }
  export function useMotionValue<T = any>(...args: any[]): MotionValue<T>;
  export function useTransform(...args: any[]): any;
  export function useSpring(...args: any[]): any;
  export function useInView(...args: any[]): any;
  export function useMotionTemplate(...args: any[]): any;
}

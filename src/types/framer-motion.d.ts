declare module 'framer-motion' {
  export const motion: any;
  export const AnimatePresence: any;
  export interface Variants { [key: string]: any }
  export function useInView(...args: any[]): any;
  export function useScroll(...args: any[]): any;
  export function useTransform(...args: any[]): any;
  export function useMotionValue(...args: any[]): any;
  export function useMotionTemplate(...args: any[]): any;
  export function useSpring(...args: any[]): any;
}

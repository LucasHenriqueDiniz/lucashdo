declare module 'motion/react' {
  export const motion: any;
  export const AnimatePresence: any;
  export interface HTMLMotionProps<T = any> {
    [key: string]: any;
  }
  export interface SpringOptions { [key: string]: any }
  export interface UseInViewOptions { [key: string]: any }
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

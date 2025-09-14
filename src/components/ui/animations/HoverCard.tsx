import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface HoverCardProps {
  children: ReactNode;
  className?: string;
}

export default function HoverCard({ children, className = '' }: HoverCardProps) {
  return (
    <div
      className={cn(
        'transition-transform duration-200 hover:scale-[1.02] active:scale-95',
        className
      )}
    >
      {children}
    </div>
  );
}

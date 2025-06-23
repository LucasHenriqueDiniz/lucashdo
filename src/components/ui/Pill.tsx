/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const pillVariants = cva(
  'flex items-center justify-center rounded-full text-sm font-bold whitespace-nowrap transition-colors shadow-md',
  {
    variants: {
      variant: {
        default: 'bg-[var(--primary)] text-[var(--foreground)]',
        accent: 'bg-[var(--accent)] text-[var(--primary)]',
        outline: 'border border-[var(--primary)] bg-transparent text-[var(--primary)]',
      },
      size: {
        sm: 'px-3 py-1 text-xs',
        default: 'px-4 py-1.5',
        lg: 'px-6 py-2',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      fullWidth: false,
    },
  }
);

export interface PillProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pillVariants> {
  children: React.ReactNode;
  active?: boolean;
}

const Pill = React.forwardRef<HTMLDivElement, PillProps>(
  ({ className, variant, size, fullWidth, active, children, ...props }, ref) => {
    // If active is provided, automatically use the accent variant when active
    const activeVariant = active ? 'accent' : variant;

    return (
      <div
        ref={ref}
        className={cn(pillVariants({ variant: activeVariant, size, fullWidth, className }))}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Pill.displayName = 'Pill';

export { Pill, pillVariants };

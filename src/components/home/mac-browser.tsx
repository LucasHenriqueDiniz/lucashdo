'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MacBrowserProps {
  className?: string;
  children: React.ReactNode;
}

export function MacBrowser({ className, children }: MacBrowserProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={cn('w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl', className)}
    >
      {/* Browser header */}
      <div className="bg-muted/50 backdrop-blur-sm border-b border-border p-3 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-muted rounded-full px-4 py-1 text-sm text-muted-foreground flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            lucashdo.dev
          </div>
        </div>
      </div>

      {/* Browser content */}
      <div className=" min-h-[400px] p-4">{children}</div>
    </motion.div>
  );
}

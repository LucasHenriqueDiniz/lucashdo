'use client';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { sixteenBitLogo } from '../../../public';

type RouteHeaderProps = {
  rightSlot?: ReactNode;
  className?: string;
};

const RouteHeader: React.FC<RouteHeaderProps> = ({ rightSlot, className }) => {
  return (
    <header
      className={clsx(
        'not-found-header pointer-events-none fixed inset-x-0 top-0 z-[70] px-4 pt-6 sm:px-6',
        className
      )}
    >
      <div className="pointer-events-auto mx-auto flex w-full max-w-4xl items-center justify-between gap-4 rounded-2xl border border-white/12 bg-[rgba(9,14,30,0.72)] px-4 py-3 shadow-[0_14px_50px_rgba(5,12,34,0.5)] backdrop-blur-lg">
        <Link
          href="/"
          className="group flex items-center gap-3 text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63b3ff]/60"
        >
          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-white/18 bg-[#101c3d]/82 shadow-[0_12px_28px_rgba(3,10,36,0.45)]">
            <Image
              src={sixteenBitLogo}
              alt="LHDO 16-bit"
              width={40}
              height={40}
              priority
              style={{ imageRendering: 'pixelated' }}
            />
            <span className="pointer-events-none absolute inset-0 rounded-lg bg-white/18 opacity-0 transition group-hover:opacity-40" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[0.5rem] uppercase tracking-[0.48em] text-white/55">
              Route Missing
            </span>
            <span className="text-sm font-semibold uppercase tracking-[0.4em] text-white">
              404 Battle
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3 text-[0.52rem] uppercase tracking-[0.32em] text-white/70">
          {rightSlot ? (
            <div className="flex items-center gap-3">{rightSlot}</div>
          ) : (
            <span className="relative inline-flex items-center justify-center overflow-hidden rounded-lg border border-white/16 bg-white/10 px-3 py-2 text-white shadow-[0_10px_24px_rgba(12,24,60,0.45)]">
              <span className="absolute inset-0 rounded-lg bg-white/25 opacity-0 transition hover:opacity-45" />
              <span className="relative z-10">Press Start</span>
            </span>
          )}
        </div>
      </div>
    </header>
  );
};

export default RouteHeader;

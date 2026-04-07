'use client';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import DesktopHero from './Hero';
import HeroMobile from './HeroMobile';

export default function Hero() {
  const isDesktop = useMediaQuery('(min-width: 768px)', false);

  return isDesktop ? <DesktopHero /> : <HeroMobile />;
}

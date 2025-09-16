'use client';

import { useEffect, useState } from 'react';
import DesktopHero from './Hero';
import HeroMobile from './HeroMobile';

const DESKTOP_BREAKPOINT = '(min-width: 768px)';

export default function Hero() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_BREAKPOINT);

    const updateMatch = (query: MediaQueryList | MediaQueryListEvent) => {
      setIsDesktop(query.matches);
    };

    const handleChange = (event: MediaQueryListEvent) => {
      updateMatch(event);
    };

    updateMatch(mediaQuery);

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  if (isDesktop === null) {
    return <HeroMobile />;
  }

  return isDesktop ? <DesktopHero /> : <HeroMobile />;
}

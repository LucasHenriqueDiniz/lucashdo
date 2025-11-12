'use client';

import { createContext, ReactNode, useContext } from 'react';

interface AboutSectionControllerValue {
  activeSection: string;
  isSectionActive: (id: string) => boolean;
}

const AboutSectionControllerContext = createContext<AboutSectionControllerValue | undefined>(
  undefined
);

interface AboutSectionControllerProviderProps {
  activeSection: string;
  children: ReactNode;
}

export function AboutSectionControllerProvider({
  activeSection,
  children,
}: AboutSectionControllerProviderProps) {
  const value: AboutSectionControllerValue = {
    activeSection,
    isSectionActive: id => id === activeSection,
  };

  return (
    <AboutSectionControllerContext.Provider value={value}>
      {children}
    </AboutSectionControllerContext.Provider>
  );
}

export function useAboutSectionController() {
  const context = useContext(AboutSectionControllerContext);
  if (!context) {
    throw new Error('useAboutSectionController must be used within AboutSectionControllerProvider');
  }
  return context;
}

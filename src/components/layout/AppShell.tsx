'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

type AppShellContextValue = {
  isVisible: boolean;
  hide: () => void;
  show: () => void;
  setVisibility: (visible: boolean) => void;
};

const AppShellContext = createContext<AppShellContextValue | undefined>(undefined);

const Header = dynamic(() => import('./Header'));
const MobileMenu = dynamic(() => import('./Header').then(mod => ({ default: mod.MobileMenu })));
const Footer = dynamic(() => import('./Footer'));

const HIDDEN_PATH_PREFIXES = ['/about', '/cv'];

function shouldHideChrome(pathname: string | null): boolean {
  if (!pathname) {
    return false;
  }

  return HIDDEN_PATH_PREFIXES.some(
    prefix => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function useAppShell() {
  const context = useContext(AppShellContext);

  if (!context) {
    throw new Error('useAppShell must be used within an AppShell component');
  }

  return context;
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const derivedVisibility = useMemo(() => !shouldHideChrome(pathname), [pathname]);
  const [isVisible, setIsVisible] = useState<boolean>(derivedVisibility);

  useEffect(() => {
    setIsVisible(derivedVisibility);
  }, [derivedVisibility]);

  const hide = useCallback(() => setIsVisible(false), []);
  const show = useCallback(() => setIsVisible(true), []);
  const setVisibility = useCallback((visible: boolean) => setIsVisible(visible), []);

  const value = useMemo<AppShellContextValue>(
    () => ({
      isVisible,
      hide,
      show,
      setVisibility,
    }),
    [hide, isVisible, setVisibility, show]
  );

  useEffect(() => {
    document.body.dataset.appShell = isVisible ? 'visible' : 'hidden';
    return () => {
      delete document.body.dataset.appShell;
    };
  }, [isVisible]);

  return (
    <AppShellContext.Provider value={value}>
      <div className="flex min-h-screen flex-col">
        {isVisible && <Header />}
        {isVisible && <MobileMenu />}
        <div className="flex-1">{children}</div>
        {isVisible && <Footer />}
      </div>
    </AppShellContext.Provider>
  );
}

export default AppShell;

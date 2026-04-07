import React from 'react';
import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

class MockIntersectionObserver {
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();

  constructor(_callback: IntersectionObserverCallback, _options?: IntersectionObserverInit) {}
}

vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
vi.stubGlobal(
  'requestAnimationFrame',
  vi.fn((callback: FrameRequestCallback) => window.setTimeout(() => callback(performance.now()), 16))
);
vi.stubGlobal('cancelAnimationFrame', vi.fn((id: number) => window.clearTimeout(id)));

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => React.createElement('img', props),
}));

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) =>
    React.createElement('a', { href, ...props }, children),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
}));

vi.mock('next-intl', () => ({
  useTranslations:
    (namespace?: string) =>
    (key: string) =>
      namespace ? `${namespace}.${key}` : key,
}));

vi.mock('next/dynamic', () => ({
  default: (loader: () => Promise<unknown>, options?: { loading?: () => React.ReactNode }) => {
    const DynamicComponent = (props: Record<string, unknown>) => {
      const [Loaded, setLoaded] = React.useState<React.ComponentType<Record<string, unknown>> | null>(null);

      React.useEffect(() => {
        let mounted = true;

        loader().then((mod: unknown) => {
          const resolved = mod as { default?: React.ComponentType<Record<string, unknown>> };
          if (mounted) {
            setLoaded(() => resolved.default ?? (resolved as React.ComponentType<Record<string, unknown>>));
          }
        });

        return () => {
          mounted = false;
        };
      }, []);

      if (!Loaded) {
        return options?.loading ? options.loading() : null;
      }

      return React.createElement(Loaded, props);
    };

    return DynamicComponent;
  },
}));

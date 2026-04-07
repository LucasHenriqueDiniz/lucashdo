import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

let inViewport = true;
let isTablet = false;
let prefersReducedMotion = false;
const laserFlowSpy = vi.fn();

vi.mock('@/hooks/useIntersectionObserver', () => ({
  useIntersectionObserver: () => inViewport,
}));

vi.mock('@/hooks/useMediaQuery', () => ({
  useMediaQuery: (query: string) => {
    if (query.includes('1023')) {
      return isTablet;
    }

    if (query.includes('prefers-reduced-motion')) {
      return prefersReducedMotion;
    }

    if (query.includes('768')) {
      return true;
    }

    return false;
  },
}));

vi.mock('@/components/effects/LaserFlow', () => ({
  LaserFlowWithFallback: (props: Record<string, unknown>) => {
    laserFlowSpy(props);
    return React.createElement('div', {
      'data-testid': 'hero-laserflow',
      'data-paused': String(props.paused),
    });
  },
}));

vi.mock('./Hero.css', () => ({}));

vi.mock('framer-motion', async () => {
  const ReactModule = await import('react');

  const motion = new Proxy(
    {},
    {
      get: (_target, tag: string) =>
        ReactModule.forwardRef(
          (
            props: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode },
            ref: React.Ref<HTMLElement>
          ) => ReactModule.createElement(tag, { ...props, ref }, props.children)
        ),
    }
  );

  return {
    motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) =>
      ReactModule.createElement(ReactModule.Fragment, null, children),
  };
});

vi.mock('./AnimatedRole', () => ({
  default: () => React.createElement('div', { 'data-testid': 'animated-role' }, 'Animated role'),
}));

vi.mock('@/components/animate-ui/text/typing', () => ({
  TypingText: ({ text }: { text: string[] }) =>
    React.createElement('div', { 'data-testid': 'typing-text' }, text.join(', ')),
}));

import DesktopHero from './Hero';
import HeroMobile from './HeroMobile';

describe('Hero integration', () => {
  beforeEach(() => {
    inViewport = true;
    isTablet = false;
    prefersReducedMotion = false;
    laserFlowSpy.mockReset();
  });

  it('renders the layered desktop hero and updates the reveal position from mouse input', async () => {
    render(<DesktopHero />);

    const section = screen.getByLabelText('Hero section with animated background');
    const revealLayer = screen.getByTestId('hero-reveal-layer');

    fireEvent.mouseEnter(section);
    fireEvent.mouseMove(section, {
      clientX: 120,
      clientY: 80,
    });

    expect(screen.getByTestId('hero-gradient-overlay')).toBeInTheDocument();
    expect(revealLayer.getAttribute('style')).toContain('--mouse-x: 120px');
    expect(revealLayer.getAttribute('style')).toContain('--mouse-y: 80px');
    expect(screen.getByRole('button', { name: 'View Lucas HDO projects' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Contact Lucas HDO' })).toBeInTheDocument();
  });

  it('pauses LaserFlow when the hero leaves the viewport', async () => {
    inViewport = false;
    render(<DesktopHero />);

    await waitFor(() => expect(screen.getByTestId('hero-laserflow')).toBeInTheDocument());
    expect(screen.getByTestId('hero-laserflow')).toHaveAttribute('data-paused', 'true');
  });

  it('renders the mobile hero and updates the reveal position from touch input', async () => {
    render(<HeroMobile />);

    const section = screen.getByLabelText('Mobile hero section with interactive background');
    const revealLayer = section.querySelector('.hero-reveal-layer');

    fireEvent.touchStart(section, {
      touches: [{ clientX: 20, clientY: 25 }],
    });
    fireEvent.touchMove(section, {
      touches: [{ clientX: 44, clientY: 72 }],
    });

    expect(revealLayer?.getAttribute('style')).toContain('--mouse-x: 44px');
    expect(revealLayer?.getAttribute('style')).toContain('--mouse-y: 72px');
    expect(screen.getByRole('button', { name: 'Navigation.projects' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Navigation.contact' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Navigation.viewCV' })).toBeInTheDocument();
  });
});

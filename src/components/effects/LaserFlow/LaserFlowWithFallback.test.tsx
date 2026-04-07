import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

let prefersReducedMotion = false;
let isMobile = false;
let hasWebGL = true;
let shouldThrow = false;
const laserFlowPropsSpy = vi.fn();

vi.mock('@/hooks/useMediaQuery', () => ({
  useMediaQuery: (query: string) => {
    if (query.includes('prefers-reduced-motion')) {
      return prefersReducedMotion;
    }

    if (query.includes('767')) {
      return isMobile;
    }

    return false;
  },
}));

vi.mock('@/utils/webgl', async () => {
  const actual = await vi.importActual<typeof import('@/utils/webgl')>('@/utils/webgl');

  return {
    ...actual,
    checkWebGLSupport: () => hasWebGL,
  };
});

vi.mock('./LaserFlow', () => ({
  LaserFlow: (props: Record<string, unknown>) => {
    laserFlowPropsSpy(props);

    if (shouldThrow) {
      throw new Error('render failed');
    }

    return React.createElement('div', {
      'data-testid': 'laserflow-live',
      'data-paused': String(props.paused),
      'data-fog-intensity': String(props.fogIntensity),
    });
  },
}));

import { LaserFlowWithFallback } from './LaserFlowWithFallback';

describe('LaserFlowWithFallback', () => {
  beforeEach(() => {
    prefersReducedMotion = false;
    isMobile = false;
    hasWebGL = true;
    shouldThrow = false;
    laserFlowPropsSpy.mockReset();
  });

  it('renders the fallback when WebGL is unavailable', async () => {
    hasWebGL = false;
    render(<LaserFlowWithFallback color="#49BAD6" />);

    expect(await screen.findByTestId('laserflow-fallback')).toBeInTheDocument();
  });

  it('renders the fallback when reduced motion is preferred', async () => {
    prefersReducedMotion = true;
    render(<LaserFlowWithFallback />);

    expect(await screen.findByTestId('laserflow-fallback')).toBeInTheDocument();
  });

  it('renders LaserFlow and applies mobile performance overrides', async () => {
    isMobile = true;
    render(<LaserFlowWithFallback fogIntensity={0.4} />);

    await waitFor(() => expect(screen.getByTestId('laserflow-live')).toBeInTheDocument());
    expect(laserFlowPropsSpy).toHaveBeenCalled();

    const lastCall = laserFlowPropsSpy.mock.calls.at(-1)?.[0] as { fogIntensity: number; wispDensity: number };

    expect(lastCall.fogIntensity).toBe(0);
    expect(lastCall.wispDensity).toBe(0.3);
  });

  it('falls back when the LaserFlow render path throws', async () => {
    shouldThrow = true;
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(<LaserFlowWithFallback />);

    expect(await screen.findByTestId('laserflow-fallback')).toBeInTheDocument();
    expect(errorSpy).toHaveBeenCalled();
  });
});

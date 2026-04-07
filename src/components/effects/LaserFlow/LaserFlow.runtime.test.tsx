import React from 'react';
import { act, render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { createLaserFlowSceneMock, syncLaserFlowUniformsMock } = vi.hoisted(() => ({
  createLaserFlowSceneMock: vi.fn(),
  syncLaserFlowUniformsMock: vi.fn(),
}));

vi.mock('./utils', async () => {
  const actual = await vi.importActual<typeof import('./utils')>('./utils');

  return {
    ...actual,
    createLaserFlowScene: createLaserFlowSceneMock,
    syncLaserFlowUniforms: syncLaserFlowUniformsMock,
  };
});

import { LaserFlow } from './LaserFlow';

describe('LaserFlow component runtime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    createLaserFlowSceneMock.mockReset();
    syncLaserFlowUniformsMock.mockReset();
  });

  it('starts the animation loop, syncs props, and stops cleanly', () => {
    const fakeScene = {
      scene: {},
      camera: {},
      renderer: { render: vi.fn() },
      material: { uniforms: { time: { value: 0 } } },
      geometry: {},
      mesh: {},
      resize: vi.fn(),
      destroy: vi.fn(),
    };

    createLaserFlowSceneMock.mockReturnValue(fakeScene);

    const { rerender, unmount } = render(<LaserFlow monitorPerformance />);

    expect(createLaserFlowSceneMock).toHaveBeenCalled();
    expect(syncLaserFlowUniformsMock).toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(40);
    });

    expect(fakeScene.renderer.render).toHaveBeenCalled();

    const renderCount = fakeScene.renderer.render.mock.calls.length;

    rerender(<LaserFlow paused />);

    act(() => {
      vi.advanceTimersByTime(40);
    });

    expect(fakeScene.renderer.render.mock.calls.length).toBe(renderCount);

    unmount();

    expect(fakeScene.destroy).toHaveBeenCalled();
    vi.useRealTimers();
  });
});

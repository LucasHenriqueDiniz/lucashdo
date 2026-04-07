import { describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import * as THREE from 'three';
import {
  LASER_FLOW_DEFAULTS,
  createLaserFlowMaterial,
  createLaserFlowScene,
  createLaserFlowUniforms,
  parseLaserFlowColor,
  resolveLaserFlowProps,
} from './utils';

function createContainer() {
  let width = 640;
  let height = 360;
  const container = document.createElement('div');

  Object.defineProperties(container, {
    clientWidth: {
      get: () => width,
    },
    clientHeight: {
      get: () => height,
    },
  });

  return {
    container,
    resizeTo(nextWidth: number, nextHeight: number) {
      width = nextWidth;
      height = nextHeight;
    },
  };
}

function createRendererStub() {
  return {
    domElement: document.createElement('canvas'),
    setPixelRatio: vi.fn(),
    setSize: vi.fn(),
    render: vi.fn(),
    dispose: vi.fn(),
  };
}

describe('LaserFlow utilities', () => {
  it('resolves default props and clamps out-of-range values', () => {
    const resolved = resolveLaserFlowProps({
      wispDensity: 8,
      flowStrength: -1,
      horizontalBeamOffset: 4,
      color: 'not-a-color',
    });

    expect(resolved.wispDensity).toBe(1);
    expect(resolved.flowStrength).toBe(0);
    expect(resolved.horizontalBeamOffset).toBe(1);
    expect(resolved.color).toBe(LASER_FLOW_DEFAULTS.color);
  });

  it('parses valid colors and falls back to the default color', () => {
    expect(parseLaserFlowColor('#49BAD6').getHexString()).toBe('49bad6');
    expect(parseLaserFlowColor('invalid').getHexString()).toBe('0184fc');
  });

  it('creates shader uniforms from props', () => {
    const uniforms = createLaserFlowUniforms(resolveLaserFlowProps({ disableFog: true }));

    expect(uniforms.color.value).toBeInstanceOf(THREE.Color);
    expect(uniforms.time.value).toBe(0);
    expect(uniforms.fogIntensity.value).toBe(0);
  });

  it('creates a shader material and exposes all required uniforms', () => {
    const material = createLaserFlowMaterial(resolveLaserFlowProps({ color: '#49BAD6' }));

    expect(material).toBeInstanceOf(THREE.ShaderMaterial);
    expect(material.uniforms.color.value.getHexString()).toBe('49bad6');
    expect(material.uniforms.wispDensity.value).toBeGreaterThan(0);
  });

  it('surfaces shader creation failures for error handling', () => {
    expect(() =>
      createLaserFlowMaterial(resolveLaserFlowProps(), {
        materialFactory: () => {
          throw new Error('shader compile failed');
        },
      })
    ).toThrow('shader compile failed');
  });

  it('initializes, resizes, and disposes the Three.js scene', () => {
    const { container, resizeTo } = createContainer();
    const rendererStub = createRendererStub();
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const scene = createLaserFlowScene({
      container,
      props: resolveLaserFlowProps(),
      rendererFactory: () => rendererStub as unknown as THREE.WebGLRenderer,
    });

    expect((rendererStub.setPixelRatio as Mock).mock.calls[0][0]).toBeLessThanOrEqual(
      LASER_FLOW_DEFAULTS.pixelRatioCap
    );
    expect(rendererStub.setSize).toHaveBeenCalledWith(640, 360, false);
    expect(container.contains(rendererStub.domElement)).toBe(true);
    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

    resizeTo(800, 400);
    scene.resize();

    expect(rendererStub.setSize).toHaveBeenLastCalledWith(800, 400, false);
    expect(scene.camera.aspect).toBe(2);

    scene.destroy();

    expect(rendererStub.dispose).toHaveBeenCalled();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(container.contains(rendererStub.domElement)).toBe(false);
  });
});

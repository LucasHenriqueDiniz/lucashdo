'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import {
  LASER_FLOW_DEFAULTS,
  createLaserFlowScene,
  resolveLaserFlowProps,
  syncLaserFlowUniforms,
  type LaserFlowProps,
  type LaserFlowSceneInstance,
} from './utils';

export type { LaserFlowProps } from './utils';
export { LASER_FLOW_DEFAULTS } from './utils';

export function LaserFlow(rawProps: LaserFlowProps) {
  const props = resolveLaserFlowProps(rawProps);
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<LaserFlowSceneInstance | null>(null);
  const rafRef = useRef<number | null>(null);
  const startedAtRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);
  const { fps, trackFrame } = usePerformanceMonitor();

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const scene = createLaserFlowScene({
      container,
      props,
    });

    sceneRef.current = scene;
    startedAtRef.current = performance.now() - pausedAtRef.current;

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      scene.destroy();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current) {
      return;
    }

    syncLaserFlowUniforms(sceneRef.current.material, props);
    sceneRef.current.resize();
  }, [props]);

  useEffect(() => {
    const scene = sceneRef.current;

    if (!scene) {
      return;
    }

    if (props.paused) {
      pausedAtRef.current = performance.now() - startedAtRef.current;

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      return;
    }

    startedAtRef.current = performance.now() - pausedAtRef.current;

    let lastFrameTime = performance.now();

    const animate = (now: number) => {
      const activeScene = sceneRef.current;

      if (!activeScene) {
        return;
      }

      const elapsedSeconds = (now - startedAtRef.current) / 1000;
      activeScene.material.uniforms.time.value = elapsedSeconds;
      activeScene.renderer.render(activeScene.scene, activeScene.camera);
      trackFrame(now - lastFrameTime);
      lastFrameTime = now;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [props.paused, trackFrame]);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development' || !props.monitorPerformance) {
      return;
    }

    if (fps > 0 && fps < LASER_FLOW_DEFAULTS.performanceWarningFps) {
      console.info(`[LaserFlow] average fps ${fps}`);
    }
  }, [fps, props.monitorPerformance]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      data-testid="laserflow"
      className={cn(
        'laserflow-container pointer-events-none absolute inset-0 overflow-hidden',
        rawProps.className
      )}
      style={{
        transform: 'translateZ(0)',
        willChange: 'transform, opacity',
      }}
    />
  );
}

export default LaserFlow;

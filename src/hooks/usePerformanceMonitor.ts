'use client';

import { useCallback, useRef, useState } from 'react';

const SAMPLE_SIZE = 24;

export function usePerformanceMonitor() {
  const frameDurationsRef = useRef<number[]>([]);
  const [fps, setFps] = useState(0);

  const trackFrame = useCallback((duration: number) => {
    if (duration <= 0) {
      return;
    }

    frameDurationsRef.current.push(duration);

    if (frameDurationsRef.current.length > SAMPLE_SIZE) {
      frameDurationsRef.current.shift();
    }

    const total = frameDurationsRef.current.reduce((sum, current) => sum + current, 0);
    const averageFrameTime = total / frameDurationsRef.current.length;
    setFps(Math.round(1000 / averageFrameTime));
  }, []);

  return {
    fps,
    trackFrame,
  };
}

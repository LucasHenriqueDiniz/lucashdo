'use client';

import React from 'react';

/**
 * StaticGradient Component Props Interface
 * 
 * Defines customizable properties for the static gradient fallback.
 * All properties are optional with sensible defaults matching LaserFlow.
 */
export interface StaticGradientProps {
  /** Hex color for gradient effect. Default: '#0184FC' (blue) */
  color?: string;
  /** Additional CSS class names */
  className?: string;
}

/**
 * StaticGradient Component
 * 
 * Provides a static CSS gradient fallback for when WebGL is not supported.
 * Matches the LaserFlow aesthetic with blue/cyan theme but without animations.
 * 
 * This component is designed to be a performant, accessible alternative that
 * provides a visually similar but simpler experience compared to LaserFlow.
 * 
 * @example
 * ```tsx
 * <StaticGradient color="#0184FC" />
 * ```
 */
export const StaticGradient: React.FC<StaticGradientProps> = ({
  color = '#0184FC',
  className = '',
}) => {
  return (
    <div
      className={`static-gradient-container ${className}`}
      data-testid="laserflow-fallback"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background: `
          radial-gradient(circle at 18% 18%, rgba(73, 186, 214, 0.22), transparent 28%),
          radial-gradient(circle at 78% 28%, rgba(1, 132, 252, 0.28), transparent 36%),
          radial-gradient(circle at 54% 68%, ${color}30 0%, transparent 40%),
          linear-gradient(135deg, rgba(3, 7, 18, 0.98) 0%, rgba(6, 13, 28, 0.94) 45%, rgba(1, 31, 63, 0.86) 100%)
        `,
        transform: 'translateZ(0)',
      }}
      aria-hidden="true"
    />
  );
};

export default StaticGradient;

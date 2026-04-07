'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { checkWebGLSupport } from '@/utils/webgl';
import { StaticGradient } from '@/components/effects/StaticGradient';
import { LaserFlow } from './LaserFlow';
import { LaserFlowErrorBoundary } from './LaserFlowErrorBoundary';
import {
  MOBILE_LASER_FLOW_OVERRIDES,
  resolveLaserFlowProps,
  type LaserFlowProps,
} from './utils';

export function LaserFlowWithFallback(props: LaserFlowProps) {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);
  const [renderFailed, setRenderFailed] = useState(false);

  useEffect(() => {
    setHasWebGL(checkWebGLSupport());
  }, []);

  const effectiveProps = useMemo(() => {
    const base = resolveLaserFlowProps(props);

    if (!isMobile) {
      return base;
    }

    return resolveLaserFlowProps({
      ...base,
      ...MOBILE_LASER_FLOW_OVERRIDES,
    });
  }, [isMobile, props]);

  if (hasWebGL === null || !hasWebGL || prefersReducedMotion || renderFailed) {
    return <StaticGradient color={effectiveProps.color} className={props.className} />;
  }

  return (
    <LaserFlowErrorBoundary
      fallback={<StaticGradient color={effectiveProps.color} className={props.className} />}
      onError={() => setRenderFailed(true)}
    >
      <LaserFlow {...effectiveProps} />
    </LaserFlowErrorBoundary>
  );
}

export default LaserFlowWithFallback;

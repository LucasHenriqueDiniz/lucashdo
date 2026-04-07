'use client';

import { RefObject, useEffect, useState } from 'react';

type IntersectionOptions = IntersectionObserverInit & {
  fallback?: boolean;
};

export function useIntersectionObserver<T extends Element>(
  ref: RefObject<T | null>,
  options: IntersectionOptions = {}
) {
  const { fallback = true, ...observerOptions } = options;
  const [isIntersecting, setIsIntersecting] = useState(fallback);

  useEffect(() => {
    const node = ref.current;

    if (!node || typeof IntersectionObserver === 'undefined') {
      setIsIntersecting(fallback);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, observerOptions);

    observer.observe(node);

    return () => observer.disconnect();
  }, [fallback, observerOptions.root, observerOptions.rootMargin, observerOptions.threshold, ref]);

  return isIntersecting;
}

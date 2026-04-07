/**
 * WebGL Support Detection Utility
 * 
 * Provides functions to detect WebGL support in the browser.
 * Used to determine if WebGL-based effects can be rendered or if fallbacks are needed.
 */

/**
 * Checks if the browser supports WebGL rendering.
 * 
 * Attempts to create a canvas element and get a WebGL context.
 * Tests both 'webgl' and 'experimental-webgl' contexts for broader compatibility.
 * 
 * @returns {boolean} true if WebGL is supported, false otherwise
 * 
 * @example
 * ```typescript
 * if (checkWebGLSupport()) {
 *   // Render WebGL effects
 * } else {
 *   // Use fallback rendering
 * }
 * ```
 */
export const checkWebGLSupport = (): boolean => {
  if (typeof document === 'undefined') {
    return false;
  }

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch {
    return false;
  }
};

export const isHexColor = (value: string | undefined | null): value is string =>
  typeof value === 'string' && /^#(?:[0-9a-fA-F]{3}){1,2}$/.test(value);

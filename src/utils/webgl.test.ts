import { checkWebGLSupport } from './webgl';
import { afterEach, describe, expect, it, vi } from 'vitest';

describe('checkWebGLSupport', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return true when WebGL context is available', () => {
    const originalCreateElement = document.createElement.bind(document);
    const mockCanvas = {
      getContext: vi.fn((contextType: string) => {
        if (contextType === 'webgl') {
          return {};
        }
        return null;
      }),
    };

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        return mockCanvas as HTMLCanvasElement;
      }
      return originalCreateElement(tagName);
    });

    const result = checkWebGLSupport();
    expect(result).toBe(true);
    expect(mockCanvas.getContext).toHaveBeenCalledWith('webgl');
  });

  it('should return true when experimental-webgl context is available', () => {
    const mockCanvas = {
      getContext: vi.fn((contextType: string) => {
        if (contextType === 'experimental-webgl') {
          return {};
        }
        return null;
      }),
    };

    const originalCreateElement = document.createElement.bind(document);

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        return mockCanvas as HTMLCanvasElement;
      }
      return originalCreateElement(tagName);
    });

    const result = checkWebGLSupport();
    expect(result).toBe(true);
    expect(mockCanvas.getContext).toHaveBeenCalledWith('webgl');
    expect(mockCanvas.getContext).toHaveBeenCalledWith('experimental-webgl');
  });

  it('should return false when no WebGL context is available', () => {
    const mockCanvas = {
      getContext: vi.fn(() => null),
    };

    const originalCreateElement = document.createElement.bind(document);

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        return mockCanvas as HTMLCanvasElement;
      }
      return originalCreateElement(tagName);
    });

    const result = checkWebGLSupport();
    expect(result).toBe(false);
  });

  it('should return false when an error occurs during context creation', () => {
    const mockCanvas = {
      getContext: vi.fn(() => {
        throw new Error('WebGL not supported');
      }),
    };

    const originalCreateElement = document.createElement.bind(document);

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        return mockCanvas as HTMLCanvasElement;
      }
      return originalCreateElement(tagName);
    });

    const result = checkWebGLSupport();
    expect(result).toBe(false);
  });

  it('should return false when canvas creation fails', () => {
    vi.spyOn(document, 'createElement').mockImplementation(() => {
      throw new Error('Cannot create canvas');
    });

    const result = checkWebGLSupport();
    expect(result).toBe(false);
  });

  it('should handle null or undefined context gracefully', () => {
    const mockCanvas = {
      getContext: vi.fn(() => undefined),
    };

    const originalCreateElement = document.createElement.bind(document);

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      if (tagName === 'canvas') {
        return mockCanvas as HTMLCanvasElement;
      }
      return originalCreateElement(tagName);
    });

    const result = checkWebGLSupport();
    expect(result).toBe(false);
  });
});

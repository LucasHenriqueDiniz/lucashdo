import type { ISourceOptions } from '@tsparticles/engine';

// Preset 1: Network/Tech style (atual)
export const networkPreset: ISourceOptions = {
  background: {
    color: {
      value: 'transparent',
    },
  },
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: 'push',
      },
      onHover: {
        enable: true,
        mode: 'repulse',
      },
    },
    modes: {
      push: {
        quantity: 2,
      },
      repulse: {
        distance: 100,
        duration: 0.4,
      },
    },
  },
  particles: {
    color: {
      value: ['#60A5FA', '#22D3EE', '#3B82F6'],
    },
    links: {
      color: '#60A5FA',
      distance: 150,
      enable: true,
      opacity: 0.3,
      width: 1,
    },
    move: {
      direction: 'none',
      enable: true,
      outModes: {
        default: 'out',
      },
      random: false,
      speed: 1,
      straight: false,
    },
    number: {
      density: {
        enable: true,
      },
      value: 40,
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: 'circle',
    },
    size: {
      value: { min: 1, max: 3 },
    },
  },
  detectRetina: true,
};

// Preset 2: Starry Night
export const starryPreset: ISourceOptions = {
  background: {
    color: {
      value: 'transparent',
    },
  },
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: 'push',
      },
      onHover: {
        enable: true,
        mode: 'bubble',
      },
    },
    modes: {
      push: {
        quantity: 4,
      },
      bubble: {
        distance: 200,
        size: 6,
        duration: 0.3,
        opacity: 0.8,
      },
    },
  },
  particles: {
    color: {
      value: ['#ffffff', '#60A5FA', '#22D3EE'],
    },
    links: {
      enable: false,
    },
    move: {
      direction: 'none',
      enable: true,
      outModes: {
        default: 'out',
      },
      random: true,
      speed: 0.3,
      straight: false,
    },
    number: {
      density: {
        enable: true,
      },
      value: 120,
    },
    opacity: {
      value: 0.8,
    },
    shape: {
      type: 'star',
    },
    size: {
      value: { min: 1, max: 4 },
    },
  },
  detectRetina: true,
};

// Preset 3: Hexagons (Tech/Geometric)
export const hexagonsPreset: ISourceOptions = {
  background: {
    color: {
      value: 'transparent',
    },
  },
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: 'push',
      },
      onHover: {
        enable: true,
        mode: 'grab',
      },
    },
    modes: {
      push: {
        quantity: 2,
      },
      grab: {
        distance: 140,
        links: {
          opacity: 0.5,
        },
      },
    },
  },
  particles: {
    color: {
      value: ['#3B82F6', '#22D3EE', '#8B5CF6'],
    },
    links: {
      color: '#60A5FA',
      distance: 120,
      enable: true,
      opacity: 0.2,
      width: 1,
    },
    move: {
      direction: 'none',
      enable: true,
      outModes: {
        default: 'bounce',
      },
      random: false,
      speed: 0.8,
      straight: false,
    },
    number: {
      density: {
        enable: true,
      },
      value: 25,
    },
    opacity: {
      value: 0.6,
    },
    shape: {
      type: 'polygon',
    },
    size: {
      value: { min: 3, max: 8 },
    },
  },
  detectRetina: true,
};

// Preset 4: Light Particles (Minimal)
export const lightPreset: ISourceOptions = {
  background: {
    color: {
      value: 'transparent',
    },
  },
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: 'repulse',
      },
      onHover: {
        enable: true,
        mode: 'slow',
      },
    },
    modes: {
      repulse: {
        distance: 200,
        duration: 0.4,
      },
      slow: {
        factor: 3,
        radius: 200,
      },
    },
  },
  particles: {
    color: {
      value: ['#60A5FA', '#22D3EE', '#F0F9FF'],
    },
    links: {
      enable: false,
    },
    move: {
      direction: 'top',
      enable: true,
      outModes: {
        default: 'out',
      },
      random: true,
      speed: 0.5,
      straight: false,
    },
    number: {
      density: {
        enable: true,
      },
      value: 60,
    },
    opacity: {
      value: 0.3,
    },
    shape: {
      type: 'circle',
    },
    size: {
      value: { min: 1, max: 5 },
    },
  },
  detectRetina: true,
};

// Preset 5: Floating Bubbles
export const bubblesPreset: ISourceOptions = {
  background: {
    color: {
      value: 'transparent',
    },
  },
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: 'push',
      },
      onHover: {
        enable: true,
        mode: 'bubble',
      },
    },
    modes: {
      push: {
        quantity: 3,
      },
      bubble: {
        distance: 150,
        size: 10,
        duration: 2,
        opacity: 0.8,
      },
    },
  },
  particles: {
    color: {
      value: ['#22D3EE', '#60A5FA', '#3B82F6'],
    },
    links: {
      enable: false,
    },
    move: {
      direction: 'top',
      enable: true,
      outModes: {
        default: 'out',
      },
      random: true,
      speed: 1,
      straight: false,
    },
    number: {
      density: {
        enable: true,
      },
      value: 30,
    },
    opacity: {
      value: 0.4,
    },
    shape: {
      type: 'circle',
    },
    size: {
      value: { min: 2, max: 8 },
    },
  },
  detectRetina: true,
};

// Preset 6: Among Us (cores e shapes inspirados no jogo)
export const amongUsPreset: ISourceOptions = {
  background: { color: { value: 'transparent' } },
  fpsLimit: 60,
  interactivity: {
    events: {
      onClick: { enable: true, mode: 'push' },
      onHover: { enable: true, mode: 'repulse' },
    },
    modes: {
      push: { quantity: 3 },
      repulse: { distance: 120, duration: 0.4 },
    },
  },
  particles: {
    color: { value: ['#e74c3c', '#3498db', '#f1c40f', '#2ecc71', '#9b59b6', '#ecf0f1'] },
    links: {
      enable: false,
    },
    move: {
      direction: 'none',
      enable: true,
      outModes: { default: 'out' },
      random: true,
      speed: 1.2,
      straight: false,
    },
    number: {
      density: { enable: true },
      value: 30,
    },
    opacity: { value: 0.8 },
    shape: {
      type: 'circle',
    },
    size: {
      value: { min: 8, max: 16 },
    },
  },
  detectRetina: true,
};

// Preset 7: Sea Anemone (tentáculos animados, linhas e partículas)
export const seaAnemonePreset: ISourceOptions = {
  background: { color: { value: 'transparent' } },
  fpsLimit: 60,
  interactivity: {
    events: {
      onHover: { enable: true, mode: 'grab' },
      onClick: { enable: true, mode: 'push' },
    },
    modes: {
      grab: {
        distance: 180,
        links: { opacity: 0.6 },
      },
      push: { quantity: 2 },
    },
  },
  particles: {
    color: { value: ['#22d3ee', '#38bdf8', '#a5f3fc', '#f0fdfa'] },
    links: {
      color: '#38bdf8',
      distance: 180,
      enable: true,
      opacity: 0.3,
      width: 2,
      triangles: { enable: true, color: '#a5f3fc', opacity: 0.1 },
    },
    move: {
      direction: 'top',
      enable: true,
      outModes: { default: 'out' },
      random: true,
      speed: 0.7,
      straight: false,
      angle: { value: 90, offset: 0 },
    },
    number: {
      density: { enable: true },
      value: 40,
    },
    opacity: { value: 0.7 },
    shape: {
      type: 'circle',
    },
    size: {
      value: { min: 2, max: 7 },
    },
  },
  detectRetina: true,
};

// Adicionar os novos presets ao export default para fácil importação
export const customPresets = {
  networkPreset,
  starryPreset,
  hexagonsPreset,
  lightPreset,
  bubblesPreset,
  amongUsPreset,
  seaAnemonePreset,
};

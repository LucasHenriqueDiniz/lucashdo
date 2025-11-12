'use client';

import { useEffect, useMemo, useState } from 'react';
import './character.css';

interface WavesProps {
  layer: 'front' | 'back';
  /** Onde posicionar o centro da wave na tela em % da altura da viewport (ex.: 0.65 = 65%) */
  anchorY?: number;
  /** Quanto da altura da tela a wave pode ocupar antes de "parar" (0.0–1.0) */
  maxVh?: number;
  /** Zoom fino adicional por layer (1 = neutro) */
  zoom?: number;
}

export default function Waves({ layer, anchorY = 0.65, maxVh = 0.6, zoom }: WavesProps) {
  const isBack = layer === 'back';
  const [svgRaw, setSvgRaw] = useState<string>('');
  const [vb, setVb] = useState<{ w: number; h: number } | null>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number }>({ x: 0.5, y: 0.5 });

  // Carrega SVG e extrai viewBox
  useEffect(() => {
    const url = `/svgs/waves/${isBack ? 'wave-back' : 'wave-front'}.svg`;
    let active = true;

    fetch(url)
      .then(r => r.text())
      .then(txt => {
        if (!active) return;
        setSvgRaw(txt);

        // Extrair viewBox
        const m = txt.match(/viewBox\s*=\s*"([\d.\-\s]+)"/i);
        if (m) {
          const nums = m[1].trim().split(/\s+/).map(Number);
          // viewBox: minX minY width height
          const w = nums[2] ?? 0;
          const h = nums[3] ?? 0;
          if (w > 0 && h > 0) setVb({ w, h });
        }
      })
      .catch(() => {
        setSvgRaw('');
        setVb(null);
      });

    return () => {
      active = false;
    };
  }, [isBack]);

  // Recalcula scale no resize
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const onResize = () => setTick(t => t + 1);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Parallax simples baseado no mouse (global)
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      const vw = window.innerWidth || 1;
      const vh = window.innerHeight || 1;
      setMouse({
        x: Math.max(0, Math.min(1, e.clientX / vw)),
        y: Math.max(0, Math.min(1, e.clientY / vh)),
      });
    };
    window.addEventListener('pointermove', onPointerMove);
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, []);

  // Mantemos memo apenas para re-render ao redimensionar (não usamos scale agora)
  useMemo(() => tick, [tick]);

  const svgEl = useMemo(() => {
    if (!svgRaw || !vb) return null;

    // Removemos width/height fixos (se existirem) e garantimos preserveAspectRatio neutro (não vamos usá-lo)
    const patched = svgRaw
      .replace(/\swidth="[^"]*"/gi, '')
      .replace(/\sheight="[^"]*"/gi, '')
      .replace(/preserveAspectRatio="[^"]*"/gi, 'preserveAspectRatio="xMidYMid meet"'); // ok ter meet, mas quem manda é o scale CSS

    // Offset base e parallax por layer
    const baseOffsetX = isBack ? -40 : 40;
    // mover ambas para baixo ~40px
    const baseOffsetY = 40;
    const parallaxIntensityX = isBack ? 20 : 35;
    const parallaxIntensityY = isBack ? 8 : 14;
    // leve deslocamento extra por layer
    const rightShiftBack = isBack ? -150 : 0; // back -> esquerda 150px
    const leftShiftFront = isBack ? 0 : -100; // front -> esquerda 100px
    const px = baseOffsetX + rightShiftBack + leftShiftFront + (mouse.x - 0.5) * parallaxIntensityX;
    const upShiftBack = isBack ? -30 : 0; // mover back wave um pouco para cima
    const py = baseOffsetY + upShiftBack + (mouse.y - 0.5) * parallaxIntensityY;

    return (
      <div
        className={`wave ${isBack ? 'wave-back' : 'wave-front'} ${isBack ? 'z-0' : 'z-20'}`}
        style={{
          transform: `translate(${px}px, ${py}px)`,
        }}
        dangerouslySetInnerHTML={{ __html: patched }}
      />
    );
  }, [svgRaw, vb, anchorY, isBack, mouse.x, mouse.y]);

  return svgEl;
}

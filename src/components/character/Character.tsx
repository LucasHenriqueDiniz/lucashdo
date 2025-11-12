'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

interface CharacterProps {
  heroRef?: React.RefObject<HTMLDivElement>;
  isActive?: boolean;
}

export default function Character({ heroRef, isActive = true }: CharacterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [isHoveringFace, setIsHoveringFace] = useState(false);
  const [setupReady, setSetupReady] = useState(false);

  // refs para elementos do SVG
  const partsRef = useRef<{
    svg: SVGSVGElement | null;
    eyeL: SVGGraphicsElement | null;
    eyeR: SVGGraphicsElement | null;
    lidL: SVGGraphicsElement | null;
    lidR: SVGGraphicsElement | null;
    browL: SVGGraphicsElement | null;
    browR: SVGGraphicsElement | null;
    hit: SVGGraphicsElement | null;
  } | null>(null);

  // ref para controlar o estado atual da animação (evitar múltiplas animações)
  const currentKRef = useRef<number>(0); // começa em 0 (neutral)
  const animationRAFRef = useRef<number | null>(null);
  const eyesRAFRef = useRef<number | null>(null); // ref para o loop dos olhos

  // carrega o SVG inline
  useEffect(() => {
    console.log('[SVG] Iniciando carregamento...');
    fetch('/svgs/character.svg')
      .then(res => res.text())
      .then(text => {
        console.log('[SVG] SVG carregado, tamanho:', text.length);
        setSvgContent(text);
      })
      .catch(err => console.error('[SVG] Erro ao carregar SVG:', err));
  }, []);

  // controle de mouse normalizado 0..1
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 20, mass: 0.5 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 20, mass: 0.5 });

  // leve tilt 3D do corpo
  const bodyTiltX = useTransform(smoothY, [0, 1], [4, -4]);
  const bodyTiltY = useTransform(smoothX, [0, 1], [-4, 4]);

  // respiração
  const breathingY = useMotionValue(0);
  useEffect(() => {
    let id = requestAnimationFrame(function tick() {
      breathingY.set(Math.sin(Date.now() / 3000) * 2);
      id = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(id);
  }, [breathingY]);

  // ===== SETUP INICIAL: Carrega elementos do SVG (executa apenas quando SVG carrega) =====
  useEffect(() => {
    if (!svgContent || !containerRef.current) {
      console.log('[SETUP] Aguardando SVG ou container...', {
        svgContent: !!svgContent,
        container: !!containerRef.current,
      });
      setSetupReady(false);
      return;
    }

    console.log('[SETUP] Iniciando setup dos elementos...');
    queueMicrotask(() => {
      const svg = containerRef.current?.querySelector('svg') as SVGSVGElement | null;
      if (!svg) {
        console.warn('[SETUP] SVG não encontrado no container!');
        return;
      }

      console.log('[SETUP] SVG encontrado, buscando elementos...');
      // Seletores com tolerância
      const q = (sel: string) => svg.querySelector<SVGGraphicsElement>(sel);
      const eyeL = q('#eye_L, #EYE_L, #eye-left');
      const eyeR = q('#eye_R, #EYE_R, #eye-right');
      const lidL = q('#palpebra_L, #eyelid_L, #palpebra-left');
      const lidR = q('#palpebra_R, #eyelid_R, #palbebra_R');
      const browL = q('#eyebrow_L, #brow_L, #eyebrown_L');
      const browR = q('#eyebrow_R, #brow_R');
      const hit = q('#face-hit-area, #face_hit, #face-hit, #hit');

      console.log('[SETUP] Elementos encontrados:', {
        eyeL: !!eyeL,
        eyeR: !!eyeR,
        lidL: !!lidL,
        lidR: !!lidR,
        browL: !!browL,
        browR: !!browR,
        hit: !!hit,
      });

      partsRef.current = { svg, eyeL, eyeR, lidL, lidR, browL, browR, hit };

      if (hit) {
        hit.setAttribute('fill', 'rgba(255,255,255,0.001)');
        hit.style.pointerEvents = 'all';
      }

      // ===== Estado inicial: NEUTRAL (k = 0) - pálpebras opacidade 0 =====
      currentKRef.current = 0;
      if (lidL && lidR) {
        [lidL, lidR].forEach(l => {
          l.setAttribute('opacity', '0');
          l.setAttribute('transform', 'translate(0 0)');
        });
        console.log('[SETUP] Pálpebras configuradas para neutral');
      }
      if (browL && browR) {
        [browL, browR].forEach(b => {
          b.setAttribute('transform', 'translate(0 0) rotate(0 0 0)');
        });
        console.log('[SETUP] Sobrancelhas configuradas para neutral');
      }
      console.log('[SETUP] Setup completo!');
      setSetupReady(true);
    });
  }, [svgContent]);

  // ===== LOOP DOS OLHOS: Independente de tudo, sempre roda =====
  useEffect(() => {
    // Aguardar SVG carregar antes de iniciar
    if (!svgContent) {
      console.log('[OLHOS] Aguardando SVG...');
      return;
    }

    console.log('[OLHOS] Iniciando loop dos olhos...');
    // Pequeno delay para garantir que os elementos foram montados
    const timeoutId = setTimeout(() => {
      const parts = partsRef.current;
      if (!parts || !parts.eyeL || !parts.eyeR) {
        console.warn('[OLHOS] Elementos dos olhos não encontrados!', {
          parts: !!parts,
          eyeL: parts?.eyeL ? true : false,
          eyeR: parts?.eyeR ? true : false,
        });
        return;
      }

      console.log('[OLHOS] Iniciando loop RAF...');
      const max = 6; // raio máx em unidades do SVG

      const eyesLoop = () => {
        // Sempre ler de partsRef.current para garantir que temos as referências mais atualizadas
        const parts = partsRef.current;
        if (parts && parts.eyeL && parts.eyeR) {
          // Ler valores diretamente (smoothX/smoothY são MotionValues estáveis)

          const normalizedX = smoothX.get() - 0.5; // -0.5 a +0.5

          const y = (smoothY.get() - 0.5) * 2 * max;

          // Movimento assimétrico: mais para esquerda do que para direita
          // Esquerda (negativo): multiplica por 2.5 para ir mais longe
          // Direita (positivo): multiplica por 0.6 para ir menos longe
          const x =
            normalizedX < 0
              ? normalizedX * 2 * max * 2.3 // Mais movimento à esquerda
              : normalizedX * 2 * max * 0.6; // Menos movimento à direita

          parts.eyeL.setAttribute('transform', `translate(${x} ${y})`);
          parts.eyeR.setAttribute('transform', `translate(${x} ${y})`);
        } else {
          console.warn('[OLHOS] Elementos perdidos durante loop!');
        }

        eyesRAFRef.current = requestAnimationFrame(eyesLoop);
      };

      eyesRAFRef.current = requestAnimationFrame(eyesLoop);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (eyesRAFRef.current !== null) {
        cancelAnimationFrame(eyesRAFRef.current);
        eyesRAFRef.current = null;
      }
    };
  }, [svgContent]); // Apenas quando SVG carrega - loop roda independente depois disso

  // ===== HIT DETECTION: Atualiza posição do mouse e detecta hover =====
  useEffect(() => {
    if (!isActive) {
      console.log('[HIT] Desativado - seção inativa');
      setIsHoveringFace(false);
      return;
    }

    if (!svgContent || !containerRef.current || !setupReady) {
      console.log('[HIT] Aguardando SVG ou container...');
      return;
    }

    const svg = containerRef.current.querySelector('svg') as SVGSVGElement | null;
    const parts = partsRef.current;
    if (!svg || !parts || !parts.hit) {
      console.warn('[HIT] Elementos não encontrados!', {
        svg: !!svg,
        parts: !!parts,
        hit: parts?.hit ? true : false,
      });
      return;
    }

    console.log('[HIT] Configurando listeners de mouse...');
    // Capturar referência ao hit antes de criar o handler
    const hit = parts.hit;
    let moveCount = 0;

    const onPointerMove = (e: PointerEvent) => {
      const r = containerRef.current?.getBoundingClientRect();
      if (!r) return;

      // 1. Atualizar posição dos olhos (normalizado 0..1)
      const x = clamp((e.clientX - r.left) / r.width, 0, 1);
      const y = clamp((e.clientY - r.top) / r.height, 0, 1);
      mouseX.set(x);
      mouseY.set(y);

      // 2. Hit detection: verificar se está dentro da face-hit-area (com expansão)
      if (svg.viewBox && hit) {
        const rect = hit.getBBox();
        const expand = 60; // Aumenta a área de detecção em 40 unidades
        const sx = svg.viewBox.baseVal.width / r.width;
        const sy = svg.viewBox.baseVal.height / r.height;
        const svgX = (e.clientX - r.left) * sx;
        const svgY = (e.clientY - r.top) * sy - 40;
        const inside =
          svgX >= rect.x - expand &&
          svgX <= rect.x + rect.width + expand &&
          svgY >= rect.y - expand &&
          svgY <= rect.y + rect.height + expand;

        moveCount++;
        // Log apenas a cada 30 movimentos para não poluir
        if (moveCount % 30 === 0) {
          console.log('[HIT] Mouse moveu, inside:', inside, {
            svgX: svgX.toFixed(1),
            svgY: svgY.toFixed(1),
          });
        }

        setIsHoveringFace(prev => {
          // Só atualiza se realmente mudou (evita re-renders desnecessários)
          if (prev !== inside) {
            console.log('[HIT] Estado mudou!', { prev, inside, angry: !inside });
            return inside;
          }
          return prev;
        });
      }
    };

    const onLeaveWindow = () => {
      setIsHoveringFace(false);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('blur', onLeaveWindow);
    window.addEventListener('mouseleave', onLeaveWindow);
    console.log('[HIT] Listeners adicionados!');

    return () => {
      console.log('[HIT] Removendo listeners...');
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('blur', onLeaveWindow);
      window.removeEventListener('mouseleave', onLeaveWindow);
    };
  }, [svgContent, setupReady, mouseX, mouseY, isActive]);

  // animação de pálpebras/sobrancelhas quando isHoveringFace muda
  useEffect(() => {
    if (!setupReady) return;
    console.log('[ANIM] Animação das pálpebras acionada, isHoveringFace:', isHoveringFace);
    const parts = partsRef.current;
    if (!parts) {
      console.warn('[ANIM] partsRef.current é null!');
      return;
    }
    const { lidL, lidR, browL, browR } = parts;
    if (!lidL || !lidR || !browL || !browR) {
      console.warn('[ANIM] Elementos faltando!', {
        lidL: !!lidL,
        lidR: !!lidR,
        browL: !!browL,
        browR: !!browR,
      });
      return;
    }

    // Cancelar animação anterior se houver
    if (animationRAFRef.current !== null) {
      console.log('[ANIM] Cancelando animação anterior...');
      cancelAnimationFrame(animationRAFRef.current);
      animationRAFRef.current = null;
    }

    // target: angry = isHoveringFace
    // k = 1 quando angry, k = 0 quando neutral
    const kFrom = currentKRef.current;
    const kTo = isHoveringFace ? 1 : 0; // dentro = angry (1), fora = neutral (0)
    console.log('[ANIM] Iniciando animação:', { kFrom, kTo, angry: isHoveringFace });

    let start: number | null = null;
    const dur = 220;

    const step = (t: number) => {
      if (!start) start = t;
      const p = Math.min((t - start) / dur, 1);
      // easing suave
      const e = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;
      const k = lerp(kFrom, kTo, e);
      currentKRef.current = k; // atualizar ref

      const lidY = 3 * k; // Reduzido para deixar pálpebras mais para cima quando irritado
      const lidOpacity = lerp(0, 1, k); // 0 quando neutral, 1 quando angry
      [lidL, lidR].forEach(l => {
        l.setAttribute('opacity', String(lidOpacity));
        l.setAttribute('transform', `translate(0 ${lidY})`);
      });

      const browY = 8 * k;
      const browRot = -12 * k;
      // Sobrancelha esquerda
      if (browL) {
        const boxL = browL.getBBox();
        const cxL = (boxL.x + boxL.width / 2).toFixed(2);
        const cyL = (boxL.y + boxL.height / 2).toFixed(2);
        browL.setAttribute('transform', `translate(0 ${browY}) rotate(${browRot} ${cxL} ${cyL})`);
      }
      // Sobrancelha direita - desce mais para dentro (mais rotação)
      if (browR) {
        const boxR = browR.getBBox();
        const cxR = (boxR.x + boxR.width / 2).toFixed(2);
        const cyR = (boxR.y + boxR.height / 2).toFixed(2);
        const browRotR = 16 * k; // Mais rotação para a direita
        browR.setAttribute('transform', `translate(0 ${browY}) rotate(${browRotR} ${cxR} ${cyR})`);
      }

      if (p < 1) {
        animationRAFRef.current = requestAnimationFrame(step);
      } else {
        console.log('[ANIM] Animação completa! k =', k.toFixed(2));
        animationRAFRef.current = null;
      }
    };

    animationRAFRef.current = requestAnimationFrame(step);
    return () => {
      if (animationRAFRef.current !== null) {
        cancelAnimationFrame(animationRAFRef.current);
        animationRAFRef.current = null;
      }
    };
  }, [isHoveringFace, setupReady]);

  // Memoizar o SVG para evitar re-renders desnecessários
  const svgElement = useMemo(() => {
    if (!svgContent) return null;
    return (
      <div
        className="absolute inset-0"
        dangerouslySetInnerHTML={{ __html: svgContent }}
        style={{ pointerEvents: 'auto' }}
      />
    );
  }, [svgContent]);

  return (
    <motion.div
      ref={containerRef}
      className="relative select-none"
      style={{
        width: 500,
        height: 500,
        y: breathingY,
        rotateX: bodyTiltX,
        rotateY: bodyTiltY,
        transformStyle: 'preserve-3d',
      }}
    >
      {svgElement}
    </motion.div>
  );
}

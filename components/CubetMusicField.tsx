'use client';
// components/CubetMusicField.tsx
// Live cinematic ambient blurred motion video background
// Continuous organic chromatic fluid flow with multi-color auroras and subtle film texture

import { useEffect, useRef } from 'react';

interface ColorOrb {
  x: number;
  y: number;
  r: number;
  color: [number, number, number];
  opacity: number;
  baseRadius: number;
  speedX: number;
  speedY: number;
  phaseX: number;
  phaseY: number;
  scalePhase: number;
}

export default function CubetMusicField({ className = '', subtle = false }: { className?: string; subtle?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 });
  const orbsRef = useRef<ColorOrb[]>([]);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Palette: If subtle (admin), use deep muted violet/slate tones with lower saturation.
    const orbColors: [number, number, number][] = subtle
      ? [
          [109, 40, 217], // deep muted violet
          [79, 70, 229],  // indigo
          [67, 56, 202],  // deep blue-violet
          [91, 33, 182],  // dark purple
        ]
      : [
          [124, 58, 237],  // electric violet
          [6, 182, 212],   // neon cyan
          [244, 63, 94],   // rich coral / rose
          [59, 130, 246],  // deep royal blue
          [16, 185, 129],  // emerald aurora
          [217, 70, 239],  // fuchsia
          [245, 158, 11],  // golden amber
        ];

    const initOrbs = () => {
      const W = canvas.width;
      const H = canvas.height;
      const minDim = Math.min(W, H);

      orbsRef.current = orbColors.map((color, i) => {
        const baseRadius = minDim * (subtle ? 0.45 : 0.35 + (i % 3) * 0.12);
        return {
          x: W * (0.2 + 0.6 * ((i * 0.28) % 1)),
          y: H * (0.2 + 0.6 * ((i * 0.43) % 1)),
          r: baseRadius,
          baseRadius,
          color,
          opacity: subtle ? 0.18 : 0.42 + (i % 3) * 0.08,
          speedX: subtle ? 0.0001 : 0.00045 + (i * 0.00012) % 0.0004,
          speedY: subtle ? 0.00008 : 0.00038 + (i * 0.00015) % 0.00035,
          phaseX: i * 1.35,
          phaseY: i * 2.15,
          scalePhase: i * 0.8,
        };
      });
    };

    const resize = () => {
      // Lightweight rendering buffer for silky-smooth 240Hz frame rate with near-zero GPU load.
      // Scaling this up via CSS object-cover provides natural, organic softness.
      const aspect = (window.innerWidth || 1920) / (window.innerHeight || 1080);
      const targetHeight = 220;
      canvas.width = Math.round(targetHeight * Math.max(aspect, 0.5));
      canvas.height = targetHeight;
      initOrbs();
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.tx = e.clientX / window.innerWidth;
      mouseRef.current.ty = e.clientY / window.innerHeight;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let lastTime = performance.now();

    const render = (now: number) => {
      // Delta time calculation tailored for ultra-high refresh rates (up to 240Hz / 4ms per frame)
      const dt = Math.min(now - lastTime, 32);
      lastTime = now;
      timeRef.current += dt;
      const t = timeRef.current;

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.tx - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.ty - mouseRef.current.y) * 0.05;

      const W = canvas.width;
      const H = canvas.height;
      const mx = (mouseRef.current.x - 0.5) * W * 0.15;
      const my = (mouseRef.current.y - 0.5) * H * 0.15;

      // Base background: Deep midnight space
      ctx.fillStyle = '#06060c';
      ctx.fillRect(0, 0, W, H);

      // Composite mode for chromatic liquid blending
      ctx.globalCompositeOperation = 'screen';

      orbsRef.current.forEach((orb, i) => {
        // Compound orbital movement
        const ox =
          W * 0.5 +
          Math.sin(t * orb.speedX + orb.phaseX) * (W * 0.32) +
          Math.cos(t * orb.speedY * 0.6 + orb.phaseY) * (W * 0.12) +
          mx * (0.8 + i * 0.2);

        const oy =
          H * 0.5 +
          Math.cos(t * orb.speedY + orb.phaseY) * (H * 0.28) +
          Math.sin(t * orb.speedX * 0.7 + orb.phaseX) * (H * 0.1) +
          my * (0.8 + i * 0.2);

        // Breathing scale pulsation
        const scale = 0.85 + 0.3 * Math.sin(t * 0.0006 + orb.scalePhase);
        const radius = orb.baseRadius * scale;

        // Radial gradient feather
        const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, radius);
        const [r, g, b] = orb.color;
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${orb.opacity})`);
        grad.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${orb.opacity * 0.55})`);
        grad.addColorStop(0.75, `rgba(${r}, ${g}, ${b}, ${orb.opacity * 0.15})`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(ox, oy, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Reset composite mode
      ctx.globalCompositeOperation = 'source-over';

      // Soft vignette around borders for deep center focus
      const vignette = ctx.createRadialGradient(
        W * 0.5, H * 0.5, W * 0.25,
        W * 0.5, H * 0.5, W * 0.75
      );
      vignette.addColorStop(0, 'rgba(6, 6, 12, 0)');
      vignette.addColorStop(0.65, 'rgba(6, 6, 12, 0.4)');
      vignette.addColorStop(1, 'rgba(6, 6, 12, 0.85)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, W, H);

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [subtle]);

  return (
    <div
      className={`fixed inset-0 w-full h-full pointer-events-none select-none overflow-hidden ${className}`}
      style={{ zIndex: 0, transform: 'translate3d(0, 0, 0)', willChange: 'transform' }}
    >
      {/* 240Hz High-Performance Chromatic Fluid Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover transform scale-105"
        style={{
          filter: subtle ? 'blur(35px) saturate(130%)' : 'blur(45px) saturate(170%)',
          WebkitFilter: subtle ? 'blur(35px) saturate(130%)' : 'blur(45px) saturate(170%)',
          transform: 'translate3d(0, 0, 0)',
          WebkitTransform: 'translate3d(0, 0, 0)',
          willChange: 'transform',
        }}
        aria-hidden="true"
      />

      {/* Lightweight overlay without heavy full-screen backdrop-blur */}
      <div
        className={`absolute inset-0 ${subtle ? 'bg-[#08080B]/88' : 'bg-[#070711]/45'}`}
        style={{
          transform: 'translate3d(0, 0, 0)',
          WebkitTransform: 'translate3d(0, 0, 0)',
        }}
      />
    </div>
  );
}

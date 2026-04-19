'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

interface PaintShapeArgs {
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  alpha: number;
  blend: GlobalCompositeOperation;
}

// Utility to generate random organic shapes
function drawPaintShape(ctx: CanvasRenderingContext2D, { x, y, size, color, rotation, alpha, blend }: PaintShapeArgs) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.globalCompositeOperation = blend;
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  // Draw a blobby, paint-like shape
  for (let i = 0; i < 2 * Math.PI; i += Math.PI / 5) {
    const r = size * (0.8 + 0.2 * Math.sin(i * 3 + Math.random()));
    ctx.lineTo(Math.cos(i) * r, Math.sin(i) * r);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = size * 0.2;
  ctx.fill();
  ctx.restore();
}

const lightPalette = [
  '#FFE5D9', // Soft peach
  '#E8F5E9', // Mint green
  '#E3F2FD', // Light blue
  '#FFF3E0', // Warm beige
  '#F3E5F5', // Lavender
  '#E8EAF6', // Pale blue
  '#F1F8E9', // Sage green
  '#FFEBEE', // Soft pink
  '#E0F7FA', // Light cyan
  '#F5F5F5', // Off-white
];

const darkPalette = [
  '#1A1A2E', // Deep navy
  '#16213E', // Dark blue
  '#0F3460', // Rich blue
  '#533483', // Deep purple
  '#E94560', // Soft red
  '#1F1D36', // Dark purple
  '#3F3351', // Muted purple
];

const blendModes: GlobalCompositeOperation[] = [
  'overlay',
  'soft-light',
  'color-dodge',
  'screen',
  'lighter',
];

const ArtisticBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      draw();
    };

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const palette = theme === 'dark' ? darkPalette : lightPalette;

      for (let i = 0; i < 15; i++) {
        drawPaintShape(ctx, {
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: 250 + Math.random() * 250,
          color: palette[Math.floor(Math.random() * palette.length)],
          rotation: Math.random() * Math.PI * 2,
          alpha: theme === 'dark' ? 0.15 + Math.random() * 0.15 : 0.35 + Math.random() * 0.15,
          blend: blendModes[Math.floor(Math.random() * blendModes.length)],
        });
      }

      // Organic grain effect (simulated with random points if needed, but clean shapes are better)
      ctx.save();
      ctx.globalAlpha = 0.02;
      ctx.fillStyle = theme === 'dark' ? '#ffffff' : '#000000';
      for (let i = 0; i < 1000; i++) {
        ctx.fillRect(Math.random() * window.innerWidth, Math.random() * window.innerHeight, 1, 1);
      }
      ctx.restore();
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [theme, mounted]);

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 w-full h-full -z-10 select-none"
      style={{
        display: 'block',
        mixBlendMode: theme === 'dark' ? 'overlay' : 'multiply',
      }}
      aria-hidden="true"
    />
  );
};

export default ArtisticBackground;

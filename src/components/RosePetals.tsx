import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  opacity: number;
  flip: number;
  flipSpeed: number;
  type: 'rose' | 'marigold' | 'jasmine';
}

interface GoldenSparkle {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  speedY: number;
  speedX: number;
  pulseSpeed: number;
  pulsePhase: number;
}

// Royal Indian Wedding Floral Palette: Crimson Rose, Saffron Marigold, White Mogra
const FLORAL_PALETTE = [
  { type: 'rose' as const, color: '#C81E32' }, // Sindoor Crimson Rose
  { type: 'rose' as const, color: '#E02B43' }, // Fresh Red Rose
  { type: 'rose' as const, color: '#8F1122' }, // Velvet Maroon
  { type: 'marigold' as const, color: '#F7941D' }, // Saffron Genda
  { type: 'marigold' as const, color: '#FFB800' }, // Golden Yellow Marigold
  { type: 'marigold' as const, color: '#E57C00' }, // Deep Kesari Orange
  { type: 'jasmine' as const, color: '#FFFDF7' }, // White Mogra / Jasmine
  { type: 'jasmine' as const, color: '#FDF7EB' }, // Cream Jasmine
];

export const RosePetals: React.FC<{ active?: boolean }> = ({ active = true }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, vx: 0, vy: 0, lastX: -1000, lastY: -1000 });

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    // Track mouse movement for interactive breeze swirl
    const onPointerMove = (e: PointerEvent) => {
      const m = mouseRef.current;
      m.vx = e.clientX - m.lastX;
      m.vy = e.clientY - m.lastY;
      m.lastX = e.clientX;
      m.lastY = e.clientY;
      m.x = e.clientX;
      m.y = e.clientY;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    // 52 lush floral petals
    const petals: Petal[] = Array.from({ length: 52 }).map(() => {
      const item = FLORAL_PALETTE[Math.floor(Math.random() * FLORAL_PALETTE.length)];
      return {
        x: Math.random() * width,
        y: Math.random() * (height + 200) - 200,
        size: item.type === 'jasmine' ? Math.random() * 8 + 8 : Math.random() * 15 + 11,
        speedY: Math.random() * 1.6 + 1.1,
        speedX: Math.random() * 1.4 - 0.7,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2.2,
        color: item.color,
        opacity: item.type === 'jasmine' ? Math.random() * 0.3 + 0.65 : Math.random() * 0.35 + 0.65,
        flip: Math.random() * Math.PI,
        flipSpeed: Math.random() * 0.04 + 0.018,
        type: item.type,
      };
    });

    // 36 Golden Stardust Sparkles floating like sunlight through Udaipur palace arches
    const sparkles: GoldenSparkle[] = Array.from({ length: 36 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.8,
      alpha: Math.random() * 0.7 + 0.3,
      speedY: Math.random() * 0.45 + 0.15,
      speedX: (Math.random() - 0.5) * 0.5,
      pulseSpeed: Math.random() * 0.03 + 0.015,
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    let time = 0;
    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Gentle horizontal atmospheric oscillation
      const breeze = Math.sin(time) * 1.2;
      const m = mouseRef.current;

      // 1. Render Golden Stardust
      sparkles.forEach((s) => {
        s.y += s.speedY;
        s.x += s.speedX + Math.sin(s.pulsePhase + time * 0.8) * 0.3;
        s.pulsePhase += s.pulseSpeed;

        if (s.y > height + 20) {
          s.y = -10;
          s.x = Math.random() * width;
        }

        const currentAlpha = Math.max(0, Math.min(1, s.alpha + Math.sin(s.pulsePhase) * 0.35));

        ctx.save();
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 218, 140, ${currentAlpha.toFixed(2)})`;
        ctx.shadowColor = 'rgba(212, 175, 55, 0.75)';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      });

      // 2. Render Petals with Dynamic Interactive Air Currents
      petals.forEach((p) => {
        // Mouse turbulence wake
        const dx = p.x - m.x;
        const dy = p.y - m.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 140 && dist > 1) {
          const force = (1 - dist / 140) * 2.8;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force * 0.6;
          p.rotationSpeed += (Math.random() - 0.5) * 0.4;
        }

        p.y += p.speedY;
        p.x += Math.sin(p.y * 0.008 + time) * 1.2 + p.speedX + breeze * 0.5;
        p.rotation += p.rotationSpeed;
        p.flip += p.flipSpeed;

        if (p.y > height + 40) {
          p.y = -35;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.scale(1, Math.cos(p.flip));

        ctx.beginPath();
        if (p.type === 'marigold') {
          // Marigold elongated petal with ruffled tip
          ctx.ellipse(0, 0, p.size * 0.45, p.size * 0.9, 0, 0, Math.PI * 2);
        } else if (p.type === 'jasmine') {
          // Delicate 4-star small jasmine blossom
          const s = p.size * 0.65;
          ctx.arc(0, -s * 0.5, s * 0.45, 0, Math.PI * 2);
          ctx.arc(0, s * 0.5, s * 0.45, 0, Math.PI * 2);
          ctx.arc(-s * 0.5, 0, s * 0.45, 0, Math.PI * 2);
          ctx.arc(s * 0.5, 0, s * 0.45, 0, Math.PI * 2);
        } else {
          // Teardrop Rose Petal with realistic curved contour
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(p.size * 0.65, -p.size * 0.5, p.size * 0.85, p.size * 0.5, 0, p.size);
          ctx.bezierCurveTo(-p.size * 0.85, p.size * 0.5, -p.size * 0.65, -p.size * 0.5, 0, 0);
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;

        // Subtle soft shadow underneath petal
        if (p.type === 'jasmine') {
          ctx.shadowColor = 'rgba(212, 175, 55, 0.45)';
          ctx.shadowBlur = 4;
        } else {
          ctx.shadowColor = 'rgba(80, 10, 20, 0.3)';
          ctx.shadowBlur = 5;
        }

        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
    };
  }, [active]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ opacity: 0.95 }}
      aria-hidden="true"
    />
  );
};

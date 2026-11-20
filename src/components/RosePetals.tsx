import React, { useEffect, useRef } from 'react';

interface SakuraItem {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  baseColor: string;
  midColor: string;
  tipColor: string;
  opacity: number;
  flip: number;
  flipSpeed: number;
  roll: number;
  rollSpeed: number;
  swayPhase: number;
  swaySpeed: number;
  swayWidth: number;
  type: 'sakura-petal' | 'sakura-leaf';
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

// Authentic Sakura Tree Palette:
// Soft Sakura Petals (blush pinks, rosy tints, translucent tips) & Fresh Spring Leaves
const SAKURA_PETAL_PALETTES = [
  { base: '#E86F88', mid: '#FF9EB1', tip: '#FFF0F5' }, // Classic Spring Sakura
  { base: '#F07D94', mid: '#FFADC0', tip: '#FFFFFF' }, // Radiant Pink Blossom
  { base: '#D64E6C', mid: '#F78CA4', tip: '#FFE4E8' }, // Deeper Cherry Blossom
  { base: '#FF8FAB', mid: '#FFC2D1', tip: '#FFF5F7' }, // Soft Pastel Sakura
  { base: '#F38198', mid: '#FFBAC8', tip: '#FFFFFF' }, // Translucent White-Pink
  { base: '#C73656', mid: '#E86681', tip: '#FFD9E2' }, // Imperial Crimson Sakura
];

const SAKURA_LEAF_PALETTES = [
  { base: '#4E7429', mid: '#6F993E', tip: '#9BC060' }, // Tender Spring Green Leaf
  { base: '#5D7C2F', mid: '#7B9B42', tip: '#ADC86E' }, // Fresh Olive Bronze Leaf
  { base: '#466827', mid: '#668E37', tip: '#8DB855' }, // Young Sakura Tree Leaf
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

    // Track mouse & touch air currents to swirl sakura petals interactively
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

    // 58 Sakura petals & spring leaves (approx 85% notched petals, 15% fresh leaves)
    const items: SakuraItem[] = Array.from({ length: 58 }).map((_, idx) => {
      const isLeaf = idx % 7 === 0; // ~14% leaves, 86% petals
      const palette = isLeaf
        ? SAKURA_LEAF_PALETTES[Math.floor(Math.random() * SAKURA_LEAF_PALETTES.length)]
        : SAKURA_PETAL_PALETTES[Math.floor(Math.random() * SAKURA_PETAL_PALETTES.length)];

      return {
        x: Math.random() * width,
        y: Math.random() * (height + 200) - 200,
        size: isLeaf ? Math.random() * 10 + 13 : Math.random() * 12 + 13, // 13-25px
        speedY: isLeaf ? Math.random() * 1.3 + 1.0 : Math.random() * 1.1 + 0.75, // Light, floating descent
        speedX: Math.random() * 1.2 - 0.6,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.8,
        baseColor: palette.base,
        midColor: palette.mid,
        tipColor: palette.tip,
        opacity: Math.random() * 0.28 + 0.72,
        flip: Math.random() * Math.PI,
        flipSpeed: Math.random() * 0.035 + 0.015,
        roll: Math.random() * Math.PI,
        rollSpeed: Math.random() * 0.025 + 0.01,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.02 + 0.012,
        swayWidth: Math.random() * 1.8 + 1.0,
        type: isLeaf ? 'sakura-leaf' : 'sakura-petal',
      };
    });

    // 32 Golden Stardust Sparkles floating like soft sunlight filtered through sakura branches
    const sparkles: GoldenSparkle[] = Array.from({ length: 32 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.6 + 0.7,
      alpha: Math.random() * 0.65 + 0.35,
      speedY: Math.random() * 0.4 + 0.12,
      speedX: (Math.random() - 0.5) * 0.4,
      pulseSpeed: Math.random() * 0.03 + 0.015,
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    let time = 0;
    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, width, height);

      // Atmospheric wind drift
      const generalBreeze = Math.sin(time * 0.8) * 1.4 + 0.4; // slight gentle rightward drift
      const m = mouseRef.current;

      // 1. Render Golden Sunlight Stardust
      sparkles.forEach((s) => {
        s.y += s.speedY;
        s.x += s.speedX + Math.sin(s.pulsePhase + time * 0.7) * 0.25;
        s.pulsePhase += s.pulseSpeed;

        if (s.y > height + 20) {
          s.y = -10;
          s.x = Math.random() * width;
        }

        const currentAlpha = Math.max(0, Math.min(1, s.alpha + Math.sin(s.pulsePhase) * 0.35));

        ctx.save();
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 228, 160, ${currentAlpha.toFixed(2)})`;
        ctx.shadowColor = 'rgba(255, 215, 120, 0.85)';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      });

      // 2. Render Falling Sakura Petals & Spring Leaves
      items.forEach((p) => {
        // Interactive Mouse/Touch Wake Turbulence
        const dx = p.x - m.x;
        const dy = p.y - m.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 150 && dist > 1) {
          const force = (1 - dist / 150) * 3.2;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force * 0.6;
          p.rotationSpeed += (Math.random() - 0.5) * 0.5;
        }

        // Falling kinematics with hira-hira sway
        p.y += p.speedY;
        p.swayPhase += p.swaySpeed;
        p.x += Math.sin(p.swayPhase) * p.swayWidth + p.speedX + generalBreeze * 0.6;
        p.rotation += p.rotationSpeed;
        p.flip += p.flipSpeed;
        p.roll += p.rollSpeed;

        // Reset when falling beyond bottom of screen
        if (p.y > height + 40) {
          p.y = -40;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        // 3D Perspective tumbling and rolling
        const scaleX = Math.cos(p.flip);
        const scaleY = Math.cos(p.roll) * 0.35 + 0.65;
        ctx.scale(scaleX, scaleY);

        ctx.globalAlpha = p.opacity;

        if (p.type === 'sakura-petal') {
          // --- SAKURA PETAL WITH SIGNATURE NOTCHED TIP ---
          const len = p.size;
          const w = p.size * 0.78;

          // Gradient: deeper blush at the stem base, softly glowing translucent white-pink at notched tip
          const grad = ctx.createLinearGradient(0, len * 0.48, 0, -len * 0.48);
          grad.addColorStop(0, p.baseColor);
          grad.addColorStop(0.42, p.midColor);
          grad.addColorStop(1, p.tipColor);

          ctx.fillStyle = grad;
          ctx.shadowColor = 'rgba(230, 90, 120, 0.28)';
          ctx.shadowBlur = 4;

          ctx.beginPath();
          // Stem base point
          ctx.moveTo(0, len * 0.46);

          // Left curved belly up to left lobe tip
          ctx.bezierCurveTo(-w * 0.68, len * 0.25, -w * 0.78, -len * 0.22, -w * 0.32, -len * 0.48);

          // The classic Sakura notch cleft at the tip
          ctx.quadraticCurveTo(0, -len * 0.34, w * 0.32, -len * 0.48);

          // Right lobe down along right belly to stem base
          ctx.bezierCurveTo(w * 0.78, -len * 0.22, w * 0.68, len * 0.25, 0, len * 0.46);
          ctx.closePath();
          ctx.fill();

          // Subtle delicate inner petal crease/vein highlight
          ctx.beginPath();
          ctx.moveTo(0, len * 0.44);
          ctx.lineTo(0, -len * 0.08);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        } else {
          // --- SAKURA TREE LEAF (FRESH SPRING LEAF) ---
          const len = p.size * 1.15;
          const w = p.size * 0.52;

          const grad = ctx.createLinearGradient(0, len * 0.5, 0, -len * 0.5);
          grad.addColorStop(0, p.baseColor);
          grad.addColorStop(0.5, p.midColor);
          grad.addColorStop(1, p.tipColor);

          ctx.fillStyle = grad;
          ctx.shadowColor = 'rgba(50, 80, 25, 0.25)';
          ctx.shadowBlur = 4;

          ctx.beginPath();
          // Pointed tip at top
          ctx.moveTo(0, -len * 0.5);
          // Right curved side
          ctx.bezierCurveTo(w * 0.8, -len * 0.2, w * 0.75, len * 0.28, 0, len * 0.5);
          // Left curved side
          ctx.bezierCurveTo(-w * 0.75, len * 0.28, -w * 0.8, -len * 0.2, 0, -len * 0.5);
          ctx.closePath();
          ctx.fill();

          // Delicate leaf spine vein
          ctx.beginPath();
          ctx.moveTo(0, len * 0.48);
          ctx.lineTo(0, -len * 0.45);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }

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

// Also export as SakuraPetals for clarity
export const SakuraPetals = RosePetals;

import React, { useState } from 'react';
import { sound } from '../utils/audio';

interface WaxSealProps {
  monogram?: string;
  size?: number;
  color?: string;
  onClick?: () => void;
  className?: string;
  label?: string;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

export const WaxSeal: React.FC<WaxSealProps> = ({
  monogram = 'अ & इ',
  size = 80,
  color = '#8E1728', // Sindoor Kumkum Royal Crimson
  onClick,
  className = '',
  label,
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 12, y: -y * 12 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleClick = (e: React.MouseEvent) => {
    sound.playWaxStamp();

    // Burst golden sparkles
    const newSparkles: Sparkle[] = Array.from({ length: 12 }).map((_, i) => ({
      id: Date.now() + i,
      x: 50,
      y: 50,
      vx: (Math.random() - 0.5) * 85,
      vy: (Math.random() - 0.5) * 85,
      size: Math.random() * 3 + 2,
      opacity: 1,
    }));
    setSparkles(newSparkles);

    setTimeout(() => {
      setSparkles([]);
    }, 600);

    if (onClick) onClick();
  };

  return (
    <div
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-flex flex-col items-center select-none cursor-pointer group ${className}`}
      style={{
        width: size,
        height: size,
        perspective: '600px',
      }}
      title={label || 'Royal Seal of Abhishek & Ishita'}
    >
      {/* Golden Aura Glow behind seal */}
      <div
        className="absolute inset-0 rounded-full bg-[#D4AF37]/20 blur-md group-hover:bg-[#D4AF37]/40 transition-all duration-300 pointer-events-none"
        style={{ transform: 'scale(1.15)' }}
      />

      <div
        className="relative w-full h-full transition-transform duration-200 ease-out group-hover:scale-105 active:scale-95"
        style={{
          transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <svg
          viewBox="0 0 100 100"
          width="100%"
          height="100%"
          className="filter drop-shadow-[0_8px_18px_rgba(80,10,20,0.55)] group-hover:drop-shadow-[0_12px_24px_rgba(212,175,55,0.45)] transition-all duration-300"
        >
          <defs>
            <radialGradient id="kumkum-wax" cx="45%" cy="38%" r="58%">
              <stop offset="0%" stopColor="#E63946" />
              <stop offset="40%" stopColor={color} />
              <stop offset="85%" stopColor="#5C0D17" />
              <stop offset="100%" stopColor="#320409" />
            </radialGradient>

            <linearGradient id="zari-gold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF4D0" />
              <stop offset="30%" stopColor="#E5C158" />
              <stop offset="65%" stopColor="#B38A24" />
              <stop offset="100%" stopColor="#F9E29B" />
            </linearGradient>

            {/* Diagonal Specular Reflection Light Beam */}
            <linearGradient id="wax-specular" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
              <stop offset="25%" stopColor="rgba(255,255,255,0.15)" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>

            <filter id="seal-deboss" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1.2" result="blur" />
              <feOffset in="blur" dx="0.8" dy="1.4" result="offset" />
              <feComposite in="SourceGraphic" in2="offset" operator="over" />
            </filter>
          </defs>

          {/* Organic melted wax edge contour */}
          <path
            d="M 50,5 
               C 65,4 76,10 85,20 
               C 95,30 98,44 95,58 
               C 92,72 87,83 75,92 
               C 62,99 43,98 29,94 
               C 16,89 7,77 5,63 
               C 3,49 8,35 18,22 
               C 28,11 38,6 50,5 Z"
            fill="url(#kumkum-wax)"
          />

          {/* Specular sheen on top lip */}
          <path
            d="M 50,5 
               C 65,4 76,10 85,20 
               C 90,25 75,20 60,14 
               C 45,9 35,9 26,13 
               C 35,7 42,5 50,5 Z"
            fill="url(#wax-specular)"
            opacity="0.8"
          />

          {/* Natural wax beads */}
          <circle cx="89" cy="72" r="3.2" fill="#5C0D17" opacity="0.85" />
          <circle cx="11" cy="65" r="2.6" fill="#5C0D17" opacity="0.85" />
          <circle cx="26" cy="10" r="2.8" fill="#E63946" opacity="0.75" />

          {/* Concentric rings with gold foil bevel */}
          <circle
            cx="50"
            cy="50"
            r="36.5"
            fill="none"
            stroke="#42080E"
            strokeWidth="3.2"
            opacity="0.85"
          />
          <circle
            cx="50"
            cy="50"
            r="34"
            fill="none"
            stroke="url(#zari-gold)"
            strokeWidth="1.4"
            opacity="0.9"
          />

          {/* Auspicious floral bead border */}
          <g stroke="url(#zari-gold)" strokeWidth="0.9" fill="none" opacity="0.8">
            <circle cx="50" cy="50" r="31" strokeDasharray="1.5, 3" />
          </g>

          {/* Auspicious Ganesha / Kalash crown glyph */}
          <path
            d="M 47,28 C 47,25 53,25 53,28 C 53,31 51,33 50,35 C 49,33 47,31 47,28 Z"
            fill="url(#zari-gold)"
            filter="url(#seal-deboss)"
          />
          <circle cx="50" cy="24" r="1.5" fill="url(#zari-gold)" />

          {/* Monogram letters */}
          <text
            x="50"
            y="56"
            textAnchor="middle"
            fill="url(#zari-gold)"
            fontFamily="'Marcellus', 'Cinzel', serif"
            fontWeight="700"
            fontSize="15"
            letterSpacing="1"
            filter="url(#seal-deboss)"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
          >
            {monogram}
          </text>

          {/* Devanagari Blessing: शुभ विवाह */}
          <text
            x="50"
            y="69"
            textAnchor="middle"
            fill="url(#zari-gold)"
            fontFamily="'Noto Serif Devanagari', sans-serif"
            fontWeight="600"
            fontSize="7"
            letterSpacing="1"
            opacity="0.95"
          >
            ॥ शुभ विवाह ॥
          </text>
        </svg>

        {/* Dynamic Sparkles on Click */}
        {sparkles.map((sp) => (
          <div
            key={sp.id}
            className="absolute rounded-full pointer-events-none bg-[#FFF4D0] shadow-[0_0_8px_#D4AF37]"
            style={{
              left: `${sp.x}%`,
              top: `${sp.y}%`,
              width: `${sp.size}px`,
              height: `${sp.size}px`,
              transform: `translate(${sp.vx}px, ${sp.vy}px) scale(0)`,
              transition: 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.55s ease',
            }}
          />
        ))}
      </div>

      {label && (
        <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#8E1728] mt-1.5 font-['Marcellus'] group-hover:text-[#D4AF37] transition-colors">
          {label}
        </span>
      )}
    </div>
  );
};

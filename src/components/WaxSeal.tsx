import React, { useState } from 'react';
import { sound } from '../utils/audio';

interface WaxSealProps {
  monogram?: string;
  size?: number;
  color?: string;
  onClick?: () => void;
  className?: string;
  label?: string;
  isBroken?: boolean;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
}

interface WaxCrumb {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
}

export const WaxSeal: React.FC<WaxSealProps> = ({
  monogram = 'अ & इ',
  size = 80,
  color = '#8E1728', // Sindoor Kumkum Royal Crimson
  onClick,
  className = '',
  label,
  isBroken = false,
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [crumbs, setCrumbs] = useState<WaxCrumb[]>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isBroken) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 12, y: -y * 12 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isBroken) return;

    // Trigger authentic brittle crack sound
    sound.playWaxCrack();

    // Burst golden sparkles
    const colors = ['#FFF4D0', '#FFDF73', '#D4AF37', '#FFFBF0', '#E5A93C'];
    const newSparkles: Sparkle[] = Array.from({ length: 24 }).map((_, i) => {
      const angle = (i / 24) * Math.PI * 2;
      const speed = Math.random() * 90 + 35;
      return {
        id: Date.now() + i,
        x: 50,
        y: 50,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3.5 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 1,
      };
    });
    setSparkles(newSparkles);

    // Scattered wax crumbs flying outward
    const newCrumbs: WaxCrumb[] = Array.from({ length: 10 }).map((_, i) => ({
      id: Date.now() + 100 + i,
      x: 50,
      y: 50,
      vx: (Math.random() - 0.5) * 110,
      vy: (Math.random() - 0.5) * 110,
      size: Math.random() * 4 + 2,
      rotation: Math.random() * 360,
    }));
    setCrumbs(newCrumbs);

    setTimeout(() => {
      setSparkles([]);
      setCrumbs([]);
    }, 900);

    if (onClick) onClick();
  };

  // Reusable SVG Seal artwork contents
  const renderSealArtwork = () => (
    <>
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
        opacity="0.85"
      />

      {/* Natural wax droplets */}
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
        strokeWidth="1.5"
        opacity="0.95"
      />

      {/* Auspicious floral bead border */}
      <g stroke="url(#zari-gold)" strokeWidth="1" fill="none" opacity="0.85">
        <circle cx="50" cy="50" r="31" strokeDasharray="1.8, 3.2" />
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
        style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
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
        letterSpacing="1.2"
        opacity="0.95"
      >
        ॥ शुभ विवाह ॥
      </text>
    </>
  );

  return (
    <div
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-flex flex-col items-center select-none cursor-pointer group ${className}`}
      style={{
        width: size,
        height: size,
        perspective: '800px',
      }}
      title={label || 'Click to break royal seal'}
    >
      {/* Radiant Golden Aura Glow behind seal */}
      <div
        className={`absolute inset-0 rounded-full bg-[#D4AF37]/25 blur-md pointer-events-none transition-all duration-500 ${
          isBroken ? 'scale-150 opacity-0' : 'group-hover:bg-[#D4AF37]/50'
        }`}
        style={{ transform: isBroken ? 'scale(1.8)' : 'scale(1.2)' }}
      />

      {/* Expanding Divine Light Burst on Seal Break */}
      {isBroken && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <div
            className="w-32 h-32 rounded-full animate-ping"
            style={{
              background: 'radial-gradient(circle, rgba(255,240,180,0.95) 0%, rgba(212,175,55,0.4) 50%, transparent 75%)',
            }}
          />
        </div>
      )}

      {/* The 3D Seal Wrapper with Tilting */}
      <div
        className="relative w-full h-full"
        style={{
          transform: isBroken
            ? 'none'
            : `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
          transformStyle: 'preserve-3d',
          transition: isBroken ? 'none' : 'transform 0.2s ease-out',
        }}
      >
        {/* SVG DEFS */}
        <svg className="absolute w-0 h-0" aria-hidden="true">
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

            <filter id="crack-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>

        {/* ========================================================
            LEFT HALF OF FRACTURED SEAL
           ======================================================== */}
        <div
          className="absolute inset-0 transition-all duration-700 ease-out"
          style={{
            clipPath: 'polygon(0% 0%, 53% 0%, 47% 24%, 54% 44%, 46% 64%, 53% 84%, 48% 100%, 0% 100%)',
            transform: isBroken
              ? 'translate(-48px, 14px) rotate(-22deg) scale(0.92)'
              : 'translate(0, 0) rotate(0deg) scale(1)',
            opacity: isBroken ? 0 : 1,
            pointerEvents: isBroken ? 'none' : 'auto',
          }}
        >
          <svg
            viewBox="0 0 100 100"
            width="100%"
            height="100%"
            className="filter drop-shadow-[0_8px_18px_rgba(80,10,20,0.65)]"
          >
            {renderSealArtwork()}
          </svg>
        </div>

        {/* ========================================================
            RIGHT HALF OF FRACTURED SEAL
           ======================================================== */}
        <div
          className="absolute inset-0 transition-all duration-700 ease-out"
          style={{
            clipPath: 'polygon(53% 0%, 100% 0%, 100% 100%, 48% 100%, 53% 84%, 46% 64%, 54% 44%, 47% 24%)',
            transform: isBroken
              ? 'translate(48px, -12px) rotate(22deg) scale(0.92)'
              : 'translate(0, 0) rotate(0deg) scale(1)',
            opacity: isBroken ? 0 : 1,
            pointerEvents: isBroken ? 'none' : 'auto',
          }}
        >
          <svg
            viewBox="0 0 100 100"
            width="100%"
            height="100%"
            className="filter drop-shadow-[0_8px_18px_rgba(80,10,20,0.65)]"
          >
            {renderSealArtwork()}
          </svg>
        </div>

        {/* Glowing Crack Fracture Line during break */}
        {isBroken && (
          <svg
            viewBox="0 0 100 100"
            width="100%"
            height="100%"
            className="absolute inset-0 pointer-events-none z-20 animate-pulse"
          >
            <path
              d="M 53,0 L 47,24 L 54,44 L 46,64 L 53,84 L 48,100"
              stroke="#FFF2B2"
              strokeWidth="2.5"
              fill="none"
              filter="url(#crack-glow)"
              strokeLinecap="round"
            />
          </svg>
        )}

        {/* Flying Wax Crumbs */}
        {crumbs.map((crumb) => (
          <div
            key={crumb.id}
            className="absolute rounded-sm pointer-events-none"
            style={{
              left: `${crumb.x}%`,
              top: `${crumb.y}%`,
              width: `${crumb.size}px`,
              height: `${crumb.size * 0.7}px`,
              backgroundColor: '#8E1728',
              boxShadow: '0 1px 3px rgba(0,0,0,0.6)',
              transform: `translate(${crumb.vx}px, ${crumb.vy}px) rotate(${crumb.rotation}deg)`,
              opacity: isBroken ? 0 : 1,
              transition: 'all 0.75s cubic-bezier(0.12, 0.8, 0.32, 1)',
            }}
          />
        ))}

        {/* Dynamic Sparkles on Break */}
        {sparkles.map((sp) => (
          <div
            key={sp.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${sp.x}%`,
              top: `${sp.y}%`,
              width: `${sp.size}px`,
              height: `${sp.size}px`,
              backgroundColor: sp.color,
              boxShadow: `0 0 8px ${sp.color}`,
              transform: `translate(${sp.vx}px, ${sp.vy}px)`,
              opacity: sp.opacity,
              transition: 'all 0.75s cubic-bezier(0.12, 0.8, 0.32, 1)',
            }}
          />
        ))}
      </div>

      {label && !isBroken && (
        <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#8E1728] mt-1.5 font-['Marcellus'] group-hover:text-[#D4AF37] transition-colors">
          {label}
        </span>
      )}
    </div>
  );
};

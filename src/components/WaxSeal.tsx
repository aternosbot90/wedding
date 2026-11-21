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
  useGanesha?: boolean;
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
  color = '#8E1728', // Royal Sindoor Kumkum Crimson
  onClick,
  className = '',
  label,
  isBroken = false,
  useGanesha = false,
}) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [crumbs, setCrumbs] = useState<WaxCrumb[]>([]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isBroken) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 10, y: -y * 10 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isBroken) return;

    sound.playWaxCrack();

    const colors = ['#FFF4D0', '#FFDF73', '#D4AF37', '#FFFBF0', '#E5A93C'];
    const newSparkles: Sparkle[] = Array.from({ length: 24 }).map((_, i) => {
      const angle = (i / 24) * Math.PI * 2;
      const speed = Math.random() * 80 + 30;
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

    const newCrumbs: WaxCrumb[] = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + 100 + i,
      x: 50,
      y: 50,
      vx: (Math.random() - 0.5) * 100,
      vy: (Math.random() - 0.5) * 100,
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

  const sealArtwork = (
    <>
      <defs>
        <radialGradient id="kumkum-wax-grad" cx="45%" cy="38%" r="60%">
          <stop offset="0%" stopColor="#E63946" />
          <stop offset="35%" stopColor={color} />
          <stop offset="80%" stopColor="#5C0D17" />
          <stop offset="100%" stopColor="#320409" />
        </radialGradient>

        <linearGradient id="zari-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF4D0" />
          <stop offset="30%" stopColor="#E5C158" />
          <stop offset="65%" stopColor="#B38A24" />
          <stop offset="100%" stopColor="#F9E29B" />
        </linearGradient>

        <linearGradient id="wax-specular-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
          <stop offset="25%" stopColor="rgba(255,255,255,0.18)" />
          <stop offset="50%" stopColor="transparent" />
        </linearGradient>
      </defs>

      {/* Realistic Organic Melted Wax Outer Shape */}
      <path
        d="M 50,5 
           C 65,4 76,10 85,20 
           C 95,30 98,44 95,58 
           C 92,72 87,83 75,92 
           C 62,99 43,98 29,94 
           C 16,89 7,77 5,63 
           C 3,49 8,35 18,22 
           C 28,11 38,6 50,5 Z"
        fill="url(#kumkum-wax-grad)"
        stroke="#42080E"
        strokeWidth="1.2"
      />

      {/* Wax Drop Beads */}
      <circle cx="89" cy="72" r="3.2" fill="#5C0D17" opacity="0.85" />
      <circle cx="11" cy="65" r="2.6" fill="#5C0D17" opacity="0.85" />
      <circle cx="26" cy="10" r="2.8" fill="#E63946" opacity="0.75" />

      {/* Top Sheen */}
      <path
        d="M 50,5 
           C 65,4 76,10 85,20 
           C 90,25 75,20 60,14 
           C 45,9 35,9 26,13 
           C 35,7 42,5 50,5 Z"
        fill="url(#wax-specular-grad)"
        opacity="0.85"
      />

      {/* Concentric Gold Rings */}
      <circle cx="50" cy="50" r="36" fill="none" stroke="#3D060D" strokeWidth="3" opacity="0.7" />
      <circle cx="50" cy="50" r="34" fill="none" stroke="url(#zari-gold-grad)" strokeWidth="1.6" opacity="0.95" />
      <circle cx="50" cy="50" r="31" fill="none" stroke="url(#zari-gold-grad)" strokeWidth="1" strokeDasharray="1.8, 3.2" opacity="0.85" />

      {/* Kalash / Auspicious Crown Icon */}
      <path
        d="M 47,28 C 47,25 53,25 53,28 C 53,31 51,33 50,35 C 49,33 47,31 47,28 Z"
        fill="url(#zari-gold-grad)"
      />
      <circle cx="50" cy="24" r="1.5" fill="url(#zari-gold-grad)" />

      {/* Monogram Letters or Sacred Ganesha Emblem */}
      {useGanesha ? (
        <g transform="translate(32, 30) scale(0.36)">
          <path
            d="M 50,15 C 44,15 39,19 37,25 C 35,31 37,38 41,43 C 44,46 47,49 48,53 C 49,57 48,61 46,65 C 43,70 38,73 34,73 C 31,73 29,71 29,68 C 29,66 31,64 33,63 C 36,62 38,59 38,56 C 38,52 35,49 32,49 C 28,49 25,52 25,56 C 25,63 30,70 37,73 C 44,76 53,73 57,67 C 61,61 62,53 60,46 C 58,41 54,37 51,33 C 49,30 48,27 49,24 C 50,21 53,19 56,19 C 59,19 62,21 63,24 C 64,27 63,30 65,32 C 67,34 70,33 71,31 C 73,28 72,23 69,19 C 64,15 57,14 50,15 Z"
            fill="url(#zari-gold-grad)"
          />
          <circle cx="50" cy="10" r="2.5" fill="#FFEAA7" />
          <path d="M 44,22 Q 50,27 56,22" stroke="url(#zari-gold-grad)" strokeWidth="1.5" fill="none" />
          <path d="M 45,26 Q 50,30 55,26" stroke="url(#zari-gold-grad)" strokeWidth="1.2" fill="none" />
          <path d="M 50,22 L 50,33" stroke="#FFEAA7" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="50" cy="27" r="1.2" fill="#8C1E2B" />
        </g>
      ) : (
        <text
          x="50"
          y="56"
          textAnchor="middle"
          fill="url(#zari-gold-grad)"
          fontFamily="'Marcellus', 'Cinzel', serif"
          fontWeight="700"
          fontSize="15"
          letterSpacing="1"
          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.85)' }}
        >
          {monogram}
        </text>
      )}

      {/* Auspicious Blessing Shloka: ॥ शुभ विवाह ॥ */}
      <text
        x="50"
        y="69"
        textAnchor="middle"
        fill="url(#zari-gold-grad)"
        fontFamily="'Noto Serif Devanagari', sans-serif"
        fontWeight="600"
        fontSize="7"
        letterSpacing="1.2"
        opacity="0.95"
        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.85)' }}
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
      className={`relative inline-flex flex-col items-center justify-center select-none cursor-pointer group ${className}`}
      style={{
        width: size,
        height: size,
      }}
      title={label || 'Click to break royal seal'}
    >
      {/* Radiant Golden Glow under Seal */}
      <div
        className={`absolute inset-0 rounded-full bg-[#D4AF37]/35 blur-md pointer-events-none transition-all duration-500 ${
          isBroken ? 'scale-150 opacity-0' : 'group-hover:bg-[#D4AF37]/60 group-hover:scale-110'
        }`}
      />

      {/* Unbroken Intact Seal (Rendered directly with NO clipPath so it renders 100% reliably on all browsers) */}
      {!isBroken && (
        <div
          className="relative w-full h-full transition-transform duration-200 ease-out"
          style={{
            transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
          }}
        >
          <svg
            viewBox="0 0 100 100"
            width="100%"
            height="100%"
            className="filter drop-shadow-[0_8px_20px_rgba(40,4,8,0.7)]"
          >
            {sealArtwork}
          </svg>
        </div>
      )}

      {/* Broken Seal Halves with Fracture Animation */}
      {isBroken && (
        <div className="relative w-full h-full">
          {/* Left Half */}
          <div
            className="absolute inset-0 transition-all duration-700 ease-out pointer-events-none"
            style={{
              clipPath: 'polygon(0% 0%, 53% 0%, 47% 24%, 54% 44%, 46% 64%, 53% 84%, 48% 100%, 0% 100%)',
              transform: 'translate(-42px, 12px) rotate(-20deg) scale(0.9)',
              opacity: 0,
            }}
          >
            <svg viewBox="0 0 100 100" width="100%" height="100%">
              {sealArtwork}
            </svg>
          </div>

          {/* Right Half */}
          <div
            className="absolute inset-0 transition-all duration-700 ease-out pointer-events-none"
            style={{
              clipPath: 'polygon(53% 0%, 100% 0%, 100% 100%, 48% 100%, 53% 84%, 46% 64%, 54% 44%, 47% 24%)',
              transform: 'translate(42px, -10px) rotate(20deg) scale(0.9)',
              opacity: 0,
            }}
          >
            <svg viewBox="0 0 100 100" width="100%" height="100%">
              {sealArtwork}
            </svg>
          </div>
        </div>
      )}

      {/* Dynamic Golden Sparkles */}
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
    </div>
  );
};

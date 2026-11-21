import React from 'react';

interface GaneshaSymbolProps {
  size?: number;
  className?: string;
  glow?: boolean;
}

export const GaneshaSymbol: React.FC<GaneshaSymbolProps> = ({
  size = 48,
  className = '',
  glow = true,
}) => {
  const rawId = React.useId();
  const gradId = `ganesha-gold-grad-${rawId.replace(/[^a-zA-Z0-9-_]/g, '')}`;

  return (
    <div
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
      aria-label="Lord Ganesha Symbol"
    >
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        className={glow ? 'filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.6)]' : ''}
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF9E6" />
            <stop offset="25%" stopColor="#F9E086" />
            <stop offset="60%" stopColor="#D4AF37" />
            <stop offset="85%" stopColor="#A67C1E" />
            <stop offset="100%" stopColor="#784E0B" />
          </linearGradient>

          <radialGradient id={`${gradId}-halo`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE8A3" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#D4AF37" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Auspicious Radiant Prabhavali Halo */}
        <circle cx="50" cy="48" r="44" fill={`url(#${gradId}-halo)`} />
        <circle
          cx="50"
          cy="48"
          r="42"
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth="0.8"
          strokeDasharray="2, 2.5"
          opacity="0.75"
        />

        {/* Sacred Sunrays from Halo */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 360) / 16;
          const rad = (angle * Math.PI) / 180;
          const x1 = 50 + Math.cos(rad) * 42.5;
          const y1 = 48 + Math.sin(rad) * 42.5;
          const x2 = 50 + Math.cos(rad) * 45;
          const y2 = 48 + Math.sin(rad) * 45;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={`url(#${gradId})`}
              strokeWidth="0.8"
              opacity="0.65"
            />
          );
        })}

        {/* Royal Ganesha Mukut (Crown) */}
        <path
          d="M 50,8 
             C 47,15 42,21 38,24 
             C 44,24 47,21 50,18 
             C 53,21 56,24 62,24 
             C 58,21 53,15 50,8 Z"
          fill={`url(#${gradId})`}
        />
        <circle cx="50" cy="11" r="2" fill="#FFFBE8" />
        <path
          d="M 45,20 C 47,17 53,17 55,20 C 53,22 47,22 45,20 Z"
          fill="#FFFBE8"
        />

        {/* Crown Lower Band */}
        <path
          d="M 37,25 C 44,27 56,27 63,25 C 64,28 36,28 37,25 Z"
          fill={`url(#${gradId})`}
        />

        {/* Divine Tilak & Trishul on Forehead */}
        <path
          d="M 50,27 L 50,38"
          stroke="#B81414"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <circle cx="50" cy="40" r="1.6" fill="#B81414" />
        <path
          d="M 46,31 C 48,34 52,34 54,31"
          stroke={`url(#${gradId})`}
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Right Ear (Supakarana) */}
        <path
          d="M 38,26 
             C 30,25 21,30 20,41 
             C 19,50 25,57 34,58 
             C 36,54 36,46 36,41 
             C 36,34 37,29 38,26 Z"
          fill={`url(#${gradId})`}
        />
        {/* Inner ear curve */}
        <path
          d="M 29,33 C 24,37 25,48 31,52"
          fill="none"
          stroke="#42080E"
          strokeWidth="0.8"
          opacity="0.35"
        />

        {/* Left Ear */}
        <path
          d="M 62,26 
             C 70,25 79,30 80,41 
             C 81,50 75,57 66,58 
             C 64,54 64,46 64,41 
             C 64,34 63,29 62,26 Z"
          fill={`url(#${gradId})`}
        />
        {/* Inner left ear curve */}
        <path
          d="M 71,33 C 76,37 75,48 69,52"
          fill="none"
          stroke="#42080E"
          strokeWidth="0.8"
          opacity="0.35"
        />

        {/* Divine Eyes & Brows */}
        <path
          d="M 41,36 C 43,34 46,36 46,37"
          stroke={`url(#${gradId})`}
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 54,37 C 54,36 57,34 59,36"
          stroke={`url(#${gradId})`}
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Single Tusk (Ekadanta) on Right */}
        <path
          d="M 42,50 L 37,53 L 42,54 Z"
          fill="#FFFDF5"
          stroke={`url(#${gradId})`}
          strokeWidth="0.5"
        />

        {/* Left Broken Tusk stub */}
        <path
          d="M 58,50 L 61,52 L 58,53 Z"
          fill="#FFFDF5"
        />

        {/* Sacred Vakratunda Trunk with Gentle Auspicious Leftward/Rightward Curl */}
        <path
          d="M 43,44 
             C 45,43 55,43 57,44 
             C 55,54 53,63 51,72 
             C 49,81 44,88 38,88 
             C 32,88 30,81 33,76 
             C 36,72 42,73 42,77 
             C 42,80 39,81 37,80 
             C 40,84 45,82 46,75 
             C 48,68 50,57 51,48 
             C 47,48 45,46 43,44 Z"
          fill={`url(#${gradId})`}
        />

        {/* Auspicious Modak / Ladoo in Hand / Trunk Tip */}
        <circle cx="36" cy="74" r="3" fill="#FCE57C" stroke={`url(#${gradId})`} strokeWidth="0.8" />
        <circle cx="36" cy="73.5" r="1" fill="#FFF4D0" />

        {/* Auspicious Tripundra Lines on Trunk */}
        <path d="M 46,55 C 48,56 50,56 52,55" stroke="#FFE9A3" strokeWidth="1" fill="none" />
        <path d="M 45,60 C 47,61 49,61 51,60" stroke="#FFE9A3" strokeWidth="1" fill="none" />
        <path d="M 44,65 C 46,66 48,66 50,65" stroke="#FFE9A3" strokeWidth="1" fill="none" />

        {/* Base Lotus Petals (Kamala Asana) */}
        <path
          d="M 32,92 C 38,89 45,90 50,94 C 55,90 62,89 68,92 C 63,96 56,97 50,95 C 44,97 37,96 32,92 Z"
          fill={`url(#${gradId})`}
          opacity="0.85"
        />
      </svg>
    </div>
  );
};

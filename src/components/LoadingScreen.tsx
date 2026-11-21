import React, { useState, useEffect } from 'react';
import { GaneshaSymbol } from './GaneshaSymbol';

interface LoadingScreenProps {
  onLoaded: () => void;
}

const TEXTURES_TO_PRELOAD = [
  '/assets/textures/cover_patrika.jpg',
  '/assets/textures/parchment_gold_flecks.jpg',
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoaded }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Preparing Sacred Wedding Library...');
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    let loadedCount = 0;
    const total = TEXTURES_TO_PRELOAD.length;
    let isMounted = true;

    // Track status message as percentage climbs
    const updateStatus = (pct: number) => {
      if (pct < 30) {
        setStatusText('Preparing Sacred Wedding Library...');
      } else if (pct < 65) {
        setStatusText('Gilding Ceremonial 24K Zari Covers...');
      } else if (pct < 95) {
        setStatusText('Illuminating Sacred Parchment Pages...');
      } else {
        setStatusText('Opening Royal Farman...');
      }
    };

    const finishLoading = () => {
      if (!isMounted) return;
      setProgress(100);
      setStatusText('Welcome to the Royal Celebration');
      setTimeout(() => {
        setIsFadingOut(true);
      }, 350);
      setTimeout(() => {
        onLoaded();
      }, 850);
    };

    // Preload fonts
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.catch(() => {});
    }

    // Preload each texture image
    TEXTURES_TO_PRELOAD.forEach((src) => {
      const img = new Image();
      const onAssetDone = () => {
        if (!isMounted) return;
        loadedCount++;
        const currentPct = Math.min(99, Math.round((loadedCount / total) * 100));
        setProgress(currentPct);
        updateStatus(currentPct);

        if (loadedCount >= total) {
          finishLoading();
        }
      };

      img.onload = onAssetDone;
      img.onerror = onAssetDone;
      img.src = src;
    });

    // Safety timeout: Swift, lightweight load (< 1.2s max)
    const safetyTimer = setTimeout(() => {
      if (isMounted && progress < 100) {
        finishLoading();
      }
    }, 1200);

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
    };
  }, [onLoaded]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between p-6 select-none transition-all duration-700 ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundColor: '#100305',
        backgroundImage: `
          radial-gradient(circle at 50% 45%, rgba(110, 18, 30, 0.5) 0%, rgba(16, 3, 5, 0.98) 75%),
          radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.12) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.12) 0%, transparent 50%)
        `,
      }}
    >
      {/* Ambient Candlelight Flicker */}
      <div className="palace-ambient-glow" aria-hidden="true" />

      {/* Floating Stardust particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#D4AF37] animate-pulse"
            style={{
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              left: `${(i * 14.3) % 96}%`,
              top: `${(i * 18.7) % 94}%`,
              opacity: 0.25 + (i % 4) * 0.15,
              animationDuration: `${2.2 + (i % 3)}s`,
              boxShadow: '0 0 6px rgba(212, 175, 55, 0.7)',
            }}
          />
        ))}
      </div>

      {/* Top Auspicious Deity */}
      <div className="text-center pt-8 z-10">
        <span className="font-['Noto_Serif_Devanagari'] text-xs sm:text-sm font-bold text-[#FFF3D4] tracking-[0.25em] block drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
          ॥ श्री गणेशाय नमः ॥
        </span>
      </div>

      {/* Central Royal Emblem & Progress */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-sm w-full my-auto text-center space-y-6">
        {/* Pulsing Aura Rings around Royal Monogram */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-[#D4AF37]/40 animate-ping" />
          <div className="absolute w-32 h-32 sm:w-36 sm:h-36 rounded-full border border-[#D4AF37]/25 animate-pulse" />

          {/* Central Royal Ganesha Emblem Disc */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-[#D4AF37] flex items-center justify-center bg-[#FAF4E5] shadow-[0_0_30px_rgba(212,175,55,0.6)] transform hover:scale-105 transition-transform p-2">
            <GaneshaSymbol size={62} glow={true} />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-1.5">
          <h2 className="font-['Marcellus'] text-xl sm:text-2xl font-bold tracking-[0.18em] text-[#FFF4D4] drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
            ABHISHEK & ISHITA
          </h2>
          <p className="font-['Noto_Serif_Devanagari'] text-xs sm:text-sm font-semibold text-[#F5DE98] tracking-widest drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            शाही निमंत्रण एवं दर्शन ग्रंथ
          </p>
        </div>

        {/* 24K Gold Zari Progress Bar */}
        <div className="w-full max-w-[280px] sm:max-w-[320px] space-y-2">
          {/* Track */}
          <div className="w-full h-2 rounded-full bg-[#2A0E13] border border-[#D4AF37]/60 overflow-hidden p-[1px] shadow-inner">
            <div
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #9E7B24 0%, #D4AF37 40%, #FFF4D0 70%, #E5A93C 100%)',
                boxShadow: '0 0 10px rgba(212, 175, 55, 0.8)',
              }}
            />
          </div>

          {/* Percentage & Status Details */}
          <div className="flex justify-between items-center text-[11px] font-['Marcellus'] text-[#F5DE98] px-1">
            <span className="tracking-wider uppercase flex items-center font-semibold">
              {statusText}
            </span>
            <span className="font-bold tracking-widest text-[#FFF2CC]">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Bottom Heritage Seal */}
      <div className="text-center pb-6 z-10">
        <span className="font-['Marcellus'] text-[10.5px] sm:text-xs tracking-[0.25em] uppercase text-[#F5DE98]/90 font-semibold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
          5TH & 12TH DECEMBER 2026 • BAKHTAWARPUR, DELHI
        </span>
      </div>
    </div>
  );
};

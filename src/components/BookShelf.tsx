import React, { useEffect, useRef, useState } from 'react';
import { WeddingBookVolume } from '../types/wedding';
import { WaxSeal } from './WaxSeal';
import { sound } from '../utils/audio';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

export const VOLUMES: WeddingBookVolume[] = [
  {
    id: 'invitation',
    volumeNumber: 'HEIRLOOM VOLUME',
    title: 'The Wedding Celebration',
    subtitle: 'SOPHIA & JULIAN • MMXXVI',
    spineColor: '#1A3326', // Deep Emerald Moroccan Leather
    accentColor: '#D4AF37', // Gold Foil
    coverPattern: 'emerald',
    targetSpread: 0,
  },
  {
    id: 'story',
    volumeNumber: 'VOLUME I',
    title: 'The Serendipity',
    subtitle: 'OUR LOVE STORY & MEMORIES',
    spineColor: '#4A1C24', // Royal Burgundy Wine
    accentColor: '#E6C687',
    coverPattern: 'burgundy',
    targetSpread: 1,
  },
  {
    id: 'vows',
    volumeNumber: 'VOLUME II',
    title: 'Order of Celebrations',
    subtitle: 'THE SACRED VOWS & BANQUET',
    spineColor: '#172535', // Midnight Lake Sapphire
    accentColor: '#CBB279',
    coverPattern: 'sapphire',
    targetSpread: 2,
  },
  {
    id: 'attire',
    volumeNumber: 'VOLUME III',
    title: 'Attire & Atmosphere',
    subtitle: 'FORMAL GARDEN & COLOR PALETTE',
    spineColor: '#363428', // Tuscan Olive
    accentColor: '#E2CE9C',
    coverPattern: 'olive',
    targetSpread: 3,
  },
  {
    id: 'venue',
    volumeNumber: 'VOLUME IV',
    title: 'Villa Balbiano',
    subtitle: 'LAKE COMO GUIDE & LODGING',
    spineColor: '#2B1E3A', // Imperial Amethyst
    accentColor: '#D9C189',
    coverPattern: 'amethyst',
    targetSpread: 4,
  },
  {
    id: 'rsvp',
    volumeNumber: 'VOLUME V',
    title: 'The Guestbook & RSVP',
    subtitle: 'KINDLY CONFIRM ATTENDANCE',
    spineColor: '#582B1C', // Terracotta Sienna
    accentColor: '#E8D4A8',
    coverPattern: 'terracotta',
    targetSpread: 5,
  },
];

interface BookShelfProps {
  onOpenBook: (spreadIndex: number) => void;
}

export const BookShelf: React.FC<BookShelfProps> = ({ onOpenBook }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tilt tracking for active book
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -14, y: x * 20 });
  };

  const handlePrev = () => {
    sound.playPageFlip();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : VOLUMES.length - 1));
  };

  const handleNext = () => {
    sound.playPageFlip();
    setCurrentIndex((prev) => (prev < VOLUMES.length - 1 ? prev + 1 : 0));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onOpenBook(VOLUMES[currentIndex].targetSpread);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const activeVol = VOLUMES[currentIndex];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden select-none"
    >
      {/* Top Header */}
      <header className="w-full pt-8 pb-4 px-8 flex justify-between items-center z-20">
        <div className="flex flex-col text-left">
          <span className="font-['Cinzel'] text-xs tracking-[0.3em] uppercase text-[#B2935B] font-semibold">
            Wedding Keepsake Library
          </span>
          <span className="font-['Cormorant_Garamond'] text-sm italic text-[#877866]">
            Lake Como, Italy • October 2026
          </span>
        </div>

        <div className="text-center">
          <h1 className="font-['Cinzel'] text-xl md:text-2xl font-bold tracking-[0.25em] text-[#2C241E]">
            SOPHIA & JULIAN
          </h1>
          <p className="font-['Alex_Brush'] text-xl md:text-2xl text-[#9A3542] -mt-1">
            The Celebration of Marriage
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenBook(activeVol.targetSpread)}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 border border-[#B89758] bg-[#F7F3EB]/80 hover:bg-[#F2ECE0] text-[#705527] font-['Cinzel'] text-xs font-semibold tracking-wider rounded shadow-sm transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Open Book
          </button>
        </div>
      </header>

      {/* Main 3D Shelf Stage */}
      <div className="relative w-full flex-1 flex items-center justify-center perspective-[2000px]">
        {/* Ornate Shelf Mantlepiece Wall Shadow */}
        <div className="absolute w-[92vw] max-w-5xl h-[420px] rounded-2xl bg-gradient-to-b from-[#E6E0D3]/50 to-[#D8D0BF]/30 blur-2xl pointer-events-none" />

        {/* The 3D Books Rack */}
        <div className="relative flex items-end justify-center gap-3 sm:gap-6 md:gap-8 h-[360px] md:h-[430px] z-10 transition-transform duration-500">
          {VOLUMES.map((vol, idx) => {
            const isCenter = idx === currentIndex;
            const dist = idx - currentIndex;
            const isHovered = hoveredIndex === idx;

            // Compute 3D translation & rotation
            const rotY = isCenter ? tilt.y : dist * -18;
            const rotX = isCenter ? tilt.x : 0;
            const transZ = isCenter ? 80 : Math.max(-160, -Math.abs(dist) * 60);
            const transY = isCenter ? (isHovered ? -24 : -12) : 0;
            const transX = dist * 20;

            return (
              <div
                key={vol.id}
                onClick={() => {
                  if (isCenter) {
                    onOpenBook(vol.targetSpread);
                  } else {
                    sound.playPageFlip();
                    setCurrentIndex(idx);
                  }
                }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  transform: `translateX(${transX}px) translateY(${transY}px) translateZ(${transZ}px) rotateY(${rotY}deg) rotateX(${rotX}deg)`,
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
                  zIndex: isCenter ? 30 : 20 - Math.abs(dist),
                }}
                className="relative cursor-pointer group will-change-transform"
              >
                {/* Book Construction: Hardbound 3D Object */}
                <div
                  className="relative w-[130px] sm:w-[170px] md:w-[220px] h-[270px] sm:h-[330px] md:h-[390px] rounded-r-md shadow-2xl flex flex-col justify-between p-5 border-l-[14px] sm:border-l-[18px] border-r-2 overflow-hidden"
                  style={{
                    backgroundColor: vol.spineColor,
                    borderColor: '#111814',
                    boxShadow: isCenter
                      ? '0 35px 70px -15px rgba(20, 15, 10, 0.6), 0 0 30px rgba(212, 175, 55, 0.15)'
                      : '0 20px 40px -10px rgba(20, 15, 10, 0.5)',
                  }}
                >
                  {/* Antique Leather Texture Overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-25 mix-blend-overlay"
                    style={{
                      backgroundImage: `radial-gradient(circle at 50% 30%, rgba(255,255,255,0.4) 0%, transparent 60%), linear-gradient(to right, rgba(0,0,0,0.6) 0%, transparent 12%, rgba(255,255,255,0.1) 15%, transparent 20%, transparent 95%, rgba(0,0,0,0.4) 100%)`,
                    }}
                  />

                  {/* Gold Foil Ornate Border */}
                  <div className="absolute inset-3 border border-[#D4AF37]/60 rounded-sm pointer-events-none">
                    <div className="absolute inset-1 border border-[#D4AF37]/30" />
                    {/* Corner Ornaments */}
                    <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#EAD28B]" />
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#EAD28B]" />
                    <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#EAD28B]" />
                    <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#EAD28B]" />
                  </div>

                  {/* Top Monogram / Header */}
                  <div className="relative text-center pt-2">
                    <span className="font-['Cinzel'] text-[9px] sm:text-[10px] tracking-[0.3em] font-bold text-[#E5CE93] block">
                      {vol.volumeNumber}
                    </span>
                    <div className="w-8 h-[1px] bg-[#D4AF37]/60 mx-auto my-1.5" />
                  </div>

                  {/* Center Monogram Emblem */}
                  <div className="relative flex flex-col items-center justify-center my-auto py-2">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-[#D4AF37]/70 flex items-center justify-center bg-black/20 shadow-inner">
                      <span className="font-['Cinzel'] text-sm sm:text-base font-bold text-[#F5E2B2] tracking-wider">
                        S & J
                      </span>
                    </div>

                    <h2 className="font-['Cinzel'] text-xs sm:text-sm md:text-base font-bold text-[#F7E6BD] tracking-[0.16em] text-center mt-3 leading-tight px-1 uppercase">
                      {vol.title}
                    </h2>

                    <p className="font-['Inter_Tight'] text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[#C9BA98] text-center mt-1">
                      {vol.subtitle}
                    </p>
                  </div>

                  {/* Bottom Footer: Date & Seal */}
                  <div className="relative text-center pb-2">
                    <span className="font-['Cinzel'] text-[9px] sm:text-[10px] tracking-[0.25em] text-[#D8C496]">
                      OCTOBER 24, 2026
                    </span>
                  </div>

                  {/* Gilded Edge Shine */}
                  <div className="absolute top-0 right-0 bottom-0 w-2 bg-gradient-to-r from-transparent via-[#E2C983]/30 to-[#F6E7B8]/60 pointer-events-none" />
                </div>

                {/* Raised Spine Binding Bands along Left Edge */}
                <div className="absolute -left-[14px] sm:-left-[18px] top-0 bottom-0 w-[14px] sm:w-[18px] bg-[#0E1712] rounded-l-sm flex flex-col justify-between py-6 px-0.5 shadow-2xl border-r border-[#2C3B32]">
                  {[0, 1, 2, 3, 4].map((band) => (
                    <div
                      key={band}
                      className="w-full h-1.5 bg-gradient-to-r from-[#D4AF37]/80 to-[#95741E] rounded-full shadow-sm"
                    />
                  ))}
                </div>

                {/* Soft Contact Drop Shadow on the Marble Shelf */}
                <div
                  className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-[85%] h-6 bg-black/45 rounded-full blur-md pointer-events-none"
                  style={{
                    transform: `translateX(-50%) scale(${isCenter ? 1.15 : 0.9})`,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* The Realistic Oak & Marble Bookshelf Ledge */}
        <div className="absolute bottom-[40px] md:bottom-[60px] w-full max-w-6xl h-8 bg-gradient-to-b from-[#8C7456] via-[#6B553C] to-[#453422] rounded-t-sm shadow-[0_12px_24px_rgba(0,0,0,0.4)] border-t border-[#A88E6E] flex items-center justify-between px-8">
          <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
        </div>
        {/* Ledge front beveled face */}
        <div className="absolute bottom-[24px] md:bottom-[44px] w-full max-w-6xl h-4 bg-gradient-to-b from-[#3D2D1D] to-[#251A10] shadow-2xl" />
      </div>

      {/* Center Interactive Prompt / Wax Seal */}
      <div className="relative z-20 pb-8 flex flex-col items-center gap-3">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handlePrev}
            className="w-10 h-10 rounded-full border border-[#B89758]/60 bg-[#F7F3EB]/70 hover:bg-[#F2ECE0] text-[#634E28] flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            aria-label="Previous volume"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => onOpenBook(activeVol.targetSpread)}
            className="group flex items-center gap-3 py-2 px-5 bg-[#781B27] hover:bg-[#63131E] text-[#F9F5EE] rounded-full border border-[#9A3745] shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            <WaxSeal size={32} monogram="S & J" color="#9A2B3A" />
            <div className="flex flex-col text-left">
              <span className="font-['Cinzel'] text-xs font-bold tracking-[0.2em] uppercase">
                Open Invitation
              </span>
              <span className="font-['Inter_Tight'] text-[9px] uppercase tracking-[0.14em] text-[#E8D4A8]">
                {activeVol.title}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="w-10 h-10 rounded-full border border-[#B89758]/60 bg-[#F7F3EB]/70 hover:bg-[#F2ECE0] text-[#634E28] flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            aria-label="Next volume"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <p className="font-['Inter_Tight'] text-[10px] uppercase tracking-[0.2em] text-[#8C7A65]">
          Volume {currentIndex + 1} of {VOLUMES.length} • Drag or Use Arrow Keys To Browse
        </p>
      </div>
    </div>
  );
};


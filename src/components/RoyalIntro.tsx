import React, { useState, useEffect } from 'react';
import { WaxSeal } from './WaxSeal';
import { sound } from '../utils/audio';
import { Sparkles, Volume2, VolumeX, ArrowRight, Heart } from 'lucide-react';

interface RoyalIntroProps {
  onComplete: () => void;
  onTriggerPetals?: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
}

export const RoyalIntro: React.FC<RoyalIntroProps> = ({
  onComplete,
  onTriggerPetals,
  soundEnabled,
  onToggleSound,
}) => {
  const [isOpening, setIsOpening] = useState(false);
  const [isUnfolded, setIsUnfolded] = useState(false);
  const [isDissolving, setIsDissolving] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [burstSparkles, setBurstSparkles] = useState<SparkleParticle[]>([]);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 3D Mouse Parallax on Desktop
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || isOpening) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 16;
    const y = (clientY / innerHeight - 0.5) * -16;
    setTilt({ x, y });
  };

  const handleOpenEnvelope = () => {
    if (isOpening) return;
    setIsOpening(true);

    // 1. Play tactile wax stamp sound & romantic celebration chime
    sound.playWaxStamp();
    sound.playCelebrationChime();

    // 2. Start soothing ambient palace music
    if (soundEnabled && !sound.getMusicPlaying()) {
      sound.startMusic();
    }

    // 3. Trigger rose & marigold petal shower
    if (onTriggerPetals) {
      onTriggerPetals();
    }

    // 4. Generate grand 36-particle golden sparkle burst
    const colors = ['#F5D061', '#E5A93C', '#FFF3B0', '#FFFFFF', '#D4AF37'];
    const newSparkles: SparkleParticle[] = Array.from({ length: 36 }).map((_, i) => {
      const angle = (i / 36) * Math.PI * 2;
      const speed = Math.random() * 110 + 40;
      return {
        id: Date.now() + i,
        x: 50,
        y: 50,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 1,
      };
    });
    setBurstSparkles(newSparkles);

    // 5. Sequence envelope flap opening & parchment rise
    setTimeout(() => {
      setIsUnfolded(true);
      sound.playPageFlip();
    }, 550);

    // 6. Fade out and dissolve into library shelf
    setTimeout(() => {
      setIsDissolving(true);
    }, 1800);

    setTimeout(() => {
      onComplete();
    }, 2400);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between overflow-hidden select-none transition-all duration-700 ${
        isDissolving ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundColor: '#140609',
        backgroundImage: `
          radial-gradient(circle at 50% 45%, rgba(122, 21, 34, 0.45) 0%, rgba(20, 6, 9, 0.95) 75%),
          radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.12) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.12) 0%, transparent 50%)
        `,
      }}
    >
      {/* Candle Flame Ambient Pulsation */}
      <div className="palace-ambient-glow" aria-hidden="true" />

      {/* Floating Stardust Particles in Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 28 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#D4AF37] animate-pulse"
            style={{
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              left: `${(i * 13.7) % 98}%`,
              top: `${(i * 17.3) % 96}%`,
              opacity: 0.25 + (i % 5) * 0.12,
              animationDuration: `${2.5 + (i % 4)}s`,
              animationDelay: `${(i * 0.3) % 3}s`,
              boxShadow: '0 0 8px rgba(212, 175, 55, 0.8)',
            }}
          />
        ))}
      </div>

      {/* TOP HEADER CONTROLS */}
      <header className="w-full pt-4 sm:pt-6 px-4 sm:px-10 flex justify-between items-center z-20">
        <div className="flex items-center gap-2 text-[#D4AF37]">
          <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
          <span className="font-['Marcellus'] text-xs sm:text-sm tracking-[0.25em] uppercase text-[#E5C158] font-bold">
            Mewar Royal Invitation
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
            className="p-2 border border-[#D4AF37]/60 bg-[#2A0E13]/80 hover:bg-[#7A1522] text-[#E5C158] rounded-full transition-all cursor-pointer shadow-md backdrop-blur-sm"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onComplete}
            className="py-1.5 px-3.5 border border-[#D4AF37]/60 bg-[#2A0E13]/80 hover:bg-[#7A1522] text-[#FAF6ED] rounded-full text-xs font-['Marcellus'] tracking-wider uppercase font-semibold transition-all cursor-pointer shadow-md flex items-center gap-1.5 backdrop-blur-sm group"
          >
            <span>Skip to Library</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </header>

      {/* CENTERPIECE: 3D ROYAL VELVET FARMAN ENVELOPE */}
      <main className="relative flex-1 w-full flex items-center justify-center p-3 sm:p-6 z-10">
        <div
          className="relative transition-transform duration-300 ease-out"
          style={{
            perspective: '1200px',
            transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
          }}
        >
          {/* Radiant Golden Glow under Envelope */}
          <div className="absolute inset-0 bg-[#D4AF37]/20 rounded-2xl blur-2xl transform scale-95 pointer-events-none" />

          {/* THE ROYAL VELVET ENVELOPE BOX */}
          <div
            className={`relative rounded-xl border-2 border-[#D4AF37]/80 shadow-[0_25px_80px_rgba(0,0,0,0.85)] bg-cover bg-center overflow-hidden transition-all duration-700 ${
              isMobile
                ? 'w-[90vw] max-w-[360px] h-[520px]'
                : 'w-[440px] sm:w-[480px] h-[580px]'
            }`}
            style={{
              backgroundColor: '#5A0C16',
              backgroundImage: `
                radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 70%),
                url('/assets/textures/cover_patrika.jpg')
              `,
            }}
          >
            {/* Intricate Gold Foil Filigree Inner Border */}
            <div className="absolute inset-2.5 sm:inset-3 border border-[#D4AF37]/70 rounded pointer-events-none">
              <div className="absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37]" />
              <div className="absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37]" />
              <div className="absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37]" />
              <div className="absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37]" />
            </div>

            {/* ENVELOPE CONTENT */}
            <div className="relative h-full flex flex-col justify-between items-center text-center p-6 sm:p-8 z-10">
              {/* Auspicious Shloka & Deity Invocation */}
              <div className="space-y-1.5 pt-1">
                <span className="font-['Noto_Serif_Devanagari'] text-xs sm:text-sm font-bold gold-foil-heading tracking-[0.2em] block drop-shadow">
                  ॥ श्री गणेशाय नमः ॥
                </span>
                <span className="font-['Marcellus'] text-[9.5px] sm:text-[10px] tracking-[0.25em] text-[#D8C288] uppercase block">
                  Auspicious Wedding Announcement
                </span>
              </div>

              {/* Royal Couple Monogram & Arch */}
              <div className="my-auto space-y-3.5 w-full">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[#D4AF37] mx-auto flex items-center justify-center bg-[#FAF4E5]/90 shadow-[0_0_20px_rgba(212,175,55,0.45)] transform hover:scale-105 transition-transform">
                  <span className="font-['Marcellus'] text-2xl sm:text-3xl font-bold gold-foil-text">
                    अ & इ
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-['Marcellus'] tracking-[0.3em] uppercase text-[#E5D2A8] block">
                    The Wedding Celebrations of
                  </span>
                  <h1 className="font-['Marcellus'] text-2xl sm:text-3xl font-bold tracking-[0.18em]">
                    <span className="gold-foil-heading block">ABHISHEK</span>
                    <span className="block font-['Alex_Brush'] text-2xl sm:text-3xl font-normal text-[#FAF0E1] lowercase -my-1">
                      weds
                    </span>
                    <span className="gold-foil-heading block">ISHITA</span>
                  </h1>
                  <span className="font-['Noto_Serif_Devanagari'] text-xs font-semibold text-[#F7E6B8] tracking-widest block pt-0.5">
                    ॥ अभिषेक संग इशिता ॥
                  </span>
                </div>

                <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />

                <div className="space-y-0.5 text-xs font-['Marcellus'] text-[#F3E2C4]">
                  <p className="tracking-widest uppercase font-semibold text-[11px] text-[#FFDF85]">
                    THE OBEROI UDAIVILAS
                  </p>
                  <p className="tracking-widest uppercase text-[9.5px] text-[#D4AF37]">
                    Udaipur, Rajasthan • 28–30 Nov 2026
                  </p>
                </div>
              </div>

              {/* SILK RIBBON & WAX SEAL OPEN BUTTON */}
              <div className="relative w-full flex flex-col items-center pt-2 pb-1">
                {/* Horizontal Crimson Silk Ribbon Bar across envelope */}
                <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-8 bg-gradient-to-r from-[#4A0A12] via-[#7A1522] to-[#4A0A12] border-y border-[#D4AF37]/60 shadow-md pointer-events-none" />

                {/* Pulsing Hint Badge above seal */}
                <div className="relative z-20 mb-3 animate-bounce">
                  <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-[#1A0B0E]/90 border border-[#D4AF37] text-[10px] font-['Marcellus'] font-bold tracking-widest text-[#FFDF85] uppercase shadow-lg backdrop-blur-sm">
                    <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                    <span>Break Seal to Open</span>
                  </span>
                </div>

                {/* THE INTERACTIVE 3D WAX SEAL */}
                <div className="relative z-20 flex items-center justify-center">
                  {/* Pulsing Aura Rings */}
                  <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-[#D4AF37]/50 animate-ping pointer-events-none" />
                  <div className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-[#D4AF37]/30 animate-pulse pointer-events-none" />

                  <WaxSeal
                    size={isMobile ? 78 : 88}
                    monogram="अ & इ"
                    color="#8E1728"
                    onClick={handleOpenEnvelope}
                    label="Click to break seal and enter royal wedding"
                    className="transform hover:scale-110 active:scale-95 transition-transform"
                  />
                </div>

                {/* Sparkle Burst Animation Overlay */}
                {burstSparkles.length > 0 && (
                  <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
                    {burstSparkles.map((sp) => (
                      <div
                        key={sp.id}
                        className="absolute rounded-full"
                        style={{
                          width: `${sp.size}px`,
                          height: `${sp.size}px`,
                          backgroundColor: sp.color,
                          boxShadow: `0 0 10px ${sp.color}`,
                          transform: `translate(${sp.vx}px, ${sp.vy}px)`,
                          opacity: sp.opacity,
                          transition: 'all 0.75s cubic-bezier(0.1, 0.9, 0.2, 1)',
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Family Blessing Signature */}
              <div className="pt-2 text-[10px] font-['Cormorant_Garamond'] italic text-[#D8C7B0]">
                "With the heavenly blessings of our beloved elders"
              </div>
            </div>

            {/* UNFOLDING WELCOME LETTER OVERLAY (Slides forward upon breaking seal) */}
            <div
              className={`absolute inset-0 z-30 bg-[#FAF6ED] bg-[url('/assets/textures/parchment_gold_flecks.jpg')] bg-cover bg-center p-6 sm:p-8 flex flex-col justify-between items-center text-center transition-all duration-700 shadow-2xl ${
                isUnfolded
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-full opacity-0 pointer-events-none'
              }`}
            >
              <div className="space-y-1">
                <span className="font-['Noto_Serif_Devanagari'] text-xs font-bold gold-foil-heading tracking-widest block">
                  ॥ पधारो म्हारे देश ॥
                </span>
                <span className="font-['Marcellus'] text-xs tracking-wider uppercase text-[#7A1522] font-bold">
                  Welcome to the Royal Wedding Library
                </span>
              </div>

              <div className="space-y-3 my-auto max-w-xs">
                <div className="w-12 h-12 rounded-full border border-[#D4AF37] mx-auto flex items-center justify-center bg-[#FAF4E5] shadow-sm">
                  <Heart className="w-6 h-6 text-[#8E1728] fill-current" />
                </div>

                <p className="font-['Cormorant_Garamond'] text-sm sm:text-base italic text-[#4A3C2D] leading-relaxed">
                  "Two souls, two families, and a sacred celebration by the serene waters of Lake Pichola."
                </p>

                <p className="text-xs font-['Inter_Tight'] text-[#6B5A47] leading-relaxed">
                  Please explore our 8 ceremonial volumes: our love story, the itinerary, attire palette, and kindly confirm your presence.
                </p>
              </div>

              <div className="pt-2 border-t border-[#D9CDB8] w-full flex justify-between text-[10px] font-['Marcellus'] text-[#8C7A65]">
                <span>Abhishek & Ishita</span>
                <span>The Oberoi Udaivilas</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* BOTTOM FOOTER */}
      <footer className="w-full pb-4 sm:pb-6 px-4 text-center z-20">
        <span className="font-['Marcellus'] text-[11px] sm:text-xs tracking-[0.25em] uppercase text-[#D4AF37]">
          ॥ 28th • 29th • 30th November 2026 • The Oberoi Udaivilas, Udaipur ॥
        </span>
      </footer>
    </div>
  );
};


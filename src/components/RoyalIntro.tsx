import React, { useState, useEffect } from 'react';
import { WaxSeal } from './WaxSeal';
import { sound } from '../utils/audio';
import { Volume2, VolumeX, ArrowRight, ArrowDown, Heart, Sparkles } from 'lucide-react';

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
  const [isSealBroken, setIsSealBroken] = useState(false);
  const [isUnfolded, setIsUnfolded] = useState(false);
  const [isRollingDown, setIsRollingDown] = useState(false);
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

  const handleOpenEnvelope = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault?.();
      e.stopPropagation?.();
    }
    if (isOpening) return;
    setIsOpening(true);

    // 1. Trigger the tactile wax fracture and crack animation immediately
    setIsSealBroken(true);
    sound.playWaxCrack();

    // 2. Play romantic celebration chime
    setTimeout(() => {
      sound.playCelebrationChime();
    }, 120);

    // 3. Start soothing ambient palace music if sound is enabled
    if (soundEnabled && !sound.getMusicPlaying()) {
      sound.startMusic();
    }

    // 4. Trigger rose & marigold petal shower
    if (onTriggerPetals) {
      onTriggerPetals();
    }

    // 5. Generate grand 40-particle golden sparkle burst from seal fracture
    const colors = ['#FFF6D1', '#FFDF73', '#D4AF37', '#FFFFFF', '#E5A93C'];
    const newSparkles: SparkleParticle[] = Array.from({ length: 40 }).map((_, i) => {
      const angle = (i / 40) * Math.PI * 2;
      const speed = Math.random() * 120 + 45;
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

    // 6. Envelope flap opens and royal cloth paper scroll unfolds into view
    setTimeout(() => {
      setIsUnfolded(true);
      sound.playPageFlip();
    }, 380);

    // NOTICE: The royal page STAYS OPEN! It will only roll down when tapped by the user.
  };

  // Interactive Roll-Down action: When the user taps the open cloth paper scroll,
  // it realistically curls and rolls down to reveal the 3D bookshelf underneath.
  const handleRollDown = () => {
    if (isRollingDown) return;
    setIsRollingDown(true);
    sound.playScrollRoll();
    sound.playCelebrationChime();

    setTimeout(() => {
      setIsDissolving(true);
    }, 550);

    setTimeout(() => {
      onComplete();
    }, 750);
  };

  return (
    <div
      data-royal-intro="true"
      onMouseMove={handleMouseMove}
      className={`royal-intro fixed inset-0 z-50 flex flex-col items-center justify-between overflow-hidden select-none transition-all duration-700 ${
        isDissolving ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{
        backgroundColor: '#120407',
        backgroundImage: `
          radial-gradient(circle at 50% 45%, rgba(122, 21, 34, 0.5) 0%, rgba(18, 4, 7, 0.98) 78%),
          radial-gradient(circle at 15% 85%, rgba(212, 175, 55, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 85% 15%, rgba(212, 175, 55, 0.15) 0%, transparent 50%)
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
              opacity: 0.3 + (i % 5) * 0.12,
              animationDuration: `${2.5 + (i % 4)}s`,
              animationDelay: `${(i * 0.3) % 3}s`,
              boxShadow: '0 0 8px rgba(212, 175, 55, 0.8)',
            }}
          />
        ))}
      </div>

      {/* TOP HEADER CONTROLS */}
      <header className="w-full pt-3 sm:pt-6 px-4 sm:px-10 flex justify-between items-center z-20">
        <div className="flex items-center text-[#D4AF37]">
          <span className="font-['Marcellus'] text-xs sm:text-sm tracking-[0.25em] uppercase text-[#F5DE98] font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            Mewar Royal Invitation
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
            className="p-2 border border-[#D4AF37]/70 bg-[#2A0E13]/90 hover:bg-[#7A1522] text-[#F5DE98] rounded-full transition-all cursor-pointer shadow-md backdrop-blur-sm"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onComplete}
            className="py-1.5 px-3.5 border border-[#D4AF37]/70 bg-[#2A0E13]/90 hover:bg-[#7A1522] text-[#FAF6ED] rounded-full text-xs font-['Marcellus'] tracking-wider uppercase font-semibold transition-all cursor-pointer shadow-md flex items-center gap-1.5 backdrop-blur-sm group"
          >
            <span>Skip to Library</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </header>

      {/* CENTERPIECE: 3D ROYAL VELVET FARMAN ENVELOPE */}
      <main className="relative flex-1 w-full flex items-center justify-center p-2.5 sm:p-6 z-10">
        <div
          className="relative transition-transform duration-300 ease-out"
          style={{
            perspective: '1200px',
            transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
          }}
        >
          {/* Radiant Golden Glow under Envelope */}
          <div className="absolute inset-0 bg-[#D4AF37]/25 rounded-2xl blur-3xl transform scale-95 pointer-events-none" />

          {/* THE ROYAL VELVET ENVELOPE BOX */}
          <div
            className={`relative rounded-xl border-2 border-[#D4AF37] shadow-[0_25px_80px_rgba(0,0,0,0.95)] bg-cover bg-center overflow-hidden transition-all duration-700 ${
              isMobile
                ? 'w-[94vw] max-w-[380px] h-[510px] max-h-[76vh]'
                : 'w-[450px] sm:w-[490px] h-[590px]'
            }`}
            style={{
              backgroundColor: '#4A0812',
              backgroundImage: `url('/assets/textures/cover_patrika.jpg')`,
            }}
          >
            {/* Dark Velvet Vignette & AI Ghost-Text Blocker */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  radial-gradient(ellipse at 50% 45%, rgba(20, 3, 7, 0.96) 0%, rgba(32, 6, 12, 0.94) 55%, rgba(18, 3, 6, 0.98) 100%)
                `,
              }}
            />

            {/* Intricate Gold Foil Filigree Outer Border Frame */}
            <div className="absolute inset-2 sm:inset-3 border border-[#D4AF37]/80 rounded pointer-events-none">
              <div className="absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 border-[#FFE29E]" />
              <div className="absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 border-[#FFE29E]" />
              <div className="absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2 border-[#FFE29E]" />
              <div className="absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2 border-[#FFE29E]" />
            </div>

            {/* ENVELOPE CONTENT */}
            <div
              className={`relative h-full flex flex-col justify-between items-center text-center p-3 sm:p-7 z-10 transition-opacity duration-300 ${
                isUnfolded ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              {/* Auspicious Shloka & Deity Invocation */}
              <div className="space-y-0.5 pt-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                <span className="font-['Noto_Serif_Devanagari'] text-xs sm:text-sm font-bold text-[#FFF3D4] tracking-[0.24em] block drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
                  ॥ श्री गणेशाय नमः ॥
                </span>
                <span className="font-['Marcellus'] text-[9px] sm:text-[10px] tracking-[0.28em] text-[#F5DE98] uppercase block font-semibold">
                  Auspicious Wedding Announcement
                </span>
              </div>

              {/* CENTRAL ROYAL MEHRAB ARCH CONTRAST PLATE
                  Provides 100% crystal-clear readability with authentic Rajasthani palace styling */}
              <div
                className="my-auto w-full max-w-[330px] sm:max-w-[370px] py-3.5 px-3.5 sm:px-6 rounded-t-[140px] rounded-b-2xl border-2 border-[#D4AF37]/90 shadow-[0_16px_40px_rgba(0,0,0,0.9),inset_0_0_24px_rgba(0,0,0,0.75)] backdrop-blur-md relative"
                style={{
                  background: 'radial-gradient(ellipse at 50% 35%, rgba(68, 12, 22, 0.98) 0%, rgba(24, 4, 9, 0.99) 85%)',
                }}
              >
                {/* Inner Delicate Gold Hairline Border */}
                <div className="absolute inset-1.5 rounded-t-[132px] rounded-b-xl border border-[#F5DE98]/45 pointer-events-none" />

                {/* Royal Couple Monogram Medallion */}
                <div className="relative mb-2">
                  <div className="w-14 h-14 sm:w-18 sm:h-18 rounded-full border-2 border-[#D4AF37] mx-auto flex items-center justify-center bg-[#FAF4E5] shadow-[0_0_22px_rgba(212,175,55,0.65)] transform hover:scale-105 transition-transform">
                    <span className="font-['Marcellus'] text-xl sm:text-2xl font-bold gold-foil-text drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                      अ & इ
                    </span>
                  </div>
                </div>

                {/* The Wedding Celebrations Heading */}
                <div className="space-y-0.5">
                  <span className="text-[9.5px] sm:text-[10.5px] font-['Marcellus'] tracking-[0.32em] uppercase text-[#FFE3A4] font-semibold block drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                    The Wedding Celebrations of
                  </span>

                  {/* High-Contrast Bride & Groom Names */}
                  <h1 className="font-['Marcellus'] tracking-[0.16em] my-1">
                    <span
                      className="block text-2xl sm:text-3xl font-bold text-[#FFF2CC] tracking-[0.18em]"
                      style={{
                        textShadow: '0 2px 8px rgba(0,0,0,0.95), 0 0 16px rgba(212,175,55,0.45)',
                      }}
                    >
                      ABHISHEK
                    </span>
                    <span
                      className="block font-['Alex_Brush'] text-2xl sm:text-3xl font-normal text-[#FFF8ED] lowercase -my-1"
                      style={{
                        textShadow: '0 2px 6px rgba(0,0,0,0.9), 0 0 10px rgba(255,248,237,0.5)',
                      }}
                    >
                      weds
                    </span>
                    <span
                      className="block text-2xl sm:text-3xl font-bold text-[#FFF2CC] tracking-[0.18em]"
                      style={{
                        textShadow: '0 2px 8px rgba(0,0,0,0.95), 0 0 16px rgba(212,175,55,0.45)',
                      }}
                    >
                      ISHITA
                    </span>
                  </h1>

                  {/* Auspicious Hindi Subheading */}
                  <span className="font-['Noto_Serif_Devanagari'] text-xs sm:text-sm font-bold text-[#FFE8B6] tracking-widest block pt-0.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.95)]">
                    ॥ अभिषेक संग इशिता ॥
                  </span>
                </div>

                {/* Elegant Gold Divider */}
                <div className="w-24 sm:w-28 h-[1.5px] bg-gradient-to-r from-transparent via-[#F5DE98] to-transparent mx-auto my-1.5 shadow-sm" />

                {/* High-Contrast Royal Venue & Date */}
                <div className="space-y-0.5 font-['Marcellus']">
                  <p
                    className="tracking-[0.22em] uppercase font-bold text-[11px] sm:text-[12.5px] text-[#FFF4D4]"
                    style={{ textShadow: '0 2px 6px rgba(0,0,0,0.95)' }}
                  >
                    THE OBEROI UDAIVILAS
                  </p>
                  <p
                    className="tracking-[0.16em] uppercase text-[9.5px] sm:text-[10.5px] text-[#F5DE98] font-semibold"
                    style={{ textShadow: '0 1px 4px rgba(0,0,0,0.95)' }}
                  >
                    Udaipur, Rajasthan • 28–30 Nov 2026
                  </p>
                </div>
              </div>

              {/* SILK RIBBON & WAX SEAL INTERACTION ZONE */}
              <div className="relative w-full flex flex-col items-center pt-1.5 pb-1">
                {/* Horizontal Crimson Silk Ribbon that splits & retracts on seal break */}
                <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-8 flex overflow-hidden pointer-events-none">
                  {/* Left Ribbon Half */}
                  <div
                    className="w-1/2 h-full bg-gradient-to-r from-[#3D060D] via-[#7A1522] to-[#8E1728] border-y border-[#D4AF37]/80 shadow-md transition-transform duration-700 ease-in-out"
                    style={{
                      transform: isSealBroken ? 'translateX(-120%)' : 'translateX(0)',
                    }}
                  />
                  {/* Right Ribbon Half */}
                  <div
                    className="w-1/2 h-full bg-gradient-to-l from-[#3D060D] via-[#7A1522] to-[#8E1728] border-y border-[#D4AF37]/80 shadow-md transition-transform duration-700 ease-in-out"
                    style={{
                      transform: isSealBroken ? 'translateX(120%)' : 'translateX(0)',
                    }}
                  />
                </div>

                {/* Pulsing Hint Button / Badge above seal */}
                <div className="relative z-20 mb-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEnvelope(e);
                    }}
                    disabled={isOpening}
                    className={`inline-flex items-center py-1.5 px-4 rounded-full border border-[#D4AF37] text-xs font-['Marcellus'] font-bold tracking-widest uppercase shadow-[0_4px_16px_rgba(0,0,0,0.85)] backdrop-blur-md cursor-pointer transition-all duration-300 ${
                      isSealBroken
                        ? 'bg-[#4A0A12] text-[#F5DE98] scale-95 opacity-80'
                        : 'bg-[#1F070B]/95 text-[#FFF2CC] hover:bg-[#7A1522] hover:scale-105 active:scale-95 animate-bounce'
                    }`}
                  >
                    <span>{isSealBroken ? 'Seal Broken' : 'Break Seal to Open'}</span>
                  </button>
                </div>

                {/* THE INTERACTIVE 3D WAX SEAL WITH FRACTURE ANIMATION */}
                <div className="relative z-20 flex items-center justify-center">
                  {!isSealBroken && (
                    <>
                      {/* Pulsing Aura Rings while unbroken */}
                      <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-[#D4AF37]/50 animate-ping pointer-events-none" />
                      <div className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-[#D4AF37]/30 animate-pulse pointer-events-none" />
                    </>
                  )}

                  <WaxSeal
                    size={isMobile ? 76 : 88}
                    monogram="अ & इ"
                    color="#8E1728"
                    isBroken={isSealBroken}
                    onClick={() => handleOpenEnvelope()}
                    label="Click to break seal and enter royal wedding"
                    className="transform hover:scale-110 active:scale-95 transition-transform"
                  />
                </div>

                {/* Radiant Sparkle Burst Animation Overlay */}
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
                          transition: 'all 0.85s cubic-bezier(0.12, 0.85, 0.25, 1)',
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Family Blessing Signature */}
              <div
                className="pt-1.5 text-xs font-['Cormorant_Garamond'] italic text-[#FFF0D9] font-medium"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.95)' }}
              >
                "With the heavenly blessings of our beloved elders"
              </div>
            </div>

            {/* UNFOLDED ROYAL CLOTH PAPER SCROLL (FARMAN)
                Authentic silk khadi parchment scroll with top & bottom golden rods.
                STAYS OPEN until the user taps on it, then smoothly rolls down to reveal the shelf! */}
            <div
              onClick={handleRollDown}
              className={`cloth-paper-scroll absolute inset-0 z-40 p-3 sm:p-7 flex flex-col justify-between items-center text-center cursor-pointer transition-all duration-700 shadow-2xl overflow-y-auto no-scrollbar ${
                isUnfolded
                  ? isRollingDown
                    ? 'scroll-rolling-down'
                    : 'translate-y-0 opacity-100 scale-100 pointer-events-auto'
                  : 'translate-y-full opacity-0 scale-95 pointer-events-none'
              }`}
            >
              {/* Top Golden Scroll Rod */}
              <div className="scroll-rod mb-1">
                <div className="scroll-finial left" />
                <div className="scroll-finial right" />
              </div>

              {/* Ornate Gold Filigree Inner Frame */}
              <div className="absolute inset-3 border border-[#B38A24]/70 pointer-events-none rounded">
                <div className="absolute inset-1 border border-[#B38A24]/35" />
                <div className="absolute top-1 left-1 w-3.5 h-3.5 border-t-2 border-l-2 border-[#8C6218]" />
                <div className="absolute top-1 right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-[#8C6218]" />
                <div className="absolute bottom-1 left-1 w-3.5 h-3.5 border-b-2 border-l-2 border-[#8C6218]" />
                <div className="absolute bottom-1 right-1 w-3.5 h-3.5 border-b-2 border-r-2 border-[#8C6218]" />
              </div>

              {/* Scroll Proclamation Header */}
              <div className="relative space-y-1 pt-1 z-10">
                <span className="font-['Noto_Serif_Devanagari'] text-xs sm:text-sm font-bold text-[#7A1522] tracking-[0.24em] block">
                  ॥ श्री गणेशाय नमः ॥
                </span>
                <span className="font-['Marcellus'] text-[10px] sm:text-[11px] tracking-[0.28em] uppercase text-[#8C5A14] font-bold block">
                  ॥ शाही आमंत्रण पत्र • ROYAL FARMAN ॥
                </span>
              </div>

              {/* Scroll Proclamation Body */}
              <div className="relative space-y-2.5 my-auto max-w-[320px] px-2 z-10">
                {/* Monogram Roundel */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-[#B38A24] mx-auto flex items-center justify-center bg-[#FAF4E5] shadow-md">
                  <span className="font-['Marcellus'] text-lg sm:text-xl font-bold text-[#7A1522]">
                    अ & इ
                  </span>
                </div>

                <div className="space-y-0.5">
                  <span className="font-['Cormorant_Garamond'] text-xs sm:text-sm italic text-[#4A3828] block">
                    Under the grace of the Almighty & the eternal blessings of our elders,
                  </span>
                  <h2 className="font-['Marcellus'] text-lg sm:text-xl font-bold tracking-[0.16em] text-[#7A1522] uppercase">
                    ABHISHEK & ISHITA
                  </h2>
                  <span className="font-['Noto_Serif_Devanagari'] text-xs font-bold text-[#8C5A14] block">
                    ॥ अभिषेक संग इशिता ॥
                  </span>
                </div>

                <p className="font-['Cormorant_Garamond'] text-xs sm:text-[13px] italic text-[#2C1F15] leading-relaxed font-semibold">
                  "Two distinct souls, two families, and a sacred celebration by the serene waters of Lake Pichola."
                </p>

                <div className="py-1 px-3 bg-[#FAF3E3]/95 border-y border-[#D4AF37]/60 my-1 rounded-sm shadow-xs">
                  <p className="font-['Marcellus'] text-xs font-bold tracking-wider text-[#1A1008]">
                    28TH • 29TH • 30TH NOVEMBER 2026
                  </p>
                  <p className="font-['Marcellus'] text-[9.5px] uppercase tracking-widest text-[#7A1522] font-semibold mt-0.5">
                    THE OBEROI UDAIVILAS • UDAIPUR, RAJASTHAN
                  </p>
                </div>

                <p className="text-[11px] font-['Inter_Tight'] text-[#3D2F22] leading-relaxed font-medium">
                  We cordially invite you to explore our eight ceremonial volumes: our love story, the itinerary, attire palette, and kindly confirm your presence.
                </p>
              </div>

              {/* Bottom Golden Scroll Rod & Interactive Roll-Down Trigger */}
              <div className="relative w-full z-10 flex flex-col items-center pt-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRollDown();
                  }}
                  className="py-2 px-5 sm:px-6 rounded-full bg-gradient-to-r from-[#7A1522] via-[#8E1728] to-[#7A1522] text-[#FAF6ED] border-2 border-[#D4AF37] font-['Marcellus'] text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase shadow-[0_6px_22px_rgba(122,21,34,0.55)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>पुस्तकालय खोलें • ROLL DOWN TO ENTER</span>
                  <ArrowDown className="w-3.5 h-3.5 text-[#F5DE98] animate-bounce" />
                </button>
                <span className="text-[9.5px] font-['Marcellus'] text-[#8C6D2B] font-semibold mt-1.5 tracking-wider">
                  (Tap anywhere on scroll to roll down)
                </span>

                <div className="scroll-rod mt-2">
                  <div className="scroll-finial left" />
                  <div className="scroll-finial right" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* BOTTOM FOOTER */}
      <footer className="w-full pb-3 sm:pb-5 px-3 text-center z-20 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="inline-block px-3 sm:px-4 py-1 max-w-[94vw] rounded-full bg-[#1A0B0E]/90 border border-[#D4AF37]/60 shadow-md">
          <span className="font-['Marcellus'] text-[9px] sm:text-xs tracking-[0.14em] sm:tracking-[0.24em] uppercase text-[#F5DE98] font-semibold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] block truncate">
            ॥ 28th • 29th • 30th November 2026 • The Oberoi Udaivilas, Udaipur ॥
          </span>
        </div>
      </footer>
    </div>
  );
};

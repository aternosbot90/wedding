import React, { useState, useEffect } from 'react';
import { WaxSeal } from './WaxSeal';
import { GaneshaSymbol } from './GaneshaSymbol';
import { sound } from '../utils/audio';
import { Volume2, VolumeX, ArrowRight, ArrowDown, MapPin, Calendar, ExternalLink } from 'lucide-react';
import { HOST_DETAILS } from '../types/wedding';

interface RoyalIntroProps {
  onComplete: (openBookDirectly?: boolean) => void;
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
    const x = (clientX / innerWidth - 0.5) * 14;
    const y = (clientY / innerHeight - 0.5) * -14;
    setTilt({ x, y });
  };

  const handleOpenEnvelope = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault?.();
      e.stopPropagation?.();
    }
    if (isOpening) return;
    setIsOpening(true);

    // 1. Trigger the tactile wax fracture immediately
    setIsSealBroken(true);
    sound.playWaxCrack();

    // 2. Play celebration chime
    setTimeout(() => {
      sound.playCelebrationChime();
    }, 120);

    // 3. Start soothing ambient music if enabled
    if (soundEnabled && !sound.getMusicPlaying()) {
      sound.startMusic();
    }

    // 4. Trigger rose & marigold petal shower
    if (onTriggerPetals) {
      onTriggerPetals();
    }

    // 5. Generate golden sparkle burst
    const colors = ['#FFF6D1', '#FFDF73', '#D4AF37', '#FFFFFF', '#E5A93C'];
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

    // 6. Royal cloth scroll unfolds smoothly
    setTimeout(() => {
      setIsUnfolded(true);
      sound.playPageFlip();
    }, 350);
  };

  // Interactive Roll-Down action to directly enter the wedding book!
  const handleRollDown = () => {
    if (isRollingDown) return;
    setIsRollingDown(true);
    sound.playScrollRoll();
    sound.playCelebrationChime();

    setTimeout(() => {
      setIsDissolving(true);
    }, 450);

    setTimeout(() => {
      onComplete(true);
    }, 650);
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
          radial-gradient(circle at 50% 45%, rgba(122, 21, 34, 0.55) 0%, rgba(18, 4, 7, 0.98) 78%),
          radial-gradient(circle at 15% 85%, rgba(212, 175, 55, 0.15) 0%, transparent 50%),
          radial-gradient(circle at 85% 15%, rgba(212, 175, 55, 0.15) 0%, transparent 50%)
        `,
      }}
    >
      {/* Candle Flame Ambient Pulsation */}
      <div className="palace-ambient-glow" aria-hidden="true" />

      {/* Floating Stardust Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#D4AF37] animate-pulse"
            style={{
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              left: `${(i * 14.3) % 98}%`,
              top: `${(i * 18.1) % 96}%`,
              opacity: 0.3 + (i % 5) * 0.12,
              animationDuration: `${2.5 + (i % 4)}s`,
              animationDelay: `${(i * 0.3) % 3}s`,
              boxShadow: '0 0 8px rgba(212, 175, 55, 0.8)',
            }}
          />
        ))}
      </div>

      {/* TOP HEADER CONTROLS */}
      <header className="w-full pt-2.5 sm:pt-4 px-3 sm:px-8 flex justify-between items-center z-20">
        <div className="flex items-center text-[#D4AF37]">
          <span className="font-['Marcellus'] text-xs sm:text-sm tracking-[0.22em] uppercase text-[#F5DE98] font-bold drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
            ॥ शुभ विवाह आमंत्रण ॥
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
            className="p-1.5 sm:p-2 border border-[#D4AF37]/70 bg-[#2A0E13]/90 hover:bg-[#7A1522] text-[#F5DE98] rounded-full transition-all cursor-pointer shadow-md backdrop-blur-sm"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => onComplete(true)}
            className="py-1.5 px-3.5 border border-[#D4AF37]/70 bg-[#2A0E13]/90 hover:bg-[#7A1522] text-[#FAF6ED] rounded-full text-xs font-['Marcellus'] tracking-wider uppercase font-semibold transition-all cursor-pointer shadow-md flex items-center gap-1.5 backdrop-blur-sm group"
          >
            <span>Open Book</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </header>

      {/* CENTERPIECE: 3D ROYAL VELVET FARMAN ENVELOPE */}
      <main className="relative flex-1 w-full flex items-center justify-center p-2 sm:p-4 z-10">
        <div
          className="relative transition-transform duration-300 ease-out"
          style={{
            perspective: '1200px',
            transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
          }}
        >
          {/* Radiant Glow */}
          <div className="absolute inset-0 bg-[#D4AF37]/25 rounded-2xl blur-3xl transform scale-95 pointer-events-none" />

          {/* THE ROYAL VELVET ENVELOPE BOX */}
          <div
            className={`relative rounded-xl border-2 border-[#D4AF37] shadow-[0_25px_80px_rgba(0,0,0,0.95)] bg-cover bg-center overflow-hidden transition-all duration-700 ${
              isMobile
                ? 'w-[94vw] max-w-[390px] h-[520px] max-h-[78svh]'
                : 'w-[450px] sm:w-[490px] h-[590px]'
            }`}
            style={{
              backgroundColor: '#4A0812',
              backgroundImage: `url('/assets/textures/cover_patrika.jpg')`,
            }}
          >
            {/* Dark Velvet Vignette */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `
                  radial-gradient(ellipse at 50% 45%, rgba(20, 3, 7, 0.96) 0%, rgba(32, 6, 12, 0.94) 55%, rgba(18, 3, 6, 0.98) 100%)
                `,
              }}
            />

            {/* Gold Filigree Outer Frame */}
            <div className="absolute inset-2 sm:inset-3 border border-[#D4AF37]/80 rounded pointer-events-none">
              <div className="absolute top-1 left-1 w-3.5 h-3.5 border-t-2 border-l-2 border-[#FFE29E]" />
              <div className="absolute top-1 right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-[#FFE29E]" />
              <div className="absolute bottom-1 left-1 w-3.5 h-3.5 border-b-2 border-l-2 border-[#FFE29E]" />
              <div className="absolute bottom-1 right-1 w-3.5 h-3.5 border-b-2 border-r-2 border-[#FFE29E]" />
            </div>

            {/* ENVELOPE CONTENT (FRONT COVER) */}
            <div
              className={`relative h-full flex flex-col justify-between items-center text-center p-3 sm:p-5 z-10 transition-opacity duration-300 ${
                isUnfolded ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              {/* Auspicious Proclamation & Host Line */}
              <div className="space-y-0.5 pt-0.5 flex flex-col items-center drop-shadow">
                <span className="font-['Noto_Serif_Devanagari'] text-xs sm:text-sm font-bold text-[#FFF3D4] tracking-[0.24em] block">
                  ॥ श्री गणेशाय नमः ॥
                </span>
                <span className="font-['Marcellus'] text-[9px] sm:text-[10px] tracking-[0.26em] text-[#F5DE98] uppercase block font-semibold">
                  INVITATION FROM SHRI VEDPRAKASH
                </span>
              </div>

              {/* CENTRAL MEHRAB ARCH CONTRAST PLATE */}
              <div
                className="my-auto w-full max-w-[340px] sm:max-w-[380px] py-2.5 px-3 sm:px-5 rounded-t-[130px] rounded-b-xl border-2 border-[#D4AF37]/90 shadow-[0_16px_40px_rgba(0,0,0,0.9),inset_0_0_24px_rgba(0,0,0,0.75)] backdrop-blur-md relative"
                style={{
                  background: 'radial-gradient(ellipse at 50% 35%, rgba(68, 12, 22, 0.98) 0%, rgba(24, 4, 9, 0.99) 85%)',
                }}
              >
                {/* Inner Delicate Gold Hairline Border */}
                <div className="absolute inset-1.5 rounded-t-[122px] rounded-b-lg border border-[#F5DE98]/40 pointer-events-none" />

                {/* Auspicious Lord Ganesha Medallion */}
                <div className="relative mb-2">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#D4AF37] mx-auto flex items-center justify-center bg-[#FAF4E5] shadow-[0_0_24px_rgba(212,175,55,0.7)] p-1">
                    <GaneshaSymbol size={isMobile ? 42 : 50} className="drop-shadow-sm" />
                  </div>
                </div>

                {/* Wedding Celebrations Heading */}
                <div className="space-y-0.5">
                  <span className="text-[9px] sm:text-[10px] font-['Marcellus'] tracking-[0.28em] uppercase text-[#FFE3A4] font-semibold block">
                    The Wedding Celebrations of
                  </span>

                  {/* High-Contrast Bride & Groom Names */}
                  <h1 className="font-['Marcellus'] tracking-[0.16em] my-0.5">
                    <span
                      className="block text-xl sm:text-2xl font-bold text-[#FFF2CC] tracking-[0.18em]"
                      style={{
                        textShadow: '0 2px 8px rgba(0,0,0,0.95), 0 0 16px rgba(212,175,55,0.45)',
                      }}
                    >
                      ABHISHEK
                    </span>
                    <span
                      className="block font-['Alex_Brush'] text-xl sm:text-2xl font-normal text-[#FFF8ED] lowercase -my-1"
                      style={{
                        textShadow: '0 2px 6px rgba(0,0,0,0.9)',
                      }}
                    >
                      weds
                    </span>
                    <span
                      className="block text-xl sm:text-2xl font-bold text-[#FFF2CC] tracking-[0.18em]"
                      style={{
                        textShadow: '0 2px 8px rgba(0,0,0,0.95), 0 0 16px rgba(212,175,55,0.45)',
                      }}
                    >
                      ISHITA
                    </span>
                  </h1>

                  {/* Auspicious Hindi Subheading */}
                  <span className="font-['Noto_Serif_Devanagari'] text-xs sm:text-sm font-bold text-[#FFE8B6] tracking-widest block pt-0.5">
                    ॥ अभिषेक संग इशिता ॥
                  </span>
                </div>

                {/* Gold Divider */}
                <div className="w-20 sm:w-24 h-[1.5px] bg-gradient-to-r from-transparent via-[#F5DE98] to-transparent mx-auto my-1.5" />

                {/* Clear Events & Venue Summary */}
                <div className="space-y-1 font-['Marcellus']">
                  <p className="tracking-[0.18em] uppercase font-bold text-[10.5px] sm:text-[11.5px] text-[#FFF4D4]">
                    5TH & 12TH DECEMBER 2026 • DELHI
                  </p>
                  <p className="tracking-[0.12em] text-[8.5px] sm:text-[9.5px] text-[#F5DE98] font-medium leading-snug">
                    Ring Ceremony: Mannat Vatika Farm (5 Dec)<br />
                    Barat & Vivah: Green Lounge Banquet (12 Dec)
                  </p>
                </div>
              </div>

              {/* SILK RIBBON & WAX SEAL INTERACTION ZONE */}
              <div className="relative w-full flex flex-col items-center justify-center my-1">
                {/* Horizontal Crimson Silk Ribbon BEHIND the seal */}
                <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-7 flex overflow-hidden pointer-events-none z-0">
                  <div
                    className="w-1/2 h-full bg-gradient-to-r from-[#4A0812] via-[#8E1728] to-[#A31D30] border-y border-[#D4AF37]/80 shadow transition-transform duration-700 ease-in-out"
                    style={{
                      transform: isSealBroken ? 'translateX(-120%)' : 'translateX(0)',
                    }}
                  />
                  <div
                    className="w-1/2 h-full bg-gradient-to-l from-[#4A0812] via-[#8E1728] to-[#A31D30] border-y border-[#D4AF37]/80 shadow transition-transform duration-700 ease-in-out"
                    style={{
                      transform: isSealBroken ? 'translateX(120%)' : 'translateX(0)',
                    }}
                  />
                </div>

                {/* Break Seal Button Badge */}
                <div className="relative z-20 mb-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenEnvelope(e);
                    }}
                    disabled={isOpening}
                    className={`inline-flex items-center py-1 px-3.5 rounded-full border border-[#D4AF37] text-[10.5px] font-['Marcellus'] font-bold tracking-widest uppercase shadow-[0_4px_16px_rgba(0,0,0,0.85)] backdrop-blur-md cursor-pointer transition-all duration-300 ${
                      isSealBroken
                        ? 'bg-[#4A0A12] text-[#F5DE98] scale-95 opacity-80'
                        : 'bg-[#1F070B]/95 text-[#FFF2CC] hover:bg-[#7A1522] hover:scale-105 active:scale-95 animate-bounce'
                    }`}
                  >
                    <span>{isSealBroken ? 'Seal Broken' : 'Break Seal to Open'}</span>
                  </button>
                </div>

                {/* THE 3D WAX SEAL (Centered proudly on top of ribbon) */}
                <div className="relative z-10 flex items-center justify-center">
                  {!isSealBroken && (
                    <>
                      <div className="absolute w-22 h-22 sm:w-24 sm:h-24 rounded-full border border-[#D4AF37]/50 animate-ping pointer-events-none" />
                      <div className="absolute w-24 h-24 sm:w-26 sm:h-26 rounded-full border border-[#D4AF37]/30 animate-pulse pointer-events-none" />
                    </>
                  )}

                  <WaxSeal
                    size={isMobile ? 70 : 80}
                    monogram="अ & इ"
                    color="#8E1728"
                    isBroken={isSealBroken}
                    onClick={() => handleOpenEnvelope()}
                    className="transform hover:scale-105 active:scale-95 transition-transform"
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
                          transition: 'all 0.85s cubic-bezier(0.12, 0.85, 0.25, 1)',
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Family Residence Address Line */}
              <div className="pt-0.5 text-[10px] sm:text-xs font-['Marcellus'] text-[#F5DE98] font-medium leading-tight drop-shadow">
                <span>निवास: 44/24, गली नं ३, भीम कॉलोनी, बख्तावरपुर, दिल्ली - 110036</span>
              </div>
            </div>

            {/* ========================================================
                UNFOLDED ROYAL CLOTH PAPER SCROLL (FARMAN)
                Shows full details and opens book on tap or button click
               ======================================================== */}
            <div
              onClick={handleRollDown}
              className={`cloth-paper-scroll absolute inset-0 z-40 p-3 sm:p-5 flex flex-col justify-between items-center text-center cursor-pointer transition-all duration-700 shadow-2xl overflow-y-auto no-scrollbar ${
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
              <div className="absolute inset-2.5 border border-[#B38A24]/70 pointer-events-none rounded">
                <div className="absolute inset-1 border border-[#B38A24]/35" />
                <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-[#8C6218]" />
                <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-[#8C6218]" />
                <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-[#8C6218]" />
                <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-[#8C6218]" />
              </div>

              {/* Scroll Proclamation Header */}
              <div className="relative space-y-0.5 pt-0.5 z-10 flex flex-col items-center">
                <span className="font-['Noto_Serif_Devanagari'] text-xs sm:text-sm font-bold text-[#7A1522] tracking-[0.24em] block">
                  ॥ श्री गणेशाय नमः ॥
                </span>
                <span className="font-['Marcellus'] text-[9.5px] sm:text-[10.5px] tracking-[0.26em] uppercase text-[#8C5A14] font-bold block">
                  ॥ वैवाहिक आमंत्रण पत्र • ROYAL INVITATION ॥
                </span>
              </div>

              {/* Scroll Proclamation Body */}
              <div className="relative space-y-2 my-auto max-w-[340px] px-1 z-10">
                {/* Auspicious Lord Ganesha Roundel */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-[#B38A24] mx-auto flex items-center justify-center bg-[#FAF4E5] shadow-md p-1">
                  <GaneshaSymbol size={isMobile ? 36 : 42} className="drop-shadow-sm" />
                </div>

                <div className="space-y-0.5">
                  <span className="font-['Cormorant_Garamond'] text-xs sm:text-[13px] italic text-[#4A3828] block">
                    परमपिता परमात्मा की असीम अनुकम्पा एवं पूज्य बुजुर्गों के आशीर्वाद से,
                  </span>
                  <span className="font-['Marcellus'] text-xs sm:text-sm font-bold text-[#7A1522] block uppercase tracking-wider">
                    श्री वेदप्रकाश एवं समस्त परिवार
                  </span>
                  <span className="text-[11px] font-['Cormorant_Garamond'] text-[#4A3828] italic block">
                    आपको अपने सुपुत्र के शुभ विवाह महोत्सव में सादर आमंत्रित करते हैं:
                  </span>
                  <h2 className="font-['Marcellus'] text-base sm:text-lg font-bold tracking-[0.16em] text-[#7A1522] uppercase mt-0.5">
                    ABHISHEK & ISHITA
                  </h2>
                  <span className="font-['Noto_Serif_Devanagari'] text-xs font-bold text-[#8C5A14] block">
                    ॥ अभिषेक संग इशिता ॥
                  </span>
                </div>

                {/* THE TWO EVENTS CARDS (IN ENGLISH WITH MAP HYPERLINKS) */}
                <div className="space-y-2 text-left text-xs font-['Inter_Tight']">
                  {/* Event 1: Ring Ceremony */}
                  <div className="p-2.5 bg-[#FAF3E3]/95 border-l-3 border-[#A36006] rounded shadow-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#A36006] font-['Marcellus'] text-xs uppercase tracking-wide">
                        1. Ring Ceremony & Preeti Bhoj (Lunch)
                      </span>
                      <span className="text-[10px] font-bold text-[#1A1008] bg-white/80 px-1.5 py-0.5 rounded border border-[#A36006]/30">
                        5th Dec 2026
                      </span>
                    </div>
                    <p className="text-[11px] text-[#2C1F15] mt-0.5 font-medium">
                      • Ring Ceremony: <strong>11:00 AM</strong> &nbsp;|&nbsp; Lunch: <strong>01:00 PM</strong>
                    </p>
                    <div className="pt-0.5">
                      <a
                        href="https://maps.app.goo.gl/mrv1ZjPQXxpvmBDL6"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#7A1522] hover:text-[#9E2032] hover:underline bg-white/80 px-2 py-0.5 rounded border border-[#D4AF37]/60"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#A36006] shrink-0" />
                        <span>Venue: Mannat Vatika Farm, Delhi</span>
                        <ExternalLink className="w-3 h-3 text-[#A36006] shrink-0" />
                      </a>
                    </div>
                  </div>

                  {/* Event 2: Barat & Vivah */}
                  <div className="p-2.5 bg-[#FAF3E3]/95 border-l-3 border-[#7A1522] rounded shadow-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#7A1522] font-['Marcellus'] text-xs uppercase tracking-wide">
                        2. Barat Departure & Wedding (Shubh Vivah)
                      </span>
                      <span className="text-[10px] font-bold text-[#1A1008] bg-white/80 px-1.5 py-0.5 rounded border border-[#7A1522]/30">
                        12th Dec 2026
                      </span>
                    </div>
                    <p className="text-[11px] text-[#2C1F15] mt-0.5 font-medium">
                      • Sehra Bandi: <strong>10:00 AM</strong> &nbsp;|&nbsp; Departure of Barat: <strong>11:00 AM</strong>
                    </p>
                    <div className="pt-0.5">
                      <a
                        href="https://maps.app.goo.gl/rCGKCJWhjcMhXcaC8"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#7A1522] hover:text-[#9E2032] hover:underline bg-white/80 px-2 py-0.5 rounded border border-[#D4AF37]/60"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#7A1522] shrink-0" />
                        <span>Venue: Green Lounge North Banquet, Delhi</span>
                        <ExternalLink className="w-3 h-3 text-[#7A1522] shrink-0" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Residence Box */}
                <div className="py-1.5 px-3 bg-white/85 border border-[#D4AF37]/60 rounded text-[10.5px] text-[#2C1F15] font-['Inter_Tight'] flex items-center justify-between">
                  <div>
                    <strong className="text-[#7A1522] font-['Marcellus']">Family Residence:</strong> 44/24, Gali No. 3, Bheem Colony, Bakhtawarpur, Delhi - 110036
                  </div>
                </div>
              </div>

              {/* Bottom Golden Scroll Rod & Interactive Roll-Down Trigger */}
              <div className="relative w-full z-10 flex flex-col items-center pt-0.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRollDown();
                  }}
                  className="py-2 px-5 sm:px-6 rounded-full bg-gradient-to-r from-[#7A1522] via-[#8E1728] to-[#7A1522] text-[#FAF6ED] border-2 border-[#D4AF37] font-['Marcellus'] text-[11px] sm:text-xs font-bold tracking-[0.18em] uppercase shadow-[0_6px_22px_rgba(122,21,34,0.55)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>पत्रिका खोलें • OPEN INVITATION BOOK</span>
                  <ArrowDown className="w-3.5 h-3.5 text-[#F5DE98] animate-bounce" />
                </button>
                <span className="text-[9px] font-['Marcellus'] text-[#8C6D2B] font-semibold mt-1 tracking-wider">
                  (Tap anywhere on scroll to enter book)
                </span>

                <div className="scroll-rod mt-1.5">
                  <div className="scroll-finial left" />
                  <div className="scroll-finial right" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* BOTTOM FOOTER */}
      <footer className="w-full pb-2.5 sm:pb-3.5 px-3 text-center z-20 pb-[max(0.6rem,env(safe-area-inset-bottom))]">
        <div className="inline-block px-3 sm:px-4 py-0.5 max-w-[94vw] rounded-full bg-[#1A0B0E]/90 border border-[#D4AF37]/60 shadow-md">
          <span className="font-['Marcellus'] text-[9px] sm:text-xs tracking-[0.12em] sm:tracking-[0.2em] uppercase text-[#F5DE98] font-semibold block truncate">
            ॥ 5th & 12th December 2026 • Shri Vedprakash & Family • Bakhtawarpur, Delhi ॥
          </span>
        </div>
      </footer>
    </div>
  );
};

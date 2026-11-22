import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/audio';
import { WaxSeal } from './WaxSeal';
import { GaneshaSymbol } from './GaneshaSymbol';
import { IndianBookVolume, HOST_DETAILS } from '../types/wedding';
import {
  ChevronLeft,
  ChevronRight,
  Book,
  BookOpen,
  MapPin,
  Clock,
  Heart,
  ExternalLink,
  RotateCcw,
  Volume2,
  VolumeX,
  Calendar,
  Sparkles,
  Phone,
} from 'lucide-react';

interface OpenBookProps {
  initialSpread?: number;
  activeVolume?: IndianBookVolume;
  onCloseToShelf?: () => void;
  onTriggerPetals?: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const INDIAN_CHAPTERS = [
  { id: 'cover', title: 'Cover', spread: -1, page: 1, subtitle: 'Front Cover' },
  { id: 0, title: 'Patrika', spread: 0, page: 2, subtitle: 'The Invitation' },
  { id: 1, title: 'Ceremonies', spread: 1, page: 4, subtitle: '5 & 12 Dec Events' },
  { id: 2, title: 'Venues & Countdown', spread: 2, page: 6, subtitle: 'Venues & 5 Dec Countdown' },
];

const CountdownBlock: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Countdown specifically for 5th December 2026 (Ring Ceremony) per user request
    const targetDate = new Date('2026-12-05T11:00:00+05:30').getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-white/90 backdrop-blur-[2px] border border-[#D4AF37]/80 p-2.5 sm:p-3 rounded-lg shadow-md">
      <span className="text-xs sm:text-sm uppercase tracking-[0.2em] font-bold text-[#7A1522] font-['Marcellus'] block mb-1">
        Countdown to 5th December 2026 (Ring Ceremony)
      </span>
      <div className="grid grid-cols-4 gap-1.5 select-none pointer-events-none">
        <div className="bg-[#FAF6ED] p-2 rounded border border-[#D8CBB7] shadow-inner text-center">
          <span className="font-['Marcellus'] text-xl sm:text-2xl font-bold text-[#1A1008] block">{timeLeft.days}</span>
          <span className="text-[10px] sm:text-xs uppercase font-['Inter_Tight'] text-[#7A5826] font-bold">Days</span>
        </div>
        <div className="bg-[#FAF6ED] p-2 rounded border border-[#D8CBB7] shadow-inner text-center">
          <span className="font-['Marcellus'] text-xl sm:text-2xl font-bold text-[#1A1008] block">{timeLeft.hours}</span>
          <span className="text-[10px] sm:text-xs uppercase font-['Inter_Tight'] text-[#7A5826] font-bold">Hours</span>
        </div>
        <div className="bg-[#FAF6ED] p-2 rounded border border-[#D8CBB7] shadow-inner text-center">
          <span className="font-['Marcellus'] text-xl sm:text-2xl font-bold text-[#1A1008] block">{timeLeft.minutes}</span>
          <span className="text-[10px] sm:text-xs uppercase font-['Inter_Tight'] text-[#7A5826] font-bold">Mins</span>
        </div>
        <div className="bg-[#FAF6ED] p-2 rounded border border-[#D4AF37]/80 shadow-inner text-center">
          <span className="font-['Marcellus'] text-xl sm:text-2xl font-bold text-[#7A1522] block animate-pulse">{timeLeft.seconds}</span>
          <span className="text-[10px] sm:text-xs uppercase font-['Inter_Tight'] text-[#7A1522] font-bold">Secs</span>
        </div>
      </div>
    </div>
  );
};

interface FlipbookDOMProps {
  isMobile: boolean;
  activeVolume?: IndianBookVolume;
  flipbookRef: React.RefObject<HTMLDivElement | null>;
  renderPage: (pageNum: number) => React.ReactNode;
  onCloseToShelf: () => void;
  onOpenBook: () => void;
  onGoToFrontCover: () => void;
}

const FlipbookDOM = React.memo<FlipbookDOMProps>(
  ({ isMobile, activeVolume, flipbookRef, renderPage, onCloseToShelf, onOpenBook, onGoToFrontCover }) => {
    return (
      <div
        key={isMobile ? 'turn-mobile' : 'turn-desktop'}
        ref={flipbookRef}
        className="flipbook shadow-2xl"
      >
        {/* PAGE 1: HARD FRONT COVER */}
        <div
          className="hard royal-turn-hard-cover royal-turn-cover-front select-none relative overflow-hidden"
          style={{
            backgroundColor: '#38060D',
            backgroundImage: `radial-gradient(ellipse at 50% 50%, rgba(20, 3, 7, 0.90) 0%, rgba(38, 6, 12, 0.82) 48%, rgba(14, 2, 5, 0.96) 100%), url('${activeVolume?.coverTexture || '/assets/textures/cover_patrika.jpg'}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-2.5 sm:inset-3 border-2 border-[#D4AF37] pointer-events-none rounded">
            <div className="absolute inset-1 border border-[#D4AF37]/50" />
            <div className="absolute top-1 left-1 w-3.5 sm:w-4 h-3.5 sm:h-4 border-t-2 border-l-2 border-[#FFE8B6]" />
            <div className="absolute top-1 right-1 w-3.5 sm:w-4 h-3.5 sm:h-4 border-t-2 border-r-2 border-[#FFE8B6]" />
            <div className="absolute bottom-1 left-1 w-3.5 sm:w-4 h-3.5 sm:h-4 border-b-2 border-l-2 border-[#FFE8B6]" />
            <div className="absolute bottom-1 right-1 w-3.5 sm:w-4 h-3.5 sm:h-4 border-b-2 border-r-2 border-[#FFE8B6]" />
          </div>

          <div className="relative h-full flex flex-col justify-between items-center text-center p-3 sm:p-5 z-10">
            {/* Top Auspicious Proclamation Badge */}
            <div className="pt-1 sm:pt-2 flex flex-col items-center">
              <div className="px-4 py-1.5 rounded-full bg-[#180307]/92 border border-[#D4AF37] shadow-[0_4px_16px_rgba(0,0,0,0.9)] backdrop-blur-md flex flex-col items-center space-y-0.5">
                <span
                  className="font-['Noto_Serif_Devanagari'] text-sm sm:text-base font-bold text-[#FFEAA7] tracking-[0.25em] block"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.95)' }}
                >
                  ॥ श्री गणेशाय नमः ॥
                </span>
                <span
                  className="font-['Marcellus'] text-xs sm:text-sm tracking-[0.25em] uppercase text-[#F5DE98] font-bold block"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
                >
                  INVITATION FROM SHRI VEDPRAKASH
                </span>
              </div>
            </div>

            {/* Central Royal Mehrab Arch Contrast Plate */}
            <div
              className="my-auto w-full max-w-[320px] sm:max-w-[360px] py-3.5 px-3 sm:px-5 rounded-t-[120px] rounded-b-2xl border-2 border-[#D4AF37] shadow-[0_16px_40px_rgba(0,0,0,0.95),inset_0_0_24px_rgba(0,0,0,0.7)] backdrop-blur-md relative mx-auto"
              style={{
                background: 'radial-gradient(ellipse at 50% 35%, rgba(65, 12, 20, 0.97) 0%, rgba(20, 3, 7, 0.98) 85%)',
              }}
            >
              {/* Inner Delicate Gold Hairline Frame */}
              <div className="absolute inset-1.5 rounded-t-[112px] rounded-b-xl border border-[#F5DE98]/40 pointer-events-none" />

              {/* Central Golden Ganesha Medallion */}
              <div className="relative mb-2">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#D4AF37] mx-auto flex items-center justify-center bg-gradient-to-b from-[#FFFDF7] to-[#F5ECD5] shadow-[0_0_24px_rgba(212,175,55,0.75)] p-1">
                  <GaneshaSymbol size={isMobile ? 44 : 52} className="drop-shadow-sm" />
                </div>
              </div>

              {/* Wedding Header & Names */}
              <div className="space-y-1 text-center">
                <span
                  className="font-['Marcellus'] text-xs sm:text-sm text-[#FFE8B6] tracking-[0.28em] uppercase block font-semibold"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}
                >
                  Shubh Vivah Patrika
                </span>

                <h1 className="font-['Marcellus'] text-2xl sm:text-3xl font-bold tracking-[0.18em] my-1">
                  <span
                    className="block text-[#FFF6E0]"
                    style={{
                      textShadow: '0 2px 8px rgba(0,0,0,0.95), 0 0 16px rgba(212,175,55,0.5)',
                    }}
                  >
                    ABHISHEK & ISHITA
                  </span>
                </h1>

                <span
                  className="font-['Noto_Serif_Devanagari'] text-sm sm:text-base font-bold text-[#F5DE98] block"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}
                >
                  ॥ अभिषेक संग इशिता ॥
                </span>
              </div>

              {/* Gold Divider Line */}
              <div className="w-20 sm:w-24 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto my-2" />

              {/* Ceremony Dates & Address */}
              <div className="space-y-0.5 text-center">
                <p
                  className="font-['Marcellus'] text-xs sm:text-sm font-bold tracking-[0.16em] uppercase text-[#FFF2CC]"
                  style={{ textShadow: '0 2px 6px rgba(0,0,0,0.95)' }}
                >
                  5TH & 12TH DECEMBER 2026 • DELHI
                </p>
                <p
                  className="text-[11px] sm:text-xs text-[#FFE8B6] font-['Marcellus'] tracking-wider"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}
                >
                  Bakhtawarpur, Delhi - 110036
                </p>
              </div>

              {/* Action Button: Open Book */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenBook();
                  }}
                  className="py-1.5 px-4 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#FFF0B8] to-[#D4AF37] text-[#4A0A12] font-['Marcellus'] text-xs sm:text-sm font-bold tracking-widest uppercase shadow-[0_4px_16px_rgba(0,0,0,0.7)] hover:scale-105 active:scale-95 transition-transform cursor-pointer flex items-center gap-1.5 mx-auto border border-[#FFEAA7]"
                >
                  <BookOpen className="w-4 h-4 text-[#7A1522]" />
                  <span>पत्रिका खोलें • Open Book</span>
                </button>
              </div>
            </div>

            {/* Bottom Section: Host Badge + Swipe to left with arrow indicator */}
            <div className="pb-1 w-full space-y-1.5 flex flex-col items-center">
              <div className="px-3.5 py-1 rounded-full bg-[#180307]/92 border border-[#D4AF37]/70 shadow-[0_2px_10px_rgba(0,0,0,0.85)] backdrop-blur-md">
                <span
                  className="text-[10px] sm:text-xs font-['Marcellus'] text-[#F5DE98] tracking-widest font-bold block"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
                >
                  SHRI VEDPRAKASH & FAMILY • 44/24 BHEEM COLONY
                </span>
              </div>

              {/* Cover Page Navigation Prompt: Swipe to left with arrow */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenBook();
                }}
                className="cursor-pointer group flex items-center justify-center pt-0.5"
                title="Swipe to left to navigate"
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#180307]/95 border-2 border-[#D4AF37] shadow-[0_4px_16px_rgba(212,175,55,0.5)] backdrop-blur-md group-hover:bg-[#2A050B] group-active:scale-95 transition-all">
                  <span
                    className="font-['Marcellus'] text-xs sm:text-sm font-bold tracking-[0.14em] uppercase text-[#FFF2CC] block"
                    style={{ textShadow: '0 2px 4px rgba(0,0,0,0.95)' }}
                  >
                    Swipe to left to navigate
                  </span>
                  <span className="text-sm sm:text-base text-[#F5DE98] font-bold animate-bounce-x">
                    ←
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PAGES 2 to 7 (Inner Ceremony Spreads: 6 pages, 3 spreads) */}
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="turn-page-sheet">
            {renderPage(idx)}
          </div>
        ))}

        {/* PAGE 8: HARD BACK COVER */}
        <div
          className="hard royal-turn-hard-cover royal-turn-cover-back select-none relative overflow-hidden"
          style={{
            backgroundColor: '#38060D',
            backgroundImage: `radial-gradient(ellipse at 50% 50%, rgba(20, 3, 7, 0.90) 0%, rgba(38, 6, 12, 0.82) 48%, rgba(14, 2, 5, 0.96) 100%), url('${activeVolume?.coverTexture || '/assets/textures/cover_patrika.jpg'}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-2.5 sm:inset-3 border-2 border-[#D4AF37] pointer-events-none rounded">
            <div className="absolute inset-1 border border-[#D4AF37]/50" />
            <div className="absolute top-1 left-1 w-3.5 sm:w-4 h-3.5 sm:h-4 border-t-2 border-l-2 border-[#FFE8B6]" />
            <div className="absolute top-1 right-1 w-3.5 sm:w-4 h-3.5 sm:h-4 border-t-2 border-r-2 border-[#FFE8B6]" />
            <div className="absolute bottom-1 left-1 w-3.5 sm:w-4 h-3.5 sm:h-4 border-b-2 border-l-2 border-[#FFE8B6]" />
            <div className="absolute bottom-1 right-1 w-3.5 sm:w-4 h-3.5 sm:h-4 border-b-2 border-r-2 border-[#FFE8B6]" />
          </div>

          <div className="relative h-full flex flex-col justify-between items-center text-center p-3.5 sm:p-6 z-10">
            {/* Top Badge */}
            <div className="pt-2 sm:pt-3">
              <div className="px-4 py-1 rounded-full bg-[#180307]/92 border border-[#D4AF37] shadow-md backdrop-blur-md">
                <span
                  className="font-['Noto_Serif_Devanagari'] text-xs font-bold text-[#FFEAA7] tracking-[0.25em] block"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.95)' }}
                >
                  ॥ शुभम भवतु ॥
                </span>
              </div>
            </div>

            {/* Center Back Cover Contrast Card */}
            <div
              className="my-auto space-y-2.5 max-w-[320px] p-4 rounded-xl border-2 border-[#D4AF37] shadow-[0_12px_36px_rgba(0,0,0,0.95)] backdrop-blur-md"
              style={{
                background: 'radial-gradient(ellipse at 50% 35%, rgba(65, 12, 20, 0.96) 0%, rgba(20, 3, 7, 0.98) 85%)',
              }}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[#D4AF37] mx-auto flex items-center justify-center bg-white/10 backdrop-blur-sm shadow-md">
                <span className="text-xl text-[#FFEAA7]">⚜</span>
              </div>

              <p
                className="font-['Cormorant_Garamond'] text-sm sm:text-base italic text-[#FFF6E0] leading-relaxed"
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
              >
                "May the bond of marriage bring endless joy, prosperity, and eternal companionship."
              </p>

              <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />

              <p
                className="font-['Marcellus'] text-sm sm:text-base font-bold text-[#FFEAA7] tracking-wider uppercase"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}
              >
                Abhishek & Ishita
              </p>
              <span
                className="text-xs sm:text-sm text-[#E5C158] font-['Marcellus'] tracking-widest block font-bold"
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
              >
                Shri Vedprakash & Family • Bakhtawarpur, Delhi
              </span>

              {/* R.S.V.P. & Contact Numbers */}
              <div className="pt-2 border-t border-[#D4AF37]/40 space-y-1">
                <span className="text-xs font-['Marcellus'] text-[#F5DE98] font-bold tracking-[0.22em] uppercase block">
                  R.S.V.P. & Contact Numbers
                </span>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs sm:text-sm font-['Inter_Tight'] text-[#FFF2CC] font-semibold">
                  <a href="tel:9971006431" className="hover:text-[#FFEAA7] hover:underline transition-colors flex items-center justify-center gap-1 py-0.5">
                    <span>9971006431</span>
                  </a>
                  <a href="tel:9212029424" className="hover:text-[#FFEAA7] hover:underline transition-colors flex items-center justify-center gap-1 py-0.5">
                    <span>9212029424</span>
                  </a>
                  <a href="tel:9873185576" className="hover:text-[#FFEAA7] hover:underline transition-colors flex items-center justify-center gap-1 py-0.5">
                    <span>9873185576</span>
                  </a>
                  <a href="tel:9560364705" className="hover:text-[#FFEAA7] hover:underline transition-colors flex items-center justify-center gap-1 py-0.5">
                    <span>9560364705</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pb-2.5 flex justify-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onGoToFrontCover();
                }}
                className="py-2 px-4 rounded-full bg-[#7A1522] border-2 border-[#D4AF37] text-xs sm:text-sm font-['Marcellus'] font-bold text-[#FFEAA7] tracking-wider uppercase hover:bg-[#94192B] transition-colors cursor-pointer flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95"
              >
                <RotateCcw className="w-4 h-4 text-[#F5DE98]" />
                <span>Front Cover • मुख्य पृष्ठ</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },
  // Custom equality comparison: NEVER re-render flipbook when pages turn!
  (prev, next) =>
    prev.activeVolume?.id === next.activeVolume?.id &&
    prev.isMobile === next.isMobile
);

export const OpenBook: React.FC<OpenBookProps> = ({
  initialSpread = -1,
  activeVolume,
  onCloseToShelf,
  onTriggerPetals,
  soundEnabled,
  onToggleSound,
}) => {
  const [currentSpread, setCurrentSpread] = useState(initialSpread);
  const [currentPage, setCurrentPage] = useState(initialSpread === -1 ? 1 : (initialSpread * 2) + 2);
  const flipbookRef = useRef<HTMLDivElement>(null);

  // Dynamic responsive book size calculation
  const calcDimensions = () => {
    const isMob = typeof window !== 'undefined' && window.innerWidth < 768;
    if (isMob) {
      const w = Math.min(window.innerWidth - 20, 430);
      const h = Math.min(window.innerHeight - 120, 640);
      return { width: w, height: h };
    }
    const availH = Math.min(window.innerHeight - 110, 650);
    const availW = Math.min(window.innerWidth - 60, 960);
    const targetW = Math.min(availW, Math.round(availH * 1.52));
    const targetH = Math.min(availH, Math.round(targetW / 1.52));
    return { width: targetW, height: targetH };
  };

  const [bookDimensions, setBookDimensions] = useState(calcDimensions);

  // Mobile viewport state
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [mobileSide, setMobileSide] = useState<'left' | 'right'>('left');

  // Outer Book Container Ref for Universal Swipe Capture across all pages
  const bookContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const isMob = window.innerWidth < 768;
      setIsMobile(isMob);
      setBookDimensions(calcDimensions());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize Turn.js Flipbook Engine with silky smooth sliding animations
  useEffect(() => {
    const $ = (window as any).$ || (window as any).jQuery;
    if (!$ || !flipbookRef.current) return;

    const $book = $(flipbookRef.current);
    const isMob = window.innerWidth < 768;
    const dims = calcDimensions();
    setBookDimensions(dims);
    const startPage = initialSpread === -1 ? 1 : Math.min(Math.max((initialSpread * 2) + 2, 1), 8);

    try {
      $book.turn({
        width: dims.width,
        height: dims.height,
        autoCenter: true,
        display: isMob ? 'single' : 'double',
        acceleration: true,
        gradients: true,
        elevation: isMob ? 30 : 45,
        duration: isMob ? 500 : 600, // Responsive, silky smooth page slide animation
        cornerSize: isMob ? 90 : 80,
        page: startPage,
        when: {
          turning: () => {
            // Sound effect removed per user request
          },
          turned: (_e: any, page: number, _view: any) => {
            setCurrentPage(page);
            if (page === 1) {
              setCurrentSpread(-1);
              setMobileSide('left');
            } else if (page >= 2 && page <= 7) {
              const spread = Math.floor((page - 2) / 2);
              setCurrentSpread(spread);
              setMobileSide(page % 2 === 1 ? 'right' : 'left');
            } else if (page >= 8) {
              setCurrentSpread(2);
              setMobileSide('right');
            }
          },
        },
      });
    } catch (e) {
      console.warn('Turn.js initialization error:', e);
    }

    const handleWindowResize = () => {
      const isMob = window.innerWidth < 768;
      setIsMobile(isMob);
      const newDims = calcDimensions();
      setBookDimensions(newDims);
      try {
        $book.turn('size', newDims.width, newDims.height);
      } catch (err) {}
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
      try {
        const b = $book.data();
        if (b && b.eventHandlers) {
          $(document).unbind('mousemove', b.eventHandlers.touchMove);
          $(document).unbind('mouseup', b.eventHandlers.touchEnd);
          $(document).unbind('touchmove', b.eventHandlers.touchMove);
          $(document).unbind('touchend', b.eventHandlers.touchEnd);
        }
      } catch (err) {}
    };
  }, [isMobile]);

  const handleNext = () => {
    const $ = (window as any).$ || (window as any).jQuery;
    if ($ && flipbookRef.current) {
      try {
        const $b = $(flipbookRef.current);
        if ($b.turn('animating')) return;
        if (currentPage >= 8) return;
        $b.turn('next');
      } catch (e) {
        console.warn('Turn next error:', e);
      }
    }
  };

  const handlePrev = () => {
    const $ = (window as any).$ || (window as any).jQuery;
    if ($ && flipbookRef.current) {
      try {
        const $b = $(flipbookRef.current);
        if ($b.turn('animating')) return;
        if (currentPage <= 1) return;
        $b.turn('previous');
      } catch (e) {
        console.warn('Turn prev error:', e);
      }
    }
  };

  const handleNextRef = useRef(handleNext);
  handleNextRef.current = handleNext;
  const handlePrevRef = useRef(handlePrev);
  handlePrevRef.current = handlePrev;

  const goToPage = (targetPage: number) => {
    const $ = (window as any).$ || (window as any).jQuery;
    if ($ && flipbookRef.current) {
      try {
        $(flipbookRef.current).turn('page', targetPage);
      } catch (e) {
        console.warn('Turn page error:', e);
      }
    }
  };

  const jumpToSpread = (spread: number) => {
    if (spread === -1) {
      goToPage(1);
    } else {
      goToPage(spread * 2 + 2);
    }
  };

  // Robust Universal Touch & Drag Swipe Engine for ALL pages (Cover, Inner Pages, Back Cover)
  // Enables smooth finger swipe from anywhere on the screen, especially from the middle of the page
  useEffect(() => {
    const container = bookContainerRef.current;
    if (!container) return;

    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let startTime = 0;
    let isTracking = false;
    let isMouseDown = false;

    // 1. TOUCH EVENTS (Mobile Phones, Tablets, Emulation)
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const t = e.touches[0];
      startX = t.clientX;
      startY = t.clientY;
      currentX = t.clientX;
      currentY = t.clientY;
      startTime = Date.now();
      isTracking = true;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isTracking || e.touches.length !== 1) return;
      const t = e.touches[0];
      currentX = t.clientX;
      currentY = t.clientY;
      const diffX = currentX - startX;
      const diffY = currentY - startY;

      // Intercept horizontal finger swipe to prevent browser gesture cancellation (touchcancel)
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 8) {
        if (e.cancelable) {
          e.preventDefault();
        }
      }
    };

    const handleSwipeTrigger = () => {
      if (!isTracking) return;
      isTracking = false;

      const diffX = currentX - startX;
      const diffY = currentY - startY;
      const deltaTime = Date.now() - startTime;
      const distX = Math.abs(diffX);
      const distY = Math.abs(diffY);

      // Sensitive, comfortable swipe from anywhere on the page (middle, edges, text, cards):
      // Minimum 22px horizontal distance, predominantly horizontal (distX > distY * 0.45), within 1.2s
      if (distX >= 22 && distX > distY * 0.45 && deltaTime < 1200) {
        if (diffX < 0) {
          // Finger swiped LEFT -> Advance to Next Page
          handleNextRef.current();
        } else {
          // Finger swiped RIGHT -> Go back to Previous Page
          handlePrevRef.current();
        }
      }
    };

    const onTouchEnd = (_e: TouchEvent) => {
      handleSwipeTrigger();
    };

    const onTouchCancel = (_e: TouchEvent) => {
      handleSwipeTrigger();
    };

    // 2. MOUSE DRAG EVENTS (For desktop or trackpad swipe testing)
    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement;
      if (target.closest('a, button, input, textarea')) return;

      isMouseDown = true;
      startX = e.clientX;
      startY = e.clientY;
      currentX = e.clientX;
      currentY = e.clientY;
      startTime = Date.now();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return;
      currentX = e.clientX;
      currentY = e.clientY;
      const diffX = currentX - startX;
      const diffY = currentY - startY;
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 8) {
        e.preventDefault();
      }
    };

    const onMouseUp = () => {
      if (!isMouseDown) return;
      isMouseDown = false;
      const diffX = currentX - startX;
      const diffY = currentY - startY;
      const deltaTime = Date.now() - startTime;
      const distX = Math.abs(diffX);
      const distY = Math.abs(diffY);

      if (distX >= 28 && distX > distY * 0.45 && deltaTime < 1000) {
        if (diffX < 0) {
          handleNextRef.current();
        } else {
          handlePrevRef.current();
        }
      }
    };

    // Capture phase on touchstart intercepts the touch event at root book level,
    // so touches in the middle of any page or element are reliably caught.
    container.addEventListener('touchstart', onTouchStart, { passive: true, capture: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchCancel, { passive: true });

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      container.removeEventListener('touchstart', onTouchStart, { capture: true } as any);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchCancel);

      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrev();
      } else if (e.key === 'Escape') {
        goToPage(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Page Content Renderer (10 Inner Pages, Pages 2 to 11 in Flipbook)
  const renderPage = (pageNum: number) => {
    switch (pageNum) {
      // PAGE 2 (Spread 0 - Left): Ganesha Shloka, Monogram & Host Address
      case 0:
        return (
          <div className="page-surface flex flex-col justify-between pt-9 pb-3.5 px-3.5 sm:pt-10 sm:pb-7 sm:px-7 md:pt-11 md:pb-8 md:px-8">
            <div className="absolute inset-2 sm:inset-3 border border-[#B38A24]/60 pointer-events-none rounded-sm">
              <div className="absolute top-1 left-1 w-3.5 h-3.5 border-t-2 border-l-2 border-[#AA8222]" />
              <div className="absolute bottom-1 left-1 w-3.5 h-3.5 border-b-2 border-l-2 border-[#AA8222]" />
            </div>

            <div className="relative text-center my-auto space-y-2.5 px-1 sm:px-2">
              <span className="font-['Noto_Serif_Devanagari'] text-sm sm:text-base font-bold text-[#7A1522] tracking-widest block drop-shadow-sm">
                ॥ श्री गणेशाय नमः ॥
              </span>

              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#B38A24] mx-auto flex items-center justify-center bg-[#FAF4E5] shadow-[0_4px_16px_rgba(180,140,50,0.25)] p-1">
                <GaneshaSymbol size={isMobile ? 44 : 50} className="drop-shadow-sm" />
              </div>

              <div className="p-2.5 sm:p-3 bg-white/70 backdrop-blur-[2px] rounded-lg border border-[#E0D4C1] shadow-xs">
                <p className="font-['Noto_Serif_Devanagari'] text-sm sm:text-base font-semibold text-[#1A1008] leading-relaxed italic">
                  वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।<br />
                  निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥
                </p>
              </div>

              <div className="w-16 sm:w-20 h-[1.5px] bg-[#B38A24] mx-auto my-1" />

              <div className="p-2.5 sm:p-3 bg-white/75 backdrop-blur-[2px] rounded-lg border border-[#D4AF37]/60 shadow-xs max-w-xs mx-auto text-center space-y-1">
                <p className="font-['Marcellus'] text-xs sm:text-sm font-bold text-[#7A1522] uppercase tracking-wider">
                  निमंत्रक: श्री वेदप्रकाश एवं समस्त परिवार
                </p>
                <p className="font-['Cormorant_Garamond'] text-sm sm:text-base italic text-[#1A1008] leading-relaxed font-medium">
                  "परमपिता परमात्मा की अनुकम्पा एवं पूज्य बुजुर्गों के आशीर्वाद से हम अपने प्रिय सुपुत्र के वैवाहिक महोत्सव में आपका हार्दिक स्वागत करते हैं।"
                </p>
              </div>

              {/* Residence Address Card with Google Maps Link */}
              <div className="p-2.5 bg-[#FAF5EB] border border-[#D4AF37]/70 rounded-lg text-center font-['Inter_Tight'] space-y-1 max-w-xs mx-auto">
                <span className="font-bold text-[#7A1522] font-['Marcellus'] block text-xs sm:text-sm">
                  निवास स्थान:
                </span>
                <p className="text-[#2C1F15] text-xs sm:text-sm leading-snug">
                  44/24, गली नं ३, भीम कॉलोनी, बख्तावरपुर, दिल्ली - 110036
                </p>
                <a
                  href={HOST_DETAILS.residenceMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm text-[#8C6218] font-bold hover:underline pt-0.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#7A1522]" />
                  <span>Google Maps पर स्थान देखें</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="relative flex justify-between text-xs sm:text-sm font-['Marcellus'] text-[#7A5826] font-semibold pt-1.5 border-t border-[#D9CDB8]">
              <span>Page 1</span>
              <span>॥ शुभ विवाह ॥</span>
            </div>
          </div>
        );

      // PAGE 3 (Spread 0 - Right): Royal Patrika Proclamation
      case 1:
        return (
          <div className="page-surface flex flex-col justify-between pt-9 pb-3.5 px-3.5 sm:pt-10 sm:pb-7 sm:px-7 md:pt-11 md:pb-8 md:px-8">
            <div className="absolute inset-2 sm:inset-3 border border-[#B38A24]/60 pointer-events-none rounded-sm">
              <div className="absolute top-1 right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-[#AA8222]" />
              <div className="absolute bottom-1 right-1 w-3.5 h-3.5 border-b-2 border-r-2 border-[#AA8222]" />
            </div>

            <div className="relative text-center my-auto space-y-2 px-1 sm:px-2">
              <GaneshaSymbol size={34} className="mx-auto" />
              <span className="text-xs sm:text-sm uppercase tracking-[0.25em] font-bold text-[#7A1522] font-['Marcellus'] block">
                ॥ शुभ विवाह पत्रिका ॥
              </span>

              <p className="font-['Cormorant_Garamond'] text-sm sm:text-base italic text-[#1A1008] leading-snug font-medium">
                परमपिता परमात्मा की असीम कृपा से,<br />
                <strong className="font-bold text-[#7A1522]">श्री वेदप्रकाश एवं समस्त परिवार</strong><br />
                सादर आमंत्रित करते हैं अपने सुपुत्र के शुभ पाणिग्रहण संस्कार में
              </p>

              <h2 className="font-['Marcellus'] text-2xl sm:text-3xl font-bold tracking-[0.16em]">
                <span className="text-[#7A1522] block">ABHISHEK</span>
                <span className="block font-['Alex_Brush'] text-2xl sm:text-3xl font-normal text-[#8C5A14] lowercase my-0.5">
                  weds
                </span>
                <span className="text-[#7A1522] block">ISHITA</span>
              </h2>

              <p className="font-['Noto_Serif_Devanagari'] text-sm sm:text-base font-bold text-[#8C5A14]">
                ॥ अभिषेक संग इशिता ॥
              </p>

              {/* The Two Key Ceremonies Box (In English with Hyperlinks) */}
              <div className="bg-white/90 backdrop-blur-[2px] rounded-lg border border-[#D8CBB7] py-2.5 px-3 w-full max-w-xs mx-auto space-y-2.5 shadow-xs text-left font-['Inter_Tight']">
                <div className="border-b border-[#E8DCCB] pb-2 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#A36006] font-['Marcellus'] text-xs sm:text-sm uppercase tracking-wide">
                      1. Ring Ceremony & Lunch
                    </span>
                    <span className="text-xs font-bold text-[#1A1008] bg-[#FAF3E3] px-2 py-0.5 rounded border border-[#A36006]/30">
                      5 Dec 2026
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#2C1F15]">
                    • 11:00 AM Ceremony | 01:00 PM Lunch
                  </p>
                  <a
                    href="https://maps.app.goo.gl/mrv1ZjPQXxpvmBDL6"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#7A1522] hover:underline"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#A36006]" />
                    <span>Venue: Mannat Vatika Farm (Maps)</span>
                    <ExternalLink className="w-3 h-3 text-[#A36006]" />
                  </a>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#7A1522] font-['Marcellus'] text-xs sm:text-sm uppercase tracking-wide">
                      2. Barat Departure & Wedding
                    </span>
                    <span className="text-xs font-bold text-[#1A1008] bg-[#FAF3E3] px-2 py-0.5 rounded border border-[#7A1522]/30">
                      12 Dec 2026
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#2C1F15]">
                    • 10:00 AM Sehra Bandi | 11:00 AM Barat
                  </p>
                  <a
                    href="https://maps.app.goo.gl/rCGKCJWhjcMhXcaC8"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#7A1522] hover:underline"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#7A1522]" />
                    <span>Venue: Green Lounge Banquet (Maps)</span>
                    <ExternalLink className="w-3 h-3 text-[#7A1522]" />
                  </a>
                </div>
              </div>

              <div className="py-0.5">
                <WaxSeal size={48} useGanesha={true} color="#8C1E2B" />
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="py-1.5 px-4 bg-[#7A1522] hover:bg-[#630E19] text-[#FAF6ED] text-xs sm:text-sm font-['Marcellus'] tracking-[0.14em] uppercase rounded-full border border-[#9E3341] shadow transition-transform hover:scale-105 cursor-pointer font-bold"
              >
                Ring Ceremony Details →
              </button>
            </div>

            <div className="relative flex justify-between text-xs sm:text-sm font-['Marcellus'] text-[#7A5826] font-semibold pt-1.5 border-t border-[#D9CDB8]">
              <span>Shri Vedprakash</span>
              <span>Page 2</span>
            </div>
          </div>
        );

      // PAGE 4 (Spread 1 - Left): EVENT 1 — RING CEREMONY & LUNCH (5th Dec)
      case 2:
        return (
          <div className="page-surface flex flex-col justify-between pt-9 pb-3.5 px-3.5 sm:pt-10 sm:pb-7 sm:px-7 md:pt-11 md:pb-8 md:px-8">
            <div className="absolute inset-2 sm:inset-3 border border-[#B38A24]/60 pointer-events-none rounded-sm" />

            <div className="relative text-center space-y-2.5">
              <div>
                <span className="text-xs sm:text-sm uppercase tracking-[0.22em] font-bold text-[#A36006] font-['Marcellus'] block">
                  Event 1 • 5th December 2026
                </span>
                <h3 className="font-['Marcellus'] text-2xl sm:text-3xl font-bold text-[#1A1008] tracking-wide mt-0.5">
                  Ring Ceremony & Preeti Bhoj
                </h3>
                <p className="font-['Noto_Serif_Devanagari'] text-sm sm:text-base font-bold text-[#7A1522]">
                  ॥ सगाई एवं मुद्रिका संस्कार महोत्सव ॥
                </p>
              </div>

              {/* Venue Card with Direct Google Maps Link */}
              <div className="p-2.5 bg-white/85 backdrop-blur-[2px] border border-[#D8CBB7] rounded-lg space-y-1.5 font-['Inter_Tight'] shadow-xs text-center">
                <div className="flex items-center justify-center gap-1.5 text-[#A36006] font-bold font-['Marcellus'] text-sm sm:text-base">
                  <MapPin className="w-4 h-4 text-[#7A1522] shrink-0" />
                  <span>मन्नत वाटिका फार्म (Mannat Vatika Farm)</span>
                </div>
                <p className="text-[#1A1008] text-xs sm:text-sm leading-snug">
                  An auspicious morning celebration of eternal vows, family blessings, and festive royal lunch.
                </p>
                <div className="pt-1 flex justify-center">
                  <a
                    href="https://maps.app.goo.gl/mrv1ZjPQXxpvmBDL6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 py-1.5 px-3.5 bg-[#7A1522] hover:bg-[#94192B] text-[#FAF6ED] rounded-full text-xs sm:text-sm font-['Marcellus'] font-bold uppercase tracking-wider transition-all shadow-xs"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#FFE8B6]" />
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Exact Timings required by user */}
              <div className="space-y-1.5 font-['Inter_Tight'] font-medium">
                <div className="flex items-center justify-between p-2.5 rounded bg-white/75 border border-[#D8CBB7]">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#7A1522]" />
                    <span className="font-semibold text-xs sm:text-sm">Ring Ceremony (मुद्रिका संस्कार)</span>
                  </div>
                  <span className="font-bold text-[#7A1522] font-['Marcellus'] text-sm sm:text-base">11:00 AM</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded bg-white/75 border border-[#D8CBB7]">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#A36006]" />
                    <span className="font-semibold text-xs sm:text-sm">Preeti Bhoj / Lunch (प्रीतिभोज)</span>
                  </div>
                  <span className="font-bold text-[#A36006] font-['Marcellus'] text-sm sm:text-base">01:00 PM</span>
                </div>
              </div>

              <div className="p-2 bg-white/70 backdrop-blur-[2px] rounded border border-[#E0D4C1] shadow-xs text-center">
                <p className="text-xs sm:text-sm italic font-['Cormorant_Garamond'] text-[#1A1008] font-semibold">
                  Attire: Auspicious Gold, Festive Peach, Pastels & Traditional Ethnic.
                </p>
              </div>
            </div>

            <div className="relative flex justify-between text-xs sm:text-sm font-['Marcellus'] text-[#7A5826] font-semibold pt-1.5 border-t border-[#D9CDB8]">
              <span>Page 3</span>
              <span>5 Dec • Mannat Vatika</span>
            </div>
          </div>
        );

      // PAGE 4 (Spread 1 - Right): EVENT 2 — BARAT & SHUBH VIVAH (12th Dec)
      case 3:
        return (
          <div className="page-surface flex flex-col justify-between pt-9 pb-3.5 px-3.5 sm:pt-10 sm:pb-7 sm:px-7 md:pt-11 md:pb-8 md:px-8">
            <div className="absolute inset-2 sm:inset-3 border border-[#B38A24]/60 pointer-events-none rounded-sm" />

            <div className="relative text-center space-y-2.5">
              <div>
                <span className="text-xs sm:text-sm uppercase tracking-[0.22em] font-bold text-[#7A1522] font-['Marcellus'] block">
                  Event 2 • 12th December 2026
                </span>
                <h3 className="font-['Marcellus'] text-2xl sm:text-3xl font-bold text-[#1A1008] tracking-wide mt-0.5">
                  Barat & Shubh Vivah
                </h3>
                <p className="font-['Noto_Serif_Devanagari'] text-sm sm:text-base font-bold text-[#8C121E]">
                  ॥ सेहरा बंदी, बारात प्रस्थान एवं पाणिग्रहण संस्कार ॥
                </p>
              </div>

              {/* Venue Card with Direct Google Maps Link */}
              <div className="p-2.5 bg-white/85 backdrop-blur-[2px] border border-[#D8CBB7] rounded-lg space-y-1.5 font-['Inter_Tight'] shadow-xs text-center">
                <div className="flex items-center justify-center gap-1.5 text-[#7A1522] font-bold font-['Marcellus'] text-sm sm:text-base">
                  <MapPin className="w-4 h-4 text-[#8C121E] shrink-0" />
                  <span>ग्रीन लाउंज नॉर्थ बैंक्वेट (Green Lounge North Banquet)</span>
                </div>
                <p className="text-[#1A1008] text-xs sm:text-sm leading-snug">
                  The auspicious wedding celebrations, grand reception, and the seven sacred vows of companionship.
                </p>
                <div className="pt-1 flex justify-center">
                  <a
                    href="https://maps.app.goo.gl/rCGKCJWhjcMhXcaC8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 py-1.5 px-3.5 bg-[#7A1522] hover:bg-[#94192B] text-[#FAF6ED] rounded-full text-xs sm:text-sm font-['Marcellus'] font-bold uppercase tracking-wider transition-all shadow-xs"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#FFE8B6]" />
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Exact Timings requested by user */}
              <div className="space-y-1.5 font-['Inter_Tight'] font-medium">
                <div className="p-2.5 rounded bg-white/75 border border-[#D8CBB7] space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs sm:text-sm text-[#1A1008]">Sehra Bandi (सेहरा बंदी)</span>
                    <span className="font-bold text-[#7A1522] font-['Marcellus'] text-sm sm:text-base">10:00 AM</span>
                  </div>
                  <span className="text-xs text-[#7A5826] block">
                    स्थान: 44/24, गली नं ३, भीम कॉलोनी, बख्तावरपुर (निवास स्थान)
                  </span>
                </div>

                <div className="p-2.5 rounded bg-white/75 border border-[#D8CBB7] space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs sm:text-sm text-[#1A1008]">Departure of Barat (बारात प्रस्थान)</span>
                    <span className="font-bold text-[#7A1522] font-['Marcellus'] text-sm sm:text-base">11:00 AM</span>
                  </div>
                  <span className="text-xs text-[#7A5826] block">
                    प्रस्थान: निवास स्थान से ग्रीन लाउंज नॉर्थ बैंक्वेट की ओर
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded bg-white/75 border border-[#D8CBB7]">
                  <span className="font-semibold text-xs sm:text-sm text-[#1A1008]">Swagat & Shubh Vivah (स्वागत एवं प्रीतिभोज)</span>
                  <span className="font-bold text-[#7A1522] font-['Marcellus'] text-sm sm:text-base">01:00 PM Onward</span>
                </div>
              </div>
            </div>

            <div className="relative flex justify-between text-xs sm:text-sm font-['Marcellus'] text-[#7A5826] font-semibold pt-1.5 border-t border-[#D9CDB8]">
              <span>12 Dec • Green Lounge Banquet</span>
              <span>Page 4</span>
            </div>
          </div>
        );

      // PAGE 5 (Spread 2 - Left): VENUES & GOOGLE MAPS DIRECTORY
      case 4:
        return (
          <div className="page-surface flex flex-col justify-between pt-9 pb-3.5 px-3.5 sm:pt-10 sm:pb-7 sm:px-7 md:pt-11 md:pb-8 md:px-8">
            <div className="absolute inset-2 sm:inset-3 border border-[#B38A24]/60 pointer-events-none rounded-sm" />

            <div className="relative text-center space-y-2">
              <div>
                <span className="text-xs sm:text-sm uppercase tracking-[0.22em] font-bold text-[#8C5A14] font-['Marcellus'] block">
                  Location Directory
                </span>
                <h3 className="font-['Marcellus'] text-2xl sm:text-3xl font-bold text-[#1A1008] tracking-wide mt-0.5">
                  Venues & Google Maps
                </h3>
                <p className="font-['Noto_Serif_Devanagari'] text-sm sm:text-base text-[#7A1522] font-semibold">
                  ॥ विवाह समारोह स्थल निर्देशिका ॥
                </p>
              </div>

              <div className="space-y-2 font-['Inter_Tight']">
                {/* Location 1: Mannat Vatika Farm */}
                <div className="p-2.5 bg-white/85 backdrop-blur-[2px] rounded-lg border border-[#D8CBB7] shadow-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#A36006] font-['Marcellus'] text-xs sm:text-sm">
                      1. मन्नत वाटिका फार्म (Mannat Vatika)
                    </span>
                    <span className="text-xs font-bold bg-[#FAF3E3] text-[#A36006] px-2 py-0.5 rounded border border-[#D4AF37]/50">
                      5 DEC • सगाई
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#2C1F15]">
                    Ring Ceremony (11:00 AM) & Preeti Bhoj Lunch (1:00 PM)
                  </p>
                  <a
                    href="https://maps.app.goo.gl/mrv1ZjPQXxpvmBDL6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#7A1522] hover:underline pt-0.5"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#7A1522]" />
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Location 2: Green Lounge North Banquet */}
                <div className="p-2.5 bg-white/85 backdrop-blur-[2px] rounded-lg border border-[#D8CBB7] shadow-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#7A1522] font-['Marcellus'] text-xs sm:text-sm">
                      2. ग्रीन लाउंज नॉर्थ बैंक्वेट (Green Lounge)
                    </span>
                    <span className="text-xs font-bold bg-[#FBF0F2] text-[#7A1522] px-2 py-0.5 rounded border border-[#7A1522]/30">
                      12 DEC • बारात & विवाह
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#2C1F15]">
                    Swagat, Varmala & Grand Reception (01:00 PM Onward)
                  </p>
                  <a
                    href="https://maps.app.goo.gl/rCGKCJWhjcMhXcaC8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#7A1522] hover:underline pt-0.5"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#7A1522]" />
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Location 3: Residence / Nivas */}
                <div className="p-2.5 bg-white/85 backdrop-blur-[2px] rounded-lg border border-[#D8CBB7] shadow-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#2A1F18] font-['Marcellus'] text-xs sm:text-sm">
                      3. निवास स्थान (Family Residence)
                    </span>
                    <span className="text-xs font-bold bg-[#FAF5EB] text-[#7A5826] px-2 py-0.5 rounded border border-[#D4AF37]/50">
                      12 DEC 10:00 AM • सेहरा बंदी
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#2C1F15]">
                    44/24, गली नं ३, भीम कॉलोनी, बख्तावरपुर, दिल्ली - 110036
                  </p>
                  <a
                    href={HOST_DETAILS.residenceMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#7A1522] hover:underline pt-0.5"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#7A1522]" />
                    <span>Open Residence in Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="relative flex justify-between text-xs sm:text-sm font-['Marcellus'] text-[#7A5826] font-semibold pt-1.5 border-t border-[#D9CDB8]">
              <span>Page 5</span>
              <span>Location Directory</span>
            </div>
          </div>
        );

      // PAGE 7 (Spread 2 - Right): WARM WELCOME, 5 DEC COUNTDOWN & RSVP
      case 5:
        return (
          <div className="page-surface flex flex-col justify-between pt-9 pb-3.5 px-3 sm:pt-10 sm:pb-5 sm:px-6 md:pt-11 md:pb-6 md:px-7">
            <div className="absolute inset-2 sm:inset-2.5 border border-[#B38A24]/60 pointer-events-none rounded-sm">
              <div className="absolute top-1 right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-[#AA8222]" />
              <div className="absolute bottom-1 right-1 w-3.5 h-3.5 border-b-2 border-r-2 border-[#AA8222]" />
            </div>

            <div className="relative text-center space-y-1.5 w-full flex flex-col items-center pt-1">
              <GaneshaSymbol size={32} className="mx-auto drop-shadow-sm" />

              <div className="space-y-0.5">
                <span className="text-[11px] sm:text-xs uppercase tracking-[0.24em] font-bold text-[#7A1522] font-['Marcellus'] block">
                  ॥ सादर आमंत्रण एवं स्वागत ॥
                </span>
                <h3 className="font-['Marcellus'] text-xl sm:text-2xl font-bold text-[#1A1008] tracking-wide">
                  Warm Welcome & Blessings
                </h3>
                <p className="font-['Marcellus'] text-xs sm:text-sm font-bold text-[#7A1522] tracking-wider">
                  ABHISHEK & ISHITA
                </p>
              </div>

              <div className="p-2 sm:p-2.5 bg-white/85 backdrop-blur-[2px] rounded-lg border border-[#D8CBB7] shadow-xs text-center font-['Inter_Tight'] w-full">
                <p className="font-['Cormorant_Garamond'] text-xs sm:text-sm italic text-[#1A1008] leading-snug font-semibold">
                  "परमपिता परमात्मा के असीम अनुग्रह एवं पूज्य बुजुर्गों के पावन आशीर्वाद से आयोजित इस मांगलिक विवाह उत्सव में आप सपरिवार सादर आमंत्रित हैं।"
                </p>
              </div>

              {/* Countdown for 5th Dec Only */}
              <div className="w-full">
                <CountdownBlock />
              </div>

              {/* R.S.V.P. & Contact Numbers Card */}
              <div className="w-full p-2 sm:p-2.5 bg-white/90 backdrop-blur-[2px] rounded-lg border border-[#D4AF37] shadow-xs text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-[#7A1522]">
                  <Phone className="w-3.5 h-3.5 text-[#A36006]" />
                  <span className="font-['Marcellus'] text-[11px] sm:text-xs font-bold uppercase tracking-[0.16em]">
                    R.S.V.P. & Contact Numbers
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-xs sm:text-sm font-semibold text-[#1A1008] font-['Inter_Tight']">
                  <a
                    href="tel:9971006431"
                    className="p-1 rounded bg-[#FAF6EE] border border-[#E0D4C1] hover:border-[#7A1522] hover:text-[#7A1522] transition-colors flex items-center justify-center gap-1"
                  >
                    <Phone className="w-3 h-3 text-[#A36006]" />
                    <span>9971006431</span>
                  </a>
                  <a
                    href="tel:9212029424"
                    className="p-1 rounded bg-[#FAF6EE] border border-[#E0D4C1] hover:border-[#7A1522] hover:text-[#7A1522] transition-colors flex items-center justify-center gap-1"
                  >
                    <Phone className="w-3 h-3 text-[#A36006]" />
                    <span>9212029424</span>
                  </a>
                  <a
                    href="tel:9873185576"
                    className="p-1 rounded bg-[#FAF6EE] border border-[#E0D4C1] hover:border-[#7A1522] hover:text-[#7A1522] transition-colors flex items-center justify-center gap-1"
                  >
                    <Phone className="w-3 h-3 text-[#A36006]" />
                    <span>9873185576</span>
                  </a>
                  <a
                    href="tel:9560364705"
                    className="p-1 rounded bg-[#FAF6EE] border border-[#E0D4C1] hover:border-[#7A1522] hover:text-[#7A1522] transition-colors flex items-center justify-center gap-1"
                  >
                    <Phone className="w-3 h-3 text-[#A36006]" />
                    <span>9560364705</span>
                  </a>
                </div>
              </div>

              <div className="text-[11px] sm:text-xs font-['Marcellus'] text-[#7A5826] text-center">
                <span className="font-semibold text-[#1A1008]">निमंत्रक: श्री वेदप्रकाश एवं समस्त परिवार • बख्तावरपुर, दिल्ली</span>
              </div>

              <div className="pt-0.5">
                <button
                  type="button"
                  onClick={() => goToPage(1)}
                  className="py-1 px-3.5 border-2 border-[#D4AF37] bg-[#7A1522] hover:bg-[#630E19] text-[#FAF6ED] text-[11px] sm:text-xs font-['Marcellus'] font-bold tracking-wider uppercase rounded-full shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 hover:scale-105 active:scale-95 mx-auto"
                >
                  <Book className="w-3 h-3 text-[#F5DE98]" />
                  <span>Front Cover • मुख्य पृष्ठ</span>
                </button>
              </div>
            </div>

            <div className="relative w-full flex justify-between text-xs sm:text-sm font-['Marcellus'] text-[#7A5826] font-semibold pt-1 border-t border-[#D9CDB8]">
              <span>Blessings & RSVP</span>
              <span>Page 6</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden select-none">
      {/* 1. Header Toolbar */}
      <header className="w-full pt-2 sm:pt-3 px-3 sm:px-6 flex justify-between items-center z-30">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => goToPage(currentPage === 1 ? 2 : 1)}
            className="py-1 sm:py-1.5 px-2.5 sm:px-3 border border-[#D4AF37]/80 bg-[#FAF6EE]/90 hover:bg-[#7A1522] hover:text-[#FAF6ED] text-[#7A1522] rounded-full text-xs font-['Marcellus'] font-bold tracking-wider uppercase transition-all cursor-pointer shadow-md flex items-center gap-1.5 backdrop-blur-sm"
          >
            {currentPage === 1 ? (
              <>
                <BookOpen className="w-3.5 h-3.5" />
                <span>Open Book • खोलें</span>
              </>
            ) : (
              <>
                <Book className="w-3.5 h-3.5" />
                <span>Cover • मुखपृष्ठ</span>
              </>
            )}
          </button>
        </div>

        {/* Center Title */}
        <div className="hidden sm:flex flex-col items-center text-center">
          <span className="font-['Marcellus'] text-xs tracking-[0.25em] uppercase text-[#D4AF37] font-bold">
            ॥ श्री गणेशाय नमः ॥
          </span>
          <span className="font-['Marcellus'] text-sm tracking-widest text-[#FFF2CC] font-bold">
            Abhishek weds Ishita • 5 & 12 Dec 2026
          </span>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {onTriggerPetals && (
            <button
              type="button"
              onClick={onTriggerPetals}
              title="Phoolon Ki Varsha"
              className="py-1 sm:py-1.5 px-2.5 sm:px-3 border border-[#D4AF37]/70 bg-[#FAF6EE]/90 hover:bg-[#7A1522] hover:text-[#FAF6ED] text-[#7A1522] rounded-full text-xs font-['Marcellus'] font-semibold transition-all cursor-pointer shadow-md hover:scale-105 flex items-center gap-1 backdrop-blur-sm"
            >
              <Heart className="w-3.5 h-3.5 fill-current text-[#D9384B]" />
              <span className="hidden sm:inline">Petals</span>
            </button>
          )}

          <button
            type="button"
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
            className="p-1 sm:p-1.5 border border-[#D4AF37]/70 bg-[#FAF6EE]/90 hover:bg-[#7A1522] hover:text-[#FAF6ED] text-[#5C4834] rounded-full transition-all cursor-pointer shadow-md backdrop-blur-sm"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 2b. Mobile Sub-page Switcher */}
      {isMobile && currentPage > 1 && currentPage < 8 && (
        <div className="w-full flex justify-center items-center gap-2 py-0.5 z-30">
          <button
            type="button"
            onClick={() => goToPage(currentSpread * 2 + 2)}
            className={`px-3.5 py-1 rounded-full text-xs sm:text-sm font-['Marcellus'] font-bold tracking-wider uppercase transition-all shadow cursor-pointer ${
              mobileSide === 'left'
                ? 'bg-gradient-to-r from-[#94192B] to-[#700F1E] text-[#FAF6ED] border border-[#D4AF37]'
                : 'bg-[#FAF6EE]/80 text-[#5C4834] border border-[#D4AF37]/40 hover:bg-[#FAF6EE]'
            }`}
          >
            Part 1 • Left Page
          </button>

          <span className="text-[#D4AF37] text-xs font-serif">•</span>

          <button
            type="button"
            onClick={() => goToPage(currentSpread * 2 + 3)}
            className={`px-3.5 py-1 rounded-full text-xs sm:text-sm font-['Marcellus'] font-bold tracking-wider uppercase transition-all shadow cursor-pointer ${
              mobileSide === 'right'
                ? 'bg-gradient-to-r from-[#94192B] to-[#700F1E] text-[#FAF6ED] border border-[#D4AF37]'
                : 'bg-[#FAF6EE]/80 text-[#5C4834] border border-[#D4AF37]/40 hover:bg-[#FAF6EE]'
            }`}
          >
            Part 2 • Right Page
          </button>
        </div>
      )}

      {/* 3. The Book Stage */}
      <div className="relative flex-1 w-full flex items-center justify-center p-1 sm:p-3">
        {/* Floating Side Navigation Arrows (Touch & Desktop friendly) */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentPage <= 1}
          className={`flex absolute left-1 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 w-8 sm:w-11 h-8 sm:h-11 rounded-full border sm:border-2 border-[#D4AF37] bg-[#7A1522]/95 backdrop-blur-md text-[#FAF6ED] items-center justify-center transition-all z-40 shadow-2xl active:scale-90 ${
            currentPage <= 1
              ? 'opacity-20 pointer-events-none'
              : 'hover:scale-110 cursor-pointer hover:bg-[#94192B]'
          }`}
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={currentPage >= 8}
          className={`flex absolute right-1 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 w-8 sm:w-11 h-8 sm:h-11 rounded-full border sm:border-2 border-[#D4AF37] bg-[#7A1522]/95 backdrop-blur-md text-[#FAF6ED] items-center justify-center transition-all z-40 shadow-2xl active:scale-90 ${
            currentPage >= 8
              ? 'opacity-20 pointer-events-none'
              : 'hover:scale-110 cursor-pointer hover:bg-[#94192B]'
          }`}
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Outer Shadow & Padded Velvet Hardcover Frame */}
        <div
          ref={bookContainerRef}
          className="relative p-1 sm:p-3 rounded-xl shadow-[0_20px_60px_rgba(15,5,8,0.75)] border-2 border-[#D4AF37]/80 bg-cover bg-center transition-all duration-500 max-w-full"
          style={{
            backgroundColor: activeVolume?.spineColor || '#5A0C16',
            backgroundImage: `radial-gradient(circle at 50% 30%, rgba(255,255,255,0.18) 0%, transparent 65%), url('${activeVolume?.coverTexture || '/assets/textures/cover_patrika.jpg'}')`,
          }}
        >
          {/* Silk Bookmark Ribbon */}
          <div
            className="bookmark-ribbon absolute -top-3 sm:-top-3.5 left-1/2 -translate-x-1/2 w-6 sm:w-7 h-5 sm:h-6 shadow-md z-30 rounded-b border-t border-[#D4AF37] flex items-end justify-center pb-0.5 transition-colors duration-500 pointer-events-none"
            style={{ backgroundColor: activeVolume?.spineColor || '#8C1E2B' }}
          >
            <span className="text-[7.5px] sm:text-[8px] font-['Cinzel'] font-bold text-[#EEDCA2]">
              {currentPage === 1 ? 'COVER' : currentPage >= 8 ? 'END' : isMobile ? `${currentPage - 1}/6` : `${currentSpread + 1}/3`}
            </span>
          </div>

          {/* THE BOOK CONTAINER WITH TURN.JS 3D PAGE TURNS */}
          <div
            className="book-stage-3d relative flex items-center justify-center rounded shadow-2xl overflow-hidden"
            style={{
              width: `${bookDimensions.width}px`,
              height: `${bookDimensions.height}px`,
              backgroundColor: 'transparent',
              backgroundImage: 'none',
            }}
          >
            {/* Center Spine Crease Overlay for Double-Page Spreads */}
            {!isMobile && currentPage > 1 && currentPage < 8 && (
              <div className="spine-crease-shadow" />
            )}
            <FlipbookDOM
              isMobile={isMobile}
              activeVolume={activeVolume}
              flipbookRef={flipbookRef}
              renderPage={renderPage}
              onCloseToShelf={onCloseToShelf}
              onOpenBook={() => goToPage(2)}
              onGoToFrontCover={() => goToPage(1)}
            />
          </div>
        </div>
      </div>

      {/* 4. Bottom Page Navigation & Footer */}
      <footer className="w-full pb-2 px-2 sm:px-6 flex justify-between items-center text-xs font-['Inter_Tight'] text-[#705F4D] z-30 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {isMobile ? (
          currentPage === 1 ? (
            <div className="w-full flex items-center justify-between gap-2 max-w-sm mx-auto">
              <div
                onClick={handleNext}
                className="flex-1 py-1.5 px-3 rounded-full bg-[#180307]/95 border-2 border-[#D4AF37] shadow-lg backdrop-blur-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                <span className="font-['Marcellus'] text-xs sm:text-sm font-bold tracking-wider uppercase text-[#FFF2CC]">
                  Swipe to left to navigate
                </span>
                <span className="text-sm sm:text-base text-[#F5DE98] font-bold animate-bounce-x">←</span>
              </div>
              <button
                type="button"
                onClick={handleNext}
                className="h-9 px-3.5 rounded-full border border-[#D4AF37]/80 bg-[#7A1522] text-[#FAF6ED] flex items-center gap-1.5 text-xs sm:text-sm font-['Marcellus'] font-bold uppercase shadow-lg active:scale-90 transition-all shrink-0 cursor-pointer"
              >
                <span>Open</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="w-full flex items-center justify-between gap-2 max-w-xs mx-auto">
              {/* Mobile Prev Button */}
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentPage <= 1}
                className={`h-9 px-3.5 rounded-full border border-[#D4AF37]/80 bg-[#7A1522] text-[#FAF6ED] flex items-center gap-1.5 text-xs sm:text-sm font-['Marcellus'] font-bold uppercase shadow-lg active:scale-90 transition-all ${
                  currentPage <= 1 ? 'opacity-25 pointer-events-none' : 'active:bg-[#94192B]'
                }`}
                aria-label="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              {/* Mobile Page Progress Indicator */}
              <div className="px-3.5 py-1.5 rounded-full bg-[#180307]/90 border border-[#D4AF37]/70 backdrop-blur-md shadow-md text-center">
                <span className="font-['Marcellus'] tracking-widest text-[#F5DE98] font-bold uppercase text-xs sm:text-sm">
                  {currentPage === 1
                    ? 'Cover'
                    : currentPage >= 8
                    ? 'End'
                    : `Page ${currentPage - 1} / 6`}
                </span>
              </div>

              {/* Mobile Next Button */}
              <button
                type="button"
                onClick={handleNext}
                disabled={currentPage >= 8}
                className={`h-9 px-3.5 rounded-full border border-[#D4AF37]/80 bg-[#7A1522] text-[#FAF6ED] flex items-center gap-1.5 text-xs sm:text-sm font-['Marcellus'] font-bold uppercase shadow-lg active:scale-90 transition-all ${
                  currentPage >= 8 ? 'opacity-25 pointer-events-none' : 'active:bg-[#94192B]'
                }`}
                aria-label="Next Page"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )
        ) : (
          <>
            <div className="flex items-center gap-1.5">
              <span className="tracking-wider uppercase text-[9.5px]">
                Drag page corners or press keyboard arrows to turn
              </span>
            </div>

            <span className="font-['Marcellus'] tracking-widest text-[#8C6D2B] font-bold uppercase text-[10px] sm:text-[11px]">
              {currentPage === 1
                ? 'Front Cover'
                : currentPage >= 8
                ? 'Back Cover'
                : `Pages ${currentSpread * 2 + 1}–${currentSpread * 2 + 2} of 6`}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => goToPage(currentPage === 1 ? 2 : 1)}
                className="text-[#8C6D2B] hover:text-[#7A1522] uppercase tracking-wider text-[10px] cursor-pointer font-bold font-['Marcellus'] transition-colors"
              >
                {currentPage === 1 ? 'Open Book ➔' : '➔ Front Cover'}
              </button>
            </div>
          </>
        )}
      </footer>
    </div>
  );
};

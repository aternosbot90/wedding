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
  { id: 2, title: 'Venues & Maps', spread: 2, page: 6, subtitle: 'Location Guide' },
  { id: 3, title: 'Blessings', spread: 3, page: 8, subtitle: 'RSVP & Contacts' },
];

const CountdownBlock: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date('2026-12-12T10:00:00+05:30').getTime();
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
    <div className="w-full bg-white/85 backdrop-blur-[2px] border border-[#D4AF37]/80 p-2.5 sm:p-3 rounded-lg shadow-md">
      <span className="text-[9px] sm:text-[9.5px] uppercase tracking-[0.22em] font-bold text-[#7A1522] font-['Marcellus'] block mb-1">
        Countdown to 12th December 2026 (Barat)
      </span>
      <div className="grid grid-cols-4 gap-1.5 select-none pointer-events-none">
        <div className="bg-[#FAF6ED] p-1.5 rounded border border-[#D8CBB7] shadow-inner text-center">
          <span className="font-['Marcellus'] text-lg sm:text-xl font-bold text-[#1A1008] block">{timeLeft.days}</span>
          <span className="text-[7.5px] sm:text-[8px] uppercase font-['Inter_Tight'] text-[#7A5826] font-bold">Days</span>
        </div>
        <div className="bg-[#FAF6ED] p-1.5 rounded border border-[#D8CBB7] shadow-inner text-center">
          <span className="font-['Marcellus'] text-lg sm:text-xl font-bold text-[#1A1008] block">{timeLeft.hours}</span>
          <span className="text-[7.5px] sm:text-[8px] uppercase font-['Inter_Tight'] text-[#7A5826] font-bold">Hours</span>
        </div>
        <div className="bg-[#FAF6ED] p-1.5 rounded border border-[#D8CBB7] shadow-inner text-center">
          <span className="font-['Marcellus'] text-lg sm:text-xl font-bold text-[#1A1008] block">{timeLeft.minutes}</span>
          <span className="text-[7.5px] sm:text-[8px] uppercase font-['Inter_Tight'] text-[#7A5826] font-bold">Mins</span>
        </div>
        <div className="bg-[#FAF6ED] p-1.5 rounded border border-[#D4AF37]/80 shadow-inner text-center">
          <span className="font-['Marcellus'] text-lg sm:text-xl font-bold text-[#7A1522] block animate-pulse">{timeLeft.seconds}</span>
          <span className="text-[7.5px] sm:text-[8px] uppercase font-['Inter_Tight'] text-[#7A1522] font-bold">Secs</span>
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
                  className="font-['Noto_Serif_Devanagari'] text-xs sm:text-sm font-bold text-[#FFEAA7] tracking-[0.25em] block"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.95)' }}
                >
                  ॥ श्री गणेशाय नमः ॥
                </span>
                <span
                  className="font-['Marcellus'] text-[9.5px] sm:text-[10.5px] tracking-[0.25em] uppercase text-[#F5DE98] font-bold block"
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
                  <GaneshaSymbol size={isMobile ? 42 : 50} className="drop-shadow-sm" />
                </div>
              </div>

              {/* Wedding Header & Names */}
              <div className="space-y-1 text-center">
                <span
                  className="font-['Marcellus'] text-[10px] sm:text-xs text-[#FFE8B6] tracking-[0.28em] uppercase block font-semibold"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}
                >
                  Shubh Vivah Patrika
                </span>

                <h1 className="font-['Marcellus'] text-xl sm:text-2xl font-bold tracking-[0.18em] my-1">
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
                  className="font-['Noto_Serif_Devanagari'] text-xs sm:text-sm font-bold text-[#F5DE98] block"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}
                >
                  ॥ अभिषेक संग इशिता ॥
                </span>
              </div>

              {/* Gold Divider Line */}
              <div className="w-20 sm:w-24 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto my-2.5" />

              {/* Ceremony Dates & Address */}
              <div className="space-y-0.5 text-center">
                <p
                  className="font-['Marcellus'] text-[10.5px] sm:text-[11.5px] font-bold tracking-[0.16em] uppercase text-[#FFF2CC]"
                  style={{ textShadow: '0 2px 6px rgba(0,0,0,0.95)' }}
                >
                  5TH & 12TH DECEMBER 2026 • DELHI
                </p>
                <p
                  className="text-[9px] sm:text-[10px] text-[#FFE8B6] font-['Marcellus'] tracking-wider"
                  style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}
                >
                  Bakhtawarpur, Delhi - 110036
                </p>
              </div>

              {/* Action Button: Open Book */}
              <div className="pt-2.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenBook();
                  }}
                  className="py-1.5 px-4 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#FFF0B8] to-[#D4AF37] text-[#4A0A12] font-['Marcellus'] text-[10.5px] sm:text-xs font-bold tracking-widest uppercase shadow-[0_4px_16px_rgba(0,0,0,0.7)] hover:scale-105 active:scale-95 transition-transform cursor-pointer flex items-center gap-1.5 mx-auto border border-[#FFEAA7]"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#7A1522]" />
                  <span>पत्रिका खोलें • Open Book</span>
                </button>
              </div>
            </div>

            {/* Bottom Host Badge */}
            <div className="pb-1">
              <div className="px-3.5 py-1 rounded-full bg-[#180307]/92 border border-[#D4AF37]/70 shadow-[0_2px_10px_rgba(0,0,0,0.85)] backdrop-blur-md">
                <span
                  className="text-[9px] sm:text-[9.5px] font-['Marcellus'] text-[#F5DE98] tracking-widest font-bold block"
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
                >
                  SHRI VEDPRAKASH & FAMILY • 44/24 BHEEM COLONY
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PAGES 2 to 9 (Inner Ceremony Spreads: 8 pages, 4 spreads) */}
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="turn-page-sheet">
            {renderPage(idx)}
          </div>
        ))}

        {/* PAGE 10: HARD BACK COVER */}
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
              className="my-auto space-y-2.5 max-w-[300px] p-4 rounded-xl border-2 border-[#D4AF37] shadow-[0_12px_36px_rgba(0,0,0,0.95)] backdrop-blur-md"
              style={{
                background: 'radial-gradient(ellipse at 50% 35%, rgba(65, 12, 20, 0.96) 0%, rgba(20, 3, 7, 0.98) 85%)',
              }}
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[#D4AF37] mx-auto flex items-center justify-center bg-white/10 backdrop-blur-sm shadow-md">
                <span className="text-xl text-[#FFEAA7]">⚜</span>
              </div>

              <p
                className="font-['Cormorant_Garamond'] text-xs sm:text-sm italic text-[#FFF6E0] leading-relaxed"
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
              >
                "May the bond of marriage bring endless joy, prosperity, and eternal companionship."
              </p>

              <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />

              <p
                className="font-['Marcellus'] text-xs font-bold text-[#FFEAA7] tracking-wider uppercase"
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}
              >
                Abhishek & Ishita
              </p>
              <span
                className="text-[9.5px] sm:text-[10px] text-[#E5C158] font-['Marcellus'] tracking-widest block font-bold"
                style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
              >
                Shri Vedprakash & Family • Bakhtawarpur, Delhi
              </span>

              {/* R.S.V.P. & Contact Numbers */}
              <div className="pt-1.5 border-t border-[#D4AF37]/40 space-y-1">
                <span className="text-[9px] font-['Marcellus'] text-[#F5DE98] font-bold tracking-[0.22em] uppercase block">
                  R.S.V.P. & Contact Numbers
                </span>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] font-['Inter_Tight'] text-[#FFF2CC] font-semibold">
                  <a href="tel:9971006431" className="hover:text-[#FFEAA7] hover:underline transition-colors flex items-center justify-center gap-1">
                    <span>9971006431</span>
                  </a>
                  <a href="tel:9212029424" className="hover:text-[#FFEAA7] hover:underline transition-colors flex items-center justify-center gap-1">
                    <span>9212029424</span>
                  </a>
                  <a href="tel:9873185576" className="hover:text-[#FFEAA7] hover:underline transition-colors flex items-center justify-center gap-1">
                    <span>9873185576</span>
                  </a>
                  <a href="tel:9560364705" className="hover:text-[#FFEAA7] hover:underline transition-colors flex items-center justify-center gap-1">
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
                className="py-1.5 px-4 rounded-full bg-[#7A1522] border-2 border-[#D4AF37] text-[10px] sm:text-[11px] font-['Marcellus'] font-bold text-[#FFEAA7] tracking-wider uppercase hover:bg-[#94192B] transition-colors cursor-pointer flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#F5DE98]" />
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
  initialSpread = 0,
  activeVolume,
  onCloseToShelf,
  onTriggerPetals,
  soundEnabled,
  onToggleSound,
}) => {
  const [currentSpread, setCurrentSpread] = useState(initialSpread);
  const [currentPage, setCurrentPage] = useState((initialSpread * 2) + 2);
  const flipbookRef = useRef<HTMLDivElement>(null);

  // Dynamic responsive book size calculation
  const calcDimensions = () => {
    const isMob = typeof window !== 'undefined' && window.innerWidth < 768;
    if (isMob) {
      const w = Math.min(window.innerWidth - 24, 420);
      const h = Math.min(window.innerHeight - 130, 620);
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

  // Mobile Touch Swipe Handling
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const isMob = window.innerWidth < 768;
      setIsMobile(isMob);
      setBookDimensions(calcDimensions());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize Turn.js Flipbook Engine
  useEffect(() => {
    const $ = (window as any).$ || (window as any).jQuery;
    if (!$ || !flipbookRef.current) return;

    const $book = $(flipbookRef.current);
    const isMob = window.innerWidth < 768;
    const dims = calcDimensions();
    setBookDimensions(dims);
    const startPage = Math.min(Math.max((initialSpread * 2) + 2, 1), 10);

    try {
      $book.turn({
        width: dims.width,
        height: dims.height,
        autoCenter: true,
        display: isMob ? 'single' : 'double',
        acceleration: true,
        gradients: !isMob, // Disable gradient redraw on mobile to eliminate canvas lag and flickers
        elevation: isMob ? 0 : 40, // 0 elevation on mobile prevents inverted shadow flashes at 90deg
        duration: isMob ? 450 : 550, // Fast, snappy, responsive turns
        cornerSize: isMob ? 130 : 100,
        page: startPage,
        when: {
          turning: () => {
            // Sound effect removed per user request
          },
          turned: (_e: any, page: number, _view: any) => {
            setCurrentPage(page);
            if (page === 1) {
              setCurrentSpread(0);
              setMobileSide('left');
            } else if (page >= 2 && page <= 9) {
              const spread = Math.floor((page - 2) / 2);
              setCurrentSpread(spread);
              setMobileSide(page % 2 === 1 ? 'right' : 'left');
            } else if (page >= 10) {
              setCurrentSpread(3);
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
        $(flipbookRef.current).turn('next');
      } catch (e) {
        console.warn('Turn next error:', e);
      }
    }
  };

  const handlePrev = () => {
    const $ = (window as any).$ || (window as any).jQuery;
    if ($ && flipbookRef.current) {
      try {
        $(flipbookRef.current).turn('previous');
      } catch (e) {
        console.warn('Turn prev error:', e);
      }
    }
  };

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

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isMobile || !touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.time;
    touchStartRef.current = null;

    if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2 && deltaTime < 450) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

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
          <div className="page-surface flex flex-col justify-between p-4 sm:p-7 md:p-8">
            <div className="absolute inset-2.5 sm:inset-3 border border-[#B38A24]/60 pointer-events-none rounded-sm">
              <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-[#AA8222]" />
              <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-[#AA8222]" />
            </div>

            <div className="relative text-center my-auto space-y-2 px-1 sm:px-2">
              <span className="font-['Noto_Serif_Devanagari'] text-xs sm:text-base font-bold text-[#7A1522] tracking-widest block drop-shadow-sm">
                ॥ श्री गणेशाय नमः ॥
              </span>

              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#B38A24] mx-auto flex items-center justify-center bg-[#FAF4E5] shadow-[0_4px_16px_rgba(180,140,50,0.25)] p-1">
                <GaneshaSymbol size={isMobile ? 42 : 50} className="drop-shadow-sm" />
              </div>

              <div className="p-2 sm:p-2.5 bg-white/60 backdrop-blur-[2px] rounded-lg border border-[#E0D4C1] shadow-xs">
                <p className="font-['Noto_Serif_Devanagari'] text-xs sm:text-sm font-semibold text-[#1A1008] leading-relaxed italic">
                  वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।<br />
                  निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥
                </p>
              </div>

              <div className="w-16 sm:w-20 h-[1.5px] bg-[#B38A24] mx-auto my-1" />

              <div className="p-2.5 sm:p-3 bg-white/70 backdrop-blur-[2px] rounded-lg border border-[#D4AF37]/60 shadow-xs max-w-xs mx-auto text-center space-y-1">
                <p className="font-['Marcellus'] text-[11px] sm:text-xs font-bold text-[#7A1522] uppercase tracking-wider">
                  निमंत्रक: श्री वेदप्रकाश एवं समस्त परिवार
                </p>
                <p className="font-['Cormorant_Garamond'] text-xs sm:text-sm italic text-[#1A1008] leading-relaxed font-medium">
                  "परमपिता परमात्मा की अनुकम्पा एवं पूज्य बुजुर्गों के आशीर्वाद से हम अपने प्रिय सुपुत्र के वैवाहिक महोत्सव में आपका हार्दिक स्वागत करते हैं।"
                </p>
              </div>

              {/* Residence Address Card with Google Maps Link */}
              <div className="p-2 bg-[#FAF5EB] border border-[#D4AF37]/70 rounded-lg text-center text-xs font-['Inter_Tight'] space-y-1 max-w-xs mx-auto">
                <span className="font-bold text-[#7A1522] font-['Marcellus'] block text-[10.5px]">
                  निवास स्थान:
                </span>
                <p className="text-[#2C1F15] text-[11px] leading-snug">
                  44/24, गली नं ३, भीम कॉलोनी, बख्तावरपुर, दिल्ली - 110036
                </p>
                <a
                  href={HOST_DETAILS.residenceMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1 text-[10px] text-[#8C6218] font-bold hover:underline"
                >
                  <MapPin className="w-3 h-3 text-[#7A1522]" />
                  <span>Google Maps पर स्थान देखें</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>

            <div className="relative flex justify-between text-[9.5px] sm:text-[10px] font-['Marcellus'] text-[#7A5826] font-semibold pt-1.5 border-t border-[#D9CDB8]">
              <span>Page 1</span>
              <span>॥ शुभ विवाह ॥</span>
            </div>
          </div>
        );

      // PAGE 3 (Spread 0 - Right): Royal Patrika Proclamation
      case 1:
        return (
          <div className="page-surface flex flex-col justify-between p-4 sm:p-7 md:p-8">
            <div className="absolute inset-2.5 sm:inset-3 border border-[#B38A24]/60 pointer-events-none rounded-sm">
              <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-[#AA8222]" />
              <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-[#AA8222]" />
            </div>

            <div className="relative text-center my-auto space-y-1.5 px-1 sm:px-2">
              <GaneshaSymbol size={32} className="mx-auto" />
              <span className="text-[10px] uppercase tracking-[0.28em] font-bold text-[#7A1522] font-['Marcellus'] block">
                ॥ शुभ विवाह पत्रिका ॥
              </span>

              <p className="font-['Cormorant_Garamond'] text-xs sm:text-sm italic text-[#1A1008] leading-snug font-medium">
                परमपिता परमात्मा की असीम कृपा से,<br />
                <strong className="font-bold text-[#7A1522]">श्री वेदप्रकाश एवं समस्त परिवार</strong><br />
                सादर आमंत्रित करते हैं अपने सुपुत्र के शुभ पाणिग्रहण संस्कार में
              </p>

              <h2 className="font-['Marcellus'] text-xl sm:text-2xl font-bold tracking-[0.16em]">
                <span className="text-[#7A1522] block">ABHISHEK</span>
                <span className="block font-['Alex_Brush'] text-xl sm:text-2xl font-normal text-[#8C5A14] lowercase my-0.5">
                  weds
                </span>
                <span className="text-[#7A1522] block">ISHITA</span>
              </h2>

              <p className="font-['Noto_Serif_Devanagari'] text-xs font-bold text-[#8C5A14]">
                ॥ अभिषेक संग इशिता ॥
              </p>

              {/* The Two Key Ceremonies Box (In English with Hyperlinks) */}
              <div className="bg-white/85 backdrop-blur-[2px] rounded-lg border border-[#D8CBB7] py-2 px-3 w-full max-w-xs mx-auto space-y-2 shadow-xs text-left text-xs font-['Inter_Tight']">
                <div className="border-b border-[#E8DCCB] pb-1.5 space-y-0.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#A36006] font-['Marcellus'] text-[11px] uppercase tracking-wide">
                      1. Ring Ceremony & Lunch
                    </span>
                    <span className="text-[10px] font-bold text-[#1A1008] bg-[#FAF3E3] px-1.5 py-0.5 rounded border border-[#A36006]/30">
                      5 Dec 2026
                    </span>
                  </div>
                  <p className="text-[10.5px] text-[#2C1F15]">
                    • 11:00 AM Ceremony | 01:00 PM Lunch
                  </p>
                  <a
                    href="https://maps.app.goo.gl/mrv1ZjPQXxpvmBDL6"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-[10.5px] font-bold text-[#7A1522] hover:underline"
                  >
                    <MapPin className="w-3 h-3 text-[#A36006]" />
                    <span>Venue: Mannat Vatika Farm (Google Maps)</span>
                    <ExternalLink className="w-2.5 h-2.5 text-[#A36006]" />
                  </a>
                </div>
                <div className="space-y-0.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#7A1522] font-['Marcellus'] text-[11px] uppercase tracking-wide">
                      2. Barat Departure & Wedding
                    </span>
                    <span className="text-[10px] font-bold text-[#1A1008] bg-[#FAF3E3] px-1.5 py-0.5 rounded border border-[#7A1522]/30">
                      12 Dec 2026
                    </span>
                  </div>
                  <p className="text-[10.5px] text-[#2C1F15]">
                    • 10:00 AM Sehra Bandi | 11:00 AM Barat
                  </p>
                  <a
                    href="https://maps.app.goo.gl/rCGKCJWhjcMhXcaC8"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-[10.5px] font-bold text-[#7A1522] hover:underline"
                  >
                    <MapPin className="w-3 h-3 text-[#7A1522]" />
                    <span>Venue: Green Lounge North Banquet (Google Maps)</span>
                    <ExternalLink className="w-2.5 h-2.5 text-[#7A1522]" />
                  </a>
                </div>
              </div>

              <div className="py-0.5">
                <WaxSeal size={48} useGanesha={true} color="#8C1E2B" />
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="py-1 px-3.5 bg-[#7A1522] hover:bg-[#630E19] text-[#FAF6ED] text-[10px] font-['Marcellus'] tracking-[0.14em] uppercase rounded-full border border-[#9E3341] shadow transition-transform hover:scale-105 cursor-pointer"
              >
                Ring Ceremony Details →
              </button>
            </div>

            <div className="relative flex justify-between text-[9.5px] sm:text-[10px] font-['Marcellus'] text-[#7A5826] font-semibold pt-1.5 border-t border-[#D9CDB8]">
              <span>Shri Vedprakash</span>
              <span>Page 2</span>
            </div>
          </div>
        );

      // PAGE 4 (Spread 1 - Left): EVENT 1 — RING CEREMONY & LUNCH (5th Dec)
      case 2:
        return (
          <div className="page-surface flex flex-col justify-between p-4 sm:p-7 md:p-8">
            <div className="absolute inset-2.5 sm:inset-3 border border-[#B38A24]/60 pointer-events-none rounded-sm" />

            <div className="relative text-center space-y-2.5">
              <div>
                <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-[#A36006] font-['Marcellus'] block">
                  Event 1 • 5th December 2026
                </span>
                <h3 className="font-['Marcellus'] text-xl sm:text-2xl font-bold text-[#1A1008] tracking-wide mt-0.5">
                  Ring Ceremony & Preeti Bhoj
                </h3>
                <p className="font-['Noto_Serif_Devanagari'] text-xs font-bold text-[#7A1522]">
                  ॥ सगाई एवं मुद्रिका संस्कार महोत्सव ॥
                </p>
              </div>

              {/* Venue Card with Direct Google Maps Link */}
              <div className="p-2.5 bg-white/80 backdrop-blur-[2px] border border-[#D8CBB7] rounded-lg space-y-1 text-xs font-['Inter_Tight'] shadow-xs text-center">
                <div className="flex items-center justify-center gap-1.5 text-[#A36006] font-bold font-['Marcellus'] text-xs sm:text-sm">
                  <MapPin className="w-4 h-4 text-[#7A1522] shrink-0" />
                  <span>मन्नत वाटिका फार्म (Mannat Vatika Farm)</span>
                </div>
                <p className="text-[#1A1008] text-[11px] leading-snug">
                  An auspicious morning celebration of eternal vows, family blessings, and festive royal lunch.
                </p>
                <div className="pt-1 flex justify-center">
                  <a
                    href="https://maps.app.goo.gl/mrv1ZjPQXxpvmBDL6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 py-1 px-3 bg-[#7A1522] hover:bg-[#94192B] text-[#FAF6ED] rounded-full text-[10px] font-['Marcellus'] font-bold uppercase tracking-wider transition-all shadow-xs"
                  >
                    <MapPin className="w-3 h-3 text-[#FFE8B6]" />
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>

              {/* Exact Timings required by user */}
              <div className="space-y-1.5 text-xs text-[#1A1008] font-['Inter_Tight'] font-medium">
                <div className="flex items-center justify-between p-2 rounded bg-white/70 border border-[#D8CBB7]">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#7A1522]" />
                    <span className="font-semibold">Ring Ceremony (मुद्रिका संस्कार)</span>
                  </div>
                  <span className="font-bold text-[#7A1522] font-['Marcellus']">11:00 AM</span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-white/70 border border-[#D8CBB7]">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#A36006]" />
                    <span className="font-semibold">Preeti Bhoj / Lunch (प्रीतिभोज)</span>
                  </div>
                  <span className="font-bold text-[#A36006] font-['Marcellus']">01:00 PM</span>
                </div>
              </div>

              <div className="p-2 bg-white/60 backdrop-blur-[2px] rounded border border-[#E0D4C1] shadow-xs text-center">
                <p className="text-[10.5px] italic font-['Cormorant_Garamond'] text-[#1A1008] font-semibold">
                  Attire: Auspicious Gold, Festive Peach, Pastels & Traditional Ethnic.
                </p>
              </div>
            </div>

            <div className="relative flex justify-between text-[9.5px] sm:text-[10px] font-['Marcellus'] text-[#7A5826] font-semibold pt-1.5 border-t border-[#D9CDB8]">
              <span>Page 3</span>
              <span>5 Dec • Mannat Vatika</span>
            </div>
          </div>
        );

      // PAGE 4 (Spread 1 - Right): EVENT 2 — BARAT & SHUBH VIVAH (12th Dec)
      case 3:
        return (
          <div className="page-surface flex flex-col justify-between p-4 sm:p-7 md:p-8">
            <div className="absolute inset-2.5 sm:inset-3 border border-[#B38A24]/60 pointer-events-none rounded-sm" />

            <div className="relative text-center space-y-2.5">
              <div>
                <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-[#7A1522] font-['Marcellus'] block">
                  Event 2 • 12th December 2026
                </span>
                <h3 className="font-['Marcellus'] text-xl sm:text-2xl font-bold text-[#1A1008] tracking-wide mt-0.5">
                  Barat & Shubh Vivah
                </h3>
                <p className="font-['Noto_Serif_Devanagari'] text-xs font-bold text-[#8C121E]">
                  ॥ सेहरा बंदी, बारात प्रस्थान एवं पाणिग्रहण संस्कार ॥
                </p>
              </div>

              {/* Venue Card with Direct Google Maps Link */}
              <div className="p-2.5 bg-white/80 backdrop-blur-[2px] border border-[#D8CBB7] rounded-lg space-y-1 text-xs font-['Inter_Tight'] shadow-xs text-center">
                <div className="flex items-center justify-center gap-1.5 text-[#7A1522] font-bold font-['Marcellus'] text-xs sm:text-sm">
                  <MapPin className="w-4 h-4 text-[#8C121E] shrink-0" />
                  <span>ग्रीन लाउंज नॉर्थ बैंक्वेट (Green Lounge North Banquet)</span>
                </div>
                <p className="text-[#1A1008] text-[11px] leading-snug">
                  The auspicious wedding celebrations, grand reception, and the seven sacred vows of companionship.
                </p>
                <div className="pt-1 flex justify-center">
                  <a
                    href="https://maps.app.goo.gl/rCGKCJWhjcMhXcaC8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 py-1 px-3 bg-[#7A1522] hover:bg-[#94192B] text-[#FAF6ED] rounded-full text-[10px] font-['Marcellus'] font-bold uppercase tracking-wider transition-all shadow-xs"
                  >
                    <MapPin className="w-3 h-3 text-[#FFE8B6]" />
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>

              {/* Exact Timings requested by user */}
              <div className="space-y-1.5 text-xs text-[#1A1008] font-['Inter_Tight'] font-medium">
                <div className="p-2 rounded bg-white/70 border border-[#D8CBB7] space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1A1008]">Sehra Bandi (सेहरा बंदी)</span>
                    <span className="font-bold text-[#7A1522] font-['Marcellus']">10:00 AM</span>
                  </div>
                  <span className="text-[10px] text-[#7A5826] block">
                    स्थान: 44/24, गली नं ३, भीम कॉलोनी, बख्तावरपुर (निवास स्थान)
                  </span>
                </div>

                <div className="p-2 rounded bg-white/70 border border-[#D8CBB7] space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1A1008]">Departure of Barat (बारात प्रस्थान)</span>
                    <span className="font-bold text-[#7A1522] font-['Marcellus']">11:00 AM</span>
                  </div>
                  <span className="text-[10px] text-[#7A5826] block">
                    प्रस्थान: निवास स्थान से ग्रीन लाउंज नॉर्थ बैंक्वेट की ओर
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-white/70 border border-[#D8CBB7]">
                  <span className="font-semibold text-[#1A1008]">Swagat & Shubh Vivah (स्वागत एवं प्रीतिभोज)</span>
                  <span className="font-bold text-[#7A1522] font-['Marcellus']">01:00 PM Onward</span>
                </div>
              </div>
            </div>

            <div className="relative flex justify-between text-[9.5px] sm:text-[10px] font-['Marcellus'] text-[#7A5826] font-semibold pt-1.5 border-t border-[#D9CDB8]">
              <span>12 Dec • Green Lounge Banquet</span>
              <span>Page 4</span>
            </div>
          </div>
        );

      // PAGE 5 (Spread 2 - Left): VENUES & GOOGLE MAPS DIRECTORY
      case 4:
        return (
          <div className="page-surface flex flex-col justify-between p-4 sm:p-7 md:p-8">
            <div className="absolute inset-2.5 sm:inset-3 border border-[#B38A24]/60 pointer-events-none rounded-sm" />

            <div className="relative text-center space-y-2">
              <div>
                <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-[#8C5A14] font-['Marcellus'] block">
                  Location Directory
                </span>
                <h3 className="font-['Marcellus'] text-xl sm:text-2xl font-bold text-[#1A1008] tracking-wide mt-0.5">
                  Venues & Google Maps
                </h3>
                <p className="font-['Noto_Serif_Devanagari'] text-xs text-[#7A1522] font-semibold">
                  ॥ विवाह समारोह स्थल निर्देशिका ॥
                </p>
              </div>

              <div className="space-y-2 text-xs font-['Inter_Tight']">
                {/* Location 1: Mannat Vatika Farm */}
                <div className="p-2.5 bg-white/85 backdrop-blur-[2px] rounded-lg border border-[#D8CBB7] shadow-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#A36006] font-['Marcellus'] text-xs">
                      1. मन्नत वाटिका फार्म (Mannat Vatika)
                    </span>
                    <span className="text-[10px] font-bold bg-[#FAF3E3] text-[#A36006] px-1.5 py-0.5 rounded border border-[#D4AF37]/50">
                      5 DEC • सगाई
                    </span>
                  </div>
                  <p className="text-[10.5px] text-[#2C1F15]">
                    Ring Ceremony (11:00 AM) & Preeti Bhoj Lunch (1:00 PM)
                  </p>
                  <a
                    href="https://maps.app.goo.gl/mrv1ZjPQXxpvmBDL6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10.5px] font-bold text-[#7A1522] hover:underline pt-0.5"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#7A1522]" />
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                {/* Location 2: Green Lounge North Banquet */}
                <div className="p-2.5 bg-white/85 backdrop-blur-[2px] rounded-lg border border-[#D8CBB7] shadow-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#7A1522] font-['Marcellus'] text-xs">
                      2. ग्रीन लाउंज नॉर्थ बैंक्वेट (Green Lounge)
                    </span>
                    <span className="text-[10px] font-bold bg-[#FBF0F2] text-[#7A1522] px-1.5 py-0.5 rounded border border-[#7A1522]/30">
                      12 DEC • बारात & विवाह
                    </span>
                  </div>
                  <p className="text-[10.5px] text-[#2C1F15]">
                    Swagat, Varmala & Grand Reception (01:00 PM Onward)
                  </p>
                  <a
                    href="https://maps.app.goo.gl/rCGKCJWhjcMhXcaC8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10.5px] font-bold text-[#7A1522] hover:underline pt-0.5"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#7A1522]" />
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>

                {/* Location 3: Residence / Nivas */}
                <div className="p-2.5 bg-white/85 backdrop-blur-[2px] rounded-lg border border-[#D8CBB7] shadow-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#2A1F18] font-['Marcellus'] text-xs">
                      3. निवास स्थान (Family Residence)
                    </span>
                    <span className="text-[10px] font-bold bg-[#FAF5EB] text-[#7A5826] px-1.5 py-0.5 rounded border border-[#D4AF37]/50">
                      12 DEC 10:00 AM • सेहरा बंदी
                    </span>
                  </div>
                  <p className="text-[10.5px] text-[#2C1F15]">
                    44/24, गली नं ३, भीम कॉलोनी, बख्तावरपुर, दिल्ली - 110036
                  </p>
                  <a
                    href={HOST_DETAILS.residenceMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10.5px] font-bold text-[#7A1522] hover:underline pt-0.5"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#7A1522]" />
                    <span>Open Residence in Google Maps</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="relative flex justify-between text-[9.5px] sm:text-[10px] font-['Marcellus'] text-[#7A5826] font-semibold pt-1.5 border-t border-[#D9CDB8]">
              <span>Page 5</span>
              <span>Location Directory</span>
            </div>
          </div>
        );

      // PAGE 6 (Spread 2 - Right): Sacred Saat Phere & Blessings
      case 5:
        return (
          <div className="page-surface flex flex-col justify-between p-4 sm:p-7 md:p-8">
            <div className="absolute inset-2.5 sm:inset-3 border border-[#B38A24]/60 pointer-events-none rounded-sm" />

            <div className="relative text-center space-y-2.5">
              <div>
                <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-[#7A1522] font-['Marcellus'] block">
                  The Sacred Vows
                </span>
                <h3 className="font-['Marcellus'] text-xl sm:text-2xl font-bold text-[#1A1008] tracking-wide mt-0.5">
                  Saat Phere & Dawat
                </h3>
                <p className="font-['Noto_Serif_Devanagari'] text-xs text-[#7A1522] font-semibold">
                  ॥ पवित्र अग्नि के समक्ष सात फेरे एवं आशीर्वाद ॥
                </p>
              </div>

              <div className="space-y-1.5 text-xs font-['Inter_Tight'] text-left">
                <div className="p-2 bg-white/75 backdrop-blur-[2px] rounded-lg border border-[#D8CBB7] shadow-xs">
                  <span className="font-bold text-[#7A1522] font-['Marcellus'] block text-xs">पाणिग्रहण संस्कार</span>
                  <p className="text-[11px] text-[#1A1008] font-medium mt-0.5 leading-snug">
                    अग्नि, ब्राह्मण एवं पूज्य गुरुजनों की साक्षी में सात जन्मों के पावन वचनों का आदान-प्रदान।
                  </p>
                </div>

                <div className="p-2 bg-white/75 backdrop-blur-[2px] rounded-lg border border-[#D8CBB7] shadow-xs">
                  <span className="font-bold text-[#7A1522] font-['Marcellus'] block text-xs">सिन्दूरदान एवं मंगलसूत्र</span>
                  <p className="text-[11px] text-[#1A1008] font-medium mt-0.5 leading-snug">
                    दांपत्य जीवन के शाश्वत प्रेम, समर्पण एवं सुरक्षा का पावन प्रतीक।
                  </p>
                </div>

                <div className="p-2 bg-white/75 backdrop-blur-[2px] rounded-lg border border-[#D8CBB7] shadow-xs">
                  <span className="font-bold text-[#7A1522] font-['Marcellus'] block text-xs">शाही प्रीतिभोज (Dawat)</span>
                  <p className="text-[11px] text-[#1A1008] font-medium mt-0.5 leading-snug">
                    पारंपरिक एवं स्वादिष्ट व्यंजनों का भव्य शाही भोज।
                  </p>
                </div>
              </div>

              <div className="p-2 bg-[#FAF5EB] border border-[#D4AF37]/60 rounded text-center">
                <p className="text-[11px] italic font-['Cormorant_Garamond'] text-[#7A1522] font-bold">
                  "वर-वधू को आपका स्नेह, सानिध्य एवं शुभाशीष ही हमारा परम उपहार है।"
                </p>
              </div>
            </div>

            <div className="relative flex justify-between text-[9.5px] sm:text-[10px] font-['Marcellus'] text-[#7A5826] font-semibold pt-1.5 border-t border-[#D9CDB8]">
              <span>Saat Phere</span>
              <span>Page 6</span>
            </div>
          </div>
        );

      // PAGE 7 (Spread 3 - Left): AUSPICIOUS WELCOME, COUNTDOWN & INVITATION
      case 6:
        return (
          <div className="page-surface flex flex-col justify-between p-4 sm:p-7 md:p-8">
            <div className="absolute inset-2.5 sm:inset-3 border border-[#B38A24]/60 pointer-events-none rounded-sm" />

            <div className="relative text-center my-auto space-y-2.5 px-1 sm:px-2">
              <GaneshaSymbol size={36} className="mx-auto drop-shadow-md" />
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase tracking-[0.26em] font-bold text-[#7A1522] font-['Marcellus'] block">
                  ॥ सादर आमंत्रण एवं स्वागत ॥
                </span>
                <h3 className="font-['Marcellus'] text-xl sm:text-2xl font-bold text-[#1A1008] tracking-wide">
                  Warm Welcome
                </h3>
              </div>

              <div className="p-2.5 bg-white/80 backdrop-blur-[2px] rounded-lg border border-[#D8CBB7] shadow-xs space-y-1.5 text-center text-xs font-['Inter_Tight']">
                <p className="font-['Cormorant_Garamond'] text-xs sm:text-sm italic text-[#1A1008] leading-relaxed font-semibold">
                  "परमपिता परमात्मा के असीम अनुग्रह एवं पूज्य बुजुर्गों के पावन आशीर्वाद से आयोजित इस मांगलिक विवाह उत्सव में आप सपरिवार सादर आमंत्रित हैं।"
                </p>
                <div className="w-16 h-[1px] bg-[#B38A24] mx-auto" />
                <p className="text-[11px] text-[#2C1F15] leading-relaxed font-medium">
                  आपकी गरिमामयी उपस्थिति एवं स्नेहपूर्ण आशीर्वाद ही वर-वधू के नव-दाम्पत्य जीवन की पावन धरोहर बनेगी।
                </p>
              </div>

              <CountdownBlock />

              <div className="p-2 bg-[#FAF5EB] rounded-lg border border-[#D4AF37]/70 text-left space-y-0.5 text-xs">
                <span className="font-bold text-[#7A1522] font-['Marcellus'] block text-xs">
                  निमंत्रक एवं स्वागतकर्ता:
                </span>
                <p className="text-[11.5px] font-bold text-[#1A1008]">
                  श्री वेदप्रकाश एवं समस्त परिवार
                </p>
                <p className="text-[10.5px] text-[#5C4533]">
                  44/24, गली नं ३, भीम कॉलोनी, बख्तावरपुर, दिल्ली - 110036
                </p>
              </div>

              <div className="p-1.5 bg-white/70 rounded border border-[#E0D4C1] text-center">
                <p className="text-[10.5px] font-['Marcellus'] text-[#7A1522] font-bold uppercase tracking-wider">
                  अभिषेक संग इशिता के पावन विवाह में आपकी प्रतीक्षा रहेगी।
                </p>
              </div>
            </div>

            <div className="relative flex justify-between text-[9.5px] sm:text-[10px] font-['Marcellus'] text-[#7A5826] font-semibold pt-1.5 border-t border-[#D9CDB8]">
              <span>Page 7</span>
              <span>॥ सादर आमंत्रण ॥</span>
            </div>
          </div>
        );

      // PAGE 8 (Spread 3 - Right): WARMEST BLESSINGS & R.S.V.P. CONTACTS
      case 7:
        return (
          <div className="page-surface flex flex-col justify-between items-center text-center p-3.5 sm:p-6 md:p-7">
            <div className="absolute inset-2 sm:inset-2.5 border border-[#B38A24]/60 pointer-events-none rounded-sm">
              <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-[#AA8222]" />
              <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-[#AA8222]" />
            </div>

            <div className="my-auto space-y-1.5 max-w-xs flex flex-col items-center w-full">
              <GaneshaSymbol size={32} className="drop-shadow-md" />
              <span className="font-['Noto_Serif_Devanagari'] text-xs sm:text-sm font-bold text-[#7A1522] block tracking-wide">
                ॥ शुभ विवाह महोत्सव ॥
              </span>

              <p className="font-['Alex_Brush'] text-xl sm:text-2xl text-[#8C5A14]">
                With folded hands & deepest love,
              </p>
              <p className="font-['Marcellus'] text-base sm:text-lg font-bold text-[#7A1522] tracking-widest">
                ABHISHEK & ISHITA
              </p>
              <p className="font-['Noto_Serif_Devanagari'] text-[11px] sm:text-xs text-[#1A1008] font-bold">
                ॥ आपका स्नेह एवं आशीर्वाद ही हमारी सबसे बड़ी पूंजी है ॥
              </p>

              {/* R.S.V.P. & Contact Numbers Card */}
              <div className="w-full p-2 sm:p-2.5 bg-white/85 backdrop-blur-[2px] rounded-lg border border-[#D4AF37] shadow-xs text-center space-y-1 my-1">
                <div className="flex items-center justify-center gap-1.5 text-[#7A1522]">
                  <Phone className="w-3 h-3 text-[#A36006]" />
                  <span className="font-['Marcellus'] text-[10.5px] sm:text-[11px] font-bold uppercase tracking-[0.18em]">
                    R.S.V.P. & Contact Numbers
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px] font-semibold text-[#1A1008] font-['Inter_Tight']">
                  <a
                    href="tel:9971006431"
                    className="p-1 rounded bg-[#FAF6EE] border border-[#E0D4C1] hover:border-[#7A1522] hover:text-[#7A1522] transition-colors flex items-center justify-center gap-1"
                  >
                    <Phone className="w-2.5 h-2.5 text-[#A36006]" />
                    <span>9971006431</span>
                  </a>
                  <a
                    href="tel:9212029424"
                    className="p-1 rounded bg-[#FAF6EE] border border-[#E0D4C1] hover:border-[#7A1522] hover:text-[#7A1522] transition-colors flex items-center justify-center gap-1"
                  >
                    <Phone className="w-2.5 h-2.5 text-[#A36006]" />
                    <span>9212029424</span>
                  </a>
                  <a
                    href="tel:9873185576"
                    className="p-1 rounded bg-[#FAF6EE] border border-[#E0D4C1] hover:border-[#7A1522] hover:text-[#7A1522] transition-colors flex items-center justify-center gap-1"
                  >
                    <Phone className="w-2.5 h-2.5 text-[#A36006]" />
                    <span>9873185576</span>
                  </a>
                  <a
                    href="tel:9560364705"
                    className="p-1 rounded bg-[#FAF6EE] border border-[#E0D4C1] hover:border-[#7A1522] hover:text-[#7A1522] transition-colors flex items-center justify-center gap-1"
                  >
                    <Phone className="w-2.5 h-2.5 text-[#A36006]" />
                    <span>9560364705</span>
                  </a>
                </div>
              </div>

              <div className="py-0.5">
                <WaxSeal size={50} useGanesha={true} color="#8C1E2B" />
              </div>

              <div className="space-y-0.5 text-[10px] sm:text-[10.5px] font-['Marcellus'] text-[#7A5826]">
                <p>5th December 2026 • Mannat Vatika Farm</p>
                <p>12th December 2026 • Green Lounge North Banquet</p>
                <p className="font-semibold text-[#1A1008]">Shri Vedprakash & Family • Bakhtawarpur, Delhi</p>
              </div>
            </div>

            <div className="pb-0.5">
              <button
                type="button"
                onClick={() => goToPage(1)}
                className="py-1 px-3.5 border-2 border-[#D4AF37] bg-[#7A1522] hover:bg-[#630E19] text-[#FAF6ED] text-[10px] font-['Marcellus'] font-bold tracking-wider uppercase rounded-full shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 hover:scale-105 active:scale-95"
              >
                <Book className="w-3 h-3 text-[#F5DE98]" />
                <span>Front Cover • मुख्य पृष्ठ</span>
              </button>
            </div>

            <div className="relative w-full flex justify-between text-[9.5px] sm:text-[10px] font-['Marcellus'] text-[#8C7A65] pt-1 border-t border-[#D9CDB8]">
              <span>Blessings</span>
              <span>Page 8</span>
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
      {isMobile && currentPage > 1 && currentPage < 10 && (
        <div className="w-full flex justify-center items-center gap-2 py-0.5 z-30">
          <button
            type="button"
            onClick={() => goToPage(currentSpread * 2 + 2)}
            className={`px-3 py-0.5 rounded-full text-[9.5px] font-['Marcellus'] font-bold tracking-wider uppercase transition-all shadow cursor-pointer ${
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
            className={`px-3 py-0.5 rounded-full text-[9.5px] font-['Marcellus'] font-bold tracking-wider uppercase transition-all shadow cursor-pointer ${
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
          disabled={currentPage >= 10}
          className={`flex absolute right-1 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 w-8 sm:w-11 h-8 sm:h-11 rounded-full border sm:border-2 border-[#D4AF37] bg-[#7A1522]/95 backdrop-blur-md text-[#FAF6ED] items-center justify-center transition-all z-40 shadow-2xl active:scale-90 ${
            currentPage >= 10
              ? 'opacity-20 pointer-events-none'
              : 'hover:scale-110 cursor-pointer hover:bg-[#94192B]'
          }`}
          aria-label="Next Page"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Outer Shadow & Padded Velvet Hardcover Frame */}
        <div
          className="relative p-1 sm:p-3 rounded-xl shadow-[0_20px_60px_rgba(15,5,8,0.75)] border-2 border-[#D4AF37]/80 bg-cover bg-center transition-all duration-500 max-w-full"
          style={{
            backgroundColor: activeVolume?.spineColor || '#5A0C16',
            backgroundImage: `radial-gradient(circle at 50% 30%, rgba(255,255,255,0.18) 0%, transparent 65%), url('${activeVolume?.coverTexture || '/assets/textures/cover_patrika.jpg'}')`,
          }}
        >
          {/* Silk Bookmark Ribbon */}
          <div
            className="bookmark-ribbon absolute -top-1.5 sm:-top-2 left-1/2 -translate-x-1/2 w-7 sm:w-8 h-8 sm:h-10 shadow-md z-40 rounded-b-sm border-t border-[#D4AF37] flex items-end justify-center pb-1 transition-colors duration-500"
            style={{ backgroundColor: activeVolume?.spineColor || '#8C1E2B' }}
          >
            <span className="text-[7.5px] sm:text-[8px] font-['Cinzel'] font-bold text-[#EEDCA2]">
              {currentPage === 1 ? 'COVER' : currentPage >= 10 ? 'END' : isMobile ? `${currentPage - 1}/8` : `${currentSpread + 1}/4`}
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
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Center Spine Crease Overlay for Double-Page Spreads */}
            {!isMobile && currentPage > 1 && currentPage < 10 && (
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
          <div className="w-full flex items-center justify-between gap-2 max-w-xs mx-auto">
            {/* Mobile Prev Button */}
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentPage <= 1}
              className={`h-9 px-3.5 rounded-full border border-[#D4AF37]/80 bg-[#7A1522] text-[#FAF6ED] flex items-center gap-1.5 text-[11px] font-['Marcellus'] font-bold uppercase shadow-lg active:scale-90 transition-all ${
                currentPage <= 1 ? 'opacity-25 pointer-events-none' : 'active:bg-[#94192B]'
              }`}
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>

            {/* Mobile Page Progress Indicator */}
            <div className="px-3.5 py-1.5 rounded-full bg-[#180307]/90 border border-[#D4AF37]/70 backdrop-blur-md shadow-md text-center">
              <span className="font-['Marcellus'] tracking-widest text-[#F5DE98] font-bold uppercase text-[10.5px]">
                {currentPage === 1
                  ? 'Cover'
                  : currentPage >= 10
                  ? 'End'
                  : `Page ${currentPage - 1} / 8`}
              </span>
            </div>

            {/* Mobile Next Button */}
            <button
              type="button"
              onClick={handleNext}
              disabled={currentPage >= 10}
              className={`h-9 px-3.5 rounded-full border border-[#D4AF37]/80 bg-[#7A1522] text-[#FAF6ED] flex items-center gap-1.5 text-[11px] font-['Marcellus'] font-bold uppercase shadow-lg active:scale-90 transition-all ${
                currentPage >= 10 ? 'opacity-25 pointer-events-none' : 'active:bg-[#94192B]'
              }`}
              aria-label="Next Page"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
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
                : currentPage >= 10
                ? 'Back Cover'
                : `Pages ${currentSpread * 2 + 1}–${currentSpread * 2 + 2} of 8`}
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

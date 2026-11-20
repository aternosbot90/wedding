import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sound } from '../utils/audio';
import { WaxSeal } from './WaxSeal';
import { RsvpForm } from './RsvpForm';
import { IndianBookVolume } from '../types/wedding';
import {
  ChevronLeft,
  ChevronRight,
  Book,
  BookOpen,
  BookMarked,
  MapPin,
  Clock,
  Heart,
  ExternalLink,
  RotateCcw,
  Volume2,
  VolumeX,
  Music,
} from 'lucide-react';

interface OpenBookProps {
  initialSpread?: number;
  activeVolume?: IndianBookVolume;
  onCloseToShelf: () => void;
  onTriggerPetals?: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const INDIAN_CHAPTERS = [
  { id: 'cover', title: 'Cover', spread: -1, page: 1, subtitle: 'Front Cover' },
  { id: 0, title: 'Patrika', spread: 0, page: 2, subtitle: 'The Invitation' },
  { id: 1, title: 'Kahani', spread: 1, page: 4, subtitle: 'Our Journey' },
  { id: 2, title: 'Haldi & Mehndi', spread: 2, page: 6, subtitle: 'Day 1 • 28th Nov' },
  { id: 3, title: 'Sangeet', spread: 3, page: 8, subtitle: 'Day 2 • 29th Nov' },
  { id: 4, title: 'Saat Phere', spread: 4, page: 10, subtitle: 'Day 3 • 30th Nov' },
  { id: 5, title: 'Poshak & Rang', spread: 5, page: 12, subtitle: 'Attire & Palette' },
  { id: 6, title: 'Udaivilas', spread: 6, page: 14, subtitle: 'Travel & Stays' },
  { id: 7, title: 'RSVP', spread: 7, page: 16, subtitle: 'Confirm Attendance' },
];

const CountdownBlock: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date('2026-11-30T17:00:00+05:30').getTime();
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
    <div className="w-full bg-white/85 backdrop-blur-[2px] border border-[#D4AF37]/80 p-3 rounded-lg shadow-md">
      <span className="text-[9.5px] uppercase tracking-[0.25em] font-bold text-[#7A1522] font-['Marcellus'] block mb-1.5">
        Countdown to 30th November 2026
      </span>
      <div className="grid grid-cols-4 gap-1.5 select-none pointer-events-none">
        <div className="bg-[#FAF6ED] p-1.5 rounded border border-[#D8CBB7] shadow-inner">
          <span className="font-['Marcellus'] text-xl font-bold text-[#1A1008] block">{timeLeft.days}</span>
          <span className="text-[8px] uppercase font-['Inter_Tight'] text-[#7A5826] font-bold">Days</span>
        </div>
        <div className="bg-[#FAF6ED] p-1.5 rounded border border-[#D8CBB7] shadow-inner">
          <span className="font-['Marcellus'] text-xl font-bold text-[#1A1008] block">{timeLeft.hours}</span>
          <span className="text-[8px] uppercase font-['Inter_Tight'] text-[#7A5826] font-bold">Hours</span>
        </div>
        <div className="bg-[#FAF6ED] p-1.5 rounded border border-[#D8CBB7] shadow-inner">
          <span className="font-['Marcellus'] text-xl font-bold text-[#1A1008] block">{timeLeft.minutes}</span>
          <span className="text-[8px] uppercase font-['Inter_Tight'] text-[#7A5826] font-bold">Mins</span>
        </div>
        <div className="bg-[#FAF6ED] p-1.5 rounded border border-[#D4AF37]/80 shadow-inner">
          <span className="font-['Marcellus'] text-xl font-bold text-[#7A1522] block animate-pulse">{timeLeft.seconds}</span>
          <span className="text-[8px] uppercase font-['Inter_Tight'] text-[#7A1522] font-bold">Secs</span>
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
          className="hard royal-turn-hard-cover royal-turn-cover-front select-none"
          style={{
            backgroundColor: activeVolume?.spineColor || '#7A1522',
            backgroundImage: `radial-gradient(circle at 50% 35%, rgba(255,255,255,0.2) 0%, transparent 65%), url('${activeVolume?.coverTexture || '/assets/textures/cover_patrika.jpg'}')`,
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

          <div className="relative h-full flex flex-col justify-between items-center text-center p-4 sm:p-6 z-10">
            <div className="pt-2 sm:pt-3 space-y-1">
              <span className="font-['Noto_Serif_Devanagari'] text-xs font-bold text-[#FFEAA7] tracking-[0.25em] block drop-shadow">
                ॥ श्री गणेशाय नमः ॥
              </span>
              <span className="font-['Marcellus'] text-[9.5px] sm:text-[10px] tracking-[0.3em] uppercase text-[#D4AF37] font-bold block">
                {activeVolume?.volumeNumber || 'HEIRLOOM VOLUME'}
              </span>
            </div>

            <div className="my-auto space-y-2.5 sm:space-y-3">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#D4AF37] mx-auto flex items-center justify-center bg-white/10 backdrop-blur-sm shadow-lg">
                <span className="font-['Marcellus'] text-xl sm:text-2xl font-bold text-[#FFF2CC] drop-shadow">
                  अ & इ
                </span>
              </div>

              <div className="space-y-1">
                <h2 className="font-['Marcellus'] text-lg sm:text-2xl font-bold text-[#FFF6E0] tracking-[0.16em] uppercase drop-shadow-md">
                  {activeVolume?.title || 'Shubh Vivah Patrika'}
                </h2>
                {activeVolume?.hindiTitle && (
                  <span className="font-['Noto_Serif_Devanagari'] text-xs font-bold text-[#FFEAA7] block">
                    {activeVolume.hindiTitle}
                  </span>
                )}
                <p className="font-['Marcellus'] text-[9.5px] sm:text-[10px] tracking-[0.22em] text-[#E5C158] uppercase">
                  {activeVolume?.subtitle || 'THE ROYAL WEDDING INVITATION'}
                </p>
              </div>

              <div className="pt-1">
                <WaxSeal size={isMobile ? 60 : 68} monogram="अ & इ" color="#8C1E2B" />
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenBook();
                  }}
                  className="py-2 px-5 sm:px-6 rounded-full bg-gradient-to-r from-[#94192B] via-[#7A1522] to-[#94192B] text-[#FAF6ED] border border-[#D4AF37] font-['Marcellus'] text-[10px] sm:text-[11px] font-bold tracking-[0.18em] uppercase shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 mx-auto"
                >
                  <span>पत्रिका खोलें • Open Book</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#F5DE98]" />
                </button>
              </div>
            </div>

            <div className="pb-2 sm:pb-3 space-y-1">
              <p className="font-['Marcellus'] text-[9.5px] sm:text-[10px] tracking-widest uppercase text-[#FFF2CC] font-semibold">
                THE OBEROI UDAIVILAS • UDAIPUR
              </p>
              <span className="text-[9px] font-['Marcellus'] text-[#E5C158] tracking-wider animate-pulse block">
                (Tap button or drag corner to turn)
              </span>
            </div>
          </div>
        </div>

        {/* PAGES 2 TO 17: THE 16 CEREMONY PAGES */}
        {Array.from({ length: 16 }).map((_, idx) => (
          <div key={idx} className="turn-page-sheet select-none">
            {renderPage(idx)}
          </div>
        ))}

        {/* PAGE 18: HARD BACK COVER */}
        <div
          className="hard royal-turn-hard-cover royal-turn-cover-back select-none"
          style={{
            backgroundColor: activeVolume?.spineColor || '#7A1522',
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 65%), url('${activeVolume?.coverTexture || '/assets/textures/cover_patrika.jpg'}')`,
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

          <div className="relative h-full flex flex-col justify-between items-center text-center p-4 sm:p-6 z-10">
            <div className="pt-3">
              <span className="font-['Noto_Serif_Devanagari'] text-xs font-bold text-[#FFEAA7] tracking-[0.25em] block drop-shadow">
                ॥ शुभम भवतु ॥
              </span>
            </div>

            <div className="my-auto space-y-3 max-w-[280px]">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[#D4AF37] mx-auto flex items-center justify-center bg-white/10 backdrop-blur-sm shadow-md">
                <span className="text-xl text-[#FFEAA7]">⚜</span>
              </div>

              <p className="font-['Cormorant_Garamond'] text-xs sm:text-sm italic text-[#FFF6E0] leading-relaxed">
                "May the bond of marriage bring endless joy, prosperity, and eternal companionship."
              </p>

              <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />

              <p className="font-['Marcellus'] text-xs font-bold text-[#FFEAA7] tracking-wider uppercase">
                Abhishek & Ishita
              </p>
              <span className="text-[9.5px] sm:text-[10px] text-[#E5C158] font-['Marcellus'] tracking-widest block">
                28 • 29 • 30 NOVEMBER 2026
              </span>
            </div>

            <div className="pb-3 flex gap-2 justify-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onGoToFrontCover();
                }}
                className="py-1.5 px-3.5 rounded-full bg-[#7A1522] border border-[#D4AF37] text-[9.5px] sm:text-[10px] font-['Marcellus'] font-bold text-[#FFEAA7] tracking-wider uppercase hover:bg-[#94192B] transition-colors cursor-pointer"
              >
                Front Cover
              </button>
              <button
                type="button"
                onClick={onCloseToShelf}
                className="py-1.5 px-3.5 rounded-full bg-[#1A0B0E]/80 border border-[#D4AF37] text-[9.5px] sm:text-[10px] font-['Marcellus'] font-bold text-[#FFEAA7] tracking-wider uppercase hover:bg-[#7A1522] transition-colors cursor-pointer"
              >
                Return to Shelf
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },
  // Custom equality comparison: NEVER re-render when pages turn!
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
  const [activePaletteIndex, setActivePaletteIndex] = useState(0);
  const [isMusicOn, setIsMusicOn] = useState(sound.getMusicPlaying());
  const flipbookRef = useRef<HTMLDivElement>(null);

  // Mobile viewport state
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [mobileSide, setMobileSide] = useState<'left' | 'right'>('left');

  // Mobile Touch Swipe Handling
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize Turn.js Flipbook Engine (matching book-effect/turn.js)
  useEffect(() => {
    const $ = (window as any).$ || (window as any).jQuery;
    if (!$ || !flipbookRef.current) return;

    const $book = $(flipbookRef.current);
    const isMob = window.innerWidth < 768;
    const width = isMob ? Math.min(window.innerWidth - 24, 420) : Math.min(window.innerWidth - 60, 940);
    const height = isMob ? Math.min(window.innerHeight - 190, 620) : 620;
    const startPage = (initialSpread * 2) + 2;

    try {
      $book.turn({
        width,
        height,
        autoCenter: true,
        display: isMob ? 'single' : 'double',
        acceleration: true,
        gradients: true,
        elevation: 50,
        duration: 650,
        cornerSize: isMob ? 180 : 120,
        page: startPage,
        when: {
          turning: (_e: any, _page: number, _view: any) => {
            sound.playPageFlip();
          },
          turned: (_e: any, page: number, _view: any) => {
            setCurrentPage(page);
            if (page === 1) {
              setCurrentSpread(0);
              setMobileSide('left');
            } else if (page >= 2 && page <= 17) {
              const spread = Math.floor((page - 2) / 2);
              setCurrentSpread(spread);
              setMobileSide(page % 2 === 1 ? 'right' : 'left');
            } else if (page >= 18) {
              setCurrentSpread(7);
              setMobileSide('right');
            }
          },
        },
      });
    } catch (e) {
      console.warn('Turn.js initialization error:', e);
    }

    const handleWindowResize = () => {
      const mob = window.innerWidth < 768;
      try {
        const w = mob ? Math.min(window.innerWidth - 24, 420) : Math.min(window.innerWidth - 60, 940);
        const h = mob ? Math.min(window.innerHeight - 190, 620) : 620;
        $book.turn('size', w, h);
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
        onCloseToShelf();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Page Content Renderer
  const renderPage = (pageNum: number) => {
    switch (pageNum) {
      // SPREAD 0 - LEFT: Auspicious Shlokas & Monogram
      case 0:
        return (
          <div className="page-surface flex flex-col justify-between p-7 sm:p-9">
            <div className="absolute inset-3 border border-[#B38A24]/60 pointer-events-none rounded-sm">
              <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-[#AA8222]" />
              <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-[#AA8222]" />
            </div>

            <div className="relative text-center my-auto space-y-3 px-2">
              <span className="font-['Noto_Serif_Devanagari'] text-base font-bold text-[#7A1522] tracking-widest block drop-shadow-sm">
                ॥ श्री गणेशाय नमः ॥
              </span>

              <div className="w-16 h-16 rounded-full border-2 border-[#B38A24] mx-auto flex items-center justify-center bg-white/80 shadow-[0_4px_16px_rgba(180,140,50,0.25)]">
                <span className="font-['Marcellus'] text-2xl font-bold text-[#7A1522]">अ & इ</span>
              </div>

              <div className="p-2.5 bg-white/60 backdrop-blur-[2px] rounded-lg border border-[#E0D4C1] shadow-xs">
                <p className="font-['Noto_Serif_Devanagari'] text-xs sm:text-sm font-semibold text-[#1A1008] leading-relaxed italic">
                  वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।<br />
                  निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥
                </p>
              </div>

              <div className="w-20 h-[1.5px] bg-[#B38A24] mx-auto my-1" />

              <div className="p-3 bg-white/65 backdrop-blur-[2px] rounded-lg border-l-2 border-[#7A1522] shadow-xs max-w-xs mx-auto text-left">
                <p className="font-['Cormorant_Garamond'] text-sm sm:text-base italic text-[#1A1008] leading-relaxed font-medium">
                  "With the divine blessings of our beloved elders and the grace of the Almighty, we invite you to grace our wedding celebrations."
                </p>
              </div>

              <p className="font-['Noto_Serif_Devanagari'] text-[11px] text-[#8C5A14] font-semibold">
                मङ्गलम् भगवान विष्णुः मङ्गलम् गरुडध्वजः।<br />
                मङ्गलम् पुण्डरीकाक्षः मङ्गलाय तनो हरिः॥
              </p>
            </div>

            <div className="relative flex justify-between text-[10px] font-['Marcellus'] text-[#7A5826] font-semibold pt-2 border-t border-[#D9CDB8]">
              <span>Page 1</span>
              <span>॥ शुभ विवाह ॥</span>
            </div>
          </div>
        );

      // SPREAD 0 - RIGHT: Royal Patrika Invitation
      case 1:
        return (
          <div className="page-surface flex flex-col justify-between p-7 sm:p-9">
            <div className="absolute inset-3 border border-[#B38A24]/60 pointer-events-none rounded-sm">
              <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-[#AA8222]" />
              <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-[#AA8222]" />
            </div>

            <div className="relative text-center my-auto space-y-2.5 px-2">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#7A1522] font-['Marcellus'] block">
                ॥ शुभ विवाह पत्रिका ॥
              </span>

              <p className="font-['Cormorant_Garamond'] text-xs sm:text-sm italic text-[#1A1008] leading-snug font-medium">
                With the heavenly blessings of Late Smt. Shanti Devi & Shri Ramswaroop Sharma,<br />
                Mrs. Sunita & Mr. Rajesh Sharma cordially invite you to celebrate the wedding of their son
              </p>

              <h2 className="font-['Marcellus'] text-2xl sm:text-3xl font-bold tracking-[0.16em]">
                <span className="text-[#7A1522] block">ABHISHEK</span>
                <span className="block font-['Alex_Brush'] text-2xl sm:text-3xl font-normal text-[#8C5A14] lowercase my-0.5">
                  weds
                </span>
                <span className="text-[#7A1522] block">ISHITA</span>
              </h2>

              <p className="font-['Cormorant_Garamond'] text-xs sm:text-sm italic text-[#1A1008] leading-snug font-medium">
                Daughter of Mrs. Meenakshi & Mr. Alok Verma<br />
                (Granddaughter of Late Smt. Kamla Devi & Shri Premchand Verma)
              </p>

              <div className="bg-white/70 backdrop-blur-[2px] rounded border border-[#D8CBB7] py-2 px-3 w-full max-w-xs mx-auto space-y-0.5 shadow-xs">
                <p className="font-['Marcellus'] text-xs sm:text-sm font-bold tracking-wider text-[#1A1008]">
                  28TH • 29TH • 30TH NOVEMBER 2026
                </p>
                <p className="font-['Inter_Tight'] text-[10px] uppercase tracking-widest text-[#7A1522] font-bold">
                  THE OBEROI UDAIVILAS • UDAIPUR, RAJASTHAN
                </p>
              </div>

              <div className="py-1">
                <WaxSeal size={52} monogram="अ & इ" color="#8C1E2B" />
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="mt-1 py-1.5 px-4 bg-[#7A1522] hover:bg-[#630E19] text-[#FAF6ED] text-[10.5px] font-['Marcellus'] tracking-[0.16em] uppercase rounded-full border border-[#9E3341] shadow transition-transform hover:scale-105 cursor-pointer"
              >
                Turn Page to Hamari Kahani →
              </button>
            </div>

            <div className="relative flex justify-between text-[10px] font-['Marcellus'] text-[#7A5826] font-semibold pt-2 border-t border-[#D9CDB8]">
              <span>Abhishek weds Ishita</span>
              <span>Page 2</span>
            </div>
          </div>
        );

      // SPREAD 1 - LEFT: Our Story Timeline
      case 2:
        return (
          <div className="page-surface flex flex-col justify-between p-7 sm:p-9">
            <div className="absolute inset-3 border border-[#B38A24]/60 pointer-events-none rounded-sm" />

            <div className="relative text-left space-y-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-[#8C5A14] font-['Marcellus'] block">
                  Chapter I • हमारी कहानी
                </span>
                <h3 className="font-['Marcellus'] text-2xl font-bold text-[#1A1008] tracking-wide mt-0.5">
                  The Serendipity
                </h3>
              </div>

              <div className="p-3 bg-white/65 backdrop-blur-[2px] rounded-lg border-l-2 border-[#7A1522] shadow-xs">
                <p className="font-['Cormorant_Garamond'] text-sm sm:text-base text-[#1A1008] leading-relaxed italic font-medium">
                  "Two distinct souls, an accidental cup of cutting chai at Marine Drive, and a conversation that never ended..."
                </p>
              </div>

              <div className="space-y-2.5">
                <div className="p-2.5 sm:p-3 bg-white/75 backdrop-blur-[2px] rounded-lg border border-[#D8CBB7] shadow-xs">
                  <span className="font-bold text-[#7A1522] block text-xs font-['Marcellus'] tracking-wide">
                    2019 • Mumbai Monsoon
                  </span>
                  <p className="text-[#1A1008] text-xs font-['Inter_Tight'] font-medium mt-0.5 leading-snug">
                    Debate partners who bonded over late-night chai, samosas, and endless dreams.
                  </p>
                </div>

                <div className="p-2.5 sm:p-3 bg-white/75 backdrop-blur-[2px] rounded-lg border border-[#D8CBB7] shadow-xs">
                  <span className="font-bold text-[#7A1522] block text-xs font-['Marcellus'] tracking-wide">
                    2022 • The Spiti Valley Expedition
                  </span>
                  <p className="text-[#1A1008] text-xs font-['Inter_Tight'] font-medium mt-0.5 leading-snug">
                    Under cold, starry Himalayan skies, Abhishek knew Ishita was his only home.
                  </p>
                </div>

                <div className="p-2.5 sm:p-3 bg-white/75 backdrop-blur-[2px] rounded-lg border border-[#D8CBB7] shadow-xs">
                  <span className="font-bold text-[#7A1522] block text-xs font-['Marcellus'] tracking-wide">
                    2025 • Sunset at Nahargarh Fort, Jaipur
                  </span>
                  <p className="text-[#1A1008] text-xs font-['Inter_Tight'] font-medium mt-0.5 leading-snug">
                    As twilight wrapped Jaipur in gold, Abhishek knelt with a ring, and Ishita said yes.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative flex justify-between text-[10px] font-['Marcellus'] text-[#7A5826] font-semibold pt-2 border-t border-[#D9CDB8]">
              <span>Page 3</span>
              <span>Our Story</span>
            </div>
          </div>
        );

      // SPREAD 1 - RIGHT: Polaroid Keepsake
      case 3:
        return (
          <div className="page-surface flex flex-col justify-between items-center text-center p-7 sm:p-9">
            <div className="absolute inset-3 border border-[#B38A24]/60 pointer-events-none rounded-sm" />

            <div className="my-auto w-full max-w-xs bg-white p-3.5 pt-3.5 pb-4 rounded-lg shadow-lg border border-[#D0C2AC]">
              <div className="w-full aspect-[4/3] rounded bg-gradient-to-tr from-[#421D12] via-[#853826] to-[#C97855] overflow-hidden flex items-center justify-center p-4 text-[#FAF3EA]">
                <div>
                  <Heart className="w-6 h-6 mx-auto mb-1 text-[#F2C4C4] fill-current opacity-90" />
                  <span className="font-['Marcellus'] text-xs tracking-widest block font-bold">
                    NAHARGARH FORT • JAIPUR
                  </span>
                  <span className="font-['Alex_Brush'] text-xl text-[#F9E2E2]">The Sunset Proposal</span>
                </div>
              </div>
              <p className="font-['Noto_Serif_Devanagari'] text-xs text-[#1A1008] mt-2.5 font-bold">
                "तू ही मेरी मंजिल, तू ही मेरा हमसफर..."
              </p>
            </div>

            <div className="p-2 bg-white/60 backdrop-blur-[2px] rounded border border-[#E0D4C1] max-w-xs shadow-xs">
              <p className="font-['Cormorant_Garamond'] text-xs italic text-[#1A1008] leading-snug font-medium">
                Every step, every laugh, and every quiet promise has brought us to this sacred moment in Udaipur.
              </p>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="text-[10.5px] font-['Marcellus'] tracking-wider uppercase text-[#7A1522] hover:underline font-bold cursor-pointer"
            >
              Explore Haldi & Mehndi →
            </button>

            <div className="relative w-full flex justify-between text-[10px] font-['Marcellus'] text-[#7A5826] font-semibold pt-2 border-t border-[#D9CDB8]">
              <span>Memories</span>
              <span>Page 4</span>
            </div>
          </div>
        );

      // SPREAD 2 - LEFT: Haldi Ceremony
      case 4:
        return (
          <div className="page-surface flex flex-col justify-between p-7 sm:p-9">
            <div className="absolute inset-3 border border-[#B38A24]/60 pointer-events-none rounded-sm" />

            <div className="relative text-left space-y-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-[#8C5A14] font-['Marcellus'] block">
                  Day 1 • 28th November 2026
                </span>
                <h3 className="font-['Marcellus'] text-2xl font-bold text-[#1A1008] tracking-wide mt-0.5">
                  Phoolon Ki Haldi & Peethi
                </h3>
                <p className="font-['Cormorant_Garamond'] text-xs text-[#7A1522] italic font-semibold">
                  11:00 AM • The Crescent Lawn, Udaivilas
                </p>
              </div>

              <div className="p-3 bg-white/75 backdrop-blur-[2px] border border-[#D8CBB7] rounded-lg space-y-1.5 text-xs font-['Inter_Tight'] shadow-xs">
                <div className="flex items-center gap-2 text-[#7A1522] font-bold font-['Marcellus']">
                  <MapPin className="w-3.5 h-3.5 text-[#8C5A14]" />
                  <span>Poolside Lawn overlooking Lake Pichola</span>
                </div>
                <p className="text-[#1A1008] leading-relaxed font-medium">
                  Fragrant turmeric, fresh marigold petals, live Rajasthani dholak, and joyous folk songs to bless the couple.
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-[#1A1008] font-['Inter_Tight'] font-medium">
                <div className="flex justify-between py-1.5 border-b border-[#D8CBB7]">
                  <span className="font-bold text-[#7A1522] font-['Marcellus']">11:00 AM</span>
                  <span className="font-semibold text-[#1A1008]">Auspicious Peethi Ceremony</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#D8CBB7]">
                  <span className="font-bold text-[#7A1522] font-['Marcellus']">12:30 PM</span>
                  <span className="font-semibold text-[#1A1008]">Phoolon Ki Holi (Marigold Shower)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#D8CBB7]">
                  <span className="font-bold text-[#7A1522] font-['Marcellus']">01:30 PM</span>
                  <span className="font-semibold text-[#1A1008]">Traditional Dal Baati Churma Lunch</span>
                </div>
              </div>

              <div className="p-2 bg-white/60 backdrop-blur-[2px] rounded border border-[#E0D4C1] shadow-xs">
                <p className="text-[11px] italic font-['Cormorant_Garamond'] text-[#1A1008] font-semibold">
                  Attire: Sunlit Yellows, Mustard, and Haldi Ochre.
                </p>
              </div>
            </div>

            <div className="relative flex justify-between text-[10px] font-['Marcellus'] text-[#7A5826] font-semibold pt-2 border-t border-[#D9CDB8]">
              <span>Page 5</span>
              <span>Haldi Ki Rasam</span>
            </div>
          </div>
        );

      // SPREAD 2 - RIGHT: Mehendi Ceremony
      case 5:
        return (
          <div className="page-surface flex flex-col justify-between p-7 sm:p-9">
            <div className="absolute inset-3 border border-[#B38A24]/60 pointer-events-none rounded-sm" />

            <div className="relative text-left space-y-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-[#7A1522] font-['Marcellus'] block">
                  Day 1 Evening • 28th Nov 2026
                </span>
                <h3 className="font-['Marcellus'] text-2xl font-bold text-[#1A1008] tracking-wide mt-0.5">
                  Mehendi Rachne Wali
                </h3>
                <p className="font-['Cormorant_Garamond'] text-xs text-[#7A1522] italic font-semibold">
                  05:00 PM • The Banyan Courtyard, Udaivilas
                </p>
              </div>

              <div className="p-3 bg-white/75 backdrop-blur-[2px] border border-[#D8CBB7] rounded-lg space-y-1.5 text-xs font-['Inter_Tight'] text-[#1A1008] shadow-xs">
                <p className="leading-relaxed font-medium">
                  As dusk falls over Lake Pichola, intricate henna patterns will be woven, accompanied by folk singers, custom bangles, and street chaat.
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-[#1A1008] font-['Inter_Tight'] font-medium">
                <div className="flex justify-between py-1.5 border-b border-[#D8CBB7]">
                  <span className="font-bold text-[#7A1522] font-['Marcellus']">05:00 PM</span>
                  <span className="font-semibold text-[#1A1008]">Bridal & Guest Henna Artists</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#D8CBB7]">
                  <span className="font-bold text-[#7A1522] font-['Marcellus']">06:30 PM</span>
                  <span className="font-semibold text-[#1A1008]">Live Ghoomar Folk Dance</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#D8CBB7]">
                  <span className="font-bold text-[#7A1522] font-['Marcellus']">08:00 PM</span>
                  <span className="font-semibold text-[#1A1008]">Royal Street Food & Chaat Festival</span>
                </div>
              </div>

              <div className="p-2 bg-white/60 backdrop-blur-[2px] rounded border border-[#E0D4C1] shadow-xs">
                <p className="text-[11px] italic font-['Cormorant_Garamond'] text-[#1A1008] font-semibold">
                  Attire: Festive Florals, Mint Greens, Coral & Pastel Lehengas.
                </p>
              </div>
            </div>

            <div className="relative flex justify-between text-[10px] font-['Marcellus'] text-[#7A5826] font-semibold pt-2 border-t border-[#D9CDB8]">
              <span>Mehendi</span>
              <span>Page 6</span>
            </div>
          </div>
        );

      // SPREAD 3 - LEFT: Sangeet Sandhya
      case 6:
        return (
          <div className="page-surface flex flex-col justify-between p-7 sm:p-9">
            <div className="absolute inset-3 border border-[#B38A24]/60 pointer-events-none rounded-sm" />

            <div className="relative text-left space-y-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-[#7A1522] font-['Marcellus'] block">
                  Day 2 • 29th November 2026
                </span>
                <h3 className="font-['Marcellus'] text-2xl font-bold text-[#1A1008] tracking-wide mt-0.5">
                  Sangeet Sandhya
                </h3>
                <p className="font-['Cormorant_Garamond'] text-xs text-[#7A1522] italic font-semibold">
                  07:00 PM • The Mewar Ballroom & Courtyard
                </p>
              </div>

              <div className="p-3 bg-white/75 backdrop-blur-[2px] border border-[#D8CBB7] rounded-lg space-y-1.5 text-xs font-['Inter_Tight'] shadow-xs">
                <div className="flex items-center gap-2 text-[#7A1522] font-bold font-['Marcellus']">
                  <Music className="w-3.5 h-3.5 text-[#8C5A14]" />
                  <span>An Evening of Glamour, Music & Dance</span>
                </div>
                <p className="text-[#1A1008] leading-relaxed font-medium">
                  Family dance performances, Team Groom vs. Team Bride battles, royal cocktails, and Abhishek & Ishita's special duet.
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-[#1A1008] font-['Inter_Tight'] font-medium">
                <div className="flex justify-between py-1.5 border-b border-[#D8CBB7]">
                  <span className="font-bold text-[#7A1522] font-['Marcellus']">07:00 PM</span>
                  <span className="font-semibold text-[#1A1008]">Red Carpet Welcome & Cocktails</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#D8CBB7]">
                  <span className="font-bold text-[#7A1522] font-['Marcellus']">08:00 PM</span>
                  <span className="font-semibold text-[#1A1008]">The Grand Sangeet Dance Showdown</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#D8CBB7]">
                  <span className="font-bold text-[#7A1522] font-['Marcellus']">09:30 PM</span>
                  <span className="font-semibold text-[#1A1008]">Abhishek & Ishita's Duet Performance</span>
                </div>
              </div>

              <div className="p-2 bg-white/60 backdrop-blur-[2px] rounded border border-[#E0D4C1] shadow-xs">
                <p className="text-[11px] italic font-['Cormorant_Garamond'] text-[#1A1008] font-semibold">
                  Attire: Sparkling Indo-Western, Royal Lehengas & Bandhgalas.
                </p>
              </div>
            </div>

            <div className="relative flex justify-between text-[10px] font-['Marcellus'] text-[#7A5826] font-semibold pt-2 border-t border-[#D9CDB8]">
              <span>Page 7</span>
              <span>Sangeet</span>
            </div>
          </div>
        );

      // SPREAD 3 - RIGHT: DJ Night & Starlight
      case 7:
        return (
          <div className="page-surface flex flex-col justify-between p-7 sm:p-9">
            <div className="absolute inset-3 border border-[#B38A24]/60 pointer-events-none rounded-sm" />

            <div className="relative text-left space-y-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-[#7A1522] font-['Marcellus'] block">
                  Music & Celebration
                </span>
                <h3 className="font-['Marcellus'] text-2xl font-bold text-[#1A1008] tracking-wide mt-0.5">
                  DJ Night & Starlight Lounge
                </h3>
                <p className="font-['Cormorant_Garamond'] text-xs text-[#7A1522] italic font-semibold">
                  10:30 PM Onward • Udaivilas Starlight Pier
                </p>
              </div>

              <div className="p-3 bg-white/75 backdrop-blur-[2px] border border-[#D8CBB7] rounded-lg space-y-1.5 text-xs font-['Inter_Tight'] text-[#1A1008] shadow-xs">
                <p className="leading-relaxed font-medium">
                  Featuring live percussion, Bollywood & Punjabi beats, signature mocktails, and hot jalebis with rabdi.
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-[#1A1008] font-['Inter_Tight'] font-medium">
                <div className="flex justify-between py-1.5 border-b border-[#D8CBB7]">
                  <span className="font-bold text-[#7A1522] font-['Marcellus']">10:30 PM</span>
                  <span className="font-semibold text-[#1A1008]">DJ Beats & Live Dholak</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#D8CBB7]">
                  <span className="font-bold text-[#7A1522] font-['Marcellus']">12:00 AM</span>
                  <span className="font-semibold text-[#1A1008]">Midnight Chaat & Kulfi Bar</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="mt-2 text-[10.5px] font-['Marcellus'] tracking-wider uppercase text-[#7A1522] hover:underline font-bold cursor-pointer"
              >
                The Sacred Vivah & Saat Phere →
              </button>
            </div>

            <div className="relative flex justify-between text-[10px] font-['Marcellus'] text-[#7A5826] font-semibold pt-2 border-t border-[#D9CDB8]">
              <span>Bollywood Night</span>
              <span>Page 8</span>
            </div>
          </div>
        );

      // SPREAD 4 - LEFT: Baraat & Jaimala
      case 8:
        return (
          <div className="page-surface flex flex-col justify-between p-7 sm:p-9">
            <div className="absolute inset-3 border border-[#B38A24]/60 pointer-events-none rounded-sm" />

            <div className="relative text-left space-y-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-[#7A1522] font-['Marcellus'] block">
                  Day 3 • 30th November 2026
                </span>
                <h3 className="font-['Marcellus'] text-2xl font-bold text-[#1A1008] tracking-wide mt-0.5">
                  Baraat & Jaimala
                </h3>
                <p className="font-['Cormorant_Garamond'] text-xs text-[#7A1522] italic font-semibold">
                  04:00 PM Onward • Lake Pichola Promenade
                </p>
              </div>

              <div className="space-y-2 text-xs font-['Inter_Tight']">
                <div className="p-2.5 bg-white/75 backdrop-blur-[2px] rounded-lg border border-[#D8CBB7] shadow-xs flex gap-2.5 items-start">
                  <span className="font-['Marcellus'] font-bold text-[#7A1522] w-14 shrink-0 text-xs">04:00 PM</span>
                  <div>
                    <span className="font-bold text-[#1A1008] block">Safa Bandhai & Swagat</span>
                    <span className="text-[11px] text-[#1A1008] font-medium">Traditional turban tying for all guests.</span>
                  </div>
                </div>

                <div className="p-2.5 bg-white/75 backdrop-blur-[2px] rounded-lg border border-[#D8CBB7] shadow-xs flex gap-2.5 items-start">
                  <span className="font-['Marcellus'] font-bold text-[#7A1522] w-14 shrink-0 text-xs">04:45 PM</span>
                  <div>
                    <span className="font-bold text-[#1A1008] block">The Royal Baraat Procession</span>
                    <span className="text-[11px] text-[#1A1008] font-medium">Vintage royal buggy, Punjabi dhol, and dancing.</span>
                  </div>
                </div>

                <div className="p-2.5 bg-white/75 backdrop-blur-[2px] rounded-lg border border-[#D8CBB7] shadow-xs flex gap-2.5 items-start">
                  <span className="font-['Marcellus'] font-bold text-[#7A1522] w-14 shrink-0 text-xs">05:45 PM</span>
                  <div>
                    <span className="font-bold text-[#1A1008] block">Jaimala Ceremony</span>
                    <span className="text-[11px] text-[#1A1008] font-medium">Exchange of floral varmalas on the lake deck at sunset.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex justify-between text-[10px] font-['Marcellus'] text-[#7A5826] font-semibold pt-2 border-t border-[#D9CDB8]">
              <span>Page 9</span>
              <span>Baraat & Jaimala</span>
            </div>
          </div>
        );

      // SPREAD 4 - RIGHT: Saat Phere & Dawat
      case 9:
        return (
          <div className="page-surface flex flex-col justify-between p-7 sm:p-9">
            <div className="absolute inset-3 border border-[#B38A24]/60 pointer-events-none rounded-sm" />

            <div className="relative text-left space-y-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-[#7A1522] font-['Marcellus'] block">
                  The Sacred Vows
                </span>
                <h3 className="font-['Marcellus'] text-2xl font-bold text-[#1A1008] tracking-wide mt-0.5">
                  Saat Phere & Royal Dawat
                </h3>
                <p className="font-['Cormorant_Garamond'] text-xs text-[#7A1522] italic font-semibold">
                  06:45 PM • The Central Mandap, Udaivilas
                </p>
              </div>

              <div className="space-y-2 text-xs font-['Inter_Tight']">
                <div className="p-2.5 bg-white/75 backdrop-blur-[2px] rounded-lg border border-[#D8CBB7] shadow-xs flex gap-2.5 items-start">
                  <span className="font-['Marcellus'] font-bold text-[#7A1522] w-14 shrink-0 text-xs">06:45 PM</span>
                  <div>
                    <span className="font-bold text-[#1A1008] block">Saat Phere around Sacred Agni</span>
                    <span className="text-[11px] text-[#1A1008] font-medium">Seven sacred vows of lifelong companionship.</span>
                  </div>
                </div>

                <div className="p-2.5 bg-white/75 backdrop-blur-[2px] rounded-lg border border-[#D8CBB7] shadow-xs flex gap-2.5 items-start">
                  <span className="font-['Marcellus'] font-bold text-[#7A1522] w-14 shrink-0 text-xs">07:45 PM</span>
                  <div>
                    <span className="font-bold text-[#1A1008] block">Sindoordaan & Mangalsutra</span>
                    <span className="text-[11px] text-[#1A1008] font-medium">The auspicious sealing of the marriage bond.</span>
                  </div>
                </div>

                <div className="p-2.5 bg-white/75 backdrop-blur-[2px] rounded-lg border border-[#D8CBB7] shadow-xs flex gap-2.5 items-start">
                  <span className="font-['Marcellus'] font-bold text-[#7A1522] w-14 shrink-0 text-xs">08:30 PM</span>
                  <div>
                    <span className="font-bold text-[#1A1008] block">The Royal Wedding Banquet (Dawat)</span>
                    <span className="text-[11px] text-[#1A1008] font-medium">Grand feast of Rajasthani & Awadhi royal delicacies.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex justify-between text-[10px] font-['Marcellus'] text-[#7A5826] font-semibold pt-2 border-t border-[#D9CDB8]">
              <span>Saat Phere</span>
              <span>Page 10</span>
            </div>
          </div>
        );

      // SPREAD 5 - LEFT: Poshak Guidance
      case 10:
        return (
          <div className="page-surface flex flex-col justify-between p-7 sm:p-9">
            <div className="absolute inset-3 border border-[#B38A24]/60 pointer-events-none rounded-sm" />

            <div className="relative text-left space-y-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-[#8C5A14] font-['Marcellus'] block">
                  Poshak Nirdeshika
                </span>
                <h3 className="font-['Marcellus'] text-2xl font-bold text-[#1A1008] tracking-wide mt-0.5">
                  Royal Festive Attire
                </h3>
                <p className="font-['Cormorant_Garamond'] text-xs text-[#7A1522] italic font-semibold">
                  Ceremonial Guidance for our Honored Guests
                </p>
              </div>

              <div className="space-y-2.5 text-xs font-['Inter_Tight']">
                <div className="bg-white/80 backdrop-blur-[2px] p-3 rounded-lg border border-[#D8CBB7] shadow-xs">
                  <span className="font-bold text-[#7A1522] font-['Marcellus'] block mb-0.5 text-xs">
                    For the Ladies
                  </span>
                  <p className="leading-relaxed text-[#1A1008] font-medium">
                    Opulent Lehengas, Banarasi & Kanjivaram Sarees, or Designer Anarkalis with heritage jhumkas and potlis.
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-[2px] p-3 rounded-lg border border-[#D8CBB7] shadow-xs">
                  <span className="font-bold text-[#7A1522] font-['Marcellus'] block mb-0.5 text-xs">
                    For the Gentlemen
                  </span>
                  <p className="leading-relaxed text-[#1A1008] font-medium">
                    Classic Achkans, Royal Sherwanis, Bandhgalas, or Silk Kurta-Pyjamas paired with mojaris.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative flex justify-between text-[10px] font-['Marcellus'] text-[#7A5826] font-semibold pt-2 border-t border-[#D9CDB8]">
              <span>Page 11</span>
              <span>Poshak</span>
            </div>
          </div>
        );

      // SPREAD 5 - RIGHT: Royal Palette
      case 11:
        return (
          <div className="page-surface flex flex-col justify-between p-7 sm:p-9">
            <div className="absolute inset-3 border border-[#B38A24]/60 pointer-events-none rounded-sm" />

            <div className="relative text-left space-y-2.5">
              <div>
                <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-[#8C5A14] font-['Marcellus'] block">
                  Celebration Colors
                </span>
                <h3 className="font-['Marcellus'] text-2xl font-bold text-[#1A1008] tracking-wide mt-0.5">
                  The Royal Palette
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {[
                  { name: 'Sindoor Crimson', hex: '#8C1E2B', note: 'Sacred wedding kumkum' },
                  { name: 'Marigold Gold', hex: '#E6A119', note: 'Auspicious festive genda' },
                  { name: 'Peacock Emerald', hex: '#0F4D3C', note: 'Mewar royal velvet' },
                  { name: 'Zari Antique Gold', hex: '#CBA24B', note: 'Pure zardozi shimmer' },
                ].map((s, idx) => (
                  <div
                    key={s.name}
                    onClick={() => setActivePaletteIndex(idx)}
                    className="p-2.5 rounded-lg border border-[#D8CBB7] bg-white/85 backdrop-blur-[2px] flex items-center gap-2 cursor-pointer shadow-xs hover:scale-[1.02] transition-transform"
                  >
                    <div className="w-6 h-6 rounded-full border border-black/20 shrink-0 shadow-inner" style={{ backgroundColor: s.hex }} />
                    <div className="flex flex-col">
                      <span className="text-[10.5px] font-bold font-['Marcellus'] text-[#1A1008] leading-tight">{s.name}</span>
                      <span className="text-[8.5px] text-[#7A5826] font-['Inter_Tight'] font-medium">{s.note}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-white/70 backdrop-blur-[2px] rounded-lg border border-[#D8CBB7] text-xs text-[#1A1008] font-['Cormorant_Garamond'] italic font-medium shadow-xs">
                "We warmly invite our guests to embrace rich heritage jewel tones and royal pastels throughout the celebrations."
              </div>
            </div>

            <div className="relative flex justify-between text-[10px] font-['Marcellus'] text-[#7A5826] font-semibold pt-2 border-t border-[#D9CDB8]">
              <span>Color Palette</span>
              <span>Page 12</span>
            </div>
          </div>
        );

      // SPREAD 6 - LEFT: Udaivilas Heritage
      case 12:
        return (
          <div className="page-surface flex flex-col justify-between p-7 sm:p-9">
            <div className="absolute inset-3 border border-[#B38A24]/60 pointer-events-none rounded-sm" />

            <div className="relative text-left space-y-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-[#8C5A14] font-['Marcellus'] block">
                  The Venue
                </span>
                <h3 className="font-['Marcellus'] text-2xl font-bold text-[#1A1008] tracking-wide mt-0.5">
                  The Oberoi Udaivilas
                </h3>
                <p className="font-['Cormorant_Garamond'] text-xs text-[#7A1522] italic font-semibold">
                  Lake Pichola, Udaipur, Rajasthan
                </p>
              </div>

              <div className="p-3 bg-white/70 backdrop-blur-[2px] rounded-lg border-l-2 border-[#7A1522] shadow-xs">
                <p className="font-['Cormorant_Garamond'] text-xs sm:text-sm text-[#1A1008] leading-relaxed italic font-medium">
                  "Surrounded by the serene waters of Lake Pichola and the grand Aravalli hills, The Oberoi Udaivilas stands as a breathtaking tribute to the architectural heritage of Mewar."
                </p>
              </div>

              <div className="p-2.5 bg-white/75 backdrop-blur-[2px] rounded-lg border border-[#D8CBB7] shadow-xs space-y-1.5 text-xs font-['Inter_Tight'] text-[#1A1008] font-medium">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#7A1522] shrink-0 mt-0.5" />
                  <span>Direct private shikara boat transfers available from Trident Jetty</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#7A1522] shrink-0 mt-0.5" />
                  <span>Guest check-in: 12:00 PM on 28th November 2026</span>
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 py-1.5 px-3.5 border border-[#B38A24] rounded-full text-[#7A1522] bg-white/90 hover:bg-[#7A1522] hover:text-[#FAF6ED] text-[11px] font-['Marcellus'] font-bold uppercase tracking-wider transition-all shadow-xs w-fit cursor-pointer"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Open in Google Maps</span>
              </a>
            </div>

            <div className="relative flex justify-between text-[10px] font-['Marcellus'] text-[#7A5826] font-semibold pt-2 border-t border-[#D9CDB8]">
              <span>Page 13</span>
              <span>The Venue</span>
            </div>
          </div>
        );

      // SPREAD 6 - RIGHT: Stays & Airport
      case 13:
        return (
          <div className="page-surface flex flex-col justify-between p-7 sm:p-9">
            <div className="absolute inset-3 border border-[#B38A24]/60 pointer-events-none rounded-sm" />

            <div className="relative text-left space-y-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-[#8C5A14] font-['Marcellus'] block">
                  Yatra & Niwas
                </span>
                <h3 className="font-['Marcellus'] text-2xl font-bold text-[#1A1008] tracking-wide mt-0.5">
                  Guest Stays & Transfers
                </h3>
              </div>

              <div className="space-y-2 text-xs font-['Inter_Tight']">
                <div className="p-2.5 bg-white/80 backdrop-blur-[2px] rounded-lg border border-[#D8CBB7] shadow-xs">
                  <span className="font-bold text-[#7A1522] font-['Marcellus'] block text-xs">The Oberoi Udaivilas</span>
                  <span className="text-[11px] text-[#1A1008] font-medium">Primary Venue • Code: "ABHISHEK-ISHITA-26"</span>
                </div>
                <div className="p-2.5 bg-white/80 backdrop-blur-[2px] rounded-lg border border-[#D8CBB7] shadow-xs">
                  <span className="font-bold text-[#7A1522] font-['Marcellus'] block text-xs">Trident Hotel, Udaipur</span>
                  <span className="text-[11px] text-[#1A1008] font-medium">Adjacent Luxury Wing • 3 mins via private shuttle</span>
                </div>
              </div>

              <div className="p-2.5 bg-white/70 backdrop-blur-[2px] rounded-lg border border-[#D8CBB7] shadow-xs space-y-1 text-xs text-[#1A1008] font-['Inter_Tight']">
                <span className="font-bold block text-[11px] text-[#7A1522] uppercase tracking-wider font-['Marcellus']">
                  Airport Information
                </span>
                <p className="text-[11px] leading-relaxed font-medium">
                  Maharana Pratap Airport (UDR) is 45 minutes away. Dedicated luxury chauffeur vehicles will be stationed at the airport for all arriving flights.
                </p>
              </div>
            </div>

            <div className="relative flex justify-between text-[10px] font-['Marcellus'] text-[#7A5826] font-semibold pt-2 border-t border-[#D9CDB8]">
              <span>Guest Stays</span>
              <span>Page 14</span>
            </div>
          </div>
        );

      // SPREAD 7 - LEFT: Interactive RSVP Form
      case 14:
        return (
          <div className="page-surface flex flex-col justify-between p-6 sm:p-8 overflow-y-auto">
            <div className="absolute inset-2.5 border border-[#B38A24]/60 pointer-events-none rounded-sm" />

            <div className="relative">
              <span className="text-[9px] uppercase tracking-[0.24em] font-bold text-[#7A1522] font-['Marcellus'] block">
                ॥ सादर आमंत्रण ॥
              </span>
              <h3 className="font-['Marcellus'] text-xl font-bold text-[#1A1008] tracking-wide mb-1">
                Kindly Confirm Attendance
              </h3>
              <RsvpForm />
            </div>

            <div className="relative flex justify-between text-[10px] font-['Marcellus'] text-[#7A5826] font-semibold pt-2 border-t border-[#D9CDB8] mt-2">
              <span>Page 15</span>
              <span>RSVP</span>
            </div>
          </div>
        );

      // SPREAD 7 - RIGHT: Blessings & Countdown
      case 15:
        return (
          <div className="page-surface flex flex-col justify-between items-center text-center p-6 sm:p-8">
            <div className="absolute inset-3 border border-[#B38A24]/60 pointer-events-none rounded-sm" />

            <CountdownBlock />

            <div className="space-y-1">
              <p className="font-['Alex_Brush'] text-2xl text-[#8C5A14]">
                With folded hands & deepest love,
              </p>
              <p className="font-['Marcellus'] text-lg font-bold text-[#7A1522] tracking-widest">
                ABHISHEK & ISHITA
              </p>
              <p className="font-['Noto_Serif_Devanagari'] text-xs text-[#1A1008] font-bold">
                ॥ आपका स्नेह एवं आशीर्वाद ही हमारी सबसे बड़ी पूंजी है ॥
              </p>
            </div>

            <div className="pt-1">
              <WaxSeal size={62} monogram="अ & इ" color="#8C1E2B" />
            </div>

            <button
              type="button"
              onClick={onCloseToShelf}
              className="py-2 px-5 border-2 border-[#D4AF37] bg-[#7A1522] hover:bg-[#630E19] text-[#FAF6ED] text-[11px] font-['Marcellus'] font-bold tracking-wider uppercase rounded-full shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 hover:scale-105 active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#F5DE98]" />
              <span>Return to Library</span>
            </button>

            <div className="relative w-full flex justify-between text-[10px] font-['Marcellus'] text-[#8C7A65] pt-2 border-t border-[#D9CDB8]">
              <span>Blessings</span>
              <span>Page 16</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden select-none">
      {/* 1. Regal Header Bar */}
      <header className="w-full pt-3 sm:pt-4 pb-2 px-3 sm:px-10 flex justify-between items-center z-30">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onCloseToShelf}
            className="inline-flex items-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 px-3 sm:px-4 border border-[#D4AF37]/70 hover:border-[#D4AF37] hover:bg-[#7A1522] hover:text-[#FAF6ED] bg-[#FAF6EE]/90 text-[#4A3824] rounded-full text-[11px] sm:text-xs font-['Marcellus'] tracking-wider uppercase font-semibold shadow-md transition-all cursor-pointer backdrop-blur-sm"
          >
            <Book className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Return to Library</span>
            <span className="sm:hidden">Library</span>
          </button>

          {/* Close Book / Front Cover Toggle Button */}
          <button
            type="button"
            onClick={() => {
              if (currentPage === 1) {
                goToPage(2);
              } else {
                goToPage(1);
              }
            }}
            title={currentPage === 1 ? 'Open Book to Invitation' : 'Close Book to Front Cover'}
            className="inline-flex items-center gap-1.5 py-1.5 sm:py-2 px-2.5 sm:px-3.5 border border-[#D4AF37]/70 hover:border-[#D4AF37] hover:bg-[#7A1522] hover:text-[#FAF6ED] bg-[#FAF6EE]/90 text-[#7A1522] rounded-full text-[11px] sm:text-xs font-['Marcellus'] font-bold tracking-wider uppercase shadow-md transition-all cursor-pointer backdrop-blur-sm hover:scale-105 active:scale-95"
          >
            {currentPage === 1 ? (
              <>
                <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Open Book</span>
              </>
            ) : (
              <>
                <BookMarked className="w-3.5 h-3.5 text-[#7A1522]" />
                <span className="hidden sm:inline">Close Book</span>
                <span className="sm:hidden">Close</span>
              </>
            )}
          </button>
        </div>

        {/* Center Auspicious Couple Title */}
        <div className="text-center flex flex-col items-center">
          <span className="font-['Noto_Serif_Devanagari'] text-[10px] sm:text-xs font-bold text-[#E5C158] tracking-widest drop-shadow-sm">
            ॥ श्री गणेशाय नमः ॥
          </span>
          <h2 className="font-['Marcellus'] text-xs sm:text-base tracking-[0.16em] sm:tracking-[0.24em] font-bold text-[#FAF6ED] drop-shadow">
            ABHISHEK WEDS ISHITA
          </h2>
          <span className="font-['Marcellus'] text-[9px] sm:text-[10px] tracking-widest text-[#D4AF37]">
            THE OBEROI UDAIVILAS • UDAIPUR
          </span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sitar & Shehnai Palace Ambient Melody */}
          <button
            type="button"
            onClick={() => {
              const playing = sound.toggleMusic();
              setIsMusicOn(playing);
            }}
            title={isMusicOn ? 'Pause Palace Sitar & Shehnai' : 'Play Palace Sitar & Shehnai'}
            className={`py-1.5 sm:py-2 px-2.5 sm:px-3 border border-[#D4AF37]/70 rounded-full transition-all cursor-pointer shadow-md backdrop-blur-sm flex items-center gap-1.5 text-xs font-['Marcellus'] ${
              isMusicOn
                ? 'bg-[#7A1522] text-[#FAF6ED] border-[#D4AF37] ring-1 ring-[#D4AF37]'
                : 'bg-[#FAF6EE]/90 hover:bg-[#7A1522] hover:text-[#FAF6ED] text-[#5C4834]'
            }`}
          >
            <Music className={`w-3.5 h-3.5 ${isMusicOn ? 'text-[#F5DE98] animate-pulse' : ''}`} />
            <span className="hidden md:inline text-[10px] tracking-wider uppercase font-semibold">
              {isMusicOn ? 'Palace Music' : 'Play Music'}
            </span>
          </button>

          {onTriggerPetals && (
            <button
              type="button"
              onClick={() => {
                sound.playCelebrationChime();
                onTriggerPetals();
              }}
              title="Sakura Petals Shower"
              className="py-1.5 sm:py-2 px-2.5 sm:px-3.5 border border-[#D4AF37]/70 bg-[#FAF6EE]/90 hover:bg-[#7A1522] hover:text-[#FAF6ED] text-[#7A1522] rounded-full text-xs font-['Marcellus'] font-semibold transition-all cursor-pointer shadow-md hover:scale-105 flex items-center gap-1.5 backdrop-blur-sm"
            >
              <Heart className="w-3.5 h-3.5 fill-current text-[#D9384B]" />
              <span className="hidden sm:inline">Sakura Varsha</span>
            </button>
          )}

          <button
            type="button"
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute sound' : 'Unmute sound'}
            className="p-1.5 sm:p-2 border border-[#D4AF37]/70 bg-[#FAF6EE]/90 hover:bg-[#7A1522] hover:text-[#FAF6ED] text-[#5C4834] rounded-full transition-all cursor-pointer shadow-md backdrop-blur-sm"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 2. Chapter Quick-Jump Ribbon */}
      <nav className="w-full flex justify-center px-2 sm:px-4 py-1 z-30">
        <div className="flex items-center gap-1 bg-[#1A0B0E]/70 p-1.5 rounded-full border border-[#D4AF37]/50 max-w-4xl overflow-x-auto shadow-lg backdrop-blur-md no-scrollbar">
          {INDIAN_CHAPTERS.map((ch) => {
            const isActive =
              ch.id === 'cover'
                ? currentPage === 1
                : currentSpread === ch.spread && currentPage > 1 && currentPage < 18;

            return (
              <button
                key={ch.id}
                onClick={() => jumpToSpread(ch.spread)}
                className={`px-3 sm:px-3.5 py-1 rounded-full text-[10px] sm:text-[10.5px] font-['Marcellus'] tracking-wider uppercase font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-[#94192B] to-[#700F1E] text-[#FAF6ED] border border-[#D4AF37]/70 shadow'
                    : 'text-[#D8C6A8] hover:text-[#FAF6ED] hover:bg-white/10'
                }`}
              >
                {ch.title}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 2b. Mobile Sub-page Indicator & Side Switcher */}
      {isMobile && currentPage > 1 && currentPage < 18 && (
        <div className="w-full flex justify-center items-center gap-2 py-1 z-30 animate-fadeIn">
          <button
            type="button"
            onClick={() => goToPage(currentSpread * 2 + 2)}
            className={`px-3 py-1 rounded-full text-[10px] font-['Marcellus'] font-bold tracking-wider uppercase transition-all shadow cursor-pointer ${
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
            className={`px-3 py-1 rounded-full text-[10px] font-['Marcellus'] font-bold tracking-wider uppercase transition-all shadow cursor-pointer ${
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
      <div className="relative flex-1 w-full flex items-center justify-center p-1 sm:p-4">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentPage <= 1}
          className={`absolute left-1 sm:left-6 md:left-10 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full border-2 border-[#D4AF37] bg-[#7A1522] text-[#FAF6ED] flex items-center justify-center transition-all z-40 shadow-2xl ${
            currentPage <= 1
              ? 'opacity-25 cursor-not-allowed'
              : 'hover:scale-110 active:scale-95 cursor-pointer hover:bg-[#94192B]'
          }`}
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={handleNext}
          disabled={currentPage >= 18}
          className={`absolute right-1 sm:right-6 md:right-10 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full border-2 border-[#D4AF37] bg-[#7A1522] text-[#FAF6ED] flex items-center justify-center transition-all z-40 shadow-2xl ${
            currentPage >= 18
              ? 'opacity-25 cursor-not-allowed'
              : 'hover:scale-110 active:scale-95 cursor-pointer hover:bg-[#94192B]'
          }`}
          aria-label="Next Page"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Outer Shadow & Padded Velvet Hardcover Frame matching the active event */}
        <div
          className="relative p-1.5 sm:p-3.5 rounded-xl shadow-[0_20px_60px_rgba(15,5,8,0.75)] border-2 border-[#D4AF37]/80 bg-cover bg-center transition-all duration-500 max-w-full"
          style={{
            backgroundColor: activeVolume?.spineColor || '#5A0C16',
            backgroundImage: `radial-gradient(circle at 50% 30%, rgba(255,255,255,0.18) 0%, transparent 65%), url('${activeVolume?.coverTexture || '/assets/textures/cover_patrika.jpg'}')`,
          }}
        >
          {/* Silk Bookmark Ribbon at top center with gentle sway */}
          <div
            className="bookmark-ribbon absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-10 shadow-md z-40 rounded-b-sm border-t border-[#D4AF37] flex items-end justify-center pb-1 transition-colors duration-500"
            style={{ backgroundColor: activeVolume?.spineColor || '#8C1E2B' }}
          >
            <span className="text-[8px] font-['Cinzel'] font-bold text-[#EEDCA2]">
              {currentPage === 1 ? 'COVER' : currentPage >= 18 ? 'END' : isMobile ? `${currentPage - 1}/16` : `${currentSpread + 1}/8`}
            </span>
          </div>

          {/* THE BOOK STAGE CONTAINER WITH TURN.JS 3D PAPER PEEL & TOUCH SWIPE */}
          <div
            className={`book-stage-3d relative flex items-center justify-center ${
              isMobile
                ? 'w-[96vw] max-w-[440px] h-[78vh] max-h-[700px] min-h-[500px]'
                : 'w-[90vw] max-w-[960px] h-[580px] sm:h-[620px]'
            } rounded shadow-2xl`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
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

      {/* 4. Bottom Page Number Footer */}
      <footer className="w-full pb-2.5 sm:pb-3 px-4 sm:px-6 flex justify-between items-center text-xs font-['Inter_Tight'] text-[#705F4D] z-30">
        <span className="tracking-wider uppercase text-[9.5px] sm:text-[10px]">
          {isMobile ? (
            <span>Swipe or drag corner to turn page</span>
          ) : (
            <span>
              Drag page corners • arrows <kbd className="px-1.5 py-0.5 border border-[#C5BCAD] rounded bg-white/80">←</kbd> and{' '}
              <kbd className="px-1.5 py-0.5 border border-[#C5BCAD] rounded bg-white/80">→</kbd> to turn
            </span>
          )}
        </span>

        <span className="font-['Marcellus'] tracking-widest text-[#8C6D2B] font-bold uppercase text-[10.5px] sm:text-[11px]">
          {currentPage === 1
            ? 'Cover'
            : currentPage >= 18
            ? 'Back Cover'
            : isMobile
            ? `Page ${currentPage - 1} of 16`
            : `Pages ${currentSpread * 2 + 1}–${currentSpread * 2 + 2} of 16`}
        </span>

        <button
          type="button"
          onClick={onCloseToShelf}
          className="hover:text-[#2A1E14] underline uppercase tracking-wider text-[9.5px] sm:text-[10px] cursor-pointer"
        >
          Return to Shelf
        </button>
      </footer>
    </div>
  );
};

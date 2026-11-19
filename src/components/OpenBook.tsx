import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/audio';
import { WaxSeal } from './WaxSeal';
import { RsvpForm } from './RsvpForm';
import { IndianBookVolume } from '../types/wedding';
import {
  ChevronLeft,
  ChevronRight,
  Book,
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
  { id: 0, title: 'Patrika', spread: 0, subtitle: 'The Invitation' },
  { id: 1, title: 'Kahani', spread: 1, subtitle: 'Our Journey' },
  { id: 2, title: 'Haldi & Mehndi', spread: 2, subtitle: 'Day 1 • 28th Nov' },
  { id: 3, title: 'Sangeet', spread: 3, subtitle: 'Day 2 • 29th Nov' },
  { id: 4, title: 'Saat Phere', spread: 4, subtitle: 'Day 3 • 30th Nov' },
  { id: 5, title: 'Poshak & Rang', spread: 5, subtitle: 'Attire & Palette' },
  { id: 6, title: 'Udaivilas', spread: 6, subtitle: 'Travel & Stays' },
  { id: 7, title: 'RSVP', spread: 7, subtitle: 'Confirm Attendance' },
];

interface FlipSession {
  direction: 'next' | 'prev';
  fromSpread: number;
  toSpread: number;
  leafFrontPage: number;
  leafBackPage: number;
  baseLeftPage: number;
  baseRightPage: number;
}

export const OpenBook: React.FC<OpenBookProps> = ({
  initialSpread = 0,
  activeVolume,
  onCloseToShelf,
  onTriggerPetals,
  soundEnabled,
  onToggleSound,
}) => {
  const [currentSpread, setCurrentSpread] = useState(initialSpread);
  const [activeFlip, setActiveFlip] = useState<FlipSession | null>(null);
  const [flipAngle, setFlipAngle] = useState(0);
  const [activePaletteIndex, setActivePaletteIndex] = useState(0);
  const [isMusicOn, setIsMusicOn] = useState(sound.getMusicPlaying());
  const flipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Mobile single-page state:
  // On mobile (<768px), shows one side of page only (mobileSide: 'left' | 'right').
  // Swipe 1: shows the other side.
  // Swipe 2: turns to the next spread!
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [mobileSide, setMobileSide] = useState<'left' | 'right'>('left');
  const [mobileAnim, setMobileAnim] = useState<'forward' | 'backward' | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!mobileAnim) return;
    const t = setTimeout(() => {
      setMobileAnim(null);
    }, 360);
    return () => clearTimeout(t);
  }, [mobileAnim]);

  // Live countdown to 30th November 2026
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

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== 'transform' || !activeFlip) return;
    if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
    setCurrentSpread(activeFlip.toSpread);
    setActiveFlip(null);
    setFlipAngle(0);
  };

  const flipNext = () => {
    if (activeFlip || currentSpread >= 7) return;
    sound.playPageFlip();
    const fromSpread = currentSpread;
    const toSpread = currentSpread + 1;

    const session: FlipSession = {
      direction: 'next',
      fromSpread,
      toSpread,
      leafFrontPage: fromSpread * 2 + 1,
      leafBackPage: toSpread * 2,
      baseLeftPage: fromSpread * 2,
      baseRightPage: toSpread * 2 + 1,
    };

    setActiveFlip(session);
    setFlipAngle(0);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setFlipAngle(-180);
      });
    });

    if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
    flipTimerRef.current = setTimeout(() => {
      setCurrentSpread(toSpread);
      setActiveFlip(null);
      setFlipAngle(0);
    }, 720);
  };

  const flipPrev = () => {
    if (activeFlip || currentSpread <= 0) return;
    sound.playPageFlip();
    const fromSpread = currentSpread;
    const toSpread = currentSpread - 1;

    const session: FlipSession = {
      direction: 'prev',
      fromSpread,
      toSpread,
      leafFrontPage: fromSpread * 2,
      leafBackPage: toSpread * 2 + 1,
      baseLeftPage: toSpread * 2,
      baseRightPage: fromSpread * 2 + 1,
    };

    setActiveFlip(session);
    setFlipAngle(0);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setFlipAngle(180);
      });
    });

    if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
    flipTimerRef.current = setTimeout(() => {
      setCurrentSpread(toSpread);
      setActiveFlip(null);
      setFlipAngle(0);
    }, 720);
  };

  // Unified Next & Prev handlers supporting Mobile Single-Page and Desktop Dual-Page
  const handleNext = () => {
    if (isMobile) {
      if (mobileSide === 'left') {
        // Swipe 1 (Left): show other side of current spread
        sound.playPageFlip();
        setMobileAnim('forward');
        setMobileSide('right');
      } else {
        // Swipe 2 (Left): advance to next spread, starting on left side
        if (currentSpread >= 7) return;
        sound.playPageFlip();
        setMobileAnim('forward');
        setCurrentSpread((prev) => prev + 1);
        setMobileSide('left');
      }
    } else {
      flipNext();
    }
  };

  const handlePrev = () => {
    if (isMobile) {
      if (mobileSide === 'right') {
        // Move back to left side of current spread
        sound.playPageFlip();
        setMobileAnim('backward');
        setMobileSide('left');
      } else {
        // Move back to previous spread, showing its right side
        if (currentSpread <= 0) return;
        sound.playPageFlip();
        setMobileAnim('backward');
        setCurrentSpread((prev) => prev - 1);
        setMobileSide('right');
      }
    } else {
      flipPrev();
    }
  };

  const jumpToSpread = (spread: number) => {
    if (isMobile) {
      if (spread === currentSpread && mobileSide === 'left') return;
      sound.playPageFlip();
      setMobileAnim(spread >= currentSpread ? 'forward' : 'backward');
      setCurrentSpread(spread);
      setMobileSide('left');
      return;
    }

    if (activeFlip || spread === currentSpread) return;
    sound.playPageFlip();

    if (spread > currentSpread) {
      const session: FlipSession = {
        direction: 'next',
        fromSpread: currentSpread,
        toSpread: spread,
        leafFrontPage: currentSpread * 2 + 1,
        leafBackPage: spread * 2,
        baseLeftPage: currentSpread * 2,
        baseRightPage: spread * 2 + 1,
      };
      setActiveFlip(session);
      setFlipAngle(0);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setFlipAngle(-180);
        });
      });
      if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
      flipTimerRef.current = setTimeout(() => {
        setCurrentSpread(spread);
        setActiveFlip(null);
        setFlipAngle(0);
      }, 720);
    } else {
      const session: FlipSession = {
        direction: 'prev',
        fromSpread: currentSpread,
        toSpread: spread,
        leafFrontPage: currentSpread * 2,
        leafBackPage: spread * 2 + 1,
        baseLeftPage: spread * 2,
        baseRightPage: currentSpread * 2 + 1,
      };
      setActiveFlip(session);
      setFlipAngle(0);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setFlipAngle(180);
        });
      });
      if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
      flipTimerRef.current = setTimeout(() => {
        setCurrentSpread(spread);
        setActiveFlip(null);
        setFlipAngle(0);
      }, 720);
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
  }, [currentSpread, activeFlip, isMobile, mobileSide]);

  // Swipe & Drag Gestures Handling
  const pointerStartRef = useRef<{
    x: number;
    y: number;
    time: number;
    isInteractive: boolean;
    stageRect?: DOMRect;
  } | null>(null);

  const [isSwiping, setIsSwiping] = useState(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activeFlip) return;

    const target = e.target as HTMLElement;
    // Check if clicked element is an interactive input, button, select, textarea, etc.
    const isInteractive = Boolean(
      target.closest('input, textarea, select, button, a, label, [role="button"]')
    );

    const stageRect = e.currentTarget.getBoundingClientRect();

    pointerStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
      isInteractive,
      stageRect,
    };

    if (!isInteractive) {
      setIsSwiping(true);
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {}
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointerStartRef.current) return;
    if (pointerStartRef.current.isInteractive) return;

    const dx = e.clientX - pointerStartRef.current.x;

    // Immediately remove any accidental browser text selection
    if (Math.abs(dx) > 3) {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        sel.removeAllRanges();
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const start = pointerStartRef.current;
    pointerStartRef.current = null;
    setIsSwiping(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    if (!start) return;
    if (!isMobile && activeFlip) return;

    // If tap/click was on an interactive form control or button, let it perform its native action
    if (start.isInteractive) return;

    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    const dt = Date.now() - start.time;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    // SWIPE DETECTION:
    // Dragged horizontally by at least 25px (and horizontal movement is larger than vertical * 0.6)
    // OR fast flick gesture (> 16px within 300ms)
    const isSwipe = (absX > 25 && absX > absY * 0.6) || (absX > 16 && dt < 300 && absX > absY);

    if (isSwipe) {
      if (dx < 0) {
        // Swiped Left -> Turn forward (next page or next side)
        handleNext();
      } else {
        // Swiped Right -> Turn backward (previous page or prev side)
        handlePrev();
      }
      return;
    }

    // CLICK / TAP DETECTION (minimal movement < 12px)
    if (absX < 12 && absY < 12) {
      const rect = start.stageRect || e.currentTarget.getBoundingClientRect();
      const clickRelX = e.clientX - rect.left;
      const isRightHalf = clickRelX > rect.width / 2;

      if (isRightHalf) {
        handleNext();
      } else {
        // On spread 7 (RSVP page, left page is page 14), protect against accidental flips when tapping margins
        if (currentSpread === 7 && (!isMobile || mobileSide === 'left')) return;
        handlePrev();
      }
    }
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerStartRef.current = null;
    setIsSwiping(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Explicit Native Touch Handlers for Mobile Swipe
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return;
    const target = e.target as HTMLElement;
    if (target.closest('input, textarea, select, button, a, label, [role="button"]')) return;

    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now(),
    };
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - touchStartRef.current.x;
    const dy = e.touches[0].clientY - touchStartRef.current.y;

    if (Math.abs(dx) > Math.abs(dy) * 0.7 && Math.abs(dx) > 8) {
      if (e.cancelable) e.preventDefault();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start) return;

    const touch = e.changedTouches[0];
    if (!touch) return;

    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    const dt = Date.now() - start.time;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    const isSwipe = (absX > 24 && absX > absY * 0.6) || (absX > 16 && dt < 320 && absX > absY);

    if (isSwipe) {
      if (dx < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

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
              <span className="font-['Noto_Serif_Devanagari'] text-base font-bold gold-foil-heading tracking-widest block drop-shadow-sm">
                ॥ श्री गणेशाय नमः ॥
              </span>

              <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37] mx-auto flex items-center justify-center bg-[#FAF4E5]/80 shadow-[0_0_15px_rgba(212,175,55,0.35)]">
                <span className="font-['Marcellus'] text-2xl font-bold gold-foil-text">अ & इ</span>
              </div>

              <p className="font-['Noto_Serif_Devanagari'] text-xs sm:text-sm font-semibold text-[#4A3828] leading-relaxed italic">
                वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।<br />
                निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥
              </p>

              <div className="w-20 h-[1.5px] bg-[#D4AF37] mx-auto my-1" />

              <p className="font-['Cormorant_Garamond'] text-sm sm:text-base italic text-[#4A3C2D] leading-relaxed max-w-xs mx-auto">
                "With the divine blessings of our beloved elders and the grace of the Almighty, we invite you to grace our wedding celebrations."
              </p>

              <p className="font-['Noto_Serif_Devanagari'] text-[11px] text-[#8C6D2B] font-semibold">
                मङ्गलम् भगवान विष्णुः मङ्गलम् गरुडध्वजः।<br />
                मङ्गलम् पुण्डरीकाक्षः मङ्गलाय तनो हरिः॥
              </p>
            </div>

            <div className="relative flex justify-between text-[10px] font-['Marcellus'] text-[#8C7A65] pt-2 border-t border-[#D9CDB8]">
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
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold gold-foil-heading font-['Marcellus']">
                ॥ शुभ विवाह पत्रिका ॥
              </span>

              <p className="font-['Cormorant_Garamond'] text-xs sm:text-sm italic text-[#594939] leading-snug">
                With the heavenly blessings of Late Smt. Shanti Devi & Shri Ramswaroop Sharma,<br />
                Mrs. Sunita & Mr. Rajesh Sharma cordially invite you to celebrate the wedding of their son
              </p>

              <h2 className="font-['Marcellus'] text-2xl sm:text-3xl font-bold tracking-[0.16em]">
                <span className="gold-foil-heading block">ABHISHEK</span>
                <span className="block font-['Alex_Brush'] text-2xl sm:text-3xl font-normal text-[#8C1E2B] lowercase my-0.5">
                  weds
                </span>
                <span className="gold-foil-heading block">ISHITA</span>
              </h2>

              <p className="font-['Cormorant_Garamond'] text-xs sm:text-sm italic text-[#594939] leading-snug">
                Daughter of Mrs. Meenakshi & Mr. Alok Verma<br />
                (Granddaughter of Late Smt. Kamla Devi & Shri Premchand Verma)
              </p>

              <div className="border-t border-b border-[#D8CDB8] py-2 w-full max-w-xs mx-auto space-y-0.5">
                <p className="font-['Marcellus'] text-xs sm:text-sm font-bold tracking-wider text-[#2A1E14]">
                  28TH • 29TH • 30TH NOVEMBER 2026
                </p>
                <p className="font-['Inter_Tight'] text-[10px] uppercase tracking-widest text-[#73604C]">
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

            <div className="relative flex justify-between text-[10px] font-['Marcellus'] text-[#8C7A65] pt-2 border-t border-[#D9CDB8]">
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
                <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-[#8C6D2B] font-['Marcellus'] block">
                  Chapter I • हमारी कहानी
                </span>
                <h3 className="font-['Marcellus'] text-xl font-bold text-[#2A1E14] tracking-wide mt-0.5">
                  The Serendipity
                </h3>
              </div>

              <p className="font-['Cormorant_Garamond'] text-sm sm:text-base text-[#4A3C2D] leading-relaxed italic">
                "Two distinct souls, an accidental cup of cutting chai at Marine Drive, and a conversation that never ended..."
              </p>

              <div className="space-y-2 text-xs font-['Inter_Tight'] text-[#45382B]">
                <div className="border-l-2 border-[#8C6D2B] pl-2.5 py-0.5">
                  <span className="font-semibold text-[#8C1E2B] block text-[11px] font-['Marcellus']">
                    2019 • Mumbai Monsoon
                  </span>
                  <p className="text-[#594B3C] text-xs">Debate partners who bonded over late-night chai, samosas, and endless dreams.</p>
                </div>

                <div className="border-l-2 border-[#8C6D2B] pl-2.5 py-0.5">
                  <span className="font-semibold text-[#8C1E2B] block text-[11px] font-['Marcellus']">
                    2022 • The Spiti Valley Expedition
                  </span>
                  <p className="text-[#594B3C] text-xs">Under cold, starry Himalayan skies, Abhishek knew Ishita was his only home.</p>
                </div>

                <div className="border-l-2 border-[#8C6D2B] pl-2.5 py-0.5">
                  <span className="font-semibold text-[#8C1E2B] block text-[11px] font-['Marcellus']">
                    2025 • Sunset at Nahargarh Fort, Jaipur
                  </span>
                  <p className="text-[#594B3C] text-xs">As twilight wrapped Jaipur in gold, Abhishek knelt with a ring, and Ishita said yes.</p>
                </div>
              </div>
            </div>

            <div className="relative flex justify-between text-[10px] font-['Marcellus'] text-[#8C7A65] pt-2 border-t border-[#D9CDB8]">
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

            <div className="my-auto w-full max-w-xs bg-white/95 p-3.5 pt-3.5 pb-5 rounded-lg shadow-md border border-[#DDD0BC]">
              <div className="w-full aspect-[4/3] rounded bg-gradient-to-tr from-[#421D12] via-[#853826] to-[#C97855] overflow-hidden flex items-center justify-center p-4 text-[#FAF3EA]">
                <div>
                  <Heart className="w-6 h-6 mx-auto mb-1 text-[#F2C4C4] fill-current opacity-90" />
                  <span className="font-['Marcellus'] text-xs tracking-widest block font-bold">
                    NAHARGARH FORT • JAIPUR
                  </span>
                  <span className="font-['Alex_Brush'] text-xl text-[#F9E2E2]">The Sunset Proposal</span>
                </div>
              </div>
              <p className="font-['Noto_Serif_Devanagari'] text-xs text-[#4A392A] mt-2.5 font-semibold">
                "तू ही मेरी मंजिल, तू ही मेरा हमसफर..."
              </p>
            </div>

            <p className="font-['Cormorant_Garamond'] text-xs italic text-[#594B3C] max-w-xs leading-snug">
              Every step, every laugh, and every quiet promise has brought us to this sacred moment in Udaipur.
            </p>

            <button
              type="button"
              onClick={handleNext}
              className="text-[10.5px] font-['Marcellus'] tracking-wider uppercase text-[#8C1E2B] hover:underline font-bold cursor-pointer"
            >
              Explore Haldi & Mehndi →
            </button>

            <div className="relative w-full flex justify-between text-[10px] font-['Marcellus'] text-[#8C7A65] pt-2 border-t border-[#D9CDB8]">
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
                <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-[#B87A08] font-['Marcellus'] block">
                  Day 1 • 28th November 2026
                </span>
                <h3 className="font-['Marcellus'] text-xl font-bold text-[#2A1E14] tracking-wide mt-0.5">
                  Phoolon Ki Haldi & Peethi
                </h3>
                <p className="font-['Cormorant_Garamond'] text-xs text-[#735E44] italic">
                  11:00 AM • The Crescent Lawn, Udaivilas
                </p>
              </div>

              <div className="p-3 bg-[#FAF3E3]/90 border border-[#E8D8B8] rounded space-y-1.5 text-xs font-['Inter_Tight']">
                <div className="flex items-center gap-2 text-[#9E6007] font-semibold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Poolside Lawn overlooking Lake Pichola</span>
                </div>
                <p className="text-[#544432] leading-relaxed">
                  Fragrant turmeric, fresh marigold petals, live Rajasthani dholak, and joyous folk songs to bless the couple.
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-[#524433] font-['Inter_Tight']">
                <div className="flex justify-between py-1 border-b border-[#E8DECD]">
                  <span className="font-semibold">11:00 AM</span>
                  <span>Auspicious Peethi Ceremony</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E8DECD]">
                  <span className="font-semibold">12:30 PM</span>
                  <span>Phoolon Ki Holi (Marigold Shower)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E8DECD]">
                  <span className="font-semibold">01:30 PM</span>
                  <span>Traditional Dal Baati Churma Lunch</span>
                </div>
              </div>

              <p className="text-[11px] italic font-['Cormorant_Garamond'] text-[#78644E]">
                Attire: Sunlit Yellows, Mustard, and Haldi Ochre.
              </p>
            </div>

            <div className="relative flex justify-between text-[10px] font-['Marcellus'] text-[#8C7A65] pt-2 border-t border-[#D9CDB8]">
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
                <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-[#8C1E2B] font-['Marcellus'] block">
                  Day 1 Evening • 28th Nov 2026
                </span>
                <h3 className="font-['Marcellus'] text-xl font-bold text-[#2A1E14] tracking-wide mt-0.5">
                  Mehendi Rachne Wali
                </h3>
                <p className="font-['Cormorant_Garamond'] text-xs text-[#735E44] italic">
                  05:00 PM • The Banyan Courtyard, Udaivilas
                </p>
              </div>

              <div className="p-3 bg-[#FAF5EE]/90 border border-[#E5DAC8] rounded space-y-1.5 text-xs font-['Inter_Tight'] text-[#45382B]">
                <p className="leading-relaxed">
                  As dusk falls over Lake Pichola, intricate henna patterns will be woven, accompanied by folk singers, custom bangles, and street chaat.
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-[#524433] font-['Inter_Tight']">
                <div className="flex justify-between py-1 border-b border-[#E8DECD]">
                  <span className="font-semibold">05:00 PM</span>
                  <span>Bridal & Guest Henna Artists</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E8DECD]">
                  <span className="font-semibold">06:30 PM</span>
                  <span>Live Ghoomar Folk Dance</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E8DECD]">
                  <span className="font-semibold">08:00 PM</span>
                  <span>Royal Street Food & Chaat Festival</span>
                </div>
              </div>

              <p className="text-[11px] italic font-['Cormorant_Garamond'] text-[#78644E]">
                Attire: Festive Florals, Mint Greens, Coral & Pastel Lehengas.
              </p>
            </div>

            <div className="relative flex justify-between text-[10px] font-['Marcellus'] text-[#8C7A65] pt-2 border-t border-[#D9CDB8]">
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
                <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-[#8C1E2B] font-['Marcellus'] block">
                  Day 2 • 29th November 2026
                </span>
                <h3 className="font-['Marcellus'] text-xl font-bold text-[#2A1E14] tracking-wide mt-0.5">
                  Sangeet Sandhya
                </h3>
                <p className="font-['Cormorant_Garamond'] text-xs text-[#735E44] italic">
                  07:00 PM • The Mewar Ballroom & Courtyard
                </p>
              </div>

              <div className="p-3 bg-[#F9F0F4]/90 border border-[#E6D0DD] rounded space-y-1.5 text-xs font-['Inter_Tight']">
                <div className="flex items-center gap-2 text-[#7A1522] font-semibold">
                  <Music className="w-3.5 h-3.5" />
                  <span>An Evening of Glamour, Music & Dance</span>
                </div>
                <p className="text-[#4E3945] leading-relaxed">
                  Family dance performances, Team Groom vs. Team Bride battles, royal cocktails, and Abhishek & Ishita's special duet.
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-[#523F4B] font-['Inter_Tight']">
                <div className="flex justify-between py-1 border-b border-[#E8DECD]">
                  <span className="font-semibold">07:00 PM</span>
                  <span>Red Carpet Welcome & Cocktails</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E8DECD]">
                  <span className="font-semibold">08:00 PM</span>
                  <span>The Grand Sangeet Dance Showdown</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E8DECD]">
                  <span className="font-semibold">09:30 PM</span>
                  <span>Abhishek & Ishita's Duet Performance</span>
                </div>
              </div>

              <p className="text-[11px] italic font-['Cormorant_Garamond'] text-[#78644E]">
                Attire: Sparkling Indo-Western, Royal Lehengas & Bandhgalas.
              </p>
            </div>

            <div className="relative flex justify-between text-[10px] font-['Marcellus'] text-[#8C7A65] pt-2 border-t border-[#D9CDB8]">
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
                <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-[#8C1E2B] font-['Marcellus'] block">
                  Music & Celebration
                </span>
                <h3 className="font-['Marcellus'] text-xl font-bold text-[#2A1E14] tracking-wide mt-0.5">
                  DJ Night & Starlight Lounge
                </h3>
                <p className="font-['Cormorant_Garamond'] text-xs text-[#735E44] italic">
                  10:30 PM Onward • Udaivilas Starlight Pier
                </p>
              </div>

              <div className="p-3 bg-[#FAF5EE]/90 border border-[#E5DAC8] rounded space-y-1.5 text-xs font-['Inter_Tight'] text-[#45382B]">
                <p className="leading-relaxed">
                  Featuring live percussion, Bollywood & Punjabi beats, signature mocktails, and hot jalebis with rabdi.
                </p>
              </div>

              <div className="space-y-1.5 text-xs text-[#524433] font-['Inter_Tight']">
                <div className="flex justify-between py-1 border-b border-[#E8DECD]">
                  <span className="font-semibold">10:30 PM</span>
                  <span>DJ Beats & Live Dholak</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E8DECD]">
                  <span className="font-semibold">12:00 AM</span>
                  <span>Midnight Chaat & Kulfi Bar</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="mt-2 text-[10.5px] font-['Marcellus'] tracking-wider uppercase text-[#8C1E2B] hover:underline font-bold cursor-pointer"
              >
                The Sacred Vivah & Saat Phere →
              </button>
            </div>

            <div className="relative flex justify-between text-[10px] font-['Marcellus'] text-[#8C7A65] pt-2 border-t border-[#D9CDB8]">
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
                <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-[#8C1E2B] font-['Marcellus'] block">
                  Day 3 • 30th November 2026
                </span>
                <h3 className="font-['Marcellus'] text-xl font-bold text-[#2A1E14] tracking-wide mt-0.5">
                  Baraat & Jaimala
                </h3>
                <p className="font-['Cormorant_Garamond'] text-xs text-[#735E44] italic">
                  04:00 PM Onward • Lake Pichola Promenade
                </p>
              </div>

              <div className="space-y-2 text-xs font-['Inter_Tight'] text-[#45382B]">
                <div className="flex gap-2.5 py-1.5 border-b border-[#E8DECD]">
                  <span className="font-['Marcellus'] font-bold text-[#8C1E2B] w-14 shrink-0">04:00 PM</span>
                  <div>
                    <span className="font-semibold block">Safa Bandhai & Swagat</span>
                    <span className="text-[11px] text-[#6E5D4A]">Traditional turban tying for all guests.</span>
                  </div>
                </div>

                <div className="flex gap-2.5 py-1.5 border-b border-[#E8DECD]">
                  <span className="font-['Marcellus'] font-bold text-[#8C1E2B] w-14 shrink-0">04:45 PM</span>
                  <div>
                    <span className="font-semibold block">The Royal Baraat Procession</span>
                    <span className="text-[11px] text-[#6E5D4A]">Vintage royal buggy, Punjabi dhol, and dancing.</span>
                  </div>
                </div>

                <div className="flex gap-2.5 py-1.5 border-b border-[#E8DECD]">
                  <span className="font-['Marcellus'] font-bold text-[#8C1E2B] w-14 shrink-0">05:45 PM</span>
                  <div>
                    <span className="font-semibold block">Jaimala Ceremony</span>
                    <span className="text-[11px] text-[#6E5D4A]">Exchange of floral varmalas on the lake deck at sunset.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex justify-between text-[10px] font-['Marcellus'] text-[#8C7A65] pt-2 border-t border-[#D9CDB8]">
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
                <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-[#8C1E2B] font-['Marcellus'] block">
                  The Sacred Vows
                </span>
                <h3 className="font-['Marcellus'] text-xl font-bold text-[#2A1E14] tracking-wide mt-0.5">
                  Saat Phere & Royal Dawat
                </h3>
                <p className="font-['Cormorant_Garamond'] text-xs text-[#735E44] italic">
                  06:45 PM • The Central Mandap, Udaivilas
                </p>
              </div>

              <div className="space-y-2 text-xs font-['Inter_Tight'] text-[#45382B]">
                <div className="flex gap-2.5 py-1.5 border-b border-[#E8DECD]">
                  <span className="font-['Marcellus'] font-bold text-[#8C1E2B] w-14 shrink-0">06:45 PM</span>
                  <div>
                    <span className="font-semibold block">Saat Phere around Sacred Agni</span>
                    <span className="text-[11px] text-[#6E5D4A]">Seven sacred vows of lifelong companionship.</span>
                  </div>
                </div>

                <div className="flex gap-2.5 py-1.5 border-b border-[#E8DECD]">
                  <span className="font-['Marcellus'] font-bold text-[#8C1E2B] w-14 shrink-0">07:45 PM</span>
                  <div>
                    <span className="font-semibold block">Sindoordaan & Mangalsutra</span>
                    <span className="text-[11px] text-[#6E5D4A]">The auspicious sealing of the marriage bond.</span>
                  </div>
                </div>

                <div className="flex gap-2.5 py-1.5">
                  <span className="font-['Marcellus'] font-bold text-[#8C1E2B] w-14 shrink-0">08:30 PM</span>
                  <div>
                    <span className="font-semibold block">The Royal Wedding Banquet (Dawat)</span>
                    <span className="text-[11px] text-[#6E5D4A]">Grand feast of Rajasthani & Awadhi royal delicacies.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex justify-between text-[10px] font-['Marcellus'] text-[#8C7A65] pt-2 border-t border-[#D9CDB8]">
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
                <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-[#8C6D2B] font-['Marcellus'] block">
                  Poshak Nirdeshika
                </span>
                <h3 className="font-['Marcellus'] text-xl font-bold text-[#2A1E14] tracking-wide mt-0.5">
                  Royal Festive Attire
                </h3>
                <p className="font-['Cormorant_Garamond'] text-xs text-[#735E44] italic">
                  Ceremonial Guidance for our Honored Guests
                </p>
              </div>

              <div className="space-y-2 text-xs font-['Inter_Tight'] text-[#45382B]">
                <div className="bg-[#FAF4E8]/90 p-3 rounded border border-[#E2D5BE]">
                  <span className="font-semibold text-[#8C1E2B] font-['Marcellus'] block mb-0.5">
                    For the Ladies
                  </span>
                  <p className="leading-relaxed">
                    Opulent Lehengas, Banarasi & Kanjivaram Sarees, or Designer Anarkalis with heritage jhumkas and potlis.
                  </p>
                </div>

                <div className="bg-[#FAF4E8]/90 p-3 rounded border border-[#E2D5BE]">
                  <span className="font-semibold text-[#8C1E2B] font-['Marcellus'] block mb-0.5">
                    For the Gentlemen
                  </span>
                  <p className="leading-relaxed">
                    Classic Achkans, Royal Sherwanis, Bandhgalas, or Silk Kurta-Pyjamas paired with mojaris.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative flex justify-between text-[10px] font-['Marcellus'] text-[#8C7A65] pt-2 border-t border-[#D9CDB8]">
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
                <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-[#8C6D2B] font-['Marcellus'] block">
                  Celebration Colors
                </span>
                <h3 className="font-['Marcellus'] text-xl font-bold text-[#2A1E14] tracking-wide mt-0.5">
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
                    className="p-2 rounded border border-[#DDD0BD] bg-white/80 flex items-center gap-2 cursor-pointer shadow-sm hover:scale-[1.02] transition-transform"
                  >
                    <div className="w-6 h-6 rounded-full border border-black/15 shrink-0 shadow-inner" style={{ backgroundColor: s.hex }} />
                    <div className="flex flex-col">
                      <span className="text-[10.5px] font-semibold font-['Marcellus'] text-[#2A1E14] leading-tight">{s.name}</span>
                      <span className="text-[8px] text-[#7A6B59] font-['Inter_Tight']">{s.note}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 bg-[#FAF4E8]/90 rounded border border-[#E2D5BE] text-xs text-[#594837] font-['Cormorant_Garamond'] italic">
                "We warmly invite our guests to embrace rich heritage jewel tones and royal pastels throughout the celebrations."
              </div>
            </div>

            <div className="relative flex justify-between text-[10px] font-['Marcellus'] text-[#8C7A65] pt-2 border-t border-[#D9CDB8]">
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

            <div className="relative text-left space-y-2.5">
              <div>
                <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-[#8C6D2B] font-['Marcellus'] block">
                  The Venue
                </span>
                <h3 className="font-['Marcellus'] text-xl font-bold text-[#2A1E14] tracking-wide mt-0.5">
                  The Oberoi Udaivilas
                </h3>
                <p className="font-['Cormorant_Garamond'] text-xs text-[#735E44] italic">
                  Lake Pichola, Udaipur, Rajasthan
                </p>
              </div>

              <p className="font-['Cormorant_Garamond'] text-xs sm:text-sm text-[#4E3E2E] leading-relaxed italic">
                "Surrounded by the serene waters of Lake Pichola and the grand Aravalli hills, The Oberoi Udaivilas stands as a breathtaking tribute to the architectural heritage of Mewar."
              </p>

              <div className="space-y-1.5 text-xs font-['Inter_Tight'] text-[#4E3E2E]">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#8C6D2B] shrink-0 mt-0.5" />
                  <span>Direct private shikara boat transfers available from Trident Jetty</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#8C6D2B] shrink-0 mt-0.5" />
                  <span>Guest check-in: 12:00 PM on 28th November 2026</span>
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 py-1.5 px-3 border border-[#8C6D2B] rounded text-[#705527] bg-[#FAF5EC] hover:bg-[#F0E8D9] text-[11px] font-['Marcellus'] font-semibold uppercase tracking-wider transition-colors w-fit"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Open in Google Maps</span>
              </a>
            </div>

            <div className="relative flex justify-between text-[10px] font-['Marcellus'] text-[#8C7A65] pt-2 border-t border-[#D9CDB8]">
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

            <div className="relative text-left space-y-2.5">
              <div>
                <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-[#8C6D2B] font-['Marcellus'] block">
                  Yatra & Niwas
                </span>
                <h3 className="font-['Marcellus'] text-xl font-bold text-[#2A1E14] tracking-wide mt-0.5">
                  Guest Stays & Transfers
                </h3>
              </div>

              <div className="space-y-2 text-xs font-['Inter_Tight'] text-[#45382B]">
                <div className="p-2.5 bg-[#FAF4E8]/90 rounded border border-[#E2D5BE]">
                  <span className="font-semibold text-[#8C1E2B] font-['Marcellus'] block">The Oberoi Udaivilas</span>
                  <span className="text-[11px] text-[#635340]">Primary Venue • Code: "ABHISHEK-ISHITA-26"</span>
                </div>
                <div className="p-2.5 bg-[#FAF4E8]/90 rounded border border-[#E2D5BE]">
                  <span className="font-semibold text-[#8C1E2B] font-['Marcellus'] block">Trident Hotel, Udaipur</span>
                  <span className="text-[11px] text-[#635340]">Adjacent Luxury Wing • 3 mins via private shuttle</span>
                </div>
              </div>

              <div className="space-y-1 text-xs text-[#4F3F2E] font-['Inter_Tight'] pt-1 border-t border-[#E8DECD]">
                <span className="font-semibold block text-[11px] text-[#8C6D2B] uppercase tracking-wider font-['Marcellus']">
                  Airport Information
                </span>
                <p className="text-[11px] leading-relaxed">
                  Maharana Pratap Airport (UDR) is 45 minutes away. Dedicated luxury chauffeur vehicles will be stationed at the airport for all arriving flights.
                </p>
              </div>
            </div>

            <div className="relative flex justify-between text-[10px] font-['Marcellus'] text-[#8C7A65] pt-2 border-t border-[#D9CDB8]">
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
              <span className="text-[9px] uppercase tracking-[0.22em] font-semibold text-[#8C6D2B] font-['Marcellus'] block">
                ॥ सादर आमंत्रण ॥
              </span>
              <h3 className="font-['Marcellus'] text-lg font-bold text-[#2A1E14] tracking-wide mb-1">
                Kindly Confirm Attendance
              </h3>
              <RsvpForm />
            </div>

            <div className="relative flex justify-between text-[10px] font-['Marcellus'] text-[#8C7A65] pt-2 border-t border-[#D9CDB8] mt-2">
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

            <div className="w-full bg-[#FAF5ED]/95 border border-[#D4AF37]/60 p-3 rounded-lg shadow-[0_4px_20px_rgba(212,175,55,0.15)]">
              <span className="text-[9px] uppercase tracking-[0.25em] font-semibold text-[#8C6D2B] font-['Marcellus'] block mb-1.5 gold-foil-text">
                Countdown to 30th November 2026
              </span>
              <div className="grid grid-cols-4 gap-1.5 select-none pointer-events-none">
                <div className="bg-white/95 p-1.5 rounded border border-[#E0D4C1] shadow-inner">
                  <span className="font-['Marcellus'] text-lg font-bold text-[#2A1E14] block">{timeLeft.days}</span>
                  <span className="text-[8px] uppercase font-['Inter_Tight'] text-[#8C7A65]">Days</span>
                </div>
                <div className="bg-white/95 p-1.5 rounded border border-[#E0D4C1] shadow-inner">
                  <span className="font-['Marcellus'] text-lg font-bold text-[#2A1E14] block">{timeLeft.hours}</span>
                  <span className="text-[8px] uppercase font-['Inter_Tight'] text-[#8C7A65]">Hours</span>
                </div>
                <div className="bg-white/95 p-1.5 rounded border border-[#E0D4C1] shadow-inner">
                  <span className="font-['Marcellus'] text-lg font-bold text-[#2A1E14] block">{timeLeft.minutes}</span>
                  <span className="text-[8px] uppercase font-['Inter_Tight'] text-[#8C7A65]">Mins</span>
                </div>
                <div className="bg-white/95 p-1.5 rounded border border-[#D4AF37]/80 shadow-inner">
                  <span className="font-['Marcellus'] text-lg font-bold text-[#8C1E2B] block animate-pulse">{timeLeft.seconds}</span>
                  <span className="text-[8px] uppercase font-['Inter_Tight'] text-[#8C1E2B] font-semibold">Secs</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <p className="font-['Alex_Brush'] text-2xl text-[#8C1E2B]">
                With folded hands & deepest love,
              </p>
              <p className="font-['Marcellus'] text-base font-bold gold-foil-heading tracking-widest">
                ABHISHEK & ISHITA
              </p>
              <p className="font-['Noto_Serif_Devanagari'] text-[11px] text-[#8C6D2B] font-semibold">
                ॥ आपका स्नेह एवं आशीर्वाद ही हमारी सबसे बड़ी पूंजी है ॥
              </p>
            </div>

            <div className="pt-1">
              <WaxSeal size={62} monogram="अ & इ" color="#8C1E2B" />
            </div>

            <button
              type="button"
              onClick={onCloseToShelf}
              className="py-1.5 px-4 border border-[#8C6D2B] bg-[#FAF5EC] hover:bg-[#7A1522] hover:text-[#FAF6ED] text-[#705527] text-[11px] font-['Marcellus'] tracking-wider uppercase rounded-full shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Return to Library
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

  // Active base pages:
  const leftBasePage = activeFlip ? activeFlip.baseLeftPage : currentSpread * 2;
  const rightBasePage = activeFlip ? activeFlip.baseRightPage : currentSpread * 2 + 1;

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden select-none">
      {/* 1. Regal Header Bar */}
      <header className="w-full pt-3 sm:pt-4 pb-2 px-3 sm:px-10 flex justify-between items-center z-30">
        <button
          type="button"
          onClick={onCloseToShelf}
          className="inline-flex items-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 px-3 sm:px-4 border border-[#D4AF37]/70 hover:border-[#D4AF37] hover:bg-[#7A1522] hover:text-[#FAF6ED] bg-[#FAF6EE]/90 text-[#4A3824] rounded-full text-[11px] sm:text-xs font-['Marcellus'] tracking-wider uppercase font-semibold shadow-md transition-all cursor-pointer backdrop-blur-sm"
        >
          <Book className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Return to Library</span>
          <span className="sm:hidden">Library</span>
        </button>

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
              title="Phoolon Ki Varsha (Shower Flowers)"
              className="py-1.5 sm:py-2 px-2.5 sm:px-3.5 border border-[#D4AF37]/70 bg-[#FAF6EE]/90 hover:bg-[#7A1522] hover:text-[#FAF6ED] text-[#7A1522] rounded-full text-xs font-['Marcellus'] font-semibold transition-all cursor-pointer shadow-md hover:scale-105 flex items-center gap-1.5 backdrop-blur-sm"
            >
              <Heart className="w-3.5 h-3.5 fill-current text-[#D9384B]" />
              <span className="hidden sm:inline">Phoolon Ki Varsha</span>
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
          {INDIAN_CHAPTERS.map((ch) => (
            <button
              key={ch.id}
              onClick={() => jumpToSpread(ch.spread)}
              className={`px-3 sm:px-3.5 py-1 rounded-full text-[10px] sm:text-[10.5px] font-['Marcellus'] tracking-wider uppercase font-semibold transition-all whitespace-nowrap cursor-pointer ${
                currentSpread === ch.spread
                  ? 'bg-gradient-to-r from-[#94192B] to-[#700F1E] text-[#FAF6ED] border border-[#D4AF37]/70 shadow'
                  : 'text-[#D8C6A8] hover:text-[#FAF6ED] hover:bg-white/10'
              }`}
            >
              {ch.title}
            </button>
          ))}
        </div>
      </nav>

      {/* 2b. Mobile Sub-page Indicator & Side Switcher */}
      {isMobile && (
        <div className="w-full flex justify-center items-center gap-2 py-1 z-30 animate-fadeIn">
          <button
            type="button"
            onClick={() => {
              if (mobileSide !== 'left') {
                sound.playPageFlip();
                setMobileAnim('backward');
                setMobileSide('left');
              }
            }}
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
            onClick={() => {
              if (mobileSide !== 'right') {
                sound.playPageFlip();
                setMobileAnim('forward');
                setMobileSide('right');
              }
            }}
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
          disabled={isMobile ? (currentSpread === 0 && mobileSide === 'left') : (currentSpread === 0 || Boolean(activeFlip))}
          className={`absolute left-1 sm:left-6 md:left-10 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full border-2 border-[#D4AF37] bg-[#7A1522] text-[#FAF6ED] flex items-center justify-center transition-all z-40 shadow-2xl ${
            (isMobile ? (currentSpread === 0 && mobileSide === 'left') : currentSpread === 0)
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
          disabled={isMobile ? (currentSpread >= 7 && mobileSide === 'right') : (currentSpread >= 7 || Boolean(activeFlip))}
          className={`absolute right-1 sm:right-6 md:right-10 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full border-2 border-[#D4AF37] bg-[#7A1522] text-[#FAF6ED] flex items-center justify-center transition-all z-40 shadow-2xl ${
            (isMobile ? (currentSpread >= 7 && mobileSide === 'right') : currentSpread >= 7)
              ? 'opacity-25 cursor-not-allowed'
              : 'hover:scale-110 active:scale-95 cursor-pointer hover:bg-[#94192B]'
          }`}
          aria-label="Next Page"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Outer Shadow & Padded Velvet Hardcover Frame matching the active event */}
        <div
          className="relative p-2 sm:p-3.5 rounded-xl shadow-[0_20px_60px_rgba(15,5,8,0.75)] border-2 border-[#D4AF37]/80 bg-cover bg-center transition-all duration-500 max-w-full"
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
              {isMobile ? `${currentSpread * 2 + (mobileSide === 'right' ? 2 : 1)}/16` : `${currentSpread + 1}/8`}
            </span>
          </div>

          {/* THE BOOK STAGE CONTAINER WITH SWIPE & TOUCH DRAG SUPPORT */}
          <div
            className={`book-stage-3d relative ${
              isMobile
                ? 'w-[92vw] max-w-[430px] h-[72vh] max-h-[620px] min-h-[480px]'
                : 'w-[90vw] max-w-[940px] h-[580px] sm:h-[620px]'
            } rounded shadow-2xl ${isSwiping ? 'cursor-grabbing' : ''}`}
            style={{ touchAction: 'pan-y' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {isMobile ? (
              /* MOBILE: SINGLE FULL-WIDTH PAGE VIEW */
              <div
                key={`mobile-page-${currentSpread}-${mobileSide}`}
                className={`w-full h-full relative overflow-y-auto overflow-x-hidden rounded shadow-xl ${
                  mobileAnim === 'forward'
                    ? 'mobile-page-forward'
                    : mobileAnim === 'backward'
                    ? 'mobile-page-backward'
                    : ''
                }`}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {renderPage(currentSpread * 2 + (mobileSide === 'right' ? 1 : 0))}
              </div>
            ) : (
              /* DESKTOP: DUAL SPREAD WITH 3D TURNING LEAF */
              <>
                <div className="book-spread-surface w-full h-full flex">
                  {/* Left Page Surface */}
                  <div
                    className={`w-1/2 h-full overflow-hidden relative group ${
                      currentSpread === 7 ? 'cursor-default' : 'cursor-pointer'
                    }`}
                    title={currentSpread === 7 ? 'RSVP Form (Swipe left/right to turn pages)' : 'Click or swipe right to turn back'}
                  >
                    {renderPage(leftBasePage)}
                    {currentSpread > 0 && !activeFlip && (
                      <div className="corner-curl-hint left group-hover:scale-110" />
                    )}
                    {activeFlip && activeFlip.direction === 'next' && (
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-transparent pointer-events-none transition-opacity duration-200"
                        style={{
                          opacity: Math.abs(flipAngle) >= 90 ? ((Math.abs(flipAngle) - 90) / 90) * 0.45 : 0,
                        }}
                      />
                    )}
                  </div>

                  {/* Right Page Surface */}
                  <div
                    className="w-1/2 h-full overflow-hidden relative cursor-pointer group"
                    title="Click or swipe left to turn forward"
                  >
                    {renderPage(rightBasePage)}
                    {currentSpread < 7 && !activeFlip && (
                      <div className="corner-curl-hint right group-hover:scale-110" />
                    )}
                    {activeFlip && activeFlip.direction === 'prev' && (
                      <div
                        className="absolute inset-0 bg-gradient-to-l from-black/25 via-transparent to-transparent pointer-events-none transition-opacity duration-200"
                        style={{
                          opacity: flipAngle >= 90 ? ((flipAngle - 90) / 90) * 0.45 : 0,
                        }}
                      />
                    )}
                  </div>

                  {/* Authentic Spine Crease Shadow */}
                  <div className="spine-crease-shadow" />
                </div>

                {/* 3D Hardware-Accelerated Turning Leaf - FORWARD (Right to Left) */}
                {activeFlip && activeFlip.direction === 'next' && (
                  <div
                    className="turning-leaf absolute top-0 bottom-0 left-1/2 w-1/2 h-full pointer-events-none"
                    onTransitionEnd={handleTransitionEnd}
                    style={{
                      transformOrigin: 'left center',
                      transform: `rotateY(${flipAngle}deg)`,
                      transition: 'transform 660ms cubic-bezier(0.25, 0.85, 0.35, 1)',
                    }}
                  >
                    <div className="leaf-face border-r border-[#D4AF37]/60">
                      {renderPage(activeFlip.leafFrontPage)}
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-transparent pointer-events-none transition-opacity duration-200"
                        style={{ opacity: Math.abs(flipAngle) < 90 ? Math.abs(flipAngle) / 110 : 0 }}
                      />
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none transition-opacity duration-200"
                        style={{ opacity: Math.abs(flipAngle) < 90 ? Math.sin((Math.abs(flipAngle) / 90) * Math.PI) * 0.45 : 0 }}
                      />
                    </div>

                    <div className="leaf-face leaf-face-back border-l border-[#D4AF37]/60">
                      {renderPage(activeFlip.leafBackPage)}
                      <div
                        className="absolute inset-0 bg-gradient-to-l from-black/45 via-black/10 to-transparent pointer-events-none transition-opacity duration-200"
                        style={{ opacity: Math.abs(flipAngle) >= 90 ? (180 - Math.abs(flipAngle)) / 110 : 0 }}
                      />
                      <div
                        className="absolute inset-0 bg-gradient-to-l from-transparent via-white/15 to-transparent pointer-events-none transition-opacity duration-200"
                        style={{ opacity: Math.abs(flipAngle) >= 90 ? Math.sin(((180 - Math.abs(flipAngle)) / 90) * Math.PI) * 0.45 : 0 }}
                      />
                    </div>
                  </div>
                )}

                {/* 3D Hardware-Accelerated Turning Leaf - BACKWARD (Left to Right) */}
                {activeFlip && activeFlip.direction === 'prev' && (
                  <div
                    className="turning-leaf absolute top-0 bottom-0 left-0 w-1/2 h-full pointer-events-none"
                    onTransitionEnd={handleTransitionEnd}
                    style={{
                      transformOrigin: 'right center',
                      transform: `rotateY(${flipAngle}deg)`,
                      transition: 'transform 660ms cubic-bezier(0.25, 0.85, 0.35, 1)',
                    }}
                  >
                    <div className="leaf-face border-l border-[#D4AF37]/60">
                      {renderPage(activeFlip.leafFrontPage)}
                      <div
                        className="absolute inset-0 bg-gradient-to-l from-black/45 via-black/10 to-transparent pointer-events-none transition-opacity duration-200"
                        style={{ opacity: flipAngle < 90 ? flipAngle / 110 : 0 }}
                      />
                      <div
                        className="absolute inset-0 bg-gradient-to-l from-transparent via-white/15 to-transparent pointer-events-none transition-opacity duration-200"
                        style={{ opacity: flipAngle < 90 ? Math.sin((flipAngle / 90) * Math.PI) * 0.45 : 0 }}
                      />
                    </div>

                    <div className="leaf-face leaf-face-back border-r border-[#D4AF37]/60">
                      {renderPage(activeFlip.leafBackPage)}
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-transparent pointer-events-none transition-opacity duration-200"
                        style={{ opacity: flipAngle >= 90 ? (180 - flipAngle) / 110 : 0 }}
                      />
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none transition-opacity duration-200"
                        style={{ opacity: flipAngle >= 90 ? Math.sin(((180 - flipAngle) / 90) * Math.PI) * 0.45 : 0 }}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* 4. Bottom Page Number Footer */}
      <footer className="w-full pb-2.5 sm:pb-3 px-4 sm:px-6 flex justify-between items-center text-xs font-['Inter_Tight'] text-[#705F4D] z-30">
        <span className="tracking-wider uppercase text-[9.5px] sm:text-[10px]">
          {isMobile ? (
            <span>Swipe to turn page</span>
          ) : (
            <span>
              Swipe or click pages • arrows <kbd className="px-1.5 py-0.5 border border-[#C5BCAD] rounded bg-white/80">←</kbd> and{' '}
              <kbd className="px-1.5 py-0.5 border border-[#C5BCAD] rounded bg-white/80">→</kbd> to turn
            </span>
          )}
        </span>

        <span className="font-['Marcellus'] tracking-widest text-[#8C6D2B] font-bold uppercase text-[10.5px] sm:text-[11px]">
          {isMobile
            ? `Page ${currentSpread * 2 + (mobileSide === 'right' ? 2 : 1)} of 16`
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

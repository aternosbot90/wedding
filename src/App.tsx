/**
 * Abhishek weds Ishita — Shubh Vivah Patrika & 3D Keepsake Shelf
 * Seamless 3D Physics Shelf + Flowing Geometric Book Opening + 3D Realistic Page Turns
 */

import React, { useEffect, useRef, useState } from 'react';
import { Heart, Music } from 'lucide-react';
import { INDIAN_VOLUMES, IndianBookVolume } from './types/wedding';
import { OpenBook } from './components/OpenBook';
import { RosePetals } from './components/RosePetals';
import { RoyalIntro } from './components/RoyalIntro';
import { sound } from './utils/audio';

const CEREMONY_TABS = [
  { label: 'ALL / संपूर्ण', bookIndex: 0 },
  { label: 'PATRIKA (आमंत्रण)', bookIndex: 0 },
  { label: 'PREM KAHANI (कहानी)', bookIndex: 1 },
  { label: 'HALDI & MEHNDI (हल्दी)', bookIndex: 2 },
  { label: 'SANGEET (संगीत)', bookIndex: 3 },
  { label: 'SHUBH VIVAH (विवाह)', bookIndex: 4 },
  { label: 'POSHAK (पोशाक)', bookIndex: 5 },
  { label: 'RSVP (स्वीकृति)', bookIndex: 7 },
];

function smoothstep(x: number): number {
  const c = Math.max(0, Math.min(1, x));
  return c * c * (3 - 2 * c);
}

function B(r: number): number {
  if (Math.abs(r) < 1) {
    return (r + Math.sin(Math.PI * r) / Math.PI) / 2;
  }
  return Math.sign(r) * 0.5;
}

export default function App() {
  const probeRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorPillTextRef = useRef<HTMLSpanElement>(null);
  const playRingRef = useRef<HTMLButtonElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  // Caption lines
  const titleMaskRef = useRef<HTMLDivElement>(null);
  const subMaskRef = useRef<HTMLDivElement>(null);
  const yearMaskRef = useRef<HTMLDivElement>(null);

  // Ceremony tab elements
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tabIndicatorRef = useRef<HTMLDivElement>(null);

  // 40 Books elements (5 complete cycles of 8 ceremony volumes for seamless wrap)
  const TOTAL_TAPES = 40;
  const tapeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const spineFaceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const coverFaceRefs = useRef<(HTMLDivElement | null)[]>([]);

  // State management
  const [showIntro, setShowIntro] = useState(true);
  const [activeBook, setActiveBook] = useState<IndianBookVolume>(INDIAN_VOLUMES[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetSpread, setTargetSpread] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [petalsActive, setPetalsActive] = useState(true);
  const [isMusicOn, setIsMusicOn] = useState(false);

  // Physical motion engine stored in refs for 60fps rAF
  const stateRef = useRef({
    s: 16, // centered in middle loop
    T: 16,
    activeBookIndex: 0,
    H: 400,
    ws: 68,
    d: 210,
    gap: 12,
    mx: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    my: typeof window !== 'undefined' ? window.innerHeight / 2 : 400,
    cx: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    cy: typeof window !== 'undefined' ? window.innerHeight / 2 : 400,
    tiltX: 0,
    tiltY: 0,
    onCover: false,
    hoveredIndex: -1,
    isOpen: false,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    dragStartT: 16,
    dragMoved: false,
    cursorState: 'default',
    lift: new Array(40).fill(0),
    liftTarget: new Array(40).fill(0),
    lastTime: performance.now(),
    wheelTimeout: 0 as unknown as ReturnType<typeof setTimeout>,
    prefersReducedMotion: false,
  });

  useEffect(() => {
    const s = stateRef.current;
    s.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const measureDimensions = () => {
      if (probeRef.current && stageRef.current) {
        const measuredH = probeRef.current.offsetHeight || 380;
        s.H = measuredH;
        s.ws = (measuredH * 142) / 840;
        s.d = (measuredH * 474) / 900;
        s.gap = measuredH * 0.03;

        stageRef.current.style.setProperty('--ws', `${s.ws.toFixed(2)}px`);
        stageRef.current.style.setProperty('--d', `${s.d.toFixed(2)}px`);
      }
    };

    measureDimensions();
    window.addEventListener('resize', measureDimensions);

    // Initial caption spans
    const initCaption = (vol: IndianBookVolume) => {
      if (titleMaskRef.current) {
        titleMaskRef.current.innerHTML = `<span class="caption-item" style="display:block; width:100%; text-align:center;">${vol.title}</span>`;
      }
      if (subMaskRef.current) {
        subMaskRef.current.innerHTML = `<span class="caption-item lbl caption-sub" style="display:block; width:100%; text-align:center;">${vol.hindiTitle} • ${vol.subtitle}</span>`;
      }
      if (yearMaskRef.current) {
        yearMaskRef.current.innerHTML = `<span class="caption-item caption-year" style="display:block; width:100%; text-align:center;">UDAIPUR • 28–30 NOVEMBER 2026</span>`;
      }
    };
    initCaption(INDIAN_VOLUMES[0]);

    // Position tab indicator
    const updateTabIndicator = (volIdx: number) => {
      const tabIdx = CEREMONY_TABS.findIndex((t) => t.bookIndex === volIdx);
      if (tabIdx >= 0 && tabRefs.current[tabIdx] && tabIndicatorRef.current) {
        const tabEl = tabRefs.current[tabIdx]!;
        tabIndicatorRef.current.style.width = `${tabEl.offsetWidth}px`;
        tabIndicatorRef.current.style.transform = `translateX(${tabEl.offsetLeft}px)`;

        tabRefs.current.forEach((t, i) => {
          if (t) {
            if (i === tabIdx) {
              t.classList.add('active');
            } else {
              t.classList.remove('active');
            }
          }
        });
      }
    };
    updateTabIndicator(0);

    // Touch & Pointer Drag Engine for 3D Bookshelf (Mobile & Desktop)
    let dragStartX = 0;
    let dragStartY = 0;
    let dragStartT = 0;
    let dragStartTime = 0;
    let hasMoved = false;

    const startShelfDrag = (clientX: number, clientY: number) => {
      if (s.isOpen) return;
      s.isDragging = true;
      dragStartX = clientX;
      dragStartY = clientY;
      dragStartT = s.T;
      dragStartTime = performance.now();
      hasMoved = false;
      s.dragMoved = false;
    };

    const moveShelfDrag = (clientX: number, clientY: number) => {
      s.mx = clientX;
      s.my = clientY;

      if (!s.isDragging) return;
      const dx = clientX - dragStartX;
      const dy = clientY - dragStartY;
      const dist = Math.hypot(dx, dy);

      if (dist > 6) {
        hasMoved = true;
        s.dragMoved = true;
        const itemWidth = Math.max(48, s.ws + s.gap);
        s.T = dragStartT - (dx / itemWidth) * 1.25;
      }
    };

    const endShelfDrag = (clientX?: number) => {
      if (!s.isDragging) return;
      s.isDragging = false;

      if (hasMoved && clientX !== undefined) {
        const dx = clientX - dragStartX;
        const dt = Math.max(1, performance.now() - dragStartTime);
        const velocity = dx / dt; // px per ms

        // Fast flick momentum gesture
        if (Math.abs(velocity) > 0.35 && Math.abs(dx) > 16) {
          sound.playShelfSlide();
          const flickStep = velocity > 0 ? -1 : 1;
          s.T = Math.round(s.T + flickStep * 0.5);
        } else {
          s.T = Math.round(s.T);
        }
      } else {
        s.T = Math.round(s.T);
      }

      // Briefly preserve dragMoved so a trailing tap event doesn't trigger book open after swiping
      setTimeout(() => {
        s.dragMoved = false;
        hasMoved = false;
      }, 120);
    };

    const onPointerMove = (e: PointerEvent) => {
      moveShelfDrag(e.clientX, e.clientY);
    };

    const onPointerUp = (e: PointerEvent) => {
      endShelfDrag(e.clientX);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (s.isOpen || e.touches.length !== 1) return;
      const target = e.target as HTMLElement;
      if (target.closest('button, nav, header, footer, .detail-modal, input, select')) return;
      const t = e.touches[0];
      startShelfDrag(t.clientX, t.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!s.isDragging || e.touches.length !== 1) return;
      const t = e.touches[0];
      const dx = t.clientX - dragStartX;
      const dy = t.clientY - dragStartY;

      // When dragging horizontally, prevent browser horizontal page swipe and glide books
      if (Math.abs(dx) > Math.abs(dy) * 0.65 && Math.abs(dx) > 5) {
        if (e.cancelable) e.preventDefault();
        moveShelfDrag(t.clientX, t.clientY);
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      const touch = e.changedTouches[0];
      endShelfDrag(touch ? touch.clientX : undefined);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('pointercancel', onPointerUp, { passive: true });

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });

    // Wheel scrolling
    const onWheel = (e: WheelEvent) => {
      if (s.isOpen) return;
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      s.T += (delta / (s.ws + s.gap)) * 0.5;

      clearTimeout(s.wheelTimeout);
      s.wheelTimeout = setTimeout(() => {
        s.T = Math.round(s.T);
      }, 160);
    };

    // Keyboard navigation
    const onKeyDown = (e: KeyboardEvent) => {
      if (s.isOpen) {
        if (e.key === 'Escape') closeDetailView();
        return;
      }
      if (e.key === 'ArrowLeft') {
        s.T = Math.round(s.T) - 1;
      } else if (e.key === 'ArrowRight') {
        s.T = Math.round(s.T) + 1;
      } else if (e.key === 'Enter' || e.key === ' ') {
        openDetailView();
      }
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('keydown', onKeyDown);

    // Swap text inside masked line
    const swapLineText = (
      container: HTMLElement | null,
      newContent: string,
      classes: string,
      dir: number
    ) => {
      if (!container) return;
      const oldSpans = Array.from(
        container.querySelectorAll<HTMLSpanElement>('span.caption-item:not(.leaving)')
      );

      const newSpan = document.createElement('span');
      newSpan.className = `caption-item ${classes}`;
      newSpan.innerHTML = newContent;
      newSpan.style.display = 'block';
      newSpan.style.position = oldSpans.length > 0 ? 'absolute' : 'relative';
      newSpan.style.width = '100%';
      newSpan.style.textAlign = 'center';
      container.appendChild(newSpan);

      const duration = s.prefersReducedMotion ? 1 : 650;
      const easing = 'cubic-bezier(.2,.8,.2,1)';

      newSpan.animate(
        [{ transform: `translateY(${dir * 105}%)` }, { transform: 'translateY(0%)' }],
        { duration, easing, fill: 'both' }
      );

      oldSpans.forEach((span) => {
        span.classList.add('leaving');
        const anim = span.animate(
          [{ transform: 'translateY(0%)' }, { transform: `translateY(${-dir * 105}%)` }],
          { duration, easing, fill: 'both' }
        );
        anim.onfinish = () => span.remove();
      });
    };

    // The Iconic 3D Shelf Animation Loop
    let animId = 0;
    const renderLoop = (time: number) => {
      let dt = (time - s.lastTime) / 1000;
      s.lastTime = time;
      if (dt > 0.05) dt = 0.05;

      const W = window.innerWidth;
      const H_viewport = window.innerHeight;
      const shelfCenterY = H_viewport * 0.5;

      // Spring movement
      if (s.prefersReducedMotion) {
        s.s = s.T;
      } else {
        const k = s.isDragging ? 18 : 5.2;
        s.s += (s.T - s.s) * (1 - Math.exp(-k * dt));
        if (Math.abs(s.T - s.s) < 1e-4) {
          s.s = s.T;
        }
      }

      // Normalising loops beyond ±4 full loops
      if (s.s > 48) {
        s.s -= TOTAL_TAPES;
        s.T -= TOTAL_TAPES;
        if (s.dragStartT) s.dragStartT -= TOTAL_TAPES;
      } else if (s.s < -8) {
        s.s += TOTAL_TAPES;
        s.T += TOTAL_TAPES;
        if (s.dragStartT) s.dragStartT += TOTAL_TAPES;
      }

      // Detect active book change
      const nearestVirtual = Math.round(s.s);
      const activeIdx = ((nearestVirtual % 8) + 8) % 8;
      if (activeIdx !== s.activeBookIndex) {
        const dir = Math.sign(s.T - s.s) || 1;
        const nextVol = INDIAN_VOLUMES[activeIdx];
        s.activeBookIndex = activeIdx;
        setActiveBook(nextVol);

        swapLineText(titleMaskRef.current, nextVol.title, 'caption-title', dir);
        swapLineText(
          subMaskRef.current,
          `${nextVol.hindiTitle} • ${nextVol.subtitle}`,
          'lbl caption-sub',
          dir
        );
        swapLineText(
          yearMaskRef.current,
          'UDAIPUR • 28–30 NOVEMBER 2026',
          'caption-year',
          dir
        );
        updateTabIndicator(activeIdx);
      }

      // Tilt calculations
      const distFromCenter = Math.abs(s.mx - W / 2);
      const distFromShelfCenter = Math.abs(s.my - shelfCenterY);
      const onCoverNow =
        distFromCenter <= 0.55 * s.d &&
        distFromShelfCenter <= 0.55 * s.H &&
        !s.isOpen &&
        Math.abs(s.T - s.s) < 0.3;

      s.onCover = onCoverNow;

      let targetTiltY = 0;
      let targetTiltX = 0;
      if (onCoverNow) {
        targetTiltY = ((s.mx - W / 2) / (0.55 * s.d)) * 9;
        targetTiltX = -((s.my - shelfCenterY) / (s.H / 2)) * 6;
      } else {
        targetTiltY = ((s.mx - W / 2) / W) * 5;
        targetTiltX = 0;
      }

      s.tiltY += (targetTiltY - s.tiltY) * (1 - Math.exp(-7 * dt));
      s.tiltX += (targetTiltX - s.tiltX) * (1 - Math.exp(-7 * dt));

      // Cursor smoothing and state
      s.cx += (s.mx - s.cx) * (1 - Math.exp(-16 * dt));
      s.cy += (s.my - s.cy) * (1 - Math.exp(-16 * dt));

      if (cursorRef.current) {
        if (s.isOpen) {
          cursorRef.current.style.display = 'none';
        } else {
          cursorRef.current.style.display = 'block';
          cursorRef.current.style.transform = `translate3d(${s.cx.toFixed(1)}px, ${s.cy.toFixed(1)}px, 0)`;

          let nextCursorState = 'default';
          if (onCoverNow) {
            nextCursorState = 'open';
            if (cursorPillTextRef.current) {
              cursorPillTextRef.current.textContent = 'खोलें • OPEN';
            }
          } else if (s.hoveredIndex !== -1 && Math.abs(s.hoveredIndex - s.s) > 0.45) {
            nextCursorState = 'spine';
            if (cursorPillTextRef.current) {
              cursorPillTextRef.current.textContent = 'देखें • SELECT';
            }
          } else {
            const elemUnder = document.elementFromPoint(s.mx, s.my);
            if (elemUnder && elemUnder.closest('button, a')) {
              nextCursorState = 'btn';
            }
          }

          if (nextCursorState !== s.cursorState) {
            cursorRef.current.classList.remove('state-spine', 'state-btn', 'state-open');
            if (nextCursorState !== 'default') {
              cursorRef.current.classList.add(`state-${nextCursorState}`);
            }
            s.cursorState = nextCursorState;
          }
        }
      }

      // Update Play Ring
      if (playRingRef.current) {
        const ringLeft = W / 2 - 0.5 * s.d - 8;
        const ringTop = shelfCenterY + 0.36 * s.H;
        playRingRef.current.style.left = `${ringLeft.toFixed(1)}px`;
        playRingRef.current.style.top = `${ringTop.toFixed(1)}px`;

        const ringScale = s.isOpen ? 0 : smoothstep(Math.max(0, 1 - Math.abs(s.T - s.s) * 3));
        playRingRef.current.style.transform = `translate(-50%, -50%) scale(${ringScale.toFixed(3)})`;
      }

      // Render each of the 40 tapes (books)
      for (let v = 0; v < TOTAL_TAPES; v++) {
        const tapeEl = tapeRefs.current[v];
        if (!tapeEl) continue;

        let r = (v - s.s) % TOTAL_TAPES;
        if (r > TOTAL_TAPES / 2) r -= TOTAL_TAPES;
        if (r < -TOTAL_TAPES / 2) r += TOTAL_TAPES;

        // Exact horizontal placement formula
        const x = r * (s.ws + s.gap) + (s.d - s.ws + 1.6 * s.gap) * B(r);

        // Culling
        if (Math.abs(x) > W / 2 + 1.5 * s.d) {
          tapeEl.style.visibility = 'hidden';
          continue;
        }
        tapeEl.style.visibility = 'visible';

        // Hover lift easing
        const targetLift = s.liftTarget[v];
        s.lift[v] += (targetLift - s.lift[v]) * (1 - Math.exp(-12 * dt));

        // Openness o
        const o = smoothstep(Math.max(0, 1 - Math.abs(r)));
        const rotY = -90 * o + s.tiltY * o;
        const rotX = s.tiltX * o;
        const rotZ = -4.5 * o;
        const trZ = o * 0.2 * s.H;
        const trY = -o * 0.025 * s.H - s.lift[v] * 0.045 * s.H;

        tapeEl.style.transform = `translate3d(${x.toFixed(2)}px, ${trY.toFixed(2)}px, ${trZ.toFixed(2)}px) rotateZ(${rotZ.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
        tapeEl.style.zIndex = `${Math.round(100 - Math.abs(r) * 4)}`;

        // Dynamic shading
        const spFace = spineFaceRefs.current[v];
        const cvFace = coverFaceRefs.current[v];
        if (spFace) {
          spFace.style.setProperty('--shade', (o * 0.55).toFixed(3));
        }
        if (cvFace) {
          cvFace.style.setProperty('--shade', ((1 - o) * 0.5).toFixed(3));
        }
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', measureDimensions);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  // FLOWING BOOK OPENING (Smooth Royal Bloom & Scale - No flash, No clip-path jerk)
  const openDetailView = () => {
    const s = stateRef.current;
    if (s.isOpen) return;
    s.isOpen = true;
    s.T = Math.round(s.s);

    const vol = INDIAN_VOLUMES[s.activeBookIndex];
    setActiveBook(vol);
    setTargetSpread(vol.targetSpread);
    setIsModalOpen(true);

    sound.playPageFlip();
    sound.playCelebrationChime();

    const detailEl = detailRef.current;
    if (!detailEl) return;

    detailEl.style.transformOrigin = '50% 50%';
    detailEl.style.visibility = 'visible';

    // Hardware-accelerated smooth scale bloom and fade into view
    detailEl.animate(
      [
        {
          opacity: 0,
          transform: 'scale(0.88) translateY(24px)',
        },
        {
          opacity: 1,
          transform: 'scale(1) translateY(0px)',
        },
      ],
      {
        duration: s.prefersReducedMotion ? 1 : 600,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'both',
      }
    );
  };

  // FLOWING BOOK CLOSING (Smooth gentle ease-down back into shelf view)
  const closeDetailView = () => {
    const s = stateRef.current;
    if (!s.isOpen) return;

    sound.playPageFlip();

    const detailEl = detailRef.current;
    if (!detailEl) {
      s.isOpen = false;
      setIsModalOpen(false);
      return;
    }

    const closeAnim = detailEl.animate(
      [
        {
          opacity: 1,
          transform: 'scale(1) translateY(0px)',
        },
        {
          opacity: 0,
          transform: 'scale(0.92) translateY(20px)',
        },
      ],
      {
        duration: s.prefersReducedMotion ? 1 : 420,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'both',
      }
    );

    closeAnim.onfinish = () => {
      detailEl.style.visibility = 'hidden';
      s.isOpen = false;
      setIsModalOpen(false);
    };
  };

  // Direct Book Interaction:
  // Tapping ANY book opens that ceremony volume immediately without needing to click only on the play button!
  const onTapeClick = (v: number) => {
    const s = stateRef.current;
    if (s.dragMoved) return;

    const volIdx = ((v % 8) + 8) % 8;
    s.activeBookIndex = volIdx;
    const vol = INDIAN_VOLUMES[volIdx];
    setActiveBook(vol);
    setTargetSpread(vol.targetSpread);

    openDetailView();
  };

  const onTabClick = (tab: (typeof CEREMONY_TABS)[0]) => {
    const s = stateRef.current;
    const curIdx = ((Math.round(s.T) % 8) + 8) % 8;
    let diff = (tab.bookIndex - curIdx) % 8;
    if (diff > 4) diff -= 8;
    if (diff < -4) diff += 8;
    s.T = Math.round(s.T) + diff;
  };

  const onShelfPointerDown = (e: React.PointerEvent) => {
    const s = stateRef.current;
    if (s.isOpen) return;
    s.dragMoved = false;
  };

  const onShelfPointerUp = () => {
    const s = stateRef.current;
    if (s.isDragging) {
      s.isDragging = false;
      s.T = Math.round(s.T);
      setTimeout(() => {
        s.dragMoved = false;
      }, 100);
    }
  };

  const triggerPetalShower = () => {
    setPetalsActive(false);
    setTimeout(() => setPetalsActive(true), 50);
  };

  return (
    <div
      className="relative w-screen h-screen overflow-hidden select-none bg-[var(--paper)] text-[var(--ink)]"
      onPointerUp={onShelfPointerUp}
      onPointerCancel={onShelfPointerUp}
    >
      {/* Hidden probe element for measuring responsive var(--H) */}
      <div
        id="h-probe"
        ref={probeRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          visibility: 'hidden',
          pointerEvents: 'none',
          height: 'var(--H)',
        }}
      />

      {/* Royal Paper Grain Overlay */}
      <svg
        className="paper-grain"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        aria-hidden="true"
      >
        <filter id="grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.45  0 0 0 0 0.40  0 0 0 0 0.35  0 0 0 0.16 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-filter)" />
      </svg>

      {/* Fragrant Phoolon Ki Varsha (Rose & Saffron Marigold Petals) */}
      <RosePetals active={petalsActive} />

      {/* Top Auspicious Bar */}
      <header className="top-bar">
        <div className="flex justify-start items-center gap-1 sm:gap-2">
          <button
            type="button"
            className="lbl box hidden sm:inline-flex"
            onClick={() => {
              const s = stateRef.current;
              s.T = 16;
            }}
          >
            ॥ श्री गणेशाय नमः ॥
          </button>

          <button
            type="button"
            className="lbl box text-[9px] sm:text-[9.5px] px-2 sm:px-3 border-[#D4AF37] hover:bg-[#7A1522] text-[#7A1522] hover:text-[#FAF6ED]"
            onClick={() => setShowIntro(true)}
            title="Replay Royal Farman Invitation"
          >
            ✦ आमंत्रण
          </button>
        </div>

        <div className="brand-logo">
          <span className="brand-logo-hi gold-foil-heading">अभिषेक संग इशिता</span>
          <span className="brand-logo-en gold-foil-text font-bold">ABHISHEK WEDS ISHITA</span>
        </div>

        <div className="flex justify-end items-center gap-2 sm:gap-3">
          {/* Palace Music Toggle */}
          <button
            type="button"
            onClick={() => {
              const playing = sound.toggleMusic();
              setIsMusicOn(playing);
            }}
            title={isMusicOn ? 'Pause Palace Sitar & Shehnai' : 'Play Palace Sitar & Shehnai'}
            className={`p-1.5 sm:px-3 sm:py-1.5 border border-[#D4AF37]/70 rounded-full transition-all cursor-pointer shadow-md flex items-center gap-1.5 text-xs font-['Marcellus'] ${
              isMusicOn
                ? 'bg-[#7A1522] text-[#FAF6ED] border-[#D4AF37] ring-1 ring-[#D4AF37]'
                : 'bg-[#FAF6EE]/90 hover:bg-[#7A1522] hover:text-[#FAF6ED] text-[#5C4834]'
            }`}
          >
            <Music className={`w-3.5 h-3.5 ${isMusicOn ? 'text-[#F5DE98] animate-pulse' : ''}`} />
            <span className="hidden sm:inline text-[9.5px] tracking-wider uppercase font-semibold">
              {isMusicOn ? 'Music On' : 'Palace Music'}
            </span>
          </button>

          {/* Phoolon Ki Varsha */}
          <button
            type="button"
            onClick={() => {
              sound.playCelebrationChime();
              triggerPetalShower();
            }}
            title="Phoolon Ki Varsha"
            className="p-1.5 sm:px-3 sm:py-1.5 border border-[#D4AF37]/70 bg-[#FAF6EE]/90 hover:bg-[#7A1522] hover:text-[#FAF6ED] text-[#7A1522] rounded-full text-xs font-['Marcellus'] font-semibold transition-all cursor-pointer shadow-md hover:scale-105 flex items-center gap-1.5"
          >
            <Heart className="w-3.5 h-3.5 fill-current text-[#D9384B]" />
            <span className="hidden sm:inline text-[9.5px] uppercase font-semibold">Varsha</span>
          </button>
        </div>
      </header>

      {/* Ceremony Navigation Ribbon */}
      <nav className="decade-nav no-scrollbar" aria-label="Ceremony volumes">
        <div ref={tabIndicatorRef} className="decade-indicator" />
        {CEREMONY_TABS.map((tab, idx) => (
          <button
            key={tab.label}
            ref={(el) => {
              tabRefs.current[idx] = el;
            }}
            type="button"
            className="decade-btn"
            onClick={() => onTabClick(tab)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* 3D Shelf Section (Exact Original Physics & Tape-Turn Mechanism) */}
      <section
        className="shelf-section"
        aria-label="Royal wedding keepsake shelf"
        onPointerDown={onShelfPointerDown}
      >
        <div ref={stageRef} className="shelf-stage">
          {Array.from({ length: TOTAL_TAPES }).map((_, v) => {
            const vol = INDIAN_VOLUMES[v % 8];
            return (
              <div
                key={v}
                ref={(el) => {
                  tapeRefs.current[v] = el;
                }}
                className="tape"
                onClick={() => onTapeClick(v)}
                onPointerEnter={() => {
                  stateRef.current.hoveredIndex = v;
                  stateRef.current.liftTarget[v] = 1;
                }}
                onPointerLeave={() => {
                  stateRef.current.hoveredIndex = -1;
                  stateRef.current.liftTarget[v] = 0;
                }}
              >
                {/* 1. Spine Face (Each event has its bespoke 24K gold zari texture) */}
                <div
                  ref={(el) => {
                    spineFaceRefs.current[v] = el;
                  }}
                  className="tape-face sp flex flex-col justify-between items-center py-4 px-1 border-r border-[#1C140D] shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTapeClick(v);
                  }}
                  style={{
                    backgroundColor: vol.spineColor,
                    backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(0,0,0,0.1) 75%, rgba(0,0,0,0.65) 100%), url('${vol.spineTexture}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* Top Auspicious Ganesha Emblem */}
                  <div className="flex flex-col items-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    <span className="text-[7.5px] font-['Noto_Serif_Devanagari'] font-bold text-[#FFF2D1] tracking-widest text-center leading-tight">
                      ॥ ॐ ॥
                    </span>
                    <div className="w-5 h-[1.5px] bg-[#F5DE98] my-1 shadow-sm" />
                  </div>

                  {/* Vertical Calligraphy Title */}
                  <div
                    className="flex-1 flex items-center justify-center py-2"
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                  >
                    <span className="font-['Marcellus'] font-bold text-[11px] sm:text-[12px] tracking-[0.24em] text-[#FFF6DF] uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                      {vol.title}
                    </span>
                  </div>

                  {/* Bottom Auspicious Date */}
                  <div className="text-center pt-1 border-t border-[#F5DE98]/50 w-4/5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    <span className="font-['Marcellus'] text-[8px] font-semibold tracking-wider text-[#FFF0C7]">
                      NOV 2026
                    </span>
                  </div>
                </div>

                {/* 2. Cover Face (Each event has its bespoke 24K gold zari texture) */}
                <div
                  ref={(el) => {
                    coverFaceRefs.current[v] = el;
                  }}
                  className="tape-face cv flex flex-col justify-between p-5 border-l-4 border-[#1A120B] shadow-2xl"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTapeClick(v);
                  }}
                  style={{
                    backgroundColor: vol.spineColor,
                    backgroundImage: `radial-gradient(circle at 50% 30%, rgba(255,255,255,0.22) 0%, transparent 65%), linear-gradient(135deg, rgba(0,0,0,0.3) 0%, transparent 100%), url('${vol.coverTexture}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* Gilded Zari Border */}
                  <div className="absolute inset-2.5 border border-[#F5DE98]/80 rounded pointer-events-none drop-shadow-md">
                    <div className="absolute inset-1 border border-[#F5DE98]/40" />
                    <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#FFF2D1]" />
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#FFF2D1]" />
                    <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#FFF2D1]" />
                    <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#FFF2D1]" />
                  </div>

                  {/* Top Ganesha Blessing */}
                  <div className="relative text-center pt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    <span className="font-['Noto_Serif_Devanagari'] text-[8.5px] font-bold text-[#FFF2D1] tracking-widest block">
                      ॥ श्री गणेशाय नमः ॥
                    </span>
                    <span className="font-['Marcellus'] text-[7.5px] uppercase tracking-[0.25em] text-[#F5DE98] block mt-0.5">
                      {vol.volumeNumber}
                    </span>
                  </div>

                  {/* Center Royal Monogram */}
                  <div className="relative flex flex-col items-center justify-center my-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    <div className="w-12 h-12 rounded-full border-2 border-[#F5DE98] flex items-center justify-center bg-black/40 shadow-inner">
                      <span className="font-['Marcellus'] text-sm font-bold text-[#FFF6DF] tracking-wider">
                        अ & इ
                      </span>
                    </div>

                    <h2 className="font-['Marcellus'] text-xs font-bold text-[#FFF8E7] tracking-[0.16em] text-center mt-2.5 uppercase leading-tight">
                      {vol.title}
                    </h2>

                    <p className="font-['Noto_Serif_Devanagari'] text-[9px] text-[#F5DE98] text-center mt-1 font-semibold">
                      {vol.hindiTitle}
                    </p>
                  </div>

                  {/* Bottom Udaipur Heritage Tag */}
                  <div className="relative text-center pb-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    <span className="font-['Marcellus'] text-[8px] tracking-[0.2em] text-[#FFF0C7] font-semibold">
                      UDAIPUR • 28–30 NOV 2026
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Play Ring (Centered on active book) */}
      <button
        ref={playRingRef}
        type="button"
        className="play-ring"
        aria-label="Open Patrika"
        onClick={openDetailView}
      >
        <svg
          width="12"
          height="14"
          viewBox="0 0 12 14"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 1.5L11 7L1 12.5V1.5Z" />
        </svg>
      </button>

      {/* Caption Under Shelf with Animated Masking */}
      <div className="caption-container" aria-live="polite">
        <div ref={subMaskRef} className="mask-line" style={{ minHeight: '14px' }} />
        <div ref={titleMaskRef} className="mask-line" style={{ minHeight: '38px' }} />
        <div ref={yearMaskRef} className="mask-line" style={{ minHeight: '15px' }} />
      </div>

      {/* Arrow Navigation Controls */}
      <button
        type="button"
        className="nav-arrow left"
        aria-label="Previous volume"
        onClick={() => {
          stateRef.current.T = Math.round(stateRef.current.T) - 1;
        }}
      >
        <svg width="18" height="10" viewBox="0 0 18 10" fill="none" stroke="currentColor">
          <path d="M5 1 L1 5 L5 9" strokeWidth="1.3" />
          <path d="M1 5 H17" strokeWidth="1.3" />
        </svg>
      </button>

      <button
        type="button"
        className="nav-arrow right"
        aria-label="Next volume"
        onClick={() => {
          stateRef.current.T = Math.round(stateRef.current.T) + 1;
        }}
      >
        <svg width="18" height="10" viewBox="0 0 18 10" fill="none" stroke="currentColor">
          <path d="M13 1 L17 5 L13 9" strokeWidth="1.3" />
          <path d="M17 5 H1" strokeWidth="1.3" />
        </svg>
      </button>

      {/* Footer */}
      <footer className="footer-bar">
        <span className="lbl text-[#6B5A47]">
          ॥ अभिषेक संग इशिता • SHUBH VIVAH ॥
        </span>
        <div className="flex gap-4">
          <span className="lbl text-[#7A1522] font-bold">
            THE OBEROI UDAIVILAS, UDAIPUR
          </span>
        </div>
      </footer>

      {/* Royal Wedding Golden Jewel Cursor (Active on Shelf View Only) */}
      {!isModalOpen && !showIntro && (
        <div ref={cursorRef} className="royal-cursor" aria-hidden="true">
          <div className="cursor-jewel" />
          <div className="cursor-ripple" />
          <div className="cursor-pill">
            <span ref={cursorPillTextRef}>खोलें • OPEN</span>
          </div>
        </div>
      )}

      {/* FLOWING 3D BOOK MODAL (Zero-flash geometric expansion into OpenBook) */}
      <div
        ref={detailRef}
        className="detail-modal"
        role="dialog"
        aria-modal="true"
        aria-label={activeBook.title}
      >
        <div className="palace-ambient-glow" aria-hidden="true" />
        {isModalOpen && (
          <OpenBook
            initialSpread={targetSpread}
            activeVolume={activeBook}
            onCloseToShelf={closeDetailView}
            onTriggerPetals={triggerPetalShower}
            soundEnabled={soundEnabled}
            onToggleSound={() => {
              const nextState = !soundEnabled;
              setSoundEnabled(nextState);
              sound.enabled = nextState;
            }}
          />
        )}
      </div>

      {/* ROYAL WEDDING FARMAN & WAX-SEAL INTRO SCREEN */}
      {showIntro && (
        <RoyalIntro
          onComplete={() => setShowIntro(false)}
          onTriggerPetals={triggerPetalShower}
          soundEnabled={soundEnabled}
          onToggleSound={() => {
            const nextState = !soundEnabled;
            setSoundEnabled(nextState);
            sound.enabled = nextState;
          }}
        />
      )}
    </div>
  );
}

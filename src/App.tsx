/**
 * Abhishek weds Ishita — Shubh Vivah Patrika & 3D Keepsake Shelf
 * Seamless 3D Physics Shelf + Flowing Geometric Book Opening + 3D Realistic Page Turns
 */

import React, { useEffect, useRef, useState } from 'react';
import { Heart, Music } from 'lucide-react';
import { INDIAN_VOLUMES, IndianBookVolume } from './types/wedding';
import { LoadingScreen } from './components/LoadingScreen';
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
  const [isLoading, setIsLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const showIntroRef = useRef(true);
  showIntroRef.current = showIntro;
  const isLoadingRef = useRef(true);
  isLoadingRef.current = isLoading;
  const [activeBook, setActiveBook] = useState<IndianBookVolume>(INDIAN_VOLUMES[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetSpread, setTargetSpread] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [petalsActive, setPetalsActive] = useState(true);
  const [isMusicOn, setIsMusicOn] = useState(false);

  // Stable callback refs for touch & pointer listeners inside useEffect
  const openDetailViewRef = useRef<() => void>(() => {});
  const onTapeClickRef = useRef<(v: number) => void>(() => {});

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
    let lastTapActionTime = 0;

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

      // Only engage shelf drag when touch/pointer has intentionally moved beyond threshold
      if (dist > 10) {
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

        // Briefly lock dragMoved only after an actual drag to avoid trailing click triggers
        setTimeout(() => {
          s.dragMoved = false;
          hasMoved = false;
        }, 120);
      } else {
        s.T = Math.round(s.T);
        // Direct tap with no drag movement -> immediately allow tap action
        s.dragMoved = false;
        hasMoved = false;
      }
    };

    // Robust Tap Detection & Dispatcher for Mobile Responsive Touch
    const handleShelfTap = (tapX: number, tapY: number) => {
      // Guard: Never handle shelf tap if intro is showing, loading is active, or book is already open
      if (showIntroRef.current || isLoadingRef.current || s.isOpen) return;
      const now = performance.now();
      if (now - lastTapActionTime < 350) return;
      lastTapActionTime = now;

      // 1. If tap was on a UI control, let it handle its own event
      const hitEl = document.elementFromPoint(tapX, tapY);
      if (hitEl?.closest('.royal-intro, [data-royal-intro], button, nav, header, footer, .detail-modal, input, select')) {
        return;
      }

      // 2. Check if hitEl is inside a book element with data-tape-index
      const tapeEl = hitEl?.closest('[data-tape-index]');
      if (tapeEl) {
        const v = parseInt(tapeEl.getAttribute('data-tape-index') || '-1', 10);
        if (v >= 0) {
          onTapeClickRef.current(v);
          return;
        }
      }

      // 3. Robust Geometric Hit Detection (failsafe when 3D CSS transforms confuse browser hit-testing)
      const W = window.innerWidth;
      const H = window.innerHeight;
      const shelfCenterY = H * 0.5;
      const shelfCenterX = W * 0.5;

      const dyFromCenter = Math.abs(tapY - shelfCenterY);
      const dxFromCenter = Math.abs(tapX - shelfCenterX);

      const shelfVerticalLimit = Math.max(s.H * 0.65, 160);
      if (dyFromCenter <= shelfVerticalLimit) {
        // Front-facing book bounds (cover width s.d is typically ~160-260px on mobile)
        const frontBookHalfWidth = Math.max(s.d * 0.62, 115);

        if (dxFromCenter <= frontBookHalfWidth) {
          // Tap directly on the front-facing book -> OPEN IT!
          openDetailViewRef.current();
        } else {
          // Tap on side book spine -> slide to face that book
          sound.playShelfSlide();
          if (tapX < shelfCenterX) {
            const distFromEdge = tapX - (shelfCenterX - frontBookHalfWidth);
            const shift = Math.min(-1, Math.round(distFromEdge / (s.ws + s.gap)));
            s.T = Math.round(s.s) + shift;
          } else {
            const distFromEdge = tapX - (shelfCenterX + frontBookHalfWidth);
            const shift = Math.max(1, Math.round(distFromEdge / (s.ws + s.gap)));
            s.T = Math.round(s.s) + shift;
          }
        }
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (showIntroRef.current || isLoadingRef.current) return;
      moveShelfDrag(e.clientX, e.clientY);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (showIntroRef.current || isLoadingRef.current || s.isOpen) return;
      const target = e.target as HTMLElement;
      if (target?.closest && target.closest('.royal-intro, [data-royal-intro], .detail-modal, button')) return;

      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      const dist = Math.hypot(dx, dy);
      const dt = performance.now() - dragStartTime;
      const isTap = !hasMoved && dist < 14 && dt < 450;

      endShelfDrag(e.clientX);

      if (isTap && (e.pointerType === 'touch' || e.pointerType === 'pen')) {
        handleShelfTap(e.clientX, e.clientY);
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (showIntroRef.current || isLoadingRef.current || s.isOpen || e.touches.length !== 1) return;
      const target = e.target as HTMLElement;
      if (target?.closest && target.closest('.royal-intro, [data-royal-intro], button, nav, header, footer, .detail-modal, input, select')) return;
      const t = e.touches[0];
      startShelfDrag(t.clientX, t.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (showIntroRef.current || isLoadingRef.current) return;
      if (!s.isDragging || e.touches.length !== 1) return;
      const t = e.touches[0];
      const dx = t.clientX - dragStartX;
      const dy = t.clientY - dragStartY;

      // When dragging horizontally beyond threshold, prevent browser horizontal page swipe and glide books
      if (Math.abs(dx) > Math.abs(dy) * 0.65 && Math.abs(dx) > 10) {
        if (e.cancelable) e.preventDefault();
        moveShelfDrag(t.clientX, t.clientY);
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (showIntroRef.current || isLoadingRef.current || s.isOpen) return;
      const target = e.target as HTMLElement;
      if (target?.closest && target.closest('.royal-intro, [data-royal-intro], .detail-modal, button')) return;

      const touch = e.changedTouches[0] || e.touches[0];
      if (!touch) return;
      const dx = touch.clientX - dragStartX;
      const dy = touch.clientY - dragStartY;
      const dist = Math.hypot(dx, dy);
      const dt = performance.now() - dragStartTime;
      const isTap = !hasMoved && dist < 14 && dt < 450;

      endShelfDrag(touch.clientX);

      if (isTap) {
        handleShelfTap(touch.clientX, touch.clientY);
      }
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
      if (showIntroRef.current || isLoadingRef.current || s.isOpen) return;
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      s.T += (delta / (s.ws + s.gap)) * 0.5;

      clearTimeout(s.wheelTimeout);
      s.wheelTimeout = setTimeout(() => {
        s.T = Math.round(s.T);
      }, 160);
    };

    // Keyboard navigation
    const onKeyDown = (e: KeyboardEvent) => {
      if (showIntroRef.current || isLoadingRef.current) return;
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
        if (s.isOpen || W < 768) {
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
            nextCursorState = 'default';
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

      // Update Play Ring (Desktop only; hidden on mobile)
      if (playRingRef.current) {
        if (s.isOpen || W < 768) {
          playRingRef.current.style.display = 'none';
        } else {
          playRingRef.current.style.display = 'flex';
          const ringLeft = W / 2 - 0.5 * s.d - 8;
          const ringTop = shelfCenterY + 0.36 * s.H;
          playRingRef.current.style.left = `${ringLeft.toFixed(1)}px`;
          playRingRef.current.style.top = `${ringTop.toFixed(1)}px`;

          const ringScale = smoothstep(Math.max(0, 1 - Math.abs(s.T - s.s) * 3));
          playRingRef.current.style.transform = `translate(-50%, -50%) scale(${ringScale.toFixed(3)})`;
        }
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

  // Track last tap click timestamp to avoid duplicate calls across touch, pointer, and click
  let lastTapClickTime = 0;

  // FLOWING BOOK OPENING (Smooth Royal Bloom & Scale - No flash, No clip-path jerk)
  const openDetailView = () => {
    const s = stateRef.current;
    if (s.isOpen) return;
    s.isOpen = true;
    s.T = Math.round(s.s);

    const activeIdx = ((Math.round(s.s) % 8) + 8) % 8;
    s.activeBookIndex = activeIdx;
    const vol = INDIAN_VOLUMES[activeIdx];
    setActiveBook(vol);
    setTargetSpread(vol.targetSpread);
    setIsModalOpen(true);

    sound.playPageFlip();
    sound.playCelebrationChime();

    const detailEl = detailRef.current;
    if (!detailEl) return;

    detailEl.style.transformOrigin = '50% 50%';
    detailEl.style.visibility = 'visible';
    detailEl.style.opacity = '1';

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
  openDetailViewRef.current = openDetailView;

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

  /**
   * Two-Step Shelf Book Interaction:
   * 1. Clicking a SIDE book/spine -> slides the shelf to that book and faces it front.
   * 2. Clicking the FRONT-FACING book -> opens it like a book!
   */
  const onTapeClick = (v: number) => {
    const s = stateRef.current;
    if (s.dragMoved) return;

    const now = performance.now();
    if (now - lastTapClickTime < 350) return;
    lastTapClickTime = now;

    // Calculate signed distance of book v from current shelf position s.s
    let r = (v - s.s) % TOTAL_TAPES;
    if (r > TOTAL_TAPES / 2) r -= TOTAL_TAPES;
    if (r < -TOTAL_TAPES / 2) r += TOTAL_TAPES;

    const isFacingFront = Math.abs(r) < 0.45;

    if (isFacingFront) {
      // 1. CLICK ON THE BOOK FACING FRONT -> OPEN IT LIKE A BOOK!
      const volIdx = ((v % 8) + 8) % 8;
      s.activeBookIndex = volIdx;
      const vol = INDIAN_VOLUMES[volIdx];
      setActiveBook(vol);
      setTargetSpread(vol.targetSpread);
      openDetailView();
    } else {
      // 2. CLICK ON A SIDE BOOK -> TAKE TO THAT BOOK AND FACE THE BOOK!
      sound.playShelfSlide();
      s.T = Math.round(s.s + r);
    }
  };
  onTapeClickRef.current = onTapeClick;

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
            आमंत्रण
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

          {/* Sakura & Phoolon Ki Varsha */}
          <button
            type="button"
            onClick={() => {
              sound.playCelebrationChime();
              triggerPetalShower();
            }}
            title="Sakura Petals Shower"
            className="p-1.5 sm:px-3 sm:py-1.5 border border-[#D4AF37]/70 bg-[#FAF6EE]/90 hover:bg-[#7A1522] hover:text-[#FAF6ED] text-[#7A1522] rounded-full text-xs font-['Marcellus'] font-semibold transition-all cursor-pointer shadow-md hover:scale-105 flex items-center gap-1.5"
          >
            <Heart className="w-3.5 h-3.5 fill-current text-[#D9384B]" />
            <span className="hidden sm:inline text-[9.5px] uppercase font-semibold">Sakura</span>
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
        onClick={(e) => {
          if (stateRef.current.dragMoved) return;
          const target = e.target as HTMLElement;
          if (target.closest('button, nav, header, footer, .detail-modal, input, select')) return;
          const W = window.innerWidth;
          const H = window.innerHeight;
          const dx = Math.abs(e.clientX - W * 0.5);
          const dy = Math.abs(e.clientY - H * 0.5);
          const s = stateRef.current;
          if (dx <= Math.max(s.d * 0.62, 115) && dy <= Math.max(s.H * 0.65, 160)) {
            openDetailView();
          }
        }}
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
                data-tape-index={v}
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
                  data-tape-index={v}
                  className="tape-face sp flex flex-col justify-between items-center py-4 px-1 border-r border-[#1C140D] shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTapeClick(v);
                  }}
                  style={{
                    backgroundColor: vol.spineColor,
                    backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 25%, rgba(255,255,255,0.22) 50%, rgba(0,0,0,0.2) 75%, rgba(0,0,0,0.7) 100%), url('${vol.spineTexture}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* Top Auspicious Ganesha Emblem */}
                  <div className="flex flex-col items-center drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                    <span className="text-[8px] font-['Noto_Serif_Devanagari'] font-bold text-[#FFF3D4] tracking-widest text-center leading-tight">
                      ॥ ॐ ॥
                    </span>
                    <div className="w-5 h-[1.5px] bg-[#F5DE98] my-1 shadow-sm" />
                  </div>

                  {/* Vertical Calligraphy Title with dark contrast backing ribbon */}
                  <div
                    className="flex-1 flex items-center justify-center py-2 px-0.5 my-1 w-full"
                    style={{
                      writingMode: 'vertical-rl',
                      transform: 'rotate(180deg)',
                      background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.35) 100%)',
                      borderRadius: '2px',
                    }}
                  >
                    <span
                      className="font-['Marcellus'] font-bold text-[11.5px] sm:text-[12.5px] tracking-[0.24em] text-[#FFF8E7] uppercase"
                      style={{
                        textShadow: '0 2px 5px rgba(0,0,0,0.95), 0 0 10px rgba(0,0,0,0.85)',
                      }}
                    >
                      {vol.title}
                    </span>
                  </div>

                  {/* Bottom Auspicious Date */}
                  <div className="text-center pt-1 border-t border-[#F5DE98]/50 w-4/5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                    <span className="font-['Marcellus'] text-[8px] font-bold tracking-wider text-[#FFF2CC]">
                      NOV 2026
                    </span>
                  </div>
                </div>

                {/* 2. Cover Face (Each event has its bespoke 24K gold zari texture) */}
                <div
                  ref={(el) => {
                    coverFaceRefs.current[v] = el;
                  }}
                  data-tape-index={v}
                  className="tape-face cv flex flex-col justify-between p-4 sm:p-5 border-l-4 border-[#1A120B] shadow-2xl cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (stateRef.current.dragMoved) return;
                    onTapeClick(v);
                  }}
                  style={{
                    backgroundColor: vol.spineColor,
                    backgroundImage: `
                      radial-gradient(circle at 50% 50%, rgba(25, 5, 10, 0.42) 0%, rgba(12, 2, 5, 0.75) 100%),
                      url('${vol.coverTexture}')
                    `,
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

                  {/* Top Auspicious Pill Badge */}
                  <div className="relative text-center pt-0.5 flex flex-col items-center">
                    <div className="inline-flex flex-col items-center px-3 py-1 rounded-full bg-[#1A0B0E]/88 border border-[#D4AF37]/70 shadow-md backdrop-blur-sm">
                      <span className="font-['Noto_Serif_Devanagari'] text-[8.5px] font-bold text-[#FFF3D4] tracking-widest block leading-tight">
                        ॥ श्री गणेशाय नमः ॥
                      </span>
                      <span className="font-['Marcellus'] text-[7.5px] uppercase tracking-[0.25em] text-[#F5DE98] block font-semibold mt-0.5">
                        {vol.volumeNumber}
                      </span>
                    </div>
                  </div>

                  {/* Center Royal Cartouche Inlay Plate (High contrast over ANY background texture) */}
                  <div
                    className="relative flex flex-col items-center justify-center my-auto w-full max-w-[92%] py-3 px-3 rounded-xl border border-[#D4AF37]/80 shadow-[0_8px_24px_rgba(0,0,0,0.85),inset_0_0_12px_rgba(0,0,0,0.6)] backdrop-blur-md mx-auto"
                    style={{
                      background: 'radial-gradient(circle at 50% 35%, rgba(42, 9, 16, 0.94) 0%, rgba(18, 4, 8, 0.96) 90%)',
                    }}
                  >
                    {/* Delicate Inner Gold Hairline Frame */}
                    <div className="absolute inset-1 rounded-lg border border-[#F5DE98]/35 pointer-events-none" />

                    {/* Monogram Roundel */}
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 border-[#D4AF37] flex items-center justify-center bg-[#FAF4E5] shadow-md mb-1.5">
                      <span className="font-['Marcellus'] text-sm sm:text-base font-bold gold-foil-text">
                        अ & इ
                      </span>
                    </div>

                    <h2
                      className="font-['Marcellus'] text-xs sm:text-[13px] font-bold text-[#FFF4D4] tracking-[0.18em] text-center uppercase leading-tight my-0.5"
                      style={{
                        textShadow: '0 2px 6px rgba(0,0,0,0.95), 0 0 10px rgba(212,175,55,0.4)',
                      }}
                    >
                      {vol.title}
                    </h2>

                    <p className="font-['Noto_Serif_Devanagari'] text-[9.5px] sm:text-[10px] text-[#F5DE98] text-center font-bold tracking-wider mt-0.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                      {vol.hindiTitle}
                    </p>

                    <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent my-1" />

                    <span className="font-['Marcellus'] text-[7.5px] sm:text-[8px] uppercase tracking-[0.22em] text-[#FFE8B6] font-semibold text-center">
                      {vol.subtitle}
                    </span>
                  </div>

                  {/* Bottom Udaipur Heritage Tag Badge */}
                  <div className="relative text-center pb-0.5 flex justify-center">
                    <div className="inline-block px-3 py-0.5 rounded-full bg-[#1A0B0E]/88 border border-[#D4AF37]/65 shadow-md backdrop-blur-sm">
                      <span className="font-['Marcellus'] text-[8px] sm:text-[8.5px] tracking-[0.2em] text-[#FFF2CC] font-bold">
                        UDAIPUR • 28–30 NOV 2026
                      </span>
                    </div>
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
      {!isModalOpen && !showIntro && !isLoading && (
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
      {showIntro && !isLoading && (
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

      {/* ROYAL PALACE PRELOADER & ASSET DOWNLOAD SCREEN */}
      {isLoading && (
        <LoadingScreen onLoaded={() => setIsLoading(false)} />
      )}
    </div>
  );
}

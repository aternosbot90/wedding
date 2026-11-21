/**
 * Abhishek weds Ishita — Shubh Vivah Patrika
 * Royal Indian Wedding Invitation Book with 3D Realistic Page Turns
 */

import React, { useState, useEffect } from 'react';
import { INDIAN_VOLUMES, IndianBookVolume } from './types/wedding';
import { LoadingScreen } from './components/LoadingScreen';
import { OpenBook } from './components/OpenBook';
import { RosePetals } from './components/RosePetals';
import { sound } from './utils/audio';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [petalsActive, setPetalsActive] = useState(true);
  const activeBook: IndianBookVolume = INDIAN_VOLUMES[0];

  useEffect(() => {
    if (!isLoading && soundEnabled) {
      sound.startMusic();
    }
  }, [isLoading, soundEnabled]);

  const triggerPetalShower = () => {
    setPetalsActive(false);
    setTimeout(() => setPetalsActive(true), 60);
  };

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    sound.enabled = nextState;
  };

  return (
    <div
      className="relative w-screen h-screen overflow-hidden select-none"
      style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(45, 12, 18, 0.96) 0%, rgba(18, 4, 8, 0.99) 100%)',
      }}
    >
      {/* Palace Candlelight & Diya Warmth Glow */}
      <div className="palace-ambient-glow" aria-hidden="true" />

      {/* Falling Rose Petals Shower */}
      <RosePetals active={petalsActive} />

      {/* THE MAIN HERO: THE OPENED WEDDING INVITATION BOOK */}
      {!isLoading && (
        <main className="relative w-full h-full flex flex-col justify-between items-center z-20">
          <OpenBook
            initialSpread={0}
            activeVolume={activeBook}
            onTriggerPetals={triggerPetalShower}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
          />
        </main>
      )}

      {/* PRELOADER SCREEN */}
      {isLoading && (
        <LoadingScreen onLoaded={() => setIsLoading(false)} />
      )}
    </div>
  );
}

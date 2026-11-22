/**
 * Procedural Audio Engine for Realistic Book Page Turns & Tactile Effects
 * Generates audio on the fly via Web Audio API without needing external audio files.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private _enabled: boolean = true;

  public get enabled(): boolean {
    return this._enabled;
  }

  public set enabled(val: boolean) {
    this._enabled = val;
    if (!val) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
  }

  public initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  /**
   * Sound effects disabled per user request:
   * Only background music (KAMI.mp3) plays in the background.
   */
  public playPageFlip() {}
  public playWaxStamp() {}
  public playShelfSlide() {}
  public playScrollRoll() {}
  public playWaxCrack() {}
  public playCelebrationChime() {}

  // ========================================================
  // ROYAL WEDDING BACKGROUND MUSIC (/assets/KAMI.mp3)
  // ========================================================
  private bgAudio: HTMLAudioElement | null = null;
  private isMusicPlaying: boolean = false;
  private fadeInterval: ReturnType<typeof setInterval> | null = null;

  private initBgAudio() {
    if (this.bgAudio || typeof window === 'undefined') return;
    try {
      this.bgAudio = new Audio('/assets/KAMI.mp3');
      this.bgAudio.loop = true;
      this.bgAudio.preload = 'auto';
      this.bgAudio.volume = 0.30;
    } catch (e) {
      console.warn('Background audio initialization error:', e);
    }
  }

  public getMusicPlaying(): boolean {
    return this.isMusicPlaying && !!this.bgAudio && !this.bgAudio.paused;
  }

  public toggleMusic(): boolean {
    if (this.isMusicPlaying) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }

  public startMusic() {
    if (!this._enabled) return;
    try {
      this.initCtx();
      this.initBgAudio();
      if (!this.bgAudio) return;

      if (this.isMusicPlaying && !this.bgAudio.paused) return;

      if (this.fadeInterval) {
        clearInterval(this.fadeInterval);
        this.fadeInterval = null;
      }

      // Music volume set to exactly 30% per user request
      const targetVolume = 0.30;
      this.bgAudio.volume = targetVolume;
      const playPromise = this.bgAudio.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isMusicPlaying = true;
            if (this.bgAudio) {
              this.bgAudio.volume = targetVolume;
            }
          })
          .catch((err) => {
            // Autoplay policy prevented playback until user interaction
            this.isMusicPlaying = false;
            console.log('Background music autoplay waiting for user interaction:', err?.message || err);
          });
      }
    } catch (e) {
      console.warn('Failed to start background music:', e);
    }
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.fadeInterval) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }
    if (!this.bgAudio) return;

    try {
      // Gentle 450ms fade out before pause
      let curVol = this.bgAudio.volume;
      const step = curVol / 8;
      this.fadeInterval = setInterval(() => {
        if (!this.bgAudio) {
          if (this.fadeInterval) clearInterval(this.fadeInterval);
          return;
        }
        curVol = Math.max(0, curVol - step);
        this.bgAudio.volume = curVol;
        if (curVol <= 0.02) {
          if (this.fadeInterval) clearInterval(this.fadeInterval);
          this.fadeInterval = null;
          this.bgAudio.pause();
        }
      }, 55);
    } catch {
      this.bgAudio.pause();
    }
  }
}

export const sound = new SoundEngine();

// Automatically attempt music play on page load, plus auto-unlock on first gesture
if (typeof window !== 'undefined') {
  // Immediate autoplay attempt when website opens
  setTimeout(() => {
    sound.startMusic();
  }, 100);

  const unlockAudio = () => {
    sound.initCtx();
    if (sound.enabled) {
      sound.startMusic();
    }
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
    window.removeEventListener('scroll', unlockAudio);
  };
  window.addEventListener('pointerdown', unlockAudio, { once: true, passive: true });
  window.addEventListener('keydown', unlockAudio, { once: true, passive: true });
  window.addEventListener('click', unlockAudio, { once: true, passive: true });
  window.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
  window.addEventListener('scroll', unlockAudio, { once: true, passive: true });
}


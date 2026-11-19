/**
 * Procedural Audio Engine for Realistic Book Page Turns & Tactile Effects
 * Generates audio on the fly via Web Audio API without needing external audio files.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

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
   * Realistic multi-stage paper page flip sound:
   * 1. Lift & friction rustle (parchment sliding)
   * 2. Aerodynamic parchment whoosh (air displacement as card arches)
   * 3. Tactile paper landing flap & warm subtle settling thud
   */
  public playPageFlip() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      if (this.ctx.state === 'suspended') {
        this.ctx.resume().then(() => this.synthesizePageTurn()).catch(() => {});
        return;
      }

      this.synthesizePageTurn();
    } catch {
      // Audio context might be restricted before first gesture
    }
  }

  private synthesizePageTurn() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const duration = 0.60;

    // Master bus for page flip
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.85, now);
    masterGain.connect(ctx.destination);

    // 1. Crisp Parchment Friction & Rustle (520ms)
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    // Pink noise generator for authentic heavy paper texture
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.05 * white) / 1.05;
      lastOut = output[i];
      output[i] *= 3.8;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    // Resonant bandpass filter sweeps through paper friction frequencies
    const paperFilter = ctx.createBiquadFilter();
    paperFilter.type = 'bandpass';
    paperFilter.frequency.setValueAtTime(1500, now);
    paperFilter.frequency.linearRampToValueAtTime(2600, now + 0.16);
    paperFilter.frequency.exponentialRampToValueAtTime(600, now + 0.50);
    paperFilter.Q.setValueAtTime(1.5, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.linearRampToValueAtTime(0.60, now + 0.08);
    noiseGain.gain.linearRampToValueAtTime(0.42, now + 0.28);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.52);

    noiseSource.connect(paperFilter);
    paperFilter.connect(noiseGain);
    noiseGain.connect(masterGain);

    noiseSource.start(now);
    noiseSource.stop(now + 0.55);

    // 2. Air Whoosh (low-mid swoosh as the page arches across the spine)
    const whooshOsc = ctx.createOscillator();
    const whooshFilter = ctx.createBiquadFilter();
    const whooshGain = ctx.createGain();

    whooshOsc.type = 'triangle';
    whooshOsc.frequency.setValueAtTime(260, now + 0.05);
    whooshOsc.frequency.exponentialRampToValueAtTime(90, now + 0.42);

    whooshFilter.type = 'lowpass';
    whooshFilter.frequency.setValueAtTime(450, now);
    whooshFilter.frequency.linearRampToValueAtTime(220, now + 0.4);

    whooshGain.gain.setValueAtTime(0.001, now + 0.05);
    whooshGain.gain.linearRampToValueAtTime(0.38, now + 0.18);
    whooshGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    whooshOsc.connect(whooshFilter);
    whooshFilter.connect(whooshGain);
    whooshGain.connect(masterGain);

    whooshOsc.start(now + 0.05);
    whooshOsc.stop(now + 0.48);

    // 3. Tactile Paper Landing Flap & Subtle Desk Thud (at 380ms - 540ms)
    const landingTime = now + 0.38;

    // Low gentle thud
    const thudOsc = ctx.createOscillator();
    const thudGain = ctx.createGain();
    thudOsc.type = 'sine';
    thudOsc.frequency.setValueAtTime(130, landingTime);
    thudOsc.frequency.exponentialRampToValueAtTime(40, landingTime + 0.18);

    thudGain.gain.setValueAtTime(0.001, landingTime);
    thudGain.gain.linearRampToValueAtTime(0.45, landingTime + 0.02);
    thudGain.gain.exponentialRampToValueAtTime(0.001, landingTime + 0.18);

    thudOsc.connect(thudGain);
    thudGain.connect(masterGain);

    thudOsc.start(landingTime);
    thudOsc.stop(landingTime + 0.2);

    // Crisp settling click (edges meeting)
    const clickBuffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.06), ctx.sampleRate);
    const clickData = clickBuffer.getChannelData(0);
    for (let i = 0; i < clickData.length; i++) {
      clickData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.015));
    }
    const clickSource = ctx.createBufferSource();
    clickSource.buffer = clickBuffer;

    const clickFilter = ctx.createBiquadFilter();
    clickFilter.type = 'highpass';
    clickFilter.frequency.setValueAtTime(2200, landingTime);

    const clickGain = ctx.createGain();
    clickGain.gain.setValueAtTime(0.35, landingTime);
    clickGain.gain.exponentialRampToValueAtTime(0.001, landingTime + 0.06);

    clickSource.connect(clickFilter);
    clickFilter.connect(clickGain);
    clickGain.connect(masterGain);

    clickSource.start(landingTime);
    clickSource.stop(landingTime + 0.07);
  }

  /**
   * Wax seal stamp press sound
   */
  public playWaxStamp() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.22);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {}
  }

  /**
   * Romantic celestial harp chord
   */
  public playCelebrationChime() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // E Major Pentatonic chord: E4, G#4, B4, E5, F#5
      const freqs = [329.63, 415.3, 493.88, 659.25, 739.99];

      freqs.forEach((freq, i) => {
        const noteTime = now + i * 0.08;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.001, noteTime);
        gain.gain.linearRampToValueAtTime(0.1, noteTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 1.25);
      });
    } catch {}
  }

  // ========================================================
  // SOOTHING ROYAL PALACE TANPURA & SITAR AMBIENT RAGA
  // ========================================================
  private isMusicPlaying: boolean = false;
  private musicMasterGain: GainNode | null = null;
  private droneOscs: OscillatorNode[] = [];
  private melodyTimer: ReturnType<typeof setInterval> | null = null;

  public getMusicPlaying(): boolean {
    return this.isMusicPlaying;
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
    try {
      this.initCtx();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().then(() => this.runMusicEngine()).catch(() => {});
        return;
      }
      this.runMusicEngine();
    } catch {}
  }

  private runMusicEngine() {
    if (!this.ctx || this.isMusicPlaying) return;
    this.isMusicPlaying = true;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Master volume for ambient music
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.001, now);
    master.gain.linearRampToValueAtTime(0.065, now + 2.0); // Gentle 2s fade in
    master.connect(ctx.destination);
    this.musicMasterGain = master;

    // 1. Continuous Meditative Tanpura Drone (C#3 fundamental + G#3 fifth)
    const droneFreqs = [138.59, 207.65, 277.18];
    this.droneOscs = droneFreqs.map((freq, idx) => {
      const osc = ctx.createOscillator();
      const droneGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = idx === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);

      droneGain.gain.setValueAtTime(idx === 0 ? 0.35 : 0.22, now);

      osc.connect(filter);
      filter.connect(droneGain);
      droneGain.connect(master);

      osc.start(now);
      return osc;
    });

    // 2. Poetic Sitar & Shehnai Melodic Flourishes (Raag Yaman notes)
    // C#4, D#4, F4, G4, G#4, A#4, C5, C#5
    const ragaNotes = [277.18, 311.13, 349.23, 392.00, 415.30, 466.16, 523.25, 554.37];
    const phrases = [
      [0, 2, 4, 3, 2, 0],
      [4, 5, 7, 6, 4],
      [2, 4, 6, 7],
      [7, 6, 4, 3, 2, 0],
      [0, 1, 2, 4],
    ];
    let phraseIdx = 0;

    const playMelodyPhrase = () => {
      if (!this.isMusicPlaying || !this.ctx) return;
      const phrase = phrases[phraseIdx % phrases.length];
      phraseIdx++;
      const t = this.ctx.currentTime;

      phrase.forEach((noteIdx, i) => {
        const noteTime = t + i * 0.45;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const sitarFilter = ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(ragaNotes[noteIdx], noteTime);

        sitarFilter.type = 'bandpass';
        sitarFilter.frequency.setValueAtTime(ragaNotes[noteIdx] * 2.2, noteTime);
        sitarFilter.Q.setValueAtTime(3.0, noteTime);

        gain.gain.setValueAtTime(0.001, noteTime);
        gain.gain.linearRampToValueAtTime(0.28, noteTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.85);

        osc.connect(sitarFilter);
        sitarFilter.connect(gain);
        gain.connect(master);

        osc.start(noteTime);
        osc.stop(noteTime + 0.9);
      });
    };

    // Play first phrase after 1s, then repeat phrases every 4.8 seconds
    setTimeout(playMelodyPhrase, 1000);
    this.melodyTimer = setInterval(playMelodyPhrase, 4800);
  }

  public stopMusic() {
    if (!this.isMusicPlaying) return;
    this.isMusicPlaying = false;

    if (this.melodyTimer) {
      clearInterval(this.melodyTimer);
      this.melodyTimer = null;
    }

    if (this.musicMasterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.musicMasterGain.gain.linearRampToValueAtTime(0.001, now + 0.8);
      setTimeout(() => {
        this.droneOscs.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {}
        });
        this.droneOscs = [];
        this.musicMasterGain = null;
      }, 850);
    }
  }
}

export const sound = new SoundEngine();

// Auto-unlock Web Audio on first user interaction anywhere in the window
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    sound.initCtx();
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
    window.removeEventListener('click', unlockAudio);
  };
  window.addEventListener('pointerdown', unlockAudio, { once: true, passive: true });
  window.addEventListener('keydown', unlockAudio, { once: true, passive: true });
  window.addEventListener('click', unlockAudio, { once: true, passive: true });
}


// Web Audio API Synthesizer for child-friendly sound effects and BGM

class SoundManager {
  private ctx: AudioContext | null = null;
  private bgmIntervalId: any = null;
  private bgmPlaying = false;
  private waterNoiseNode: AudioBufferSourceNode | null = null;
  private waterGainNode: GainNode | null = null;
  private volume = 0.6;
  private bgmVolume = 0.35;
  private soundEnabled = true;

  constructor() {
    // Lazy initialize to bypass browser autoplay policy
  }

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    if (!enabled) {
      this.stopBGM();
      this.playWaterSpray(false);
    } else {
      this.initContext();
    }
  }

  public isEnabled() {
    return this.soundEnabled;
  }

  public playClick() {
    if (!this.soundEnabled) return;
    this.initContext();
    const ctx = this.ctx!;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.15 * this.volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  }

  public playExtinguish() {
    if (!this.soundEnabled) return;
    this.initContext();
    const ctx = this.ctx!;
    
    // Play a lovely double ding (C5 -> E5 -> G5)
    const playNote = (freq: number, delay: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
      
      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.25 * this.volume, ctx.currentTime + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + duration);
    };

    playNote(523.25, 0, 0.15); // C5
    playNote(659.25, 0.08, 0.15); // E5
    playNote(783.99, 0.16, 0.3); // G5
  }

  public playWaterSpray(active: boolean) {
    if (!this.soundEnabled) return;
    this.initContext();
    const ctx = this.ctx!;

    if (active) {
      if (this.waterNoiseNode) return; // Already spraying

      // Create white noise for rushing water
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      // Filter to make it sound like water
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.Q.setValueAtTime(1.5, ctx.currentTime);

      // Modulate filter frequency to make it sound sloshy
      const modulator = ctx.createOscillator();
      modulator.frequency.setValueAtTime(8, ctx.currentTime); // 8 Hz wobble
      const modulatorGain = ctx.createGain();
      modulatorGain.gain.setValueAtTime(300, ctx.currentTime); // wobble range +/- 300Hz

      modulator.connect(modulatorGain);
      modulatorGain.connect(filter.frequency);

      this.waterGainNode = ctx.createGain();
      this.waterGainNode.gain.setValueAtTime(0.05 * this.volume, ctx.currentTime);

      noiseSource.connect(filter);
      filter.connect(this.waterGainNode);
      this.waterGainNode.connect(ctx.destination);

      modulator.start();
      noiseSource.start();

      this.waterNoiseNode = noiseSource;
    } else {
      if (this.waterNoiseNode) {
        try {
          this.waterNoiseNode.stop();
        } catch (e) {}
        this.waterNoiseNode = null;
        this.waterGainNode = null;
      }
    }
  }

  public playRefill() {
    if (!this.soundEnabled) return;
    this.initContext();
    const ctx = this.ctx!;
    
    // Bubble sound effects rising in pitch
    const totalTime = 1.5;
    const numBubbles = 12;
    for (let i = 0; i < numBubbles; i++) {
      const delay = (i / numBubbles) * totalTime;
      const pitch = 300 + i * 80 + Math.random() * 50;
      
      setTimeout(() => {
        if (!this.soundEnabled) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(pitch, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(pitch * 1.5, ctx.currentTime + 0.15);
        
        gain.gain.setValueAtTime(0.15 * this.volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }, delay * 1000);
    }
  }

  public startBGM() {
    if (!this.soundEnabled || this.bgmPlaying) return;
    this.initContext();
    this.bgmPlaying = true;
    const ctx = this.ctx!;

    const tempo = 135; // BPM
    const beatDuration = 60 / tempo; // 0.444 seconds per beat
    
    // Simplified Paw Patrol-inspired cheerful superhero rescue loop
    // I - IV - V - I chord style notes
    const melody = [
      659.25, 659.25, 0, 659.25,      // E5, E5, rest, E5
      587.33, 587.33, 0, 587.33,      // D5, D5, rest, D5
      523.25, 523.25, 587.33, 659.25,  // C5, C5, D5, E5
      783.99, 0, 783.99, 0,            // G5, rest, G5, rest
      
      659.25, 659.25, 0, 659.25,      // E5, E5, rest, E5
      698.46, 698.46, 0, 698.46,      // F5, F5, rest, F5
      783.99, 783.99, 880.00, 987.77,  // G5, G5, A5, B5
      1046.50, 0, 0, 0                 // C6
    ];

    const bassLine = [
      130.81, 130.81, 130.81, 130.81, // C3
      146.83, 146.83, 146.83, 146.83, // D3
      164.81, 164.81, 174.61, 174.61, // E3 -> F3
      196.00, 196.00, 196.00, 196.00, // G3
      
      130.81, 130.81, 130.81, 130.81, // C3
      174.61, 174.61, 174.61, 174.61, // F3
      196.00, 196.00, 196.00, 196.00, // G3
      130.81, 196.00, 130.81, 0       // C3 -> G3 -> C3
    ];

    let step = 0;
    const playStep = () => {
      if (!this.bgmPlaying || !this.soundEnabled) return;

      const noteFreq = melody[step % melody.length];
      const bassFreq = bassLine[step % bassLine.length];

      // Play melody
      if (noteFreq > 0) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(noteFreq, ctx.currentTime);
        
        gain.gain.setValueAtTime(0.08 * this.bgmVolume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + beatDuration * 0.8);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + beatDuration * 0.8);
      }

      // Play bass
      if (bassFreq > 0) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(bassFreq, ctx.currentTime);
        
        gain.gain.setValueAtTime(0.15 * this.bgmVolume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + beatDuration * 0.9);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + beatDuration * 0.9);
      }

      step = (step + 1) % melody.length;
    };

    // Schedule the loop
    this.bgmIntervalId = setInterval(playStep, beatDuration * 1000);
  }

  public stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmIntervalId) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
  }

  public playVictory() {
    if (!this.soundEnabled) return;
    this.initContext();
    this.stopBGM(); // Stop playing BGM
    const ctx = this.ctx!;

    // Play a majestic, happy victory fanfare melody
    // Chord progression: C -> G -> Am -> F -> C -> G -> C
    const fanfareNotes = [
      { f: 523.25, d: 0.15 }, // C5
      { f: 587.33, d: 0.15 }, // D5
      { f: 659.25, d: 0.15 }, // E5
      { f: 783.99, d: 0.3 },  // G5
      { f: 659.25, d: 0.15 }, // E5
      { f: 783.99, d: 0.45 }, // G5 (long)
      
      { f: 880.00, d: 0.15 }, // A5
      { f: 880.00, d: 0.15 }, // A5
      { f: 987.77, d: 0.15 }, // B5
      { f: 1046.50, d: 0.45 }, // C6
      { f: 1174.66, d: 0.3 }, // D6
      { f: 1318.51, d: 0.6 }  // E6 (victory chord)
    ];

    let cumulativeTime = 0;
    fanfareNotes.forEach((note) => {
      setTimeout(() => {
        if (!this.soundEnabled) return;
        
        // Lead melody (square/triangle hybrid)
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        const gain2 = ctx.createGain();
        
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(note.f, ctx.currentTime);
        gain1.gain.setValueAtTime(0.25 * this.volume, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.d);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        
        osc2.type = 'sine';
        // Add harmony (a major third below)
        osc2.frequency.setValueAtTime(note.f * 0.8, ctx.currentTime);
        gain2.gain.setValueAtTime(0.12 * this.volume, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.d);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        
        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + note.d);
        osc2.stop(ctx.currentTime + note.d);
      }, cumulativeTime * 1000);
      
      cumulativeTime += note.d * 0.85;
    });

    // Also trigger some cute celebratory background arpeggios after fanfare
    setTimeout(() => {
      if (!this.soundEnabled) return;
      this.startBGM(); // Resume BGM in celebration!
    }, cumulativeTime * 1000 + 500);
  }

  public playGameOver() {
    if (!this.soundEnabled) return;
    this.initContext();
    this.stopBGM();
    const ctx = this.ctx!;
    
    // Play a descending sad sound (G3 -> F3 -> Eb3 -> D3)
    const notes = [196.00, 174.61, 155.56, 146.83];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.soundEnabled) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        
        gain.gain.setValueAtTime(0.2 * this.volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      }, idx * 220);
    });
  }
}

export const sound = new SoundManager();

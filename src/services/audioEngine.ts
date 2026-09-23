import type { AmbientSoundId } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundNodes: Map<AmbientSoundId, { masterGain: GainNode; stop: () => void }> = new Map();

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // --- Sound Generation Methods ---

  // 1. Synthesize Pink / Brown Noise (Deep Study Noise)
  private createNoiseNode(type: 'pink' | 'brown') {
    const ctx = this.initContext();
    const bufferSize = 4 * ctx.sampleRate; // 4 seconds looped
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    if (type === 'pink') {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
        b6 = white * 0.115926;
      }
    } else {
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 2.5; // Gain compensation
      }
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;
    return noiseSource;
  }

  // Start Rain Simulation
  private startRain(): { masterGain: GainNode; stop: () => void } {
    const ctx = this.initContext();
    const noise = this.createNoiseNode('pink');

    // Dual filters for natural rain frequencies
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 1200;

    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 250;

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.5;

    noise.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(masterGain);
    masterGain.connect(ctx.destination);

    noise.start();

    return {
      masterGain,
      stop: () => {
        try {
          noise.stop();
          noise.disconnect();
          masterGain.disconnect();
        } catch {
          // ignore already stopped
        }
      },
    };
  }

  // Start Pink Noise
  private startPinkNoise(): { masterGain: GainNode; stop: () => void } {
    const ctx = this.initContext();
    const noise = this.createNoiseNode('pink');

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 3500;

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.4;

    noise.connect(lowpass);
    lowpass.connect(masterGain);
    masterGain.connect(ctx.destination);

    noise.start();

    return {
      masterGain,
      stop: () => {
        try {
          noise.stop();
          noise.disconnect();
          masterGain.disconnect();
        } catch {
          // ignore
        }
      },
    };
  }

  // Start Ocean Waves (LFO modulating pink noise filter and gain)
  private startOcean(): { masterGain: GainNode; stop: () => void } {
    const ctx = this.initContext();
    const noise = this.createNoiseNode('pink');

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 600;

    const waveGain = ctx.createGain();
    waveGain.gain.value = 0.3;

    // LFO for tide rise & fall
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.12; // 8-second wave cycle
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.25;

    lfo.connect(lfoGain);
    lfoGain.connect(waveGain.gain);

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.5;

    noise.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(masterGain);
    masterGain.connect(ctx.destination);

    noise.start();
    lfo.start();

    return {
      masterGain,
      stop: () => {
        try {
          noise.stop();
          lfo.stop();
          noise.disconnect();
          lfo.disconnect();
          masterGain.disconnect();
        } catch {
          // ignore
        }
      },
    };
  }

  // Start Campfire (Brown noise + periodic crackle pops)
  private startCampfire(): { masterGain: GainNode; stop: () => void } {
    const ctx = this.initContext();
    const noise = this.createNoiseNode('brown');

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 500;
    filter.Q.value = 1.0;

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.45;

    noise.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(ctx.destination);
    noise.start();

    // Crackle timer
    let crackleTimer: number | null = null;
    const playCrackle = () => {
      if (!this.ctx) return;
      const popOsc = ctx.createOscillator();
      const popGain = ctx.createGain();
      popOsc.type = 'triangle';
      popOsc.frequency.setValueAtTime(800 + Math.random() * 2000, ctx.currentTime);
      popGain.gain.setValueAtTime(0.04 * (Math.random() + 0.3), ctx.currentTime);
      popGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04 + Math.random() * 0.05);

      popOsc.connect(popGain);
      popGain.connect(masterGain);
      popOsc.start();
      popOsc.stop(ctx.currentTime + 0.1);

      crackleTimer = window.setTimeout(playCrackle, 80 + Math.random() * 320);
    };

    playCrackle();

    return {
      masterGain,
      stop: () => {
        if (crackleTimer) clearTimeout(crackleTimer);
        try {
          noise.stop();
          noise.disconnect();
          masterGain.disconnect();
        } catch {
          // ignore
        }
      },
    };
  }

  // Start Binaural Alpha Beats (14Hz Alpha focus wave - left 216Hz, right 230Hz)
  private startBinaural(): { masterGain: GainNode; stop: () => void } {
    const ctx = this.initContext();
    
    // Left ear (carrier 216 Hz)
    const leftOsc = ctx.createOscillator();
    leftOsc.type = 'sine';
    leftOsc.frequency.value = 216;

    // Right ear (216 + 14 = 230 Hz -> 14Hz Alpha brainwave difference)
    const rightOsc = ctx.createOscillator();
    rightOsc.type = 'sine';
    rightOsc.frequency.value = 230;

    const merger = ctx.createChannelMerger(2);

    leftOsc.connect(merger, 0, 0); // Left channel
    rightOsc.connect(merger, 0, 1); // Right channel

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.25;

    merger.connect(masterGain);
    masterGain.connect(ctx.destination);

    leftOsc.start();
    rightOsc.start();

    return {
      masterGain,
      stop: () => {
        try {
          leftOsc.stop();
          rightOsc.stop();
          leftOsc.disconnect();
          rightOsc.disconnect();
          masterGain.disconnect();
        } catch {
          // ignore
        }
      },
    };
  }

  // Public API to set or toggle sound
  public toggleSound(id: AmbientSoundId, play: boolean, volume = 0.5) {
    if (play) {
      if (this.soundNodes.has(id)) {
        this.setVolume(id, volume);
        return;
      }

      let activeNode: { masterGain: GainNode; stop: () => void } | null = null;
      switch (id) {
        case 'rain':
          activeNode = this.startRain();
          break;
        case 'pinkNoise':
          activeNode = this.startPinkNoise();
          break;
        case 'ocean':
          activeNode = this.startOcean();
          break;
        case 'campfire':
          activeNode = this.startCampfire();
          break;
        case 'binaural':
          activeNode = this.startBinaural();
          break;
      }

      if (activeNode) {
        activeNode.masterGain.gain.setValueAtTime(volume, this.ctx?.currentTime || 0);
        this.soundNodes.set(id, activeNode);
      }
    } else {
      const activeNode = this.soundNodes.get(id);
      if (activeNode) {
        activeNode.stop();
        this.soundNodes.delete(id);
      }
    }
  }

  public setVolume(id: AmbientSoundId, volume: number) {
    const active = this.soundNodes.get(id);
    if (active && this.ctx) {
      active.masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime, 0.05);
    }
  }

  public stopAll() {
    this.soundNodes.forEach((node) => node.stop());
    this.soundNodes.clear();
  }

  // Tibetan Bell / Singing Bowl Chime for timer finish
  public playChime(volume = 0.7) {
    const ctx = this.initContext();
    const now = ctx.currentTime;

    const baseFreq = 528; // 528 Hz "Transformation & Miracles" Solfeggio frequency
    const harmonics = [1, 2.01, 3.01, 4.02];
    const decay = 3.5;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume * 0.3, now);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + decay);
    masterGain.connect(ctx.destination);

    harmonics.forEach((h, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = index === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(baseFreq * h, now);

      gain.gain.setValueAtTime(1 / (index + 1), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + decay / (index * 0.5 + 1));

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + decay);
    });
  }
}

export const soundEngine = new SoundEngine();

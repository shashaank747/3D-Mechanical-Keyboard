// Synthesized mechanical keyboard audio engine using Web Audio API

export type SwitchType = 'tactile';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.55;
  private switchType: SwitchType = 'tactile';

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSwitchType(type: SwitchType) {
    this.switchType = type;
  }

  public getSwitchType(): SwitchType {
    return 'tactile';
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  public playKeySound(key: string, isRelease = false) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const mainGain = this.ctx.createGain();
      mainGain.connect(this.ctx.destination);
      mainGain.gain.setValueAtTime(this.volume * (isRelease ? 0.35 : 0.85), now);

      // Pitch variation based on key character to sound natural
      const charCode = key ? key.charCodeAt(0) || 70 : 70;
      const pitchOffset = ((charCode % 15) - 7) * 12;

      // Pure Tactile Brown Switch Sound Profile (Crisp mechanical bump + damped bottom-out)
      const osc = this.ctx.createOscillator();
      const tactileGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(340 + pitchOffset, now);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.05);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, now);
      filter.frequency.exponentialRampToValueAtTime(250, now + 0.045);

      tactileGain.gain.setValueAtTime(0.85, now);
      tactileGain.gain.exponentialRampToValueAtTime(0.001, now + (isRelease ? 0.035 : 0.055));

      osc.connect(filter);
      filter.connect(tactileGain);
      tactileGain.connect(mainGain);

      osc.start(now);
      osc.stop(now + 0.06);

      // Tactile noise snap
      this.addNoiseBurst(now, 0.018, 1400, mainGain, 0.45);
    } catch {
      // AudioContext handling
    }
  }

  private addNoiseBurst(time: number, duration: number, cutoff: number, dest: AudioNode, gainVal: number) {
    if (!this.ctx) return;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(cutoff, time);
    filter.Q.setValueAtTime(2.0, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(gainVal, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(dest);

    noise.start(time);
    noise.stop(time + duration);
  }
}

export const soundEngine = new SoundEngine();

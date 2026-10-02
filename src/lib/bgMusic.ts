// Background Music Audio Engine for "Sunlight on the Desk" Chill Vibe Track

class BackgroundMusicEngine {
  private audio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private volume: number = 0.35; // Balanced chill ambient volume
  private listeners: Set<() => void> = new Set();
  private userHasInteracted: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.audio = new Audio("/Sunlight_on_the_Desk.mp3");
      this.audio.loop = true;
      this.audio.volume = this.volume;
      this.audio.preload = "auto";

      this.audio.addEventListener("timeupdate", () => {
        this.notify();
      });
      this.audio.addEventListener("play", () => {
        this.isPlaying = true;
        this.notify();
      });
      this.audio.addEventListener("pause", () => {
        this.isPlaying = false;
        this.notify();
      });
    }
  }

  public enableOnUserInteraction() {
    if (this.userHasInteracted) return;
    this.userHasInteracted = true;
  }

  public play() {
    if (!this.audio) return;
    this.audio.volume = this.isMuted ? 0 : this.volume;
    const promise = this.audio.play();
    if (promise !== undefined) {
      promise
        .then(() => {
          this.isPlaying = true;
          this.notify();
        })
        .catch(() => {
          // Autoplay policy prevented playback until user clicks
        });
    }
  }

  public pause() {
    if (!this.audio) return;
    this.audio.pause();
    this.isPlaying = false;
    this.notify();
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.audio) {
      this.audio.volume = this.isMuted ? 0 : this.volume;
    }
    this.notify();
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.audio) {
      this.audio.volume = this.isMuted ? 0 : this.volume;
    }
    this.notify();
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentTime(): number {
    return this.audio?.currentTime || 0;
  }

  public getDuration(): number {
    return this.audio?.duration || 180;
  }

  public subscribe(cb: () => void) {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => {
      try {
        cb();
      } catch {}
    });
  }
}

export const bgMusic = new BackgroundMusicEngine();

// Background Music Audio Engine with Sequential Playlist Support

export interface Track {
  id: string;
  title: string;
  src: string;
  durationApprox: string;
}

export const PLAYLIST: Track[] = [
  {
    id: "sunlight",
    title: "Sunlight on the Desk",
    src: "/Sunlight_on_the_Desk.mp3",
    durationApprox: "3:00",
  },
  {
    id: "steaming_mug",
    title: "Steaming Mug, Grey Skies",
    src: "/Steaming_Mug_Grey_Skies.mp3",
    durationApprox: "3:00",
  },
  {
    id: "afternoon_sill",
    title: "Afternoon on the Sill",
    src: "/Afternoon_on_the_Sill.mp3",
    durationApprox: "3:00",
  },
  {
    id: "notes_glass",
    title: "Notes on the Glass",
    src: "/Notes_on_the_Glass.mp3",
    durationApprox: "3:00",
  },
];

class BackgroundMusicEngine {
  private audio: HTMLAudioElement | null = null;
  private currentTrackIndex: number = 0;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private volume: number = 0.35; // Balanced ambient background level
  private listeners: Set<() => void> = new Set();
  private userHasInteracted: boolean = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.initAudio(0);
    }
  }

  private initAudio(index: number) {
    this.currentTrackIndex = (index + PLAYLIST.length) % PLAYLIST.length;
    const track = PLAYLIST[this.currentTrackIndex];

    if (this.audio) {
      this.audio.pause();
      this.audio.src = track.src;
      this.audio.load();
    } else {
      this.audio = new Audio(track.src);
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

      // When the current track ends, automatically advance and play the next song in the playlist!
      this.audio.addEventListener("ended", () => {
        this.nextTrack(true);
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

  public nextTrack(autoPlay = true) {
    const nextIdx = (this.currentTrackIndex + 1) % PLAYLIST.length;
    this.currentTrackIndex = nextIdx;
    if (this.audio) {
      this.audio.src = PLAYLIST[nextIdx].src;
      this.audio.load();
      if (autoPlay || this.isPlaying) {
        this.play();
      } else {
        this.notify();
      }
    }
  }

  public prevTrack(autoPlay = true) {
    const prevIdx = (this.currentTrackIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
    this.currentTrackIndex = prevIdx;
    if (this.audio) {
      this.audio.src = PLAYLIST[prevIdx].src;
      this.audio.load();
      if (autoPlay || this.isPlaying) {
        this.play();
      } else {
        this.notify();
      }
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

  public getCurrentTrack(): Track {
    return PLAYLIST[this.currentTrackIndex] || PLAYLIST[0];
  }

  public getCurrentTrackIndex(): number {
    return this.currentTrackIndex;
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

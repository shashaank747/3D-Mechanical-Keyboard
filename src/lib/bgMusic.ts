// Background Music Audio Engine with Shuffled Non-Repeating Cycle Queue
// Guarantees all 4 songs are played in random order before any song repeats

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
  private shuffledQueue: number[] = [];
  private queuePosition: number = 0; // index pointer in shuffledQueue
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private volume: number = 0.35; // Balanced ambient background level
  private listeners: Set<() => void> = new Set();
  private userHasInteracted: boolean = false;

  constructor() {
    this.generateNewShuffledQueue();
    if (typeof window !== "undefined") {
      this.initAudio(this.getCurrentTrackIndex());
    }
  }

  // Fisher-Yates Shuffle that guarantees each of the 4 songs is queued once per cycle
  private generateNewShuffledQueue(lastPlayedTrackIndex?: number) {
    const indices = PLAYLIST.map((_, i) => i);
    
    // Shuffle the indices randomly
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    // Ensure the first song of the new cycle is not identical to the last played song
    if (lastPlayedTrackIndex !== undefined && indices.length > 1 && indices[0] === lastPlayedTrackIndex) {
      const swapWith = 1 + Math.floor(Math.random() * (indices.length - 1));
      [indices[0], indices[swapWith]] = [indices[swapWith], indices[0]];
    }

    this.shuffledQueue = indices;
    this.queuePosition = 0;
  }

  public getCurrentTrackIndex(): number {
    if (this.shuffledQueue.length === 0) return 0;
    return this.shuffledQueue[this.queuePosition] ?? 0;
  }

  private initAudio(trackIndex: number) {
    const track = PLAYLIST[trackIndex] || PLAYLIST[0];

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

      // When the current track ends, advance to the next song in the shuffled queue
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
          // Autoplay policy prevented playback until user interaction
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
    const currentTrackIdx = this.getCurrentTrackIndex();
    this.queuePosition += 1;

    // When all 4 songs have finished playing, reshuffle for a new randomized cycle
    if (this.queuePosition >= this.shuffledQueue.length) {
      this.generateNewShuffledQueue(currentTrackIdx);
    }

    const nextIdx = this.getCurrentTrackIndex();
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
    if (this.queuePosition > 0) {
      this.queuePosition -= 1;
    } else {
      this.queuePosition = Math.max(0, this.shuffledQueue.length - 1);
    }

    const prevIdx = this.getCurrentTrackIndex();
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
    const idx = this.getCurrentTrackIndex();
    return PLAYLIST[idx] || PLAYLIST[0];
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

import { StorageManager } from "./StorageManager";
import { DEFAULT_VOLUME, STORAGE_MUTED_KEY, STORAGE_VOLUME_KEY } from "../config/GameConfig";

export type SoundEffect = "coin" | "lifeLost" | "gameOver" | "uiClick" | "pause";

export class SoundManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private musicTimer: number | null = null;
  private muted: boolean;
  private volume: number;

  constructor() {
    this.muted = StorageManager.getBoolean(STORAGE_MUTED_KEY, false);
    this.volume = StorageManager.getNumber(STORAGE_VOLUME_KEY, DEFAULT_VOLUME);
  }

  public unlock(): void {
    if (this.ctx) {
      return;
    }
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) {
      return;
    }
    this.ctx = new Ctor();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = this.muted ? 0 : this.volume;
    this.masterGain.connect(this.ctx.destination);

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.value = 0.5;
    this.musicGain.connect(this.masterGain);
  }

  public play(effect: SoundEffect): void {
    if (!this.ctx || !this.masterGain) {
      return;
    }
    switch (effect) {
      case "coin":
        this.tone(880, 0.08, "sine", 0.25);
        this.tone(1320, 0.1, "sine", 0.15, 0.06);
        break;
      case "lifeLost":
        this.tone(220, 0.25, "sawtooth", 0.3);
        this.tone(140, 0.3, "square", 0.2, 0.1);
        break;
      case "gameOver":
        this.tone(392, 0.25, "triangle", 0.3);
        this.setTimeout(() => this.tone(330, 0.25, "triangle", 0.3), 250);
        this.setTimeout(() => this.tone(262, 0.5, "triangle", 0.3), 500);
        break;
      case "uiClick":
        this.tone(600, 0.05, "square", 0.15);
        break;
      case "pause":
        this.tone(520, 0.08, "sine", 0.2);
        break;
      default:
        break;
    }
  }

  public startMusic(): void {
    if (!this.ctx || !this.musicGain || this.musicTimer !== null) {
      return;
    }
    this.scheduleNote();
  }

  public stopMusic(): void {
    if (this.musicTimer !== null) {
      window.clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    StorageManager.setBoolean(STORAGE_MUTED_KEY, muted);
    if (this.masterGain) {
      this.masterGain.gain.value = muted ? 0 : this.volume;
    }
  }

  public toggleMuted(): boolean {
    this.setMuted(!this.isMuted());
    return this.isMuted();
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    StorageManager.setNumber(STORAGE_VOLUME_KEY, this.volume);
    if (this.masterGain && !this.muted) {
      this.masterGain.gain.value = this.volume;
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  private scheduleNote(): void {
    if (!this.ctx || !this.musicGain) {
      return;
    }
    const notes = [262, 330, 392, 523, 392, 330];
    const when = this.ctx.currentTime + 0.05;
    for (let i = 0; i < 6; i++) {
      this.tone(
        notes[i % notes.length],
        0.18,
        "triangle",
        0.12,
        0.05,
        when + i * 0.22,
        this.musicGain,
      );
    }
    this.musicTimer = this.setTimeout(() => this.scheduleNote(), 6 * 0.22 * 1000);
  }

  private tone(
    freq: number,
    duration: number,
    type: OscillatorType,
    peak: number,
    delay: number = 0,
    when?: number,
    destination?: AudioNode,
  ): void {
    if (!this.ctx || !this.masterGain) {
      return;
    }
    const ctx = this.ctx;
    const t0 = when ?? ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(gain);
    gain.connect(destination ?? this.masterGain);
    osc.start(t0);
    osc.stop(t0 + duration + 0.02);
  }

  private setTimeout(callback: () => void, delay: number): number {
    return window.setTimeout(callback, delay);
  }
}

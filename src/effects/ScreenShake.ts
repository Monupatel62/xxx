import { Random } from "../math/Random";

export class ScreenShake {
  private intensity: number = 0;
  private duration: number = 0;
  private elapsed: number = 0;

  public trigger(intensity: number = 6, duration: number = 0.25): void {
    this.intensity = Math.max(this.intensity, intensity);
    this.duration = Math.max(this.duration, duration);
    this.elapsed = 0;
  }

  public update(deltaTime: number): void {
    if (this.duration <= 0) {
      return;
    }
    this.elapsed += deltaTime;
    if (this.elapsed >= this.duration) {
      this.intensity = 0;
      this.duration = 0;
      this.elapsed = 0;
    }
  }

  public getOffset(): { x: number; y: number } {
    if (this.duration <= 0) {
      return { x: 0, y: 0 };
    }
    const progress = 1 - this.elapsed / this.duration;
    const amount = this.intensity * progress;
    return {
      x: Random.range(-amount, amount),
      y: Random.range(-amount, amount),
    };
  }

  public isActive(): boolean {
    return this.duration > 0;
  }
}

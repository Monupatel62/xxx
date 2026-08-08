export class Time {
  private lastTime: number = 0;
  private elapsedTime: number = 0;
  private deltaTime: number = 0;
  private fps: number = 0;
  private frameCount: number = 0;
  private fpsTimer: number = 0;
  private readonly fixedDeltaTime: number;
  private readonly maxDeltaTime: number = 0.25;

  constructor(fixedDeltaTime: number = 1 / 60) {
    this.fixedDeltaTime = fixedDeltaTime;
  }

  public update(currentTime: number): void {
    if (this.lastTime === 0) {
      this.lastTime = currentTime;
      this.deltaTime = this.fixedDeltaTime;
      return;
    }

    this.deltaTime = Math.min((currentTime - this.lastTime) / 1000, this.maxDeltaTime);
    this.lastTime = currentTime;
    this.elapsedTime += this.deltaTime;

    this.frameCount += 1;
    this.fpsTimer += this.deltaTime;
    if (this.fpsTimer >= 0.5) {
      this.fps = Math.round(this.frameCount / this.fpsTimer);
      this.frameCount = 0;
      this.fpsTimer = 0;
    }
  }

  public getDeltaTime(): number {
    return this.deltaTime;
  }

  public getElapsedTime(): number {
    return this.elapsedTime;
  }

  public getFps(): number {
    return this.fps;
  }

  public getFixedDeltaTime(): number {
    return this.fixedDeltaTime;
  }

  public reset(): void {
    this.lastTime = 0;
    this.elapsedTime = 0;
    this.deltaTime = 0;
    this.fps = 0;
    this.frameCount = 0;
    this.fpsTimer = 0;
  }
}

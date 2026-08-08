import { Time } from "./Time";

export type UpdateCallback = (fixedDeltaTime: number) => void;
export type RenderCallback = () => void;

export class GameLoop {
  private readonly time: Time;
  private readonly onUpdate: UpdateCallback;
  private readonly onRender: RenderCallback;
  private running: boolean = false;
  private animationFrameId: number | null = null;
  private accumulator: number = 0;

  constructor(onUpdate: UpdateCallback, onRender: RenderCallback, fixedDeltaTime: number = 1 / 60) {
    this.onUpdate = onUpdate;
    this.onRender = onRender;
    this.time = new Time(fixedDeltaTime);
  }

  public start(): void {
    if (this.running) {
      return;
    }
    this.running = true;
    this.accumulator = 0;
    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  public stop(): void {
    this.running = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public getTime(): Time {
    return this.time;
  }

  public isRunning(): boolean {
    return this.running;
  }

  private loop = (timestamp: number): void => {
    if (!this.running) {
      return;
    }

    this.time.update(timestamp);
    this.accumulator += this.time.getDeltaTime();

    const fixedDeltaTime = this.time.getFixedDeltaTime();
    while (this.accumulator >= fixedDeltaTime) {
      this.onUpdate(fixedDeltaTime);
      this.accumulator -= fixedDeltaTime;
    }

    this.onRender();
    this.animationFrameId = requestAnimationFrame(this.loop);
  };
}

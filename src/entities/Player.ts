import { Entity } from "./Entity";
import { Renderer } from "../engine/Renderer";
import { Rect } from "../math/Rect";
import { MathUtils } from "../math/MathUtils";

export class Player extends Entity {
  public rect: Rect;
  public speed: number;
  private velocityX: number = 0;
  private tilt: number = 0;
  private glowPulse: number = 0;

  constructor(x: number, y: number, width: number, height: number, speed: number) {
    super();
    this.rect = new Rect(x, y, width, height);
    this.speed = speed;
  }

  public update(deltaTime: number): void {
    this.rect.x += this.velocityX * deltaTime;
    const targetTilt = MathUtils.clamp(this.velocityX / this.speed, -1, 1) * 0.15;
    this.tilt += (targetTilt - this.tilt) * Math.min(1, deltaTime * 12);
    this.glowPulse += deltaTime * 4;
  }

  public render(renderer: Renderer): void {
    const ctx = renderer.getContext();
    const cx = this.rect.centerX;
    const cy = this.rect.centerY;
    const glowAlpha = 0.15 + 0.08 * Math.sin(this.glowPulse);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.tilt);
    ctx.translate(-cx, -cy);

    ctx.shadowColor = "#4ade80";
    ctx.shadowBlur = 12;
    renderer.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height, "#4ade80");
    ctx.shadowBlur = 0;

    renderer.fillRect(this.rect.x + 6, this.rect.y - 6, this.rect.width - 12, 6, "#22c55e");
    renderer.fillRect(this.rect.x + 10, this.rect.y + 4, this.rect.width - 20, 4, "#16a34a");

    ctx.globalAlpha = glowAlpha;
    renderer.fillRect(
      this.rect.x - 2,
      this.rect.y - 2,
      this.rect.width + 4,
      this.rect.height + 4,
      "#4ade80",
    );
    ctx.globalAlpha = 1;

    ctx.restore();
  }

  public moveLeft(): void {
    this.velocityX = -this.speed;
  }

  public moveRight(): void {
    this.velocityX = this.speed;
  }

  public stop(): void {
    this.velocityX = 0;
  }

  public moveToward(targetX: number): void {
    const centerX = this.rect.x + this.rect.width / 2;
    const delta = targetX - centerX;

    if (delta > 1) {
      this.velocityX = this.speed;
    } else if (delta < -1) {
      this.velocityX = -this.speed;
    } else {
      this.velocityX = 0;
    }
  }

  public clampToScreen(screenWidth: number): void {
    this.rect.x = MathUtils.clamp(this.rect.x, 0, screenWidth - this.rect.width);
  }

  public getVelocityX(): number {
    return this.velocityX;
  }

  public reset(x: number): void {
    this.rect.x = x;
    this.velocityX = 0;
    this.tilt = 0;
    this.glowPulse = 0;
  }
}

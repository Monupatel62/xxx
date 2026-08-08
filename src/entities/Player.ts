import { Entity } from "./Entity";
import { Renderer } from "../engine/Renderer";
import { Rect } from "../math/Rect";
import { MathUtils } from "../math/MathUtils";

export class Player extends Entity {
  public rect: Rect;
  public speed: number;
  private velocityX: number = 0;

  constructor(x: number, y: number, width: number, height: number, speed: number) {
    super();
    this.rect = new Rect(x, y, width, height);
    this.speed = speed;
  }

  public update(deltaTime: number): void {
    this.rect.x += this.velocityX * deltaTime;
  }

  public render(renderer: Renderer): void {
    renderer.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height, "#4ade80");
    renderer.fillRect(this.rect.x + 6, this.rect.y - 6, this.rect.width - 12, 6, "#22c55e");
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
  }
}

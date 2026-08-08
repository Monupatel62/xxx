import { Entity } from "./Entity";
import { Renderer } from "../engine/Renderer";

export class Coin extends Entity {
  public x: number;
  public y: number;
  public radius: number;
  public speed: number;

  constructor(x: number, y: number, radius: number, speed: number) {
    super();
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = speed;
  }

  public update(deltaTime: number): void {
    this.y += this.speed * deltaTime;
  }

  public render(renderer: Renderer): void {
    renderer.fillCircle(this.x, this.y, this.radius, "#facc15");
    renderer.strokeCircle(this.x, this.y, this.radius, "#a16207", 2);
  }

  public reset(x: number, y: number, speed?: number): void {
    this.x = x;
    this.y = y;
    if (speed !== undefined) {
      this.speed = speed;
    }
    this.isActive = true;
  }
}

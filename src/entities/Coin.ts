import { Entity } from "./Entity";
import { Renderer } from "../engine/Renderer";
import { CoinType, CoinTypeConfig, COIN_TYPES } from "../config/GameConfig";

export class Coin extends Entity {
  public x: number;
  public y: number;
  public radius: number;
  public speed: number;
  public coinType: CoinType;
  public rotation: number = 0;
  private config: CoinTypeConfig;

  constructor(x: number, y: number, radius: number, speed: number, coinType: CoinType = "normal") {
    super();
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = speed;
    this.coinType = coinType;
    this.config = this.getConfig(coinType);
  }

  public update(deltaTime: number): void {
    this.y += this.speed * deltaTime;
    this.rotation += deltaTime * (this.coinType === "bonus" ? 6 : 4);
  }

  public render(renderer: Renderer): void {
    const ctx = renderer.getContext();
    const squash = 0.75 + 0.25 * Math.abs(Math.cos(this.rotation));
    const drawRadiusX = this.radius * squash;
    const drawRadiusY = this.radius;

    ctx.save();
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, drawRadiusX, drawRadiusY, 0, 0, Math.PI * 2);
    ctx.fillStyle = this.config.color;
    ctx.fill();
    ctx.strokeStyle = this.config.strokeColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(
      this.x - drawRadiusX * 0.25,
      this.y - drawRadiusY * 0.2,
      drawRadiusX * 0.15,
      drawRadiusY * 0.12,
      -0.4,
      0,
      Math.PI * 2,
    );
    ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
    ctx.fill();
    ctx.restore();

    if (this.config.label) {
      renderer.fillText(this.config.label, this.x, this.y + 5, {
        color: "#ffffff",
        font: "bold 12px Arial",
        align: "center",
      });
    }
  }

  public getValue(): number {
    return this.config.value;
  }

  public getColor(): string {
    return this.config.color;
  }

  public reset(x: number, y: number, speed?: number, coinType?: CoinType): void {
    this.x = x;
    this.y = y;
    if (speed !== undefined) {
      this.speed = speed;
    }
    if (coinType !== undefined) {
      this.coinType = coinType;
      this.config = this.getConfig(coinType);
    }
    this.rotation = 0;
    this.isActive = true;
  }

  private getConfig(coinType: CoinType): CoinTypeConfig {
    return COIN_TYPES.find((c) => c.type === coinType) ?? COIN_TYPES[0];
  }
}

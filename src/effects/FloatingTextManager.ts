import { Renderer } from "../engine/Renderer";
import { withAlpha } from "../utils/colorUtils";

interface FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  font: string;
  life: number;
  maxLife: number;
  vy: number;
}

export class FloatingTextManager {
  private readonly texts: FloatingText[] = [];

  public spawn(
    x: number,
    y: number,
    text: string,
    color: string = "#ffd93d",
    font: string = "bold 18px Arial",
  ): void {
    this.texts.push({
      x,
      y,
      text,
      color,
      font,
      life: 0,
      maxLife: 0.9,
      vy: -80,
    });
  }

  public update(deltaTime: number): void {
    for (let i = this.texts.length - 1; i >= 0; i--) {
      const t = this.texts[i];
      t.life += deltaTime;
      t.y += t.vy * deltaTime;
      t.vy *= 0.95;
      if (t.life >= t.maxLife) {
        this.texts.splice(i, 1);
      }
    }
  }

  public render(renderer: Renderer): void {
    for (const t of this.texts) {
      const alpha = 1 - t.life / t.maxLife;
      renderer.fillText(t.text, t.x, t.y, {
        color: withAlpha(t.color, alpha),
        font: t.font,
        align: "center",
      });
    }
  }

  public clear(): void {
    this.texts.length = 0;
  }
}

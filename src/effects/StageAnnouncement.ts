import { Renderer } from "../engine/Renderer";
import { GAME_WIDTH, GAME_HEIGHT } from "../config/GameConfig";

export class StageAnnouncement {
  private text: string = "";
  private life: number = 0;
  private readonly displayDuration: number = 2;

  public show(stageName: string): void {
    this.text = stageName.toUpperCase();
    this.life = 0;
  }

  public update(deltaTime: number): void {
    if (this.text && this.life < this.displayDuration) {
      this.life += deltaTime;
    }
  }

  public render(renderer: Renderer): void {
    if (!this.text || this.life >= this.displayDuration) {
      return;
    }

    const progress = this.life / this.displayDuration;
    let alpha = 1;
    if (progress < 0.15) {
      alpha = progress / 0.15;
    } else if (progress > 0.75) {
      alpha = (1 - progress) / 0.25;
    }

    const scale = 1 + 0.1 * Math.sin(this.life * 8);
    const fontSize = Math.round(36 * scale);

    renderer.fillText(this.text, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 80, {
      color: `rgba(136, 208, 255, ${alpha.toFixed(2)})`,
      font: `bold ${fontSize}px Arial`,
      align: "center",
    });
  }

  public clear(): void {
    this.text = "";
    this.life = 0;
  }
}

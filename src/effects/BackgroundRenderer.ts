import { Renderer } from "../engine/Renderer";
import { GAME_WIDTH, GAME_HEIGHT } from "../config/GameConfig";
import { Random } from "../math/Random";

interface Star {
  x: number;
  y: number;
  radius: number;
  speed: number;
  phase: number;
}

export class BackgroundRenderer {
  private readonly stars: Star[] = [];
  private elapsed: number = 0;

  constructor(starCount: number = 60) {
    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: Random.range(0, GAME_WIDTH),
        y: Random.range(0, GAME_HEIGHT),
        radius: Random.range(0.5, 2),
        speed: Random.range(0.5, 2),
        phase: Random.range(0, Math.PI * 2),
      });
    }
  }

  public update(deltaTime: number): void {
    this.elapsed += deltaTime;
    for (const star of this.stars) {
      star.y += star.speed * 20 * deltaTime;
      if (star.y > GAME_HEIGHT + 4) {
        star.y = -4;
        star.x = Random.range(0, GAME_WIDTH);
      }
    }
  }

  public render(renderer: Renderer): void {
    const ctx = renderer.getContext();
    const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
    gradient.addColorStop(0, "#0f0c29");
    gradient.addColorStop(0.5, "#151535");
    gradient.addColorStop(1, "#1a1a2e");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    for (const star of this.stars) {
      const twinkle =
        0.3 + 0.7 * (0.5 + 0.5 * Math.sin(this.elapsed * star.speed * 2 + star.phase));
      renderer.fillCircle(
        star.x,
        star.y,
        star.radius,
        `rgba(255, 255, 255, ${twinkle.toFixed(2)})`,
      );
    }

    renderer.line(0, GAME_HEIGHT - 48, GAME_WIDTH, GAME_HEIGHT - 48, "rgba(74, 222, 128, 0.15)", 1);
  }
}

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

interface Cloud {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  alpha: number;
}

export class BackgroundRenderer {
  private readonly stars: Star[] = [];
  private readonly clouds: Cloud[] = [];
  private elapsed: number = 0;

  constructor(starCount: number = 60) {
    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: Random.range(0, GAME_WIDTH),
        y: Random.range(0, GAME_HEIGHT * 0.7),
        radius: Random.range(0.5, 2.2),
        speed: Random.range(0.3, 1.5),
        phase: Random.range(0, Math.PI * 2),
      });
    }

    // Generate a few soft cloud shapes
    for (let i = 0; i < 4; i++) {
      this.clouds.push({
        x: Random.range(0, GAME_WIDTH),
        y: Random.range(40, GAME_HEIGHT * 0.45),
        width: Random.range(80, 160),
        height: Random.range(24, 48),
        speed: Random.range(8, 18),
        alpha: Random.range(0.04, 0.09),
      });
    }
  }

  public update(deltaTime: number): void {
    this.elapsed += deltaTime;

    for (const star of this.stars) {
      star.y += star.speed * 18 * deltaTime;
      if (star.y > GAME_HEIGHT * 0.75) {
        star.y = -4;
        star.x = Random.range(0, GAME_WIDTH);
      }
    }

    for (const cloud of this.clouds) {
      cloud.x += cloud.speed * deltaTime;
      if (cloud.x > GAME_WIDTH + cloud.width) {
        cloud.x = -cloud.width;
        cloud.y = Random.range(40, GAME_HEIGHT * 0.45);
      }
    }
  }

  public render(renderer: Renderer): void {
    const ctx = renderer.getContext();

    // Deep space gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
    gradient.addColorStop(0, "#06051a");
    gradient.addColorStop(0.4, "#0d0b2e");
    gradient.addColorStop(0.75, "#141435");
    gradient.addColorStop(1, "#1a1a44");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Stars
    for (const star of this.stars) {
      const twinkle = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(this.elapsed * star.speed * 2.2 + star.phase));
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${twinkle.toFixed(2)})`;
      ctx.fill();
    }

    // Soft nebula glow in the upper area
    const nebulaGrad = ctx.createRadialGradient(
      GAME_WIDTH * 0.65, GAME_HEIGHT * 0.2, 0,
      GAME_WIDTH * 0.65, GAME_HEIGHT * 0.2, 220,
    );
    nebulaGrad.addColorStop(0, "rgba(120, 80, 255, 0.07)");
    nebulaGrad.addColorStop(1, "rgba(120, 80, 255, 0)");
    ctx.fillStyle = nebulaGrad;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    const nebulaGrad2 = ctx.createRadialGradient(
      GAME_WIDTH * 0.2, GAME_HEIGHT * 0.35, 0,
      GAME_WIDTH * 0.2, GAME_HEIGHT * 0.35, 160,
    );
    nebulaGrad2.addColorStop(0, "rgba(0, 200, 180, 0.05)");
    nebulaGrad2.addColorStop(1, "rgba(0, 200, 180, 0)");
    ctx.fillStyle = nebulaGrad2;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Soft clouds
    for (const cloud of this.clouds) {
      ctx.save();
      ctx.globalAlpha = cloud.alpha;
      ctx.fillStyle = "#a0c4ff";
      ctx.beginPath();
      ctx.ellipse(cloud.x, cloud.y, cloud.width / 2, cloud.height / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cloud.x - cloud.width * 0.22, cloud.y + 4, cloud.width * 0.28, cloud.height * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cloud.x + cloud.width * 0.22, cloud.y + 6, cloud.width * 0.24, cloud.height * 0.36, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Ground platform
    const groundY = GAME_HEIGHT - 48;
    const groundGrad = ctx.createLinearGradient(0, groundY, 0, GAME_HEIGHT);
    groundGrad.addColorStop(0, "rgba(74, 222, 128, 0.18)");
    groundGrad.addColorStop(1, "rgba(74, 222, 128, 0.04)");
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, groundY, GAME_WIDTH, GAME_HEIGHT - groundY);

    ctx.strokeStyle = "rgba(74, 222, 128, 0.35)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(GAME_WIDTH, groundY);
    ctx.stroke();
  }
}

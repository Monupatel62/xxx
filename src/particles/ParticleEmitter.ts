import { Renderer } from "../engine/Renderer";
import { Particle } from "./Particle";
import { COIN_COLOR, PLAYER_COLOR } from "../config/GameConfig";
import { withAlpha } from "../utils/colorUtils";

export interface BurstEffect {
  x: number;
  y: number;
  count: number;
  color: string;
  speed: number;
  size: number;
  life: number;
}

export class ParticleEmitter {
  private readonly particles: Particle[] = [];

  public burst(effect: BurstEffect): void {
    const spawned = Particle.randomBurst(
      effect.x,
      effect.y,
      effect.count,
      effect.color,
      effect.speed,
      effect.size,
      effect.life,
    );
    this.particles.push(...spawned);
  }

  public bonusSparkle(x: number, y: number): void {
    this.burst({ x, y, count: 18, color: "#f97316", speed: 160, size: 5, life: 0.6 });
  }

  public comboBurst(x: number, y: number): void {
    this.burst({ x, y, count: 8, color: "#ffd93d", speed: 100, size: 3, life: 0.4 });
  }

  public coinSparkle(x: number, y: number): void {
    this.burst({ x, y, count: 12, color: COIN_COLOR, speed: 140, size: 4, life: 0.5 });
  }

  public lifeLost(x: number, y: number): void {
    this.burst({ x, y, count: 20, color: "#ff6b6b", speed: 200, size: 5, life: 0.6 });
  }

  public gameOver(x: number, y: number): void {
    this.burst({ x, y, count: 40, color: PLAYER_COLOR, speed: 260, size: 6, life: 1.0 });
  }

  public update(deltaTime: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      particle.update(deltaTime);
      if (particle.isExpired()) {
        this.particles.splice(i, 1);
      }
    }
  }

  public render(renderer: Renderer): void {
    for (const particle of this.particles) {
      renderer.fillCircle(
        particle.x,
        particle.y,
        Math.max(particle.size, 0.5),
        withAlpha(particle.color, particle.getAlpha()),
      );
    }
  }

  public getCount(): number {
    return this.particles.length;
  }

  public clear(): void {
    this.particles.length = 0;
  }
}

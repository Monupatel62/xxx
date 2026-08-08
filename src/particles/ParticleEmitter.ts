import { Renderer } from "../engine/Renderer";
import { Particle } from "./Particle";
import { COIN_COLOR, PLAYER_COLOR } from "../config/GameConfig";

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
        this.withAlpha(particle),
      );
    }
  }

  public getCount(): number {
    return this.particles.length;
  }

  public clear(): void {
    this.particles.length = 0;
  }

  private withAlpha(particle: Particle): string {
    const alpha = particle.getAlpha();
    if (particle.color.startsWith("#")) {
      const hex = particle.color.slice(1);
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
    }
    // Handle rgb(...) or named colors by rendering at full color — alpha via globalAlpha.
    // For rgba(...) strings, replace the alpha component directly.
    const rgbaMatch = particle.color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgbaMatch) {
      return `rgba(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, ${alpha.toFixed(2)})`;
    }
    return particle.color;
  }
}

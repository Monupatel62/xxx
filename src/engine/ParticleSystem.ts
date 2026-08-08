import { Renderer } from "./Renderer";
import { Random } from "../math/Random";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export interface EmitOptions {
  x: number;
  y: number;
  count: number;
  color: string;
  speed?: number;
  size?: number;
  life?: number;
}

export class ParticleSystem {
  private readonly particles: Particle[] = [];

  public emit(options: EmitOptions): void {
    const speed = options.speed ?? 120;
    const size = options.size ?? 4;
    const life = options.life ?? 0.6;

    for (let i = 0; i < options.count; i++) {
      const angle = Random.range(0, Math.PI * 2);
      const magnitude = Random.range(speed * 0.3, speed);
      this.particles.push({
        x: options.x,
        y: options.y,
        vx: Math.cos(angle) * magnitude,
        vy: Math.sin(angle) * magnitude,
        life: 0,
        maxLife: life,
        size: Random.range(size * 0.5, size * 1.5),
        color: options.color,
      });
    }
  }

  public update(deltaTime: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      particle.life += deltaTime;
      if (particle.life >= particle.maxLife) {
        this.particles.splice(i, 1);
        continue;
      }
      particle.x += particle.vx * deltaTime;
      particle.y += particle.vy * deltaTime;
      const drag = 1 - 2 * deltaTime;
      particle.vx *= Math.max(drag, 0);
      particle.vy *= Math.max(drag, 0);
    }
  }

  public render(renderer: Renderer): void {
    for (const particle of this.particles) {
      const alpha = 1 - particle.life / particle.maxLife;
      const color = this.withAlpha(particle.color, alpha);
      renderer.fillCircle(particle.x, particle.y, Math.max(particle.size, 0.5), color);
    }
  }

  public clear(): void {
    this.particles.length = 0;
  }

  private withAlpha(color: string, alpha: number): string {
    const clamped = Math.max(0, Math.min(1, alpha));
    if (color.startsWith("#")) {
      const hex = color.slice(1);
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${clamped.toFixed(2)})`;
    }
    return color;
  }
}

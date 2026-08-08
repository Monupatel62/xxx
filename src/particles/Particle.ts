import { Random } from "../math/Random";

export interface ParticleInit {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export class Particle {
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public life: number;
  public readonly maxLife: number;
  public size: number;
  public color: string;

  constructor(init: ParticleInit) {
    this.x = init.x;
    this.y = init.y;
    this.vx = init.vx;
    this.vy = init.vy;
    this.life = init.life;
    this.maxLife = init.maxLife;
    this.size = init.size;
    this.color = init.color;
  }

  public update(deltaTime: number): void {
    this.life += deltaTime;
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;
    const drag = Math.max(0, 1 - 2 * deltaTime);
    this.vx *= drag;
    this.vy *= drag;
    this.vy += 60 * deltaTime; // gentle gravity
  }

  public isExpired(): boolean {
    return this.life >= this.maxLife;
  }

  public getAlpha(): number {
    return Math.max(0, Math.min(1, 1 - this.life / this.maxLife));
  }

  public static randomBurst(
    x: number,
    y: number,
    count: number,
    color: string,
    speed: number,
    size: number,
    life: number,
  ): Particle[] {
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Random.range(0, Math.PI * 2);
      const magnitude = Random.range(speed * 0.3, speed);
      particles.push(
        new Particle({
          x,
          y,
          vx: Math.cos(angle) * magnitude,
          vy: Math.sin(angle) * magnitude,
          life: 0,
          maxLife: life,
          size: Random.range(size * 0.5, size * 1.5),
          color,
        }),
      );
    }
    return particles;
  }
}

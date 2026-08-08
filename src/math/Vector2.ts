export class Vector2 {
  public x: number;
  public y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  public set(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }

  public add(other: Vector2): this {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  public subtract(other: Vector2): this {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }

  public scale(scalar: number): this {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  public length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  public lengthSquared(): number {
    return this.x * this.x + this.y * this.y;
  }

  public distanceTo(other: Vector2): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  public clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  public static zero(): Vector2 {
    return new Vector2(0, 0);
  }

  public static from(other: Vector2): Vector2 {
    return new Vector2(other.x, other.y);
  }
}

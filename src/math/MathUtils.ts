export class MathUtils {
  public static clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  public static clamp01(value: number): number {
    return MathUtils.clamp(value, 0, 1);
  }

  public static lerp(a: number, b: number, t: number): number {
    return a + (b - a) * MathUtils.clamp01(t);
  }

  public static moveTowards(current: number, target: number, maxDelta: number): number {
    if (Math.abs(target - current) <= maxDelta) {
      return target;
    }
    return current + Math.sign(target - current) * maxDelta;
  }

  public static distance(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

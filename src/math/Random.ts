export class Random {
  public static range(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  public static int(min: number, max: number): number {
    return Math.floor(Random.range(min, max + 1));
  }

  public static boolean(): boolean {
    return Math.random() < 0.5;
  }
}

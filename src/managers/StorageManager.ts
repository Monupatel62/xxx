export class StorageManager {
  private static readonly PREFIX = "xxx-game:";

  public static getItem(key: string): string | null {
    try {
      return window.localStorage.getItem(this.PREFIX + key);
    } catch {
      return null;
    }
  }

  public static setItem(key: string, value: string): void {
    try {
      window.localStorage.setItem(this.PREFIX + key, value);
    } catch {
      // Storage unavailable; ignore silently.
    }
  }

  public static getNumber(key: string, fallback: number): number {
    const value = this.getItem(key);
    if (value === null) {
      return fallback;
    }
    const parsed = Number(value);
    return Number.isNaN(parsed) ? fallback : parsed;
  }

  public static setNumber(key: string, value: number): void {
    this.setItem(key, String(value));
  }

  public static getBoolean(key: string, fallback: boolean): boolean {
    const value = this.getItem(key);
    if (value === null) {
      return fallback;
    }
    return value === "true";
  }

  public static setBoolean(key: string, value: boolean): void {
    this.setItem(key, String(value));
  }

  public static removeItem(key: string): void {
    try {
      window.localStorage.removeItem(this.PREFIX + key);
    } catch {
      // Ignore.
    }
  }
}

import { COMBO_TIER_SIZE, COMBO_MAX_MULTIPLIER } from "../config/GameConfig";

export class ComboManager {
  private combo: number = 0;
  private maxCombo: number = 0;

  public reset(): void {
    this.combo = 0;
    this.maxCombo = 0;
  }

  public increment(): number {
    this.combo++;
    this.maxCombo = Math.max(this.maxCombo, this.combo);
    return this.combo;
  }

  public break(): void {
    this.combo = 0;
  }

  public getCombo(): number {
    return this.combo;
  }

  public getMaxCombo(): number {
    return this.maxCombo;
  }

  public getMultiplier(): number {
    if (this.combo <= 1) {
      return 1;
    }
    const tier = Math.floor((this.combo - 1) / COMBO_TIER_SIZE);
    return Math.min(1 + tier, COMBO_MAX_MULTIPLIER);
  }

  public getBonusPoints(basePoints: number): number {
    return basePoints * this.getMultiplier();
  }
}

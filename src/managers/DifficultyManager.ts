import {
  DIFFICULTY_STAGES,
  DIFFICULTY_STAGE_DURATION,
  DifficultyStage,
} from "../config/GameConfig";

export class DifficultyManager {
  private elapsed: number = 0;

  public reset(): void {
    this.elapsed = 0;
  }

  public update(deltaTime: number): void {
    this.elapsed += deltaTime;
  }

  public getStageIndex(): number {
    const index = Math.floor(this.elapsed / DIFFICULTY_STAGE_DURATION);
    return Math.min(index, DIFFICULTY_STAGES.length - 1);
  }

  public getStage(): DifficultyStage {
    return DIFFICULTY_STAGES[this.getStageIndex()];
  }

  public getSpawnInterval(): number {
    return this.getStage().spawnInterval;
  }

  public getCoinSpeed(): number {
    return this.getStage().coinSpeed;
  }

  public getStageName(): string {
    return this.getStage().name;
  }
}

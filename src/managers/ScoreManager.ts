import { EventBus } from "../engine/EventBus";
import { StorageManager } from "./StorageManager";
import { STORAGE_HIGH_SCORE_KEY, STORAGE_BEST_TIME_KEY } from "../config/GameConfig";

export const EVT_SCORE_CHANGED = "scoreChanged";
export const EVT_COIN_COLLECTED = "coinCollected";
export const EVT_GAME_OVER = "gameOver";

export interface GameResult {
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  bestTime: number;
  isNewBestTime: boolean;
}

export class ScoreManager {
  private score: number = 0;
  private highScore: number;
  private bestTime: number;
  private readonly eventBus: EventBus;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.highScore = StorageManager.getNumber(STORAGE_HIGH_SCORE_KEY, 0);
    this.bestTime = StorageManager.getNumber(STORAGE_BEST_TIME_KEY, 0);
  }

  public add(points: number): void {
    this.score += points;
    this.eventBus.emit(EVT_COIN_COLLECTED, { points });
    this.eventBus.emit(EVT_SCORE_CHANGED, { score: this.score });
  }

  public reset(): void {
    this.score = 0;
    this.eventBus.emit(EVT_SCORE_CHANGED, { score: this.score });
  }

  public getScore(): number {
    return this.score;
  }

  public getHighScore(): number {
    return this.highScore;
  }

  public getBestTime(): number {
    return this.bestTime;
  }

  public finishGame(timeSurvived: number): GameResult {
    const isNewHighScore = this.score > this.highScore;
    if (isNewHighScore) {
      this.highScore = this.score;
      StorageManager.setNumber(STORAGE_HIGH_SCORE_KEY, this.highScore);
    }

    const isNewBestTime = timeSurvived > this.bestTime;
    if (isNewBestTime) {
      this.bestTime = timeSurvived;
      StorageManager.setNumber(STORAGE_BEST_TIME_KEY, this.bestTime);
    }

    return {
      score: this.score,
      highScore: this.highScore,
      isNewHighScore,
      bestTime: this.bestTime,
      isNewBestTime,
    };
  }
}

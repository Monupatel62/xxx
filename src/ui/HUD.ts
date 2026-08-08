import { Renderer } from "../engine/Renderer";
import { GAME_WIDTH, MAX_LIVES } from "../config/GameConfig";

export interface HUDState {
  score: number;
  highScore: number;
  lives: number;
  timeLeft: number;
  difficultyStage: string;
  muted: boolean;
}

export class HUD {
  public update(state: HUDState): void {
    this.score = state.score;
    this.highScore = state.highScore;
    this.lives = state.lives;
    this.timeLeft = state.timeLeft;
    this.difficultyStage = state.difficultyStage;
    this.muted = state.muted;
  }

  public render(renderer: Renderer): void {
    renderer.fillText(`Score: ${this.score}`, 16, 32, { color: "#ffffff", font: "20px Arial" });
    renderer.fillText(`Best: ${this.highScore}`, 16, 56, { color: "#ffd93d", font: "16px Arial" });
    renderer.fillText(`Time: ${this.timeLeft}`, GAME_WIDTH / 2, 32, {
      color: "#ffd93d",
      font: "20px Arial",
      align: "center",
    });
    renderer.fillText(this.livesDisplay(), GAME_WIDTH - 16, 32, {
      color: "#ff6b6b",
      font: "20px Arial",
      align: "right",
    });
    renderer.fillText(`${this.difficultyStage}`, GAME_WIDTH - 16, 56, {
      color: "#88d0ff",
      font: "16px Arial",
      align: "right",
    });
    if (this.muted) {
      renderer.fillText("🔇 Muted", GAME_WIDTH / 2, 56, {
        color: "#888888",
        font: "14px Arial",
        align: "center",
      });
    }
  }

  private score: number = 0;
  private highScore: number = 0;
  private lives: number = MAX_LIVES;
  private timeLeft: number = 0;
  private difficultyStage: string = "";
  private muted: boolean = false;

  private livesDisplay(): string {
    return "Lives: " + "♥".repeat(Math.max(0, this.lives));
  }
}

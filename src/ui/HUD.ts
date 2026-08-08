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
  public render(renderer: Renderer, state: HUDState): void {
    renderer.fillText(`Score: ${state.score}`, 16, 32, { color: "#ffffff", font: "20px Arial" });
    renderer.fillText(`Best: ${state.highScore}`, 16, 56, { color: "#ffd93d", font: "16px Arial" });
    renderer.fillText(`Time: ${state.timeLeft}`, GAME_WIDTH / 2, 32, {
      color: "#ffd93d",
      font: "20px Arial",
      align: "center",
    });
    renderer.fillText(this.livesDisplay(state.lives), GAME_WIDTH - 16, 32, {
      color: "#ff6b6b",
      font: "20px Arial",
      align: "right",
    });
    renderer.fillText(state.difficultyStage, GAME_WIDTH - 16, 56, {
      color: "#88d0ff",
      font: "16px Arial",
      align: "right",
    });
    if (state.muted) {
      renderer.fillText("🔇 Muted", GAME_WIDTH / 2, 56, {
        color: "#888888",
        font: "14px Arial",
        align: "center",
      });
    }
  }

  private livesDisplay(lives: number): string {
    return "Lives: " + "♥".repeat(Math.max(0, Math.min(lives, MAX_LIVES)));
  }
}

import { Renderer } from "../engine/Renderer";
import type { GameResult } from "../managers/ScoreManager";
import { GAME_WIDTH, GAME_HEIGHT } from "../config/GameConfig";

export interface GameOverOverlayState {
  result: GameResult | null;
}

export class GameOverOverlay {
  public render(renderer: Renderer, state: GameOverOverlayState): void {
    const result = state.result;

    renderer.fillText("TIME'S UP!", GAME_WIDTH / 2, GAME_HEIGHT / 2 - 120, {
      color: "#ff6b6b",
      font: "48px Arial",
      align: "center",
    });

    if (!result) {
      renderer.fillText("Press ENTER to play again", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 30, {
        color: "#ffd93d",
        font: "24px Arial",
        align: "center",
      });
      return;
    }

    renderer.fillText(`Score: ${result.score}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40, {
      color: "#ffffff",
      font: "28px Arial",
      align: "center",
    });

    if (result.isNewHighScore) {
      renderer.fillText("★ NEW HIGH SCORE! ★", GAME_WIDTH / 2, GAME_HEIGHT / 2, {
        color: "#ffd93d",
        font: "22px Arial",
        align: "center",
      });
    } else {
      renderer.fillText(`High Score: ${result.highScore}`, GAME_WIDTH / 2, GAME_HEIGHT / 2, {
        color: "#ffd93d",
        font: "20px Arial",
        align: "center",
      });
    }

    renderer.fillText(
      `Best Time: ${result.bestTime.toFixed(1)}s`,
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2 + 40,
      {
        color: "#88d0ff",
        font: "20px Arial",
        align: "center",
      },
    );

    if (result.isNewBestTime) {
      renderer.fillText("★ NEW BEST TIME! ★", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 70, {
        color: "#88d0ff",
        font: "18px Arial",
        align: "center",
      });
    }

    renderer.fillText("Press ENTER to play again", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 120, {
      color: "#ffd93d",
      font: "24px Arial",
      align: "center",
    });
  }
}

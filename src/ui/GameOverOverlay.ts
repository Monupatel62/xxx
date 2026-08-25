import { Renderer } from "../engine/Renderer";
import type { GameResult } from "../managers/ScoreManager";
import { GAME_WIDTH, GAME_HEIGHT } from "../config/GameConfig";

export interface GameOverOverlayState {
  result: GameResult | null;
  cause: "time" | "lives";
}

export class GameOverOverlay {
  public render(renderer: Renderer, state: GameOverOverlayState): void {
    const result = state.result;
    const heading = state.cause === "lives" ? "OUT OF LIVES!" : "TIME'S UP!";
    const headingColor = state.cause === "lives" ? "#ff6b6b" : "#ffd93d";

    renderer.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT, "rgba(0, 0, 0, 0.55)");

    renderer.fillText(heading, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 140, {
      color: headingColor,
      font: "bold 44px Arial",
      align: "center",
    });

    if (!result) {
      renderer.fillText(
        "Press ENTER / SPACE or click to play again",
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2 + 30,
        {
          color: "#ffd93d",
          font: "24px Arial",
          align: "center",
        },
      );
      return;
    }

    renderer.fillText(`Score: ${result.score}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60, {
      color: "#ffffff",
      font: "bold 32px Arial",
      align: "center",
    });

    if (result.isNewHighScore) {
      renderer.fillText("★ NEW HIGH SCORE! ★", GAME_WIDTH / 2, GAME_HEIGHT / 2 - 25, {
        color: "#ffd93d",
        font: "bold 22px Arial",
        align: "center",
      });
    } else {
      renderer.fillText(`High Score: ${result.highScore}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 25, {
        color: "#ffd93d",
        font: "18px Arial",
        align: "center",
      });
    }

    const total = result.coinsCaught + result.coinsMissed;
    const accuracy = total > 0 ? Math.round((result.coinsCaught / total) * 100) : 100;

    renderer.fillText(
      `Caught: ${result.coinsCaught}  |  Missed: ${result.coinsMissed}  |  Accuracy: ${accuracy}%`,
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2 + 15,
      { color: "#aaaaaa", font: "16px Arial", align: "center" },
    );

    renderer.fillText(`Best Combo: x${result.maxCombo}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 45, {
      color: "#f97316",
      font: "18px Arial",
      align: "center",
    });

    renderer.fillText(
      `Survived: ${result.timeSurvived.toFixed(1)}s`,
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2 + 75,
      {
        color: "#88d0ff",
        font: "18px Arial",
        align: "center",
      },
    );

    if (result.isNewBestTime) {
      renderer.fillText(
        `★ NEW BEST TIME! (Record: ${result.bestTime.toFixed(1)}s) ★`,
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2 + 105,
        {
          color: "#88d0ff",
          font: "16px Arial",
          align: "center",
        },
      );
    }

    renderer.fillText("Press ENTER / SPACE or click to play again", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 150, {
      color: "#ffd93d",
      font: "22px Arial",
      align: "center",
    });
  }
}

import { Renderer } from "../engine/Renderer";
import { GAME_WIDTH, GAME_HEIGHT } from "../config/GameConfig";

export interface PauseOverlayState {
  muted: boolean;
}

export class PauseOverlay {
  public render(renderer: Renderer, state: PauseOverlayState = { muted: false }): void {
    renderer.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT, "rgba(0, 0, 0, 0.6)");

    renderer.fillText("PAUSED", GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40, {
      color: "#ffffff",
      font: "48px Arial",
      align: "center",
    });

    renderer.fillText("Press ESC to resume", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 20, {
      color: "#ffd93d",
      font: "20px Arial",
      align: "center",
    });

    if (state.muted) {
      renderer.fillText("M (mute): 🔇 ON", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 60, {
        color: "#888888",
        font: "16px Arial",
        align: "center",
      });
    } else {
      renderer.fillText("M (mute): 🔊 ON", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 60, {
        color: "#888888",
        font: "16px Arial",
        align: "center",
      });
    }
  }
}

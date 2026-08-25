import { Renderer } from "../engine/Renderer";
import { GAME_WIDTH, MAX_LIVES, GAME_DURATION } from "../config/GameConfig";

export interface HUDState {
  score: number;
  highScore: number;
  lives: number;
  timeLeft: number;
  difficultyStage: string;
  stageProgress: number;
  combo: number;
  comboMultiplier: number;
  muted: boolean;
}

export class HUD {
  public render(renderer: Renderer, state: HUDState): void {
    const ctx = renderer.getContext();

    // Top bar background
    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
    ctx.fillRect(0, 0, GAME_WIDTH, 70);

    renderer.fillText(`Score: ${state.score}`, 16, 32, {
      color: "#ffffff",
      font: "bold 20px Arial",
    });
    renderer.fillText(`Best: ${state.highScore}`, 16, 56, { color: "#ffd93d", font: "14px Arial" });

    // Timer with progress bar — shrinks as time runs out
    const timerColor = state.timeLeft <= 10 ? "#ff6b6b" : "#ffd93d";
    renderer.fillText(`⏱ ${state.timeLeft}s`, GAME_WIDTH / 2, 28, {
      color: timerColor,
      font: "bold 22px Arial",
      align: "center",
    });

    const barWidth = 120;
    const barX = GAME_WIDTH / 2 - barWidth / 2;
    const timerProgress = Math.min(1, state.timeLeft / GAME_DURATION);
    renderer.fillRect(barX, 38, barWidth, 6, "rgba(255,255,255,0.15)");
    renderer.fillRect(barX, 38, barWidth * timerProgress, 6, timerColor);

    // Lives
    renderer.fillText(this.livesDisplay(state.lives), GAME_WIDTH - 16, 32, {
      color: "#ff6b6b",
      font: "bold 20px Arial",
      align: "right",
    });

    // Stage + progress
    renderer.fillText(state.difficultyStage, GAME_WIDTH - 16, 56, {
      color: "#88d0ff",
      font: "14px Arial",
      align: "right",
    });
    const stageBarW = 80;
    renderer.fillRect(GAME_WIDTH - 16 - stageBarW, 62, stageBarW, 4, "rgba(136,208,255,0.2)");
    renderer.fillRect(
      GAME_WIDTH - 16 - stageBarW,
      62,
      stageBarW * state.stageProgress,
      4,
      "#88d0ff",
    );

    // Combo display
    if (state.combo >= 2) {
      const comboColor = state.comboMultiplier >= 3 ? "#f97316" : "#ffd93d";
      renderer.fillText(`COMBO x${state.combo} (${state.comboMultiplier}x)`, GAME_WIDTH / 2, 58, {
        color: comboColor,
        font: "bold 16px Arial",
        align: "center",
      });
    }

    if (state.muted) {
      renderer.fillText("🔇", GAME_WIDTH / 2, 16, {
        color: "#888888",
        font: "14px Arial",
        align: "center",
      });
    }
  }

  private livesDisplay(lives: number): string {
    return "♥".repeat(Math.max(0, Math.min(lives, MAX_LIVES)));
  }
}

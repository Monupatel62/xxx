import { Renderer } from "../engine/Renderer";
import { GAME_WIDTH, GAME_HEIGHT } from "../config/GameConfig";

export interface PauseOverlayState {
  muted: boolean;
}

export class PauseOverlay {
  public render(renderer: Renderer, state: PauseOverlayState = { muted: false }): void {
    const ctx = renderer.getContext();

    // Dim
    ctx.fillStyle = "rgba(0,0,0,0.65)";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Card
    const cardW = 340; const cardH = 200;
    const cardX = GAME_WIDTH / 2 - cardW / 2;
    const cardY = GAME_HEIGHT / 2 - cardH / 2;

    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.7)";
    ctx.shadowBlur = 30;
    ctx.beginPath();
    this.roundRect(ctx, cardX, cardY, cardW, cardH, 18);
    ctx.fillStyle = "rgba(10,10,32,0.97)";
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    this.roundRect(ctx, cardX, cardY, cardW, cardH, 18);
    ctx.stroke();
    ctx.restore();

    // "PAUSED" heading
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 36px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(255,255,255,0.3)";
    ctx.shadowBlur = 10;
    ctx.fillText("⏸  PAUSED", GAME_WIDTH / 2, cardY + 55);
    ctx.shadowBlur = 0;
    ctx.restore();

    // Divider
    ctx.strokeStyle = "rgba(255,255,255,0.07)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cardX + 28, cardY + 84);
    ctx.lineTo(cardX + cardW - 28, cardY + 84);
    ctx.stroke();

    // Resume hint
    renderer.fillText("Press  ESC  or  P  to resume", GAME_WIDTH / 2, cardY + 115, {
      color: "#ffd93d",
      font: "17px Arial",
      align: "center",
    });

    // Mute status
    const muteText = state.muted ? "🔇  Sound: OFF  (M to toggle)" : "🔊  Sound: ON  (M to toggle)";
    renderer.fillText(muteText, GAME_WIDTH / 2, cardY + 150, {
      color: state.muted ? "#64748b" : "#94a3b8",
      font: "14px Arial",
      align: "center",
    });

    // Version/tip
    renderer.fillText("Coins & score paused ✓", GAME_WIDTH / 2, cardY + 178, {
      color: "rgba(255,255,255,0.18)",
      font: "12px Arial",
      align: "center",
    });
  }

  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number, r: number,
  ): void {
    const cr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + cr, y);
    ctx.lineTo(x + w - cr, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + cr);
    ctx.lineTo(x + w, y + h - cr);
    ctx.quadraticCurveTo(x + w, y + h, x + w - cr, y + h);
    ctx.lineTo(x + cr, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - cr);
    ctx.lineTo(x, y + cr);
    ctx.quadraticCurveTo(x, y, x + cr, y);
    ctx.closePath();
  }
}

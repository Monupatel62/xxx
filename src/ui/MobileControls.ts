import { Renderer } from "../engine/Renderer";
import { GAME_WIDTH, GAME_HEIGHT } from "../config/GameConfig";

/** Visible on-screen left/right buttons for mobile players. */
export class MobileControls {
  // Left button area
  public static readonly LEFT_X = 28;
  public static readonly LEFT_Y = GAME_HEIGHT - 100;
  public static readonly BTN_W = 72;
  public static readonly BTN_H = 56;

  // Right button area
  public static readonly RIGHT_X = GAME_WIDTH - 100;
  public static readonly RIGHT_Y = GAME_HEIGHT - 100;

  // Pause button top-right
  public static readonly PAUSE_X = GAME_WIDTH - 52;
  public static readonly PAUSE_Y = 80;
  public static readonly PAUSE_R = 20;

  private leftPressed: boolean = false;
  private rightPressed: boolean = false;

  /** Call with current touch coordinates to update state. */
  public update(touchActive: boolean, touchX: number, touchY: number): void {
    if (!touchActive) {
      this.leftPressed = false;
      this.rightPressed = false;
      return;
    }
    this.leftPressed = this.hitTest(
      touchX, touchY,
      MobileControls.LEFT_X, MobileControls.LEFT_Y,
      MobileControls.BTN_W, MobileControls.BTN_H,
    );
    this.rightPressed = this.hitTest(
      touchX, touchY,
      MobileControls.RIGHT_X, MobileControls.RIGHT_Y,
      MobileControls.BTN_W, MobileControls.BTN_H,
    );
  }

  public isLeftPressed(): boolean { return this.leftPressed; }
  public isRightPressed(): boolean { return this.rightPressed; }

  /** Returns true if touch is on either on-screen button (to suppress regular moveToward). */
  public isTouchOnButton(touchX: number, touchY: number): boolean {
    return (
      this.hitTest(touchX, touchY, MobileControls.LEFT_X, MobileControls.LEFT_Y, MobileControls.BTN_W, MobileControls.BTN_H) ||
      this.hitTest(touchX, touchY, MobileControls.RIGHT_X, MobileControls.RIGHT_Y, MobileControls.BTN_W, MobileControls.BTN_H)
    );
  }

  public render(renderer: Renderer): void {
    const ctx = renderer.getContext();
    this.drawDPadBtn(ctx, MobileControls.LEFT_X, MobileControls.LEFT_Y, "◀", this.leftPressed);
    this.drawDPadBtn(ctx, MobileControls.RIGHT_X, MobileControls.RIGHT_Y, "▶", this.rightPressed);
    this.drawPauseBtn(ctx);
  }

  private drawDPadBtn(
    ctx: CanvasRenderingContext2D,
    x: number, y: number,
    label: string,
    pressed: boolean,
  ): void {
    const w = MobileControls.BTN_W;
    const h = MobileControls.BTN_H;
    const r = 14;
    const alpha = pressed ? 0.85 : 0.45;

    ctx.save();
    ctx.globalAlpha = alpha;

    // Shadow
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = pressed ? 4 : 10;

    // Body
    ctx.beginPath();
    this.roundRect(ctx, x, y, w, h, r);
    const grad = ctx.createLinearGradient(x, y, x, y + h);
    if (pressed) {
      grad.addColorStop(0, "rgba(74,222,128,0.7)");
      grad.addColorStop(1, "rgba(22,163,74,0.7)");
    } else {
      grad.addColorStop(0, "rgba(30,41,59,0.85)");
      grad.addColorStop(1, "rgba(15,23,42,0.85)");
    }
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = pressed ? "rgba(74,222,128,0.9)" : "rgba(148,163,184,0.4)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    this.roundRect(ctx, x, y, w, h, r);
    ctx.stroke();

    // Arrow label
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `bold ${pressed ? 26 : 24}px Arial`;
    ctx.fillStyle = pressed ? "#fff" : "rgba(226,232,240,0.8)";
    ctx.shadowBlur = 0;
    ctx.fillText(label, x + w / 2, y + h / 2);

    ctx.restore();
  }

  private drawPauseBtn(ctx: CanvasRenderingContext2D): void {
    const r = MobileControls.PAUSE_R;
    const cx = MobileControls.PAUSE_X;
    const cy = MobileControls.PAUSE_Y;
    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(15,20,40,0.8)";
    ctx.fill();
    ctx.strokeStyle = "rgba(148,163,184,0.35)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "14px Arial";
    ctx.fillStyle = "rgba(226,232,240,0.8)";
    ctx.fillText("⏸", cx, cy + 1);
    ctx.restore();
  }

  private hitTest(
    px: number, py: number,
    rx: number, ry: number, rw: number, rh: number,
  ): boolean {
    return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
  }

  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number, r: number,
  ): void {
    const cr = Math.min(r, w / 2, h / 2);
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

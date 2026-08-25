import { Renderer } from "../engine/Renderer";
import { GAME_WIDTH, GAME_HEIGHT } from "../config/GameConfig";

interface DPadBtn {
  cx: number;   // center x
  cy: number;   // center y
  r: number;    // hit radius
  label: string;
  pressed: boolean;
}

/** 4-direction on-screen D-pad for mobile players. */
export class MobileControls {
  // D-pad center position (bottom-left area)
  private static readonly PAD_CX = 90;
  private static readonly PAD_CY = GAME_HEIGHT - 80;
  private static readonly BTN_R  = 28;   // hit radius per button
  private static readonly BTN_GAP = 36;  // center-to-center offset

  // Pause button top-right
  public static readonly PAUSE_X = GAME_WIDTH - 40;
  public static readonly PAUSE_Y = 88;
  public static readonly PAUSE_R = 22;

  private readonly buttons: Record<"left" | "right" | "up" | "down", DPadBtn>;

  constructor() {
    const cx = MobileControls.PAD_CX;
    const cy = MobileControls.PAD_CY;
    const gap = MobileControls.BTN_GAP;
    const r = MobileControls.BTN_R;

    this.buttons = {
      left:  { cx: cx - gap, cy, r, label: "◀", pressed: false },
      right: { cx: cx + gap, cy, r, label: "▶", pressed: false },
      up:    { cx, cy: cy - gap, r, label: "▲", pressed: false },
      down:  { cx, cy: cy + gap, r, label: "▼", pressed: false },
    };
  }

  /** Update pressed state from current touch. */
  public update(touchActive: boolean, touchX: number, touchY: number): void {
    for (const btn of Object.values(this.buttons)) {
      btn.pressed = touchActive && this.hitCircle(touchX, touchY, btn.cx, btn.cy, btn.r);
    }
  }

  public isLeftPressed():  boolean { return this.buttons.left.pressed;  }
  public isRightPressed(): boolean { return this.buttons.right.pressed; }
  public isUpPressed():    boolean { return this.buttons.up.pressed;    }
  public isDownPressed():  boolean { return this.buttons.down.pressed;  }

  /** True if the touch lands on any d-pad button (suppress drag-to-move). */
  public isTouchOnButton(touchX: number, touchY: number): boolean {
    for (const btn of Object.values(this.buttons)) {
      if (this.hitCircle(touchX, touchY, btn.cx, btn.cy, btn.r + 6)) return true;
    }
    return false;
  }

  public render(renderer: Renderer): void {
    const ctx = renderer.getContext();
    // D-pad background disc
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.beginPath();
    ctx.arc(
      MobileControls.PAD_CX,
      MobileControls.PAD_CY,
      MobileControls.BTN_GAP + MobileControls.BTN_R + 4,
      0, Math.PI * 2,
    );
    ctx.fillStyle = "rgba(15,23,42,0.9)";
    ctx.fill();
    ctx.restore();

    for (const btn of Object.values(this.buttons)) {
      this.drawBtn(ctx, btn);
    }
    this.drawPauseBtn(ctx);
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private drawBtn(ctx: CanvasRenderingContext2D, btn: DPadBtn): void {
    const { cx, cy, r, label, pressed } = btn;
    ctx.save();
    ctx.globalAlpha = pressed ? 0.92 : 0.52;

    // Shadow
    ctx.shadowColor = "rgba(0,0,0,0.45)";
    ctx.shadowBlur = pressed ? 4 : 8;

    // Circle body
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(cx, cy - 4, 2, cx, cy, r);
    if (pressed) {
      grad.addColorStop(0, "rgba(74,222,128,0.95)");
      grad.addColorStop(1, "rgba(22,163,74,0.85)");
    } else {
      grad.addColorStop(0, "rgba(51,65,85,0.9)");
      grad.addColorStop(1, "rgba(15,23,42,0.9)");
    }
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = pressed ? "rgba(74,222,128,1)" : "rgba(148,163,184,0.45)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Arrow
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `bold ${pressed ? 18 : 16}px Arial`;
    ctx.fillStyle = pressed ? "#fff" : "rgba(203,213,225,0.9)";
    ctx.shadowBlur = 0;
    ctx.fillText(label, cx, cy + 1);

    ctx.restore();
  }

  private drawPauseBtn(ctx: CanvasRenderingContext2D): void {
    const r = MobileControls.PAUSE_R;
    const cx = MobileControls.PAUSE_X;
    const cy = MobileControls.PAUSE_Y;
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(15,20,40,0.85)";
    ctx.fill();
    ctx.strokeStyle = "rgba(148,163,184,0.3)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "15px Arial";
    ctx.fillStyle = "rgba(203,213,225,0.85)";
    ctx.fillText("⏸", cx, cy + 1);
    ctx.restore();
  }

  private hitCircle(px: number, py: number, cx: number, cy: number, r: number): boolean {
    const dx = px - cx; const dy = py - cy;
    return dx * dx + dy * dy <= r * r;
  }
}

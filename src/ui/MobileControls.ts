import { Renderer } from "../engine/Renderer";
import { GAME_WIDTH, GAME_HEIGHT } from "../config/GameConfig";

interface DPadBtn {
  cx: number;
  cy: number;
  r: number;
  label: string;
  pressed: boolean;
}

/**
 * On-screen D-pad for mobile.
 * Buttons are intentionally large (40px radius) so they're easy to hit
 * on small phone screens where the canvas is scaled down.
 */
export class MobileControls {
  // D-pad center — bottom-left, well clear of HUD
  private static readonly PAD_CX  = 90;
  private static readonly PAD_CY  = GAME_HEIGHT - 75;
  private static readonly BTN_R   = 26;   // hit + visual radius — finger-friendly but not oversized
  private static readonly BTN_GAP = 34;   // center-to-center distance

  // Pause button — top-right, below HUD bar
  public static readonly PAUSE_X = GAME_WIDTH - 44;
  public static readonly PAUSE_Y = 96;
  public static readonly PAUSE_R = 22;

  private readonly buttons: Record<"left" | "right" | "up" | "down", DPadBtn>;
  private pausePressed: boolean = false;

  constructor() {
    const cx  = MobileControls.PAD_CX;
    const cy  = MobileControls.PAD_CY;
    const gap = MobileControls.BTN_GAP;
    const r   = MobileControls.BTN_R;

    this.buttons = {
      left:  { cx: cx - gap, cy,       r, label: "◀", pressed: false },
      right: { cx: cx + gap, cy,       r, label: "▶", pressed: false },
      up:    { cx,           cy: cy - gap, r, label: "▲", pressed: false },
      down:  { cx,           cy: cy + gap, r, label: "▼", pressed: false },
    };
  }

  /** Update pressed state from the current touch position. */
  public update(touchActive: boolean, touchX: number, touchY: number): void {
    for (const btn of Object.values(this.buttons)) {
      btn.pressed = touchActive && this.hitCircle(touchX, touchY, btn.cx, btn.cy, btn.r);
    }
    this.pausePressed = touchActive && this.hitCircle(
      touchX, touchY,
      MobileControls.PAUSE_X,
      MobileControls.PAUSE_Y,
      MobileControls.PAUSE_R,
    );
  }

  public isLeftPressed():  boolean { return this.buttons.left.pressed;  }
  public isRightPressed(): boolean { return this.buttons.right.pressed; }
  public isUpPressed():    boolean { return this.buttons.up.pressed;    }
  public isDownPressed():  boolean { return this.buttons.down.pressed;  }
  public isPausePressed(): boolean { return this.pausePressed;          }

  /**
   * Returns true if the touch is anywhere on the D-pad zone.
   * Used by PlayScene to suppress drag-to-move when the player is
   * using the D-pad buttons.
   */
  public isTouchOnButton(touchX: number, touchY: number): boolean {
    for (const btn of Object.values(this.buttons)) {
      if (this.hitCircle(touchX, touchY, btn.cx, btn.cy, btn.r + 8)) return true;
    }
    // Also block drag if touching the pause button
    if (this.hitCircle(touchX, touchY, MobileControls.PAUSE_X, MobileControls.PAUSE_Y, MobileControls.PAUSE_R + 8)) {
      return true;
    }
    return false;
  }

  public render(renderer: Renderer): void {
    const ctx = renderer.getContext();

    // ── D-pad background disc ────────────────────────────────
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.beginPath();
    ctx.arc(
      MobileControls.PAD_CX,
      MobileControls.PAD_CY,
      MobileControls.BTN_GAP + MobileControls.BTN_R + 6,
      0, Math.PI * 2,
    );
    ctx.fillStyle = "rgba(10,15,35,0.85)";
    ctx.fill();
    ctx.restore();

    // ── D-pad buttons ────────────────────────────────────────
    for (const btn of Object.values(this.buttons)) {
      this.drawBtn(ctx, btn);
    }

    // ── Pause button ─────────────────────────────────────────
    this.drawPauseBtn(ctx);
  }

  // ─── Private helpers ──────────────────────────────────────────────────────

  private drawBtn(ctx: CanvasRenderingContext2D, btn: DPadBtn): void {
    const { cx, cy, r, label, pressed } = btn;
    ctx.save();
    ctx.globalAlpha = pressed ? 0.95 : 0.60;

    ctx.shadowColor = pressed ? "rgba(74,222,128,0.7)" : "rgba(0,0,0,0.5)";
    ctx.shadowBlur  = pressed ? 12 : 10;

    // Circle body
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(cx, cy - 6, 2, cx, cy, r);
    if (pressed) {
      grad.addColorStop(0, "rgba(74,222,128,0.98)");
      grad.addColorStop(1, "rgba(22,163,74,0.90)");
    } else {
      grad.addColorStop(0, "rgba(51,65,85,0.95)");
      grad.addColorStop(1, "rgba(15,23,42,0.95)");
    }
    ctx.fillStyle = grad;
    ctx.fill();

    // Border
    ctx.shadowBlur   = 0;
    ctx.strokeStyle  = pressed ? "rgba(74,222,128,1)" : "rgba(148,163,184,0.5)";
    ctx.lineWidth    = pressed ? 2.5 : 1.5;
    ctx.stroke();

    // Arrow label
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    ctx.font         = `bold ${pressed ? 15 : 14}px Arial`;
    ctx.fillStyle    = pressed ? "#fff" : "rgba(203,213,225,0.9)";
    ctx.shadowBlur   = 0;
    ctx.fillText(label, cx, cy + 1);

    ctx.restore();
  }

  private drawPauseBtn(ctx: CanvasRenderingContext2D): void {
    const r  = MobileControls.PAUSE_R;
    const cx = MobileControls.PAUSE_X;
    const cy = MobileControls.PAUSE_Y;
    ctx.save();
    ctx.globalAlpha = 0.62;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle   = "rgba(15,20,40,0.88)";
    ctx.fill();
    ctx.strokeStyle = "rgba(148,163,184,0.35)";
    ctx.lineWidth   = 1.5;
    ctx.stroke();
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    ctx.font         = "18px Arial";
    ctx.fillStyle    = "rgba(203,213,225,0.90)";
    ctx.fillText("⏸", cx, cy + 1);
    ctx.restore();
  }

  private hitCircle(px: number, py: number, cx: number, cy: number, r: number): boolean {
    const dx = px - cx;
    const dy = py - cy;
    return dx * dx + dy * dy <= r * r;
  }
}

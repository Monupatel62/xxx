import { Entity } from "./Entity";
import { Renderer } from "../engine/Renderer";
import { Rect } from "../math/Rect";
import { MathUtils } from "../math/MathUtils";
import {
  GAME_HEIGHT,
  PLAYER_MIN_Y_RATIO,
  PLAYER_MAX_Y_OFFSET,
} from "../config/GameConfig";

export class Player extends Entity {
  public rect: Rect;
  public speed: number;
  private velocityX: number = 0;
  private velocityY: number = 0;
  private tilt: number = 0;
  private glowPulse: number = 0;
  private catchFlash: number = 0;   // short highlight when a coin lands

  // Y movement bounds (computed once, stays fixed)
  private readonly minY: number;
  private readonly maxY: number;

  constructor(x: number, y: number, width: number, height: number, speed: number) {
    super();
    this.rect = new Rect(x, y, width, height);
    this.speed = speed;
    this.minY = GAME_HEIGHT * PLAYER_MIN_Y_RATIO;
    this.maxY = GAME_HEIGHT - PLAYER_MAX_Y_OFFSET - height;
  }

  public update(deltaTime: number): void {
    this.rect.x += this.velocityX * deltaTime;
    this.rect.y += this.velocityY * deltaTime;

    // Horizontal tilt follows velocity
    const targetTilt = MathUtils.clamp(this.velocityX / this.speed, -1, 1) * 0.12;
    this.tilt += (targetTilt - this.tilt) * Math.min(1, deltaTime * 14);

    this.glowPulse += deltaTime * 3.5;
    if (this.catchFlash > 0) this.catchFlash -= deltaTime * 4;
  }

  public render(renderer: Renderer): void {
    const ctx = renderer.getContext();
    const { x, y, width, height } = this.rect;
    const cx = x + width / 2;
    const cy = y + height / 2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.tilt);
    ctx.translate(-cx, -cy);

    this.drawBasket(ctx, x, y, width, height);

    ctx.restore();
  }

  // ─── Movement API ──────────────────────────────────────────────────────────

  public moveLeft(): void  { this.velocityX = -this.speed; }
  public moveRight(): void { this.velocityX =  this.speed; }
  public moveUp(): void    { this.velocityY = -this.speed; }
  public moveDown(): void  { this.velocityY =  this.speed; }

  public stopX(): void { this.velocityX = 0; }
  public stopY(): void { this.velocityY = 0; }

  /** @deprecated Use stopX/stopY individually */
  public stop(): void { this.velocityX = 0; this.velocityY = 0; }

  public moveToward(targetX: number): void {
    const delta = targetX - this.rect.centerX;
    if (delta > 1)       this.velocityX =  this.speed;
    else if (delta < -1) this.velocityX = -this.speed;
    else                 this.velocityX =  0;
  }

  /** Flash the basket briefly (call when a coin is caught). */
  public triggerCatchFlash(): void {
    this.catchFlash = 1;
  }

  public clampToScreen(screenWidth: number): void {
    this.rect.x = MathUtils.clamp(this.rect.x, 0, screenWidth - this.rect.width);
    this.rect.y = MathUtils.clamp(this.rect.y, this.minY, this.maxY);
  }

  public getVelocityX(): number { return this.velocityX; }
  public getVelocityY(): number { return this.velocityY; }

  public reset(x: number): void {
    this.rect.x = x;
    this.rect.y = this.maxY;   // start at bottom
    this.velocityX = 0;
    this.velocityY = 0;
    this.tilt = 0;
    this.glowPulse = 0;
    this.catchFlash = 0;
  }

  // ─── Basket drawing ────────────────────────────────────────────────────────

  private drawBasket(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number,
  ): void {
    const flash = Math.max(0, this.catchFlash);
    const glow = 0.5 + 0.5 * Math.sin(this.glowPulse);

    // --- outer glow halo ---
    ctx.save();
    ctx.shadowColor = flash > 0 ? `rgba(255,255,100,${flash * 0.9})` : `rgba(74,222,128,${0.35 + 0.2 * glow})`;
    ctx.shadowBlur = flash > 0 ? 28 : 14 + 6 * glow;

    // ── basket body (trapezoid: wider top, slightly narrower bottom) ─────────
    const topW = w;
    const botW = w * 0.78;
    const topX = x;
    const botX = x + (w - botW) / 2;

    // Body fill — woven dark material
    const bodyGrad = ctx.createLinearGradient(x, y, x, y + h);
    if (flash > 0) {
      bodyGrad.addColorStop(0, `rgba(200,255,180,${0.5 + flash * 0.5})`);
      bodyGrad.addColorStop(1, `rgba(74,222,128,${0.6 + flash * 0.4})`);
    } else {
      bodyGrad.addColorStop(0, "#22c55e");
      bodyGrad.addColorStop(0.5, "#16a34a");
      bodyGrad.addColorStop(1, "#14532d");
    }
    ctx.beginPath();
    ctx.moveTo(topX, y);
    ctx.lineTo(topX + topW, y);
    ctx.lineTo(botX + botW, y + h);
    ctx.lineTo(botX, y + h);
    ctx.closePath();
    ctx.fillStyle = bodyGrad;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.restore();

    // ── weave lines (horizontal) ─────────────────────────────────────────────
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.strokeStyle = "#052e16";
    ctx.lineWidth = 1;
    const rows = 3;
    for (let i = 1; i <= rows; i++) {
      const ratio = i / (rows + 1);
      const lx = topX + (botX - topX) * ratio;
      const lw = topW + (botW - topW) * ratio;
      const ly = y + h * ratio;
      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.lineTo(lx + lw, ly);
      ctx.stroke();
    }
    // vertical weave lines
    const cols = 5;
    for (let i = 1; i < cols; i++) {
      const ratio = i / cols;
      const tx = topX + topW * ratio;
      const bx = botX + botW * ratio;
      ctx.beginPath();
      ctx.moveTo(tx, y);
      ctx.lineTo(bx, y + h);
      ctx.stroke();
    }
    ctx.restore();

    // ── rim (top thick bar) ──────────────────────────────────────────────────
    const rimH = 7;
    const rimGrad = ctx.createLinearGradient(x, y - rimH, x, y + rimH);
    rimGrad.addColorStop(0, "#a3e635");
    rimGrad.addColorStop(0.4, "#4ade80");
    rimGrad.addColorStop(1, "#15803d");
    ctx.save();
    ctx.beginPath();
    ctx.rect(topX - 2, y - rimH, topW + 4, rimH * 2);
    ctx.fillStyle = rimGrad;
    ctx.fill();
    // rim top highlight
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.fillRect(topX, y - rimH, topW, 2);
    // rim shadow under
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(topX, y + rimH - 2, topW, 3);
    ctx.restore();

    // ── left handle ─────────────────────────────────────────────────────────
    ctx.save();
    ctx.strokeStyle = "#4ade80";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.shadowColor = "rgba(74,222,128,0.4)";
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(topX + 8, y - rimH);
    ctx.bezierCurveTo(topX + 4, y - rimH - 18, topX - 10, y - rimH - 18, topX - 8, y - rimH);
    ctx.stroke();
    // right handle
    ctx.beginPath();
    ctx.moveTo(topX + topW - 8, y - rimH);
    ctx.bezierCurveTo(topX + topW - 4, y - rimH - 18, topX + topW + 10, y - rimH - 18, topX + topW + 8, y - rimH);
    ctx.stroke();
    ctx.restore();

    // ── bottom shadow ────────────────────────────────────────────────────────
    ctx.save();
    ctx.globalAlpha = 0.18 + 0.08 * glow;
    const shadowGrad = ctx.createRadialGradient(
      x + w / 2, y + h + 10, 0,
      x + w / 2, y + h + 10, w * 0.5,
    );
    shadowGrad.addColorStop(0, "rgba(74,222,128,0.5)");
    shadowGrad.addColorStop(1, "rgba(74,222,128,0)");
    ctx.fillStyle = shadowGrad;
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h + 6, w * 0.42, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

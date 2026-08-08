export interface TextOptions {
  color?: string;
  font?: string;
  align?: CanvasTextAlign;
  baseline?: CanvasTextBaseline;
}

export class Renderer {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Canvas 2D context is not supported in this browser.");
    }
    this.ctx = context;
    this.width = canvas.width;
    this.height = canvas.height;
  }

  public getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }

  public resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
  }

  public clear(fillStyle: string = "#1a1a2e"): void {
    this.ctx.fillStyle = fillStyle;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  public fillRect(x: number, y: number, width: number, height: number, color: string): void {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);
  }

  public strokeRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    lineWidth: number = 2,
  ): void {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeRect(x, y, width, height);
  }

  public fillCircle(cx: number, cy: number, radius: number, color: string): void {
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  public strokeCircle(
    cx: number,
    cy: number,
    radius: number,
    color: string,
    lineWidth: number = 2,
  ): void {
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.stroke();
  }

  public line(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string,
    lineWidth: number = 2,
  ): void {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.stroke();
  }

  public fillText(text: string, x: number, y: number, options: TextOptions = {}): void {
    this.ctx.font = options.font ?? "16px Arial";
    this.ctx.fillStyle = options.color ?? "#ffffff";
    this.ctx.textAlign = options.align ?? "left";
    this.ctx.textBaseline = options.baseline ?? "alphabetic";
    this.ctx.fillText(text, x, y);
  }
}

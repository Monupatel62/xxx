export class Camera {
  public x: number = 0;
  public y: number = 0;
  public zoom: number = 1;

  public apply(context: CanvasRenderingContext2D): void {
    context.save();
    context.translate(this.x, this.y);
    context.scale(this.zoom, this.zoom);
  }

  public reset(context: CanvasRenderingContext2D): void {
    context.restore();
  }

  public moveBy(dx: number, dy: number): void {
    this.x += dx;
    this.y += dy;
  }

  public setZoom(zoom: number): void {
    this.zoom = zoom;
  }
}

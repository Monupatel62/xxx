export class Input {
  private readonly keys: Set<string> = new Set();
  private readonly pressedKeys: Set<string> = new Set();
  private mouseX: number = 0;
  private mouseY: number = 0;
  private mouseDown: boolean = false;
  private mousePressed: boolean = false;
  private touchX: number = 0;
  private touchY: number = 0;
  private touchActive: boolean = false;
  private touchPressed: boolean = false;
  private touchStartX: number = 0;
  private touchStartY: number = 0;
  private readonly target: HTMLElement;

  constructor(target: HTMLElement) {
    this.target = target;

    // ── Keyboard ──────────────────────────────────────────────
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("blur", this.onWindowBlur);

    // ── Mouse ─────────────────────────────────────────────────
    target.addEventListener("mousemove", this.onMouseMove);
    target.addEventListener("mousedown", this.onMouseDown);
    window.addEventListener("mouseup", this.onMouseUp);

    // ── Touch — registered on WINDOW with capture:true ────────
    // Using window (not just canvas) + capture phase ensures our
    // handler fires BEFORE any ad-network overlay that sits on top
    // of the canvas and might call stopPropagation / preventDefault.
    // passive:false lets us call preventDefault() to stop scroll.
    window.addEventListener("touchstart", this.onTouchStart, { passive: false, capture: true });
    window.addEventListener("touchmove",  this.onTouchMove,  { passive: false, capture: true });
    window.addEventListener("touchend",   this.onTouchEnd,   { passive: false, capture: true });
    window.addEventListener("touchcancel",this.onTouchCancel,{ passive: false, capture: true });
  }

  // ── Public API ────────────────────────────────────────────────────────────

  public isKeyDown(key: string): boolean    { return this.keys.has(key); }
  public isKeyPressed(key: string): boolean { return this.pressedKeys.has(key); }
  public isMouseDown(): boolean             { return this.mouseDown; }
  public isMousePressed(): boolean          { return this.mousePressed; }
  public getMouseX(): number                { return this.mouseX; }
  public getMouseY(): number                { return this.mouseY; }
  public getTouchX(): number                { return this.touchX; }
  public getTouchY(): number                { return this.touchY; }
  public getTouchStartX(): number           { return this.touchStartX; }
  public getTouchStartY(): number           { return this.touchStartY; }
  public isTouchActive(): boolean           { return this.touchActive; }

  /** True for exactly one frame after touchend (tap detection). */
  public isTouchPressed(): boolean          { return this.touchPressed; }

  public endFrame(): void {
    this.pressedKeys.clear();
    this.mousePressed = false;
    this.touchPressed = false;
  }

  public dispose(): void {
    window.removeEventListener("keydown",      this.onKeyDown);
    window.removeEventListener("keyup",        this.onKeyUp);
    window.removeEventListener("blur",         this.onWindowBlur);
    this.target.removeEventListener("mousemove", this.onMouseMove);
    this.target.removeEventListener("mousedown", this.onMouseDown);
    window.removeEventListener("mouseup",      this.onMouseUp);
    window.removeEventListener("touchstart",   this.onTouchStart, { capture: true } as EventListenerOptions);
    window.removeEventListener("touchmove",    this.onTouchMove,  { capture: true } as EventListenerOptions);
    window.removeEventListener("touchend",     this.onTouchEnd,   { capture: true } as EventListenerOptions);
    window.removeEventListener("touchcancel",  this.onTouchCancel,{ capture: true } as EventListenerOptions);
  }

  // ── Private handlers ──────────────────────────────────────────────────────

  private onKeyDown = (event: KeyboardEvent): void => {
    const key = event.key.toLowerCase();
    if (!this.keys.has(key)) this.pressedKeys.add(key);
    this.keys.add(key);
  };

  private onKeyUp = (event: KeyboardEvent): void => {
    this.keys.delete(event.key.toLowerCase());
  };

  private onWindowBlur = (): void => {
    this.keys.clear();
    this.pressedKeys.clear();
    this.mouseDown  = false;
    this.touchActive = false;
  };

  private onMouseMove = (event: MouseEvent): void => {
    const rect   = this.target.getBoundingClientRect();
    const scaleX = (this.target as HTMLCanvasElement).width  / rect.width;
    const scaleY = (this.target as HTMLCanvasElement).height / rect.height;
    this.mouseX  = (event.clientX - rect.left) * scaleX;
    this.mouseY  = (event.clientY - rect.top)  * scaleY;
  };

  private onMouseDown = (event: MouseEvent): void => {
    event.preventDefault();
    if (event.button === 0) {
      if (!this.mouseDown) this.mousePressed = true;
      this.mouseDown = true;
    }
  };

  private onMouseUp = (event: MouseEvent): void => {
    if (event.button === 0) this.mouseDown = false;
  };

  private onTouchStart = (event: TouchEvent): void => {
    // Only handle touches that start on or inside the canvas.
    // This prevents accidental triggers from UI chrome outside the game.
    const touch = event.touches[0];
    if (!touch) return;

    const rect = this.target.getBoundingClientRect();
    const cx = touch.clientX;
    const cy = touch.clientY;

    // If touch is completely outside the canvas rect, ignore it
    // (lets ad overlays outside the canvas still receive their touches)
    if (cx < rect.left || cx > rect.right || cy < rect.top || cy > rect.bottom) {
      return;
    }

    // Touch is on canvas — prevent scroll/zoom and record coordinates
    event.preventDefault();

    const scaleX = (this.target as HTMLCanvasElement).width  / rect.width;
    const scaleY = (this.target as HTMLCanvasElement).height / rect.height;
    this.touchX      = (cx - rect.left) * scaleX;
    this.touchY      = (cy - rect.top)  * scaleY;
    this.touchStartX = this.touchX;
    this.touchStartY = this.touchY;
    this.touchActive = true;
  };

  private onTouchMove = (event: TouchEvent): void => {
    if (!this.touchActive) return;
    const touch = event.touches[0];
    if (!touch) return;

    event.preventDefault();

    const rect   = this.target.getBoundingClientRect();
    const scaleX = (this.target as HTMLCanvasElement).width  / rect.width;
    const scaleY = (this.target as HTMLCanvasElement).height / rect.height;
    this.touchX  = (touch.clientX - rect.left) * scaleX;
    this.touchY  = (touch.clientY - rect.top)  * scaleY;
  };

  private onTouchEnd = (event: TouchEvent): void => {
    if (!this.touchActive) return;
    event.preventDefault();
    this.touchPressed = true;
    this.touchActive  = false;
    // Keep touchX/Y at last known position for one frame (tap detection)
  };

  private onTouchCancel = (_event: TouchEvent): void => {
    this.touchActive  = false;
    this.touchPressed = false;
  };
}

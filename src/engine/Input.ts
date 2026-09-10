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
  private touchPressed: boolean = false;   // true for exactly one frame after tap
  private touchStartX: number = 0;
  private touchStartY: number = 0;
  private readonly target: HTMLElement;

  constructor(target: HTMLElement) {
    this.target = target;
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("blur", this.onWindowBlur);
    target.addEventListener("mousemove", this.onMouseMove);
    target.addEventListener("mousedown", this.onMouseDown);
    window.addEventListener("mouseup", this.onMouseUp);
    target.addEventListener("touchstart", this.onTouchStart, { passive: false });
    target.addEventListener("touchmove", this.onTouchMove, { passive: false });
    window.addEventListener("touchend", this.onTouchEnd, { passive: false });
  }

  public isKeyDown(key: string): boolean {
    return this.keys.has(key);
  }

  public isKeyPressed(key: string): boolean {
    return this.pressedKeys.has(key);
  }

  public isMouseDown(): boolean {
    return this.mouseDown;
  }

  public isMousePressed(): boolean {
    return this.mousePressed;
  }

  public getMouseX(): number {
    return this.mouseX;
  }

  public getMouseY(): number {
    return this.mouseY;
  }

  public getTouchX(): number {
    return this.touchX;
  }

  public getTouchY(): number {
    return this.touchY;
  }

  public getTouchStartX(): number {
    return this.touchStartX;
  }

  public getTouchStartY(): number {
    return this.touchStartY;
  }

  public isTouchActive(): boolean {
    return this.touchActive;
  }

  /** True for exactly one frame when a touch tap is released. */
  public isTouchPressed(): boolean {
    return this.touchPressed;
  }

  public endFrame(): void {
    this.pressedKeys.clear();
    this.mousePressed = false;
    this.touchPressed = false;
  }

  public dispose(): void {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("blur", this.onWindowBlur);
    this.target.removeEventListener("mousemove", this.onMouseMove);
    this.target.removeEventListener("mousedown", this.onMouseDown);
    window.removeEventListener("mouseup", this.onMouseUp);
    this.target.removeEventListener("touchstart", this.onTouchStart);
    this.target.removeEventListener("touchmove", this.onTouchMove);
    window.removeEventListener("touchend", this.onTouchEnd);
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    const key = event.key.toLowerCase();
    if (!this.keys.has(key)) {
      this.pressedKeys.add(key);
    }
    this.keys.add(key);
  };

  private onKeyUp = (event: KeyboardEvent): void => {
    this.keys.delete(event.key.toLowerCase());
  };

  private onWindowBlur = (): void => {
    this.keys.clear();
    this.pressedKeys.clear();
    this.mouseDown = false;
    this.touchActive = false;
  };

  private onMouseMove = (event: MouseEvent): void => {
    const rect = this.target.getBoundingClientRect();
    const scaleX = (this.target as HTMLCanvasElement).width / rect.width;
    const scaleY = (this.target as HTMLCanvasElement).height / rect.height;
    this.mouseX = (event.clientX - rect.left) * scaleX;
    this.mouseY = (event.clientY - rect.top) * scaleY;
  };

  private onMouseDown = (event: MouseEvent): void => {
    event.preventDefault();
    if (event.button === 0) {
      if (!this.mouseDown) {
        this.mousePressed = true;
      }
      this.mouseDown = true;
    }
  };

  private onMouseUp = (event: MouseEvent): void => {
    if (event.button === 0) {
      this.mouseDown = false;
    }
  };

  private onTouchStart = (event: TouchEvent): void => {
    event.preventDefault();
    const touch = event.touches[0];
    if (touch) {
      const rect = this.target.getBoundingClientRect();
      const scaleX = (this.target as HTMLCanvasElement).width / rect.width;
      const scaleY = (this.target as HTMLCanvasElement).height / rect.height;
      this.touchX = (touch.clientX - rect.left) * scaleX;
      this.touchY = (touch.clientY - rect.top) * scaleY;
      this.touchStartX = this.touchX;
      this.touchStartY = this.touchY;
      this.touchActive = true;
    }
  };

  private onTouchMove = (event: TouchEvent): void => {
    event.preventDefault();
    const touch = event.touches[0];
    if (touch) {
      const rect = this.target.getBoundingClientRect();
      const scaleX = (this.target as HTMLCanvasElement).width / rect.width;
      const scaleY = (this.target as HTMLCanvasElement).height / rect.height;
      this.touchX = (touch.clientX - rect.left) * scaleX;
      this.touchY = (touch.clientY - rect.top) * scaleY;
      this.touchActive = true;
    }
  };

  private onTouchEnd = (event: TouchEvent): void => {
    event.preventDefault();
    // Record last known position for tap detection, then clear active state
    this.touchPressed = true;
    this.touchActive = false;
    // Keep touchX/Y at last position so scenes can read tap location
    // They are cleared next frame via endFrame → touchPressed = false
  };
}

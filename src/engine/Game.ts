import { GameLoop } from "./GameLoop";
import { Renderer } from "./Renderer";
import { Input } from "./Input";
import { SceneManager } from "./SceneManager";
import { Scene } from "./Scene";
import { DebugOverlay } from "../debug/DebugOverlay";
import { EventBus } from "./EventBus";
import { GAME_WIDTH, GAME_HEIGHT, FIXED_DELTA_TIME } from "../config/GameConfig";
import { KEY_DEBUG } from "../config/InputConfig";

export class Game {
  private readonly renderer: Renderer;
  private readonly input: Input;
  private readonly sceneManager: SceneManager;
  private readonly gameLoop: GameLoop;
  private readonly eventBus: EventBus;
  private readonly debugOverlay: DebugOverlay;
  private readonly canvas: HTMLCanvasElement;
  private debugMode: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;

    this.renderer = new Renderer(canvas);
    this.input = new Input(canvas);
    this.eventBus = new EventBus();
    this.sceneManager = new SceneManager();
    this.debugOverlay = new DebugOverlay();
    this.gameLoop = new GameLoop(this.update, this.render, FIXED_DELTA_TIME);

    window.addEventListener("resize", this.handleResize);
    window.addEventListener("keydown", this.handleDebugKey);
  }

  public registerScene(name: string, scene: Scene): void {
    this.sceneManager.add(name, scene);
  }

  public startScene(name: string): void {
    this.sceneManager.switchTo(name);
  }

  public getEventBus(): EventBus {
    return this.eventBus;
  }

  public getRenderer(): Renderer {
    return this.renderer;
  }

  public start(): void {
    this.gameLoop.start();
  }

  public stop(): void {
    this.gameLoop.stop();
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("keydown", this.handleDebugKey);
    this.input.dispose();
  }

  public isDebugMode(): boolean {
    return this.debugMode;
  }

  private handleResize = (): void => {
    const scale = Math.min(window.innerWidth / GAME_WIDTH, window.innerHeight / GAME_HEIGHT);
    const width = Math.round(GAME_WIDTH * scale);
    const height = Math.round(GAME_HEIGHT * scale);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
  };

  private handleDebugKey = (event: KeyboardEvent): void => {
    if (event.key.toLowerCase() === KEY_DEBUG) {
      this.debugMode = !this.debugMode;
    }
  };

  private update = (fixedDeltaTime: number): void => {
    this.sceneManager.update(fixedDeltaTime, this.input);
    this.input.endFrame();
  };

  private render = (): void => {
    this.renderer.clear();
    this.sceneManager.render(this.renderer);

    if (this.debugMode) {
      this.debugOverlay.render(this.renderer, this.gameLoop.getTime());
    }
  };
}

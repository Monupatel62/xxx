import { Scene } from "../engine/Scene";
import { Renderer } from "../engine/Renderer";
import { Input } from "../engine/Input";
import { EventBus } from "../engine/EventBus";
import { SoundManager } from "../managers/SoundManager";
import { BackgroundRenderer } from "../effects/BackgroundRenderer";
import { EVT_GAME_OVER, GameResult } from "../managers/ScoreManager";
import { KEY_ENTER, KEY_SPACE } from "../config/InputConfig";
import { GameOverOverlay } from "../ui/GameOverOverlay";
import { GameOverCause, GameOverPayload } from "./PlayScene";

export class GameOverScene extends Scene {
  private readonly overlay: GameOverOverlay;
  private readonly background: BackgroundRenderer;
  private readonly soundManager: SoundManager;
  private result: GameResult | null = null;
  private cause: GameOverCause = "time";
  private readonly unsubscribeGameOver: () => void;

  // Small delay before accepting input — prevents accidental instant-restart
  // if the touch that triggered game-over is still being processed.
  private inputDelay: number = 0;
  private static readonly INPUT_DELAY = 0.6; // seconds

  constructor(eventBus: EventBus, soundManager: SoundManager) {
    super();
    this.overlay = new GameOverOverlay();
    this.background = new BackgroundRenderer(30);
    this.soundManager = soundManager;
    this.unsubscribeGameOver = eventBus.on(EVT_GAME_OVER, (payload: GameOverPayload) => {
      this.result = payload.result;
      this.cause = payload.cause;
    });
  }

  public enter(): void {
    // Reset delay every time we enter this scene
    this.inputDelay = GameOverScene.INPUT_DELAY;
  }

  public exit(): void {
    // Nothing to clean up per-session.
  }

  public destroy(): void {
    this.unsubscribeGameOver();
  }

  public update(deltaTime: number, input: Input): void {
    this.background.update(deltaTime);

    // Wait for input delay before accepting any restart input
    if (this.inputDelay > 0) {
      this.inputDelay -= deltaTime;
      return;
    }

    // Keyboard
    if (input.isKeyPressed(KEY_ENTER) || input.isKeyPressed(KEY_SPACE)) {
      this.restart();
      return;
    }

    // Mouse click
    if (input.isMousePressed()) {
      this.restart();
      return;
    }

    // Touch tap — works on mobile play-again
    if (input.isTouchPressed()) {
      this.restart();
      return;
    }
  }

  public render(renderer: Renderer): void {
    this.background.render(renderer);
    this.overlay.render(renderer, {
      result: this.result,
      cause: this.cause,
      inputReady: this.inputDelay <= 0,
    });
  }

  private restart(): void {
    this.soundManager.play("uiClick");
    this.switchTo("play");
  }
}

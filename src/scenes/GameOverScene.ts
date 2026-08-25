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
    // No sound here — gameOver SFX is already played by PlayScene before switching.
  }

  public exit(): void {
    // Nothing to clean up per-session.
  }

  public destroy(): void {
    this.unsubscribeGameOver();
  }

  public update(deltaTime: number, input: Input): void {
    this.background.update(deltaTime);

    if (input.isKeyPressed(KEY_ENTER) || input.isKeyPressed(KEY_SPACE)) {
      this.soundManager.play("uiClick");
      this.switchTo("play");
      return;
    }

    if (input.isMousePressed()) {
      this.soundManager.play("uiClick");
      this.switchTo("play");
    }
  }

  public render(renderer: Renderer): void {
    this.background.render(renderer);
    this.overlay.render(renderer, { result: this.result, cause: this.cause });
  }
}

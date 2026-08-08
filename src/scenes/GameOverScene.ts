import { Scene } from "../engine/Scene";
import { Renderer } from "../engine/Renderer";
import { Input } from "../engine/Input";
import { EventBus } from "../engine/EventBus";
import { SoundManager } from "../managers/SoundManager";
import { EVT_GAME_OVER, GameResult } from "../managers/ScoreManager";
import { KEY_ENTER } from "../config/InputConfig";
import { GameOverOverlay } from "../ui/GameOverOverlay";
import { GameOverCause, GameOverPayload } from "./PlayScene";

export class GameOverScene extends Scene {
  private readonly overlay: GameOverOverlay;
  private readonly soundManager: SoundManager;
  private result: GameResult | null = null;
  private cause: GameOverCause = "time";
  // Unsubscribe function returned by EventBus.on — stored so we never leak the listener.
  private readonly unsubscribeGameOver: () => void;

  constructor(eventBus: EventBus, soundManager: SoundManager) {
    super();
    this.overlay = new GameOverOverlay();
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
    // Call when the game is torn down to avoid EventBus leaks.
    this.unsubscribeGameOver();
  }

  public update(_deltaTime: number, input: Input): void {
    // Keyboard: Enter to play again.
    if (input.isKeyPressed(KEY_ENTER)) {
      this.soundManager.play("uiClick");
      this.switchTo("play");
      return;
    }

    // Mouse: click to play again.
    if (input.isMousePressed()) {
      this.soundManager.play("uiClick");
      this.switchTo("play");
      return;
    }
  }

  public render(renderer: Renderer): void {
    this.overlay.render(renderer, { result: this.result, cause: this.cause });
  }
}
